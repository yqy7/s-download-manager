import util from "./util";
import DownloadItem = chrome.downloads.DownloadItem;

export default {
    props: ['value'],
    data(){
        return  {
            item: <DownloadItem>this.value,
            speed: 0,
            danger_accepted: false,
            icon_url: <string>null
        }
    },
    created() {
        this.initDownloadItem();
    },
    methods: {
        initDownloadItem() {
            if (this.item.filename) {
                chrome.downloads.getFileIcon(
                    this.item.id,
                    {'size': 32},
                    (icon_url) => {
                        if (icon_url) {
                            this.icon_url = icon_url;
                            this.item.icon_url = icon_url;
                        }
                    });
            }
            if (this.item.state === 'in_progress' && !this.item.paused) {
                this.progress_polling();
            }

            chrome.downloads.onChanged.addListener(downloadDelta => {
                if (downloadDelta.danger && downloadDelta.danger.current == 'accepted') {
                    this.progress_polling();
                }
            });
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
                if (item) {
                    if (item['bytesReceived']) {
                        this.speed = item['bytesReceived'] - this.item['bytesReceived'];
                    }

                    for (let k in item) {
                        this.item[k] = item[k];
                    }
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
    }
}
