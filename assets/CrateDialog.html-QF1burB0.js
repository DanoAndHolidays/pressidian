import{_ as s,c as a,b as e,o as p}from"./app-Bmdocauq.js";const l={};function t(i,n){return p(),a("div",null,[...n[0]||(n[0]=[e(`<h1 id="cratedialog" tabindex="-1"><a class="header-anchor" href="#cratedialog"><span>CrateDialog</span></a></h1><div class="language-typescript line-numbers-mode" data-highlighter="prismjs" data-ext="ts"><pre><code class="language-typescript"><span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> useCallback<span class="token punctuation">,</span> useMemo <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Controller<span class="token punctuation">,</span> FormProvider<span class="token punctuation">,</span> useForm <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-hook-form&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> zodResolver <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@hookform/resolvers/zod&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> useList <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@refinedev/core&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span></span>
<span class="line">  crateFormSchema<span class="token punctuation">,</span></span>
<span class="line">  CrateTypeValues<span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">type</span> <span class="token class-name">Archetype</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">type</span> <span class="token class-name">Crate</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">type</span> <span class="token class-name">CrateFormValues</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">type</span> <span class="token class-name">CratePathInput</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@repo/schemas&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> <span class="token constant">X</span> <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;lucide-react&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Button <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/button&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Dialog <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/dialog&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Input <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/input&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Label <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/label&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Select <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/select&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> MultiSelect <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/multi-select&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Textarea <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/components/ui/textarea&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> useTranslation <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;react-i18next&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> ResourceName <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@/integrations/refine/dataProvider&quot;</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> CratePathsField <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;./CratePathsField&quot;</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">interface</span> <span class="token class-name">CrateDialogProps</span> <span class="token punctuation">{</span></span>
<span class="line">  editing<span class="token operator">:</span> Crate <span class="token operator">|</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function-variable function">onCreate</span><span class="token operator">:</span> <span class="token punctuation">(</span>values<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">unknown</span><span class="token operator">&gt;</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function-variable function">onUpdate</span><span class="token operator">:</span> <span class="token punctuation">(</span>values<span class="token operator">:</span> Record<span class="token operator">&lt;</span><span class="token builtin">string</span><span class="token punctuation">,</span> <span class="token builtin">unknown</span><span class="token operator">&gt;</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token function-variable function">onClose</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">void</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">toRepositoryId</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span></span>
<span class="line">  value<span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">|</span> <span class="token keyword">undefined</span><span class="token punctuation">,</span></span>
<span class="line">  isEdit<span class="token operator">:</span> <span class="token builtin">boolean</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token operator">:</span> <span class="token builtin">string</span> <span class="token operator">|</span> <span class="token keyword">null</span> <span class="token operator">|</span> <span class="token keyword">undefined</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第1题：规范化仓库 ID 的写入语义</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 实现创建与编辑场景下 repositoryId 的边界转换：有值时原样返回；</span></span>
<span class="line">  <span class="token comment">// 空值在编辑时应表示“显式解除关联”，创建时应表示“不提交该字段”。</span></span>
<span class="line">  <span class="token comment">// （提示：使用 value、isEdit，并区分 null 与 undefined）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">return</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token function-variable function">CrateDialog</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  editing<span class="token punctuation">,</span></span>
<span class="line">  onCreate<span class="token punctuation">,</span></span>
<span class="line">  onUpdate<span class="token punctuation">,</span></span>
<span class="line">  onClose<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token operator">:</span> CrateDialogProps<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第2题：解析编辑态并构造安全的初始快照</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 获取翻译函数、判断当前模式，并从 editing 中读取 archetypeIds、</span></span>
<span class="line">  <span class="token comment">// repositoryId 与 paths。缺失字段要提供正确默认值，数组数据不能直接复用原引用。</span></span>
<span class="line">  <span class="token comment">// （提示：useTranslation、isEdit；保留 editingArchetypeIds、editingRepositoryId、</span></span>
<span class="line">  <span class="token comment">// editingPaths 三个变量名；paths 的元素也要浅拷贝）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第3题：用共享 Zod Schema 初始化表单</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 创建类型安全的 React Hook Form 实例，接入共享 schema，并同时覆盖创建态与编辑态默认值。</span></span>
<span class="line">  <span class="token comment">// （提示：useForm&lt;CrateFormValues&gt;、zodResolver(crateFormSchema)、defaultValues；</span></span>
<span class="line">  <span class="token comment">// type 的创建态默认值为 package，数组默认值应避免共享引用）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第4题：提取表单控制能力与状态</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 从表单实例中取得原生字段注册、受控字段控制、提交包装器、校验错误和提交中状态。</span></span>
<span class="line">  <span class="token comment">// （提示：变量名为 control、handleSubmit、register、errors、isSubmitting；</span></span>
<span class="line">  <span class="token comment">// errors 与 isSubmitting 位于 formState）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第5题：加载 Archetype 并生成多选项</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 通过 Refine 获取全部 Archetype，将可能为空的查询结果稳定为数组，</span></span>
<span class="line">  <span class="token comment">// 再映射成 MultiSelect 所需的 { id, label } 结构。</span></span>
<span class="line">  <span class="token comment">// （提示：useList&lt;Archetype&gt;、ResourceName.archetypes、pageSize: 0；</span></span>
<span class="line">  <span class="token comment">// 用 useMemo 创建 archetypes 与 archetypeOptions，并写全依赖数组）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第6题：加载 GitHub 仓库候选项</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 查询全部 GitHub 项目，并把 result.data 规范化为供仓库 Select 使用的 projects 数组。</span></span>
<span class="line">  <span class="token comment">// （提示：useList&lt;Record&lt;string, unknown&gt;&gt;、ResourceName.githubProjects；</span></span>
<span class="line">  <span class="token comment">// 将 result 重命名为 projectsResult，useMemo 依赖 projectsResult?.data）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第7题：实现关闭与提交边界</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 实现稳定的关闭回调与表单提交回调。提交时清理文本字段、规范化可选 metadata、</span></span>
<span class="line">  <span class="token comment">// 调用第1题的仓库 ID 转换、保留路径和 Archetype 关联；编辑调用 onUpdate，</span></span>
<span class="line">  <span class="token comment">// 创建则补充 crypto.randomUUID() 生成的 id 后调用 onCreate。</span></span>
<span class="line">  <span class="token comment">// （提示：useCallback；onSubmit 参数类型为 CrateFormValues；注意完整依赖数组）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 📝 第8题：完成表单内容与双模式界面渲染</span></span>
<span class="line">  <span class="token comment">// ============================================================</span></span>
<span class="line">  <span class="token comment">// 完成 Crate 表单、底部操作区以及创建/编辑两种容器：创建态使用 Dialog，</span></span>
<span class="line">  <span class="token comment">// 编辑态使用右侧抽屉。所有原生表单控件均复用已导入的 UI 组件。</span></span>
<span class="line">  <span class="token comment">// （提示：FormProvider 包裹 form；form.onSubmit 使用 handleSubmit(onSubmit)；</span></span>
<span class="line">  <span class="token comment">// 普通字段使用 register，archetypeIds 使用 Controller + MultiSelect；</span></span>
<span class="line">  <span class="token comment">// type 选项来自 CrateTypeValues；路径编辑复用 CratePathsField；</span></span>
<span class="line">  <span class="token comment">// 展示 errors.name/errors.metadata，提交按钮绑定 isSubmitting；</span></span>
<span class="line">  <span class="token comment">// Select 的仓库选项展示 owner/repo，关闭按钮使用 handleClose）</span></span>
<span class="line"></span>
<span class="line">  <span class="token comment">// ✏️ 你的代码：</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2)])])}const o=s(l,[["render",t]]),r=JSON.parse('{"path":"/notes/obsidian/%E5%89%8D%E7%AB%AF/%E9%A1%B9%E7%9B%AE%E7%AC%94%E8%AE%B0/%E4%BB%A3%E8%BE%BE%E7%BD%97%E6%96%AF/%E8%80%83%E8%AF%95/CrateDialog.html","title":"CrateDialog","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/前端/项目笔记/代达罗斯/考试/CrateDialog.md"}');export{o as comp,r as data};
