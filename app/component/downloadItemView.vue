<template>
  <div>
    <div ref="download-item" class="download-item" v-on:mouseover="showActionPanel" v-on:mouseout="hideActionPanel">
      <div>
        <img v-bind:src="icon_url" class="item-img"/>
      </div>

      <div class="item-info">
        <div class="item-filename">
          <span :title="item.filename"
                :class="{
               'file-not-exists': !fileExists() && item.state !== 'in_progress',
               'file-in-progress': item.state === 'in_progress',
               'file-interrupted': item.state === 'interrupted'}"
                @click="openFile">
            {{ item.filename | shortName }}
          </span>
          <span class="error-msg" v-if="hasError()">{{ errorMessage() }}</span>
        </div>

        <div class="item-url" :title="item.finalUrl" @click="openUrl(item.finalUrl)">
          {{ item.finalUrl }}
        </div>

        <div v-if="item.state === 'in_progress'" class="progress-status">
          <b-icon-play-fill v-if="item.canResume" @click="resume" style="color: green;"></b-icon-play-fill>
          <b-icon-pause v-else @click="pause" style="color: blue;"></b-icon-pause>
          <b-icon-x @click="cancel" style="color: red;"></b-icon-x>
          <b-progress :value="item.bytesReceived" :max="item.totalBytes" variant="success" show-progress style="width: 150px"></b-progress>
          <div class="download-speed" v-if="!item.paused">
            <span>
              {{ speed | sizeFormat}}/s
            </span>
            <span style="border-left: solid 1px darkgrey; margin-left: 5px; padding-left: 5px">
            {{ item.estimatedEndTime | timeLeft }}
            </span>
          </div>
        </div>

        <div class="item-status-line">
          <span>{{ item.bytesReceived | sizeFormat}}/{{ item.totalBytes | sizeFormat}}</span>
          <span>{{ item.startTime | dateFormat }}</span>
        </div>
      </div>

      <transition name="slide-fade">
        <table class="action-panel" v-show="isShow" ref="action-panel">
          <tr>
            <td>
              <b-icon-list :title="i18n('showDetail')" @click="isShowDetail=!isShowDetail" style="cursor: pointer;"></b-icon-list>
            </td>
            <td>
              <b-icon-folder2-open :title="i18n('showInFolder')" @click="showInFolder" style="cursor: pointer;"></b-icon-folder2-open>
            </td>
            <td>
              <b-icon-link :title="i18n('copyLink')" @click="copyLink" style="cursor: pointer;"></b-icon-link>
            </td>
            <td>
              <b-icon-arrow-clockwise :title="i18n('retry')" @click="retry"
                                      v-if="item.canResume" style="cursor: pointer;"></b-icon-arrow-clockwise>
            </td>
          </tr>
          <tr>
            <td>
              <b-icon-x-circle :title="i18n('delete')" style="color: red; cursor: pointer;" @click="deleteRecord"></b-icon-x-circle>
            </td>
            <td>
              <b-icon-x-octagon-fill :title="i18n('deleteFile')" style="cursor: pointer;" @click="deleteFile"></b-icon-x-octagon-fill>
            </td>
          </tr>
        </table>
      </transition>
    </div>

    <div class="item-detail" v-if="isShowDetail" v-on:dblclick="itemDetailCopy" :title="i18n('doubleClickCopy')">
      <div class="item-detail-item">
        <span class="item-detail-item-key">Id:</span> <span class="item-detail-item-content"> {{ item.id }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Filename:</span> <span class="item-detail-item-content"> {{ item.filename | shortName}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Path:</span> <span class="item-detail-item-content"> {{ item.filename }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">MIME:</span> <span class="item-detail-item-content"> {{ item.mime }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Referrer:</span> <span class="item-detail-item-content"> {{ item.referrer }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">URL:</span> <span class="item-detail-item-content"> {{ item.url }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Final URL:</span> <span class="item-detail-item-content"> {{ item.finalUrl}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Start time: </span> <span class="item-detail-item-content"> {{ item.startTime | dateTimeFormat}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">End time:</span> <span class="item-detail-item-content"> {{ item.endTime | dateTimeFormat}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Estimated end time:</span> <span class="item-detail-item-content"> {{ item.estimatedEndTime | dateTimeFormat}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">State:</span> <span class="item-detail-item-content"> {{ item.state }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Paused:</span> <span class="item-detail-item-content"> {{ item.paused }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Can resume:</span> <span class="item-detail-item-content"> {{ item.canResume }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Interrupt reason:</span> <span class="item-detail-item-content"> {{ item.error }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Exists:</span> <span class="item-detail-item-content"> {{ item.exists }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Danger type:</span> <span class="item-detail-item-content"> {{ item.danger }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Incognito:</span> <span class="item-detail-item-content"> {{ item.incognito }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Bytes received:</span> <span class="item-detail-item-content"> {{ item.bytesReceived | sizeFormat }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">Total bytes:</span> <span class="item-detail-item-content"> {{ item.totalBytes | sizeFormat}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">File size:</span> <span class="item-detail-item-content"> {{ item.fileSize | sizeFormat}} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">By extension id:</span> <span class="item-detail-item-content"> {{ item.byExtensionId }} </span>
      </div>
      <div class="item-detail-item">
        <span class="item-detail-item-key">By extension name:</span> <span class="item-detail-item-content"> {{ item.byExtensionName }} </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DownloadItem = chrome.downloads.DownloadItem;
import util from "../scripts/util";

import * as dayjs from "dayjs";
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale(util.dayjsLocale());

export default {
  props: ['value'],
  data(){
    return  {
      item: <DownloadItem>this.value,
      icon_url: <string>null,
      isShow: false,
      isShowDetail: false,
      speed: 0,
      danger_accepted: false
    }
  },
  created() {
    if (this.item.filename) {
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

    chrome.downloads.onChanged.addListener(downloadDelta => {
      if (downloadDelta.danger.current == 'accepted') {
        this.progress_polling();
      }
    });
  },
  updated() {
    this.$refs['action-panel'].style.height = window.getComputedStyle(this.$refs['download-item']).height;
  },
  methods: {
    i18n: chrome.i18n.getMessage,
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
        if (item['bytesReceived']) {
          this.speed = item['bytesReceived'] - this.item['bytesReceived'];
        }

        for (let k in item) {
          this.item[k] = item[k];
        }

        if (this.item.state === 'in_progress' && !this.item.paused) {
          if (this.item.bytesReceived == this.item.totalBytes && (this.item.danger != 'safe' || this.item.danger != 'accepted')) {
            chrome.downloads.acceptDanger(this.item.id, () => {
              this.progress_polling();
            });
          } else {
            setTimeout(() => {
              this.progress_polling();
            }, 1000);
          }
        }
      });
    },
    deleteRecord() {
      chrome.downloads.erase({
        id: this.item.id
      }, () => {

      });
    },
    deleteFile() {
      if (this.fileExists()) {
        chrome.downloads.removeFile(this.item.id, () => {
          chrome.downloads.erase({
            id: this.item.id
          }, () => {
          });
        });
      } else {
        chrome.downloads.erase({
          id: this.item.id
        }, () => {
        });
      }
    },
    itemDetailCopy(event: Event) {
      let ele = <HTMLElement>event.target;
      if (ele.className == 'item-detail-item-content') {
        util.copyTextInNodeToClipboard(ele);
      }
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
        return this.i18n('deleted');
      }
    }
  },
  filters: {
    dateFormat(date: string) {
      if (date) {
        return dayjs(date).format('YYYY-MM-DD');
      }
      return null;
    },
    dateTimeFormat(date: string) {
      if (date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
      }
      return null;
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
    },
    timeLeft(estimatedEndTimeStr: string) {
      if (!estimatedEndTimeStr) {
        return null;
      }

      let curTime = dayjs();
      let estimatedEndTime = dayjs(estimatedEndTimeStr);
      if (estimatedEndTime.isAfter(curTime)) {
        return estimatedEndTime.from(curTime);
      }

      return null;
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
  background-color: rgba(200,200,200,0.8);
  position: absolute;
  right: 15px;
}
.item-detail {
  width: 100%;
  border: darkgrey 1px solid;
}
.item-detail-item {
  border-bottom: lightgray 1px solid;
  width: 400px;
  word-break: break-all;
}
.item-detail-item-key {
  font-weight: bold;
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
  padding-top: 5px;
}
.progress-status .progress {
  border: 1px solid white;
}
.download-speed {
  display: inline-block;
  font-size: 0.75rem;
  height: 1rem;
  line-height: 1rem;
  margin-left: 5px;
}

/* transition */
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
