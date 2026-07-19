<template>
  <div ref="download-item" :class="{'download-item': true, 'selected': isSelected}">
    <div class="item-img-wrapper">
      <img :src="(fileResType(item.mime) === 'image') && fileExists() ? 'file://' + item.filename : icon_url" class="item-img"/>
    </div>

    <div class="item-info">
      <div>
          <span :title="item.filename"
                :class="['item-filename', {
               'file-not-exists': !fileExists() && item.state !== 'in_progress',
               'file-in-progress': item.state === 'in_progress',
               'file-interrupted': item.state === 'interrupted'}]">
            {{ shortName(item.filename) }}
          </span>
        <span class="error-msg" v-if="hasError()">{{ errorMessage() }}</span>
      </div>

      <div class="item-url">
        <span :title="item.finalUrl">{{ item.finalUrl }}</span>
      </div>

      <div v-if="item.state === 'in_progress'" class="progress-status">
        <b-icon-play-fill v-if="item.canResume" @click="resume" style="color: green;"></b-icon-play-fill>
        <b-icon-pause v-else @click="pause" style="color: blue;"></b-icon-pause>
        <b-icon-x @click="cancel" style="color: red;"></b-icon-x>
        <b-progress :value="item.bytesReceived" :max="item.totalBytes" variant="success" show-progress style="width: 150px"></b-progress>
        <div class="download-speed" v-if="!item.paused">
            <span>
              {{ sizeFormat(speed) }}/s
            </span>
          <span style="border-left: solid 1px darkgrey; margin-left: 5px; padding-left: 5px">
            {{ timeLeft(item.estimatedEndTime) }}
            </span>
        </div>
      </div>

      <div class="item-status-line">
        <span>{{ sizeFormat(item.bytesReceived) }}/{{ sizeFormat(item.totalBytes) }}</span>
        <span>{{ dateFormat(item.startTime) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useDownloadHelper} from '../scripts/downloadItemShare';
import {fileResType, shortName, sizeFormat, timeLeft, dateFormat} from '../scripts/util'

const props = defineProps(['isSelected', 'value'])
const helper = useDownloadHelper(props)
const {item, itemDetailCopy, copyLink, danger_accepted,
    cancel, errorMessage, hasError, fileExists, deleteFile, openFile, deleteRecord,
    openUrl, icon_url, pause, resume, retry, progress_polling, speed, onUpdated, showInFolder} = helper


</script>

<style scoped>
.download-item {
  padding: 5px;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100px;
  border-bottom: 1px solid lightgray;
}
.selected {
  box-shadow: 2px 2px 2px lightgray;
  background-color: #ececec;
  border: 0;
}
.item-img-wrapper {
  width: 80px;
  height: 80px;
  line-height: 80px;
  flex-shrink: 0;
}
.item-img {
  max-width: 100%;
  max-height: 100%;
  vertical-align: middle;
}
.item-info {
  width: 100%;
  overflow: hidden;
}
.item-filename {
  margin: 5px 0;
}
.file-not-exists {
  color: red;
  cursor: default;
  text-decoration: line-through;
}
.file-in-progress {
  color: green;
}
.file-interrupted {
  color: red;
}
.error-msg {
  cursor: default;
  color: red;
  margin-left: 5px;
}
.item-url{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: dodgerblue;
  margin: 5px 0;
}
.progress-status {
  display: flex;
  padding-top: 5px;
}
.progress-status .progress {
  border: 1px solid white;
}
.item-status-line {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}
</style>
