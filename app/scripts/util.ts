
export default {
  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.innerText = text;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    } else {
      console.log('Copy to clipboard error!');
    }
    document.body.removeChild(textarea);
  },
  copyTextInNodeToClipboard(node: HTMLElement) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
  },
  dayjsLocale() {
    const dayjsLocaleMap = {
      'zh-CN': 'zh-cn'
    };
    let locale = chrome.i18n.getUILanguage();
    return dayjsLocaleMap[locale] ? dayjsLocaleMap[locale] : locale;
  },
  fileResType(mime: string) {
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
}
