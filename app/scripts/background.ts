import WebResponseHeadersDetails = chrome.webRequest.WebResponseHeadersDetails;
import TabRemoveInfo = chrome.tabs.TabRemoveInfo;
import {fileResType} from "./util";

interface FileInfo {
  name?: string;
  url: string;
  type?: string;
  size?: number;
  desc?: string;
  isSelected: boolean
}

chrome.runtime.onInstalled.addListener((details) => {
  // 关闭Shelf
  chrome.downloads.setShelfEnabled(false);
  chrome.storage.local.set({shelfEnabled: false});
});

function changeBadgeText() {
  chrome.downloads.search({state: 'in_progress'}, function (results) {
    let badgeText = results.length > 0 ? results.length.toString() : '';
    chrome.browserAction.setBadgeText({
      text: badgeText
    });
  });
}
changeBadgeText();

// 监听下载事件
chrome.downloads.onCreated.addListener(downloadItem => {
  console.log('onCreated...');
  changeBadgeText();
});

chrome.downloads.onErased.addListener(downloadId => {
  console.log('onErased...');
  changeBadgeText();
});

chrome.downloads.onChanged.addListener(downloadDelta => {
  console.log('onChanged...', downloadDelta);
  if (downloadDelta.state && (downloadDelta.state.current == 'complete' || downloadDelta.state.current == 'interrupted')) {
    changeBadgeText();
  }
});

// 嗅探
function responseToFileInfo(details: WebResponseHeadersDetails): FileInfo {
  let fileInfo: FileInfo = {
    name: detectFilename(details),
    url: details.url,
    type: getFileType(details),
    size: getSize(details),
    isSelected: false
  };
  return fileInfo;
}

function getFileType(details: WebResponseHeadersDetails): string {
  let mime = getMime(details);
  if (mime) {
    return /.*\/([^;]*)/.exec(mime)[1];
  }
  let url = new URL(details.url);
  let filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1, url.pathname.length);
  if (filename.indexOf('.') > -1) {
    return filename.substring(filename.indexOf('.') + 1, filename.length);
  }
  return null;
}

function getSize(details: WebResponseHeadersDetails): number {
  let headers = details.responseHeaders;
  for (const header of headers) {
    if (header.name.toLocaleLowerCase() === 'content-length') {
      return parseFloat(header.value);
    }
  }
  return null;
}

function getMime(details: WebResponseHeadersDetails): string {
  let headers = details.responseHeaders;
  let i = headers.findIndex(it => it.name.toLocaleLowerCase() === 'content-type');
  if (i < 0) {
    return null;
  } else {
    return headers[i].value;
  }
}

function detectFilename(details: WebResponseHeadersDetails) {
  let headerIndex = details.responseHeaders.findIndex(it => it.name.toLocaleLowerCase() === 'content-disposition');
  if (headerIndex > -1) {
    let m = /filename="(.*)"/.exec(details.responseHeaders[headerIndex].value);
    if (m) {
      return m[1];
    }
  }

  let url = new URL(details.url);
  return url.pathname.substring(url.pathname.lastIndexOf('/') + 1, url.pathname.length);
}

let snifferData = {};
chrome.webRequest.onHeadersReceived.addListener((details: WebResponseHeadersDetails) => {
  if (details.tabId == -1) {
    return;
  }

  // 确定tab
  let tabData = snifferData[details.tabId];
  if (!tabData) {
    tabData = {}
    snifferData[details.tabId] = tabData;
  }

  // 确定资源类型
  let mime = getMime(details);
  if (!mime) {
    return;
  }
  let resType = fileResType(mime);
  let infos = tabData[resType];
  if (!infos) {
    infos = [];
    tabData[resType] = infos;
  }

  // 保存
  let fileInfo = responseToFileInfo(details);
  if (infos.findIndex((it:FileInfo) => it.url === fileInfo.url) > -1) {
    return;
  }
  infos.push(fileInfo);
}, {
  urls: ["<all_urls>"]
}, ["responseHeaders"]);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log('msg', request);
  if (request.cmd === 'getSnifferData') {
    let data = snifferData[request.tabId];
    console.log(data);
    sendResponse({data});
  }
});

chrome.tabs.onRemoved.addListener(function(tabId: number, removeInfo:TabRemoveInfo) {
  if (snifferData[tabId]) {
    snifferData[tabId] = null;
  }
});

// for debug
(<any>globalThis).snifferData = snifferData;
