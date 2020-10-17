import Vue, {CreateElement} from 'vue';

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
        fileResType: util.fileResType
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
        sizeFormat(fileSize: any) {
            fileSize = parseFloat(fileSize);
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

function createApp(obj: any, routes?: any) {
    if (routes) {
        obj['mixins'] = [
            {
                data: {
                    currentRoute: '/'
                },
                computed: {
                    ViewComponent() {
                        return routes[this.currentRoute];
                    }
                },
                methods: {
                    navTo(path: string) {
                        this.currentRoute = path;
                    }
                },
                render(h: CreateElement) {
                    return h(this.ViewComponent);
                }
            }
        ];
    }
    return new Vue(obj);
}

export default createApp;
