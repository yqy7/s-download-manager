<template>
  <div style="display: flex;" @mouseup="stopResizeSidebar" @mousemove="resizeSidebar">
    <div class="main">
      <b-navbar type="light" variant="light" fixed="top">
        <b-navbar-brand href="#">S Download Manager</b-navbar-brand>

        <b-navbar-nav align="center">
          <b-nav-form @submit.stop.prevent>
            <b-form-group label-cols="1" class="search-box-form-group">
              <template v-slot:label>
                <b-icon-search></b-icon-search>
              </template>
              <b-form-input id="search-box" class="search-box" :placeholder="i18n('searchPlaceholder')"
                            v-model="searchText"></b-form-input>
            </b-form-group>
          </b-nav-form>
        </b-navbar-nav>
      </b-navbar>

<!--      <div class="header">-->
<!--        <div>-->
<!--          <b-form-checkbox-group v-model="stateSelected">-->
<!--            <b-form-checkbox value="downloading">Downloading</b-form-checkbox>-->
<!--            <b-form-checkbox value="finished">Finished</b-form-checkbox>-->
<!--            <b-form-checkbox value="interrupted">Interrupted</b-form-checkbox>-->
<!--          </b-form-checkbox-group>-->
<!--        </div>-->

<!--        <div>-->
<!--          <b-form-checkbox-group v-model="fileTypeSelected">-->
<!--            <b-form-checkbox value="audio">Audio</b-form-checkbox>-->
<!--            <b-form-checkbox value="video">Video</b-form-checkbox>-->
<!--            <b-form-checkbox value="image">Image</b-form-checkbox>-->
<!--            <b-form-checkbox value="document">Document</b-form-checkbox>-->
<!--            <b-form-checkbox value="other">Other</b-form-checkbox>-->
<!--          </b-form-checkbox-group>-->
<!--        </div>-->
<!--      </div>-->

      <div class="content">
        <ul class="item-list">
          <li v-for="item in items" :key="item.id" class="list-item">
            <div>
              <download-page-item :value="item" @click.native="selectItem(item)" :isSelected="item['isSelected']"></download-page-item>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div class="sidebar" v-if="itemSelected != null" ref="sidebar">
      <div class="resize-bar" @mousedown="startResizeSidebar"></div>
      <div class="item-detail container" :title="i18n('doubleClickCopy')">
        <div class="item-img-wrapper">
          <img :src="(fileResType(itemSelected.mime) === 'image' && (this.itemSelected.state == 'complete' && this.itemSelected.exists && this.itemSelected.filename)) ? 'file://' + itemSelected.filename : itemSelected.icon_url" class="item-img"/>
        </div>

        <div class="item-detail-item">
          <span class="item-detail-item-key">Id:</span> <span class="item-detail-item-content"> {{ itemSelected.id }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Filename:</span> <span class="item-detail-item-content"> {{ itemSelected.filename | shortName}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Path:</span> <span class="item-detail-item-content"> {{ itemSelected.filename }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">MIME:</span> <span class="item-detail-item-content"> {{ itemSelected.mime }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Referrer:</span> <span class="item-detail-item-content"> {{ itemSelected.referrer }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">URL:</span> <span class="item-detail-item-content"> {{ itemSelected.url }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Final URL:</span> <span class="item-detail-item-content"> {{ itemSelected.finalUrl}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Start time: </span> <span class="item-detail-item-content"> {{ itemSelected.startTime | dateTimeFormat}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">End time:</span> <span class="item-detail-item-content"> {{ itemSelected.endTime | dateTimeFormat}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Estimated end time:</span> <span class="item-detail-item-content"> {{ itemSelected.estimatedEndTime | dateTimeFormat}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">State:</span> <span class="item-detail-item-content"> {{ itemSelected.state }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Paused:</span> <span class="item-detail-item-content"> {{ itemSelected.paused }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Can resume:</span> <span class="item-detail-item-content"> {{ itemSelected.canResume }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Interrupt reason:</span> <span class="item-detail-item-content"> {{ itemSelected.error }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Exists:</span> <span class="item-detail-item-content"> {{ itemSelected.exists }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Danger type:</span> <span class="item-detail-item-content"> {{ itemSelected.danger }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Incognito:</span> <span class="item-detail-item-content"> {{ itemSelected.incognito }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Bytes received:</span> <span class="item-detail-item-content"> {{ itemSelected.bytesReceived | sizeFormat }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">Total bytes:</span> <span class="item-detail-item-content"> {{ itemSelected.totalBytes | sizeFormat}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">File size:</span> <span class="item-detail-item-content"> {{ itemSelected.fileSize | sizeFormat}} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">By extension id:</span> <span class="item-detail-item-content"> {{ itemSelected.byExtensionId }} </span>
        </div>
        <div class="item-detail-item">
          <span class="item-detail-item-key">By extension name:</span> <span class="item-detail-item-content"> {{ itemSelected.byExtensionName }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import DownloadItem = chrome.downloads.DownloadItem;
import downloadPageItem from "./downloadPageItem.vue";
class ResizeObj {
  mouseDownX: number;
  width: number;
  maxWidth: number;
  minWidth: number;
}
export default {
  data() {
    return {
      searchText: '',
      stateSelected: ['downloading', 'finished', 'interrupted'],
      fileTypeSelected: ['audio', 'video', 'image', 'document', 'other'],
      items: <DownloadItem[]>null,
      itemSelected: <DownloadItem>null,
      sidebarResizing: <ResizeObj>null
    }
  },
  methods: {
    search() {
      chrome.downloads.search({
        orderBy:['-startTime'],
        limit: 100,
        query: [this.searchText]
      }, (items) => {
        this.items = items;
      });
    },
    selectItem(item: DownloadItem) {
      item['isSelected'] = !item['isSelected'];
      if (item['isSelected']) {
        this.items.forEach((it: DownloadItem) => {
          if (it !== item) {
            it['isSelected'] = false;
          }
        });
        this.itemSelected = item;
      } else {
        this.itemSelected = null;
      }

      this.$forceUpdate();
    },
    startResizeSidebar(event: MouseEvent) {
      this.sidebarResizing = {
        mouseDownX: event.clientX,
        width: parseFloat(window.getComputedStyle(this.$refs['sidebar']).width),
        maxWidth: parseFloat(window.getComputedStyle(this.$refs['sidebar']).maxWidth),
        minWidth: parseFloat(window.getComputedStyle(this.$refs['sidebar']).minWidth)
      };
      document.body.style.userSelect = 'none';
    },
    resizeSidebar(event: MouseEvent) {
      if (this.sidebarResizing) {
        let w;
        if (event.clientX > this.sidebarResizing.mouseDownX) {
           w = this.sidebarResizing.width - (event.clientX - this.sidebarResizing.mouseDownX);
        } else {
          w = this.sidebarResizing.width + (this.sidebarResizing.mouseDownX - event.clientX);
        }
        if (!(this.sidebarResizing.maxWidth && w > this.sidebarResizing.maxWidth) || !(this.sidebarResizing.minWidth && w < this.sidebarResizing.minWidth)) {
          this.$refs['sidebar'].style.width = w + 'px';
        }
      }
    },
    stopResizeSidebar() {
      this.sidebarResizing = null;
      document.body.style.userSelect = '';
    }
  },
  components: {
    downloadPageItem
  },
  created() {
    this.search();
  }
}
</script>

<style scoped>
ul {
  list-style: none;
}
.main {
  border: 1px solid blue;
  flex: 1 1 auto;
}
.main .navbar {
  box-shadow: 1px 1px 1px lightgrey;
}
.content {
  margin-top: 55px;
}
.search-bar {
  display: flex;
  justify-content: center;
}
.sidebar {
  width: 500px;
  position: fixed;
  right: 0;
  height: 100%;
  margin-top: 55px;
  padding-bottom: 55px;
  background-color: white;
  max-width: 1000px;
  min-width: 300px;
  border-left: 1px solid darkgrey;
  box-shadow: -2px -2px 5px lightgray;
  overflow-y: scroll;
}
.resize-bar {
  cursor: ew-resize;
  height: 100%;
  width: 1px;
  position: absolute;
}
.item-detail {
  width: 100%;
  border: darkgrey 1px solid;
  padding-top: 20px;
}
.item-img-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.item-img {
  max-width: 100%;
  max-height: 100%;
}
.item-detail-item {
  border-bottom: lightgray 1px solid;
  width: 100%;
  word-break: break-all;
}
.item-detail-item-key {
  font-weight: bold;
}
</style>
