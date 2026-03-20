import{_ as a,c as n,o as p,ae as e}from"./chunks/framework.B7Y1jjX-.js";const h=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"generated-notes/后端/Express.md","filePath":"generated-notes/后端/Express.md"}'),t={name:"generated-notes/后端/Express.md"};function l(i,s,o,c,r,u){return p(),n("div",null,[...s[0]||(s[0]=[e(`<p>封装了Node.js的API，简化了搭建后端的操作流程</p><h4 id="初始化" tabindex="-1">初始化 <a class="header-anchor" href="#初始化" aria-label="Permalink to &quot;初始化&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>npm init //创建package.json文件</span></span>
<span class="line"><span>npm i express //安装</span></span></code></pre></div><hr><h4 id="简单的运用" tabindex="-1">简单的运用 <a class="header-anchor" href="#简单的运用" aria-label="Permalink to &quot;简单的运用&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const experss = require(&#39;express&#39;)</span></span>
<span class="line"><span>const app = experss()</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.get(&#39;/&#39;, function (req, res) {</span></span>
<span class="line"><span>    res.send(&#39;你好&#39;)</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.get(&#39;/uesr&#39;, function (req, res) {</span></span>
<span class="line"><span>    res.send(&#39;你好用户&#39;)</span></span>
<span class="line"><span>})</span></span>
<span class="line"><span></span></span>
<span class="line"><span>app.listen(3000, function () {</span></span>
<span class="line"><span>    console.log(&#39;服务已经启动&#39;)</span></span>
<span class="line"><span>}) </span></span>
<span class="line"><span></span></span>
<span class="line"><span>node server.js //来运行js</span></span></code></pre></div><hr><h4 id="nodemon" tabindex="-1">Nodemon <a class="header-anchor" href="#nodemon" aria-label="Permalink to &quot;Nodemon&quot;">​</a></h4><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//安装，能够方便的启动服务</span></span>
<span class="line"><span>npm install nodemon --save--dev</span></span>
<span class="line"><span></span></span>
<span class="line"><span>{</span></span>
<span class="line"><span>  &quot;name&quot;: &quot;express&quot;,</span></span>
<span class="line"><span>  &quot;version&quot;: &quot;1.0.0&quot;,</span></span>
<span class="line"><span>  &quot;description&quot;: &quot;&quot;,</span></span>
<span class="line"><span>  &quot;main&quot;: &quot;index.js&quot;,</span></span>
<span class="line"><span>  &quot;scripts&quot;: {</span></span>
<span class="line"><span>    &quot;test&quot;: &quot;echo \\&quot;Error: no test specified\\&quot; &amp;&amp; exit 1&quot;,</span></span>
<span class="line"><span>    &quot;start&quot;: &quot;nodemon server.js&quot;</span><span> //修改配置文件package.json</span></span>
<span class="line"><span>  },</span></span>
<span class="line"><span>  &quot;author&quot;: &quot;&quot;,</span></span>
<span class="line"><span>  &quot;license&quot;: &quot;ISC&quot;,</span></span>
<span class="line"><span>  &quot;dependencies&quot;: {</span></span>
<span class="line"><span>    &quot;express&quot;: &quot;^5.1.0&quot;,</span></span>
<span class="line"><span>    &quot;nodemon&quot;: &quot;^3.1.10&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h4 id="路由" tabindex="-1">路由 <a class="header-anchor" href="#路由" aria-label="Permalink to &quot;路由&quot;">​</a></h4><p>访问的接口由路由判断。&#39;/&#39;是路由部分，function是回调函数部分 常用的路由方法有post，get，put，delete等</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>const experss = require(&#39;express&#39;)</span></span>
<span class="line"><span>const app = experss()</span></span>
<span class="line"><span>  </span></span>
<span class="line"><span>app.get(&#39;/&#39;, function (req, res) {</span></span>
<span class="line"><span>    console.log(req.query);</span></span>
<span class="line"><span>    res.send(&#39;你好&#39;)</span></span>
<span class="line"><span>})</span></span></code></pre></div><p>有一种的特殊的</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>app.all() //会响应所有的路由</span></span></code></pre></div><p>可以使用postman来模拟请求</p><p>路由路径：</p><ul><li>字符模式路由路径： <ul><li>&#39;/ab?cd&#39;支持abcd和acd</li><li>&#39;/ab+cd&#39;支持ab（0-多个b）cd</li><li>&#39;/ab*cd&#39;通配符</li></ul></li><li>正则路由路径：/在两个规范斜杠里书写/ <ul><li>/a/ 表示有a就行</li><li>/.*<em>fiy$/ .通配符</em>$以其结尾</li></ul></li></ul>`,18)])])}const q=a(t,[["render",l]]);export{h as __pageData,q as default};
