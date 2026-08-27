import{_ as s,c as e,b as a,o as t}from"./app-tSWxoOhA.js";const l={};function i(r,n){return t(),e("div",null,[...n[0]||(n[0]=[a(`<h1 id="barrel-export" tabindex="-1"><a class="header-anchor" href="#barrel-export"><span>Barrel Export</span></a></h1><hr><h2 id="场景分析" tabindex="-1"><a class="header-anchor" href="#场景分析"><span>场景分析</span></a></h2><h3 id="桶导出定义" tabindex="-1"><a class="header-anchor" href="#桶导出定义"><span>桶导出定义</span></a></h3><p>桶导出（Barrel Export）是一种模块组织模式：每个目录下的 <code>index.ts</code> 文件<strong>仅</strong>负责将该目录中所有公共模块通过 <code>export *</code> 统一 re-export，对外暴露单一入口。</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line">目录结构：</span>
<span class="line">  components<span class="token operator">/</span></span>
<span class="line">    Button<span class="token punctuation">.</span>tsx          ← 组件实现</span>
<span class="line">    Modal<span class="token punctuation">.</span>tsx           ← 组件实现</span>
<span class="line">    Tooltip<span class="token punctuation">.</span>tsx         ← 组件实现</span>
<span class="line">    index<span class="token punctuation">.</span>ts            ← 桶（barrel）：<span class="token keyword">export</span> <span class="token operator">*</span> <span class="token keyword">from</span> <span class="token string">&#39;./Button&#39;</span> <span class="token operator">...</span></span>
<span class="line"></span>
<span class="line">使用时：</span>
<span class="line">  <span class="token keyword">import</span> <span class="token punctuation">{</span> Button<span class="token punctuation">,</span> Modal<span class="token punctuation">,</span> Tooltip <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/components&#39;</span></span>
<span class="line">  <span class="token comment">// 而非：</span></span>
<span class="line">  <span class="token keyword">import</span> <span class="token punctuation">{</span> Button <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/components/Button&#39;</span></span>
<span class="line">  <span class="token keyword">import</span> <span class="token punctuation">{</span> Modal <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;@/components/Modal&#39;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="设计原则" tabindex="-1"><a class="header-anchor" href="#设计原则"><span>设计原则</span></a></h3><p>飞书文档 + 现有 Skill（<code>barrel-export-best-practice</code>）存在8 条检查规则：</p><table><thead><tr><th>#</th><th>原则</th><th>核心要求</th><th>可判定性</th></tr></thead><tbody><tr><td>1</td><td>每个目录有 index 文件</td><td>存在导出文件的目录必须有 <code>index.ts</code></td><td><strong>脚本化</strong>（glob 检查）</td></tr><tr><td>2</td><td>仅包含 re-export 语句</td><td><code>index.ts</code> 只允许 <code>export * from &#39;./...&#39;</code>，不含业务逻辑</td><td><strong>脚本化</strong>（AST 分析）</td></tr><tr><td>3</td><td>禁止默认导出</td><td>桶导出文件中禁止 <code>export default</code></td><td><strong>脚本化</strong>（AST 分析）</td></tr><tr><td>4</td><td>使用相对路径</td><td>导出路径必须以 <code>./</code> 或 <code>../</code> 开头</td><td><strong>脚本化</strong>（字符串匹配）</td></tr><tr><td>5</td><td>无循环依赖</td><td>桶导出文件不得与被导出模块形成循环引用</td><td><strong>脚本化</strong>（依赖图分析）</td></tr><tr><td>6</td><td>导出项与实际文件一致</td><td>导出的模块名必须对应真实存在的文件</td><td><strong>脚本化</strong>（文件系统校验）</td></tr><tr><td>7</td><td>解决命名冲突</td><td>同名导出冲突时在原文件重命名</td><td><strong>LLM 评估</strong>（需语义判断）</td></tr><tr><td>8</td><td>无重复导出</td><td>同一标识符不得被多次导出</td><td><strong>脚本化</strong>（去重检查）</td></tr></tbody></table><h3 id="与其他-archetype-的交叉、区别" tabindex="-1"><a class="header-anchor" href="#与其他-archetype-的交叉、区别"><span>与其他 Archetype 的交叉、区别</span></a></h3><p>桶导出作为基础设施模式，会与多个 Archetype 存在约束关系。</p><p>桶导出与 Form 等组件领域分析有本质不同：</p><table><thead><tr><th>维度</th><th>组件领域</th><th>桶导出</th></tr></thead><tbody><tr><td><strong>作用域</strong></td><td>特定组件领域</td><td>全项目跨领域</td></tr><tr><td><strong>约束对象</strong></td><td>具体组件实现</td><td><code>index.ts</code> 文件（每个目录）</td></tr><tr><td><strong>工具化程度</strong></td><td>部分可脚本化</td><td><strong>高度可脚本化</strong>（barrelsby 自动生成、oxlint 规则检查）</td></tr><tr><td><strong>违规影响</strong></td><td>局部</td><td>全局（导入路径混乱、循环依赖风险）</td></tr></tbody></table><hr><h2 id="crate-设计" tabindex="-1"><a class="header-anchor" href="#crate-设计"><span>Crate 设计</span></a></h2><h3 id="crate-分层" tabindex="-1"><a class="header-anchor" href="#crate-分层"><span>Crate 分层</span></a></h3><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">barrel-standard (utility)  ←── 规范定义层</span>
<span class="line">    │</span>
<span class="line">    │ 规范驱动</span>
<span class="line">    ▼</span>
<span class="line">barrel-checker (utility)   ←── 检查执行层</span>
<span class="line">    │</span>
<span class="line">    │ 发现问题 → 触发修复</span>
<span class="line">    ▼</span>
<span class="line">barrel-generator (utility) ←── 生成修复层</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><table><thead><tr><th>层级</th><th>说明</th></tr></thead><tbody><tr><td><strong>规范层</strong></td><td>定义桶导出的规则和标准（文档/配置）</td></tr><tr><td><strong>检查层</strong></td><td>自动化检查桶导出合规性（CLI/oxlint 规则）</td></tr><tr><td><strong>生成层</strong></td><td>自动生成/修复桶导出文件（barrelsby / check-barrel-export skill）</td></tr></tbody></table><h3 id="crate-详细定义" tabindex="-1"><a class="header-anchor" href="#crate-详细定义"><span>Crate 详细定义</span></a></h3><h4 id="crate-a-barrel-standard" tabindex="-1"><a class="header-anchor" href="#crate-a-barrel-standard"><span>Crate A: <code>barrel-standard</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>barrel-standard</code></td></tr><tr><td><strong>type</strong></td><td><code>utility</code></td></tr><tr><td><strong>responsibility</strong></td><td>桶导出规范的权威定义：8 条检查规则的详细描述、合规示例与反模式文档、与其他 Archetype（no-re-export、one-component-per-file）的边界约定、<code>export *</code> vs <code>export { }</code> 的唯一例外场景（命名冲突时的具名重导出）</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;rules&quot;: 8, &quot;scriptable&quot;: 7, &quot;tools&quot;: [&quot;barrelsby&quot;, &quot;check-barrel-export&quot;], &quot;related_archetypes&quot;: [&quot;no-re-export-best-practice&quot;, &quot;one-component-per-file-best-practice&quot;, &quot;component-unit-best-practice&quot;]}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li>桶导出规范文档（标准化 <code>.md</code>）</li><li>合规示例代码（<code>best-practice-examples/</code> 目录）</li><li>反模式目录（<code>anti-patterns/</code> 目录）</li><li>与其他 Archetype 的交叉引用映射</li></ul><h4 id="crate-b-barrel-checker" tabindex="-1"><a class="header-anchor" href="#crate-b-barrel-checker"><span>Crate B: <code>barrel-checker</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>barrel-checker</code></td></tr><tr><td><strong>type</strong></td><td><code>utility</code></td></tr><tr><td><strong>responsibility</strong></td><td>桶导出合规性自动化检查引擎：基于 oxlint 自定义规则实现的静态检查（规则 1-6、8）、<code>check-barrel-export</code> skill 的自动化执行逻辑、检查报告生成（违规文件路径 + 违规类型 + 修复建议）</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;implementation&quot;: [&quot;oxlint-custom-rules&quot;, &quot;skill-check-barrel-export&quot;], &quot;coverage&quot;: &quot;7/8 rules (87.5%)&quot;, &quot;uncovered&quot;: &quot;rule-7 (naming conflict resolution)&quot;}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li>oxlint 自定义规则插件</li><li><code>check-barrel-export</code> skill 执行脚本</li><li>检查结果的数据结构</li></ul><h4 id="crate-c-barrel-generator" tabindex="-1"><a class="header-anchor" href="#crate-c-barrel-generator"><span>Crate C: <code>barrel-generator</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>barrel-generator</code></td></tr><tr><td><strong>type</strong></td><td><code>utility</code></td></tr><tr><td><strong>responsibility</strong></td><td>桶导出文件自动生成与修复：barrelsby CLI 的集成封装、<code>--delete</code> 模式自动清理过期导出、&quot;检查 + 修复&quot; 一键流水线（先运行 barrel-checker 发现问题，再运行 barrel-generator 自动修复）</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;package&quot;: &quot;barrelsby&quot;, &quot;modes&quot;: [&quot;generate&quot;, &quot;delete&quot;, &quot;check-and-fix&quot;], &quot;integration&quot;: &quot;npm scripts / bun run&quot;}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li><code>barrelsby</code> 配置模板</li><li>npm script 封装</li></ul><hr><h2 id="archetype-契约定义" tabindex="-1"><a class="header-anchor" href="#archetype-契约定义"><span>Archetype 契约定义</span></a></h2><h3 id="总览" tabindex="-1"><a class="header-anchor" href="#总览"><span>总览</span></a></h3><table><thead><tr><th>Archetype</th><th>Scope</th><th>约束对象（目标 Crate）</th><th>Condition 数</th><th>说明</th></tr></thead><tbody><tr><td><strong><code>barrel-export-best-practice</code></strong></td><td><code>crate</code></td><td><code>barrel-standard</code>、<code>barrel-checker</code>、<code>barrel-generator</code></td><td>8</td><td>桶导出文件组织契约</td></tr></tbody></table><h3 id="完整定义" tabindex="-1"><a class="header-anchor" href="#完整定义"><span>完整定义</span></a></h3><p><strong>Name</strong>: <code>barrel-export-best-practice</code><strong>Scope</strong>: <code>crate</code><strong>Concept</strong>: 确保每个有导出文件的目录通过 <code>index.ts</code> 桶文件提供统一入口，桶文件仅做 <code>export *</code> re-export，不含业务逻辑、默认导出、别名路径，且不引入循环依赖</p><h5 id="c-1-每个目录有-index-文件" tabindex="-1"><a class="header-anchor" href="#c-1-每个目录有-index-文件"><span>C-1: 每个目录有 index 文件</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-directory-has-index</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 1</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">存在导出文件（含 .ts/.tsx 模块文件）的目录必须包含 index.ts 桶导出文件。</span>
<span class="line">仅含非导出资源（如 __tests__/、stories/、assets/）的目录可豁免。</span>
<span class="line">空目录或仅含 README.md 的目录可豁免。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  components/</span>
<span class="line">    Button.tsx</span>
<span class="line">    Modal.tsx</span>
<span class="line">    // 无 index.ts</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  components/</span>
<span class="line">    Button.tsx</span>
<span class="line">    Modal.tsx</span>
<span class="line">    index.ts  ← export * from &#39;./Button&#39;; export * from &#39;./Modal&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-2-仅包含-re-export-语句" tabindex="-1"><a class="header-anchor" href="#c-2-仅包含-re-export-语句"><span>C-2: 仅包含 re-export 语句</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-re-export-only</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 2</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">index.ts 文件只允许包含 \`export * from &#39;./...&#39;\` 语句。禁止出现：</span>
<span class="line">- 变量声明（const/let）</span>
<span class="line">- 函数/类定义（function/class）</span>
<span class="line">- import 语句后跟使用（如 import + console.log）</span>
<span class="line">- 任何形式的业务逻辑</span>
<span class="line"></span>
<span class="line">唯一的例外：当 \`export *\` 导致命名冲突时，可在原模块文件中使用具名重导出</span>
<span class="line">（export { Foo as FooA }），而非在 index.ts 中解决。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export const API_BASE = &#39;/api/v1&#39;</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export { Button } from &#39;./Button&#39;  // 显式命名导出</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line">  export * from &#39;./Modal&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-3-禁止默认导出" tabindex="-1"><a class="header-anchor" href="#c-3-禁止默认导出"><span>C-3: 禁止默认导出</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-no-default-export</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 3</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">桶导出文件中禁止使用 export default。所有模块必须通过命名导出的方式被 re-export。</span>
<span class="line">如果原模块使用了 export default，必须先在原模块改为命名导出，</span>
<span class="line">然后在 index.ts 中使用 \`export * from &#39;./...&#39;\`。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line">  export default Button</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  // Button.tsx 中：export { Button }</span>
<span class="line">  // index.ts 中：export * from &#39;./Button&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-4-使用相对路径" tabindex="-1"><a class="header-anchor" href="#c-4-使用相对路径"><span>C-4: 使用相对路径</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-relative-path</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 4</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">桶导出中的所有路径必须以 \`./\` 或 \`../\` 开头。禁止使用：</span>
<span class="line">- 别名路径（如 \`@/components/Button\`）</span>
<span class="line">- 绝对路径（如 \`src/components/Button\`）</span>
<span class="line">- 包名路径（如 \`@repo/ui/Button\`）</span>
<span class="line"></span>
<span class="line">原因：别名路径在 monorepo 中可能指向不同包的实际路径，</span>
<span class="line">导致桶导出文件不可移植。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export * from &#39;@/components/Button&#39;</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-5-无循环依赖" tabindex="-1"><a class="header-anchor" href="#c-5-无循环依赖"><span>C-5: 无循环依赖</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-no-circular-dependency</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 5</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">桶导出文件不得与被导出模块形成循环引用。即：</span>
<span class="line">index.ts export → A.ts，而 A.ts import → 同级或上级的 index.ts。</span>
<span class="line"></span>
<span class="line">循环依赖的典型路径：</span>
<span class="line">  index.ts → export * from &#39;./Button&#39;</span>
<span class="line">  Button.tsx → import { Modal } from &#39;./index&#39;  ← 循环！</span>
<span class="line"></span>
<span class="line">检测方法：从 index.ts 出发构建依赖图，检查是否存在回到自身的路径。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  // index.ts</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line">  // Button.tsx</span>
<span class="line">  import { Modal } from &#39;./index&#39;  // 引用了桶文件</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  // Button.tsx</span>
<span class="line">  import { Modal } from &#39;./Modal&#39;  // 直接引用目标文件</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-6-导出项与实际文件一致" tabindex="-1"><a class="header-anchor" href="#c-6-导出项与实际文件一致"><span>C-6: 导出项与实际文件一致</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-export-target-exists</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 6</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">桶导出中引用的每个模块名必须对应真实存在的文件。文件扩展名可省略</span>
<span class="line">（TypeScript 自动解析 .ts/.tsx/.js）。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export * from &#39;./Foo&#39;  // Foo.ts 不存在</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  export * from &#39;./Button&#39;  // Button.tsx 存在</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-7-解决命名冲突" tabindex="-1"><a class="header-anchor" href="#c-7-解决命名冲突"><span>C-7: 解决命名冲突</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-resolve-naming-conflict</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 7</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">当多个模块通过 \`export *\` 导出同名标识符时，必须在原模块文件中解决冲突，</span>
<span class="line">而非在 index.ts 中使用具名导出规避。</span>
<span class="line"></span>
<span class="line">解决方案优先级：</span>
<span class="line">1. 在原模块中重命名导出（如 \`export { Foo as FooA }\`）</span>
<span class="line">2. 若无法修改原模块（第三方代码），在 index.ts 中使用显式重导出：</span>
<span class="line">   \`export { Foo as FooA } from &#39;./ModuleA&#39;\`</span>
<span class="line">   （这是唯一允许 \`export { } from\` 的场景）</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  // 两个模块都导出了 type Foo，导致 import 方类型歧义</span>
<span class="line">  export * from &#39;./ModuleA&#39;  // 导出 Foo</span>
<span class="line">  export * from &#39;./ModuleB&#39;  // 也导出 Foo</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  // ModuleA/Foo.ts 中：</span>
<span class="line">  export type { Foo as FooA }</span>
<span class="line">  // 或 index.ts 中（仅当无法修改原模块）：</span>
<span class="line">  export { type Foo as FooA } from &#39;./ModuleA&#39;</span>
<span class="line">  export * from &#39;./ModuleB&#39;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-8-无重复导出" tabindex="-1"><a class="header-anchor" href="#c-8-无重复导出"><span>C-8: 无重复导出</span></a></h5><ul><li><strong>ID</strong>: <code>c-barrel-no-duplicate-export</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 8</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">同一标识符不得在同一 index.ts 中被多次导出。包括：</span>
<span class="line">- 同一条 \`export * from\` 语句重复出现</span>
<span class="line">- 不同模块导出同名标识符（此时应触发 C-7 命名冲突解决）</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  export * from &#39;./Button&#39;</span>
<span class="line">  export * from &#39;./Button&#39;  // 重复</span>
<span class="line"></span>
<span class="line">✅ 正确: 每个模块只导出一次</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><hr><h2 id="crate与archetype关系" tabindex="-1"><a class="header-anchor" href="#crate与archetype关系"><span>Crate与Archetype关系</span></a></h2><p>目前定义的crate只与当前定义的Archetype有关</p><hr><h2 id="缺口分析" tabindex="-1"><a class="header-anchor" href="#缺口分析"><span>缺口分析</span></a></h2><h3 id="skill-↔-crate-archetype-一致性" tabindex="-1"><a class="header-anchor" href="#skill-↔-crate-archetype-一致性"><span>Skill ↔ Crate/Archetype 一致性</span></a></h3><p>目前是通过skill的最佳实践来创建Crate/Archetype。在未来的迭代中引入通过项目目前已有规范自动创建，可以大幅减少一个新项目接入代达罗斯的成本</p><h3 id="脚本化维度缺口" tabindex="-1"><a class="header-anchor" href="#脚本化维度缺口"><span>脚本化维度缺口</span></a></h3><p>当前都依赖 LLM 执行检查。没有落地为 oxlint 每次检查都消耗 LLM token，且结果非确定性</p><h3 id="工具链缺口" tabindex="-1"><a class="header-anchor" href="#工具链缺口"><span>工具链缺口</span></a></h3><p>飞书文档推荐了 barrelsby，<code>check-barrel-export</code> skill 也引用了它，但项目中没有 <code>barrelsby</code> 依赖、没有配置、没有 npm script。<code>barrel-generator</code> Crate 的&quot;自动生成&quot;能力完全依赖 LLM 手动写 <code>export *</code> 语句</p><p>桶导出检查未集成到 CI pipeline。如果 oxlint 规则落地，可加入 <code>bun quality</code> 或 GitHub Actions 在 PR 阶段自动拦截</p><hr><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考"><span>参考</span></a></h2><p><a href="https://ocn10zycuxwg.feishu.cn/wiki/KrDhw4N2zi1tDpku0JGcPcWOnEg" target="_blank" rel="noopener noreferrer">飞书文档</a><a href="">skill仓库</a></p>`,68)])])}const o=s(l,[["render",i]]),c=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%BB%A3%E8%BE%BE%E7%BD%97%E6%96%AF/%E9%9C%80%E6%B1%82/COD-100/Barrel%20Export.html","title":"Barrel Export","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/代达罗斯/需求/COD-100/Barrel Export.md"}');export{o as comp,c as data};
