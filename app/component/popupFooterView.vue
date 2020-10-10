<template>
  <div class="footer">
    <div class="page-action">
      <b-icon-chevron-left title="previous page" @click="$emit('pre-page')"></b-icon-chevron-left>
      <b-icon-chevron-right title="next page" @click="$emit('next-page')"></b-icon-chevron-right>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    i18n: chrome.i18n.getMessage
  }
}
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  background-color: white;
  width: 400px;
  height: 50px;
  border-top: 1px solid lightgray;
}
.page-action {
  height: 50px;
  line-height: 50px;
}
</style>
