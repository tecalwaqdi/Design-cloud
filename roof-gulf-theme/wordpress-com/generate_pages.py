import json
NAVY="#0E2A47"; DARK="#081A2E"; OR="#F28C28"; ORD="#D9741A"; SURF="#F4F6F9"; LINE="#E2E7EE"; MUTED="#5B6B7F"; TXT="#14202E"
GRAD="linear-gradient(135deg,#081A2E 0%,#0E2A47 55%,#17406B 100%)"
def j(o): return json.dumps(o,ensure_ascii=False,separators=(',',':'))

def p(text,color=None,size=None,align=None,weight=None,mt=None,mb=None,cls=None,lh=None):
    a={};st={};css=[];c=[]
    if align: a["align"]=align; c.append(f"has-text-align-{align}")
    if cls: a["className"]=cls; c.append(cls)
    if color: st.setdefault("color",{})["text"]=color; c.append("has-text-color"); css.append(f"color:{color}")
    sp={}
    if mt: sp["top"]=mt; css.append(f"margin-top:{mt}")
    if mb: sp["bottom"]=mb; css.append(f"margin-bottom:{mb}")
    if sp: st["spacing"]={"margin":sp}
    ty={}
    if size: ty["fontSize"]=size; css.append(f"font-size:{size}")
    if weight: ty["fontWeight"]=weight; css.append(f"font-weight:{weight}")
    if lh: ty["lineHeight"]=lh; css.append(f"line-height:{lh}")
    if ty: st["typography"]=ty
    if st: a["style"]=st
    ca=f' class="{" ".join(c)}"' if c else ''; sa=f' style="{";".join(css)}"' if css else ''
    return f'<!-- wp:paragraph {j(a)} -->\n<p{ca}{sa}>{text}</p>\n<!-- /wp:paragraph -->' if a else f'<!-- wp:paragraph -->\n<p>{text}</p>\n<!-- /wp:paragraph -->'

def h(text,level=2,color=NAVY,size=None,align=None,mt=None):
    a={"level":level} if level!=2 else {}
    st={"color":{"text":color}}; css=[f"color:{color}"]; c=["wp-block-heading"]
    if align: a["textAlign"]=align; c.append(f"has-text-align-{align}")
    c.append("has-text-color")
    ty={"fontWeight":"800","lineHeight":"1.35"}
    if size: ty["fontSize"]=size; css.append(f"font-size:{size}")
    css+=["font-weight:800","line-height:1.35"]
    if mt: st["spacing"]={"margin":{"top":mt}}; css.insert(1,f"margin-top:{mt}")
    st["typography"]=ty; a["style"]=st
    return f'<!-- wp:heading {j(a)} -->\n<h{level} class="{" ".join(c)}" style="{";".join(css)}">{text}</h{level}>\n<!-- /wp:heading -->'

def eyebrow(text,align=None,light=False):
    bg="rgba(242,140,40,0.2)" if light else "#FDEEDF"; col="#FFC488" if light else ORD
    a={"style":{"color":{"background":bg,"text":col},"spacing":{"padding":{"top":"0.3rem","bottom":"0.3rem","left":"1rem","right":"1rem"}},"border":{"radius":"999px"},"typography":{"fontSize":"0.9rem","fontWeight":"700"}},"layout":{"type":"flex","flexWrap":"nowrap","justifyContent":"center" if align=="center" else "left"}}
    inner=f'<!-- wp:paragraph -->\n<p>{text}</p>\n<!-- /wp:paragraph -->'
    g={"layout":{"type":"flex","justifyContent":"center" if align=="center" else "left"}}
    return (f'<!-- wp:group {j(g)} -->\n<div class="wp-block-group">'
            f'<!-- wp:group {j(a)} -->\n<div class="wp-block-group has-text-color has-background" style="border-radius:999px;color:{col};background-color:{bg};padding-top:0.3rem;padding-right:1rem;padding-bottom:0.3rem;padding-left:1rem;font-size:0.9rem;font-weight:700">{inner}</div>\n<!-- /wp:group --></div>\n<!-- /wp:group -->')

def btn(text,href,bg=OR,fg="#FFFFFF",outline=False):
    if outline:
        a={"style":{"color":{"text":fg},"border":{"width":"2px","color":fg,"radius":"8px"},"typography":{"fontWeight":"700"}},"className":"is-style-outline"}
        return f'<!-- wp:button {j(a)} -->\n<div class="wp-block-button is-style-outline" style="font-weight:700"><a class="wp-block-button__link has-text-color has-border-color wp-element-button" href="{href}" style="border-color:{fg};border-width:2px;border-radius:8px;color:{fg}">{text}</a></div>\n<!-- /wp:button -->'
    a={"style":{"color":{"background":bg,"text":fg},"border":{"radius":"8px"},"typography":{"fontWeight":"700"}}}
    return f'<!-- wp:button {j(a)} -->\n<div class="wp-block-button" style="font-weight:700"><a class="wp-block-button__link has-text-color has-background wp-element-button" href="{href}" style="border-radius:8px;color:{fg};background-color:{bg}">{text}</a></div>\n<!-- /wp:button -->'

def btns(*bs,justify=None):
    a={"layout":{"type":"flex","justifyContent":justify}} if justify else {}
    return f'<!-- wp:buttons {j(a)} -->\n<div class="wp-block-buttons">{"".join(bs)}</div>\n<!-- /wp:buttons -->' if a else f'<!-- wp:buttons -->\n<div class="wp-block-buttons">{"".join(bs)}</div>\n<!-- /wp:buttons -->'

def section(inner,bg=None,grad=None,pt="5rem",pb="5rem",fg=None):
    st={"spacing":{"padding":{"top":pt,"bottom":pb,"left":"1.5rem","right":"1.5rem"},"margin":{"top":"0","bottom":"0"}},"color":{}}
    css=["margin-top:0","margin-bottom:0",f"padding-top:{pt}","padding-right:1.5rem",f"padding-bottom:{pb}","padding-left:1.5rem"]
    c=["wp-block-group","alignfull"]
    if bg: st["color"]["background"]=bg; css.append(f"background-color:{bg}"); c.append("has-background")
    if grad: st["color"]["gradient"]=grad; css.append(f"background:{grad}"); c.append("has-background")
    if fg: st["color"]["text"]=fg; css.append(f"color:{fg}"); c.append("has-text-color")
    if not st["color"]: del st["color"]
    a={"align":"full","style":st,"layout":{"type":"constrained","contentSize":"1200px"}}
    return f'<!-- wp:group {j(a)} -->\n<div class="{" ".join(c)}" style="{";".join(css)}">{inner}</div>\n<!-- /wp:group -->'

def narrow(inner,width="680px",justify=None):
    l={"type":"constrained","contentSize":width}
    if justify: l["justifyContent"]=justify
    return f'<!-- wp:group {j({"layout":l})} -->\n<div class="wp-block-group">{inner}</div>\n<!-- /wp:group -->'

def card(inner,bg="#FFFFFF",border=True,top=None,pad="2rem"):
    st={"border":{"radius":"16px"},"spacing":{"padding":{"top":pad,"bottom":pad,"left":"1.5rem","right":"1.5rem"}},"color":{"background":bg},"shadow":"0 10px 30px rgba(14,42,71,0.08)","dimensions":{"minHeight":"100%"}}
    css=["border-radius:16px","min-height:100%"]
    if border: st["border"].update({"width":"1px","color":LINE}); css+= [f"border-color:{LINE}","border-width:1px"]
    if top: st["border"]["top"]={"color":OR,"width":"4px"}; css+=[f"border-top-color:{OR}","border-top-width:4px"]
    css+=[f"background-color:{bg}",f"padding-top:{pad}","padding-right:1.5rem",f"padding-bottom:{pad}","padding-left:1.5rem","box-shadow:0 10px 30px rgba(14,42,71,0.08)"]
    c="wp-block-group has-background"+(" has-border-color" if border else "")
    return f'<!-- wp:group {j({"style":st,"layout":{"type":"default"}})} -->\n<div class="{c}" style="{";".join(css)}">{inner}</div>\n<!-- /wp:group -->'

def cols(items,gap="1.5rem",mt="2.5rem",valign=None,widths=None,stack=True):
    a={"align":"wide","style":{"spacing":{"blockGap":{"left":gap},"margin":{"top":mt}}}}
    if valign: a["verticalAlignment"]=valign
    if not stack: a["isStackedOnMobile"]=False
    c="wp-block-columns alignwide"+(f" are-vertically-aligned-{valign}" if valign else "")+("" if stack else " is-not-stacked-on-mobile")
    out=[]
    for i,it in enumerate(items):
        ca={}; cs=""; cc="wp-block-column"
        if valign: ca["verticalAlignment"]=valign; cc+=f" is-vertically-aligned-{valign}"
        if widths and widths[i]: ca["width"]=widths[i]; cs=f' style="flex-basis:{widths[i]}"'
        out.append(f'<!-- wp:column {j(ca)} -->\n<div class="{cc}"{cs}>{it}</div>\n<!-- /wp:column -->' if ca else f'<!-- wp:column -->\n<div class="{cc}">{it}</div>\n<!-- /wp:column -->')
    return f'<!-- wp:columns {j(a)} -->\n<div class="{c}" style="margin-top:{mt}">{"".join(out)}</div>\n<!-- /wp:columns -->'

ICON_BASE="https://api.iconify.design/tabler/{}.svg?color=%23d9741a"
def icon(name,center=False,size=60,img=30,bg="#FDEEDF",color="d9741a"):
    url=f"https://api.iconify.design/tabler/{name}.svg?color=%23{color}"
    im=f'<!-- wp:image {j({"width":f"{img}px","height":f"{img}px","sizeSlug":"full","linkDestination":"none","style":{"spacing":{"margin":{"top":"0","bottom":"0"}}}})} -->\n<figure class="wp-block-image size-full is-resized" style="margin-top:0;margin-bottom:0"><img src="{url}" alt="" style="width:{img}px;height:{img}px"/></figure>\n<!-- /wp:image -->'
    box={"style":{"dimensions":{"minHeight":f"{size}px"},"layout":{"selfStretch":"fixed","flexSize":f"{size}px"},"border":{"radius":"14px"},"color":{"background":bg}},"layout":{"type":"flex","justifyContent":"center","verticalAlignment":"center"}}
    boxh=f'<!-- wp:group {j(box)} -->\n<div class="wp-block-group has-background" style="border-radius:14px;background-color:{bg};min-height:{size}px">{im}</div>\n<!-- /wp:group -->'
    row={"style":{"spacing":{"margin":{"bottom":"1rem"}}},"layout":{"type":"flex","justifyContent":"center" if center else "left"}}
    return f'<!-- wp:group {j(row)} -->\n<div class="wp-block-group" style="margin-bottom:1rem">{boxh}</div>\n<!-- /wp:group -->'
def checklist(items):
    li="".join(f'<!-- wp:list-item -->\n<li>{t}</li>\n<!-- /wp:list-item -->' for t in items)
    return f'<!-- wp:list {j({"style":{"typography":{"lineHeight":"2.2"},"spacing":{"padding":{"right":"1.2rem","left":"0"}},"color":{"text":"#14202E"}},"className":"is-style-default"})} -->\n<ul style="color:#14202E;padding-right:1.2rem;padding-left:0;line-height:2.2" class="wp-block-list is-style-default has-text-color">{li}</ul>\n<!-- /wp:list -->'

PHONE="+966 50 000 0000"; TEL="+966500000000"; WA="966500000000"; MAIL="info@roof-gulf.com"; ADDR="المملكة العربية السعودية — الرياض"

# ---------- sections
def hero():
    inner=narrow(eyebrow("مقاولات عامة • إنشاءات • تشطيبات",light=True)+
        h('نبني <span style="color:#F28C28" class="has-inline-color">الثقة</span> قبل أن نبني المباني',1,"#FFFFFF","clamp(2.3rem,5vw,3.6rem)",mt="1rem")+
        p("سقف الخليج للمقاولات — شريكك في تنفيذ المشاريع السكنية والتجارية من التصميم حتى التسليم، بجودة عالية والتزام صارم بالوقت والميزانية.","#D3DCE7","1.3rem",lh="1.9")+
        btns(btn("اطلب عرض سعر مجاني","/contact/"),btn("شاهد مشاريعنا","/projects/",fg="#FFFFFF",outline=True)),"700px","right")
    return section(inner,grad=GRAD,pt="8rem",pb="8rem",fg="#FFFFFF")
def stats():
    S=[("+15","سنة خبرة"),("+250","مشروع منجز"),("+180","عميل راضٍ"),("+120","مهندس وفني")]
    return section(cols([p(n,OR,"2.6rem","center","800",mb="0")+p(l,"#C9D4E2",align="center",weight="500",mt="0.25rem") for n,l in S],mt="0",stack=False),bg=NAVY,pt="3rem",pb="3rem")
def about():
    left=(eyebrow("من نحن")+h("خبرة تمتد لأكثر من 15 عاماً في عالم المقاولات",size="2.4rem",mt="1rem")+
        p("تأسست سقف الخليج للمقاولات لتقدّم خدمات مقاولات متكاملة بمعايير عالمية. نؤمن بأن كل مشروع هو شراكة طويلة المدى، لذلك نعمل بشفافية كاملة ونلتزم بأعلى معايير الجودة والسلامة في كل مرحلة من مراحل التنفيذ.",MUTED)+
        checklist(["فريق هندسي معتمد وذو خبرة طويلة","التزام تام بالجدول الزمني والميزانية","مواد بناء عالية الجودة من موردين موثوقين","ضمان على الأعمال ومتابعة بعد التسليم"])+btns(btn("اعرف المزيد عنا","/about/")))
    right=section_box()
    return section(cols([left,right],gap="4rem",mt="0",valign="center",widths=["55%","45%"]))
def section_box():
    a={"style":{"border":{"radius":"18px"},"color":{"gradient":"linear-gradient(160deg,#17406B 0%,#081A2E 100%)"},"spacing":{"padding":{"top":"3rem","bottom":"3rem","left":"2rem","right":"2rem"}},"dimensions":{"minHeight":"420px"}},"textColor":None,"layout":{"type":"flex","orientation":"vertical","justifyContent":"center","verticalAlignment":"center"}}
    del a["textColor"]
    inner=icon("crane",True,size=110,img=64,bg="rgba(242,140,40,0.15)",color="f28c28")+p("الجودة • الالتزام • الأمان","#FFC488","1.3rem","center","800")+p("كل مشروع نسلّمه هو توقيعنا","#C9D4E2",align="center")
    return f'<!-- wp:group {j(a)} -->\n<div class="wp-block-group has-background" style="border-radius:18px;background:linear-gradient(160deg,#17406B 0%,#081A2E 100%);min-height:420px;padding-top:3rem;padding-right:2rem;padding-bottom:3rem;padding-left:2rem">{inner}</div>\n<!-- /wp:group -->'
def services():
    S=[("building-skyscraper","الإنشاءات العامة","تنفيذ المباني السكنية والتجارية والفلل من الهيكل الخرساني حتى التسليم النهائي."),
       ("paint","التشطيبات والديكور","تشطيبات داخلية وخارجية فاخرة: لياسة، دهانات، أرضيات، جبس وواجهات حديثة."),
       ("tool","الترميم والصيانة","إعادة تأهيل المباني القديمة ومعالجة التشققات والعزل المائي والحراري."),
       ("bolt","الأعمال الكهروميكانيكية","تمديدات الكهرباء والسباكة والتكييف وأنظمة السلامة وفق الكود السعودي."),
       ("ruler-measure","التصميم والإشراف الهندسي","تصاميم معمارية وإنشائية وإشراف هندسي متكامل يضمن جودة التنفيذ."),
       ("road","البنية التحتية","أعمال الحفر والردم والأسفلت وشبكات المياه والصرف والطرق الداخلية.")]
    head=narrow(eyebrow("خدماتنا","center")+h("حلول مقاولات متكاملة تحت سقف واحد",size="2.4rem",align="center",mt="1rem")+p("نغطي جميع مراحل مشروعك بفريق متخصص وإدارة احترافية، لتستلم مشروعك جاهزاً بأعلى جودة.",MUTED,align="center"),"640px")
    rows="".join(cols([card(icon(e)+h(t,3,size="1.35rem")+p(d,MUTED)) for e,t,d in S[i:i+3]]) for i in (0,3))
    return section(head+rows,bg=SURF)
def why():
    I=[("award","جودة بلا تنازل","نطبّق أنظمة رقابة جودة صارمة في كل مرحلة، ونستخدم مواد معتمدة فقط."),("clock-check","التسليم في الموعد","جداول زمنية واضحة ومتابعة يومية لضمان تسليم مشروعك في الوقت المحدد."),
       ("receipt-2","أسعار شفافة","عروض أسعار مفصّلة بدون تكاليف خفية، والتزام تام بالميزانية المتفق عليها."),("shield-check","السلامة أولاً","نلتزم بأعلى معايير الأمن والسلامة المهنية لحماية فريقنا وعملائنا.")]
    left=eyebrow("لماذا سقف الخليج؟")+h("نلتزم بما نعد به",size="2.4rem",mt="1rem")+p("عملاؤنا يختاروننا لأننا نعاملهم كشركاء: تواصل مستمر، تقارير دورية عن سير العمل، وفريق يتحمّل المسؤولية كاملة حتى التسليم.",MUTED)
    right="".join(cols([card(icon(n,size=52,img=26)+h(t,3,size="1.3rem")+p(d,MUTED),border=False,pad="1.5rem") for n,t,d in I[i:i+2]],mt="0" if i==0 else "1.5rem") for i in (0,2))
    return section(cols([left,right],gap="4rem",mt="0",widths=["36%",None]),bg=SURF)
def projects(with_head_btn=True):
    P=[("برج إداري — حي العليا","مباني تجارية","#0E2A47,#17406B"),("مجمع فلل سكنية — 24 فيلا","مشاريع سكنية","#1F3B2E,#2F5D46"),("ترميم مبنى تراثي","ترميم","#3A2A1A,#6B4A2B"),
       ("مركز تجاري — الطريق الدائري","مباني تجارية","#20263A,#3B4668"),("مستودعات ومنشآت صناعية","منشآت صناعية","#2B2B2B,#4A4A4A"),("تشطيب مقر شركة","تشطيبات","#0F3442,#1D5C70")]
    def pc(t,c,g):
        a,b=g.split(","); gr=f"linear-gradient(160deg,{b} 0%,{a} 100%)"
        at={"style":{"border":{"radius":"14px","bottom":{"color":OR,"width":"5px"}},"color":{"gradient":gr},"spacing":{"padding":{"top":"1.5rem","bottom":"1.5rem","left":"1.5rem","right":"1.5rem"}},"dimensions":{"minHeight":"280px"}},"layout":{"type":"flex","orientation":"vertical","justifyContent":"right","verticalAlignment":"bottom"}}
        inner=p(c,OR,"0.85rem",weight="700",mb="0")+h(t,3,"#FFFFFF","1.35rem",mt="0.25rem")
        return f'<!-- wp:group {j(at)} -->\n<div class="wp-block-group has-background" style="border-radius:14px;border-bottom-color:{OR};border-bottom-width:5px;background:{gr};min-height:280px;padding-top:1.5rem;padding-right:1.5rem;padding-bottom:1.5rem;padding-left:1.5rem">{inner}</div>\n<!-- /wp:group -->'
    head=cols([eyebrow("أعمالنا")+h("مشاريع نفخر بإنجازها",size="2.4rem",mt="1rem"), btns(btn("كل المشاريع","/projects/",fg=NAVY,outline=True),justify="left") if with_head_btn else ""],mt="0",valign="bottom")
    rows="".join(cols([pc(*x) for x in P[i:i+3]]) for i in (0,3))
    return section(head+rows)
def testimonials():
    T=[("نفّذوا لنا مجمع الفلل بجودة ممتازة وسلّموا قبل الموعد بأسبوعين. فريق محترف ومتعاون.","م. خالد العتيبي","مطوّر عقاري"),
       ("تعاملنا معهم في تشطيب مقرّنا الرئيسي، والنتيجة فاقت توقعاتنا من حيث الدقة والذوق.","أ. سارة القحطاني","مديرة مرافق"),
       ("شفافية في الأسعار والتزام بالمواصفات. أنصح بهم لأي مشروع إنشائي.","أ. فهد الدوسري","مالك عقار")]
    head=eyebrow("آراء عملائنا","center")+h("ثقة عملائنا هي رأس مالنا",size="2.4rem",align="center",mt="1rem")
    return section(head+cols([card(p("★★★★★",OR)+p(f"«{q}»",TXT,lh="1.9")+p(n,NAVY,weight="800",mt="1rem",mb="0")+p(r,MUTED,"0.9rem",mt="0")) for q,n,r in T]))
def cta():
    left=h("جاهز لبدء مشروعك القادم؟",color="#FFFFFF",size="2rem")+p("تواصل معنا اليوم واحصل على استشارة ومعاينة مجانية وعرض سعر مفصّل خلال 48 ساعة.","#C9D4E2")
    right=btns(btn("اطلب عرض سعر","/contact/"),btn("اتصل بنا",f"tel:{TEL}",bg="#FFFFFF",fg=NAVY),justify="left")
    return section(cols([left,right],mt="0",valign="center",widths=["64%",None]),grad=GRAD,pt="4rem",pb="4rem")
def page_header(title,sub):
    return section(h(title,1,"#FFFFFF","clamp(2rem,4vw,2.8rem)")+p(sub,"#C9D4E2","1.1rem"),grad=GRAD,pt="4.5rem",pb="4.5rem")
def vision():
    V=[("target-arrow","رؤيتنا","أن نكون الخيار الأول في قطاع المقاولات بالخليج، بتقديم مشاريع تجمع الجودة والابتكار والاستدامة."),
       ("flag","رسالتنا","تنفيذ مشاريع عملائنا بأعلى معايير الجودة والسلامة، ضمن الوقت والميزانية، وبشراكة قائمة على الثقة."),
       ("heart-handshake","قيمنا","النزاهة، الإتقان، الالتزام، العمل بروح الفريق، والمسؤولية تجاه عملائنا ومجتمعنا.")]
    return section(cols([card(icon(e)+h(t,3,size="1.35rem")+p(d,MUTED),border=False,top=True) for e,t,d in V],mt="0"),bg=SURF)
def contact():
    C=[("phone","اتصل بنا",f'<a href="tel:{TEL}"><span dir="ltr">{PHONE}</span></a>'),("brand-whatsapp","واتساب",f'<a href="https://wa.me/{WA}">راسلنا مباشرة</a>'),
       ("mail","البريد الإلكتروني",f'<a href="mailto:{MAIL}">{MAIL}</a>'),("map-pin","العنوان",ADDR)]
    head=narrow(eyebrow("تواصل معنا","center")+h("يسعدنا سماع تفاصيل مشروعك",size="2.4rem",align="center",mt="1rem")+p("فريقنا جاهز للرد على استفساراتك وتحديد موعد معاينة مجانية للموقع. أوقات العمل: الأحد – الخميس، 8 صباحاً – 5 مساءً.",MUTED,align="center"),"640px")
    grid=cols([card(icon(e,True)+h(t,3,size="1.25rem",align="center")+p(v,align="center"),bg=SURF) for e,t,v in C])
    wa=btns(btn("تواصل عبر واتساب الآن",f"https://wa.me/{WA}",bg="#25D366"),justify="center")
    return section(head+grid+'<!-- wp:spacer {"height":"2.5rem"} -->\n<div style="height:2.5rem" aria-hidden="true" class="wp-block-spacer"></div>\n<!-- /wp:spacer -->'+wa)

pages={
 "home":("الرئيسية",[hero(),stats(),about(),services(),projects(),testimonials(),cta()]),
 "about":("من نحن",[page_header("من نحن","تعرّف على سقف الخليج للمقاولات: رؤيتنا، رسالتنا، وما يميّزنا."),about(),vision(),stats(),why(),cta()]),
 "services":("خدماتنا",[page_header("خدماتنا","حلول مقاولات متكاملة من التصميم حتى التسليم."),services(),why(),cta()]),
 "projects":("مشاريعنا",[page_header("مشاريعنا","نماذج من المشاريع التي نفّذناها بفخر."),projects(False),testimonials(),cta()]),
 "contact":("تواصل معنا",[page_header("تواصل معنا","نحن هنا للإجابة عن استفساراتك وتقديم عرض سعر مجاني."),contact()]),
}
for slug,(t,secs) in pages.items():
    open(f"/tmp/claude-0/wpcom2/{slug}.html","w").write("\n\n".join(secs))
    print(slug, len("\n\n".join(secs)))
