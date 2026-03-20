import{_ as n,c as a,o as p,ae as e}from"./chunks/framework.B7Y1jjX-.js";const L=JSON.parse('{"title":"第二章 线性表","description":"","frontmatter":{},"headers":[],"relativePath":"generated-notes/学习/408/数据结构/第二章 线性表.md","filePath":"generated-notes/学习/408/数据结构/第二章 线性表.md"}'),t={name:"generated-notes/学习/408/数据结构/第二章 线性表.md"};function l(i,s,c,o,r,d){return p(),a("div",null,[...s[0]||(s[0]=[e(`<h1 id="第二章-线性表" tabindex="-1">第二章 线性表 <a class="header-anchor" href="#第二章-线性表" aria-label="Permalink to &quot;第二章 线性表&quot;">​</a></h1><h3 id="线性表" tabindex="-1">线性表 <a class="header-anchor" href="#线性表" aria-label="Permalink to &quot;线性表&quot;">​</a></h3><p><strong>定义</strong>：大于等于零个具有相同数据类型的数据元素的有限序列，表示为L=（a1，a2，a3...an），数据元素的个数n为零的时候表示空表，a1表示表头元素，除其外的其他元素有且仅有一个（直接）前驱，an表示最后一个元素，除其外的其他元素有且仅有一个（直接）后继。线性表是一种逻辑结构，顺序表和链表是其物理实现（物理结构），数据元素的位序从“1”开始</p><ul><li><strong>特点</strong>： <ul><li>表中的元素个数有限</li><li>元素间具有逻辑上的顺序性</li><li>元素都是数据元素</li><li>表中的数据元素的类型都相同，占据相同的空间大小</li></ul></li><li><strong>分类</strong>： <ul><li>顺序存储：顺序表</li><li>链式存储： <ul><li>单链表</li><li>双链表</li><li>循环链表： <ul><li>循环单链表</li><li>循环双链表</li></ul></li><li>静态链表</li></ul></li></ul></li></ul><hr><h3 id="线性表基本操作" tabindex="-1">线性表基本操作 <a class="header-anchor" href="#线性表基本操作" aria-label="Permalink to &quot;线性表基本操作&quot;">​</a></h3><p><strong>定义</strong>：一个数据结构的基本操作是其最基本最核心的操作，其他的操作可以由其的组合构建，常见的基本操作包括创建、销毁、增删改查</p><ul><li><strong>分类</strong>： <ul><li>初始化：InitList(&amp;L)使用引用类型将数据返回</li><li>删除：DestroyList(&amp;L)</li><li>插入元素：ListInsert(&amp;L,i,e)</li><li>删除元素：ListDelete(&amp;L,i,&amp;e)返回被删除的数据</li><li>求表长：Length(L)</li><li>判空：Empty(L)</li></ul></li></ul><hr><h3 id="顺序表" tabindex="-1">顺序表 <a class="header-anchor" href="#顺序表" aria-label="Permalink to &quot;顺序表&quot;">​</a></h3><p><strong>定义</strong>：线性表的顺序存储，将逻辑上连续的存储单元在物理上也连续的存储，由于数据元素的大小相同能够实现随机存储，在高级语言中常采用数组来表述顺序表。线性表中的数据从“1”开始编号，数组从“0”开始。</p><ul><li><strong>分配</strong>： <ul><li><strong>静态分配</strong>：数组的大小空间固定，如果空间满，加入数据会存在数据溢出，导致程序崩溃</li><li><strong>动态分配</strong>：一旦数据的空间占满，就会动态的分配新的空间。重新开辟的空间将旧的空间的数据复制过来，使用free()来释放空间。其本质还是顺序存储，不是链式，只是动态的分配空间的大小</li></ul></li></ul><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>//静态分配</span></span>
<span class="line"><span>#define MaxSize 50</span><span> //使用宏定义最大值</span></span>
<span class="line"><span>typedef struct{</span></span>
<span class="line"><span>	ElemType data[MaxSize]; //假定数据元素的类型为ElemType，最好设置默认值防止内存脏数据</span></span>
<span class="line"><span>	int Length; //初识值为0</span></span>
<span class="line"><span>}SqList;</span></span>
<span class="line"><span>//动态分配</span></span>
<span class="line"><span>#define InitSize 100</span><span> //初始化时的大小</span></span>
<span class="line"><span>typedef struct{</span></span>
<span class="line"><span>	ElemType *data; </span></span>
<span class="line"><span>	int Length,MaxSize; //最大值和当前的值</span></span>
<span class="line"><span>}SeqList;</span></span>
<span class="line"><span>L.data=(ElemType*)malloc(sizeof(ElemType)*InitSize) //旧的</span></span>
<span class="line"><span>L.data=(ElemType*)malloc(sizeof(ElemType)*(InitSize+扩展数)) //新的空间</span></span></code></pre></div><hr><h3 id="顺序表基本操作" tabindex="-1">顺序表基本操作 <a class="header-anchor" href="#顺序表基本操作" aria-label="Permalink to &quot;顺序表基本操作&quot;">​</a></h3><p><strong>插入操作</strong>：首先进行健壮性判断，通过后将要插入的位置后的元素依次后移一位</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool ListInsert(SqList &amp;L,int i,ElemType e){</span></span>
<span class="line"><span>	if(i&amp;lt;1||i&amp;gt;L.length+1) //判断i的范围是否有效</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	if(L.Length&amp;gt;=MaxSize) //判断是否有空间</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	for(int j=L.length;j&amp;gt;=i;j--)</span></span>
<span class="line"><span>		L.data[j]=L.data[j-1]; //从后向前移动数据</span></span>
<span class="line"><span>	L.data[i-1]=e;</span></span>
<span class="line"><span>	L.length++; //表长加1</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}//平均的时间复杂度为O(n)</span></span></code></pre></div><p><strong>删除操作</strong>：使用&amp;e将删除的数值返回。顺序表的插入和删除操作的时间主要浪费在数据的移动上</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool ListDelet(SqList &amp;L,int i,ElemType &amp;e){</span></span>
<span class="line"><span>	if(i&amp;lt;1||i&amp;gt;L.length+1) //判断i的范围是否有效</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	e=L.data[i-1]; //数组下标从零开始</span></span>
<span class="line"><span>	for(int j=i;j&amp;lt;Length;j++)</span></span>
<span class="line"><span>		L.data[j-1]=L.data[j]; //从前向后移动数据</span></span>
<span class="line"><span>	L.data[i-1]=e;</span></span>
<span class="line"><span>	L.length--; //表长减1</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}//平均的时间复杂度为O(n)</span></span></code></pre></div><p><strong>按值查找</strong>：寻找L中的第一个与e相等的元素，并返回其位序</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int LocateElem(SqList L,ElemType e){</span></span>
<span class="line"><span>	for(int i=0;i&amp;lt;Length;i++){</span></span>
<span class="line"><span>		if(L.data[i]==e){</span></span>
<span class="line"><span>			return i+1; //是位序，并不是数组下标</span></span>
<span class="line"><span>		}</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return 0; //返回0表示失败</span></span>
<span class="line"><span>}//平均的时间复杂度为O(n)</span></span></code></pre></div><hr><h3 id="单链表" tabindex="-1">单链表 <a class="header-anchor" href="#单链表" aria-label="Permalink to &quot;单链表&quot;">​</a></h3><p><strong>定义</strong>：线性表的链式存储，每个节点除了数据还有指向下一个节点的指针，每个节点只有一个指针，故称单链表</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct LNode{</span></span>
<span class="line"><span>	ElemType data;</span></span>
<span class="line"><span>	struct LNode *next;</span></span>
<span class="line"><span>}LNode,*LinkList;</span></span>
<span class="line"><span>//LNode为struct LNode的别名，LinkList是一个指向LNode节点的指针，代表了一个链表</span></span></code></pre></div><p>使用单链表能够解决需要连续内存空间的缺点，但是其中的指针会浪费空间，不能够实现随机存取，只能进行顺序存取，查找某个结点时必须从头查询。通常会使用头指针来表示一个链表，头指针为NULL时为空链表，通常在第一个节点前附加头结点位序为0，用于统一化操作并且无论表是否是空表，头指针都是非空的。头指针始终指向最前面的结点，由malloc()申请的空间必由free()释放，而顺序表的释放由系统自动完成</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool InitList(LinkList &amp;L){</span></span>
<span class="line"><span>	L=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	if(L==NULL) //如果L申请失败</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	L-&amp;gt;next=NULL; //表示空链表</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h3 id="单链表基本操作" tabindex="-1">单链表基本操作 <a class="header-anchor" href="#单链表基本操作" aria-label="Permalink to &quot;单链表基本操作&quot;">​</a></h3><p><strong>尾插法建表</strong>：正向建立单链表</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LinkList List_TailInsert(LinkList &amp;L){</span></span>
<span class="line"><span>	int x;</span></span>
<span class="line"><span>	L=(LinkList)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	LNode *s,*r=L;</span></span>
<span class="line"><span>	scanf(&#39;%d&#39;,&amp;x);</span></span>
<span class="line"><span>	while(x!=9999){</span></span>
<span class="line"><span>		s=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>		s-&amp;gt;data=x;</span></span>
<span class="line"><span>		r-&amp;gt;next=s;</span></span>
<span class="line"><span>		r=s;</span></span>
<span class="line"><span>		scanf(&#39;%d&#39;,&amp;x);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	r-&amp;gt;next=NULL;</span></span>
<span class="line"><span>	return L;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>头插法建表</strong>：反向建立</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LinkList List_TailInsert(LinkList &amp;L){</span></span>
<span class="line"><span>	int x;</span></span>
<span class="line"><span>	L=(LinkList)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	LNode *s;</span></span>
<span class="line"><span>	L-&amp;gt;next=NULL;</span></span>
<span class="line"><span>	scanf(&#39;%d&#39;,&amp;x);</span></span>
<span class="line"><span>	while(x!=9999){</span></span>
<span class="line"><span>		s=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>		s-&amp;gt;data=x;</span></span>
<span class="line"><span>		s-&amp;gt;next=r-&amp;gt;next;</span></span>
<span class="line"><span>		L-&amp;gt;next=s;</span></span>
<span class="line"><span>		scanf(&#39;%d&#39;,&amp;x);</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return L;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>按序号查找</strong>：寻找i号结点，并返回节点指针</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LNode *GetElem(LinkList L,int i){</span></span>
<span class="line"><span>	if(i&amp;lt;0) //如果为头结点返回NULL</span></span>
<span class="line"><span>		return NULL;</span></span>
<span class="line"><span>	int j=0;</span></span>
<span class="line"><span>	LNode *p=L</span></span>
<span class="line"><span>	while(p!=NULL&amp;&amp;j&amp;lt;i){</span></span>
<span class="line"><span>		p=p-&amp;gt;next;</span></span>
<span class="line"><span>		j++;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return p;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>按值查找</strong>：寻找第一个e值结点，并返回节点指针</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>LNode *LocateElem(LinkList L,ElemType e){</span></span>
<span class="line"><span>	LNode *p=L-&amp;gt;next;</span></span>
<span class="line"><span>	while(p!=NULL&amp;&amp;p-&amp;gt;data!=e){</span></span>
<span class="line"><span>		p=p-&amp;gt;next;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return p;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>插入结点</strong>：将结点插入i号位置</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool ListInsert(LinkList &amp;L,int i,ElemType e){</span></span>
<span class="line"><span>	if(i&amp;lt;1)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *p=L; //使用p指针来指向目标位置i前的结点</span></span>
<span class="line"><span>	int j=0;</span></span>
<span class="line"><span>	while(p!=NULL&amp;&amp;j&amp;lt;i-1){ //找到i前的位置，也可以使用GetElem()</span></span>
<span class="line"><span>		p=p-&amp;gt;next;</span></span>
<span class="line"><span>		j++;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	if(p==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *s=(LNode*)malloc(sizeof(LNode)); //使用s来指向要插入的结点</span></span>
<span class="line"><span>	s-&amp;gt;data=e;</span></span>
<span class="line"><span>	s-&amp;gt;next=p-&amp;gt;next; //必须先执行</span></span>
<span class="line"><span>	p-&amp;gt;next=s; //必须后执行</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>结点前插</strong>：在某个结点的前面插入</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool InsertPriorNode(LNode *p,ElemType e){</span></span>
<span class="line"><span>	if(p==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *s=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	if(s==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	s-&amp;gt;next=p-&amp;gt;next; //在p的后面插入s</span></span>
<span class="line"><span>	p-&amp;gt;next=s;</span></span>
<span class="line"><span>	s-&amp;gt;data=p-&amp;gt;data; //再将p和s的值交换，通过这种方法避免了访问p的前驱结点</span></span>
<span class="line"><span>	p-&amp;gt;data=e;</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>结点后插</strong>：在某个结点的后面插入</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool InsertPriorNode(LNode *p,ElemType e){</span></span>
<span class="line"><span>	if(p==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *s=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	if(s==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	s-&amp;gt;data=e;</span></span>
<span class="line"><span>	s-&amp;gt;next=p-&amp;gt;next;</span></span>
<span class="line"><span>	p-&amp;gt;next=s;</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>删除结点</strong>：将i号结点删除</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool ListInsert(LinkList &amp;L,int i,ElemType e){ //使用头指针</span></span>
<span class="line"><span>	if(i&amp;lt;1)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *p=L; //使用p指针来指向目标位置i前的结点</span></span>
<span class="line"><span>	int j=0;</span></span>
<span class="line"><span>	while(p!=NULL&amp;&amp;j&amp;lt;i-1){ //找到i前的位置，也可以使用GetElem()</span></span>
<span class="line"><span>		p=p-&amp;gt;next;</span></span>
<span class="line"><span>		j++;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	if(p==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *q=p-&amp;gt;next;</span></span>
<span class="line"><span>	e=q-&amp;gt;data;</span></span>
<span class="line"><span>	p-&amp;gt;next=q-&amp;gt;next;</span></span>
<span class="line"><span>	free(q);</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}//O(n)</span></span>
<span class="line"><span>//将指定指针指向的结点删除</span></span>
<span class="line"><span>bool InsertPriorNode(LNode *p,ElemType &amp;e){</span></span>
<span class="line"><span>	if(p==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	LNode *q=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	if(q==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	e=p-&amp;gt;data;</span></span>
<span class="line"><span>	q=p-&amp;gt;next;</span></span>
<span class="line"><span>	p-&amp;gt;data=q-&amp;gt;next-&amp;gt;data;</span></span>
<span class="line"><span>	p-&amp;gt;nest=q-&amp;gt;next;</span></span>
<span class="line"><span>	free(q);</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><p><strong>求表长</strong>：求表的长度（不包括头结点）</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>int Length(LinkList L){</span></span>
<span class="line"><span>	int len=0;</span></span>
<span class="line"><span>	LNode *p=L</span></span>
<span class="line"><span>	while(p-&amp;gt;next!=NULL){</span></span>
<span class="line"><span>		p=p-&amp;gt;next;</span></span>
<span class="line"><span>		len++;</span></span>
<span class="line"><span>	}</span></span>
<span class="line"><span>	return len;</span></span>
<span class="line"><span>}//O(n)</span></span></code></pre></div><hr><h3 id="双链表" tabindex="-1">双链表 <a class="header-anchor" href="#双链表" aria-label="Permalink to &quot;双链表&quot;">​</a></h3><p><strong>定义</strong>：由于单链表只有指向后继结点的指针只能实现单方向的访问，双链表额外添加指向前驱结点的指针</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>typedef struct DNode{</span></span>
<span class="line"><span>	ElemType data;</span></span>
<span class="line"><span>	struct LNode *next,*prior;</span></span>
<span class="line"><span>}DNode,*DLinkList;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>bool InitDLinkList(DLinkList &amp;L){</span></span>
<span class="line"><span>	L=(DNode*)malloc(sizeof(DNode));</span></span>
<span class="line"><span>	if(L==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	L-&amp;gt;prior=NULL;</span></span>
<span class="line"><span>	L-&amp;gt;next=NULL;</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h3 id="双链表基本操作" tabindex="-1">双链表基本操作 <a class="header-anchor" href="#双链表基本操作" aria-label="Permalink to &quot;双链表基本操作&quot;">​</a></h3><p><strong>插入操作</strong>：在p所指结点后插入s所指结点</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool InsertNextDNode(DNode *p,DNode *s){</span></span>
<span class="line"><span>	if(p==NULL||s==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	s-&amp;gt;next=p-&amp;gt;next; //代码的顺序不是唯一的，但是推荐这样写</span></span>
<span class="line"><span>	if(p-&amp;gt;next!=NULL)</span></span>
<span class="line"><span>		p-&amp;gt;next-&amp;gt;prior=s;</span></span>
<span class="line"><span>	s-&amp;gt;prior=p;</span></span>
<span class="line"><span>	p-&amp;gt;next=s;</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><p><strong>删除操作</strong>：删除p所指的结点的后继结点</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool DeleteNextDNode(DNode *p){</span></span>
<span class="line"><span>	if(p==NULL||s==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	DNode *q=p-&amp;gt;next;</span></span>
<span class="line"><span>	if(q==NULL)</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	p-&amp;gt;next=q-&amp;gt;next;</span></span>
<span class="line"><span>	q-&amp;gt;next-&amp;gt;prior=p;</span></span>
<span class="line"><span>	free(q);</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h3 id="循环单链表" tabindex="-1">循环单链表 <a class="header-anchor" href="#循环单链表" aria-label="Permalink to &quot;循环单链表&quot;">​</a></h3><p><strong>定义</strong>：在单链表的基础上将最后一个结点的next由NULL改为了头结点，也可以专门设置一个r专门指向尾结点。当L-&gt;next=L时循环单链表为空</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>bool InitList(LinkList &amp;L){</span></span>
<span class="line"><span>	L=(LNode*)malloc(sizeof(LNode));</span></span>
<span class="line"><span>	if(L==NULL) //如果L申请失败</span></span>
<span class="line"><span>		return false;</span></span>
<span class="line"><span>	L-&amp;gt;next=L; //头结点指向头结点</span></span>
<span class="line"><span>	return ture;</span></span>
<span class="line"><span>}</span></span></code></pre></div><hr><h3 id="循环双链表" tabindex="-1">循环双链表 <a class="header-anchor" href="#循环双链表" aria-label="Permalink to &quot;循环双链表&quot;">​</a></h3><p><strong>定义</strong>：头结点的prior指针还要指向尾节点，p-&gt;next为L时循环双链表为空，此时头结点的next和prior都指向L</p><hr><h3 id="静态链表" tabindex="-1">静态链表 <a class="header-anchor" href="#静态链表" aria-label="Permalink to &quot;静态链表&quot;">​</a></h3><p><strong>定义</strong>：使用数组来描述链式存储的结构，具有data和next域，但是next中存的是结点在数组中的下标，静态链表也是事先分配一段连续的空间，尾节点的next为-1，空结点的next为-2。</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>#define MaxSize 50</span></span>
<span class="line"><span>typedef struct{</span></span>
<span class="line"><span>	ElemType data;</span></span>
<span class="line"><span>	int next;</span></span>
<span class="line"><span>}SLinkList[MaxSize];//这里SLinkList表示一个最大长度为MaxSize的数组，而不是一个节点</span></span></code></pre></div>`,68)])])}const h=n(t,[["render",l]]);export{L as __pageData,h as default};
