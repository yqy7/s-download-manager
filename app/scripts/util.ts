
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
  }
}
