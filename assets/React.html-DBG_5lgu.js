import{_ as s,c as a,b as p,o as e}from"./app-DPjfhbqi.js";const t={};function l(i,n){return e(),a("div",null,[...n[0]||(n[0]=[p(`<h1 id="react" tabindex="-1"><a class="header-anchor" href="#react"><span>React</span></a></h1><h2 id="代码实现" tabindex="-1"><a class="header-anchor" href="#代码实现"><span>代码实现</span></a></h2><div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre><code class="language-javascript"><span class="line"><span class="token keyword">import</span> dotenv <span class="token keyword">from</span> <span class="token string">&#39;dotenv&#39;</span></span>
<span class="line"><span class="token keyword">import</span> path <span class="token keyword">from</span> <span class="token string">&#39;path&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 直接使用原生提供的 dirname，效果和之前完全一样</span></span>
<span class="line"><span class="token keyword">const</span> __dirname <span class="token operator">=</span> <span class="token keyword">import</span><span class="token punctuation">.</span>meta<span class="token punctuation">.</span>dirname</span>
<span class="line"></span>
<span class="line">dotenv<span class="token punctuation">.</span><span class="token function">config</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> path<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span>__dirname<span class="token punctuation">,</span> <span class="token string">&#39;../../.env&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> LLMClient <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;src/core/client&#39;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span> Agent <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../core/agent&#39;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token punctuation">{</span></span>
<span class="line">    LLMConfig<span class="token punctuation">,</span></span>
<span class="line">    LLMMessage<span class="token punctuation">,</span></span>
<span class="line">    LLMRequestOptions<span class="token punctuation">,</span></span>
<span class="line">    LLMResponse<span class="token punctuation">,</span></span>
<span class="line">    AgentConfig<span class="token punctuation">,</span></span>
<span class="line">    ToolDefinition<span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&#39;../core/types&#39;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> <span class="token constant">MOCK_TOOLS</span><span class="token operator">:</span> Record<span class="token operator">&lt;</span>string<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">description</span><span class="token operator">:</span> string<span class="token punctuation">;</span> <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">args</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> string <span class="token punctuation">}</span><span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">get_weather</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;获取指定城市的天气信息，输入城市名，返回天气状况和温度&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">city</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">const</span> <span class="token literal-property property">weatherMap</span><span class="token operator">:</span> Record<span class="token operator">&lt;</span>string<span class="token punctuation">,</span> string<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token literal-property property">北京</span><span class="token operator">:</span> <span class="token string">&#39;晴，15-28°C&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">上海</span><span class="token operator">:</span> <span class="token string">&#39;多云，20-26°C&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">广州</span><span class="token operator">:</span> <span class="token string">&#39;雨，24-30°C&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">深圳</span><span class="token operator">:</span> <span class="token string">&#39;晴，25-31°C&#39;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">return</span> weatherMap<span class="token punctuation">[</span>city<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token string">&#39;暂无该城市天气数据&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">search_attractions</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;搜索旅游景点，输入城市名，返回热门景点列表&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">city</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">const</span> <span class="token literal-property property">attractionsMap</span><span class="token operator">:</span> Record<span class="token operator">&lt;</span>string<span class="token punctuation">,</span> string<span class="token operator">&gt;</span> <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token literal-property property">北京</span><span class="token operator">:</span> <span class="token string">&#39;故宫、天安门、长城、颐和园、天坛&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">上海</span><span class="token operator">:</span> <span class="token string">&#39;外滩、东方明珠、豫园、田子坊&#39;</span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token literal-property property">广州</span><span class="token operator">:</span> <span class="token string">&#39;广州塔、珠江新城、北京路、沙面&#39;</span><span class="token punctuation">,</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">return</span> attractionsMap<span class="token punctuation">[</span>city<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token string">&#39;暂无该城市景点数据&#39;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">calculate</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">description</span><span class="token operator">:</span> <span class="token string">&#39;数学计算器，输入数学表达式，返回计算结果&#39;</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">expr</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">const</span> result <span class="token operator">=</span> <span class="token function">eval</span><span class="token punctuation">(</span>expr<span class="token punctuation">)</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token function">String</span><span class="token punctuation">(</span>result<span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">return</span> <span class="token string">&#39;计算表达式有误&#39;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">formatTools</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">toolRegistry</span><span class="token operator">:</span> Record<span class="token operator">&lt;</span>string<span class="token punctuation">,</span> any<span class="token operator">&gt;</span></span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">const</span> toolList <span class="token operator">=</span> Object<span class="token punctuation">.</span><span class="token function">entries</span><span class="token punctuation">(</span>toolRegistry<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter"><span class="token punctuation">[</span>name<span class="token punctuation">,</span> tool<span class="token punctuation">]</span></span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">- </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>tool<span class="token punctuation">.</span>description<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">return</span> toolList <span class="token operator">||</span> <span class="token string">&#39;没有可用的工具&#39;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">function</span> <span class="token function">buildPrompt</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">tools</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">question</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">history</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">你是一个具备推理和行动能力的AI助手。你可以通过思考分析问题，然后调用合适的工具来获取信息，最终给出准确的答案。</span>
<span class="line"></span>
<span class="line">## 可用工具</span>
<span class="line"></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>tools<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"></span>
<span class="line"></span>
<span class="line">## 工作流程</span>
<span class="line">请严格按照以下格式进行回应，每次只能执行一个步骤:</span>
<span class="line"></span>
<span class="line">Thought: 分析当前问题，思考需要什么信息或采取什么行动。</span>
<span class="line">Action: 选择一个行动，格式必须是以下之一:</span>
<span class="line">- &#39;tool_name[tool_input]&#39; - 调用指定工具</span>
<span class="line">- &#39;Finish[最终答案]&#39; - 当你有足够信息给出最终答案时</span>
<span class="line"></span>
<span class="line">## 重要提醒</span>
<span class="line">1. 每次回应必须包含Thought和Action两部分</span>
<span class="line">2. 工具调用的格式必须严格遵循:工具名[参数]</span>
<span class="line">3. 只有当你确信有足够信息回答问题时，才使用Finish</span>
<span class="line">4. 如果工具返回的信息不够，继续使用其他工具或相同工具的不同参数</span>
<span class="line"></span>
<span class="line">## 当前任务</span>
<span class="line">**Question:** </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>question<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"></span>
<span class="line"></span>
<span class="line">## 执行历史</span>
<span class="line"></span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>history<span class="token punctuation">.</span>length <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">?</span> history<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;\\n&#39;</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token string">&#39;(无)&#39;</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"></span>
<span class="line"></span>
<span class="line">现在开始你的推理和行动:</span>
<span class="line"></span><span class="token template-punctuation string">\`</span></span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// a simple react agent</span></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">class</span> <span class="token class-name">ReactAgent</span> <span class="token keyword">extends</span> <span class="token class-name">Agent</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">toolRegistry</span><span class="token operator">:</span> any</span>
<span class="line">    <span class="token literal-property property">enableToolCalling</span><span class="token operator">:</span> boolean</span>
<span class="line">    <span class="token literal-property property">maxStep</span><span class="token operator">:</span> number</span>
<span class="line">    <span class="token literal-property property">currentHistory</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line">    <span class="token literal-property property">customPrompt</span><span class="token operator">:</span> string</span>
<span class="line">    <span class="token function">constructor</span><span class="token punctuation">(</span></span>
<span class="line">        <span class="token parameter"><span class="token literal-property property">llm</span><span class="token operator">:</span> LLMClient<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">name</span><span class="token operator">:</span> string<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">config</span><span class="token operator">:</span> AgentConfig<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">systemPropmt</span><span class="token operator">:</span> string<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">toolRegistry</span><span class="token operator">:</span> any<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">enableToolCalling</span><span class="token operator">:</span> boolean <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">maxStep</span><span class="token operator">:</span> number<span class="token punctuation">,</span></span>
<span class="line">        <span class="token literal-property property">customPrompt</span><span class="token operator">:</span> string<span class="token punctuation">,</span></span></span>
<span class="line">    <span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span>llm<span class="token punctuation">,</span> name<span class="token punctuation">,</span> config<span class="token punctuation">,</span> systemPropmt<span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>toolRegistry <span class="token operator">=</span> toolRegistry</span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>enableToolCalling <span class="token operator">=</span> enableToolCalling <span class="token operator">&amp;&amp;</span> toolRegistry</span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>maxStep <span class="token operator">=</span> maxStep</span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>currentHistory <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>customPrompt <span class="token operator">=</span> customPrompt</span>
<span class="line"></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;基础信息: &#39;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getInfo</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">        console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">ReactAgent </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>name<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> 构建成功，最大步数</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>maxStep<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">buildPrompt</span><span class="token punctuation">(</span>toolsDesc<span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">question</span><span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">history</span><span class="token operator">:</span> string<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">buildPrompt</span><span class="token punctuation">(</span>toolsDesc<span class="token punctuation">,</span> question<span class="token punctuation">,</span> history<span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">parseOutput</span><span class="token punctuation">(</span><span class="token parameter"><span class="token literal-property property">responseWithThoughtAndAction</span><span class="token operator">:</span> string</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">let</span> thought <span class="token operator">=</span> <span class="token string">&#39;&#39;</span></span>
<span class="line">        <span class="token keyword">let</span> action <span class="token operator">=</span> <span class="token string">&#39;&#39;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">const</span> thoughtMatch <span class="token operator">=</span> responseWithThoughtAndAction<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span></span>
<span class="line">            <span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">Thought:\\s*([\\s\\S]*?)(?=\\s*Action:)</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">,</span></span>
<span class="line">        <span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>thoughtMatch <span class="token operator">&amp;&amp;</span> thoughtMatch<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            thought <span class="token operator">=</span> thoughtMatch<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">const</span> actionMatch <span class="token operator">=</span> responseWithThoughtAndAction<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">Action:\\s*([\\s\\S]*)</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>actionMatch <span class="token operator">&amp;&amp;</span> actionMatch<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            action <span class="token operator">=</span> actionMatch<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token punctuation">{</span> thought<span class="token punctuation">,</span> action <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token function">executeTool</span><span class="token punctuation">(</span>action<span class="token operator">:</span> string<span class="token punctuation">,</span> <span class="token literal-property property">toolRegistry</span><span class="token operator">:</span> Record<span class="token operator">&lt;</span>string<span class="token punctuation">,</span> any<span class="token operator">&gt;</span><span class="token punctuation">)</span><span class="token operator">:</span> string <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// 匹配格式: tool_name[args]</span></span>
<span class="line">        <span class="token keyword">const</span> match <span class="token operator">=</span> action<span class="token punctuation">.</span><span class="token function">match</span><span class="token punctuation">(</span><span class="token regex"><span class="token regex-delimiter">/</span><span class="token regex-source language-regex">^(\\w+)\\[(.+)\\]$</span><span class="token regex-delimiter">/</span></span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>match<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">无法解析工具调用: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>action<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">const</span> toolName <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token keyword">const</span> toolArgs <span class="token operator">=</span> match<span class="token punctuation">[</span><span class="token number">2</span><span class="token punctuation">]</span></span>
<span class="line">        <span class="token keyword">const</span> tool <span class="token operator">=</span> toolRegistry<span class="token punctuation">[</span>toolName<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>tool<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">工具不存在: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>toolName<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> tool<span class="token punctuation">.</span><span class="token function">fn</span><span class="token punctuation">(</span>toolArgs<span class="token punctuation">)</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span>e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">工具执行错误: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>e<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">async</span> <span class="token function">run</span><span class="token punctuation">(</span>inputText<span class="token operator">:</span> string<span class="token punctuation">)</span><span class="token operator">:</span> Promise<span class="token operator">&lt;</span>string<span class="token operator">&gt;</span> <span class="token punctuation">{</span></span>
<span class="line">        </span>
<span class="line">        <span class="token keyword">let</span> currentStep <span class="token operator">=</span> <span class="token number">0</span></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span>currentStep <span class="token operator">&lt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>maxStep<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\n当前第</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>currentStep <span class="token operator">+</span> <span class="token number">1</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">步</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">const</span> toolsDesc <span class="token operator">=</span> <span class="token function">formatTools</span><span class="token punctuation">(</span><span class="token constant">MOCK_TOOLS</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">const</span> stepHistory <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token operator">...</span><span class="token keyword">this</span><span class="token punctuation">.</span>currentHistory<span class="token punctuation">]</span></span>
<span class="line">            <span class="token comment">// console.log(stepHistory)</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">const</span> prompt <span class="token operator">=</span> <span class="token function">buildPrompt</span><span class="token punctuation">(</span>toolsDesc<span class="token punctuation">,</span> inputText<span class="token punctuation">,</span> stepHistory<span class="token punctuation">)</span></span>
<span class="line">            <span class="token comment">// console.log(prompt)</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">const</span> <span class="token literal-property property">messages</span><span class="token operator">:</span> LLMMessage<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">{</span> <span class="token literal-property property">role</span><span class="token operator">:</span> <span class="token string">&#39;user&#39;</span><span class="token punctuation">,</span> <span class="token literal-property property">content</span><span class="token operator">:</span> prompt <span class="token punctuation">}</span><span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>enableToolCalling<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">const</span> response <span class="token operator">=</span> <span class="token keyword">await</span> <span class="token keyword">this</span><span class="token punctuation">.</span>llm<span class="token punctuation">.</span><span class="token function">chat</span><span class="token punctuation">(</span><span class="token punctuation">{</span> messages <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token comment">// console.log(response);</span></span>
<span class="line"></span>
<span class="line">                <span class="token keyword">const</span> content <span class="token operator">=</span> response<span class="token punctuation">.</span>choices<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token operator">?.</span>message<span class="token operator">?.</span>content <span class="token operator">||</span> <span class="token string">&#39;&#39;</span></span>
<span class="line">                <span class="token keyword">const</span> <span class="token punctuation">{</span> thought<span class="token punctuation">,</span> action <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">parseOutput</span><span class="token punctuation">(</span>content<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\nThought: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>thought<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line">                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\nAction: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>action<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">                <span class="token comment">// 处理 Action</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>action<span class="token punctuation">.</span><span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token string">&#39;Finish[&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\n最终答案: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>action<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line">                    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;\\n最后一轮Prompt: &#39;</span><span class="token punctuation">,</span>prompt<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                    </span>
<span class="line">                    <span class="token keyword">return</span> action<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">7</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span></span>
<span class="line">                    <span class="token comment">// TODO</span></span>
<span class="line">                    <span class="token comment">// 这里要将对话的历史添加到this._history中去，而详细的React的步骤就不用去添加了</span></span>
<span class="line">                <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">                <span class="token comment">// 执行工具</span></span>
<span class="line">                <span class="token keyword">const</span> toolResult <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">executeTool</span><span class="token punctuation">(</span>action<span class="token punctuation">,</span> <span class="token constant">MOCK_TOOLS</span><span class="token punctuation">)</span></span>
<span class="line">                console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">工具执行结果: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>toolResult<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">                <span class="token comment">// 添加到历史</span></span>
<span class="line">                <span class="token keyword">this</span><span class="token punctuation">.</span>currentHistory<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span></span>
<span class="line">                    <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">\\n步骤</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>currentStep <span class="token operator">+</span> <span class="token number">1</span><span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">:\\nAction: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>action<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string"> \\nObservation: </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>toolResult<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">,</span></span>
<span class="line">                <span class="token punctuation">)</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">            currentStep<span class="token operator">++</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">&#39;达到最大步数限制&#39;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> llm <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LLMClient</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token literal-property property">provider</span><span class="token operator">:</span> <span class="token string">&#39;deepseek&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">apiKey</span><span class="token operator">:</span> process<span class="token punctuation">.</span>env<span class="token punctuation">.</span><span class="token constant">DEEPSEEK_API_KEY</span> <span class="token operator">||</span> <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">baseURL</span><span class="token operator">:</span> <span class="token string">&#39;https://api.deepseek.com&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token literal-property property">model</span><span class="token operator">:</span> <span class="token string">&#39;deepseek-chat&#39;</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// // console.log(process.env);</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">const</span> reactAgent <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ReactAgent</span><span class="token punctuation">(</span></span>
<span class="line">    llm<span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;ReactAgent&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token punctuation">{</span> <span class="token literal-property property">shit</span><span class="token operator">:</span> <span class="token string">&#39;test&#39;</span> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;你是一个友好的AI助手，用中文回答。&#39;</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token keyword">undefined</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token number">5</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">&#39;&#39;</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line">reactAgent<span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token string">&#39;给我安排去北京上海的旅行&#39;</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span>console<span class="token punctuation">.</span>log<span class="token punctuation">)</span></span>
<span class="line"></span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="执行结果" tabindex="-1"><a class="header-anchor" href="#执行结果"><span>执行结果</span></a></h2><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">➜  server git:(feat-agent-llm ~1) ✗ pnpm tsx src/agents/react_agent.ts</span>
<span class="line">◇ injected env (7) from .env // tip: ⌘ enable debugging { debug: true }</span>
<span class="line">基础信息:  </span>
<span class="line">            Agent Name: ReactAgent</span>
<span class="line">            Provider: deepseek</span>
<span class="line"></span>
<span class="line">ReactAgent ReactAgent 构建成功，最大步数5</span>
<span class="line">ReactAgent 正在处理: 给我安排去北京上海的旅行</span>
<span class="line"></span>
<span class="line">当前第1步</span>
<span class="line"></span>
<span class="line">Thought: 用户让我安排去北京上海的旅行。这需要我分别获取北京和上海的天气信息以及旅游景点信息，以 便提供合理的旅行建议。我先从查询北京的天气和景点开始。</span>
<span class="line"></span>
<span class="line">Action: get_weather[北京]</span>
<span class="line">工具执行结果: 晴，15-28°C</span>
<span class="line"></span>
<span class="line">当前第2步</span>
<span class="line"></span>
<span class="line">Thought: 用户希望安排去北京和上海的旅行。我需要先获取这两个城市的天气和景点信息，以便提供旅行建 议。我已经有了北京的天气（晴，15-28°C），现在需要获取上海的天气，以及两个城市的景点信息。       </span>
<span class="line"></span>
<span class="line">Action: get_weather[上海]</span>
<span class="line">工具执行结果: 多云，20-26°C</span>
<span class="line"></span>
<span class="line">当前第3步</span>
<span class="line"></span>
<span class="line">Thought: 我已经获取了北京和上海的天气信息。现在需要获取两地的热门景点，以便规划旅行安排。       </span>
<span class="line"></span>
<span class="line">Action: search_attractions[北京]</span>
<span class="line">工具执行结果: 故宫、天安门、长城、颐和园、天坛</span>
<span class="line"></span>
<span class="line">当前第4步</span>
<span class="line"></span>
<span class="line">Thought: 我已有北京和上海的天气信息，以及北京的景点信息。还需要上海的景点信息才能给出完整的旅行 安排建议。因此，我接下来需要获取上海的景点信息。</span>
<span class="line"></span>
<span class="line">Action: search_attractions[上海]</span>
<span class="line">工具执行结果: 外滩、东方明珠、豫园、田子坊</span>
<span class="line"></span>
<span class="line">当前第5步</span>
<span class="line"></span>
<span class="line">Thought: 我已经获取了北京和上海的天气信息以及热门景点列表。根据这些信息，我可以为用户安排一个简 单的一周旅行计划，涵盖北京和上海两个城市。北京天气晴朗，适宜户外游览；上海多云，也比较舒适。北京景点有故宫、天安门、长城等，上海有外滩、东方明珠等。我将推荐一个行程安排。</span>
<span class="line"></span>
<span class="line">Action: Finish[### 北京-上海旅行建议</span>
<span class="line"></span>
<span class="line">根据当前天气和景点信息，为您规划了一个7天的旅行计划：</span>
<span class="line"></span>
<span class="line">#### 📅 行程安排</span>
<span class="line"></span>
<span class="line">**Day 1-4：北京**</span>
<span class="line">- **天气**：晴，15-28°C（适宜出行，建议带薄外套）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 故宫（历史文化）</span>
<span class="line">  - 天安门广场（地标）</span>
<span class="line">  - 长城（一日游，建议选八达岭）</span>
<span class="line">  - 颐和园（皇家园林）</span>
<span class="line">  - 天坛（祈福圣地）</span>
<span class="line"></span>
<span class="line">**Day 5-7：上海**</span>
<span class="line">- **天气**：多云，20-26°C（舒适，偶有阴天）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 外滩（夜景必看）</span>
<span class="line">  - 东方明珠（登高观景）</span>
<span class="line">  - 豫园（江南古典园林）</span>
<span class="line">  - 田子坊（文艺小巷，适合闲逛）</span>
<span class="line"></span>
<span class="line">#### 💡 小贴士</span>
<span class="line">- 北京景点分散，建议包车或地铁+打车结合</span>
<span class="line">- 长城建议早出发，避开人流</span>
<span class="line">- 上海外滩晚上灯光更美</span>
<span class="line">- 两地温差不大，夏装+一件薄外套即可</span>
<span class="line"></span>
<span class="line">祝您旅途愉快！]</span>
<span class="line"></span>
<span class="line">最终答案: ### 北京-上海旅行建议</span>
<span class="line"></span>
<span class="line">根据当前天气和景点信息，为您规划了一个7天的旅行计划：</span>
<span class="line"></span>
<span class="line">#### 📅 行程安排</span>
<span class="line"></span>
<span class="line">**Day 1-4：北京**</span>
<span class="line">- **天气**：晴，15-28°C（适宜出行，建议带薄外套）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 故宫（历史文化）</span>
<span class="line">  - 天安门广场（地标）</span>
<span class="line">  - 长城（一日游，建议选八达岭）</span>
<span class="line">  - 颐和园（皇家园林）</span>
<span class="line">  - 天坛（祈福圣地）</span>
<span class="line"></span>
<span class="line">**Day 5-7：上海**</span>
<span class="line">- **天气**：多云，20-26°C（舒适，偶有阴天）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 外滩（夜景必看）</span>
<span class="line">  - 东方明珠（登高观景）</span>
<span class="line">  - 豫园（江南古典园林）</span>
<span class="line">  - 田子坊（文艺小巷，适合闲逛）</span>
<span class="line"></span>
<span class="line">#### 💡 小贴士</span>
<span class="line">- 北京景点分散，建议包车或地铁+打车结合</span>
<span class="line">- 长城建议早出发，避开人流</span>
<span class="line">- 上海外滩晚上灯光更美</span>
<span class="line">- 两地温差不大，夏装+一件薄外套即可</span>
<span class="line"></span>
<span class="line">祝您旅途愉快！</span>
<span class="line"></span>
<span class="line">最后一轮Prompt:  你是一个具备推理和行动能力的AI助手。你可以通过思考分析问题，然后调用合适的工具 来获取信息，最终给出准确的答案。</span>
<span class="line"></span>
<span class="line">## 可用工具</span>
<span class="line">- get_weather: 获取指定城市的天气信息，输入城市名，返回天气状况和温度</span>
<span class="line">- search_attractions: 搜索旅游景点，输入城市名，返回热门景点列表</span>
<span class="line">- calculate: 数学计算器，输入数学表达式，返回计算结果</span>
<span class="line"></span>
<span class="line">## 工作流程</span>
<span class="line">请严格按照以下格式进行回应，每次只能执行一个步骤:</span>
<span class="line"></span>
<span class="line">Thought: 分析当前问题，思考需要什么信息或采取什么行动。</span>
<span class="line">Action: 选择一个行动，格式必须是以下之一:</span>
<span class="line">- &#39;tool_name[tool_input]&#39; - 调用指定工具</span>
<span class="line">- &#39;Finish[最终答案]&#39; - 当你有足够信息给出最终答案时</span>
<span class="line"></span>
<span class="line">## 重要提醒</span>
<span class="line">1. 每次回应必须包含Thought和Action两部分</span>
<span class="line">2. 工具调用的格式必须严格遵循:工具名[参数]</span>
<span class="line">3. 只有当你确信有足够信息回答问题时，才使用Finish</span>
<span class="line">4. 如果工具返回的信息不够，继续使用其他工具或相同工具的不同参数</span>
<span class="line"></span>
<span class="line">## 当前任务</span>
<span class="line">**Question:** 给我安排去北京上海的旅行</span>
<span class="line"></span>
<span class="line">## 执行历史</span>
<span class="line"></span>
<span class="line">步骤1:</span>
<span class="line">Action: get_weather[北京]</span>
<span class="line">Observation: 晴，15-28°C</span>
<span class="line"></span>
<span class="line">步骤2:</span>
<span class="line">Action: get_weather[上海]</span>
<span class="line">Observation: 多云，20-26°C</span>
<span class="line"></span>
<span class="line">步骤3:</span>
<span class="line">Action: search_attractions[北京]</span>
<span class="line">Observation: 故宫、天安门、长城、颐和园、天坛</span>
<span class="line"></span>
<span class="line">步骤4:</span>
<span class="line">Action: search_attractions[上海]</span>
<span class="line">Observation: 外滩、东方明珠、豫园、田子坊</span>
<span class="line"></span>
<span class="line">现在开始你的推理和行动:</span>
<span class="line"></span>
<span class="line">### 北京-上海旅行建议</span>
<span class="line"></span>
<span class="line">根据当前天气和景点信息，为您规划了一个7天的旅行计划：</span>
<span class="line"></span>
<span class="line">#### 📅 行程安排</span>
<span class="line"></span>
<span class="line">**Day 1-4：北京**</span>
<span class="line">- **天气**：晴，15-28°C（适宜出行，建议带薄外套）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 故宫（历史文化）</span>
<span class="line">  - 天安门广场（地标）</span>
<span class="line">  - 长城（一日游，建议选八达岭）</span>
<span class="line">  - 颐和园（皇家园林）</span>
<span class="line">  - 天坛（祈福圣地）</span>
<span class="line"></span>
<span class="line">**Day 5-7：上海**</span>
<span class="line">- **天气**：多云，20-26°C（舒适，偶有阴天）</span>
<span class="line">- **推荐景点**：</span>
<span class="line">  - 外滩（夜景必看）</span>
<span class="line">  - 东方明珠（登高观景）</span>
<span class="line">  - 豫园（江南古典园林）</span>
<span class="line">  - 田子坊（文艺小巷，适合闲逛）</span>
<span class="line"></span>
<span class="line">#### 💡 小贴士</span>
<span class="line">- 北京景点分散，建议包车或地铁+打车结合</span>
<span class="line">- 长城建议早出发，避开人流</span>
<span class="line">- 上海外滩晚上灯光更美</span>
<span class="line">- 两地温差不大，夏装+一件薄外套即可</span>
<span class="line"></span>
<span class="line">祝您旅途愉快！</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5)])])}const o=s(t,[["render",l]]),r=JSON.parse('{"path":"/notes/obsidian/AI/Agent/%E7%BB%8F%E5%85%B8%E8%8C%83%E5%BC%8F/React.html","title":"React","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/AI/Agent/经典范式/React.md"}');export{o as comp,r as data};
