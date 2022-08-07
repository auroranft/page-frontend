import{_ as O,d as L,u as P,w as D,r as g,b as U,e as q,o as n,c,a as e,F as G,f as j,n as I,g as R,t as p,h as A,i as m,j as N,k as z,l as J,p as K,m as Q,q as W,s as H,v as X}from"./entry-58e7afa6.mjs";import{u as Y}from"./asyncData-5962a627.mjs";import{u as V,a as Z,b as ee}from"./useSubmit-99431132.mjs";import{u as E}from"./useWeb3-5d18194c.mjs";import{M as w,a as C}from"./Market_abi-93ee176c.mjs";const T=$=>(K("data-v-418b75ef"),$=$(),Q(),$),te={class:"py-3 bg-light"},ae={key:0,class:"container"},se={class:"row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"},oe={class:"card shadow-sm position-relative"},le=T(()=>e("span",{class:"visually-hidden"},"Is Show",-1)),ne=[le],ce=T(()=>e("img",{src:W,class:"card-img-top"},null,-1)),ie={class:"card-body"},re={class:"card-title"},ue={key:0,class:"bi bi-patch-check-fill text-primary"},de={class:"card-text"},_e={class:"list-group list-group-flush"},ve={class:"list-group-item"},he=R(" Token: "),pe=["onClick"],be={class:"list-group-item"},me={class:"list-group-item"},fe={class:"list-group-item"},ge={class:"card-body"},ye={class:"btn-group"},ke=["onClick"],we=["onClick"],Ce={key:1,class:"container"},$e={class:"row py-lg-5"},Ae={class:"col-lg-6 col-md-8 mx-auto"},Me=T(()=>e("p",{class:"lead text-muted"},"No NFTs to show here..",-1)),Re=T(()=>e("button",{type:"button",class:"btn btn-primary"}," Create ",-1)),xe=L({__name:"collection",setup($){const{$compare:o,$clip:_}=P(),a=V(),l=Z(),{account:i,library:s,chainId:u}=E();D([i,s,u,l],()=>{!!s.value&&!!i.value&&!!u.value&&x()});const v=g("");function y(r,b){v.value=r,_(r,b)}const f=U(),d=g([]);function x(){d.value=[],a.value=!0;const r=new s.value.eth.Contract(w,C[u.value]);r.methods.getCollectionTokenList().call({from:i.value}).then(async b=>{if(b.length>0){const M=b.map(async t=>{const k=await r.methods.collectionMap(t).call(),{data:B}=await Y(k.token,()=>$fetch(k.tokenURI),"$xitBVK4J5g"),F={...k,metadata:B.value};d.value.push(F)});await Promise.all(M),d.value.length>0&&d.value.sort(o("createTime"))}a.value=!1})}q(()=>{x()});function S(r,b){a.value=!0,new s.value.eth.Contract(w,C[u.value]).methods.auditCollection(r,b).send({from:i.value}).then(()=>{l.value=Date.parse(new Date().toString()),a.value=!1}).catch(t=>{console.info(t),a.value=!1})}function h(r,b){a.value=!0,new s.value.eth.Contract(w,C[u.value]).methods.showCollection(r,b).send({from:i.value}).then(()=>{l.value=Date.parse(new Date().toString()),a.value=!1}).catch(t=>{console.info(t),a.value=!1})}return(r,b)=>{const M=J;return n(),c("div",te,[d.value.length>0?(n(),c("div",ae,[e("div",se,[(n(!0),c(G,null,j(d.value,t=>(n(),c("div",{class:"col",key:t.token},[e("div",oe,[e("span",{class:I(`position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle ${t.show?"bg-success":"bg-danger"}`)},ne,2),ce,e("div",ie,[e("h5",re,[R(p(t.symbol)+" - "+p(t.name)+" ",1),t.approve?(n(),c("i",ue)):A("",!0)]),e("p",de,p(t.metadata.description),1)]),e("ul",_e,[e("li",ve,[he,e("a",{class:I(`card-link ${m(f)&&t.token===v.value?"text-success":""}`),onClick:k=>y(t.token,k)},[R(p(t.token)+" ",1),e("i",{class:I(`bi ${m(f)&&t.token===v.value?"bi-clipboard2-check":"bi-clipboard2"}`)},null,2)],10,pe)]),e("li",be,"Owner: "+p(t.owner),1),e("li",me,"Royalty: "+p(t.royalty)+" %",1),e("li",fe,"Create Time: "+p(r.$parseTime(t.createTime)),1)]),e("div",ge,[e("div",ye,[e("button",{type:"button",class:"btn btn-sm btn-primary",onClick:k=>S(t.token,!t.approve)},p(t.approve?"Audit Cancel":"Audit Pass"),9,ke),e("button",{type:"button",class:"btn btn-sm btn-outline-primary",onClick:k=>h(t.token,!t.show)},p(t.show?"Show Cancel":"Show Pass"),9,we)])])])]))),128))])])):(n(),c("div",Ce,[e("div",$e,[e("div",Ae,[Me,e("p",null,[N(M,{to:"/create"},{default:z(()=>[Re]),_:1})])])])]))])}}});var Ie=O(xe,[["__scopeId","data-v-418b75ef"]]);const Te={class:"py-3"},Se={class:"container"},Ne=e("h4",null,"Staff Manage",-1),Le={key:0,class:"alert alert-danger fade show",role:"alert"},De={class:"mb-3"},Ve=e("label",{for:"account",class:"form-label"},"Account",-1),Ee=e("div",{class:"invalid-feedback"}," Required Account Address ",-1),qe={class:"mb-3"},Be={for:"account",class:"form-label"},Fe={class:"mb-3"},Oe=["disabled"],Pe={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},Ue=["disabled"],Ge={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},je=L({__name:"staff",setup($){const o=V(),_=ee(),a=g(null),l=g(!1),{account:i,library:s,chainId:u}=E();D([i,s,u],()=>{!!s.value&&!!i.value&&!!u.value&&y()});const v=g("");async function y(){o.value=!0;const h=new s.value.eth.Contract(w,C[u.value]);v.value=await h.methods.MANAGER_ROLE().call(),o.value=!1}q(()=>{y()});function f(){if(!a.value)l.value=!1;else try{a.value=s.value.utils.toChecksumAddress(a.value),l.value=!1}catch{l.value=!0}}const d=g(!1);async function x(){_.value=!0,o.value=!0;try{const h=new s.value.eth.Contract(w,C[u.value]);d.value=await h.methods.hasRole(v.value,s.value.utils.toChecksumAddress(a.value)).call()}catch{l.value=!0,setTimeout(()=>{l.value=!1},3e3)}_.value=!1,o.value=!1}async function S(){_.value=!0,o.value=!0;try{const h=new s.value.eth.Contract(w,C[u.value]);d.value?await h.methods.removeManager(s.value.utils.toChecksumAddress(a.value)).send({from:i.value}):await h.methods.addManager(s.value.utils.toChecksumAddress(a.value)).send({from:i.value})}catch{l.value=!0,setTimeout(()=>{l.value=!1},3e3)}_.value=!1,o.value=!1}return(h,r)=>(n(),c("div",Te,[e("div",Se,[Ne,l.value?(n(),c("div",Le," Address is invalid!!! ")):A("",!0),e("form",{class:I(`needs-validation ${m(_)?"was-validated":""}`),novalidate:""},[e("div",De,[Ve,H(e("input",{class:"form-control",id:"account","onUpdate:modelValue":r[0]||(r[0]=b=>a.value=b),placeholder:"Required Account Address",onInput:f,required:""},null,544),[[X,a.value]]),Ee]),e("div",qe,[e("label",Be,"Result: "+p(d.value),1)]),e("div",Fe,[e("button",{class:"btn btn-primary",type:"button",disabled:!a.value||m(o)||l.value,onClick:x},[m(o)?(n(),c("span",Pe)):A("",!0),R(" "+p(m(o)?"Loading...":"Query"),1)],8,Oe),e("button",{class:"btn btn-danger ms-3",type:"button",disabled:!a.value||m(o)||l.value,onClick:S},[m(o)?(n(),c("span",Ge)):A("",!0),R(" "+p(m(o)?"Loading...":d.value?"Remove":"Approve"),1)],8,Ue)])],2)])]))}}),ze={key:0,class:"container py-5"},Je={class:"nav nav-tabs",id:"manageTab",role:"tablist"},Ke=e("li",{class:"nav-item",role:"presentation"},[e("button",{class:"nav-link active",id:"collection-tab","data-bs-toggle":"tab","data-bs-target":"#collection-tab-pane",type:"button",role:"tab","aria-controls":"collection-tab-pane","aria-selected":"true"}," Collection Manage ")],-1),Qe={key:0,class:"nav-item",role:"presentation"},We=e("button",{class:"nav-link",id:"staff-tab","data-bs-toggle":"tab","data-bs-target":"#staff-tab-pane",type:"button",role:"tab","aria-controls":"staff-tab-pane","aria-selected":"false"}," Market Manage ",-1),He=[We],Xe={class:"tab-content",id:"manageTabContent"},Ye={class:"tab-pane fade show active",id:"collection-tab-pane",role:"tabpanel","aria-labelledby":"collection-tab",tabindex:"0"},Ze={key:0,class:"tab-pane fade",id:"staff-tab-pane",role:"tabpanel","aria-labelledby":"staff-tab",tabindex:"0"},et={key:1,class:"container py-5"},tt=e("h1",null,"No permission",-1),at=[tt],it=L({__name:"manage",setup($){const o=V(),{account:_,library:a,chainId:l}=E();D([_,a],()=>{!!a.value&&!!_.value&&!!l.value&&u()});const i=g(!1),s=g(!1);async function u(){o.value=!0;const v=new a.value.eth.Contract(w,C[l.value]),y=await v.methods.DEFAULT_ADMIN_ROLE().call(),f=await v.methods.MANAGER_ROLE().call();i.value=await v.methods.hasRole(y,_.value).call(),s.value=await v.methods.hasRole(f,_.value).call(),o.value=!1}return(v,y)=>{const f=Ie,d=je;return n(),c("main",null,[s.value?(n(),c("div",ze,[e("ul",Je,[Ke,i.value?(n(),c("li",Qe,He)):A("",!0)]),e("div",Xe,[e("div",Ye,[N(f)]),i.value?(n(),c("div",Ze,[N(d)])):A("",!0)])])):(n(),c("div",et,at))])}}});export{it as default};