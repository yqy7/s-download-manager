import DownloadItem = chrome.downloads.DownloadItem;
import {reactive, toRefs} from "vue";
import {copyTextInNodeToClipboard, copyToClipboard, i18n} from "./util";

export function useDownloadHelper(props) {
    const data = reactive({
        item: <DownloadItem>props.value,
        speed: 0,
        danger_accepted: false,
        icon_url: <string>null
    })

    function initDownloadItem() {
        if (data.item.filename) {
            chrome.downloads.getFileIcon(
                data.item.id,
                {'size': 32},
                (icon_url) => {
                    if (icon_url) {
                        data.icon_url = icon_url;
                        data.item['icon_url'] = icon_url;
                    }
                });
        }
        if (data.item.state === 'in_progress' && !data.item.paused) {
            progress_polling();
        }

        chrome.downloads.onChanged.addListener(downloadDelta => {
            if (downloadDelta.danger && downloadDelta.danger.current == 'accepted') {
                progress_polling();
            }
        });
    }

    function onUpdated() {
        // 有时候显示不出来
        if (!data.icon_url && data.item.filename) {
            chrome.downloads.getFileIcon(
                data.item.id,
                {'size': 32},
                (icon_url) => {
                    if (icon_url) {
                        data.icon_url = icon_url;
                        data.item['icon_url'] = icon_url;
                    }
                });
        }
    }

    function openFile() {
        let item = data.item;
        if (item.exists && item.filename && item.state == 'complete') {
            chrome.downloads.open(item.id);
        }
    }

    function showInFolder() {
        let item = data.item;
        if (item.exists && item.filename && item.state == 'complete') {
            chrome.downloads.show(item.id);
        }
    }

    function openUrl(url: string) {
        chrome.tabs.create({ url });
    }
    function copyLink() {
        copyToClipboard(data.item.finalUrl);
    }
    function pause(){
        chrome.downloads.pause(data.item.id, () => {
            progress_polling();
        });
    }
    function resume() {
        chrome.downloads.resume(data.item.id, () => {
            progress_polling();
        });
    }
    function retry() {
        resume();
    }
    function cancel() {
        chrome.downloads.cancel(data.item.id, () => {
            progress_polling();
        });
    }
    function progress_polling() {
        chrome.downloads.search({
            id: data.item.id
        }, (results: DownloadItem[]) => {
            let item = results[0];
            if (item) {
                if (item['bytesReceived']) {
                    data.speed = item['bytesReceived'] - data.item['bytesReceived'];
                }

                for (let k in item) {
                    data.item[k] = item[k];
                }
            }

            if (data.item.state === 'in_progress' && !data.item.paused) {
                if (data.item.bytesReceived == data.item.totalBytes && (data.item.danger !== 'safe' && data.item.danger !== 'accepted')) {
                    chrome.downloads.acceptDanger(data.item.id, () => {
                        progress_polling();
                    });
                } else {
                    setTimeout(() => {
                        progress_polling();
                    }, 1000);
                }
            }
        });
    }
    function deleteRecord() {
        chrome.downloads.erase({
            id: data.item.id
        }, () => {

        });
    }
    function deleteFile() {
        if (fileExists()) {
            chrome.downloads.removeFile(data.item.id, () => {
                chrome.downloads.erase({
                    id: data.item.id
                }, () => {
                });
            });
        } else {
            chrome.downloads.erase({
                id: data.item.id
            }, () => {
            });
        }
    }
    function itemDetailCopy(event: Event) {
        let ele = <HTMLElement>event.target;
        if (ele.className == 'item-detail-item-content') {
            copyTextInNodeToClipboard(ele);
        }
    }
    function fileExists() {
        return (data.item.state == 'complete' && data.item.exists && data.item.filename);
    }
    function hasError() {
        return data.item.state == 'interrupted' || (!fileExists() && data.item.state != 'in_progress');
    }
    function errorMessage() {
        if (data.item.error) {
            return i18n(data.item.error) ? i18n(data.item.error) : data.item.error;
        } else {
            return i18n('deleted');
        }
    }

    initDownloadItem()
    return {
        ...toRefs(data),
        onUpdated, openFile, showInFolder, openUrl, copyLink, pause, resume, retry, cancel,
        progress_polling, deleteRecord, deleteFile, itemDetailCopy, fileExists, hasError, errorMessage
    }

}
