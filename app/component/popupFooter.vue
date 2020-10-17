<template>
  <div class="footer container">
    <div class="footer-bar">
      <div class="page-action">
        <b-icon-chevron-left style="cursor: pointer" :title="i18n('previousPage')" @click="$emit('pre-page')"></b-icon-chevron-left>
        <b-icon-chevron-right style="cursor: pointer" :title="i18n('nextPage')" @click="$emit('next-page')"></b-icon-chevron-right>
      </div>

      <div class="actions">
        <b-icon-trash id="delete-btn" style="cursor: pointer"></b-icon-trash>
        <b-popover target="delete-btn" triggers="hover" placement="top" id="delete-popover">
          <div>
            <b-button @click="$emit('delete-finished')" squared variant="outline-danger">{{ i18n('deleteFinishedTask') }}</b-button>
          </div>
          <div>
            <b-button @click="$emit('delete-file-missing')" squared variant="outline-danger">{{ i18n('deleteFileMissingTask') }}</b-button>
          </div>
          <div>
            <b-button @click="$emit('delete-failed')" squared variant="outline-danger">{{ i18n('deleteFailedTask') }}</b-button>
          </div>
          <div>
            <b-button @click="$emit('delete-all')" squared variant="outline-danger">{{ i18n('deleteAll') }}</b-button>
          </div>
        </b-popover>
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
<style>
#delete-popover .popover-body button {
  width: 100%;
  border: 0;
}
#delete-popover .popover-body {
  padding: 0;
}
</style>
