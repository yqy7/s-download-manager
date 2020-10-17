<template>
<div class="main">
  <div class="container content">
    <b-tabs v-model="activeTab" @activate-tab="activateTab">
      <b-tab title="Video" >
        <ul>
          <li v-for="item in videos" class="list-item" :key="item.url">
            <sniffer-item :item="item"></sniffer-item>
          </li>
        </ul>
      </b-tab>

      <b-tab title="Audio">
        <ul>
          <li v-for="item in audios" class="list-item" :key="item.url">
            <sniffer-item :item="item"></sniffer-item>
          </li>
        </ul>
      </b-tab>

      <b-tab title="Image">
        <ul>
          <li v-for="item in images" class="list-item" :key="item.url">
            <sniffer-item :item="item">
              <template v-slot:image>
                <img :src="item.url" :alt="item.type" style="max-width: 100%; max-height: 100%;">
              </template>
            </sniffer-item>
          </li>
        </ul>
      </b-tab>

      <b-tab title="Doc">
        <ul>
          <li v-for="item in documents" class="list-item" :key="item.url">
            <sniffer-item :item="item"></sniffer-item>
          </li>
        </ul>
      </b-tab>

      <b-tab title="Other">
        <ul>
          <li v-for="item in others" class="list-item" :key="item.url">
            <sniffer-item :item="item"></sniffer-item>
          </li>
        </ul>
      </b-tab>
    </b-tabs>
  </div>

  <div class="footer container">
    <div id="select-all-checkbox">
      <b-form-checkbox @change="selectAllChange" name="selectAll" v-model="selectAllStatus">Select All</b-form-checkbox>
    </div>
    <b-icon-arrow-repeat style="cursor: pointer" title="刷新" @click="refresh" ref="refreshBtn"></b-icon-arrow-repeat>

    <div>
      <b-button @click="goBack">返回</b-button>
      <b-button @click="downloadSelected">下载</b-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import { FileInfo } from "../../sdm";
import snifferItem from "./snifferItem.vue";
import {BvEvent} from "bootstrap-vue";

export default {
  components: {
    snifferItem
  },
  data() {
    return {
      snifferData: <any>null,
      videos: <FileInfo[]> null,
      audios: <FileInfo[]> null,
      images: <FileInfo[]> null,
      documents: <FileInfo[]> null,
      others: <FileInfo[]> null,
      activeTab: 0,
      selectAllStatus: false
    }
  },
  created() {
    this.refresh();
  },
  methods: {
    refresh() {
      if (this.$refs.refreshBtn) {
        this.$refs.refreshBtn.classList.add('refreshBtnRotate');
        setTimeout(() => {
          this.$refs.refreshBtn.classList.remove('refreshBtnRotate');
        }, 300);
      }

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let tab = tabs[0];
        chrome.runtime.sendMessage({cmd: 'getSnifferData', tabId: tab.id}, (response) => {
          console.log('response', response);
          this.snifferData = response.data;
          this.videos = this.getSnifferData('video');
          this.audios = this.getSnifferData('audio');
          this.images = this.getSnifferData('image');
          this.documents = this.getSnifferData('document');
          this.others = this.getSnifferData('other');

        });
      });
    },
    goBack() {
      (<any>globalThis).app.navTo('/');
    },
    getSnifferData(type: string) {
      if (!this.snifferData) {
        return null;
      }

      return <FileInfo[]>this.snifferData[type];
    },
    selectAllChange(checked: boolean) {
      let items = [this.videos, this.audios, this.images, this.documents, this.others][this.activeTab];
      if (items) {
        items.forEach((it: FileInfo) => it.isSelected = checked);
        [this.videos, this.audios, this.images, this.documents, this.others][this.activeTab] = items;
      }
    },
    activateTab(newTabIndex: number, preTabIndex: number, btEvt: BvEvent) {
      // 清空切换的tab的选中状态
      this.selectAllStatus = false;
      let items = [this.videos, this.audios, this.images, this.documents, this.others][newTabIndex];
      if (items) {
        items.forEach((it: FileInfo) => it.isSelected = false);
        [this.videos, this.audios, this.images, this.documents, this.others][newTabIndex] = items;
      }
    },
    downloadSelected() {
      let items = [this.videos, this.audios, this.images, this.documents, this.others][this.activeTab];
      if (items) {
        items.forEach((it: FileInfo) => {
          if (it.isSelected) {
            chrome.downloads.download({
              url: it.url,
              filename: it.name
            });
          }
        });
      }
      this.goBack();
    }
  }
}
</script>

<style scoped>
.main {
  min-width: 400px;
  min-height: 600px;
  padding-top: 10px;
}
.main ul {
  list-style: none;
  min-width: 400px;
  padding: 0;
}
.list-item {
  width: 400px;
  margin: 0 auto;
}
.content {
  margin-bottom: 50px;
}
.header {
  position: absolute;
  right: 0;
  line-height: 50px;
  height: 50px;
  margin-top: -10px;
  margin-right: 10px;
}
.footer {
  position: fixed;
  background-color: white;
  bottom: 0;
  height: 50px;
  width: 100%;
  border-top: 1px solid lightgray;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.refreshBtnRotate {
  transform: rotate(180deg);
  transition: all .5s;
}
</style>

<style>
#select-all-checkbox input {
  cursor: pointer;
}
#select-all-checkbox label {
  cursor: pointer;
}
</style>
