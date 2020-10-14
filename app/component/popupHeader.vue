<template>
  <div class="header container">
    <div class="header-bar">
      <b-form-group label-cols="1" class="search-box-form-group">
        <template v-slot:label>
          <b-icon-search></b-icon-search>
        </template>
        <b-form-input class="search-box" :placeholder="i18n('searchPlaceholder')" id="search-box"
                      :value="value"
                      @input="searchText = $event"
                      @change="$emit('input', searchText)"></b-form-input>
      </b-form-group>

      <b-form-group>
        <b-icon-folder2-open :title="i18n('openDownloadFolder')" @click="openDownloadFolder"></b-icon-folder2-open>
        <b-icon-gear :title="i18n('setting')" @click="openOptionPage"></b-icon-gear>
        <b-icon-download :title="i18n('openDownloadPage')" @click="openDownloadPage"></b-icon-download>
      </b-form-group>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: ['value'],
  data() {
    return {
      searchText: this.value
    }
  },
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
  /*width: 410px;*/
  width: 100%;
  height: 50px;
  background-color: white;
  z-index: 1;
  border-bottom: 1px solid lightgray;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px auto;
}
.search-box {
  border: 0;
}
.search-box-form-group {
  flex: 1;
  margin-right: 1rem;
}
.search-box:focus {
  box-shadow: none;
}
</style>
