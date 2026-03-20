import{_ as a,c as n,o as p,ae as e}from"./chunks/framework.B7Y1jjX-.js";const v=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"notes/公共技术/虚拟环境.md","filePath":"notes/公共技术/虚拟环境.md"}'),t={name:"notes/公共技术/虚拟环境.md"};function i(l,s,c,o,r,d){return p(),n("div",null,[...s[0]||(s[0]=[e(`<p>使用venv、poetry进行虚拟环境管理</p><h5 id="创建虚拟环境" tabindex="-1">创建虚拟环境 <a class="header-anchor" href="#创建虚拟环境" aria-label="Permalink to &quot;创建虚拟环境&quot;">​</a></h5><p>在VScode中右下角就可以轻松创建虚拟环境，注意需要在本机中安装所需的Python版本才能创建对应的虚拟环境。</p><p>使用requirements.txt文件来批量导入环境</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>pip install -r requirements.txt  //表示文件的路径</span></span></code></pre></div><p>requirements.txt的格式</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>包名 == 版本号</span></span></code></pre></div><hr><h5 id="常用的指令" tabindex="-1">常用的指令 <a class="header-anchor" href="#常用的指令" aria-label="Permalink to &quot;常用的指令&quot;">​</a></h5><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bash</span></span>
<span class="line"><span># 退出当前虚拟环境</span></span>
<span class="line"><span>deactivate</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 删除现有的虚拟环境（根据你的操作系统选择相应命令）</span></span>
<span class="line"><span># Windows:</span></span>
<span class="line"><span>rmdir /S .venv</span></span>
<span class="line"><span># Linux/macOS:</span></span>
<span class="line"><span>rm -rf .venv</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 创建新的虚拟环境</span></span>
<span class="line"><span>python -m venv .venv</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 激活新的虚拟环境</span></span>
<span class="line"><span># Windows:</span></span>
<span class="line"><span>.venv\\Scripts\\activate</span></span>
<span class="line"><span># Linux/macOS:</span></span>
<span class="line"><span>source .venv/bin/activate</span></span>
<span class="line"><span></span></span>
<span class="line"><span># 重新安装项目依赖</span></span>
<span class="line"><span>pip install -r requirements.txt</span></span></code></pre></div>`,10)])])}const u=a(t,[["render",i]]);export{v as __pageData,u as default};
