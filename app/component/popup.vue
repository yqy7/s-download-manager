<template>
<div>
  <popup-header v-model="searchText"></popup-header>

  <div id="download-items" class="container">
    <ul class="item-list">
      <li v-for="item in items" :key="item.id" class="list-item">
        <download-item :value="item"></download-item>
      </li>
    </ul>
  </div>

  <popup-footer @pre-page="prePage" @next-page="nextPage"
                @delete-all="deleteAll"
                @delete-finished="deleteFinished"
                @delete-file-missing="deleteFileMissing"
                @delete-failed="deleteFailed"
                @refresh="search">
  </popup-footer>
</div>
</template>

<script lang="ts">
import DownloadItem = chrome.downloads.DownloadItem;
import downloadItemView from "./popupDownloadItem.vue";
import popupHeaderView from "./popupHeader.vue";
import popupFooterView from "./popupFooter.vue";

let startTimes: number[] = [];
export default {
  data() {
    return {
      searchText: '',
      items: <DownloadItem[]>null
    }
  },
  components: {
    'download-item': downloadItemView,
    'popup-header': popupHeaderView,
    'popup-footer': popupFooterView
  },
  created() {
    this.search();

    chrome.downloads.onErased.addListener(downloadId => {
      let index = this.items.findIndex((item: DownloadItem) => item.id === downloadId);
      if (index > -1) {
        this.items.splice(index, 1);
      }
    });
    chrome.downloads.onCreated.addListener(downloadItem => {
      this.search();
    });
  },
  watch: {
    searchText() {
      this.search();
    }
  },
  methods: {
    search() {
      chrome.downloads.search({
        orderBy:['-startTime'],
        limit: 50,
        query: [this.searchText]
      }, (items) => {
        this.items = items;
      });
      startTimes = []; // 每次搜索之后重新初始化
    },
    deleteAll() {
      chrome.downloads.erase({
        query: [this.searchText]
      }, erasedIds => {
        this.searchText = '';
        this.search();
      });
    },
    deleteFinished() {
      chrome.downloads.erase({
        state: 'complete'
      }, erasedIds => {
        this.searchText = '';
        this.search();
      });
    },
    deleteFileMissing() {
      chrome.downloads.erase({
        exists: false
      }, erasedIds => {
        this.searchText = '';
        this.search();
      });
    },
    deleteFailed() {
      chrome.downloads.erase({
        state: 'interrupted'
      }, erasedIds => {
        this.searchText = '';
        this.search();
      });
    },
    prePage() {
      if (this.items && this.items.length > 0) { // 没有元素说明没有访问过下一页
        let firstItem = this.items[0];
        let startTime = firstItem.startTime;
        let query = {
          orderBy:['-startTime'],
          limit: 50,
          query: [this.searchText],
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
            this.items = items;
          }
        });
      }
    },
    nextPage() {
      if (this.items && this.items.length > 0) {
        let lastItem = this.items[this.items.length - 1];
        let startTime = lastItem.startTime;
        startTimes.push(startTime);

        chrome.downloads.search({
          orderBy:['-startTime'],
          limit: 50,
          query: [this.searchText],
          startedBefore: startTime
        }, (items) => {
          if (items.length > 0) {
            this.items = items;
          }
        });
      }
    }
  }
}
</script>

<style scoped>
ul {
  padding: 0;
  list-style-type: none;
}
.item-list {
  padding: 50px 0;
  margin-bottom: 0;
  min-width: 400px;
  min-height: 600px;
}
.list-item {
  width: 400px;
}
</style>
