<template>
<div>
  <div class="sniffer-item" @click="item.isSelected = !item.isSelected" :class="{selected: item.isSelected}">
    <span class="selected-tag" v-if="item.isSelected"></span>
    <div class="item-img">
      <slot name="image">
        <div class="img-block">
          {{ item.type }}
        </div>
      </slot>
    </div>
    <div class="item-info">
      <div :title="item.name">
        {{ item.name || item.url }}
      </div>

      <div class="item-url" :title="item.url">
        {{ item.url }}
      </div>

      <div class="status-line">
        <span :title="item.type">
          {{ item.type }}
        </span>
        <span>
          {{ sizeFormat(item.size) }}
        </span>
      </div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {sizeFormat} from '../scripts/util'

export default defineComponent({
  props: ['item'],
  setup() {
    return {
      sizeFormat
    }
  }
})
</script>

<style scoped>
.sniffer-item {
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px;
  padding: 0 5px 0 0;
  border-bottom: 1px solid lightgray;
  position: relative;
  cursor: pointer;
}
.item-img {
  display: inline-block;
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  text-align: center;
  line-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: white;
}
.selected-tag {
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-top: 8px solid #009688;
  border-left: 8px solid #009688;
  border-right: 16px solid transparent;
  border-bottom: 4px solid transparent;
}
.img-block {
  background-color: deepskyblue;
  width: 100%;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-url {
  width: 100%;
  color: blue;
}
.item-info {
  padding-left: 20px;
  width: 100%;
  overflow: hidden;
  line-height: 2;
}
.status-line {
  display: flex;
  justify-content: space-between;
}
.selected {
  background-color: lightgray;
}
</style>
