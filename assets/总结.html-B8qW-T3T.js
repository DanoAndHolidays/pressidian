import{_ as n,c as a,b as p,o as e}from"./app-DfSzGDtR.js";const t={};function l(i,s){return e(),a("div",null,[...s[0]||(s[0]=[p(`<h1 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h1><p>我现在用<strong>最直白、最直接、最不绕弯子</strong>的的话告诉你——调研的方案里没有一个能 npm install 直接用的。Daedalus 要解决的问题（AI 代码审查平台的代码结构元数据描述）本身就没人做过一模一样的</p><p><a href="https://ocn10zycuxwg.feishu.cn/wiki/HIs0wzBHTiOoE2kWu6GcgY6JnIb" target="_blank" rel="noopener noreferrer">部分问题</a></p><h2 id="👇下面是我个人总结的一些可能需要改进的方向" tabindex="-1"><a class="header-anchor" href="#👇下面是我个人总结的一些可能需要改进的方向"><span>&gt; 👇下面是我个人总结的一些可能需要改进的方向</span></a></h2><h2 id="使用的统一的数据结构来描述各种概念" tabindex="-1"><a class="header-anchor" href="#使用的统一的数据结构来描述各种概念"><span>使用的统一的数据结构来描述各种概念</span></a></h2><p>实体各自孤立建模，Crate、Archetype字段形态各异，无法用统一的查询接口遍历&quot;Crate X 依赖哪些 Archetype&quot;。我们需要提供一个基类去继承，如果有需要统一升级的能力，改基类就行可了。孤立建模无法用统一的关系来描述，每两个概念就需要一个关系来表示。</p><p>先写一个 TypeScript 层的&quot;统一视图&quot;，让现有的 Crate/Archetype 表通过适配器看起来像同一个模型。不是一开始就改数据库 schema。</p><hr><h2 id="关系" tabindex="-1"><a class="header-anchor" href="#关系"><span>关系</span></a></h2><h3 id="conditions" tabindex="-1"><a class="header-anchor" href="#conditions"><span>Conditions</span></a></h3><p>目前只有两种类型，text与archetype_ref，Archetype的Conditions归根结底是结构化的text</p><p>比如，我希望使用Archetype/Crate描述一个商品购买卡片，大概长这个样子： ![Pasted image 20260702212633](../../../../../_assets/be4ddcc-Pasted image 20260702212633.png)</p><p>商品购买卡片定义：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">archetype: 组件设计最佳实践</span>
<span class="line">archetype: 商品的定义</span>
<span class="line">text: &quot;卡片必须展示商品图片、名称、当前价格三个核心信息，缺一不可&quot;</span>
<span class="line">archetype：按钮</span>
<span class="line">text: &quot;卡片必须提供至少一个明确的购买操作入口（如「加入购物车」或「立即购买」按钮）&quot;</span>
<span class="line">text: &quot;卡片必须能正确处理以下商品状态：正常售卖、已售罄、已下架、限时折扣中、即将开售&quot;</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件设计最佳实践定义：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">text: 组件有明确的单一职责</span>
<span class="line">text: 组件被复用 2 次以上，或有明确的复用潜力</span>
<span class="line">text: 支持 \`asChild\` 模式（使用 Radix Slot）</span>
<span class="line">archetype: 桶导出</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>桶导出：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">text: 每个目录有 index 文件：存在导出文件的目录必须有 \`index.ts\`</span>
<span class="line">text: 桶导出文件中禁止使用 \`export default\`</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>按钮：</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">text: 能点击</span>
<span class="line">text: ...</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>AI看到的：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// archetype 商品购买卡片</span></span>
<span class="line"><span class="token punctuation">{</span></span>
<span class="line">  archetype<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    text<span class="token operator">:</span> 组件有明确的单一职责</span>
<span class="line">    text<span class="token operator">:</span> 组件被复用 <span class="token number">2</span> 次以上，或有明确的复用潜力</span>
<span class="line">    text<span class="token operator">:</span> 支持 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">asChild</span><span class="token template-punctuation string">\`</span></span> 模式（使用 Radix Slot）</span>
<span class="line">    archetype<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      text<span class="token operator">:</span> 每个目录有 index 文件：存在导出文件的目录必须有 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">index.ts</span><span class="token template-punctuation string">\`</span></span></span>
<span class="line">      text<span class="token operator">:</span> 桶导出文件中禁止使用 <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">export default</span><span class="token template-punctuation string">\`</span></span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  archetype<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token operator">...</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  text<span class="token operator">:</span> <span class="token string">&quot;卡片必须展示商品图片、名称、当前价格三个核心信息，缺一不可&quot;</span></span>
<span class="line">  archetype：<span class="token punctuation">{</span></span>
<span class="line">    text<span class="token operator">:</span> 能点击</span>
<span class="line">    text<span class="token operator">:</span> <span class="token operator">...</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line">  text<span class="token operator">:</span> <span class="token string">&quot;卡片必须提供至少一个明确的购买操作入口（如「加入购物车」或「立即购买」按钮）&quot;</span></span>
<span class="line">  text<span class="token operator">:</span> <span class="token string">&quot;卡片必须能正确处理以下商品状态：正常售卖、已售罄、已下架、限时折扣中、即将开售&quot;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>我们将这些内容交给AI后，AI 读到了 9 条文本，理解了，然后去读代码，输出审查结果。看起来很美好但是有几个问题：</p><ul><li>是否真的被复用 2 次以上</li><li>目录中有没有index文件</li><li>禁止使用 <code>export default</code>，到底使用了没</li><li>...</li></ul><p>系统自己无法验证任何东西，所有的能力都依托于AI去读text。审查结果需要可验证，约束需要部分可自动化。</p><p>所以我们要添加一些新的类型，比如路径，依赖方向，结构化约束，数量约束，联合约束</p><p>&gt; 这里的话我想可以直接使用下面的Relation来表示</p><h3 id="将关系作为一个实体单列出来并限制" tabindex="-1"><a class="header-anchor" href="#将关系作为一个实体单列出来并限制"><span>将关系作为一个实体单列出来并限制</span></a></h3><p>除了已有的Archetype与其Conditions之间的关系，Crate之间，Archetype与Crate之间也存在关系，但他们之间的关系很难通过类似<code>condition_dependencies</code> 中仅存两外键的形式表示。缺少关系语义，是强依赖还是弱引用？为什么依赖？</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">/**</span>
<span class="line"> * 关系类型——描述两个结构单元之间的语义连接</span>
<span class="line"> *</span>
<span class="line"> * 借鉴:</span>
<span class="line"> * - ADL Connector 作为一等公民的设计</span>
<span class="line"> * - Backstage 的 well-known relations</span>
<span class="line"> * - Property Graph 的有类型有属性边</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">const</span> RelationTypeSchema <span class="token operator">=</span> z<span class="token punctuation">.</span><span class="token function">enum</span><span class="token punctuation">(</span><span class="token punctuation">[</span></span>
<span class="line">  <span class="token string">&quot;dependsOn&quot;</span><span class="token punctuation">,</span>       <span class="token comment">// 运行时/编译时依赖（A 需要 B 才能工作）</span></span>
<span class="line">  <span class="token string">&quot;dependencyOf&quot;</span><span class="token punctuation">,</span>    <span class="token comment">// dependsOn 的反向</span></span>
<span class="line">  <span class="token string">&quot;partOf&quot;</span><span class="token punctuation">,</span>          <span class="token comment">// A 是 B 的组成部分（A → B 读作&quot;A 属于 B&quot;）</span></span>
<span class="line">  <span class="token string">&quot;hasPart&quot;</span><span class="token punctuation">,</span>         <span class="token comment">// partOf 的反向（B 包含 A）</span></span>
<span class="line">  <span class="token string">&quot;implements&quot;</span><span class="token punctuation">,</span>      <span class="token comment">// A 实现了 B 定义的接口/契约</span></span>
<span class="line">  <span class="token string">&quot;implementedBy&quot;</span><span class="token punctuation">,</span>   <span class="token comment">// implements 的反向</span></span>
<span class="line">  <span class="token string">&quot;references&quot;</span><span class="token punctuation">,</span>      <span class="token comment">// A 引用 B（非依赖性的弱引用）</span></span>
<span class="line">  <span class="token string">&quot;referencedBy&quot;</span><span class="token punctuation">,</span>    <span class="token comment">// references 的反向</span></span>
<span class="line">  <span class="token string">&quot;conformsTo&quot;</span><span class="token punctuation">,</span>      <span class="token comment">// A 遵循 B 的约束（Crate → Archetype 的关系）</span></span>
<span class="line">  <span class="token string">&quot;conformsFrom&quot;</span><span class="token punctuation">,</span>    <span class="token comment">// conformsTo 的反向</span></span>
<span class="line">  <span class="token string">&quot;extends&quot;</span><span class="token punctuation">,</span>         <span class="token comment">// A 扩展/继承 B</span></span>
<span class="line">  <span class="token string">&quot;extendedBy&quot;</span><span class="token punctuation">,</span>      <span class="token comment">// extends 的反向</span></span>
<span class="line">  <span class="token string">&quot;replaces&quot;</span><span class="token punctuation">,</span>        <span class="token comment">// A 替代 B（版本迁移）</span></span>
<span class="line">  <span class="token string">&quot;replacedBy&quot;</span><span class="token punctuation">,</span>      <span class="token comment">// replaces 的反向</span></span>
<span class="line"><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>定义Archetype：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"><span class="token comment">// Archetype: ecommerce-purchase-card</span></span>
<span class="line"><span class="token comment">// 定义&quot;一个合格的商品购买卡片应该满足什么条件&quot;</span></span>
<span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> purchaseCardArchetype<span class="token operator">:</span> StructureUnit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ── 基础标识 ──</span></span>
<span class="line">  uid<span class="token operator">:</span> <span class="token string">&quot;archetype:default/ecommerce-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitKind<span class="token operator">:</span> <span class="token string">&quot;archetype&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitTypes<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;design-contract&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ui-pattern&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  displayName<span class="token operator">:</span> <span class="token string">&quot;E-commerce Purchase Card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  description<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">商品购买卡片的设计范式。</span>
<span class="line">一个合格的商品购买卡片必须：</span>
<span class="line">- 展示商品的核心信息（图片、名称、价格）</span>
<span class="line">- 提供明确的购买/加入购物车操作</span>
<span class="line">- 对缺货、已下架等状态有对应的 UI 反馈</span>
<span class="line">- 有独立的测试和 Storybook 文档</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">&quot;crate&quot;</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 边界：这个 Archetype 本身没有代码边界，</span></span>
<span class="line">  <span class="token comment">//   但它定义了&quot;符合它的 Crate 应该有什么边界&quot; ──</span></span>
<span class="line">  boundary<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    exposes<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        name<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCard&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        interfaceKind<span class="token operator">:</span> <span class="token string">&quot;component&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        filePath<span class="token operator">:</span> <span class="token string">&quot;src/components/ProductPurchaseCard/ProductPurchaseCard.tsx&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        signature<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">(props: ProductPurchaseCardProps) =&gt; React.JSX.Element</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line">        stable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    encapsulations<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token string">&quot;src/components/ProductPurchaseCard/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    visibility<span class="token operator">:</span> <span class="token string">&quot;public&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 扩展属性：这个 Archetype 的额外元数据 ──</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 适用范围</span></span>
<span class="line">    applicableTo<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;component&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ui&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 标签</span></span>
<span class="line">    tags<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;purchase&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;card&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;product&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 示例仓库（如果存在符合此 Archetype 的参考实现）</span></span>
<span class="line">    referenceImplementation<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 所属领域</span></span>
<span class="line">    domain<span class="token operator">:</span> <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 版本</span></span>
<span class="line">    version<span class="token operator">:</span> <span class="token string">&quot;1.0.0&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 来源</span></span>
<span class="line">    _source<span class="token operator">:</span> <span class="token string">&quot;archetypes_table&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Archetype的Conditions：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token keyword">const</span> purchaseCardConstraints<span class="token operator">:</span> Constraint<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 1：文本约束 —— 说出这个 Archetype 的核心要求 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    value<span class="token operator">:</span> <span class="token string">&quot;卡片必须展示商品图片、名称、当前价格三个核心信息，缺一不可&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    severity<span class="token operator">:</span> <span class="token string">&quot;error&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 2：文本约束 —— 交互行为要求 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    value<span class="token operator">:</span> <span class="token string">&quot;卡片必须提供至少一个明确的购买操作入口（如「加入购物车」或「立即购买」按钮）&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    severity<span class="token operator">:</span> <span class="token string">&quot;error&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 3：文本约束 —— 状态覆盖要求 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;text&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    value<span class="token operator">:</span> <span class="token string">&quot;卡片必须能正确处理以下商品状态：正常售卖、已售罄、已下架、限时折扣中、即将开售&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    severity<span class="token operator">:</span> <span class="token string">&quot;warning&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 4：引用约束 —— 同时必须遵循「组件设计最佳实践」Archetype ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;archetype_ref&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    archetypeUid<span class="token operator">:</span> <span class="token string">&quot;archetype:default/component-design-best-practice&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    requirement<span class="token operator">:</span> <span class="token string">&quot;must&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 强制依赖——不符合组件规范就不算合格的商品卡片</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 5：文件路径约束 —— 必须有桶导出文件 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;path_pattern&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    pattern<span class="token operator">:</span> <span class="token string">&quot;src/components/ProductPurchaseCard/index.ts&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    modifier<span class="token operator">:</span> <span class="token string">&quot;must_exist&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    recursive<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 6：文件路径约束 —— 禁止在 feature 外部直接引用卡片内部文件 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;path_pattern&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    pattern<span class="token operator">:</span> <span class="token string">&quot;src/features/*/components/*&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    modifier<span class="token operator">:</span> <span class="token string">&quot;must_not_contain&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    contentPattern<span class="token operator">:</span> <span class="token string">&quot;from.*ProductPurchaseCard/ProductPurchaseCard\\\\.tsx&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    recursive<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 7：依赖约束 —— 必须依赖商品数据类型定义 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;dependency&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    direction<span class="token operator">:</span> <span class="token string">&quot;depends_on&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    targetPattern<span class="token operator">:</span> <span class="token string">&quot;**/types/product*&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    cardinality<span class="token operator">:</span> <span class="token string">&quot;at_least_one&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    minStrength<span class="token operator">:</span> <span class="token string">&quot;strong&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 8：依赖约束 —— 禁止直接依赖后端 SDK ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;dependency&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    direction<span class="token operator">:</span> <span class="token string">&quot;not_depends_on&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    targetPattern<span class="token operator">:</span> <span class="token string">&quot;**/api-client/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 9：结构化约束 —— 必须有 test 和 stories 文件 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;structural&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    rule<span class="token operator">:</span> <span class="token string">&quot;has_tests&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 10：结构化约束 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;structural&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    rule<span class="token operator">:</span> <span class="token string">&quot;has_stories&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 11：结构化约束 —— 必须使用命名导出 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;structural&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    rule<span class="token operator">:</span> <span class="token string">&quot;prefer_named_export&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 12：结构化约束 —— 不能有循环依赖 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;structural&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    rule<span class="token operator">:</span> <span class="token string">&quot;no_circular_deps&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 13：数量约束 —— 导出项数量范围 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;quantity&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    target<span class="token operator">:</span> <span class="token string">&quot;exports&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    operator<span class="token operator">:</span> <span class="token string">&quot;between&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    value<span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">    maxValue<span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span>  <span class="token comment">// 最多导出 5 个符号（卡片组件 + 最多 4 个子类型）</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 约束 14：数量约束 —— 依赖数量控制 ──</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    constraintType<span class="token operator">:</span> <span class="token string">&quot;quantity&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    target<span class="token operator">:</span> <span class="token string">&quot;dependencies&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    operator<span class="token operator">:</span> <span class="token string">&quot;lte&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    value<span class="token operator">:</span> <span class="token number">8</span><span class="token punctuation">,</span>  <span class="token comment">// 商品卡片不应过度依赖外部模块</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Crate定义：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"><span class="token comment">// Crate: ProductPurchaseCard</span></span>
<span class="line"><span class="token comment">// 实际的代码组织单元——包含组件文件及其附属</span></span>
<span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> productPurchaseCardCrate<span class="token operator">:</span> StructureUnit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ── 基础标识 ──</span></span>
<span class="line">  uid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitKind<span class="token operator">:</span> <span class="token string">&quot;crate&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token comment">// ★ 多值类型标签——替代旧的固定枚举</span></span>
<span class="line">  unitTypes<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">&quot;component&quot;</span><span class="token punctuation">,</span>   <span class="token comment">// 它是 UI 组件</span></span>
<span class="line">    <span class="token string">&quot;ui&quot;</span><span class="token punctuation">,</span>          <span class="token comment">// 属于 UI 层</span></span>
<span class="line">    <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">,</span>   <span class="token comment">// 属于电商领域</span></span>
<span class="line">    <span class="token string">&quot;card&quot;</span><span class="token punctuation">,</span>        <span class="token comment">// 是卡片类组件</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  displayName<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCard&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  description<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">商品购买卡片组件。</span>
<span class="line"></span>
<span class="line">展示单个商品的关键购买信息（图片、名称、价格、库存状态），</span>
<span class="line">并提供「加入购物车」和「立即购买」两个操作入口。</span>
<span class="line"></span>
<span class="line">支持的商品状态：</span>
<span class="line">- 正常售卖：显示价格和购买按钮</span>
<span class="line">- 已售罄：灰色遮罩 + &quot;已售罄&quot;标签</span>
<span class="line">- 已下架：淡化显示 + &quot;已下架&quot;提示</span>
<span class="line">- 限时折扣：显示原价（划线）+ 折扣价 + 倒计时</span>
<span class="line">- 即将开售：显示预告 + 开售倒计时</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 层级定位 ──</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">&quot;crate&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  parentUid<span class="token operator">:</span> <span class="token string">&quot;repository:default/my-ecommerce-app&quot;</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── ★ 边界定义：这个 Crate 对外暴露什么、内部封装什么 ──</span></span>
<span class="line">  boundary<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    exposes<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        name<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCard&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        interfaceKind<span class="token operator">:</span> <span class="token string">&quot;component&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        filePath<span class="token operator">:</span> <span class="token string">&quot;src/components/ProductPurchaseCard/ProductPurchaseCard.tsx&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        signature<span class="token operator">:</span></span>
<span class="line">          <span class="token string">&quot;(props: ProductPurchaseCardProps) =&gt; React.JSX.Element&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        stable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">        deprecated<span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">        docsUrl<span class="token operator">:</span> <span class="token string">&quot;https://storybook.example.com/?path=/docs/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        name<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCardProps&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        interfaceKind<span class="token operator">:</span> <span class="token string">&quot;type&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        filePath<span class="token operator">:</span> <span class="token string">&quot;src/components/ProductPurchaseCard/ProductPurchaseCard.types.ts&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        signature<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">{</span>
<span class="line">  product: Product;</span>
<span class="line">  onAddToCart: (productId: string, quantity: number) =&gt; void;</span>
<span class="line">  onBuyNow: (productId: string) =&gt; void;</span>
<span class="line">  variant?: &quot;default&quot; | &quot;compact&quot; | &quot;hero&quot;;</span>
<span class="line">  className?: string;</span>
<span class="line">}</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line">        stable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        name<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCardSkeleton&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        interfaceKind<span class="token operator">:</span> <span class="token string">&quot;component&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        filePath<span class="token operator">:</span> <span class="token string">&quot;src/components/ProductPurchaseCard/ProductPurchaseCardSkeleton.tsx&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        signature<span class="token operator">:</span> <span class="token string">&quot;() =&gt; React.JSX.Element&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        stable<span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    encapsulations<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token string">&quot;src/components/ProductPurchaseCard/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string">&quot;src/components/ProductPurchaseCard/__tests__/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string">&quot;src/components/ProductPurchaseCard/stories/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// internal = 仅同一个 repository 内的代码可以导入</span></span>
<span class="line">    visibility<span class="token operator">:</span> <span class="token string">&quot;internal&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ── 扩展属性 ──</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 技术栈</span></span>
<span class="line">    techStack<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;react&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;typescript&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;tailwindcss&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;framer-motion&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 关联的 Storybook 路径</span></span>
<span class="line">    storybookPath<span class="token operator">:</span> <span class="token string">&quot;/story/product-purchase-card--default&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 负责人</span></span>
<span class="line">    owner<span class="token operator">:</span> <span class="token string">&quot;ui-team&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment">// 审查状态（飞轮指标）</span></span>
<span class="line">    reviewStats<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      lastReviewAt<span class="token operator">:</span> <span class="token string">&quot;2026-07-01T10:00:00Z&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      findingsCount<span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span></span>
<span class="line">      severity<span class="token operator">:</span> <span class="token string">&quot;low&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Relation定义：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"><span class="token comment">// Relation 1: Crate 符合 Archetype</span></span>
<span class="line"><span class="token comment">// &quot;ProductPurchaseCard 这个 Crate 遵循了</span></span>
<span class="line"><span class="token comment">//  ecommerce-purchase-card 这个 Archetype 的设计契约&quot;</span></span>
<span class="line"><span class="token comment">// ═══════════════════════════════════════════════════════════</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> conformsRelation<span class="token operator">:</span> Relation <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  id<span class="token operator">:</span> <span class="token string">&quot;rel-card-001&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  sourceUid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  targetUid<span class="token operator">:</span> <span class="token string">&quot;archetype:default/ecommerce-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  relationType<span class="token operator">:</span> <span class="token string">&quot;conformsTo&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    strength<span class="token operator">:</span> <span class="token string">&quot;strong&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    direction<span class="token operator">:</span> <span class="token string">&quot;unidirectional&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    reason<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCard 是电商商品卡片的标准实现，必须满足所有卡片设计契约&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    phase<span class="token operator">:</span> <span class="token string">&quot;compile&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    extra<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      conformanceScore<span class="token operator">:</span> <span class="token number">0.92</span><span class="token punctuation">,</span>     <span class="token comment">// 一致性评分</span></span>
<span class="line">      verifiedAt<span class="token operator">:</span> <span class="token string">&quot;2026-07-01&quot;</span><span class="token punctuation">,</span>   <span class="token comment">// 最近一次验证通过时间</span></span>
<span class="line">      verifiedBy<span class="token operator">:</span> <span class="token string">&quot;scan-run-42&quot;</span><span class="token punctuation">,</span>  <span class="token comment">// 由哪次审查运行验证</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ── 依赖关系：卡片依赖商品类型定义 ──</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> productTypeCrate<span class="token operator">:</span> StructureUnit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  uid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-types&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitKind<span class="token operator">:</span> <span class="token string">&quot;crate&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitTypes<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;types&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;domain-model&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  displayName<span class="token operator">:</span> <span class="token string">&quot;Product Types&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  description<span class="token operator">:</span> <span class="token string">&quot;商品领域的数据类型定义，包括 Product、ProductStatus、Price 等&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">&quot;crate&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  boundary<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    exposes<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        name<span class="token operator">:</span> <span class="token string">&quot;Product&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        interfaceKind<span class="token operator">:</span> <span class="token string">&quot;type&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        filePath<span class="token operator">:</span> <span class="token string">&quot;src/types/product.ts&quot;</span><span class="token punctuation">,</span></span>
<span class="line">        signature<span class="token operator">:</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">{</span>
<span class="line">  id: string;</span>
<span class="line">  name: string;</span>
<span class="line">  description: string;</span>
<span class="line">  images: string[];</span>
<span class="line">  price: Price;</span>
<span class="line">  status: ProductStatus;</span>
<span class="line">  stockQuantity: number;</span>
<span class="line">  category: string;</span>
<span class="line">}</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    encapsulations<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;src/types/product*.ts&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    visibility<span class="token operator">:</span> <span class="token string">&quot;public&quot;</span><span class="token punctuation">,</span> <span class="token comment">// 类型定义应对全仓库公开</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> dependsOnProductTypes<span class="token operator">:</span> Relation <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  id<span class="token operator">:</span> <span class="token string">&quot;rel-card-002&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  sourceUid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  targetUid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-types&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  relationType<span class="token operator">:</span> <span class="token string">&quot;dependsOn&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    strength<span class="token operator">:</span> <span class="token string">&quot;strong&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    direction<span class="token operator">:</span> <span class="token string">&quot;unidirectional&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    reason<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCardProps 引用了 Product 类型，卡片渲染依赖于商品数据结构&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    phase<span class="token operator">:</span> <span class="token string">&quot;compile&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ── 层级关系：Crate 属于某个 Repository ──</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> repository<span class="token operator">:</span> StructureUnit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  uid<span class="token operator">:</span> <span class="token string">&quot;repository:default/my-ecommerce-app&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitKind<span class="token operator">:</span> <span class="token string">&quot;repository&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitTypes<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;monorepo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;turborepo&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;ecommerce&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  displayName<span class="token operator">:</span> <span class="token string">&quot;My E-commerce App&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  description<span class="token operator">:</span> <span class="token string">&quot;电商前端应用——包含商品浏览、购物车、下单等完整购买链路&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">&quot;repository&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  boundary<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    exposes<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    encapsulations<span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token string">&quot;src/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string">&quot;packages/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token string">&quot;apps/**&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">    visibility<span class="token operator">:</span> <span class="token string">&quot;public&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> partOfRepo<span class="token operator">:</span> Relation <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  id<span class="token operator">:</span> <span class="token string">&quot;rel-card-003&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  sourceUid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  targetUid<span class="token operator">:</span> <span class="token string">&quot;repository:default/my-ecommerce-app&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  relationType<span class="token operator">:</span> <span class="token string">&quot;partOf&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    strength<span class="token operator">:</span> <span class="token string">&quot;strong&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    reason<span class="token operator">:</span> <span class="token string">&quot;商品购买卡片是电商应用的 UI 组件之一&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// ── 引用关系：Storybook 文档引用了该组件 ──</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> storybookPage<span class="token operator">:</span> StructureUnit <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  uid<span class="token operator">:</span> <span class="token string">&quot;page:default/my-ecommerce-app/storybook/product-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitKind<span class="token operator">:</span> <span class="token string">&quot;page&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  unitTypes<span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;documentation&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;storybook&quot;</span><span class="token punctuation">]</span><span class="token punctuation">,</span></span>
<span class="line">  displayName<span class="token operator">:</span> <span class="token string">&quot;ProductPurchaseCard Stories&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  level<span class="token operator">:</span> <span class="token string">&quot;page&quot;</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> referencedByStorybook<span class="token operator">:</span> Relation <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  id<span class="token operator">:</span> <span class="token string">&quot;rel-card-004&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  sourceUid<span class="token operator">:</span> <span class="token string">&quot;page:default/my-ecommerce-app/storybook/product-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  targetUid<span class="token operator">:</span> <span class="token string">&quot;crate:default/product-purchase-card&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  relationType<span class="token operator">:</span> <span class="token string">&quot;references&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  properties<span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    strength<span class="token operator">:</span> <span class="token string">&quot;weak&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    reason<span class="token operator">:</span> <span class="token string">&quot;Storybook 文档引用组件作为演示对象&quot;</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">Repository ←─partOf── ProductCard ──conformsTo──→ Archetype</span>
<span class="line">                         │                            │</span>
<span class="line">                         │ dependsOn             archetype_ref</span>
<span class="line">                         ▼                            ↓</span>
<span class="line">                    ProductTypes               ComponentDesignBP</span>
<span class="line">                         ▲</span>
<span class="line">                         │ <span class="token function">references</span> <span class="token punctuation">(</span>Storybook<span class="token punctuation">)</span></span>
<span class="line">                         │</span>
<span class="line">                   StorybookPage</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h2 id="具有通用性" tabindex="-1"><a class="header-anchor" href="#具有通用性"><span>具有通用性</span></a></h2><p>所有参考几乎都是，用户输入-&gt;数据实体-&gt;产出。 我们项目的过程其实是逆过程，产出-&gt;对照实体-&gt;输出问题。</p><hr><h2 id="用来表述的结构要ai友好" tabindex="-1"><a class="header-anchor" href="#用来表述的结构要ai友好"><span>用来表述的结构要AI友好</span></a></h2><h3 id="flat-tree使用扁平的结构" tabindex="-1"><a class="header-anchor" href="#flat-tree使用扁平的结构"><span>flat tree使用扁平的结构</span></a></h3><p>flat tree 的核心好处：每个元素是一个独立的键值对，LLM 流式生成时不会因为少一个 } 导致整个 JSON 非法。这直接解决了 AI 生成嵌套 JSON 的&quot;括号地狱&quot;问题:</p><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line">  <span class="token comment">// ❌ 嵌套 JSON（AI 流式生成时容易括号不闭合）</span></span>
<span class="line">  <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Card&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;props&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Button&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;props&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">      <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Icon&quot;</span><span class="token punctuation">,</span> ... <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span><span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✅ Flat tree + ID 引用（每个元素独立，ID 引用连接）</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">    <span class="token property">&quot;root&quot;</span><span class="token operator">:</span> <span class="token string">&quot;card-1&quot;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token property">&quot;elements&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token property">&quot;card-1&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Card&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;props&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;btn-1&quot;</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;btn-1&quot;</span><span class="token operator">:</span>  <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Button&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;props&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token string">&quot;icon-1&quot;</span><span class="token punctuation">]</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token property">&quot;icon-1&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token property">&quot;type&quot;</span><span class="token operator">:</span> <span class="token string">&quot;Icon&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;props&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;children&quot;</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="zod-schema-约束-运行时验证" tabindex="-1"><a class="header-anchor" href="#zod-schema-约束-运行时验证"><span>Zod Schema = 约束 + 运行时验证</span></a></h3><p>要做好动态类型检验。json-render 的catalog.Validate()、wasp的tsc 类型检查-AI 输出后立即有反馈信号。没有验证层的AI生成是不可靠的。Structureunit 的zod schema应同时承担&quot;给AI 看的 prompt&quot;和&quot;验证AI 输出的guard&quot;双重角色。</p><h3 id="表达式用-json-dsl-而非-js" tabindex="-1"><a class="header-anchor" href="#表达式用-json-dsl-而非-js"><span>表达式用 JSON DSL 而非 JS</span></a></h3><div class="language-json line-numbers-mode" data-highlighter="prismjs" data-ext="json"><pre><code class="language-json"><span class="line"><span class="token punctuation">{</span> <span class="token property">&quot;$state&quot;</span><span class="token operator">:</span> <span class="token string">&quot;/form/hasError&quot;</span> <span class="token punctuation">}</span>                    <span class="token comment">// 引用状态</span></span>
<span class="line"><span class="token punctuation">{</span> <span class="token property">&quot;$cond&quot;</span><span class="token operator">:</span> <span class="token punctuation">{</span>...<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token property">&quot;$then&quot;</span><span class="token operator">:</span> <span class="token string">&quot;home&quot;</span><span class="token punctuation">,</span> <span class="token property">&quot;$else&quot;</span><span class="token operator">:</span> <span class="token string">&quot;outline&quot;</span> <span class="token punctuation">}</span>  <span class="token comment">// 条件</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><p>这些表达式是纯 JSON 值，不是代码字符串——AI 生成 JSON 远比生成&quot;不会出 bug 的 JavaScript&quot;可靠。</p><h3 id="统一的数据结构" tabindex="-1"><a class="header-anchor" href="#统一的数据结构"><span>统一的数据结构</span></a></h3><p>这点和上面的一样</p><div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre><code class="language-yaml"><span class="line"><span class="token key atrule">apiVersion</span><span class="token punctuation">:</span> backstage.io/v1alpha1</span>
<span class="line"><span class="token key atrule">kind</span><span class="token punctuation">:</span> Component</span>
<span class="line"><span class="token key atrule">metadata</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">name</span><span class="token punctuation">:</span> my<span class="token punctuation">-</span>service</span>
<span class="line"><span class="token key atrule">spec</span><span class="token punctuation">:</span></span>
<span class="line">  <span class="token key atrule">type</span><span class="token punctuation">:</span> service</span>
<span class="line">  <span class="token key atrule">owner</span><span class="token punctuation">:</span> team<span class="token punctuation">-</span>a</span>
<span class="line">  <span class="token key atrule">lifecycle</span><span class="token punctuation">:</span> production</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>不管你描述的是服务、数据库、API、团队还是文档，全部遵循 apiVersion + kind + metadata + spec 四段式。AI 不需要学习不同的格式——学会了 envelope，就能描述任何软件资产。</p><h3 id="toprompt-机制" tabindex="-1"><a class="header-anchor" href="#toprompt-机制"><span>toPrompt() 机制</span></a></h3><p>json-render 的杀手锏是 catalog.prompt()——一键把整个数据结构定义编译为 AI 可消费的 system prompt。Daedalus 的 StructureUnit + Relation + Constraint 模型如果真的落地，最核心的 AI 友好设计应该是：</p><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token comment">// 定义一个archetype</span></span>
<span class="line"><span class="token keyword">const</span> archetype <span class="token operator">=</span> New <span class="token function">Archetype</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">	<span class="token comment">// init</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> archetypePrompt <span class="token operator">=</span> archetype<span class="token punctuation">.</span><span class="token function">toPrompt</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">// &quot;这个结构单元是一个 React 组件。它必须满足：</span></span>
<span class="line"><span class="token comment">//  1. 文件路径匹配 src/components/**/ComponentName.tsx</span></span>
<span class="line"><span class="token comment">//  2. 必须有 .test.tsx 和 .stories.tsx 伴随文件</span></span>
<span class="line"><span class="token comment">//  3. 只能从 @/ui 导入 UI 组件</span></span>
<span class="line"><span class="token comment">//  4. ...&quot;</span></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样 AI 审查代码时，不是收到一堆自由文本的 Condition，而是被一个结构化的、可验证的、由 Zod schema 约束的 Contract 所引导。这才是&quot;AI 友好&quot;的本质——数据结构的设计本身就是 AI 的 prompt。</p><h3 id="有限词汇表" tabindex="-1"><a class="header-anchor" href="#有限词汇表"><span>有限词汇表</span></a></h3><p>Backstage 的well-known relations、Structurizr的~20种元素、Wasp的固定spec声明类型——词汇表越小，AI 幻觉越少。Relation类型不要做成自由文本，要用discriminatorunion限定。</p><h3 id="描述优于代码" tabindex="-1"><a class="header-anchor" href="#描述优于代码"><span>描述优于代码</span></a></h3><p>所有方案的description 字段都不只是文档——它们是 AI prompt 的原材料。每个结构单元都应该有能让AI理解的语义描述。 Crate/Archetype 的description应该写得像给AI看的一样（目前已经是，但需保持）。</p><hr><h2 id="层级路径命名体系" tabindex="-1"><a class="header-anchor" href="#层级路径命名体系"><span>层级路径命名体系</span></a></h2><p>借鉴三个来源：</p><ul><li><strong>Rust <code>pub use</code></strong>：内部路径和公开路径可以不同</li><li><strong>Backstage</strong> <code>{kind}:{namespace}/{name}</code></li><li><strong>Google AIP</strong> Resource Name 的层级路径</li></ul><p>&gt; 还有一个小问题，目前的rule，crate与archetype他们的UID都是在前端生成的，这个应该是后端去做的</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">UID 格式:  {kind}:{namespace}/{path}[/{sub-path}...]</span>
<span class="line"></span>
<span class="line">部件说明:</span>
<span class="line">  kind       = [a-z][a-z0-9_-]*        -- 结构单元种类</span>
<span class="line">  namespace  = [a-z][a-z0-9_-]*        -- 命名空间（通常=repository 名）</span>
<span class="line">  path       = [a-z][a-z0-9_/.-]*      -- 层级路径</span>
<span class="line"></span>
<span class="line">示例:</span>
<span class="line">  repository:default/daedalus</span>
<span class="line">  crate:default/daedalus-app</span>
<span class="line">  crate:default/daedalus-app/src/components/Button</span>
<span class="line">  archetype:default/component-design-best-practice</span>
<span class="line">  page:default/daedalus-app/src/pages/CrateList</span>
<span class="line">  skill:default/react-component-creator          ← 未来</span>
<span class="line">  item:default/typescript-sword                  ← 未来</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,69)])])}const o=n(t,[["render",l]]),u=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%BB%A3%E8%BE%BE%E7%BD%97%E6%96%AF/%E9%9C%80%E6%B1%82/COD-104/%E6%80%BB%E7%BB%93.html","title":"总结","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/代达罗斯/需求/COD-104/总结.md"}');export{o as comp,u as data};
