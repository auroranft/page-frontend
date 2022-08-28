import{d as j,r as i,w as z,e as K,o as n,c as d,a as t,i as u,h as O,g as P,t as w,P as D,_ as ot,s as at,v as rt,n as nt,K as dt,p as st,m as lt,L as M,k as Y,M as ut,N as ft,u as vt,j as Q,F as mt,f as _t,q as pt,O as ht,l as yt}from"./entry-edde8571.mjs";import{u as G}from"./useLoading-6c61759c.mjs";import{u as W,A as V,a as It}from"./AuroranMarket-3591bb2e.mjs";import{u as J}from"./useWeb3-8a74333c.mjs";import{a as E,b as X}from"./index-745e66ed.mjs";import{A as Z}from"./AuroranNFTQuery-e3f22263.mjs";import{T as tt}from"./TokenERC20_abi-e6f25529.mjs";import{_ as bt,a as kt,b as gt}from"./historyList-95615b35.mjs";import{u as wt}from"./asyncData-26a9fddb.mjs";const xt={style:{display:"inline-block"}},Tt=["disabled"],Ct={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},Nt=j({__name:"nftBuy",props:{nftInfo:null},setup(_){const $=_,e=i();e.value=$.nftInfo;const f=G(),N=W(),B=e.value.nftSale.onSale&&!e.value.nftSale.isBid,p=i(B),{account:s,library:r,chainId:o}=J();z([s,N],()=>{!!s.value&&!!r.value&&!!o.value&&v()});const x=i(null),a=i("0");async function v(){const h=E[o.value],g=new r.value.eth.Contract(V,h),m=await g.methods.getTxRoundIdByNFTId(e.value.nftInfo.nftId).call(),b=await g.methods.getPaymentMap(e.value.nftInfo.nftId,m).call();x.value=b.payToken,a.value=b.payAmount;const T=await new r.value.eth.Contract(Z,X[o.value]).methods.getNFT(e.value.nftInfo.token,e.value.nftInfo.tokenId).call(),F={...e,...T};e.value=F,p.value=e.value.nftSale.onSale&&!e.value.nftSale.isBid&&s.value!==e.value.nftSale.owner}async function C(){f.value=!0;const h=E[o.value],g=new r.value.eth.Contract(tt,x.value),m=await g.methods.allowance(s.value,h).call();D.exports.lessThan(D.exports.BigInt(m),D.exports.BigInt(a.value))?g.methods.approve(h,a.value).send({from:s.value}).then(()=>{A(h)}).catch(b=>{console.info(b),f.value=!1}):A(h)}function A(h){new r.value.eth.Contract(V,h).methods.buy(e.value.nftInfo.token,e.value.nftInfo.tokenId).send({from:s.value}).then(()=>{f.value=!1,N.value=Date.parse(new Date().toString())}).catch(m=>{console.info(m),f.value=!1,N.value=Date.parse(new Date().toString())})}return K(()=>{!!r.value&&!!s.value&&!!o.value&&v()}),(h,g)=>(n(),d("div",xt,[t("button",{class:"w-100 btn btn-primary",type:"button",disabled:!p.value||u(f),onClick:C},[u(f)?(n(),d("span",Ct)):O("",!0),P(" "+w(u(f)?"Loading...":"Buy now"),1)],8,Tt)]))}}),U=_=>(st("data-v-2c021e46"),_=_(),lt(),_),St={style:{display:"inline-block"}},At=["disabled"],$t={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},Bt={class:"modal fade",id:"modalNftOffer",tabindex:"-1","aria-labelledby":"modalNftOfferLabel","aria-hidden":"true"},Ft={class:"modal-dialog modal-lg modal-dialog-centered"},Lt={class:"modal-content"},Ot=U(()=>t("div",{class:"modal-header"},[t("h5",{class:"modal-title",id:"modalNftOfferLabel"},"Place an Offer"),t("button",{id:"closeModalNftOffer",type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),Dt={class:"modal-body"},Mt={class:"row g-5"},Pt={class:"col"},Rt={class:"my-4"},qt=U(()=>t("label",{for:"amount",class:"form-label"},"Price",-1)),Vt=["min"],Et=U(()=>t("div",{id:"validationAmountFeedback",class:"invalid-feedback"}," You must input amount ",-1)),Ut={class:"form-check"},jt=U(()=>t("label",{class:"form-check-label fw-lighter",for:"agreenTerms"},"I approve NFTrade's Terms & Conditions",-1)),Wt=U(()=>t("hr",{class:"my-4"},null,-1)),Ht=["disabled"],Qt={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},Yt=j({__name:"nftOffer",props:{nftInfo:null},setup(_){const $=_,e=i();e.value=$.nftInfo;const f=e.value.nftSale.onSale&&e.value.nftSale.isBid,N=i(f),B=i(!1),{account:p,library:s,chainId:r}=J();z([p,B],()=>{!!p.value&&!!s.value&&!!r.value&&g()});const o=G(),x=It(),a=W(),v=i({token:e.value.nftInfo.token,tokenId:e.value.nftInfo.tokenId,amount:0,agreenTerms:!1}),C=i(0),A=i(null),h=i(0);async function g(){v.value.token=e.value.nftInfo.token,v.value.tokenId=e.value.nftInfo.tokenId;const l=E[r.value],c=new s.value.eth.Contract(V,l),y=await c.methods.getTxRoundIdByNFTId(e.value.nftInfo.nftId).call(),I=await c.methods.getPaymentMap(e.value.nftInfo.nftId,y).call();A.value=I.payToken,h.value=I.payAmount,B.value=parseInt(I.endTime)<=Date.parse(new Date().toString())/1e3;const ct=await new s.value.eth.Contract(Z,X[r.value]).methods.getNFT(e.value.nftInfo.token,e.value.nftInfo.tokenId).call(),it={...e,...ct};e.value=it,N.value=e.value.nftSale.onSale&&e.value.nftSale.isBid&&p.value!==e.value.nftSale.owner}const m=i(0),b=i(0),k=i(!1),T=i(!1);async function F(){const l=new s.value.eth.Contract(V,E[r.value]),c=await l.methods.getTxRoundIdByNFTId(e.value.nftInfo.nftId).call(),y=await l.methods.getOfferLast(e.value.nftInfo.nftId,c).call();m.value=parseFloat(s.value.utils.fromWei(y.amount.toString(),"ether"));const I=await l.methods.getOfferListMap(e.value.nftInfo.nftId,c).call();b.value=I.length,I.length>0?C.value=m.value+1:C.value=m.value,k.value=!0}function R(l){b.value>0?k.value=parseFloat(l.target.value)>m.value:k.value=parseFloat(l.target.value)>=m.value}function q(l){T.value=l.target.checked}async function S(){if(x.value=!0,o.value=!0,v.value.amount=C.value,v.value.token&&v.value.tokenId&&k.value&&T.value){const l=E[r.value],c=s.value.utils.toWei(v.value.amount.toString(),"ether"),y=new s.value.eth.Contract(tt,A.value),I=await y.methods.allowance(p.value,l).call();D.exports.lessThan(D.exports.BigInt(I),D.exports.BigInt(c))?y.methods.approve(l,c).send({from:p.value}).then(()=>{L(l,c)}).catch(et=>{console.info(et),o.value=!1,x.value=!1,a.value=Date.parse(new Date().toString()),document.getElementById("closeModalNftOffer").click()}):L(l,c)}else o.value=!1,x.value=!1}function L(l,c){new s.value.eth.Contract(V,l).methods.offer(v.value.token,v.value.tokenId,c).send({from:p.value}).then(()=>{o.value=!1,x.value=!1,a.value=Date.parse(new Date().toString()),document.getElementById("closeModalNftOffer").click()}).catch(I=>{console.info(I),o.value=!1,x.value=!1,a.value=Date.parse(new Date().toString()),document.getElementById("closeModalNftOffer").click()})}return K(()=>{!!s.value&&!!p.value&&!!r.value&&(g(),F())}),(l,c)=>(n(),d("div",St,[t("button",{class:"btn btn-danger",type:"button","data-bs-toggle":"modal","data-bs-target":"#modalNftOffer",disabled:!N.value||u(o),onClick:S},[u(o)?(n(),d("span",$t)):O("",!0),P(" "+w(u(o)?"Loading...":"Place an offer"),1)],8,At),t("div",Bt,[t("div",Ft,[t("div",Lt,[Ot,t("div",Dt,[t("div",Mt,[t("div",Pt,[t("form",null,[t("div",Rt,[qt,at(t("input",{type:"number",class:nt(`form-control ${k.value?"is-valid":"is-invalid"}`),id:"amount","aria-describedby":"validationAmountFeedback","onUpdate:modelValue":c[0]||(c[0]=y=>C.value=y),min:m.value,max:"999999999999999999.999999999999999999",step:"0.000000000000000001",onInput:R,required:""},null,42,Vt),[[rt,C.value]]),Et]),t("div",Ut,[at(t("input",{type:"checkbox",class:nt(`form-check-input ${T.value?"is-valid":"is-invalid"}`),id:"agreenTerms","onUpdate:modelValue":c[1]||(c[1]=y=>v.value.agreenTerms=y),onClick:q,required:""},null,2),[[dt,v.value.agreenTerms]]),jt]),Wt,t("button",{class:"w-100 btn btn-primary btn-lg",type:"button",disabled:u(o)||!k.value||!T.value,onClick:S},[u(o)?(n(),d("span",Qt)):O("",!0),P(" "+w(u(o)?"Loading...":"Place Your Offer"),1)],8,Ht)])])])])])])])]))}});var zt=ot(Yt,[["__scopeId","data-v-2c021e46"]]);const Kt=j({__name:"assets",props:{nftInfo:null},setup(_){const e=_.nftInfo,f=W();return(N,B)=>{const p=Nt,s=zt,r=ut;return n(),M(r,null,{default:Y(()=>[(n(),M(p,{nftInfo:u(e),key:u(f)+1},null,8,["nftInfo"])),(n(),M(s,{nftInfo:u(e),class:"ms-3",key:u(f)+2},null,8,["nftInfo"]))]),_:1})}}}),H=_=>(st("data-v-67a04580"),_=_(),lt(),_),Gt={key:0,class:"py-5 container"},Jt={class:"row py-lg-5"},Xt={class:"col-lg-6 col-md-12"},Zt={class:"ratio ratio-1x1 nft-img"},te=["src"],ee={key:1,src:pt},ae={class:"col-lg-6 col-md-12"},ne={class:"card border-0"},oe={class:"card-body"},se={class:"card-text"},le={key:0,class:"bi bi-patch-check-fill text-primary"},ce={class:"card-body"},ie={class:"card-title"},re={class:"card-text"},de=P(" Owned: "),ue={class:"card-text"},fe={class:"card-text"},ve={key:0,class:"card-text"},me={class:"d-flex justify-content-start align-items-center"},_e=ht('<div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example" data-v-67a04580><a href="#history" data-v-67a04580>History <i class="bi bi-link-45deg" data-v-67a04580></i></a><a class="ms-3" href="#offers" data-v-67a04580>Offers <i class="bi bi-link-45deg" data-v-67a04580></i></a><a class="ms-3" href="#listings" data-v-67a04580>Listings <i class="bi bi-link-45deg" data-v-67a04580></i></a></div>',1),pe={key:0,class:"mb-5"},he=H(()=>t("h4",null,"Properties",-1)),ye={class:"table table-bordered"},Ie=H(()=>t("thead",null,[t("tr",null,[t("th",{scope:"col"},"Property"),t("th",{scope:"col"},"Value")])],-1)),be={key:0},ke={key:1},ge=H(()=>t("tr",{class:"text-center fw-lighter"},[t("td",{colspan:"5"},"No Data")],-1)),we=[ge],xe={"data-bs-spy":"scroll","data-bs-target":"#list-example","data-bs-offset":"0","data-bs-smooth-scroll":"true",class:"scrollspy-example",tabindex:"0"},Te={class:"mb-5",id:"listings"},Ce={class:"mb-5",id:"offers"},Ne={class:"mb-5",id:"history"},Se={key:1,class:"py-5 container"},Ae=H(()=>t("div",{class:"row"},[t("div",{class:"text-center"},[t("div",{class:"spinner-border",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")])])],-1)),$e=[Ae],Be=j({__name:"[token]-[tokenId]",setup(_){const $=G(),e=W(),f=ft(),N=f.params.token,B=f.params.tokenId,{$truncateAccount:p,$parseTime:s}=vt(),{account:r,library:o,chainId:x}=J();z([r,e],()=>{r.value&&m()});const a=i(),v=i(null),C=i(0),A=i(null),h=i(null);async function g(){$.value=!0;const b=new o.value.eth.Contract(Z,X[x.value]),k=await b.methods.getNFT(N,B).call(),T=await b.methods.getCollection(k.nftInfo.token).call(),{data:F}=await wt(k.nftInfo.nftId,()=>$fetch(k.tokenURI),"$DudycB40oh"),R={...k,collection:T,metadata:F.value};a.value=R;const q=await b.methods.getTxRoundIdByNFTId(a.value.nftInfo.nftId).call(),S=await b.methods.getPaymentMap(a.value.nftInfo.nftId,q).call();v.value=S.payToken,C.value=parseFloat(o.value.utils.fromWei(S.payAmount.toString(),"ether")),h.value=s(parseInt(S.endTime.toString()));const L=new o.value.eth.Contract(tt,S.payToken);A.value=await L.methods.symbol().call(),$.value=!1}function m(){!!o.value&&!!r.value&&!!x.value&&g()}return K(()=>{m()}),(b,k)=>{var L,l,c,y;const T=yt,F=Kt,R=bt,q=kt,S=gt;return n(),d("main",null,[(L=a.value)!=null&&L.nftInfo.token?(n(),d("section",Gt,[t("div",Jt,[t("div",Xt,[t("div",Zt,[(l=a.value.metadata)!=null&&l.fileUrl?(n(),d("img",{key:0,src:(c=a.value.metadata)==null?void 0:c.fileUrl},null,8,te)):(n(),d("img",ee))])]),t("div",ae,[t("div",ne,[t("div",oe,[t("p",se,[Q(T,{to:`/account/nfts/${a.value.collection.token}`},{default:Y(()=>[P(w(a.value.collection.name),1)]),_:1},8,["to"]),a.value.collection.approve?(n(),d("i",le)):O("",!0)])]),t("div",ce,[t("h3",ie,w(a.value.metadata.name),1),t("p",re,[de,Q(T,{to:`/account/${a.value.nftSale.owner}`},{default:Y(()=>[P(w(u(p)(a.value.nftSale.owner)),1)]),_:1},8,["to"])]),t("p",ue," Creator Royalty: "+w(a.value.collection.royalty)+" % ",1),t("p",fe," Listed Price: "+w(C.value)+" "+w(A.value),1),a.value.nftSale.isBid?(n(),d("p",ve," End Time: "+w(h.value),1)):O("",!0),t("div",me,[Q(F,{nftInfo:a.value},null,8,["nftInfo"])])])])])]),_e,(y=a.value.metadata)!=null&&y.properties?(n(),d("div",pe,[he,t("table",ye,[Ie,a.value.metadata.properties.length>0?(n(),d("tbody",be,[(n(!0),d(mt,null,_t(a.value.metadata.properties,I=>(n(),d("tr",{key:I.property},[t("th",null,w(I.property),1),t("td",null,w(I.value),1)]))),128))])):(n(),d("tbody",ke,we))])])):O("",!0),t("div",xe,[t("div",Te,[(n(),M(R,{nftInfo:a.value,key:u(e)},null,8,["nftInfo"]))]),t("div",Ce,[(n(),M(q,{nftInfo:a.value,key:u(e)},null,8,["nftInfo"]))]),t("div",Ne,[(n(),M(S,{nftInfo:a.value,key:u(e)},null,8,["nftInfo"]))])])])):(n(),d("section",Se,$e))])}}});var Ee=ot(Be,[["__scopeId","data-v-67a04580"]]);export{Ee as default};
