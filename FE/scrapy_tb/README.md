### 遇到的问题

#### 在browser中forEach循环跟普通的for使用起来的效果有很大不同：

forEach的回调函数执行await后面的语句时不是有序的

```js
[1,2,3].forEach((item, index) => {
	await ....;
	console.log(item) //并不是输出1，2，3
})
```

而普通的for循环可以保持有序

#### 请求返回的数据编码是gbk时，node需要用iconv-lite插件进行解码，才能解决中文乱码问题

```js
const iconv = require('iconv-lite');
const res = await axios.get(httpUrl, options2);
// 解决中文乱码
let data = iconv.decode(Buffer.from(res.data), 'gbk');
```

#### 请求头信息不用设置太多，不然返回的数据是乱码的，一般设置以下就够了

```json
headers: {
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
    }
```

