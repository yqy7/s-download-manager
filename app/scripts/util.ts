
export default {
  remove(arr: any[], obj: any) {
    let index = arr.findIndex(it => it === obj)
    if (index > -1) {
      arr.splice(index, 1)
    }
  },
  copyToClipboard(text: string) {
    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);
    textarea.innerText = text;
    textarea.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
    } else {
      console.log('复制失败');
    }
    document.body.removeChild(textarea);
  }
}
