import{_ as W,d as H,r,w as X,e as Z,o as _,c as k,a as t,h as V,g as P,t as O,N as u,q as oe,v as fe,n as se,I as _e,p as le,k as ce,J as E,j as Q,i as q,K as ve,L as me,u as pe,F as he,f as be,M as Ie,l as ye}from"./entry-f37e1690.mjs";import{u as re,a as ee,b as ge}from"./useSubmit-6e9d3c62.mjs";import{u as te}from"./useWeb3-0193a35d.mjs";import{a as M,M as F}from"./Market_abi-93ee176c.mjs";import{T as U}from"./TokenERC20_abi-e6f25529.mjs";import{_ as ke,a as we,b as xe}from"./historyList-872a5fc9.mjs";import{u as Ae}from"./asyncData-3edde299.mjs";const Be=H({__name:"nftBuy",props:{nftInfo:null},setup(i,{expose:p}){p();const h=i,e=r();e.value=h.nftInfo;const o=re(),b=ee(),s=e.value.onSale&&!e.value.isBid,n=r(s),{account:a,library:l,chainId:f}=te();X([a,b],()=>{!!a.value&&!!l.value&&!!f.value&&(n.value=s&&a.value!==e.value.owner)});const v=r(null),m=r("0"),c=r(!1),w=r(!1);async function B(){const I=M[f.value],y=new l.value.eth.Contract(F,I),T=await y.methods.txRoundIdByNFTId(e.value.nftId).call(),x=await y.methods.paymentMap(e.value.nftId,T).call();v.value=x.payToken,m.value=x.payAmount;const D=await y.methods.nftById(e.value.nftId).call(),R={...e,...D};e.value=R;const j=new l.value.eth.Contract(U,x.payToken),z=await j.methods.balanceOf(a.value).call();u.exports.greaterThanOrEqual(u.exports.BigInt(z),u.exports.BigInt(m.value))?c.value=!0:c.value=!1;const J=await j.methods.allowance(a.value,I).call();u.exports.greaterThanOrEqual(u.exports.BigInt(J),u.exports.BigInt(m.value))?w.value=!0:w.value=!1}async function C(){o.value=!0;const I=M[f.value],y=new l.value.eth.Contract(U,v.value),T=await y.methods.allowance(a.value,I).call();u.exports.lessThan(u.exports.BigInt(T),u.exports.BigInt(m.value))?y.methods.approve(I,m.value).send({from:a.value}).then(()=>{N(I)}).catch(x=>{console.info(x),o.value=!1}):N(I)}function N(I){new l.value.eth.Contract(F,I).methods.buy(e.value.token,e.value.tokenId).send({from:a.value}).then(()=>{o.value=!1,b.value=Date.parse(new Date().toString())}).catch(T=>{console.info(T),o.value=!1})}Z(()=>{!!l.value&&!!a.value&&!!f.value&&(n.value=s&&a.value!==e.value.owner,B())});const S={nftInfo:e,props:h,loading:o,timestamp:b,isSale:s,ableSale:n,account:a,library:l,chainId:f,paymentToken:v,paymentAmount:m,ableBalance:c,ableApprove:w,queryBalanceAndApprove:B,buy:C,submitBuy:N};return Object.defineProperty(S,"__isScriptSetup",{enumerable:!1,value:!0}),S}}),Ce={style:{display:"inline-block"}},Ne=["disabled"],Te={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"};function Se(i,p,h,e,o,b){return _(),k("div",Ce,[t("button",{class:"w-100 btn btn-primary",type:"button",disabled:!e.ableSale||e.loading,onClick:e.buy},[e.loading?(_(),k("span",Te)):V("",!0),P(" "+O(e.loading?"Loading...":"Buy now"),1)],8,Ne)])}var Oe=W(Be,[["render",Se]]);const Le=H({__name:"nftOffer",props:{nftInfo:null},setup(i,{expose:p}){p();const h=i,e=r();e.value=h.nftInfo;const o=e.value.onSale&&e.value.isBid,b=r(o),s=r(!1),{account:n,library:a,chainId:l}=te();X([n,s],()=>{!!n.value&&!!a.value&&!!l.value&&(b.value=o&&n.value!==e.value.owner&&!s.value)});const f=re(),v=ge(),m=ee(),c=r({token:e.value.token,tokenId:e.value.tokenId,amount:0,agreenTerms:!1}),w=r(0),B=r(null),C=r(0),N=r(!1),S=r(!1);async function I(){c.value.token=e.value.token,c.value.tokenId=e.value.tokenId;const d=M[l.value],g=new a.value.eth.Contract(F,d),L=await g.methods.txRoundIdByNFTId(e.value.nftId).call(),A=await g.methods.paymentMap(e.value.nftId,L).call();B.value=A.payToken,C.value=A.payAmount,s.value=parseInt(A.endTime)<=Date.parse(new Date().toString())/1e3;const G=await g.methods.nftById(e.value.nftId).call(),ie={...e,...G};e.value=ie;const ne=new a.value.eth.Contract(U,A.payToken),de=await ne.methods.balanceOf(n.value).call();u.exports.greaterThanOrEqual(u.exports.BigInt(de),u.exports.BigInt(C.value))?N.value=!0:N.value=!1;const ue=await ne.methods.allowance(n.value,d).call();u.exports.greaterThanOrEqual(u.exports.BigInt(ue),u.exports.BigInt(C.value))?S.value=!0:S.value=!1}const y=r(0),T=r(0),x=r(!1),D=r(!1);async function R(){const d=new a.value.eth.Contract(F,M[l.value]),g=await d.methods.txRoundIdByNFTId(e.value.nftId).call(),L=await d.methods.offerLast(e.value.nftId,g).call();y.value=parseFloat(a.value.utils.fromWei(L.amount.toString(),"ether"));const A=await d.methods.getOfferList(e.value.nftId,g).call();T.value=A.length,A.length>0?w.value=y.value+1:w.value=y.value,x.value=!0}function j(d){T.value>0?x.value=parseFloat(d.target.value)>y.value:x.value=parseFloat(d.target.value)>=y.value}function z(d){D.value=d.target.checked}async function J(){if(v.value=!0,f.value=!0,c.value.amount=w.value,c.value.token&&c.value.tokenId&&x.value&&D.value){const d=M[l.value],g=a.value.utils.toWei(c.value.amount.toString(),"ether"),L=new a.value.eth.Contract(U,B.value),A=await L.methods.allowance(n.value,d).call();u.exports.lessThan(u.exports.BigInt(A),u.exports.BigInt(g))?L.methods.approve(d,g).send({from:n.value}).then(()=>{K(d,g)}).catch(G=>{console.info(G),f.value=!1,v.value=!1}):K(d,g)}else f.value=!1,v.value=!1}function K(d,g){new a.value.eth.Contract(F,d).methods.offer(c.value.token,c.value.tokenId,g).send({from:n.value}).then(()=>{f.value=!1,v.value=!1,m.value=Date.parse(new Date().toString()),document.getElementById("closeModalNftOffer").click()}).catch(A=>{console.info(A),f.value=!1,v.value=!1})}Z(()=>{!!a.value&&!!n.value&&!!l.value&&(I(),R(),b.value=o&&n.value!==e.value.owner&&!s.value)});const ae={nftInfo:e,props:h,isSale:o,ableSale:b,isExpire:s,account:n,library:a,chainId:l,loading:f,isSubmit:v,timestamp:m,formModel:c,offerAmount:w,paymentToken:B,paymentAmount:C,ableBalance:N,ableApprove:S,queryBalanceAndApprove:I,minPrice:y,offerListLength:T,isAbleAmount:x,isAbleAgreen:D,queryLastOffer:R,changeAmount:j,changeAgreen:z,offer:J,submitOffer:K};return Object.defineProperty(ae,"__isScriptSetup",{enumerable:!1,value:!0}),ae}}),$=i=>(le("data-v-0838ef2a"),i=i(),ce(),i),Me={style:{display:"inline-block"}},Fe=["disabled"],Pe={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},De={class:"modal fade",id:"modalNftOffer",tabindex:"-1","aria-labelledby":"modalNftOfferLabel","aria-hidden":"true"},qe={class:"modal-dialog modal-lg modal-dialog-centered"},$e={class:"modal-content"},Re=$(()=>t("div",{class:"modal-header"},[t("h5",{class:"modal-title",id:"modalNftOfferLabel"},"Place an Offer"),t("button",{id:"closeModalNftOffer",type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1)),je={class:"modal-body"},Ee={class:"row g-5"},Ve={class:"col"},Ue={class:"my-4"},We=$(()=>t("label",{for:"amount",class:"form-label"},"Price",-1)),He=["min"],Ye=$(()=>t("div",{id:"validationAmountFeedback",class:"invalid-feedback"}," You must input amount ",-1)),ze={class:"form-check"},Je=$(()=>t("label",{class:"form-check-label fw-lighter",for:"agreenTerms"},"I approve NFTrade's Terms & Conditions",-1)),Ke=$(()=>t("hr",{class:"my-4"},null,-1)),Ge=["disabled"],Qe={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"};function Xe(i,p,h,e,o,b){return _(),k("div",Me,[t("button",{class:"btn btn-danger",type:"button","data-bs-toggle":"modal","data-bs-target":"#modalNftOffer",disabled:!e.ableSale||e.loading,onClick:e.offer},[e.loading?(_(),k("span",Pe)):V("",!0),P(" "+O(e.loading?"Loading...":"Place an offer"),1)],8,Fe),t("div",De,[t("div",qe,[t("div",$e,[Re,t("div",je,[t("div",Ee,[t("div",Ve,[t("form",null,[t("div",Ue,[We,oe(t("input",{type:"number",class:se(`form-control ${e.isAbleAmount?"is-valid":"is-invalid"}`),id:"amount","aria-describedby":"validationAmountFeedback","onUpdate:modelValue":p[0]||(p[0]=s=>e.offerAmount=s),min:e.minPrice,max:"999999999999999999.999999999999999999",step:"0.000000000000000001",onInput:e.changeAmount,required:""},null,42,He),[[fe,e.offerAmount]]),Ye]),t("div",ze,[oe(t("input",{type:"checkbox",class:se(`form-check-input ${e.isAbleAgreen?"is-valid":"is-invalid"}`),id:"agreenTerms","onUpdate:modelValue":p[1]||(p[1]=s=>e.formModel.agreenTerms=s),onClick:e.changeAgreen,required:""},null,2),[[_e,e.formModel.agreenTerms]]),Je]),Ke,t("button",{class:"w-100 btn btn-primary btn-lg",type:"button",disabled:e.loading||!e.isAbleAmount||!e.isAbleAgreen,onClick:e.offer},[e.loading?(_(),k("span",Qe)):V("",!0),P(" "+O(e.loading?"Loading...":"Place Your Offer"),1)],8,Ge)])])])])])])])])}var Ze=W(Le,[["render",Xe],["__scopeId","data-v-0838ef2a"]]);const et=H({__name:"assets",props:{nftInfo:null},setup(i,{expose:p}){p();const h=i,e=h.nftInfo,o={props:h,nftInfo:e};return Object.defineProperty(o,"__isScriptSetup",{enumerable:!1,value:!0}),o}});function tt(i,p,h,e,o,b){const s=Oe,n=Ze,a=ve;return _(),E(a,null,{default:Q(()=>[q(s,{nftInfo:e.nftInfo},null,8,["nftInfo"]),q(n,{nftInfo:e.nftInfo,class:"ms-3"},null,8,["nftInfo"])]),_:1})}var at=W(et,[["render",tt]]);const nt=H({__name:"[token]-[tokenId]",setup(i,{expose:p}){p();const h=ee(),e=me(),o=e.params.token,b=e.params.tokenId,{$truncateAccount:s}=pe(),{account:n,library:a,chainId:l}=te();X([n,h],()=>{n.value&&m()});const f=r();async function v(){const w=new a.value.eth.Contract(F,M[l.value]),B=await w.methods.nftIdMap(o,b).call(),C=await w.methods.nftById(B).call(),N=await w.methods.collectionMap(o).call(),{data:S}=await Ae(B,()=>$fetch(C.tokenURI)),I={...C,collection:N,metadata:S.value};f.value=I}function m(){!!a.value&&!!n.value&&!!l.value&&v()}Z(()=>{m()});const c={timestamp:h,route:e,token:o,tokenId:b,$truncateAccount:s,account:n,library:a,chainId:l,nftInfo:f,getNftInfo:v,loadNftData:m};return Object.defineProperty(c,"__isScriptSetup",{enumerable:!1,value:!0}),c}}),Y=i=>(le("data-v-6d104b92"),i=i(),ce(),i),ot={key:0,class:"py-5 container"},st={class:"row py-lg-5"},lt={class:"col-lg-6 col-md-12"},ct={class:"ratio ratio-1x1 nft-img"},rt=["src"],it={class:"col-lg-6 col-md-12"},dt={class:"card border-0"},ut={class:"card-body"},ft={class:"card-text"},_t={key:0,class:"bi bi-patch-check-fill text-primary"},vt={class:"card-body"},mt={class:"card-title"},pt={class:"card-text"},ht=P(" Owned by "),bt={class:"d-flex justify-content-start align-items-center"},It=Ie('<div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example" data-v-6d104b92><a href="#history" data-v-6d104b92>History <i class="bi bi-link-45deg" data-v-6d104b92></i></a><a class="ms-3" href="#offers" data-v-6d104b92>Offers <i class="bi bi-link-45deg" data-v-6d104b92></i></a><a class="ms-3" href="#listings" data-v-6d104b92>Listings <i class="bi bi-link-45deg" data-v-6d104b92></i></a></div>',1),yt={class:"mb-5"},gt=Y(()=>t("h4",null,"Properties",-1)),kt={class:"table table-bordered"},wt=Y(()=>t("thead",null,[t("tr",null,[t("th",{scope:"col"},"Property"),t("th",{scope:"col"},"Value")])],-1)),xt={key:0},At={key:1},Bt=Y(()=>t("tr",{class:"text-center fw-lighter"},[t("td",{colspan:"5"},"No Data")],-1)),Ct=[Bt],Nt={"data-bs-spy":"scroll","data-bs-target":"#list-example","data-bs-offset":"0","data-bs-smooth-scroll":"true",class:"scrollspy-example",tabindex:"0"},Tt={class:"mb-5",id:"listings"},St={class:"mb-5",id:"offers"},Ot={class:"mb-5",id:"history"},Lt={key:1,class:"py-5 container"},Mt=Y(()=>t("div",{class:"row"},[t("div",{class:"text-center"},[t("div",{class:"spinner-border",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")])])],-1)),Ft=[Mt];function Pt(i,p,h,e,o,b){var v,m;const s=ye,n=at,a=ke,l=we,f=xe;return _(),k("main",null,[(v=e.nftInfo)!=null&&v.token?(_(),k("section",ot,[t("div",st,[t("div",lt,[t("div",ct,[t("img",{src:(m=e.nftInfo.metadata)==null?void 0:m.fileUrl},null,8,rt)])]),t("div",it,[t("div",dt,[t("div",ut,[t("p",ft,[q(s,{to:`/account/nfts/${e.nftInfo.collection.token}`},{default:Q(()=>[P(O(e.nftInfo.collection.name),1)]),_:1},8,["to"]),e.nftInfo.collection.approve?(_(),k("i",_t)):V("",!0)])]),t("div",vt,[t("h3",mt,O(e.nftInfo.metadata.name),1),t("p",pt,[ht,q(s,{to:`/account/${e.nftInfo.owner}`},{default:Q(()=>[P(O(e.$truncateAccount(e.nftInfo.owner)),1)]),_:1},8,["to"])]),t("div",bt,[q(n,{nftInfo:e.nftInfo},null,8,["nftInfo"])])])])])]),It,t("div",yt,[gt,t("table",kt,[wt,e.nftInfo.metadata.properties.length>0?(_(),k("tbody",xt,[(_(!0),k(he,null,be(e.nftInfo.metadata.properties,c=>(_(),k("tr",{key:c.property},[t("th",null,O(c.property),1),t("td",null,O(c.value),1)]))),128))])):(_(),k("tbody",At,Ct))])]),t("div",Nt,[t("div",Tt,[(_(),E(a,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))]),t("div",St,[(_(),E(l,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))]),t("div",Ot,[(_(),E(f,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))])])])):(_(),k("section",Lt,Ft))])}var Ut=W(nt,[["render",Pt],["__scopeId","data-v-6d104b92"]]);export{Ut as default};