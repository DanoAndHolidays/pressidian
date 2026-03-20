import{_ as a,c as i,o as n,ae as l}from"./chunks/framework.B7Y1jjX-.js";const c=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"generated-notes/前端/项目笔记/个人主页/下落代码背景.md","filePath":"generated-notes/前端/项目笔记/个人主页/下落代码背景.md"}'),p={name:"generated-notes/前端/项目笔记/个人主页/下落代码背景.md"};function t(e,s,h,E,k,r){return n(),i("div",null,[...s[0]||(s[0]=[l(`<div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">canvas id=&quot;myCanvas&quot;width=&quot;1529&quot; height=&quot;943&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 刷新页面</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function refreshPage() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            location.reload();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 初始化画布</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var canvas = document.getElementById(&#39;myCanvas&#39;),</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ctx = canvas.getContext(&#39;2d&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置画布的宽度和高度</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        canvas.width = window.innerWidth;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        canvas.height = window.innerHeight;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置字母</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var letters = &#39;LeetCode LeetCode LeetCode LeetCode LeetCode LeetCode LeetCode&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        letters = letters.split(&#39;&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置列数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var fontSize = 10,</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            columns = canvas.width / fontSize;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置下落位置</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var drops = [];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        for (var i = 0; i </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> columns; i++) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            drops[i] = 1;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置颜色</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var colors = [&#39;#05FF00&#39;, &#39;#00BFFF&#39;, &#39;#FF4500&#39;, &#39;#FFA500&#39;, &#39;#C202C2&#39;];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var lightBackgroundColors = [&#39;#013600&#39;, &#39;#002E3D&#39;, &#39;#3E1100&#39;, &#39;#342100&#39;, &#39;#3C003C&#39;]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var colorIndex = Math.floor(Math.random() * colors.length);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 绘制函数</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function draw() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ctx.fillStyle = &#39;rgba(0, 0, 0, .1)&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ctx.fillRect(0, 0, canvas.width, canvas.height);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            ctx.fillStyle = colors[colorIndex];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            for (var i = 0; i </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> drops.length; i++) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                var text = letters[Math.floor(Math.random() * letters.length)];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                ctx.fillText(text, i * fontSize, drops[i] * fontSize);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                drops[i]++;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (drops[i] * fontSize </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> canvas.height &amp;&amp; Math.random() </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> .95) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    drops[i] = 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 循环动画</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        setInterval(draw, 30);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var light = document.querySelector(&#39;.light&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        light.style.background = colors[colorIndex];</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 设置呼吸灯的背景颜色</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        var lightWrapper = document.querySelector(&#39;.light-wrapper&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        lightWrapper.style.backgroundColor = lightBackgroundColors[colorIndex];</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">script/</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div>`,1)])])}const o=a(p,[["render",t]]);export{c as __pageData,o as default};
