<template>
  <div>
    <div class="header">
      <popup-header v-model="searchText"></popup-header>
    </div>

    <div class="main">
      <ul>
        <li v-for="item in items" :key="item.id" class="list-item">
          <download-item :value="item"></download-item>
        </li>
      </ul>
    </div>

    <div class="footer">
      <popup-footer @pre-page="prePage" @next-page="nextPage"
                    @delete-all="deleteAll"
                    @delete-finished="deleteFinished"
                    @delete-file-missing="deleteFileMissing"
                    @delete-failed="deleteFailed">
      </popup-footer>
    </div>
  </div>
</template>

<script lang="ts">
import DownloadItem = chrome.downloads.DownloadItem;
import {defineComponent, reactive, toRefs, watch} from "vue";
import downloadItem from "./popupDownloadItem.vue";
import popupHeader from "./popupHeader.vue";
import popupFooter from "./popupFooter.vue";

import { ElMessageBox } from 'element-plus';
import 'element-plus/theme-chalk/el-message-box.css';

let startTimes: string[] = []; // TODO ???
export default defineComponent({
  components: {
    downloadItem,
    popupHeader,
    popupFooter
  },
  setup() {
    const data = reactive({
      searchText: '',
      items: <DownloadItem[]>null
    })

    function search() {
      chrome.downloads.search({
        orderBy:['-startTime'],
        limit: 50,
        query: [data.searchText]
      }, (items) => {
        data.items = items;
      });
      startTimes = []; // 每次搜索之后重新初始化
    }

    function deleteAll() {
      ElMessageBox.confirm(
          'Are you sure to delete all download records?',
          'Warning',
          {
            confirmButtonText: 'OK',
            cancelButtonText: 'Cancel',
            type: 'warning',
            customStyle: 'width: 300px;'
          }
      ).then(() => {
        chrome.downloads.erase({
          query: [data.searchText]
        }, erasedIds => {
          data.searchText = '';
          search();
        });
      })
    }

    function deleteFinished() {
      chrome.downloads.erase({
        state: 'complete'
      }, erasedIds => {
        data.searchText = '';
        search();
      });
    }

    function deleteFileMissing() {
      chrome.downloads.erase({
        exists: false
      }, erasedIds => {
        data.searchText = '';
        search();
      });
    }

    function deleteFailed() {
      chrome.downloads.erase({
        state: 'interrupted'
      }, erasedIds => {
        data.searchText = '';
        search();
      });
    }

    function prePage() {
      if (data.items && data.items.length > 0) { // 没有元素说明没有访问过下一页
        let firstItem = data.items[0];
        let startTime = firstItem.startTime;
        let query = {
          orderBy:['-startTime'],
          limit: 50,
          query: [data.searchText],
          startedAfter: startTime
        };

        if (startTimes.length > 0) {
          startTimes.pop();
          if (startTimes.length > 0) {
            query['startedBefore'] = startTimes[startTimes.length - 1];
          }
        }

        chrome.downloads.search(query, (items) => {
          if (items.length > 0) {
            data.items = items;
          }
        });
      }
    }

    function nextPage() {
      if (data.items && data.items.length > 0) {
        let lastItem = data.items[data.items.length - 1];
        let startTime = lastItem.startTime;
        startTimes.push(startTime);

        chrome.downloads.search({
          orderBy:['-startTime'],
          limit: 50,
          query: [data.searchText],
          startedBefore: startTime
        }, (items) => {
          if (items.length > 0) {
            data.items = items;
          }
        });
      }
    }

    //  初始化数据
    search();
    // 删除的监听器
    chrome.downloads.onErased.addListener(downloadId => {
      let index = data.items.findIndex((item: DownloadItem) => item.id === downloadId);
      if (index > -1) {
        data.items.splice(index, 1);
      }
    });
    // 创建的监听器
    chrome.downloads.onCreated.addListener(downloadItem => {
      search();
    });

    // 监听 searchText 的变化
    const {searchText} = toRefs(data)
    watch(searchText, (nv, ov) => {
      search()
    })

    return {
      // data
      ...toRefs(data),
      // methods
      search, deleteAll, deleteFinished, deleteFileMissing, deleteFailed, prePage, nextPage
    }
  }
})

</script>

<style scoped>
.header {
  position: fixed;
  height: 40px;
  width: 100%;
  top: 0;
  left: 0;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid lightgray;
}
.main {
  padding: 40px 0;
  margin-bottom: 0;
  min-width: 400px;
  min-height: 600px;
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 40px;
  width: 100%;
  background-color: white;
  z-index: 1;
  border-top: 1px solid lightgray;
}

.main ul {
  padding: 0;
  list-style-type: none;
  margin: 0 auto;
}

.list-item {
  width: 400px;
  padding: 0 15px 0 5px;
}
</style>
