<template>
  <div class="header">
    <div class="header-bar">
      <label for="search-box">
        <b-icon-search></b-icon-search>
      </label>
      <b-form-input class="search-box" placeholder="Search..." id="search-box" v-model.lazy="value"
                    v-on:change="$emit('input', value)"></b-form-input>

      <b-icon-folder2-open title="打开下载文件夹" @click="openDownloadFolder"></b-icon-folder2-open>
      <b-icon-gear title="打开设置" @click="openOptionPage"></b-icon-gear>
      <b-icon-download title="open download page" @click="openDownloadPage"></b-icon-download>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['value'],
  methods: {
    openDownloadFolder() {
      chrome.downloads.showDefaultFolder();
    },
    openOptionPage() {
      let a = chrome.extension.getURL("pages/options.html");
      chrome.tabs.query({ url: a }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url: a});
      });
    },
    openDownloadPage() {
      let a = chrome.extension.getURL("pages/downloads.html");
      chrome.tabs.query({ url: a }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url: a});
      });
    }
  }
}
</script>

<style scoped>
.header {
  position: fixed;
  width: 400px;
  height: 50px;
  background-color: white;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px auto;
  border-bottom: 1px solid lightgray;
}
.search-box {
  width: 80%;
  border: 0;
}
.search-box:focus {
  box-shadow: none;
}
</style>
