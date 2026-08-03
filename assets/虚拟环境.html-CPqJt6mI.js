import{_ as s,c as e,b as a,o as i}from"./app-ciZgsKi1.js";const l={};function d(t,n){return i(),e("div",null,[...n[0]||(n[0]=[a(`<p>使用venv、poetry进行虚拟环境管理</p><h5 id="创建虚拟环境" tabindex="-1"><a class="header-anchor" href="#创建虚拟环境"><span>创建虚拟环境</span></a></h5><p>在VScode中右下角就可以轻松创建虚拟环境，注意需要在本机中安装所需的Python版本才能创建对应的虚拟环境。</p><p>使用requirements.txt文件来批量导入环境</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">pip install -r requirements.txt  //表示文件的路径</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>requirements.txt的格式</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">包名 == 版本号</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><hr><h5 id="常用的指令" tabindex="-1"><a class="header-anchor" href="#常用的指令"><span>常用的指令</span></a></h5><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bash</span>
<span class="line"># 退出当前虚拟环境</span>
<span class="line">deactivate</span>
<span class="line"></span>
<span class="line"># 删除现有的虚拟环境（根据你的操作系统选择相应命令）</span>
<span class="line"># Windows:</span>
<span class="line">rmdir /S .venv</span>
<span class="line"># Linux/macOS:</span>
<span class="line">rm -rf .venv</span>
<span class="line"></span>
<span class="line"># 创建新的虚拟环境</span>
<span class="line">python -m venv .venv</span>
<span class="line"></span>
<span class="line"># 激活新的虚拟环境</span>
<span class="line"># Windows:</span>
<span class="line">.venv\\Scripts\\activate</span>
<span class="line"># Linux/macOS:</span>
<span class="line">source .venv/bin/activate</span>
<span class="line"></span>
<span class="line"># 重新安装项目依赖</span>
<span class="line">pip install -r requirements.txt</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,10)])])}const c=s(l,[["render",d]]),p=JSON.parse('{"path":"/notes/obsidian/%E5%85%AC%E5%85%B1%E6%8A%80%E6%9C%AF/%E8%99%9A%E6%8B%9F%E7%8E%AF%E5%A2%83.html","title":"","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/公共技术/虚拟环境.md"}');export{c as comp,p as data};
