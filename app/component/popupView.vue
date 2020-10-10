<template>
<div>
  <div id="download-items" class="container">
    <popup-header v-model="searchText"></popup-header>

    <ul class="item-list">
      <li v-for="item in items" :key="item.id">
        <download-item v-bind:value="item"></download-item>
      </li>
    </ul>

    <popup-footer @pre-page="prePage" @next-page="nextPage"></popup-footer>
  </div>
</div>
</template>

<script lang="ts">

import DownloadItem = chrome.downloads.DownloadItem;
import downloadItemView from "./downloadItemView.vue";
import popupHeaderView from "./popupHeaderView.vue";
import popupFooterView from "./popupFooterView.vue";

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
        limit: 100,
        query: [this.searchText]
      }, (items) => {
        this.items = items;
      });
      startTimes = []; // 每次搜索之后重新初始化
    },
    prePage() {
      if (this.items && this.items.length > 0) { // 没有元素说明没有访问过下一页
        let firstItem = this.items[0];
        let startTime = firstItem.startTime;
        let query = {
          orderBy:['-startTime'],
          limit: 100,
          query: [this.searchText],
          startedAfter: startTime
        };

        if (startTimes.length > 0) {
          startTimes.pop();
          if (startTimes.length > 0) {
            let lastStartTime = startTimes[startTimes.length - 1];
            query['startedBefore'] = lastStartTime;
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
          limit: 100,
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
}
</style>
