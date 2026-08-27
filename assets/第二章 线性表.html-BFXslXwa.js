import{_ as n,c as e,b as a,o as i}from"./app-tSWxoOhA.js";const l={};function t(d,s){return i(),e("div",null,[...s[0]||(s[0]=[a(`<h1 id="第二章-线性表" tabindex="-1"><a class="header-anchor" href="#第二章-线性表"><span>第二章 线性表</span></a></h1><h3 id="线性表" tabindex="-1"><a class="header-anchor" href="#线性表"><span>线性表</span></a></h3><p><strong>定义</strong>：大于等于零个具有相同数据类型的数据元素的有限序列，表示为L=（a1，a2，a3...an），数据元素的个数n为零的时候表示空表，a1表示表头元素，除其外的其他元素有且仅有一个（直接）前驱，an表示最后一个元素，除其外的其他元素有且仅有一个（直接）后继。线性表是一种逻辑结构，顺序表和链表是其物理实现（物理结构），数据元素的位序从“1”开始</p><ul><li><strong>特点</strong>： <ul><li>表中的元素个数有限</li><li>元素间具有逻辑上的顺序性</li><li>元素都是数据元素</li><li>表中的数据元素的类型都相同，占据相同的空间大小</li></ul></li><li><strong>分类</strong>： <ul><li>顺序存储：顺序表</li><li>链式存储： <ul><li>单链表</li><li>双链表</li><li>循环链表： <ul><li>循环单链表</li><li>循环双链表</li></ul></li><li>静态链表</li></ul></li></ul></li></ul><hr><h3 id="线性表基本操作" tabindex="-1"><a class="header-anchor" href="#线性表基本操作"><span>线性表基本操作</span></a></h3><p><strong>定义</strong>：一个数据结构的基本操作是其最基本最核心的操作，其他的操作可以由其的组合构建，常见的基本操作包括创建、销毁、增删改查</p><ul><li><strong>分类</strong>： <ul><li>初始化：InitList(&amp;L)使用引用类型将数据返回</li><li>删除：DestroyList(&amp;L)</li><li>插入元素：ListInsert(&amp;L,i,e)</li><li>删除元素：ListDelete(&amp;L,i,&amp;e)返回被删除的数据</li><li>求表长：Length(L)</li><li>判空：Empty(L)</li></ul></li></ul><hr><h3 id="顺序表" tabindex="-1"><a class="header-anchor" href="#顺序表"><span>顺序表</span></a></h3><p><strong>定义</strong>：线性表的顺序存储，将逻辑上连续的存储单元在物理上也连续的存储，由于数据元素的大小相同能够实现随机存储，在高级语言中常采用数组来表述顺序表。线性表中的数据从“1”开始编号，数组从“0”开始。</p><ul><li><strong>分配</strong>： <ul><li><strong>静态分配</strong>：数组的大小空间固定，如果空间满，加入数据会存在数据溢出，导致程序崩溃</li><li><strong>动态分配</strong>：一旦数据的空间占满，就会动态的分配新的空间。重新开辟的空间将旧的空间的数据复制过来，使用free()来释放空间。其本质还是顺序存储，不是链式，只是动态的分配空间的大小</li></ul></li></ul><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">//静态分配</span>
<span class="line">#define MaxSize 50 //使用宏定义最大值</span>
<span class="line">typedef struct{</span>
<span class="line">	ElemType data[MaxSize]; //假定数据元素的类型为ElemType，最好设置默认值防止内存脏数据</span>
<span class="line">	int Length; //初识值为0</span>
<span class="line">}SqList;</span>
<span class="line">//动态分配</span>
<span class="line">#define InitSize 100 //初始化时的大小</span>
<span class="line">typedef struct{</span>
<span class="line">	ElemType *data; </span>
<span class="line">	int Length,MaxSize; //最大值和当前的值</span>
<span class="line">}SeqList;</span>
<span class="line">L.data=(ElemType*)malloc(sizeof(ElemType)*InitSize) //旧的</span>
<span class="line">L.data=(ElemType*)malloc(sizeof(ElemType)*(InitSize+扩展数)) //新的空间 </span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="顺序表基本操作" tabindex="-1"><a class="header-anchor" href="#顺序表基本操作"><span>顺序表基本操作</span></a></h3><p><strong>插入操作</strong>：首先进行健壮性判断，通过后将要插入的位置后的元素依次后移一位</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool ListInsert(SqList &amp;L,int i,ElemType e){</span>
<span class="line">	if(i&lt;1||i&gt;L.length+1) //判断i的范围是否有效</span>
<span class="line">		return false;</span>
<span class="line">	if(L.Length&gt;=MaxSize) //判断是否有空间</span>
<span class="line">		return false;</span>
<span class="line">	for(int j=L.length;j&gt;=i;j--)</span>
<span class="line">		L.data[j]=L.data[j-1]; //从后向前移动数据</span>
<span class="line">	L.data[i-1]=e;</span>
<span class="line">	L.length++; //表长加1</span>
<span class="line">	return ture;</span>
<span class="line">}//平均的时间复杂度为O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>删除操作</strong>：使用&amp;e将删除的数值返回。顺序表的插入和删除操作的时间主要浪费在数据的移动上</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool ListDelet(SqList &amp;L,int i,ElemType &amp;e){</span>
<span class="line">	if(i&lt;1||i&gt;L.length+1) //判断i的范围是否有效</span>
<span class="line">		return false;</span>
<span class="line">	e=L.data[i-1]; //数组下标从零开始</span>
<span class="line">	for(int j=i;j&lt;Length;j++)</span>
<span class="line">		L.data[j-1]=L.data[j]; //从前向后移动数据</span>
<span class="line">	L.data[i-1]=e;</span>
<span class="line">	L.length--; //表长减1</span>
<span class="line">	return ture;</span>
<span class="line">}//平均的时间复杂度为O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>按值查找</strong>：寻找L中的第一个与e相等的元素，并返回其位序</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">int LocateElem(SqList L,ElemType e){</span>
<span class="line">	for(int i=0;i&lt;Length;i++){</span>
<span class="line">		if(L.data[i]==e){</span>
<span class="line">			return i+1; //是位序，并不是数组下标</span>
<span class="line">		}</span>
<span class="line">	}</span>
<span class="line">	return 0; //返回0表示失败</span>
<span class="line">}//平均的时间复杂度为O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="单链表" tabindex="-1"><a class="header-anchor" href="#单链表"><span>单链表</span></a></h3><p><strong>定义</strong>：线性表的链式存储，每个节点除了数据还有指向下一个节点的指针，每个节点只有一个指针，故称单链表</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">typedef struct LNode{</span>
<span class="line">	ElemType data;</span>
<span class="line">	struct LNode *next;</span>
<span class="line">}LNode,*LinkList;</span>
<span class="line">//LNode为struct LNode的别名，LinkList是一个指向LNode节点的指针，代表了一个链表</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>使用单链表能够解决需要连续内存空间的缺点，但是其中的指针会浪费空间，不能够实现随机存取，只能进行顺序存取，查找某个结点时必须从头查询。通常会使用头指针来表示一个链表，头指针为NULL时为空链表，通常在第一个节点前附加头结点位序为0，用于统一化操作并且无论表是否是空表，头指针都是非空的。头指针始终指向最前面的结点，由malloc()申请的空间必由free()释放，而顺序表的释放由系统自动完成</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool InitList(LinkList &amp;L){</span>
<span class="line">	L=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">	if(L==NULL) //如果L申请失败</span>
<span class="line">		return false;</span>
<span class="line">	L-&gt;next=NULL; //表示空链表</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="单链表基本操作" tabindex="-1"><a class="header-anchor" href="#单链表基本操作"><span>单链表基本操作</span></a></h3><p><strong>尾插法建表</strong>：正向建立单链表</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">LinkList List_TailInsert(LinkList &amp;L){</span>
<span class="line">	int x;</span>
<span class="line">	L=(LinkList)malloc(sizeof(LNode));</span>
<span class="line">	LNode *s,*r=L;</span>
<span class="line">	scanf(&#39;%d&#39;,&amp;x);</span>
<span class="line">	while(x!=9999){</span>
<span class="line">		s=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">		s-&gt;data=x;</span>
<span class="line">		r-&gt;next=s;</span>
<span class="line">		r=s;</span>
<span class="line">		scanf(&#39;%d&#39;,&amp;x);</span>
<span class="line">	}</span>
<span class="line">	r-&gt;next=NULL;</span>
<span class="line">	return L;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>头插法建表</strong>：反向建立</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">LinkList List_TailInsert(LinkList &amp;L){</span>
<span class="line">	int x;</span>
<span class="line">	L=(LinkList)malloc(sizeof(LNode));</span>
<span class="line">	LNode *s;</span>
<span class="line">	L-&gt;next=NULL;</span>
<span class="line">	scanf(&#39;%d&#39;,&amp;x);</span>
<span class="line">	while(x!=9999){</span>
<span class="line">		s=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">		s-&gt;data=x;</span>
<span class="line">		s-&gt;next=r-&gt;next;</span>
<span class="line">		L-&gt;next=s;</span>
<span class="line">		scanf(&#39;%d&#39;,&amp;x);</span>
<span class="line">	}</span>
<span class="line">	return L;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>按序号查找</strong>：寻找i号结点，并返回节点指针</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">LNode *GetElem(LinkList L,int i){</span>
<span class="line">	if(i&lt;0) //如果为头结点返回NULL</span>
<span class="line">		return NULL;</span>
<span class="line">	int j=0;</span>
<span class="line">	LNode *p=L</span>
<span class="line">	while(p!=NULL&amp;&amp;j&lt;i){</span>
<span class="line">		p=p-&gt;next;</span>
<span class="line">		j++;</span>
<span class="line">	}</span>
<span class="line">	return p;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>按值查找</strong>：寻找第一个e值结点，并返回节点指针</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">LNode *LocateElem(LinkList L,ElemType e){</span>
<span class="line">	LNode *p=L-&gt;next;</span>
<span class="line">	while(p!=NULL&amp;&amp;p-&gt;data!=e){</span>
<span class="line">		p=p-&gt;next;</span>
<span class="line">	}</span>
<span class="line">	return p;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>插入结点</strong>：将结点插入i号位置</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool ListInsert(LinkList &amp;L,int i,ElemType e){</span>
<span class="line">	if(i&lt;1)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *p=L; //使用p指针来指向目标位置i前的结点</span>
<span class="line">	int j=0;</span>
<span class="line">	while(p!=NULL&amp;&amp;j&lt;i-1){ //找到i前的位置，也可以使用GetElem()</span>
<span class="line">		p=p-&gt;next;</span>
<span class="line">		j++;</span>
<span class="line">	}</span>
<span class="line">	if(p==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *s=(LNode*)malloc(sizeof(LNode)); //使用s来指向要插入的结点</span>
<span class="line">	s-&gt;data=e;</span>
<span class="line">	s-&gt;next=p-&gt;next; //必须先执行</span>
<span class="line">	p-&gt;next=s; //必须后执行</span>
<span class="line">	return ture;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>结点前插</strong>：在某个结点的前面插入</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool InsertPriorNode(LNode *p,ElemType e){</span>
<span class="line">	if(p==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *s=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">	if(s==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	s-&gt;next=p-&gt;next; //在p的后面插入s</span>
<span class="line">	p-&gt;next=s;</span>
<span class="line">	s-&gt;data=p-&gt;data; //再将p和s的值交换，通过这种方法避免了访问p的前驱结点</span>
<span class="line">	p-&gt;data=e;</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>结点后插</strong>：在某个结点的后面插入</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool InsertPriorNode(LNode *p,ElemType e){</span>
<span class="line">	if(p==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *s=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">	if(s==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	s-&gt;data=e;</span>
<span class="line">	s-&gt;next=p-&gt;next;</span>
<span class="line">	p-&gt;next=s;</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>删除结点</strong>：将i号结点删除</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool ListInsert(LinkList &amp;L,int i,ElemType e){ //使用头指针</span>
<span class="line">	if(i&lt;1)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *p=L; //使用p指针来指向目标位置i前的结点</span>
<span class="line">	int j=0;</span>
<span class="line">	while(p!=NULL&amp;&amp;j&lt;i-1){ //找到i前的位置，也可以使用GetElem()</span>
<span class="line">		p=p-&gt;next;</span>
<span class="line">		j++;</span>
<span class="line">	}</span>
<span class="line">	if(p==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *q=p-&gt;next;</span>
<span class="line">	e=q-&gt;data;</span>
<span class="line">	p-&gt;next=q-&gt;next;</span>
<span class="line">	free(q);</span>
<span class="line">	return ture;</span>
<span class="line">}//O(n)</span>
<span class="line">//将指定指针指向的结点删除</span>
<span class="line">bool InsertPriorNode(LNode *p,ElemType &amp;e){</span>
<span class="line">	if(p==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	LNode *q=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">	if(q==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	e=p-&gt;data;</span>
<span class="line">	q=p-&gt;next;</span>
<span class="line">	p-&gt;data=q-&gt;next-&gt;data;</span>
<span class="line">	p-&gt;nest=q-&gt;next;</span>
<span class="line">	free(q);</span>
<span class="line">	return ture;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>求表长</strong>：求表的长度（不包括头结点）</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">int Length(LinkList L){</span>
<span class="line">	int len=0;</span>
<span class="line">	LNode *p=L</span>
<span class="line">	while(p-&gt;next!=NULL){</span>
<span class="line">		p=p-&gt;next;</span>
<span class="line">		len++;</span>
<span class="line">	}</span>
<span class="line">	return len;</span>
<span class="line">}//O(n)</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="双链表" tabindex="-1"><a class="header-anchor" href="#双链表"><span>双链表</span></a></h3><p><strong>定义</strong>：由于单链表只有指向后继结点的指针只能实现单方向的访问，双链表额外添加指向前驱结点的指针</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">typedef struct DNode{</span>
<span class="line">	ElemType data;</span>
<span class="line">	struct LNode *next,*prior;</span>
<span class="line">}DNode,*DLinkList;</span>
<span class="line"></span>
<span class="line">bool InitDLinkList(DLinkList &amp;L){</span>
<span class="line">	L=(DNode*)malloc(sizeof(DNode));</span>
<span class="line">	if(L==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	L-&gt;prior=NULL;</span>
<span class="line">	L-&gt;next=NULL;</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="双链表基本操作" tabindex="-1"><a class="header-anchor" href="#双链表基本操作"><span>双链表基本操作</span></a></h3><p><strong>插入操作</strong>：在p所指结点后插入s所指结点</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool InsertNextDNode(DNode *p,DNode *s){</span>
<span class="line">	if(p==NULL||s==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	s-&gt;next=p-&gt;next; //代码的顺序不是唯一的，但是推荐这样写</span>
<span class="line">	if(p-&gt;next!=NULL)</span>
<span class="line">		p-&gt;next-&gt;prior=s;</span>
<span class="line">	s-&gt;prior=p;</span>
<span class="line">	p-&gt;next=s;</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>删除操作</strong>：删除p所指的结点的后继结点</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool DeleteNextDNode(DNode *p){</span>
<span class="line">	if(p==NULL||s==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	DNode *q=p-&gt;next;</span>
<span class="line">	if(q==NULL)</span>
<span class="line">		return false;</span>
<span class="line">	p-&gt;next=q-&gt;next;</span>
<span class="line">	q-&gt;next-&gt;prior=p;</span>
<span class="line">	free(q);</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="循环单链表" tabindex="-1"><a class="header-anchor" href="#循环单链表"><span>循环单链表</span></a></h3><p><strong>定义</strong>：在单链表的基础上将最后一个结点的next由NULL改为了头结点，也可以专门设置一个r专门指向尾结点。当L-&gt;next=L时循环单链表为空</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">bool InitList(LinkList &amp;L){</span>
<span class="line">	L=(LNode*)malloc(sizeof(LNode));</span>
<span class="line">	if(L==NULL) //如果L申请失败</span>
<span class="line">		return false;</span>
<span class="line">	L-&gt;next=L; //头结点指向头结点</span>
<span class="line">	return ture;</span>
<span class="line">}</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><h3 id="循环双链表" tabindex="-1"><a class="header-anchor" href="#循环双链表"><span>循环双链表</span></a></h3><p><strong>定义</strong>：头结点的prior指针还要指向尾节点，p-&gt;next为L时循环双链表为空，此时头结点的next和prior都指向L</p><hr><h3 id="静态链表" tabindex="-1"><a class="header-anchor" href="#静态链表"><span>静态链表</span></a></h3><p><strong>定义</strong>：使用数组来描述链式存储的结构，具有data和next域，但是next中存的是结点在数组中的下标，静态链表也是事先分配一段连续的空间，尾节点的next为-1，空结点的next为-2。</p><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre><code class="language-text"><span class="line">#define MaxSize 50</span>
<span class="line">typedef struct{</span>
<span class="line">	ElemType data;</span>
<span class="line">	int next;</span>
<span class="line">}SLinkList[MaxSize];//这里SLinkList表示一个最大长度为MaxSize的数组，而不是一个节点</span>
<span class="line"></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,68)])])}const r=n(l,[["render",t]]),c=JSON.parse('{"path":"/notes/obsidian/%E5%AD%A6%E4%B9%A0/408/%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/%E7%AC%AC%E4%BA%8C%E7%AB%A0%20%E7%BA%BF%E6%80%A7%E8%A1%A8.html","title":"第二章 线性表","lang":"zh-CN","frontmatter":{},"git":{},"filePathRelative":"notes/obsidian/学习/408/数据结构/第二章 线性表.md"}');export{r as comp,c as data};
