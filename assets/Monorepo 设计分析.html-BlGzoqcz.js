import{_ as n,c as e,b as a,o as i}from"./app-B-Oysd-8.js";const t={};function d(l,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h1 id="monorepo-设计分析" tabindex="-1"><a class="header-anchor" href="#monorepo-设计分析"><span>Monorepo 设计分析</span></a></h1><p>本文档剖析本项目的 Monorepo 架构设计，并沉淀可复用的设计方法论。</p><hr><h2 id="项目全景" tabindex="-1"><a class="header-anchor" href="#项目全景"><span>项目全景</span></a></h2><h3 id="_1-目录结构" tabindex="-1"><a class="header-anchor" href="#_1-目录结构"><span>1. 目录结构</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">daedalus/</span>
<span class="line">├── apps/                    # 可部署的应用（2 个）</span>
<span class="line">│   ├── app/                 # TanStack Start SSR 前端 (:9431)</span>
<span class="line">│   └── server/              # Hono REST API (:9434)</span>
<span class="line">│</span>
<span class="line">├── packages/                # 共享库（11 个）</span>
<span class="line">│   ├── db-schema/           # Drizzle ORM 表定义（叶节点）</span>
<span class="line">│   ├── db/                  # DAO 数据访问层</span>
<span class="line">│   ├── ai/                  # LLM 调用封装</span>
<span class="line">│   ├── agent/               # Agent 编排逻辑</span>
<span class="line">│   ├── services/            # 业务逻辑层</span>
<span class="line">│   ├── schemas/             # Zod 校验 schema</span>
<span class="line">│   ├── shared/              # 共享常量</span>
<span class="line">│   ├── logger/              # 日志工具</span>
<span class="line">│   ├── ui/                  # shadcn/ui 组件 + cn() 工具</span>
<span class="line">│   ├── typescript-config/   # 共享 tsconfig</span>
<span class="line">│   ├── oxlint-config/       # 共享 oxlint 规则</span>
<span class="line">│   └── oxc-formatter-config/ # 共享格式化配置</span>
<span class="line">│</span>
<span class="line">├── docs/                    # 项目文档</span>
<span class="line">├── package.json             # 根 package.json (workspaces 定义)</span>
<span class="line">├── turbo.json               # Turborepo 任务编排</span>
<span class="line">├── bun.lock                 # Bun 锁文件</span>
<span class="line">└── CLAUDE.md                # AI 编码助手指令</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-顶层工具链选型" tabindex="-1"><a class="header-anchor" href="#_2-顶层工具链选型"><span>2. 顶层工具链选型</span></a></h3><table><thead><tr><th>维度</th><th>选择</th><th>角色</th></tr></thead><tbody><tr><td>包管理器</td><td><strong>Bun 1.3</strong> (<code>workspaces</code>)</td><td>原生 workspace 协议 + 极速安装</td></tr><tr><td>任务编排</td><td><strong>Turborepo 2.8</strong></td><td>并行执行、缓存输出、依赖拓扑排序</td></tr><tr><td>类型系统</td><td><strong>TypeScript 5.9</strong></td><td>全项目统一版本</td></tr><tr><td>Lint</td><td><strong>oxlint</strong></td><td>Rust 编写，毫秒级</td></tr><tr><td>格式化</td><td><strong>Prettier 3.7</strong></td><td>统一代码风格</td></tr><tr><td>死代码检测</td><td><strong>Knip</strong></td><td>发现未使用导出/依赖</td></tr></tbody></table><p>工具链全部声明在根 <code>package.json</code> 的 <code>devDependencies</code>：</p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// package.json</span>
<span class="line">&quot;devDependencies&quot;: {</span>
<span class="line">  &quot;knip&quot;: &quot;^6.4.0&quot;,</span>
<span class="line">  &quot;oxlint&quot;: &quot;^1.59.0&quot;,</span>
<span class="line">  &quot;prettier&quot;: &quot;^3.7.4&quot;,</span>
<span class="line">  &quot;turbo&quot;: &quot;^2.8.21&quot;,</span>
<span class="line">  &quot;typescript&quot;: &quot;5.9.2&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根目录脚本统一委派给 turbo，由 turbo 并行调度各子包：</p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">&quot;scripts&quot;: {</span>
<span class="line">  &quot;build&quot;:       &quot;turbo run build&quot;,</span>
<span class="line">  &quot;dev&quot;:         &quot;turbo run dev&quot;,</span>
<span class="line">  &quot;test&quot;:        &quot;turbo run test -- --run&quot;,</span>
<span class="line">  &quot;lint&quot;:        &quot;turbo run lint&quot;,</span>
<span class="line">  &quot;check-types&quot;: &quot;turbo run check-types&quot;,</span>
<span class="line">  &quot;quality&quot;:     &quot;turbo run quality&quot;,  // 一键质检全项目</span>
<span class="line">  &quot;db:generate&quot;: &quot;turbo run db:generate&quot;,</span>
<span class="line">  &quot;db:push&quot;:     &quot;turbo run db:push&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="二、核心架构-分层单向依赖" tabindex="-1"><a class="header-anchor" href="#二、核心架构-分层单向依赖"><span>二、核心架构：分层单向依赖</span></a></h2><h3 id="依赖拓扑-dag" tabindex="-1"><a class="header-anchor" href="#依赖拓扑-dag"><span>依赖拓扑（DAG）</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">db-schema  ← 纯表定义，零内部依赖</span>
<span class="line">   ↓</span>
<span class="line">  db      ← 依赖 db-schema + drizzle-orm</span>
<span class="line">   ↓</span>
<span class="line">services  ← 依赖 db + db-schema + schemas + agent</span>
<span class="line">   ↓</span>
<span class="line">  apps    ← 依赖 services + db + ui + shared（所有 package）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完整依赖链（从叶到根）：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">db-schema → db → services ──→ apps/app (TanStack Start + tRPC)</span>
<span class="line">                    ↑      └─→ apps/server (Hono REST :9434)</span>
<span class="line">                    ai</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="核心约束" tabindex="-1"><a class="header-anchor" href="#核心约束"><span>核心约束</span></a></h3><p><strong>规则 1：apps/ 只能依赖 packages/，app 之间不得互相依赖。</strong></p><p><code>apps/app</code> 和 <code>apps/server</code> 是两个独立部署单元，各自引用 <code>@repo/*</code> 共享包。如果一个模块两个 app 都需要，放 <code>packages/</code>。</p><p><strong>规则 2：packages/ 之间的依赖必须形成 DAG，禁止循环。</strong></p><p>一个好的包名就是它的契约：</p><ul><li><code>db-schema</code> → 只定义表结构，不导入任何项目内包</li><li><code>db</code> → 只导入 <code>db-schema</code>，提供 DAO</li><li><code>services</code> → 聚合 db + schemas + agent，编排业务</li></ul><p><strong>规则 3：内部包用 <code>workspace:*</code> 协议，必须标记 <code>&quot;private&quot;: true</code>。</strong></p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/services/package.json</span>
<span class="line">&quot;dependencies&quot;: {</span>
<span class="line">  &quot;@repo/db&quot;:        &quot;workspace:*&quot;,  // 由包管理器解析为本地路径</span>
<span class="line">  &quot;@repo/db-schema&quot;: &quot;workspace:*&quot;,</span>
<span class="line">  // ...</span>
<span class="line">}</span>
<span class="line">&quot;private&quot;: true  // 防止意外发布到 npm</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="三、turborepo-任务编排" tabindex="-1"><a class="header-anchor" href="#三、turborepo-任务编排"><span>三、Turborepo 任务编排</span></a></h2><h3 id="turbo-json-核心配置" tabindex="-1"><a class="header-anchor" href="#turbo-json-核心配置"><span>turbo.json 核心配置</span></a></h3><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">{</span>
<span class="line">  &quot;tasks&quot;: {</span>
<span class="line">    &quot;build&quot;: {</span>
<span class="line">      &quot;dependsOn&quot;: [&quot;^build&quot;],                // 先构建所有依赖包</span>
<span class="line">      &quot;inputs&quot;: [&quot;$TURBO_DEFAULT$&quot;, &quot;.env*&quot;],  // 变更检测范围</span>
<span class="line">      &quot;outputs&quot;: [&quot;dist/**&quot;, &quot;.next/**&quot;]        // 缓存输出目录</span>
<span class="line">    },</span>
<span class="line">    &quot;test&quot;: {</span>
<span class="line">      &quot;dependsOn&quot;: [&quot;^test&quot;],</span>
<span class="line">      &quot;outputs&quot;: []</span>
<span class="line">    },</span>
<span class="line">    &quot;dev&quot;: {</span>
<span class="line">      &quot;cache&quot;: false,       // 开发服务器不缓存</span>
<span class="line">      &quot;persistent&quot;: true    // 长期运行进程</span>
<span class="line">    }</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="build-语法详解" tabindex="-1"><a class="header-anchor" href="#build-语法详解"><span><code>^build</code> 语法详解</span></a></h3><p><code>^</code> 是 Turbo 的核心语法——&quot;先构建本包的拓扑依赖&quot;：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">执行 turbo run build 时：</span>
<span class="line"></span>
<span class="line">1. Turbo 读取每个包的 package.json，解析 workspace:* 依赖</span>
<span class="line">2. 构建依赖图：app → services → db → db-schema</span>
<span class="line">3. 按拓扑逆序执行：先 db-schema，再 db，再 services，最后 app</span>
<span class="line">4. 独立包并行执行（如 agent 和 ai 可同时 build）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>手写 <code>dependsOn</code> 时不需要列出每个依赖包名——<code>^</code> 自动完成拓扑排序。</p><h3 id="缓存命中" tabindex="-1"><a class="header-anchor" href="#缓存命中"><span>缓存命中</span></a></h3><p>Turbo 对任务输出做内容寻址缓存：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">第一次 build → 计算 inputs hash → 写入缓存</span>
<span class="line">第二次 build → 匹配 inputs hash → 直接回放 outputs，跳过执行</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>缓存默认存储在 <code>node_modules/.cache/turbo</code>，可通过 <code>--remote-cache</code> 分享到团队。</p><hr><h2 id="四、共享配置的-dry-设计" tabindex="-1"><a class="header-anchor" href="#四、共享配置的-dry-设计"><span>四、共享配置的 DRY 设计</span></a></h2><h3 id="typescript-配置" tabindex="-1"><a class="header-anchor" href="#typescript-配置"><span>TypeScript 配置</span></a></h3><p>将 <code>tsconfig</code> 抽取为独立包：</p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/typescript-config/package.json</span>
<span class="line">{</span>
<span class="line">  &quot;name&quot;: &quot;@repo/typescript-config&quot;,</span>
<span class="line">  &quot;exports&quot;: {</span>
<span class="line">    &quot;./base.json&quot;: &quot;./base.json&quot;,</span>
<span class="line">    &quot;./react-library.json&quot;: &quot;./react-library.json&quot;</span>
<span class="line">  }</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其他包通过 <code>workspace:*</code> 引用：</p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/db/package.json</span>
<span class="line">&quot;devDependencies&quot;: {</span>
<span class="line">  &quot;@repo/typescript-config&quot;: &quot;workspace:*&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/db/tsconfig.json</span>
<span class="line">{</span>
<span class="line">  &quot;extends&quot;: &quot;@repo/typescript-config/base.json&quot;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="同理-oxlint-配置" tabindex="-1"><a class="header-anchor" href="#同理-oxlint-配置"><span>同理 oxlint 配置</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">packages/oxlint-config/</span>
<span class="line">├── oxlintrc.json         # React 项目用（apps/app）</span>
<span class="line">└── non-react.oxlintrc.json  # Node 项目用（packages/*）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>每个包在自己的 <code>package.json</code> 中指定：</p><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/db/package.json</span>
<span class="line">&quot;lint&quot;: &quot;oxlint --config ../oxlint-config/non-react.oxlintrc.json src/&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>修改一处配置，13 个子包全部生效。</p><hr><h2 id="五、包导出控制-barrel-export" tabindex="-1"><a class="header-anchor" href="#五、包导出控制-barrel-export"><span>五、包导出控制（Barrel Export）</span></a></h2><h3 id="规则-每个包通过-exports-字段控制-api-面" tabindex="-1"><a class="header-anchor" href="#规则-每个包通过-exports-字段控制-api-面"><span>规则：每个包通过 <code>exports</code> 字段控制 API 面</span></a></h3><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// packages/db/package.json</span>
<span class="line">&quot;exports&quot;: {</span>
<span class="line">  &quot;.&quot;: &quot;./src/index.ts&quot;,        // 公开 API</span>
<span class="line">  &quot;./dao&quot;: &quot;./src/dao/index.ts&quot;  // 子路径导出</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="index-ts-只做-re-export" tabindex="-1"><a class="header-anchor" href="#index-ts-只做-re-export"><span>index.ts 只做 re-export</span></a></h3><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// packages/db/src/index.ts —— 公有契约</span></span>
<span class="line"><span class="token keyword">export</span> <span class="token punctuation">{</span> createDb <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;./client&#39;</span></span>
<span class="line"><span class="token comment">// 不导出内部实现细节</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用方只能通过包名访问公开 API：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// ✅ 正确：通过公开 API</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> createDb <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@repo/db&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ❌ 禁止：穿透到内部路径</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> something <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@repo/db/src/internal/secret&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="六、代码质量体系" tabindex="-1"><a class="header-anchor" href="#六、代码质量体系"><span>六、代码质量体系</span></a></h2><h3 id="每个包的三合一质检链" tabindex="-1"><a class="header-anchor" href="#每个包的三合一质检链"><span>每个包的三合一质检链</span></a></h3><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">&quot;quality&quot;: &quot;bun run check-types &amp;&amp; bun run lint &amp;&amp; bun run test&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><table><thead><tr><th>步骤</th><th>命令</th><th>作用</th></tr></thead><tbody><tr><td>类型检查</td><td><code>tsc --noEmit</code></td><td>确保类型安全</td></tr><tr><td>Lint</td><td><code>oxlint</code></td><td>代码风格 + 潜在 bug</td></tr><tr><td>测试</td><td><code>vitest run</code></td><td>单元/集成测试</td></tr></tbody></table><h3 id="根目录一键质检" tabindex="-1"><a class="header-anchor" href="#根目录一键质检"><span>根目录一键质检</span></a></h3><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre><code class="language-bash"><span class="line">bun quality    <span class="token comment"># turbo 并行执行所有子包的 quality</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>Turbo 自动并行调度：db-schema 和 ai 的类型检查可以同时跑，互不阻塞。</p><h3 id="额外防线" tabindex="-1"><a class="header-anchor" href="#额外防线"><span>额外防线</span></a></h3><table><thead><tr><th>工具</th><th>命令</th><th>作用</th></tr></thead><tbody><tr><td>Knip</td><td><code>bun run knip</code></td><td>检测未使用的导出和依赖</td></tr><tr><td>Prettier</td><td><code>bun run format</code></td><td>统一格式化</td></tr></tbody></table><hr><h2 id="七、应用层设计" tabindex="-1"><a class="header-anchor" href="#七、应用层设计"><span>七、应用层设计</span></a></h2><h3 id="apps-app-—-tanstack-start-ssr-前端" tabindex="-1"><a class="header-anchor" href="#apps-app-—-tanstack-start-ssr-前端"><span>apps/app — TanStack Start SSR 前端</span></a></h3><div class="language-jsonc line-numbers-mode" data-highlighter="prismjs" data-ext="jsonc"><pre><code class="language-jsonc"><span class="line">// apps/app/package.json</span>
<span class="line">&quot;dependencies&quot;: {</span>
<span class="line">  &quot;@repo/db&quot;:        &quot;workspace:*&quot;,</span>
<span class="line">  &quot;@repo/db-schema&quot;: &quot;workspace:*&quot;,</span>
<span class="line">  &quot;@repo/services&quot;:   &quot;workspace:*&quot;,</span>
<span class="line">  &quot;@repo/shared&quot;:     &quot;workspace:*&quot;,</span>
<span class="line">  &quot;@repo/ui&quot;:         &quot;workspace:*&quot;,</span>
<span class="line">  // 外部依赖</span>
<span class="line">  &quot;@tanstack/react-start&quot;: &quot;...&quot;,</span>
<span class="line">  &quot;@trpc/client&quot;: &quot;...&quot;,</span>
<span class="line">  &quot;zustand&quot;: &quot;...&quot;,</span>
<span class="line">  &quot;react-hook-form&quot;: &quot;...&quot;,</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>技术栈：TanStack Start (Vite + Nitro SSR + React 19) → tRPC API → Better Auth (GitHub OAuth) → shadcn/ui + Tailwind v4 → Zustand v5。</p><h3 id="apps-server-—-hono-rest-服务器" tabindex="-1"><a class="header-anchor" href="#apps-server-—-hono-rest-服务器"><span>apps/server — Hono REST 服务器</span></a></h3><p>独立的 Hono 服务器 (:9434)，为外部 REST API 消费者提供服务。无鉴权。委托给同一 <code>@repo/services</code>。</p><h3 id="两个-app-共享同一套业务逻辑" tabindex="-1"><a class="header-anchor" href="#两个-app-共享同一套业务逻辑"><span>两个 app 共享同一套业务逻辑</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">apps/app  ─→ @repo/services ─→ @repo/db ─→ PostgreSQL</span>
<span class="line">apps/server ─→ @repo/services ─→ @repo/db ─→ PostgreSQL</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>services 是唯一的业务逻辑真实来源（single source of truth）。</p><hr><h2 id="八、如何设计一个合理的大仓项目" tabindex="-1"><a class="header-anchor" href="#八、如何设计一个合理的大仓项目"><span>八、如何设计一个合理的大仓项目</span></a></h2><h3 id="先回答三个根本问题" tabindex="-1"><a class="header-anchor" href="#先回答三个根本问题"><span>先回答三个根本问题</span></a></h3><p><strong>① 你的应用有几个可部署单元？</strong></p><p>每一个独立部署、独立启动的进程就是一个 <code>apps/*</code>：</p><ul><li>1 个前端 + 1 个后端 = 2 个 app</li><li>再加 1 个文档站 + 1 个 CLI = 4 个 app</li></ul><p><strong>② 哪些代码被多个 app 共享？</strong></p><p>关键标准：<strong>一个模块被 ≥2 个 app 用到，它就进 <code>packages/</code></strong>。</p><p>常见候选：</p><ul><li>数据库表定义 → <code>packages/db-schema</code></li><li>API 类型/校验 → <code>packages/schemas</code></li><li>业务逻辑 → <code>packages/services</code></li><li>UI 组件 → <code>packages/ui</code></li><li>共享常量 → <code>packages/shared</code></li></ul><p><strong>③ 依赖方向是什么？</strong></p><p>画箭头图，严格保证从叶到根，绝不允许形成循环。</p><h3 id="十个设计决策" tabindex="-1"><a class="header-anchor" href="#十个设计决策"><span>十个设计决策</span></a></h3><table><thead><tr><th>#</th><th>决策点</th><th>推荐</th><th>说明</th></tr></thead><tbody><tr><td>1</td><td>包管理器</td><td><strong>pnpm</strong> 或 <strong>bun</strong></td><td>pnpm 生态最大、依赖隔离最严；bun 速度最快。不推荐新项目用 yarn</td></tr><tr><td>2</td><td>任务编排</td><td><strong>Turborepo</strong></td><td>缓存 + 并行 + 配置最简单。Nx 功能强但复杂，Lage 适合大团队</td></tr><tr><td>3</td><td>版本策略</td><td>固定版本（小团队）</td><td>统一升级，简单可控。发布 npm 包的场景才需要独立版本 + Changesets</td></tr><tr><td>4</td><td>命名规范</td><td><code>@repo/*</code></td><td>清晰区分内部包和外部依赖</td></tr><tr><td>5</td><td>目录结构</td><td><code>apps/</code> + <code>packages/</code></td><td>经典二分法，最易理解。三分法可加 <code>tools/</code></td></tr><tr><td>6</td><td>共享配置</td><td>抽取为独立包</td><td>一改全改，消除跨包复制粘贴</td></tr><tr><td>7</td><td>包导出控制</td><td><code>package.json</code> <code>&quot;exports&quot;</code> 字段</td><td>严格控制公有 API</td></tr><tr><td>8</td><td>循环检测</td><td>Knip + ESLint <code>import/no-cycle</code></td><td>CI 中强制阻断</td></tr><tr><td>9</td><td>CI/CD</td><td><code>turbo prune</code></td><td>按变更范围选择性构建，大幅减时</td></tr><tr><td>10</td><td>Docker</td><td>多阶段构建 + <code>turbo prune</code></td><td>每个 app 一个 Dockerfile，只打包需要的依赖</td></tr></tbody></table><h3 id="设计过程" tabindex="-1"><a class="header-anchor" href="#设计过程"><span>设计过程</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">第一步：画部署单元</span>
<span class="line">  → 列出所有独立进程 → 每个进程一个 apps/*</span>
<span class="line"></span>
<span class="line">第二步：找出共享代码</span>
<span class="line">  → 标记被 ≥2 个 app 使用的模块 → 每个模块一个 packages/*</span>
<span class="line"></span>
<span class="line">第三步：画依赖箭头</span>
<span class="line">  → 从 apps 向下追溯到叶节点 → 验证是 DAG，无环</span>
<span class="line"></span>
<span class="line">第四步：配置工具链</span>
<span class="line">  → 选包管理器 → 配 workspace → 加 turbo.json → 抽共享配置</span>
<span class="line"></span>
<span class="line">第五步：建立质量门禁</span>
<span class="line">  → 每个包配 quality 脚本 → 根 turbo quality → CI 中强制执行</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="常见陷阱" tabindex="-1"><a class="header-anchor" href="#常见陷阱"><span>常见陷阱</span></a></h3><p><strong>❌ 循环依赖</strong></p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">services → db → services  ← 死锁！</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div></div></div><p>解法：抽取共同部分到第三个包，或用依赖反转。</p><p><strong>❌ apps/ 之间互相依赖</strong></p><p><code>apps/app</code> 不能依赖 <code>apps/server</code>。共享代码放 <code>packages/</code>。</p><p><strong>❌ &quot;厨房水槽&quot; 包</strong></p><p>一个 <code>@repo/utils</code> 放 200 个不相关函数。应拆成 <code>@repo/logger</code>、<code>@repo/crypto</code> 等语义明确的独立包。</p><p><strong>❌ 内部包未标记 <code>&quot;private&quot;: true</code></strong></p><p>不打算发布到 npm，忘了加可能导致意外发布。</p><p><strong>❌ TypeScript 版本漂移</strong></p><p>各包用不同 TS 版本。应在根 <code>package.json</code> 统一版本，通过共享 tsconfig 约束。</p><p><strong>❌ 过早抽取</strong></p><p>一个模块只被一个地方用时不要急着放 <code>packages/</code>。至少等出现第二个消费者再抽取。</p><h3 id="心法" tabindex="-1"><a class="header-anchor" href="#心法"><span>心法</span></a></h3><p>&gt; <strong>先画依赖图，再建目录树。依赖方向决定可维护性，工具链决定开发体验。</strong></p><p>Monorepo 的价值不在&quot;把代码放在一起&quot;，而在&quot;强制暴露模块边界&quot;。每一个 <code>package.json</code> 的 <code>exports</code> 字段都是一份契约——它声明了这个包对外的承诺。好的 monorepo 让边界显式化，坏的 monorepo 让边界更加模糊。</p>`,112)])])}const c=n(t,[["render",d]]),r=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%BB%A3%E8%BE%BE%E7%BD%97%E6%96%AF/Momorepo/Monorepo%20%E8%AE%BE%E8%AE%A1%E5%88%86%E6%9E%90.html","title":"Monorepo 设计分析","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/代达罗斯/Momorepo/Monorepo 设计分析.md"}');export{c as comp,r as data};
