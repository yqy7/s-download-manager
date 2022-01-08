<template>
  <el-row>
    <el-col :span="2" class="search-label">
      <label for="search-box">
        <icon-bi-search></icon-bi-search>
      </label>
    </el-col>

    <el-col :span="14">
      <el-input v-model="searchText" :input-style="{border: 0}" id="search-box"
                @change="$emit('update:modelValue', searchText)" :placeholder="i18n('searchPlaceholder')">
      </el-input>
    </el-col>

    <el-col :span="8" class="action-buttons">
      <icon-bi-plus-square style="cursor: pointer" :title="i18n('addTask')" @click="showAddTaskDialog = true"></icon-bi-plus-square>
      <icon-bi-folder2-open style="cursor: pointer" :title="i18n('openDownloadFolder')" @click="openDownloadFolder"></icon-bi-folder2-open>
      <icon-bi-gear style="cursor: pointer" :title="i18n('setting')" @click="openOptionPage"></icon-bi-gear>
      <icon-bi-download style="cursor: pointer" :title="i18n('openDownloadPage')" @click="openDownloadPage"></icon-bi-download>
      <icon-bi-bullseye style="cursor: pointer" :title="i18n('sniffer')" @click="openSniffer"></icon-bi-bullseye>
    </el-col>
  </el-row>

  <el-dialog v-model="showAddTaskDialog" :title="i18n('addTask')" width="90%">
    <el-form :model="downloadTask" label-width="15%">
      <el-form-item label="URL">
        <el-input v-model="downloadTask.url" placeholder="URL"></el-input>
      </el-form-item>
      <el-form-item label="Name">
        <el-input v-model="downloadTask.filename" placeholder="File name(Optional)"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="showAddTaskDialog = false">Cancel</el-button>
      <el-button type="primary" @click="addTask">OK</el-button>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs } from "vue";
import { useRouter } from 'vue-router'


export default defineComponent({
  props: ['modelValue'],
  setup(props) {
    const data = reactive({
      searchText: props.modelValue,
      downloadTask: {
        url: <string>null,
        filename: <string>null,
      },
      showAddTaskDialog: false
    })

    function openDownloadFolder() {
      chrome.downloads.showDefaultFolder();
    }
    function openOptionPage() {
      let a = chrome.extension.getURL("pages/options.html");
      chrome.tabs.query({ url: a }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url: a});
      });
    }
    function openDownloadPage() {
      let a = 'chrome://downloads/';
      chrome.tabs.query({ url: a }, function(b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({ url: a});
      });
    }

    const router = useRouter()
    function openSniffer() {
      router.push('/sniffer')
    }

    function addTask() {
      if (data.downloadTask.url) {
        let option = {
          url: data.downloadTask.url
        };
        if (data.downloadTask.filename) {
          option['filename'] = data.downloadTask.filename
        }
        chrome.downloads.download(option);
      }
    }

    return {
      ...toRefs(data),
      openDownloadFolder, openOptionPage, openDownloadPage, openSniffer, addTask
    }
  }
})
</script>

<style scoped>
svg {
  font-size: 1.3em;
}
.search-label {
  display: flex;
  align-items: center;
  justify-content: end;
}
.action-buttons {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
