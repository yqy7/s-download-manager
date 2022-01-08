<template>
<div class="options-page">
  <div class="title" title="S Download Manager Settings">
    <img :src="imgUrl" style="margin-right: 10px;">
    SDM-Settings
  </div>
  <div class="content-panel container">
    <div class="setting-item">
      <el-switch v-model="enableShelf" @change="changeEnableShelf" active-text="Chrome Downloads Bar"></el-switch>
    </div>
    <div class="setting-item">
      <el-button @click="changeDownloadFolder">Change Download Folder</el-button>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from "vue";

export default defineComponent({
  setup() {
    const data = reactive({
      enableShelf: false,
      imgUrl: chrome.extension.getURL("images/icon-32x32@2x.png")
    })

    chrome.storage.local.get('shelfEnabled', (result) => {
      data.enableShelf = result['shelfEnabled'];
    })

    function changeEnableShelf(enabled: boolean) {
      chrome.downloads.setShelfEnabled(enabled);
      this.enableShelf = enabled;
      chrome.storage.local.set({shelfEnabled: enabled});
    }

    function changeDownloadFolder() {
      let url = 'chrome://settings/downloads/';
      chrome.tabs.query({ url }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url });
      });
    }

    return {
      ...toRefs(data),
      changeEnableShelf,
      changeDownloadFolder
    }
  }
})
</script>

<style scoped>
.options-page {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex-direction: column;
}
.content-panel {
  margin-top: 30px;
  height: 50%;
  width: 60%;
  border: 1px solid lightgray;
  border-radius: 5px;
  box-shadow: 2px 2px 2px lightgrey;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.title {
  font-size: 2em;
  font-weight: bold;
  color: darkgrey;
}
.setting-item {
  margin: 10px 0;
}
</style>
