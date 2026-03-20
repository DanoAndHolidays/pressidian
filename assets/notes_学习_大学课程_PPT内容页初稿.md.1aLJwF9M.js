import{_ as a,c as n,o as i,ae as l}from"./chunks/framework.B7Y1jjX-.js";const k=JSON.parse('{"title":"","description":"","frontmatter":{},"headers":[],"relativePath":"notes/学习/大学课程/PPT内容页初稿.md","filePath":"notes/学习/大学课程/PPT内容页初稿.md"}'),p={name:"notes/学习/大学课程/PPT内容页初稿.md"};function t(e,s,h,o,r,c){return i(),n("div",null,[...s[0]||(s[0]=[l(`<h2 id="📄-ppt内容页初稿" tabindex="-1">📄 PPT内容页初稿 <a class="header-anchor" href="#📄-ppt内容页初稿" aria-label="Permalink to &quot;📄 PPT内容页初稿&quot;">​</a></h2><hr><h3 id="第1页-封面页" tabindex="-1">第1页：封面页 <a class="header-anchor" href="#第1页-封面页" aria-label="Permalink to &quot;第1页：封面页&quot;">​</a></h3><p><strong>标题</strong>：基于标签的推荐系统算法对比实验<br><strong>副标题</strong>：张量分解 vs LDA vs 图推荐算法<br><strong>信息</strong>：</p><ul><li>汇报人：XXX</li><li>日期：XXXX年XX月</li><li>项目基于MovieLens数据集</li></ul><hr><h3 id="第2页-项目背景与目标" tabindex="-1">第2页：项目背景与目标 <a class="header-anchor" href="#第2页-项目背景与目标" aria-label="Permalink to &quot;第2页：项目背景与目标&quot;">​</a></h3><p><strong>研究背景</strong>：</p><ul><li>标签在推荐系统中具有重要价值：增强可解释性、提供语义信息、缓解冷启动</li><li>不同算法在标签推荐任务中表现各异，需要系统对比</li></ul><p><strong>研究目标</strong>：</p><ol><li>对比三类标签推荐算法的效果与效率</li><li>探索交互建模与语义建模的优劣</li><li>为实际应用提供算法选型依据</li></ol><p><strong>对比算法</strong>：</p><ul><li>结构化交互建模：CP分解、Tucker分解、稀疏CP</li><li>语义主题建模：LDA主题模型</li><li>关系图建模：基于图的推荐算法</li></ul><hr><h3 id="第3页-数据预处理流程" tabindex="-1">第3页：数据预处理流程 <a class="header-anchor" href="#第3页-数据预处理流程" aria-label="Permalink to &quot;第3页：数据预处理流程&quot;">​</a></h3><p><strong>数据源</strong>：MovieLens数据集（tags.csv, ratings.csv, movies.csv）</p><p><strong>标签清洗流程</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>原始标签 → 小写转换 → 去除特殊字符 → 长度过滤 → 无效标签剔除</span></span></code></pre></div><p><strong>关键处理策略</strong>：</p><ul><li>频次过滤：min_frequency = 3</li><li>用户覆盖：min_users = 2</li><li>标签规模：max_tags = 1000</li></ul><p><strong>数据结构构建</strong>：</p><ul><li>张量：用户×电影×标签（1123×2015×847）</li><li>图结构：11838个节点，89396条边</li></ul><hr><h3 id="第4页-张量分解算法" tabindex="-1">第4页：张量分解算法 <a class="header-anchor" href="#第4页-张量分解算法" aria-label="Permalink to &quot;第4页：张量分解算法&quot;">​</a></h3><p><strong>CP分解</strong>：</p><ul><li>核心思想：三维张量的低秩近似</li><li>公式：$X \\approx \\sum_{r=1}^R u_r \\otimes v_r \\otimes t_r$</li><li>优势：参数少、训练快、解释性好</li></ul><p><strong>Tucker分解</strong>：</p><ul><li>核心思想：核心张量+因子矩阵的多线性变换</li><li>公式：$X \\approx G \\times_1 U \\times_2 V \\times_3 T$</li><li>优势：表达力强、对噪声鲁棒</li></ul><p><strong>稀疏CP（ALS）</strong>：</p><ul><li>适用场景：大规模稀疏数据</li><li>优化目标：带正则化的平方损失</li><li>更新策略：交替最小二乘法</li></ul><hr><h3 id="第5页-lda主题模型" tabindex="-1">第5页：LDA主题模型 <a class="header-anchor" href="#第5页-lda主题模型" aria-label="Permalink to &quot;第5页：LDA主题模型&quot;">​</a></h3><p><strong>建模思想</strong>：</p><ul><li>标签 → &quot;词&quot;</li><li>用户/电影 → &quot;文档&quot;</li><li>学习文档-主题分布θ和主题-词分布φ</li></ul><p><strong>训练流程</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>文档构建 → 词频统计 → LDA训练 → 主题解释</span></span></code></pre></div><p><strong>推荐机制</strong>：</p><ul><li>用户主题分布θ_u + 电影主题分布θ_i → 融合θ_ui</li><li>标签打分：p(tag) = θ_ui · φ</li><li>按概率排序生成Top-K推荐</li></ul><p><strong>优势特点</strong>：</p><ul><li>语义可解释性强</li><li>冷启动友好</li><li>主题词可视化</li></ul><hr><h3 id="第6页-图推荐算法" tabindex="-1">第6页：图推荐算法 <a class="header-anchor" href="#第6页-图推荐算法" aria-label="Permalink to &quot;第6页：图推荐算法&quot;">​</a></h3><p><strong>图结构构建</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>节点类型：</span></span>
<span class="line"><span>- 用户：609个</span></span>
<span class="line"><span>- 电影：9742个  </span></span>
<span class="line"><span>- 标签：1487个</span></span>
<span class="line"><span></span></span>
<span class="line"><span>边类型：</span></span>
<span class="line"><span>- 用户-电影（评分关系）</span></span>
<span class="line"><span>- 用户-标签（偏好关系）</span></span>
<span class="line"><span>- 电影-标签（关联关系）</span></span></code></pre></div><p><strong>推荐策略</strong>：</p><ol><li>基于标签传播：用户偏好标签 → 关联电影</li><li>基于用户相似性：共同行为 → 相似用户喜好</li><li>分数融合：加权合并两类推荐</li></ol><p><strong>评估维度</strong>：</p><ul><li>新颖性：0.04</li><li>标签相关性：0.535</li><li>覆盖率：1.0</li></ul><hr><h3 id="第7页-实验设计" tabindex="-1">第7页：实验设计 <a class="header-anchor" href="#第7页-实验设计" aria-label="Permalink to &quot;第7页：实验设计&quot;">​</a></h3><p><strong>数据划分策略</strong>：</p><ul><li>随机划分：80%训练，20%测试</li><li>时间划分：按时间戳分割，更贴近实际场景</li></ul><p><strong>评估指标</strong>：</p><ul><li>精度指标：Precision@K, Recall@K, F1@K (K=5,10,20)</li><li>效率指标：训练时间（秒）</li><li>质量指标：新颖性、标签相关性、覆盖率</li></ul><p><strong>超参数设置</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>张量分解：R=30, λ=0.01, max_iter=200</span></span>
<span class="line"><span>LDA：K=50, max_iter=100</span></span>
<span class="line"><span>图算法：α=0.6, β=0.4</span></span></code></pre></div><hr><h3 id="第8页-精度对比结果" tabindex="-1">第8页：精度对比结果 <a class="header-anchor" href="#第8页-精度对比结果" aria-label="Permalink to &quot;第8页：精度对比结果&quot;">​</a></h3><p><strong>Precision@K趋势</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>K=5:  CP(0.225) &gt; Tucker(0.205) &gt; LDA(0.081)</span></span>
<span class="line"><span>K=10: CP(0.445) &gt; Tucker(0.315) &gt; LDA(0.102)  </span></span>
<span class="line"><span>K=20: CP(0.735) &gt; Tucker(0.491) &gt; LDA(0.161)</span></span></code></pre></div><p><strong>关键发现</strong>：</p><ul><li>CP分解在各项精度指标上表现最优</li><li>LDA在K较小时精度较低，但随着K增大改善明显</li><li>Tucker分解表达力强但需要更多训练时间</li></ul><p><strong>可视化建议</strong>：折线图展示三种算法随K变化的精度趋势</p><hr><h3 id="第9页-训练效率对比" tabindex="-1">第9页：训练效率对比 <a class="header-anchor" href="#第9页-训练效率对比" aria-label="Permalink to &quot;第9页：训练效率对比&quot;">​</a></h3><p><strong>训练时间对比</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>CP分解：18秒</span></span>
<span class="line"><span>Tucker分解：100秒  </span></span>
<span class="line"><span>LDA：3.75秒</span></span>
<span class="line"><span>图算法：45秒</span></span></code></pre></div><p><strong>效率-精度权衡</strong>：</p><ul><li>LDA训练最快，适合快速原型开发</li><li>CP分解在精度和效率间取得良好平衡</li><li>Tucker分解精度高但训练成本最大</li></ul><p><strong>工程建议</strong>：</p><ul><li>小规模数据：优先CP分解</li><li>快速迭代：选择LDA</li><li>精度优先：考虑Tucker分解</li></ul><hr><h3 id="第10页-可解释性分析" tabindex="-1">第10页：可解释性分析 <a class="header-anchor" href="#第10页-可解释性分析" aria-label="Permalink to &quot;第10页：可解释性分析&quot;">​</a></h3><p><strong>LDA主题示例</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>主题1：科幻、未来、太空、外星人</span></span>
<span class="line"><span>主题2：浪漫、爱情、温馨、感人  </span></span>
<span class="line"><span>主题3：悬疑、惊悚、恐怖、紧张</span></span></code></pre></div><p><strong>图结构分析</strong>：</p><ul><li>中心节点：热门电影和常用标签</li><li>社区发现：相似兴趣用户群体</li><li>路径分析：用户→标签→电影的推荐路径</li></ul><p><strong>张量因子解释</strong>：</p><ul><li>每个因子维度对应一种潜在语义</li><li>用户/电影在因子空间的位置反映偏好特征</li></ul><hr><h3 id="第11页-推荐质量分析" tabindex="-1">第11页：推荐质量分析 <a class="header-anchor" href="#第11页-推荐质量分析" aria-label="Permalink to &quot;第11页：推荐质量分析&quot;">​</a></h3><p>==这里将展示结果的两张图放上== <strong>新颖性 vs 相关性</strong>：</p><ul><li>LDA：相关性中等，新颖性较高</li><li>图算法：相关性最高，新颖性中等</li><li>张量分解：相关性高，新颖性相对较低</li></ul><p><strong>覆盖率表现</strong>：</p><ul><li>图算法：覆盖率1.0，能够覆盖所有测试用户</li><li>LDA：覆盖率0.87，存在部分冷启动用户无法覆盖</li><li>张量分解：覆盖率0.92，表现均衡</li></ul><p><strong>类型分布</strong>：</p><ul><li>各算法推荐电影类型分布基本符合用户历史兴趣</li><li>图算法在类型多样性上略胜一筹</li></ul><hr><h3 id="第12页-总结与建议" tabindex="-1">第12页：总结与建议 <a class="header-anchor" href="#第12页-总结与建议" aria-label="Permalink to &quot;第12页：总结与建议&quot;">​</a></h3><p><strong>算法优劣总结</strong>：</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>张量分解：</span></span>
<span class="line"><span>- 优点：精度高、交互建模强</span></span>
<span class="line"><span>- 缺点：训练成本高、可解释性中等</span></span>
<span class="line"><span></span></span>
<span class="line"><span>LDA：</span></span>
<span class="line"><span>- 优点：训练快、可解释性强、冷启动友好  </span></span>
<span class="line"><span>- 缺点：精度相对较低、依赖主题数设定</span></span>
<span class="line"><span></span></span>
<span class="line"><span>图算法：</span></span>
<span class="line"><span>- 优点：关系丰富、覆盖率广</span></span>
<span class="line"><span>- 缺点：可解释性中等、参数调优复杂</span></span></code></pre></div><p><strong>适用场景建议</strong>：</p><ul><li>数据密集、精度优先：张量分解</li><li>语义驱动、快速迭代：LDA</li><li>关系复杂、多样性强：图算法</li></ul><p><strong>未来工作</strong>：</p><ul><li>多算法融合：LDA主题作为图节点特征</li><li>时序动态建模：考虑用户兴趣演化</li><li>跨域推荐：标签知识的迁移学习</li></ul><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">usecaseDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actor 客户</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actor 邮购公司职员</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actor 供应商</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    actor 运输公司</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    boundary 订单处理软件</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;订单处理总流程&quot; as UC1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;客户订单管理&quot; as UC2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;采购与库存管理&quot; as UC3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;配送管理&quot; as UC4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;财务账单管理&quot; as UC5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;提交订单&quot; as UC2_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;退货申请&quot; as UC2_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;查询订单状态&quot; as UC2_3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;维护个人订单&quot; as UC2_4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;修改订单信息&quot; as UC2_5 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;取消订单&quot; as UC2_6 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;处理客户订单&quot; as UC3_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;管理产品目录&quot; as UC3_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;采购产品&quot; as UC3_3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;查询库存&quot; as UC3_4 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;触发补货&quot; as UC3_5 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;安排配送&quot; as UC4_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;选择运输公司&quot; as UC4_2 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;跟踪物流&quot; as UC4_3 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;生成账单&quot; as UC5_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;处理付款&quot; as UC5_2 &lt;&lt;include&gt;&gt;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    usecase &quot;处理退货账单&quot; as UC5_3 &lt;&lt;extend&gt;&gt;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &#39; 参与者与用例的关联</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    客户 -- UC2_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    客户 -- UC2_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    客户 -- UC2_3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    客户 -- UC2_4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC2_4 -- UC2_5</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC2_4 -- UC2_6</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    邮购公司职员 -- UC3_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    邮购公司职员 -- UC3_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    邮购公司职员 -- UC3_3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC3_3 -- UC3_4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC3_3 -- UC3_5</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    邮购公司职员 -- UC4_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC4_1 -- UC4_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC4_1 -- UC4_3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    邮购公司职员 -- UC5_1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC5_1 -- UC5_2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC5_1 -- UC5_3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    &#39; 系统边界内的总流程关联</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC1 -- UC2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC1 -- UC3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC1 -- UC4</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    UC1 -- UC5</span></span></code></pre></div>`,96)])])}const u=a(p,[["render",t]]);export{k as __pageData,u as default};
