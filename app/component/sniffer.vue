<template>
<div class="main">
  <el-tabs v-model="activeTab" type="border-card" @tab-click="activateTab">
    <el-tab-pane label="Video" name="videos">
      <ul>
        <li v-for="item in videos" class="list-item" :key="item.url">
          <sniffer-item :item="item"></sniffer-item>
        </li>
      </ul>
    </el-tab-pane>

    <el-tab-pane label="Audio" name="audios">
      <ul>
        <li v-for="item in audios" class="list-item" :key="item.url">
          <sniffer-item :item="item"></sniffer-item>
        </li>
      </ul>
    </el-tab-pane>

    <el-tab-pane label="Image" name="images">
      <ul>
        <li v-for="item in images" class="list-item" :key="item.url">
          <sniffer-item :item="item">
            <template v-slot:image>
              <img :src="item.url" :alt="item.type" style="max-width: 100%; max-height: 100%;">
            </template>
          </sniffer-item>
        </li>
      </ul>
    </el-tab-pane>

    <el-tab-pane label="Doc" name="documents">
      <ul>
        <li v-for="item in documents" class="list-item" :key="item.url">
          <sniffer-item :item="item"></sniffer-item>
        </li>
      </ul>
    </el-tab-pane>

    <el-tab-pane label="Other" name="others">
      <ul>
        <li v-for="item in others" class="list-item" :key="item.url">
          <sniffer-item :item="item"></sniffer-item>
        </li>
      </ul>
    </el-tab-pane>
  </el-tabs>

  <div class="footer container">
    <div>
      <el-switch @change="selectAllChange" active-text="Select All" v-model="selectAllStatus"></el-switch>
    </div>
    <icon-bi-arrow-repeat style="cursor: pointer" title="刷新" @click="refresh" :class="refreshBtnClasses"></icon-bi-arrow-repeat>

    <div>
      <el-button @click="goBack">返回</el-button>
      <el-button @click="downloadSelected">下载</el-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, ref, toRefs, getCurrentInstance} from "vue";
import snifferItem from "./snifferItem.vue";
import {useRouter} from "vue-router";

interface FileInfo {
  name?: string;
  url: string;
  type?: string;
  size?: number;
  desc?: string;
  isSelected: boolean
}

export default defineComponent({
  components: {
    snifferItem
  },
  setup() {
    const data = reactive({
      snifferData: <any>new Map(),
      videos: <FileInfo[]> [],
      audios: <FileInfo[]> [],
      images: <FileInfo[]> [],
      documents: <FileInfo[]> [],
      others: <FileInfo[]> [],

      activeTab: 'videos',
      selectAllStatus: false,
      refreshBtnClasses: []
    })

    function refresh() {
      data.refreshBtnClasses.push('refreshBtnRotate')
      setTimeout(() => {
        data.refreshBtnClasses.length = 0
      }, 300);

      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        let tab = tabs[0];
        chrome.runtime.sendMessage({cmd: 'getSnifferData', tabId: tab.id}, (response) => {
          console.log('response', response);
          for (let k in response.data) {
            data.snifferData.set(k, response.data[k])
          }
          data.videos = getSnifferData('video');
          data.audios = getSnifferData('audio');
          data.images = getSnifferData('image');
          data.documents = getSnifferData('document');
          data.others = getSnifferData('other');
        });
      });
    }
    const router = useRouter()
    function goBack() {
      router.back()
    }
    function getSnifferData(type: string) {
      if (!data.snifferData) {
        return [];
      }

      return <FileInfo[]>data.snifferData.get(type);
    }

    function selectAllChange(checked: boolean) {
      let items = data[data.activeTab];
      if (items) {
        items.forEach((it: FileInfo) => it.isSelected = checked);
        data[data.activeTab] = items;
      }
    }

    function activateTab(tab, event) {
      console.log('activateTab', data.activeTab, tab, event)
      // 清空切换的tab的选中状态
      data.selectAllStatus = false;
      let items = data[data.activeTab];
      if (items) {
        items.forEach((it: FileInfo) => it.isSelected = false);
        data[data.activeTab] = items;
      }
      console.log(items)
    }

    function downloadSelected() {
      let items = data[data.activeTab];
      console.log('download selected items.', items)
      if (items) {
        items.forEach((it: FileInfo) => {
          if (it.isSelected) {
            chrome.downloads.download({
              url: it.url,
              filename: it.name || encodeURIComponent(it.url)
            });
          }
        });
      }
      goBack();
    }

    refresh()
    return {
      ...toRefs(data),
      refresh, goBack, getSnifferData, selectAllChange, activateTab, downloadSelected
    }
  }
})
</script>

<style scoped>
.main {
  min-width: 400px;
  min-height: 600px;
  display: flex;
}
.main ul {
  list-style: none;
  min-width: 400px;
  padding: 0 0 40px 0;
  margin: 0;
}
.list-item {
  width: 400px;
  margin: 0 auto;
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
  justify-content: space-around;
}
.refreshBtnRotate {
  transform: rotate(180deg);
  transition: all .5s;
}
</style>
