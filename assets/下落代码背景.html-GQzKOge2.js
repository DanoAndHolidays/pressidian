import{_ as s,c as a,b as l,o as e}from"./app-DDNDL5LW.js";const i={};function c(p,n){return e(),a("div",null,[...n[0]||(n[0]=[l(`<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre><code class="language-html"><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>canvas</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>myCanvas<span class="token punctuation">&quot;</span></span><span class="token attr-name">width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>1529<span class="token punctuation">&quot;</span></span> <span class="token attr-name">height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>943<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span></span>
<span class="line">        // 刷新页面</span>
<span class="line">        function refreshPage() {</span>
<span class="line">            location.reload();</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 初始化画布</span>
<span class="line">        var canvas = document.getElementById(&#39;myCanvas&#39;),</span>
<span class="line">            ctx = canvas.getContext(&#39;2d&#39;);</span>
<span class="line"></span>
<span class="line">        // 设置画布的宽度和高度</span>
<span class="line">        canvas.width = window.innerWidth;</span>
<span class="line">        canvas.height = window.innerHeight;</span>
<span class="line"></span>
<span class="line">        // 设置字母</span>
<span class="line">        var letters = &#39;LeetCode LeetCode LeetCode LeetCode LeetCode LeetCode LeetCode&#39;;</span>
<span class="line">        letters = letters.split(&#39;&#39;);</span>
<span class="line"></span>
<span class="line">        // 设置列数</span>
<span class="line">        var fontSize = 10,</span>
<span class="line">            columns = canvas.width / fontSize;</span>
<span class="line"></span>
<span class="line">        // 设置下落位置</span>
<span class="line">        var drops = [];</span>
<span class="line">        for (var i = 0; i &lt; columns; i++) {</span>
<span class="line">            drops[i] = 1;</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 设置颜色</span>
<span class="line">        var colors = [&#39;#05FF00&#39;, &#39;#00BFFF&#39;, &#39;#FF4500&#39;, &#39;#FFA500&#39;, &#39;#C202C2&#39;];</span>
<span class="line">        var lightBackgroundColors = [&#39;#013600&#39;, &#39;#002E3D&#39;, &#39;#3E1100&#39;, &#39;#342100&#39;, &#39;#3C003C&#39;]</span>
<span class="line">        var colorIndex = Math.floor(Math.random() * colors.length);</span>
<span class="line"></span>
<span class="line">        // 绘制函数</span>
<span class="line">        function draw() {</span>
<span class="line">            ctx.fillStyle = &#39;rgba(0, 0, 0, .1)&#39;;</span>
<span class="line">            ctx.fillRect(0, 0, canvas.width, canvas.height);</span>
<span class="line">            ctx.fillStyle = colors[colorIndex];</span>
<span class="line">            for (var i = 0; i &lt; drops.length; i++) {</span>
<span class="line">                var text = letters[Math.floor(Math.random() * letters.length)];</span>
<span class="line">                ctx.fillText(text, i * fontSize, drops[i] * fontSize);</span>
<span class="line">                drops[i]++;</span>
<span class="line">                if (drops[i] * fontSize &gt; canvas.height &amp;&amp; Math.random() &gt; .95) {</span>
<span class="line">                    drops[i] = 0;</span>
<span class="line">                }</span>
<span class="line">            }</span>
<span class="line">        }</span>
<span class="line"></span>
<span class="line">        // 循环动画</span>
<span class="line">        setInterval(draw, 30);</span>
<span class="line"></span>
<span class="line">        var light = document.querySelector(&#39;.light&#39;);</span>
<span class="line">        light.style.background = colors[colorIndex];</span>
<span class="line"></span>
<span class="line">        // 设置呼吸灯的背景颜色</span>
<span class="line">        var lightWrapper = document.querySelector(&#39;.light-wrapper&#39;);</span>
<span class="line">        lightWrapper.style.backgroundColor = lightBackgroundColors[colorIndex];</span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">/&gt;</span></span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,1)])])}const d=s(i,[["render",c]]),r=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%B8%AA%E4%BA%BA%E4%B8%BB%E9%A1%B5/%E4%B8%8B%E8%90%BD%E4%BB%A3%E7%A0%81%E8%83%8C%E6%99%AF.html","title":"","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/个人主页/下落代码背景.md"}');export{d as comp,r as data};
