## 找到最原始的Vue
从项目根目录的`package.json`文件出发，找到打包时的命令
```
"script": {
    ...
    "build": "node scripts/build.js",
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",
    "build:weex": "npm run build -- weex"
    ...
}
```
