import Vue from 'vue';

import {BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import * as dayjs from "dayjs";
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import util from "./util";

dayjs.extend(relativeTime);
dayjs.locale(util.dayjsLocale());

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.mixin({
    methods: {
        i18n: chrome.i18n.getMessage,
        fileType(mime: string) {
            if (mime.indexOf('image/') > -1) {
                return 'image';
            } else if (mime.indexOf('video/') > -1) {
                return 'video';
            } else if (mime.indexOf('audio/') > -1) {
                return 'audio';
            } else if (mime.indexOf('text/') > -1) {
                return 'document';
            } else {
                return 'other';
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
});

function createApp(obj: any) {
    return new Vue(obj);
}

export default createApp;
