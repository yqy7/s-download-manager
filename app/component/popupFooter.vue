<template>
    <el-row class="footer-bar">
      <el-col :span="4" class="page-action">
        <icon-bi-chevron-left style="cursor: pointer" :title="i18n('previousPage')" @click="$emit('pre-page')"></icon-bi-chevron-left>
        <icon-bi-chevron-right style="cursor: pointer" :title="i18n('nextPage')" @click="$emit('next-page')"></icon-bi-chevron-right>
      </el-col>

      <el-col :span="2" class="delete-actions">
        <el-popover :auto-close="0"
                    placement="top-start"
            :width="200"
            trigger="click" popper-class="delete-actions-popover">

          <template #reference>
            <icon-bi-trash id="delete-btn" style="cursor: pointer"></icon-bi-trash>
          </template>

          <ul class="delete-action-list">
            <li @click="$emit('delete-finished')" class="delete-action-item">
              {{ i18n('deleteFinishedTask') }}
            </li>
            <li @click="$emit('delete-file-missing')" class="delete-action-item">
              {{ i18n('deleteFileMissingTask') }}
            </li>
            <li @click="$emit('delete-failed')" class="delete-action-item">
              {{ i18n('deleteFailedTask') }}
            </li>
            <li @click="$emit('delete-all')" class="delete-action-item">
              {{ i18n('deleteAll') }}
            </li>
          </ul>
        </el-popover>
      </el-col>
    </el-row>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({

})
</script>

<style scoped>
svg {
  font-size: 1.3em;
}
.footer-bar {
  display: flex;
  justify-content: space-between;
  height: 100%;
}
.page-action {
  display: flex;
  justify-content: center;
  align-items: center;
}
.delete-actions {
  display: flex;
  justify-content: center;
  align-items: center;
}

.delete-action-list {
  margin: 0;
  padding: 0;
}
.delete-action-item {
  list-style: none;
  text-align: center;
  padding: 10px;
  color: red;
  cursor: pointer;
}
.delete-action-item:hover {
  color: white;
  background-color: red;
}
</style>
<style>
.delete-actions-popover {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
