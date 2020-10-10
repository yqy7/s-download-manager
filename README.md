# S Download Manager

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Install

	$ npm install

## Development

    npm run dev chrome
    npm run dev firefox
    npm run dev opera
    npm run dev edge

## Build

    npm run build chrome
    npm run build firefox
    npm run build opera
    npm run build edge

## Environment

The build tool also defines a variable named `process.env.NODE_ENV` in your scripts. 

## Docs

* [webextension-toolbox](https://github.com/HaNdTriX/webextension-toolbox)

------

## 功能
- 搜索
- 显示信息
  -- 文件名
  -- 下载url
  -- referrer
  -- 图标
  -- 状态: 
  -- 文件大小
  -- 完成日期
  -- 文件位置  

状态
item.state: in_progress, interrupted, complete
item.paused: 暂停
item.canResume: 可以恢复

item.danger: "file", "url", "content", "uncommon", "host", "unwanted", "safe", or "accepted"
item.exists: 是否存在

正常显示：
item.state == 'complete' && item.exists
下载中：处理pause、resume、cancel
item.state == 'in_progress'
被中断：显示中断理由
item.state == 'interrupted'
已删除
item.state == 'complete' && !item.exists
