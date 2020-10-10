chrome.runtime.onInstalled.addListener((details) => {
  console.log('previousVersion', details.previousVersion);
});

// @ts-ignore
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
  changeBadgeText();
});

chrome.downloads.onErased.addListener(downloadId => {
  changeBadgeText();
});

chrome.downloads.onChanged.addListener(downloadDelta => {
  if (downloadDelta.state === 'complete' || downloadDelta.state === 'interrupted') {
    changeBadgeText();
  }
});
