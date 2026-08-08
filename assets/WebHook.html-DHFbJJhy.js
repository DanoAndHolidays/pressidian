import{_ as n,c as a,b as e,o as t}from"./app-B-D0al_h.js";const i={};function d(l,s){return t(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="webhook" tabindex="-1"><a class="header-anchor" href="#webhook"><span>Webhook</span></a></h1><p>Webhook 是一种<strong>由事件驱动的 HTTP 回调机制</strong>——当某个事件在第三方系统中发生时，该系统会主动向你预先注册的 URL 发送一个 HTTP 请求（通常是 POST），将事件数据实时推送给你。</p><p>&quot;第三方 Webhook&quot;特指<strong>外部服务/平台提供的 Webhook 能力</strong>，即你的系统作为接收方，监听来自第三方的事件通知。</p><h2 id="核心机制" tabindex="-1"><a class="header-anchor" href="#核心机制"><span>核心机制</span></a></h2><div class="language-Plain line-numbers-mode" data-highlighter="prismjs" data-ext="Plain"><pre><code class="language-Plain"><span class="line">┌──────────────┐       事件发生       ┌──────────────────┐</span>
<span class="line">│  第三方平台   │ ──── HTTP POST ──▶ │ 你的 Webhook 端点 │</span>
<span class="line">│(GitHub/Stripe│     (携带事件数据)   │  (你的服务器)     │</span>
<span class="line">│  /飞书/企微…) │                     │                  │</span>
<span class="line">└──────────────┘                     └──────────────────┘</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th></th><th></th></tr></thead><tbody><tr><td>概念</td><td>说明</td></tr><tr><td><strong>推模型 (Push)</strong></td><td>第三方主动推送，区别于你定时去拉取数据的轮询模式 (Pull/Polling)</td></tr><tr><td><strong>注册/订阅</strong></td><td>你在第三方平台配置一个回调 URL，告诉它&quot;事件发生时请通知这个地址&quot;</td></tr><tr><td><strong>Payload</strong></td><td>第三方推送过来的请求体，通常是 JSON 格式，包含事件类型和详细数据</td></tr><tr><td><strong>签名/验签</strong></td><td>第三方在请求头中附带签名（HMAC 等），你的服务器需要验证签名以防伪造</td></tr></tbody></table><h2 id="webhook-vs-轮询-polling" tabindex="-1"><a class="header-anchor" href="#webhook-vs-轮询-polling"><span>Webhook vs 轮询 (Polling)</span></a></h2><table><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td>对比维度</td><td>Webhook（推）</td><td>轮询（拉）</td></tr><tr><td><strong>实时性</strong></td><td>事件发生后即时推送，近乎实时</td><td>取决于轮询间隔，存在延迟</td></tr><tr><td><strong>资源消耗</strong></td><td>只在有事件时才有请求，高效</td><td>不论是否有新数据都持续请求，浪费资源</td></tr><tr><td><strong>复杂度</strong></td><td>需要暴露一个公网可访问的端点</td><td>实现简单，不需要公网端口</td></tr><tr><td><strong>可靠性</strong></td><td>需自行处理重试、幂等、失败补偿</td><td>天然幂等，丢失数据可重新拉取</td></tr><tr><td><strong>适用场景</strong></td><td>事件驱动、对实时性要求高</td><td>数据变化频率低、或无法接收推送</td></tr></tbody></table><h2 id="常见的第三方-webhook-场景" tabindex="-1"><a class="header-anchor" href="#常见的第三方-webhook-场景"><span>常见的第三方 Webhook 场景</span></a></h2><table><thead><tr><th></th><th></th><th></th></tr></thead><tbody><tr><td>领域</td><td>平台</td><td>典型事件</td></tr><tr><td><strong>代码托管</strong></td><td>GitHub / GitLab</td><td>Push、PR 创建/合并、Issue 变更、CI 状态</td></tr><tr><td><strong>支付</strong></td><td>Stripe / 支付宝</td><td>支付成功、退款完成、订阅状态变化</td></tr><tr><td><strong>即时通讯</strong></td><td>飞书 / 企业微信 / Slack</td><td>消息接收、审批通过、机器人事件</td></tr><tr><td><strong>SaaS 工具</strong></td><td>Jira / Notion / Figma</td><td>任务状态变更、页面更新、设计评论</td></tr><tr><td><strong>CI/CD</strong></td><td>Jenkins / GitHub Actions</td><td>构建成功/失败通知</td></tr><tr><td><strong>监控告警</strong></td><td>Grafana / PagerDuty</td><td>告警触发、告警恢复</td></tr></tbody></table><hr><h2 id="接收-webhook-的典型流程" tabindex="-1"><a class="header-anchor" href="#接收-webhook-的典型流程"><span>接收 Webhook 的典型流程</span></a></h2><h3 id="_1-注册回调地址" tabindex="-1"><a class="header-anchor" href="#_1-注册回调地址"><span>1. 注册回调地址</span></a></h3><p>在第三方平台的设置中填入你的端点 URL，例如：</p><div class="language-Plain line-numbers-mode" data-highlighter="prismjs" data-ext="Plain"><pre><code class="language-Plain"><span class="line">https://your-server.com/api/webhooks/github</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><h3 id="_2-接收并验签" tabindex="-1"><a class="header-anchor" href="#_2-接收并验签"><span>2. 接收并验签</span></a></h3><div class="language-TypeScript line-numbers-mode" data-highlighter="prismjs" data-ext="TypeScript"><pre><code class="language-TypeScript"><span class="line">import crypto from &quot;crypto&quot;;</span>
<span class="line">import express from &quot;express&quot;;</span>
<span class="line"></span>
<span class="line">const app = express();</span>
<span class="line">app.post(&quot;/api/webhooks/github&quot;, express.json(), (req, res) =&gt; {</span>
<span class="line">  // 1️⃣ 验证签名 — 防止伪造请求</span>
<span class="line">  const signature = req.headers[&quot;x-hub-signature-256&quot;];</span>
<span class="line">  const expected = &quot;sha256=&quot; +</span>
<span class="line">    crypto.createHmac(&quot;sha256&quot;, WEBHOOK_SECRET)</span>
<span class="line">          .update(JSON.stringify(req.body))</span>
<span class="line">          .digest(&quot;hex&quot;);</span>
<span class="line"></span>
<span class="line">  if (signature !== expected) {</span>
<span class="line">    return res.status(401).send(&quot;Invalid signature&quot;);</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 2️⃣ 处理事件</span>
<span class="line">  const event = req.headers[&quot;x-github-event&quot;];</span>
<span class="line">  const payload = req.body;</span>
<span class="line"></span>
<span class="line">  switch (event) {</span>
<span class="line">    case &quot;push&quot;:</span>
<span class="line">      handlePush(payload);</span>
<span class="line">      break;</span>
<span class="line">    case &quot;pull_request&quot;:</span>
<span class="line">      handlePR(payload);</span>
<span class="line">      break;</span>
<span class="line">  }</span>
<span class="line"></span>
<span class="line">  // 3️⃣ 快速响应 200（第三方通常要求在几秒内响应）</span>
<span class="line">  res.status(200).send(&quot;OK&quot;);</span>
<span class="line">});</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-异步处理-幂等保障" tabindex="-1"><a class="header-anchor" href="#_3-异步处理-幂等保障"><span>3. 异步处理 + 幂等保障</span></a></h3><div class="language-Plain line-numbers-mode" data-highlighter="prismjs" data-ext="Plain"><pre><code class="language-Plain"><span class="line">HTTP 请求进入 → 验签 → 快速返回 200 → 将事件投入消息队列 → 异步消费处理</span>
<span class="line">                                         ↑</span>
<span class="line">                                  避免处理耗时导致超时</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,19)])])}const o=n(i,[["render",d]]),p=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E6%B5%8F%E8%A7%88%E5%99%A8_%E7%BD%91%E7%BB%9C/%E7%BD%91%E7%BB%9C_%E8%AF%B7%E6%B1%82_%E5%8D%8F%E8%AE%AE/WebHook.html","title":"Webhook","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/浏览器&网络/网络&请求&协议/WebHook.md"}');export{o as comp,p as data};
