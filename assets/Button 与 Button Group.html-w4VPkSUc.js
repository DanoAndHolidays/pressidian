import{_ as s,c as t,b as e,o as a}from"./app-DfSzGDtR.js";const i={};function l(o,n){return a(),t("div",null,[...n[0]||(n[0]=[e(`<h1 id="button-与-button-group" tabindex="-1"><a class="header-anchor" href="#button-与-button-group"><span>Button 与 Button Group</span></a></h1><p>相关文档：<a href="https://ocn10zycuxwg.feishu.cn/wiki/LZ9kwfE7Ai5Ww2kEsidcB8wnnNg" target="_blank" rel="noopener noreferrer">Button</a> <a href="https://ocn10zycuxwg.feishu.cn/wiki/TW6GwSzrCiG8vDk3FgGcYvw9ntf" target="_blank" rel="noopener noreferrer">Button Group</a></p><hr><h2 id="button" tabindex="-1"><a class="header-anchor" href="#button"><span>Button</span></a></h2><p>最基础且最高频使用的交互组件。飞书文档<a href="https://ocn10zycuxwg.feishu.cn/wiki/LZ9kwfE7Ai5Ww2kEsidcB8wnnNg" target="_blank" rel="noopener noreferrer">Button</a>已经建立了完整的能力模型（核心/表现/扩展/工程四层）和 6 条设计原则</p><p>由于此组件的实现较为简单，这里直接附上源码：</p><div class="language-TypeScript line-numbers-mode" data-highlighter="prismjs" data-ext="TypeScript"><pre><code class="language-TypeScript"><span class="line">import { type ButtonHTMLAttributes, forwardRef } from &quot;react&quot;;</span>
<span class="line">import { cn } from &quot;@/lib/utils&quot;;</span>
<span class="line"></span>
<span class="line">const variants = {</span>
<span class="line">  default: &quot;bg-gray-900 text-white hover:bg-gray-800&quot;,</span>
<span class="line">  outline: &quot;border border-gray-200 bg-white hover:bg-gray-50&quot;,</span>
<span class="line">  ghost: &quot;hover:bg-gray-100&quot;,</span>
<span class="line">  destructive: &quot;bg-red-600 text-white hover:bg-red-700&quot;,</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">const sizes = {</span>
<span class="line">  sm: &quot;h-8 px-3 text-xs&quot;,</span>
<span class="line">  default: &quot;h-9 px-4 text-sm&quot;,</span>
<span class="line">  lg: &quot;h-10 px-6 text-base&quot;,</span>
<span class="line">};</span>
<span class="line"></span>
<span class="line">interface ButtonProps extends ButtonHTMLAttributes&lt;HTMLButtonElement&gt; {</span>
<span class="line">  variant?: keyof typeof variants;</span>
<span class="line">  size?: keyof typeof sizes;</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">export const Button = forwardRef&lt;HTMLButtonElement, ButtonProps&gt;(</span>
<span class="line">  ({ className, variant = &quot;default&quot;, size = &quot;default&quot;, ...props }, ref) =&gt; (</span>
<span class="line">    &lt;button</span>
<span class="line">      ref={ref}</span>
<span class="line">      className={cn(</span>
<span class="line">        &quot;inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:pointer-events-none disabled:opacity-50&quot;,</span>
<span class="line">        variants[variant],</span>
<span class="line">        sizes[size],</span>
<span class="line">        className,</span>
<span class="line">      )}</span>
<span class="line">      {...props}</span>
<span class="line">    /&gt;</span>
<span class="line">  ),</span>
<span class="line">);</span>
<span class="line">Button.displayName = &quot;Button&quot;;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="模型能力" tabindex="-1"><a class="header-anchor" href="#模型能力"><span>模型能力</span></a></h3><table><thead><tr><th>层级</th><th>职责</th><th>包含要素</th></tr></thead><tbody><tr><td><strong>核心能力</strong></td><td>Button &quot;做什么&quot;</td><td>行为触发（click/submit/reset）、原生 button 行为、disabled 状态控制</td></tr><tr><td><strong>表现能力</strong></td><td>Button &quot;长什么样&quot;</td><td>variant（6 种视觉变体）、size（8 级尺寸）、内容表达（Icon/With Icon/Rounded/Spinner）</td></tr><tr><td><strong>扩展能力</strong></td><td>不改变核心语义的使用方式扩展</td><td>Link（asChild）、Button Group（组合能力）</td></tr><tr><td><strong>工程能力</strong></td><td>可维护性与可扩展性</td><td>API 命名规范（camelCase + 双单词）、原生属性兼容、组件边界控制</td></tr></tbody></table><h3 id="设计原则" tabindex="-1"><a class="header-anchor" href="#设计原则"><span>设计原则</span></a></h3><table><thead><tr><th>#</th><th>原则</th><th>核心要求</th><th>可判定性</th></tr></thead><tbody><tr><td>1</td><td>原生语义优先</td><td>保留 <code>&amp;lt;button&amp;gt;</code> 的 type/disabled/onClick 语义</td><td>脚本化</td></tr><tr><td>2</td><td>行为与表现分离</td><td>variant/size 只影响视觉，不影响行为</td><td>LLM 评估</td></tr><tr><td>3</td><td>variant 驱动</td><td>所有视觉变体通过统一 <code>variant</code> prop 表达</td><td>脚本化</td></tr><tr><td>4</td><td>API 与原生属性边界</td><td>自定义属性不得与 HTML 原生属性冲突</td><td>脚本化+LLM</td></tr><tr><td>5</td><td>属性命名规范</td><td>camelCase + 双单词语义</td><td>脚本化</td></tr><tr><td>6</td><td>组件边界与职责控制</td><td>Button 只负责单一交互触发，组合能力独立拆分</td><td>LLM 评估</td></tr></tbody></table><h3 id="crate-定义" tabindex="-1"><a class="header-anchor" href="#crate-定义"><span>Crate 定义</span></a></h3><p>&gt; metadata仅作参考</p><h4 id="crate-a-button-core" tabindex="-1"><a class="header-anchor" href="#crate-a-button-core"><span>Crate A: <code>button-core</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>button-core</code></td></tr><tr><td><strong>type</strong></td><td><code>library</code></td></tr><tr><td><strong>responsibility</strong></td><td>封装 Button 组件核心实现：variant/size 系统、原生 button 属性转发（type/disabled/onClick）、ref 转发、无障碍基础支持（aria-label、role）、asChild 模式（与 Next.js Link 集成）</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;package&quot;: &quot;shadcn/ui&quot;, &quot;component&quot;: &quot;Button&quot;, &quot;principles&quot;: [&quot;native-semantics-first&quot;, &quot;behavior-presentation-separation&quot;, &quot;variant-driven&quot;]}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li><code>Button</code> 组件（默认导出 + 命名导出）</li><li><code>buttonVariants()</code> — cva 驱动的 variant/size 工厂函数</li><li><code>ButtonProps</code> 类型（继承 <code>ButtonHTMLAttributes</code>，扩展 variant/size/asChild）</li><li><code>forwardRef</code> → 底层 <code>&amp;lt;button&amp;gt;</code> 元素</li><li><code>asChild</code> 通过 Slot 实现（Radix）</li><li>纯图标按钮的 <code>aria-label</code> 强制检测</li></ul><p><strong>受约束的 Archetype</strong>：<code>button-best-practice</code>、<code>component-design-best-practice</code></p><h4 id="crate-b-button-styles" tabindex="-1"><a class="header-anchor" href="#crate-b-button-styles"><span>Crate B: <code>button-styles</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>button-styles</code></td></tr><tr><td><strong>type</strong></td><td><code>utility</code></td></tr><tr><td><strong>responsibility</strong></td><td>Button 视觉 token 系统：variant 6 种变体的 Tailwind 类映射、size 8 级尺寸的 padding/font-size 配置、rounded/icon 特殊样式的类组合、与全局主题变量的集成（CSS 自定义属性）</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;package&quot;: &quot;class-variance-authority&quot;, &quot;variants&quot;: [&quot;default&quot;, &quot;destructive&quot;, &quot;secondary&quot;, &quot;outline&quot;, &quot;ghost&quot;, &quot;link&quot;], &quot;sizes&quot;: [&quot;xs&quot;, &quot;sm&quot;, &quot;default&quot;, &quot;lg&quot;, &quot;icon-xs&quot;, &quot;icon-sm&quot;, &quot;icon&quot;, &quot;icon-lg&quot;]}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li><code>cva</code> 配置对象（base + variants + compoundVariants）</li><li>颜色 token 引用（<code>bg-primary</code>, <code>text-primary-foreground</code> 等）</li><li>尺寸 token 映射表</li><li><code>icon-*</code> 尺寸的宽高平方约束（<code>size-6</code>, <code>size-8</code>, <code>size-9</code>, <code>size-10</code>）</li><li>hover/focus-visible/disabled 状态样式</li></ul><p><strong>受约束的 Archetype</strong>：<code>button-best-practice</code></p><h3 id="archetype-契约定义" tabindex="-1"><a class="header-anchor" href="#archetype-契约定义"><span>Archetype 契约定义</span></a></h3><p><strong>Name</strong>: <code>button-best-practice</code><strong>Scope</strong>: <code>crate</code><strong>Concept</strong>: 确保 Button 组件遵循原生语义优先、表现与行为分离、variant 驱动、API 边界清晰的设计原则</p><h5 id="c-1-原生-button-语义保留" tabindex="-1"><a class="header-anchor" href="#c-1-原生-button-语义保留"><span>C-1: 原生 button 语义保留</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-native-semantics</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 1</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件必须保留原生 &lt;button&gt; 元素的语义。type 属性默认为 &quot;button&quot;（禁止默认 &quot;submit&quot;</span>
<span class="line">以避免表单中误触提交）。支持 type=&quot;submit&quot; 和 type=&quot;reset&quot; 的显式声明。</span>
<span class="line">禁止用 &lt;div&gt; 或 &lt;span&gt; 模拟按钮行为（除非通过 asChild 继承 Slot 的语义传递）。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;div onClick={handler} role=&quot;button&quot; tabIndex={0}&gt;Click&lt;/div&gt;</span>
<span class="line">✅ 正确: &lt;Button type=&quot;button&quot; onClick={handler}&gt;Click&lt;/Button&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-2-disabled-状态原生支持" tabindex="-1"><a class="header-anchor" href="#c-2-disabled-状态原生支持"><span>C-2: disabled 状态原生支持</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-disabled-native</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 2</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 的禁用状态必须通过原生 disabled 属性实现，禁止仅通过 CSS 视觉模拟</span>
<span class="line">（如 pointer-events-none + opacity-50 而不设置 disabled）。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;Button className=&quot;pointer-events-none opacity-50&quot;&gt;Disabled&lt;/Button&gt;</span>
<span class="line">✅ 正确: &lt;Button disabled&gt;Disabled&lt;/Button&gt;</span>
<span class="line"></span>
<span class="line">原因：仅靠 CSS 模拟会导致键盘导航和屏幕阅读器仍将按钮视为可操作。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-3-forwardref-转发" tabindex="-1"><a class="header-anchor" href="#c-3-forwardref-转发"><span>C-3: forwardRef 转发</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-forward-ref</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 3</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件必须使用 React.forwardRef 将 ref 转发到底层 &lt;button&gt; 元素。</span>
<span class="line">这确保父组件可以通过 ref 访问原生 DOM 节点（如焦点管理、动画触发）。</span>
<span class="line"></span>
<span class="line">❌ 违规: function Button(props: ButtonProps) { return &lt;button {...props} /&gt; }</span>
<span class="line">         // 无 ref 转发，外部无法通过 ref 操作 DOM</span>
<span class="line">✅ 正确:</span>
<span class="line">  const Button = React.forwardRef&lt;HTMLButtonElement, ButtonProps&gt;(</span>
<span class="line">    ({ variant, size, ...props }, ref) =&gt; (</span>
<span class="line">      &lt;button ref={ref} {...props} /&gt;</span>
<span class="line">    )</span>
<span class="line">  );</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-4-variant-驱动视觉" tabindex="-1"><a class="header-anchor" href="#c-4-variant-驱动视觉"><span>C-4: variant 驱动视觉</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-variant-driven</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 4</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 的所有视觉变体必须通过 \`variant\` prop 表达。禁止通过直接 className</span>
<span class="line">覆盖背景色、文字色等核心视觉属性来绕过 variant 系统。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  &lt;Button className=&quot;bg-red-500 text-white hover:bg-red-600&quot;&gt;</span>
<span class="line">    Delete</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line">  // 应使用 variant=&quot;destructive&quot;</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;Button variant=&quot;destructive&quot;&gt;Delete&lt;/Button&gt;</span>
<span class="line"></span>
<span class="line">注：className 可用于 margin、flex、width 等布局属性，但不得覆盖 variant 已定义的</span>
<span class="line">颜色、边框、hover/focus 状态。</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-5-六种-variant-完整性" tabindex="-1"><a class="header-anchor" href="#c-5-六种-variant-完整性"><span>C-5: 六种 variant 完整性</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-variant-completeness</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 5</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件必须支持全部六种 variant：default、destructive、secondary、</span>
<span class="line">outline、ghost、link。每种 variant 必须覆盖 default/hover/focus-visible/</span>
<span class="line">disabled 四个状态。</span>
<span class="line"></span>
<span class="line">❌ 违规: 只实现了 default 和 outline 两种 variant</span>
<span class="line">✅ 正确: cva variants 中完整定义六种变体及各自的状态样式</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-6-size-八级尺寸" tabindex="-1"><a class="header-anchor" href="#c-6-size-八级尺寸"><span>C-6: size 八级尺寸</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-size-scale</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 6</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件必须支持完整的八级尺寸系统：</span>
<span class="line">- 文本按钮：xs, sm, default, lg</span>
<span class="line">- 图标按钮：icon-xs, icon-sm, icon, icon-lg</span>
<span class="line"></span>
<span class="line">图标专属尺寸必须确保宽高相等（正方形），使用 Tailwind 的 size-N 工具类</span>
<span class="line">或显式设置相同的 width/height。</span>
<span class="line"></span>
<span class="line">❌ 违规: 图标按钮使用 sm 而非 icon-sm，导致宽高不相等</span>
<span class="line">✅ 正确: size=&quot;icon-sm&quot; → size-8（32px × 32px）</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-7-纯图标按钮-aria-label-强制" tabindex="-1"><a class="header-anchor" href="#c-7-纯图标按钮-aria-label-强制"><span>C-7: 纯图标按钮 aria-label 强制</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-icon-aria-label</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 7</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">纯图标按钮（无文字内容）必须设置 aria-label 属性，为屏幕阅读器提供可读的功能描述。</span>
<span class="line">禁止仅依赖图标语义（如 aria-hidden=&quot;true&quot; 的图标）而不提供替代文本。</span>
<span class="line"></span>
<span class="line">❌ 违规:</span>
<span class="line">  &lt;Button size=&quot;icon&quot;&gt;</span>
<span class="line">    &lt;SearchIcon /&gt;  {/* 无 aria-label */}</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;Button size=&quot;icon&quot; aria-label=&quot;Search&quot;&gt;</span>
<span class="line">    &lt;SearchIcon /&gt;</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-8-带图标按钮-data-icon-间距" tabindex="-1"><a class="header-anchor" href="#c-8-带图标按钮-data-icon-间距"><span>C-8: 带图标按钮 data-icon 间距</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-with-icon-spacing</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 8</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">图标 + 文字组合按钮必须使用 data-icon 属性控制图标与文字的间距。</span>
<span class="line">图标在左（inline-start）或图标在右（inline-end）各需不同的间距策略。</span>
<span class="line"></span>
<span class="line">❌ 违规: 图标与文字之间无间距，视觉粘连</span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;Button&gt;</span>
<span class="line">    &lt;GitBranchIcon data-icon=&quot;inline-start&quot; /&gt;</span>
<span class="line">    New Branch</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line">  或使用 gap-2 统一间距</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-9-spinner-加载态" tabindex="-1"><a class="header-anchor" href="#c-9-spinner-加载态"><span>C-9: Spinner 加载态</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-spinner-loading</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 9</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">加载状态按钮必须同时满足：</span>
<span class="line">1. 设置 disabled 属性（阻止重复点击）</span>
<span class="line">2. 集成 Spinner 组件（视觉反馈）</span>
<span class="line">3. 保留按钮文字（让用户知道正在处理什么）</span>
<span class="line">4. Spinner 使用 data-icon 控制与文字的间距</span>
<span class="line"></span>
<span class="line">❌ 违规: 加载时仅显示 Spinner 不保留文字</span>
<span class="line">❌ 违规: 加载时不设置 disabled，用户可重复点击</span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;Button disabled&gt;</span>
<span class="line">    &lt;Spinner data-icon=&quot;inline-start&quot; /&gt;</span>
<span class="line">    Generating</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-10-aschild-用于路由跳转" tabindex="-1"><a class="header-anchor" href="#c-10-aschild-用于路由跳转"><span>C-10: asChild 用于路由跳转</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-aschild-link</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 10</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 用作链接跳转时，必须通过 asChild + Next.js Link 实现，禁止添加自定义</span>
<span class="line">href/to 属性。这确保路由行为完全由 Next.js 控制，Button 只负责视觉样式。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;Button href=&quot;/login&quot;&gt;Login&lt;/Button&gt;  // 自定义 href</span>
<span class="line">❌ 违规: &lt;button onClick={() =&gt; router.push(&#39;/login&#39;)}&gt;Login&lt;/button&gt;</span>
<span class="line">         // 失去 Button 的样式体系</span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;Button asChild&gt;</span>
<span class="line">    &lt;Link href=&quot;/login&quot;&gt;Login&lt;/Link&gt;</span>
<span class="line">  &lt;/Button&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-11-camelcase-双单词属性命名" tabindex="-1"><a class="header-anchor" href="#c-11-camelcase-双单词属性命名"><span>C-11: camelCase + 双单词属性命名</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-prop-naming</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 11</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 的自定义属性必须使用 camelCase 命名，语义复杂时使用双单词或多单词组合。</span>
<span class="line">属性名称必须自解释（self-documenting），禁止缩写或单字母命名。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;Button vis=&quot;outline&quot; sz=&quot;sm&quot; /&gt;  // 缩写</span>
<span class="line">❌ 违规: &lt;Button v=&quot;outline&quot; /&gt;  // 单字母</span>
<span class="line">✅ 正确: variant, size, ariaLabel, dataIcon</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-12-不覆盖原生属性" tabindex="-1"><a class="header-anchor" href="#c-12-不覆盖原生属性"><span>C-12: 不覆盖原生属性</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-no-native-override</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 12</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件的自定义属性不得与 HTMLButtonElement 原生属性冲突或覆盖。</span>
<span class="line">自定义属性仅用于表达原生属性无法覆盖的组件语义（如 variant、size）。</span>
<span class="line">原生属性（type、disabled、onClick、form 等）必须直接透传到 &lt;button&gt; 元素。</span>
<span class="line"></span>
<span class="line">❌ 违规: 组件的 type prop 控制的是 visual type 而非 HTML type</span>
<span class="line">✅ 正确: type 直接对应 &lt;button type=&quot;...&quot;&gt;，视觉变体用 variant</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-13-命名导出-一文件一组件" tabindex="-1"><a class="header-anchor" href="#c-13-命名导出-一文件一组件"><span>C-13: 命名导出 + 一文件一组件</span></a></h5><ul><li><strong>ID</strong>: <code>c-btn-named-export</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 13</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Button 组件必须使用命名导出（named export），禁止默认导出。</span>
<span class="line">每个文件只包含一个组件（Button.tsx 只导出 Button，不导出其他组件）。</span>
<span class="line"></span>
<span class="line">❌ 违规: export default function Button() {}</span>
<span class="line">❌ 违规: 在 Button.tsx 中同时导出 Button 和 ButtonGroup</span>
<span class="line">✅ 正确: export { Button } 或 export const Button = ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><hr><h2 id="button-group" tabindex="-1"><a class="header-anchor" href="#button-group"><span>Button Group</span></a></h2><h3 id="能力模型" tabindex="-1"><a class="header-anchor" href="#能力模型"><span>能力模型</span></a></h3><table><thead><tr><th>层级</th><th>职责</th><th>包含要素</th></tr></thead><tbody><tr><td><strong>核心能力</strong></td><td>结构容器</td><td>聚合多个 Button、布局管理、<code>role=&quot;group&quot;</code> 语义化、保持 Button 行为独立</td></tr><tr><td><strong>表现能力</strong></td><td>视觉与布局表达</td><td>orientation（方向）、size inheritance（尺寸继承）、separator（分隔）、split/nested/input/dropdown/select/popover 组合形态</td></tr><tr><td><strong>扩展能力</strong></td><td>与其他组件组合</td><td>Input/InputGroup、DropdownMenu、Select、Popover、Tooltip</td></tr><tr><td><strong>工程能力</strong></td><td>可维护性</td><td>API 设计规范、与 Button 依赖关系、无障碍规范、可组合性</td></tr></tbody></table><h3 id="设计原则-1" tabindex="-1"><a class="header-anchor" href="#设计原则-1"><span>设计原则</span></a></h3><table><thead><tr><th>#</th><th>原则</th><th>核心要求</th></tr></thead><tbody><tr><td>1</td><td>Button 语义优先</td><td>Button Group 不得改变 Button 原生语义，只负责组织</td></tr><tr><td>2</td><td>组合与行为分离</td><td>Button 负责行为，Button Group 负责组合</td></tr><tr><td>3</td><td>结构优先</td><td>Button Group 的核心价值是结构，而非样式</td></tr><tr><td>4</td><td>API 边界</td><td>Button Group 属性不得与 Button 属性冲突</td></tr><tr><td>5</td><td>职责单一</td><td>只负责&quot;组合&quot;，不承担业务/状态逻辑</td></tr></tbody></table><h3 id="组合形态" tabindex="-1"><a class="header-anchor" href="#组合形态"><span>组合形态</span></a></h3><table><thead><tr><th>形态</th><th>描述</th><th>典型场景</th></tr></thead><tbody><tr><td><strong>Orientation</strong></td><td>水平（默认）/ 垂直布局</td><td>工具栏 vs 侧边操作栏</td></tr><tr><td><strong>Size</strong></td><td>尺寸协同（sm/default/lg + icon-*）</td><td>全组统一尺寸</td></tr><tr><td><strong>Separator</strong></td><td>按钮间视觉分隔</td><td>复制/粘贴、保存/取消</td></tr><tr><td><strong>Split</strong></td><td>主操作 + 附属下拉图标</td><td>Follow + 下拉选项</td></tr><tr><td><strong>Nested</strong></td><td>双层 ButtonGroup 嵌套</td><td>消息输入框（加号按钮 + 输入区 + 语音按钮）</td></tr><tr><td><strong>Input</strong></td><td>输入框 + 操作按钮一体化</td><td>搜索栏</td></tr><tr><td><strong>Dropdown Menu</strong></td><td>主按钮 + 下拉菜单</td><td>Follow 按钮 + 更多操作</td></tr><tr><td><strong>Select</strong></td><td>选择器 + 输入框 + 操作按钮</td><td>货币选择 + 金额输入 + 发送</td></tr><tr><td><strong>Popover</strong></td><td>功能按钮 + 弹出层</td><td>Copilot + 任务输入弹层</td></tr></tbody></table><h3 id="crate-定义-1" tabindex="-1"><a class="header-anchor" href="#crate-定义-1"><span>Crate 定义</span></a></h3><h4 id="crate-a-button-group" tabindex="-1"><a class="header-anchor" href="#crate-a-button-group"><span>Crate A: <code>button-group</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>button-group</code></td></tr><tr><td><strong>type</strong></td><td><code>module</code></td></tr><tr><td><strong>responsibility</strong></td><td>ButtonGroup 结构容器：orientation 布局控制、size 尺寸继承传递、ButtonGroupSeparator 分隔组件、split 拆分模式、nested 嵌套支持、<code>role=&quot;group&quot;</code> 语义 + aria-label/labelledby 无障碍</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;components&quot;: [&quot;ButtonGroup&quot;, &quot;ButtonGroupSeparator&quot;, &quot;ButtonGroupText&quot;], &quot;patterns&quot;: [&quot;orientation&quot;, &quot;separator&quot;, &quot;split&quot;, &quot;nested&quot;]}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li><code>ButtonGroup</code> 容器（接收 orientation、size、aria-label/labelledby）</li><li><code>ButtonGroupSeparator</code> — 视觉分隔线</li><li><code>ButtonGroupText</code> — 文本标签（配合 aria-labelledby 使用）</li><li>通过 React Context 传递 size 给子 Button</li><li><code>cn()</code> + <code>cva</code> 布局样式（flex、gap、rounded 裁剪）</li></ul><p><strong>受约束的 Archetype</strong>：<code>button-group-best-practice</code>（全部 Condition）、<code>component-design-best-practice</code></p><h4 id="crate-b-button-compositions" tabindex="-1"><a class="header-anchor" href="#crate-b-button-compositions"><span>Crate B: <code>button-compositions</code></span></a></h4><table><thead><tr><th>字段</th><th>值</th></tr></thead><tbody><tr><td><strong>name</strong></td><td><code>button-compositions</code></td></tr><tr><td><strong>type</strong></td><td><code>module</code></td></tr><tr><td><strong>responsibility</strong></td><td>Button Group 与外部组件的高阶组合模式：Input/InputGroup 搜索栏、DropdownMenu 下拉菜单按钮、Select 选择器联动、Popover 弹出层按钮、Tooltip 提示按钮。提供组合模板和类型安全的 props 接口，供页面直接使用</td></tr><tr><td><strong>metadata</strong></td><td><code>{&quot;integrations&quot;: [&quot;Input&quot;, &quot;InputGroup&quot;, &quot;DropdownMenu&quot;, &quot;Select&quot;, &quot;Popover&quot;, &quot;Tooltip&quot;], &quot;patterns&quot;: [&quot;search-bar&quot;, &quot;split-dropdown&quot;, &quot;select-action&quot;, &quot;popover-form&quot;, &quot;tooltip-icon&quot;]}</code></td></tr></tbody></table><p><strong>包含内容</strong>：</p><ul><li><code>SearchButtonGroup</code> — Input + Button 一体化搜索模板</li><li><code>SplitDropdownButton</code> — 主按钮 + 下拉菜单模板</li><li><code>SelectActionGroup</code> — Select + Input + Button 联动模板</li><li><code>PopoverButton</code> — 弹出层表单模板</li><li>各模板的 TypeScript 泛型 props 类型</li></ul><p><strong>受约束的 Archetype</strong>：<code>button-group-best-practice</code>（§D 扩展能力 Condition）、<code>component-composition-best-practice</code></p><h3 id="archetype-契约定义-1" tabindex="-1"><a class="header-anchor" href="#archetype-契约定义-1"><span>Archetype 契约定义</span></a></h3><p><strong>Name</strong>: <code>button-group-best-practice</code><strong>Scope</strong>: <code>crate</code><strong>Concept</strong>: 确保 ButtonGroup 作为纯粹的结构容器，不引入新的行为语义，保持 Button 的独立性和可组合性</p><h5 id="c-1-role-group-无障碍标注" tabindex="-1"><a class="header-anchor" href="#c-1-role-group-无障碍标注"><span>C-1: role=&quot;group&quot; + 无障碍标注</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-role-group</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 1</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 必须设置 role=&quot;group&quot;（默认值，显式声明更佳），并且必须提供</span>
<span class="line">aria-label（直接描述）或 aria-labelledby（关联外部标签），向辅助技术</span>
<span class="line">说明按钮组的用途。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;ButtonGroup&gt;&lt;Button&gt;A&lt;/Button&gt;&lt;Button&gt;B&lt;/Button&gt;&lt;/ButtonGroup&gt;</span>
<span class="line">         // 无 aria-label，屏幕阅读器无法解释分组用途</span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;ButtonGroup aria-label=&quot;Text formatting&quot;&gt;</span>
<span class="line">    &lt;Button variant=&quot;outline&quot; size=&quot;sm&quot;&gt;Bold&lt;/Button&gt;</span>
<span class="line">    &lt;Button variant=&quot;outline&quot; size=&quot;sm&quot;&gt;Italic&lt;/Button&gt;</span>
<span class="line">  &lt;/ButtonGroup&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-2-不引入行为逻辑" tabindex="-1"><a class="header-anchor" href="#c-2-不引入行为逻辑"><span>C-2: 不引入行为逻辑</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-no-behavior</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 2</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 禁止定义任何业务行为逻辑。不得包含 onClick、onChange、状态管理</span>
<span class="line">等行为相关代码。所有行为必须由子 Button 独自处理。</span>
<span class="line"></span>
<span class="line">❌ 违规: &lt;ButtonGroup onClick={handleGroupClick}&gt;</span>
<span class="line">❌ 违规: ButtonGroup 内部使用 useState 管理选中状态</span>
<span class="line">✅ 正确: ButtonGroup 仅提供 className/orientation/aria-label + children</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-3-不覆盖子-button-属性" tabindex="-1"><a class="header-anchor" href="#c-3-不覆盖子-button-属性"><span>C-3: 不覆盖子 Button 属性</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-no-prop-override</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 3</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 不得覆盖或修改子 Button 的 variant、size、disabled 等核心属性。</span>
<span class="line">ButtonGroup 的 size 属性仅作为子 Button 的默认值（如子 Button 未显式设置 size</span>
<span class="line">则继承），不得强制覆盖已显式声明的子 Button 属性。</span>
<span class="line"></span>
<span class="line">❌ 违规: ButtonGroup 强制所有子 Button 使用同一 variant</span>
<span class="line">✅ 正确: size 通过 React Context 传递，子 Button 可显式覆盖</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-4-orientation-方向控制" tabindex="-1"><a class="header-anchor" href="#c-4-orientation-方向控制"><span>C-4: orientation 方向控制</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-orientation</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 4</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 必须支持 orientation 属性，取值 &quot;horizontal&quot;（默认）和 &quot;vertical&quot;。</span>
<span class="line">horizontal 使用 flex-row，vertical 使用 flex-col。布局切换不得影响子 Button 的行为。</span>
<span class="line"></span>
<span class="line">Orientation 通过 Tailwind 的 flex 工具类实现，禁止使用绝对定位或 float。</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  horizontal → flex gap-0（子元素紧贴）</span>
<span class="line">  vertical → flex flex-col gap-0</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-5-尺寸继承机制" tabindex="-1"><a class="header-anchor" href="#c-5-尺寸继承机制"><span>C-5: 尺寸继承机制</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-size-inheritance</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 5</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 的 size 属性通过 React Context 向下传递，子 Button 若未显式设置</span>
<span class="line">size 则自动继承 ButtonGroup 的 size。图标按钮需要使用对应的 icon-* 尺寸。</span>
<span class="line"></span>
<span class="line">尺寸继承链：ButtonGroup size → Context → 子 Button（可显式覆盖）</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;ButtonGroup size=&quot;sm&quot;&gt;</span>
<span class="line">    &lt;Button variant=&quot;outline&quot;&gt;Small&lt;/Button&gt;         {/* 继承 sm */}</span>
<span class="line">    &lt;Button variant=&quot;outline&quot;&gt;Button&lt;/Button&gt;         {/* 继承 sm */}</span>
<span class="line">    &lt;Button variant=&quot;outline&quot; size=&quot;icon-sm&quot;&gt;         {/* 显式覆盖为 icon-sm */}</span>
<span class="line">      &lt;PlusIcon /&gt;</span>
<span class="line">    &lt;/Button&gt;</span>
<span class="line">  &lt;/ButtonGroup&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-6-separator-使用规范" tabindex="-1"><a class="header-anchor" href="#c-6-separator-使用规范"><span>C-6: Separator 使用规范</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-separator</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 6</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroupSeparator 用于在按钮组内添加视觉分隔线。</span>
<span class="line"></span>
<span class="line">使用建议：</span>
<span class="line">- outline variant 的 Button 自带边框，通常无需分隔符</span>
<span class="line">- 其他 variant（default/secondary/ghost）建议添加分隔符</span>
<span class="line">- Separator 应是纯视觉元素（\`&lt;div&gt;\` 或 \`&lt;span&gt;\`），不带交互能力</span>
<span class="line"></span>
<span class="line">❌ 违规: Separator 用 &lt;button&gt; 实现</span>
<span class="line">✅ 正确: &lt;ButtonGroupSeparator /&gt; → &lt;div role=&quot;separator&quot; aria-hidden=&quot;true&quot; /&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-7-split-拆分模式" tabindex="-1"><a class="header-anchor" href="#c-7-split-拆分模式"><span>C-7: Split 拆分模式</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-split-pattern</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 7</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">Split 模式（一个主操作 + 一个附属操作）通过 ButtonGroup + ButtonGroupSeparator</span>
<span class="line">实现。主按钮使用文本，附属按钮使用图标。两者共享相同的 variant 和 size。</span>
<span class="line"></span>
<span class="line">❌ 违规: 主按钮和附属按钮使用不同的 variant，视觉不统一</span>
<span class="line">✅ 正确:</span>
<span class="line">  &lt;ButtonGroup&gt;</span>
<span class="line">    &lt;Button variant=&quot;secondary&quot;&gt;Follow&lt;/Button&gt;</span>
<span class="line">    &lt;ButtonGroupSeparator /&gt;</span>
<span class="line">    &lt;Button variant=&quot;secondary&quot; size=&quot;icon&quot;&gt;</span>
<span class="line">      &lt;ChevronDownIcon /&gt;</span>
<span class="line">    &lt;/Button&gt;</span>
<span class="line">  &lt;/ButtonGroup&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-8-嵌套-buttongroup-规范" tabindex="-1"><a class="header-anchor" href="#c-8-嵌套-buttongroup-规范"><span>C-8: 嵌套 ButtonGroup 规范</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-nested</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 8</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 支持嵌套（ButtonGroup 内嵌套另一个 ButtonGroup），用于模块化功能拆分。</span>
<span class="line">嵌套层级不超过 2 层。每个子 ButtonGroup 独立设置自己的无障碍标注。</span>
<span class="line"></span>
<span class="line">✅ 正确:</span>
<span class="line">  {/* 外层：整体消息输入布局 */}</span>
<span class="line">  &lt;ButtonGroup aria-label=&quot;Message input&quot;&gt;</span>
<span class="line">    {/* 内层子组 1：加号图标按钮 */}</span>
<span class="line">    &lt;ButtonGroup&gt;</span>
<span class="line">      &lt;Button variant=&quot;outline&quot; size=&quot;icon&quot;&gt;&lt;PlusIcon /&gt;&lt;/Button&gt;</span>
<span class="line">    &lt;/ButtonGroup&gt;</span>
<span class="line">    {/* 内层子组 2：输入框 + 语音按钮 */}</span>
<span class="line">    &lt;ButtonGroup&gt;</span>
<span class="line">      &lt;InputGroup&gt;...&lt;/InputGroup&gt;</span>
<span class="line">    &lt;/ButtonGroup&gt;</span>
<span class="line">  &lt;/ButtonGroup&gt;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-9-外部组件组合接口" tabindex="-1"><a class="header-anchor" href="#c-9-外部组件组合接口"><span>C-9: 外部组件组合接口</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-external-composition</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 9</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">ButtonGroup 与外部组件（DropdownMenu、Select、Popover、Tooltip、Input）</span>
<span class="line">组合时，必须保持各自组件的独立性和正确的层级关系：</span>
<span class="line"></span>
<span class="line">- DropdownMenu：DropdownMenuTrigger 通过 asChild 继承 Button 样式</span>
<span class="line">- Select：SelectTrigger 放在 ButtonGroup 内，保持视觉统一</span>
<span class="line">- Popover：PopoverTrigger 通过 asChild 继承 Button 样式</span>
<span class="line">- Tooltip：TooltipTrigger 包裹目标 Button，不包裹整个 ButtonGroup</span>
<span class="line">- Input：Input 直接作为 ButtonGroup 子元素，与 Button 共享布局</span>
<span class="line"></span>
<span class="line">❌ 违规: Tooltip 包裹整个 ButtonGroup 而非单个 Button</span>
<span class="line">❌ 违规: 组合时手动覆写了组件的核心样式</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><h5 id="c-10-buttongroup-vs-togglegroup-区分" tabindex="-1"><a class="header-anchor" href="#c-10-buttongroup-vs-togglegroup-区分"><span>C-10: ButtonGroup vs ToggleGroup 区分</span></a></h5><ul><li><strong>ID</strong>: <code>c-btg-vs-togglegroup</code></li><li><strong>类型</strong>: <code>text</code></li><li><strong>排序</strong>: 10</li><li><strong>条件内容</strong>:<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">当按钮之间存在状态关联（选中/未选中、互斥、多选）时，必须使用 ToggleGroup</span>
<span class="line">而非 ButtonGroup。ButtonGroup 仅用于无状态关联的独立操作分组。</span>
<span class="line"></span>
<span class="line">| 场景 | 使用 |</span>
<span class="line">|------|------|</span>
<span class="line">| 提交 + 取消 | ButtonGroup |</span>
<span class="line">| 加粗 + 斜体 + 下划线（格式切换） | ToggleGroup |</span>
<span class="line">| 复制 + 粘贴 | ButtonGroup |</span>
<span class="line">| 左对齐 + 居中 + 右对齐（单选） | ToggleGroup |</span>
<span class="line"></span>
<span class="line">❌ 违规: 用 ButtonGroup + useState 管理选中状态来实现 ToggleGroup 的功能</span>
<span class="line">✅ 正确: 有状态关联 → 使用专门的 ToggleGroup 组件</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li></ul><hr><h2 id="依赖关系" tabindex="-1"><a class="header-anchor" href="#依赖关系"><span>依赖关系</span></a></h2><table><thead><tr><th>Archetype</th><th>Scope</th><th>约束 Crate</th><th>Condition 数</th><th>说明</th></tr></thead><tbody><tr><td><strong><code>button-best-practice</code></strong></td><td><code>crate</code></td><td><code>button-core</code>、<code>button-styles</code></td><td>13</td><td>Button 组件设计契约</td></tr><tr><td><strong><code>button-group-best-practice</code></strong></td><td><code>crate</code></td><td><code>button-group</code>、<code>button-compositions</code></td><td>10</td><td>Button Group 结构契约</td></tr></tbody></table>`,95)])])}const r=s(i,[["render",l]]),c=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%BB%A3%E8%BE%BE%E7%BD%97%E6%96%AF/%E9%9C%80%E6%B1%82/COD-100/Button%20%E4%B8%8E%20Button%20Group.html","title":"Button 与 Button Group","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/代达罗斯/需求/COD-100/Button 与 Button Group.md"}');export{r as comp,c as data};
