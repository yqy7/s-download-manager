<template>
    <div class="options-page">
        <div class="title">
            <img :src="imgUrl"> S Download Manager Settings
        </div>

        <div class="content">
            <el-button @click="changeDownloadFolder">Change Download Folder</el-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {reactive, toRefs} from "vue";

const data = reactive({
    enableShelf: false,
    imgUrl: chrome.runtime.getURL("images/icon-32x32@2x.png")
})

chrome.storage.local.get('shelfEnabled', (result) => {
    data.enableShelf = result['shelfEnabled'];
})

function changeDownloadFolder() {
    let url = 'chrome://settings/downloads/';
    chrome.tabs.query({url}, function (b) {
        b.length ? chrome.tabs.update(b[0].id, {active: !0}) : chrome.tabs.create({url});
    });
}

const {imgUrl, enableShelf} = toRefs(data)

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

.title {
    font-size: 2em;
    font-weight: bold;
    color: darkgrey;
}

.title > img {
    margin-right: 10px;
    vertical-align: middle;
}

.content {
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

.content > * {
    margin: 10px 0;
}
</style>
