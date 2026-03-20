import{_ as i,c as a,o as n,ae as p}from"./chunks/framework.B7Y1jjX-.js";const g=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"generated-notes/前端/三件套/JS/现代JS教程与阮一峰ES6/5特殊内建对象/二进制与文件读取/最佳实践.md","filePath":"generated-notes/前端/三件套/JS/现代JS教程与阮一峰ES6/5特殊内建对象/二进制与文件读取/最佳实践.md"}'),l={name:"generated-notes/前端/三件套/JS/现代JS教程与阮一峰ES6/5特殊内建对象/二进制与文件读取/最佳实践.md"};function t(h,s,k,E,e,r){return n(),a("div",null,[...s[0]||(s[0]=[p(`<div class="language-html vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">html</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">!DOCTYPE html</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">html lang=&quot;zh-CN&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">head</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">meta charset=&quot;UTF-8&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1.0&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">FileReader文件读取最佳实践</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/title</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">style</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        * {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            box-sizing: border-box;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-family: &#39;Segoe UI&#39;, Tahoma, Geneva, Verdana, sans-serif;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        body {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background-color: darkorange;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #333;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            min-height: 100vh;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 30px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            display: flex;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            flex-direction: column;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            align-items: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .container {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            max-width: 1000px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            width: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: rgba(255, 255, 255, 0.95);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 30px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-top: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            opacity: 0.95;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        header {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            text-align: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-bottom: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        h1 {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #2c3e50;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-size: 2.5rem;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-bottom: 5px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .subtitle {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #7f8c8d;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-size: 1.2rem;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .upload-area {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border: 3px dashed #3498db;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 12px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 40px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            text-align: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 25px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #f8f9fa;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            transition: all 0.3s;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .upload-area:hover {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: orange;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-color: red;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .upload-icon {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-size: 60px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #3498db;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-bottom: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .file-input {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            display: none;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .btn {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #3498db;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: white;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border: none;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 12px 25px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 6px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            cursor: pointer;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-size: 1rem;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-weight: bold;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            transition: background 0.3s;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 10px 5px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .btn:hover {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: pink;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .btn-secondary {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #2ecc71;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .btn-secondary:hover {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #1d9650;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .results {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            display: grid;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            grid-template-columns: 1fr 1fr;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            gap: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-top: 30px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .result-card {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: white;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            overflow: hidden;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .result-card h3 {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #3498db;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-bottom: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding-bottom: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-bottom: 2px solid #f0f0f0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .file-info {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #e8f4fc;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 8px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin-bottom: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .preview {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            max-height: 300px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            overflow: auto;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #f9f9f9;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 8px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border: 1px solid #eee;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            white-space: pre-wrap;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-family: &#39;Consolas&#39;, monospace;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .image-preview {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            max-width: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            max-height: 200px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            display: block;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 0 auto;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 6px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .progress-bar {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            height: 8px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #f0f0f0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 4px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 15px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            overflow: hidden;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .progress {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            height: 100%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: linear-gradient(90deg, #3498db, #2ecc71);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            width: 0%;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            transition: width 0.3s;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .status {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            text-align: center;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 10px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            font-weight: bold;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #7f8c8d;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        .error {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            color: #e74c3c;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            padding: 15px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            background: #fdecea;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            border-radius: 8px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            margin: 15px 0;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        @media (max-width: 768px) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            .results {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                grid-template-columns: 1fr;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            .container {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                padding: 20px;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            h1 {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                font-size: 2rem;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/style</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/head</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">body</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;container&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">header</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h1</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">FileReader文件读取最佳实践</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/h1</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p class=&quot;subtitle&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">使用File API和FileReader读取本地文件内容</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/header</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;upload-area&quot; id=&quot;dropZone&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;upload-icon&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">📁</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">拖放文件到此处或点击选择文件</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/h2</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">支持文本文件、图像、JSON等格式</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">input type=&quot;file&quot; id=&quot;fileInput&quot; class=&quot;file-input&quot; multiple</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button class=&quot;btn&quot; onclick=&quot;document.getElementById(&#39;fileInput&#39;).click()&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">选择文件</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/button</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div style=&quot;text-align: center;&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button class=&quot;btn btn-secondary&quot; id=&quot;readAsTextBtn&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">读取为文本</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/button</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button class=&quot;btn btn-secondary&quot; id=&quot;readAsDataURLBtn&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">读取为DataURL</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/button</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">button class=&quot;btn btn-secondary&quot; id=&quot;readAsArrayBufferBtn&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">读取为ArrayBuffer</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/button</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;progress-bar&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;progress&quot; id=&quot;progressBar&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;status&quot; id=&quot;status&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">准备就绪</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;results&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;result-card&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件信息</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/h3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;file-info&quot; id=&quot;fileInfo&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">尚未选择文件</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;result-card&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">h3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件内容预览</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/h3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;preview&quot; id=&quot;filePreview&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件内容将显示在这里</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">        &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div id=&quot;errorContainer&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 获取文件的</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const fileInput = document.getElementById(&#39;fileInput&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const dropZone = document.getElementById(&#39;dropZone&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 文件信息展示</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const fileInfo = document.getElementById(&#39;fileInfo&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const filePreview = document.getElementById(&#39;filePreview&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const progressBar = document.getElementById(&#39;progressBar&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const status = document.getElementById(&#39;status&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const errorContainer = document.getElementById(&#39;errorContainer&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 三个按钮</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const readAsTextBtn = document.getElementById(&#39;readAsTextBtn&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const readAsDataURLBtn = document.getElementById(&#39;readAsDataURLBtn&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        const readAsArrayBufferBtn = document.getElementById(&#39;readAsArrayBufferBtn&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 当前选中的文件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        let currentFile = null;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 拖放功能</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        dropZone.addEventListener(&#39;dragover&#39;, (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.background = &#39;orange&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.borderColor = &#39;red&#39;;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        dropZone.addEventListener(&#39;dragleave&#39;, (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.background = &#39;#f8f9fa&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.borderColor = &#39;#3498db&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        dropZone.addEventListener(&#39;drop&#39;, (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            e.preventDefault();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.background = &#39;#f8f9fa&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            dropZone.style.borderColor = &#39;#3498db&#39;;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.log(e.dataTransfer);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.log(e);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (e.dataTransfer.files.length </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 0) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                handleFileSelection(e.dataTransfer.files[0]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 文件选择处理</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        fileInput.addEventListener(&#39;change&#39;, (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (e.target.files.length </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> 0) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                handleFileSelection(e.target.files[0]);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 处理文件选择</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function handleFileSelection(file) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            currentFile = file;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.log(file);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.log(typeof file);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            console.log(file instanceof File);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            // true 也就是说，在浏览器中读取的文件的类型就是File</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            displayFileInfo(file);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            clearError();</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            updateStatus(&#39;文件已选择，请选择读取方式&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            // 根据文件类型启用适当的按钮</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (file.type.startsWith(&#39;image/&#39;)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                readAsDataURLBtn.disabled = false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                readAsDataURLBtn.disabled = false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            readAsTextBtn.disabled = false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            readAsArrayBufferBtn.disabled = false;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 显示文件信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function displayFileInfo(file) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            fileInfo.innerHTML = \`</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">文件名:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${file.name}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">类型:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${file.type || &#39;未知&#39;}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">大小:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${formatFileSize(file.size)}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">最后修改:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${new Date(file.lastModified).toLocaleString()}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            \`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 格式化文件大小</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function formatFileSize(bytes) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (bytes === 0) return &#39;0 Bytes&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const k = 1024;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const sizes = [&#39;Bytes&#39;, &#39;KB&#39;, &#39;MB&#39;, &#39;GB&#39;];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const i = Math.floor(Math.log(bytes) / Math.log(k));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + &#39; &#39; + sizes[i];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 读取为文本</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsTextBtn.addEventListener(&#39;click&#39;, () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (!currentFile) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;请先选择文件&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                return;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const reader = new FileReader();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onloadstart = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;开始读取文件...&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;30%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onprogress = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (e.lengthComputable) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    const percentLoaded = Math.round((e.loaded / e.total) * 100);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    progressBar.style.width = percentLoaded + &#39;%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    updateStatus(\`读取中: \${percentLoaded}%\`);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onload = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;100%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;文件读取完成&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                // 显示文本内容</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                filePreview.textContent = e.target.result;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                // 如果是JSON，尝试格式化</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (currentFile.type === &#39;application/json&#39; || currentFile.name.endsWith(&#39;.json&#39;)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    try {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        const json = JSON.parse(e.target.result);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        filePreview.textContent = JSON.stringify(json, null, 2);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    } catch (err) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                        // 不是有效的JSON，保持原样</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onerror = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;读取文件时发生错误: &#39; + reader.error.message);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;0%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;读取失败&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.readAsText(currentFile);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 读取为DataURL</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsDataURLBtn.addEventListener(&#39;click&#39;, () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (!currentFile) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;请先选择文件&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                return;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const reader = new FileReader();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onloadstart = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;开始读取文件...&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;30%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onprogress = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (e.lengthComputable) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    const percentLoaded = Math.round((e.loaded / e.total) * 100);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    progressBar.style.width = percentLoaded + &#39;%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    updateStatus(\`读取中: \${percentLoaded}%\`);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onload = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;100%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;文件读取完成&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                // 如果是图片，显示图片预览</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (currentFile.type.startsWith(&#39;image/&#39;)) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    filePreview.innerHTML = \`</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">img src=&quot;\${e.target.result}&quot; alt=&quot;预览&quot; class=&quot;image-preview&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                } else {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    // 否则显示DataURL的前100个字符</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    const dataURL = e.target.result;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    filePreview.textContent = dataURL.substring(0, 100) + &#39;...&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onerror = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;读取文件时发生错误: &#39; + reader.error.message);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;0%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;读取失败&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.readAsDataURL(currentFile);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 读取为ArrayBuffer</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsArrayBufferBtn.addEventListener(&#39;click&#39;, () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            if (!currentFile) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;请先选择文件&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                return;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const reader = new FileReader();</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onloadstart = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;开始读取文件...&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;30%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onprogress = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                if (e.lengthComputable) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    const percentLoaded = Math.round((e.loaded / e.total) * 100);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    progressBar.style.width = percentLoaded + &#39;%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                    updateStatus(\`读取中: \${percentLoaded}%\`);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onload = (e) =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;100%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;文件读取完成&#39;);</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                // 显示ArrayBuffer信息</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                const arrayBuffer = e.target.result;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                filePreview.innerHTML = \`</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ArrayBuffer大小:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${arrayBuffer.byteLength} 字节</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">前16字节:</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/strong</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> \${getFirstBytes(arrayBuffer, 16)}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/p</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                \`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.onerror = () =</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                showError(&#39;读取文件时发生错误: &#39; + reader.error.message);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                progressBar.style.width = &#39;0%&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                updateStatus(&#39;读取失败&#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            };</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            reader.readAsArrayBuffer(currentFile);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        });</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 获取ArrayBuffer的前几个字节</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function getFirstBytes(arrayBuffer, count) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const uint8Array = new Uint8Array(arrayBuffer);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            const bytes = [];</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            for (let i = 0; i </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> Math.min(count, uint8Array.length); i++) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">                bytes.push(uint8Array[i].toString(16).padStart(2, &#39;0&#39;));</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            return bytes.join(&#39; &#39;);</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 更新状态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function updateStatus(message) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            status.textContent = message;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 显示错误</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function showError(message) {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            errorContainer.innerHTML = \`</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">div class=&quot;error&quot;</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\${message}</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/div</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">\`;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 清除错误</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        function clearError() {</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">            errorContainer.innerHTML = &#39;&#39;;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        // 初始化按钮状态</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsTextBtn.disabled = true;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsDataURLBtn.disabled = true;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        readAsArrayBufferBtn.disabled = true;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">    &amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/script</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/body</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;lt;</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/html</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">&amp;gt;</span></span></code></pre></div>`,1)])])}const y=i(l,[["render",t]]);export{g as __pageData,y as default};
