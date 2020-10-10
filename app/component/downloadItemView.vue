<template>
  <div>
    <div class="download-item" v-on:mouseover="showActionPanel" v-on:mouseout="hideActionPanel">
      <div>
        <img v-bind:src="icon_url" class="item-img"/>
      </div>

      <div class="item-info">
        <div class="item-filename">
          <span v-bind:title="item.filename"
                v-bind:class="{
               'file-not-exists': !fileExists() && item.state != 'in_progress',
               'file-in-progress': item.state == 'in_progress',
               'file-interrupted': item.state == 'interrupted'}"
                @click="openFile">
            {{ item.filename | shortName }}
          </span>
          <span class="error-msg" v-if="hasError()">{{ errorMessage() }}</span>
        </div>

        <div class="item-url" v-bind:title="item.finalUrl" @click="openUrl(item.finalUrl)">
          {{ item.finalUrl }}
        </div>

        <div class="item-status-line">
          <span>{{ item.bytesReceived | sizeFormat}}</span>
          <div v-if="item.state == 'in_progress'" class="progress-status">
            <b-icon-play-fill v-if="item.canResume" @click="resume" style="color: green;"></b-icon-play-fill>
            <b-icon-pause v-else @click="pause" style="color: blue;"></b-icon-pause>
            <b-icon-x @click="cancel" style="color: red;"></b-icon-x>
            <b-progress :value="item.bytesReceived" :max="item.totalBytes" variant="success" show-progress style="width: 150px"></b-progress>
          </div>
          <span>{{ item.endTime | dateFormat }}</span>
        </div>
      </div>

      <transition name="slide-fade">
        <table class="action-panel" v-show="isShow">
          <tr>
            <td>
              <b-icon-list title="显示详细信息" @click="isShowDetail=!isShowDetail"></b-icon-list>
            </td>
            <td>
              <b-icon-folder2-open title="在文件夹中显示" @click="showInFolder"></b-icon-folder2-open>
            </td>
            <td>
              <b-icon-link title="复制链接" @click="copyLink"></b-icon-link>
            </td>
            <td>
              <b-icon-arrow-clockwise title="重试" @click="retry"></b-icon-arrow-clockwise>
            </td>
          </tr>
          <tr>
            <td>
              <b-icon-x-circle title="删除" style="color: red;" @click="deleteRecord"></b-icon-x-circle>
            </td>
          </tr>
        </table>
      </transition>
    </div>

    <div class="item-detail" v-if="isShowDetail">
      <div class="item-detail-item">
        Path: {{ item.filename }}
      </div>
      <div class="item-detail-item">
        URL: {{ item.url }}
      </div>
      <div class="item-detail-item">
        Final URL: {{ item.finalUrl}}
      </div>
      <div class="item-detail-item">
        Referrer: {{ item.referrer }}
      </div>
      <div class="item-detail-item">
        MIME: {{ item.mime }}
      </div>
      <div class="item-detail-item">
        Start time: {{ item.startTime }}
      </div>
      <div class="item-detail-item">
        End time: {{ item.endTime }}
      </div>
      <div class="item-detail-item" style="color: red;">
        State: {{ item.state }}
      </div>
      <div class="item-detail-item">
        incognito: {{ item.incognito }}
      </div>
      <div class="item-detail-item">
        paused: {{ item.paused }}
      </div>
      <div class="item-detail-item">
        Can Resume: {{ item.canResume }}
      </div>
      <div class="item-detail-item">
        Error: {{ item.error }}
      </div>
      <div class="item-detail-item">
        bytesReceived: {{ item.bytesReceived }}
      </div>
      <div class="item-detail-item">
        totalBytes: {{ item.totalBytes | sizeFormat}}
      </div>
      <div class="item-detail-item">
        exists: {{ item.exists }}
      </div>
      <div class="item-detail-item">
        danger: {{ item.danger }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DownloadItem = chrome.downloads.DownloadItem;
import * as dayjs from "dayjs";
import util from "../scripts/util";

export default {
  props: ['value'],
  data(){
    return  {
      item: <DownloadItem>this.value,
      icon_url: <string>null,
      isShow: false,
      isShowDetail: false
    }
  },
  created() {
    if (this.item.filename) { // 没有文件名会报错
      chrome.downloads.getFileIcon(
          this.item.id,
          {'size': 32},
          (icon_url) => {
            if (icon_url) {
              this.icon_url = icon_url;
            }
          });
    }
    if (this.item.state === 'in_progress' && !this.item.paused) {
      this.progress_polling();
    }
  },
  methods: {
    showActionPanel() {
      this.isShow = true;
    },
    hideActionPanel() {
      this.isShow = false;
    },
    openFile() {
      let item = this.item;
      if (item.exists && item.filename && item.state == 'complete') {
        chrome.downloads.open(item.id);
      }
    },
    showInFolder() {
      let item = this.item;
      if (item.exists && item.filename && item.state == 'complete') {
        chrome.downloads.show(item.id);
      }
    },
    openUrl(url: string) {
      chrome.tabs.create({ url });
    },
    copyLink() {
      util.copyToClipboard(this.item.finalUrl);
    },
    pause(){
      chrome.downloads.pause(this.item.id, () => {
        this.progress_polling();
      });
    },
    resume() {
      chrome.downloads.resume(this.item.id, () => {
        this.progress_polling();
      });
    },
    retry() {
      this.resume();
    },
    cancel() {
      chrome.downloads.cancel(this.item.id, () => {
        this.progress_polling();
      });
    },
    progress_polling() {
      chrome.downloads.search({
        id: this.item.id
      }, (results: DownloadItem[]) => {
        let item = results[0];
        for (let k in item) {
          this.item[k] = item[k];
        }

        if (this.item.state === 'in_progress' && !this.item.paused) {
          setTimeout(() => {
            this.progress_polling();
          }, 500);
        }
      });
    },
    deleteRecord() {
      chrome.downloads.erase({
        id: this.item.id
      }, () => {

      });
    },
    fileExists() {
      return (this.item.state == 'complete' && this.item.exists && this.item.filename);
    },
    hasError() {
      return this.item.state == 'interrupted' || (!this.fileExists() && this.item.state != 'in_progress');
    },
    errorMessage() {
      if (this.item.error) {
        return this.item.error;
      } else {
        return '已删除';
      }
    }
  },
  filters: {
    dateFormat(date: string) {
      return dayjs(date).format('YYYY-MM-DD');
    },
    shortName(filename: string) {
      if (!filename) {
        return 'undefined';
      }
      let lastIndex = filename.lastIndexOf('/');
      return lastIndex >= 0 && lastIndex < filename.length - 1 ? filename.substring(lastIndex + 1, filename.length) : filename;
    },
    sizeFormat(fileSize: number) {
      // GB
      let GB = 1024 * 1024 * 1024;
      if (fileSize >= GB) {
        return (fileSize / GB).toFixed(1) + ' GB';
      }
      // MB
      let MB = 1024 * 1024;
      if (fileSize >= MB) {
        return (fileSize / MB).toFixed(1) + ' MB';
      }
      // KB
      let KB = 1024;
      if (fileSize > KB) {
        return (fileSize / KB).toFixed(1) + ' KB';
      }
      // B
      return fileSize.toFixed(1) + ' B';
    }
  }
}
</script>

<style scoped>
.download-item {
  padding: 5px;
  display: flex;
  align-items: center;
  width: 400px;
  overflow: hidden;
  border-bottom: 1px solid lightgray;
}
.download-item:hover {
  box-shadow: 2px 2px 2px lightgray;
  background-color: #ececec;
}
.item-img {
  vertical-align: middle;
  width: 32px;
  height: 32px;
}
.item-info {
  margin-left: 10px;
  overflow: hidden;
  width: 100%;
}
.item-filename {
  cursor: pointer;
  margin: 5px 0;
}
.item-url {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: dodgerblue;
  margin: 5px 0;
  cursor: pointer;
}
.item-status-line {
  display: flex;
  justify-content: space-between;
  margin: 5px 0;
}
.action-panel {
  height: 100px;
  width: 100px;
  background-color: rgba(200,200,200,0.5);
  position: absolute;
  right: 15px;
}
.item-detail {
  width: 100%;
  border: blue 1px solid;
}
.item-detail-item {
  border-bottom: lightgray 1px solid;
  width: 400px;
  word-break: break-all;
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
.progress-status{
  display: flex;
  justify-content: space-between;
  padding-top: 5px;
}
/* 过渡效果 */
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
