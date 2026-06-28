# 灵魂探测仪 🔮

伪装成 MBTI 人格测试的 H5 小程序,核心是感情测试。

## ⚠️ 重要:修改密码

部署前必须改两处密码:

1. **`admin.js`** 第 6 行:
```js
const ADMIN_PASSWORD='***';  // ★ 改成你自己的密码
```

2. **`api/list.js`** 第 7 行:
```js
const ADMIN_PASSWORD='***';  // ★ 改成和前端一样的密码
```

两处密码必须一致。

## 本地测试

```bash
cd /opt/hermes-web-ui/mbti-test
npx vercel dev   # 或 npx serve .
```

打开 http://localhost:3000 测试 H5
打开 http://localhost:3000/admin 测试后台

## 部署到 Vercel

```bash
npm i -g vercel
cd /opt/hermes-web-ui/mbti-test
vercel --prod
```

部署后会得到:
- 测试页: `https://xxx.vercel.app/`
- 后台: `https://xxx.vercel.app/admin`

## 微信分享注意

1. 微信内需要 HTTPS 域名(Vercel 自动满足)
2. 测试前需要在微信公众平台配置业务域名(Vercel 域名)
3. 想要更好的分享体验,可使用「云开发静态托管」免配置业务域名

## 题目流程

1. 4 题 MBTI(EI/SN/TF/JP)
2. 第 5 题开始 - 核心感情问题 + 算命掩护题 穿插
3. 第 11 题"是否遗憾"或第 13 题"是否喜欢过别人"选"是",动态追加 4 题追问
4. 共 16-20 题,所有题目必答

## 数据存储

- 当前方案: Vercel Serverless 内存 + /tmp 文件(开发够用)
- 生产建议: 接入 Vercel KV 或 Upstash Redis(数据持久化,跨实例共享)
