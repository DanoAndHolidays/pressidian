import{_ as n,c as e,b as a,o as i}from"./app-Bmdocauq.js";const l={};function d(p,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<p>封装了Node.js的API，简化了搭建后端的操作流程</p><h4 id="初始化" tabindex="-1"><a class="header-anchor" href="#初始化"><span>初始化</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">npm init //创建package.json文件</span>
<span class="line">npm i express //安装</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="简单的运用" tabindex="-1"><a class="header-anchor" href="#简单的运用"><span>简单的运用</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">const experss = require(&#39;express&#39;)</span>
<span class="line">const app = experss()</span>
<span class="line"></span>
<span class="line">app.get(&#39;/&#39;, function (req, res) {</span>
<span class="line">    res.send(&#39;你好&#39;)</span>
<span class="line">})</span>
<span class="line"></span>
<span class="line">app.get(&#39;/uesr&#39;, function (req, res) {</span>
<span class="line">    res.send(&#39;你好用户&#39;)</span>
<span class="line">})</span>
<span class="line"></span>
<span class="line">app.listen(3000, function () {</span>
<span class="line">    console.log(&#39;服务已经启动&#39;)</span>
<span class="line">}) </span>
<span class="line"></span>
<span class="line">node server.js //来运行js</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="nodemon" tabindex="-1"><a class="header-anchor" href="#nodemon"><span>Nodemon</span></a></h4><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">//安装，能够方便的启动服务</span>
<span class="line">npm install nodemon --save--dev</span>
<span class="line"></span>
<span class="line">{</span>
<span class="line">  &quot;name&quot;: &quot;express&quot;,</span>
<span class="line">  &quot;version&quot;: &quot;1.0.0&quot;,</span>
<span class="line">  &quot;description&quot;: &quot;&quot;,</span>
<span class="line">  &quot;main&quot;: &quot;index.js&quot;,</span>
<span class="line">  &quot;scripts&quot;: {</span>
<span class="line">    &quot;test&quot;: &quot;echo \\&quot;Error: no test specified\\&quot; &amp;&amp; exit 1&quot;,</span>
<span class="line">    &quot;start&quot;: &quot;nodemon server.js&quot; //修改配置文件package.json</span>
<span class="line">  },</span>
<span class="line">  &quot;author&quot;: &quot;&quot;,</span>
<span class="line">  &quot;license&quot;: &quot;ISC&quot;,</span>
<span class="line">  &quot;dependencies&quot;: {</span>
<span class="line">    &quot;express&quot;: &quot;^5.1.0&quot;,</span>
<span class="line">    &quot;nodemon&quot;: &quot;^3.1.10&quot;</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h4 id="路由" tabindex="-1"><a class="header-anchor" href="#路由"><span>路由</span></a></h4><p>访问的接口由路由判断。&#39;/&#39;是路由部分，function是回调函数部分 常用的路由方法有post，get，put，delete等</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">const experss = require(&#39;express&#39;)</span>
<span class="line">const app = experss()</span>
<span class="line">  </span>
<span class="line">app.get(&#39;/&#39;, function (req, res) {</span>
<span class="line">    console.log(req.query);</span>
<span class="line">    res.send(&#39;你好&#39;)</span>
<span class="line">})</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>有一种的特殊的</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">app.all() //会响应所有的路由</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>可以使用postman来模拟请求</p><p>路由路径：</p><ul><li>字符模式路由路径： <ul><li>&#39;/ab?cd&#39;支持abcd和acd</li><li>&#39;/ab+cd&#39;支持ab（0-多个b）cd</li><li>&#39;/ab*cd&#39;通配符</li></ul></li><li>正则路由路径：/在两个规范斜杠里书写/ <ul><li>/a/ 表示有a就行</li><li>/.*<em>fiy$/ .通配符</em>$以其结尾</li></ul></li></ul>`,18)])])}const c=n(l,[["render",d]]),r=JSON.parse('{"path":"/notes/obsidian/%E5%90%8E%E7%AB%AF/Express.html","title":"","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/后端/Express.md"}');export{c as comp,r as data};
