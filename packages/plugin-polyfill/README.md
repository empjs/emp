## EMP2.0 Polyfill 插件
### 功能
-  根据浏览器对应加载特定polyfill
### Example
#### Emp-config
```javascript
// emp-config.js
module.exports = defineConfig(() => {
  return {
  	...
    plugins: [
    	pluginPolyfill([
        {
            entries: ['index'], // 指定entry加载这个配置
            browser: 'IE', // IE浏览器下会加载
           	js: [
              '//yourcdnhost/babel-polyfill.7.2.5.min.js',
           	],
           	polyfills: ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator'],
        },
        {
          	uaReg: '/Safari/', // uaReg.test(ua) 为true时会加载
           	polyfills: ['core-js/modules/es.promise', 'core-js/modules/es.array.iterator'],
        },
      ])
    ]
  }
})
```

#### output
```html
<!--
/dist
	index.html
    /js
        index.hash.js
        polyfill_IE.hash.js
        polyfill_0.hash.js
-->
<!doctype html>
<head>
  <!-- ... -->
  <script type="text/javascript">
  	! function () {
			var t = navigator.userAgent;
			window.document.documentMode && document.writeln(
					'<script src="js/polyfill_IE.hash.js"><\/script><script src="//yourcdnhost/babel-polyfill.7.2.5.min.js"><\/script>'
					), /Safari/.test(t) && document.writeln('<script src="js/polyfill_0.hash.js"><\/script>')
		}()
  </script>
  <script defer="defer" src="js/index.c82b86a6.js"></script>
  <!-- ... -->
</head>
<body>
</body>
```

### TODO
- 废除document.writeln插入js方式，改用其他
- 支持多入口动态加载 `done`
- 支持targets属性 支持browserslist
- 去除Ejs
- 支持定制插入位置、标签属性
- polyfills 缓存