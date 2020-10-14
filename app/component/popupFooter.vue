<template>
  <div class="footer container">
    <div class="footer-bar">
      <div class="page-action">
        <b-icon-chevron-left :title="i18n('previousPage')" @click="$emit('pre-page')"></b-icon-chevron-left>
        <b-icon-chevron-right :title="i18n('nextPage')" @click="$emit('next-page')"></b-icon-chevron-right>
      </div>

      <div class="actions">
        <b-icon-trash :title="i18n('deleteAll')" @click="$emit('delete-all')"></b-icon-trash>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {

}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  background-color: white;
  /*width: 410px;*/
  width: 100%;
  height: 50px;
  border-top: 1px solid lightgray;
}
.footer-bar {
  display: flex;
  justify-content: space-between;
}
.page-action {
  height: 50px;
  line-height: 50px;
}
.actions {
  height: 50px;
  line-height: 50px;
}
</style>
