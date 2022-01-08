import * as dayjs from "dayjs";
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale(dayjsLocale());

export function copyToClipboard(text: string) {
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
}

export function copyTextInNodeToClipboard(node: HTMLElement) {
    let selection = window.getSelection();
    let range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
}

export function dayjsLocale() {
    const dayjsLocaleMap = {
        'zh-CN': 'zh-cn'
    };
    let locale = chrome.i18n.getUILanguage();
    return dayjsLocaleMap[locale] ? dayjsLocaleMap[locale] : locale;
}

export function fileResType(mime: string) {
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

export function dateFormat(date: string) {
    if (date) {
        return dayjs(date).format('YYYY-MM-DD');
    }
    return null;
}

export function dateTimeFormat(date: string) {
    if (date) {
        return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
    }
    return null;
}

export function shortName(filename: string) {
    if (!filename) {
        return 'undefined';
    }
    let lastIndex = filename.lastIndexOf('/');
    return lastIndex >= 0 && lastIndex < filename.length - 1 ? filename.substring(lastIndex + 1, filename.length) : filename;
}

export function sizeFormat(fileSize: any) {
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
}

export function timeLeft(estimatedEndTimeStr: string) {
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

export const i18n = chrome.i18n.getMessage;
