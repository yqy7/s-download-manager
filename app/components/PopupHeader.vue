<template>
    <el-row>
        <el-col :span="2" class="search-label">
            <label for="search-box">
                <icon-bi-search/>
            </label>
        </el-col>

        <el-col :span="14">
            <el-input id="search-box"
                      v-model="searchText"
                      :input-style="{border: 0}"
                      @change="$emit('update:modelValue', searchText)"
                      :placeholder="i18n('searchPlaceholder')"/>
        </el-col>

        <el-col :span="8" class="action-buttons">
            <icon-bi-plus-square :title="i18n('addTask')" @click="showAddTaskDialog = true"/>

            <icon-bi-folder2-open :title="i18n('openDownloadFolder')" @click="openDownloadFolder"/>

            <icon-bi-gear :title="i18n('setting')" @click="openOptionPage"/>

            <icon-bi-download :title="i18n('openDownloadPage')" @click="openDownloadPage"/>

            <icon-bi-bullseye :title="i18n('sniffer')" @click="openSniffer"/>
        </el-col>
    </el-row>

    <!-- 对话框 -->
    <el-dialog v-model="showAddTaskDialog" :title="i18n('addTask')" width="90%">
        <el-form :model="downloadTask" label-width="15%">
            <el-form-item label="URL">
                <el-input v-model="downloadTask.url" placeholder="URL"/>
            </el-form-item>
            <el-form-item label="Name">
                <el-input v-model="downloadTask.filename" placeholder="File name(Optional)"/>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="showAddTaskDialog = false">Cancel</el-button>
            <el-button type="primary" @click="addTask">OK</el-button>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import {reactive, toRefs} from "vue";
import {useRouter} from 'vue-router'

const props = defineProps(['modelValue'])

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
    let a = chrome.runtime.getURL("pages/options.html");
    chrome.tabs.query({url: a}, function (b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({url: a});
    });
}

function openDownloadPage() {
    // let a = 'chrome://downloads/';
    let a = chrome.runtime.getURL("pages/downloads.html");
    chrome.tabs.query({url: a}, function (b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({url: a});
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

const {searchText, showAddTaskDialog, downloadTask} = toRefs(data)

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

.action-buttons > svg {
    cursor: pointer;
}
</style>
