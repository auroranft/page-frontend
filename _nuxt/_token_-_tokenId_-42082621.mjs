import{_ as q,d as U,r as x,w as P,e as O,o as s,c as r,a as t,n as H,q as k,v as g,t as b,h as A,I as W,g as M,J as L,j as D,i as F,K as z,L as J,u as K,F as G,f as Q,M as X,p as Z,k as tt,l as et}from"./entry-f37e1690.mjs";import{u as j,b as ot,a as E}from"./useSubmit-6e9d3c62.mjs";import{u as Y}from"./useWeb3-0193a35d.mjs";import{T as nt,M as R,a as T}from"./Market_abi-93ee176c.mjs";import{T as at}from"./TokenERC721_abi-821b0436.mjs";import{_ as st,a as lt,b as it}from"./historyList-872a5fc9.mjs";import{u as dt}from"./asyncData-3edde299.mjs";const ct=U({__name:"nftList",props:{nftInfo:null},setup(_,{expose:n}){n();const f=_,e=x();e.value=f.nftInfo;const l=j(),m=ot(),o=E(),{account:c,library:i,chainId:d}=Y();P([c],()=>{!!c.value&&!!i.value&&!!d.value&&B()});const a=x({token:e.value.token,tokenId:e.value.tokenId,isBid:!1,payToken:null,payAmount:null,bonusRate:0,endTime:Date.parse(new Date().toString())/1e3+10*60,agreenTerms:!1}),h=x(!0),p=x(0),v=x(0);async function B(){a.value.token=e.value.token,a.value.tokenId=e.value.tokenId,a.value.payToken=nt[d.value];const u=new i.value.eth.Contract(R,T[d.value]);v.value=await u.methods.maxBonusRate().call({from:c.value});const C=await u.methods.nftById(e.value.nftId).call(),S={...e,...C};e.value=S}function N(u){h.value=u}function y(u){p.value=u.target.value}async function I(){if(m.value=!0,l.value=!0,a.value.token&&a.value.tokenId&&a.value.payToken&&a.value.payAmount&&a.value.agreenTerms){a.value.isBid=h.value;const u=new i.value.eth.Contract(at,e.value.token);await u.methods.isApprovedForAll(c.value,T[d.value]).call()||await u.methods.setApprovalForAll(T[d.value],!0).send({from:c.value}),new i.value.eth.Contract(R,T[d.value]).methods.list(a.value.token,a.value.tokenId,a.value.isBid,a.value.payToken,i.value.utils.toWei(a.value.payAmount.toString(),"ether"),a.value.bonusRate,a.value.endTime).send({from:c.value}).then(()=>{l.value=!1,o.value=Date.parse(new Date().toString()),document.getElementById("closeModalNftList").click()}).catch($=>{console.info($),l.value=!1})}else l.value=!1}O(()=>{B()});const w={nftInfo:e,props:f,loading:l,isSubmit:m,timestamp:o,account:c,library:i,chainId:d,formModel:a,isBid:h,currentBonusRate:p,maxBonusRate:v,getBaseInfo:B,changeBid:N,changeBonus:y,nftList:I};return Object.defineProperty(w,"__isScriptSetup",{enumerable:!1,value:!0}),w}}),rt={style:{display:"inline-block"}},ft=["disabled"],_t={class:"modal fade",id:"modalNftList",tabindex:"-1","aria-labelledby":"modalNftListLabel","aria-hidden":"true"},ut={class:"modal-dialog modal-lg modal-dialog-centered"},mt={class:"modal-content"},vt=t("div",{class:"modal-header"},[t("h5",{class:"modal-title",id:"modalNftListLabel"},"NFT List"),t("button",{id:"closeModalNftList",type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),ht={class:"modal-body"},pt={class:"row g-5"},bt={class:"col"},kt={class:"my-4"},yt=t("label",{for:"token",class:"form-label"},"Token",-1),It=t("div",{class:"invalid-feedback"}," You must input token ",-1),gt={class:"my-4"},xt=t("label",{for:"tokenId",class:"form-label"},"TokenId",-1),Tt=t("div",{class:"invalid-feedback"}," You must input tokenId ",-1),Bt={class:"my-4"},wt=t("label",{for:"payToken",class:"form-label"},"PayToken",-1),Lt=t("div",{class:"invalid-feedback"}," You must input payToken ",-1),At={class:"my-4"},Mt=t("label",{for:"payAmount",class:"form-label"},"PayAmount",-1),Nt=t("div",{class:"invalid-feedback"}," You must input payAmount ",-1),Ct={class:"my-4"},St=t("label",{for:"isBid",class:"form-label"},"Bid",-1),Rt={class:"form-check form-check-inline"},Vt=["checked"],Dt=t("label",{class:"form-check-label",for:"bidLimited"},"Limited",-1),Ft={class:"form-check form-check-inline"},qt=["checked"],Ut=t("label",{class:"form-check-label",for:"bidAuction"},"Auction",-1),Pt={key:0,class:"my-4"},Ot={for:"bonusRate",class:"form-label"},jt=["max","required"],Et={key:1,class:"my-4"},Yt=t("label",{for:"endTime",class:"form-label"},"EndTime",-1),$t=["required"],Ht=t("div",{class:"invalid-feedback"}," You must input endTime ",-1),Wt={class:"form-check"},zt=t("label",{class:"form-check-label fw-lighter",for:"agreenTerms"},"I approve NFTrade's Terms & Conditions",-1),Jt=t("hr",{class:"my-4"},null,-1),Kt=["disabled"],Gt={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"};function Qt(_,n,f,e,l,m){return s(),r("div",rt,[t("button",{type:"button",class:"btn btn-primary","data-bs-toggle":"modal","data-bs-target":"#modalNftList",disabled:e.nftInfo.onSale}," List ",8,ft),t("div",_t,[t("div",ut,[t("div",mt,[vt,t("div",ht,[t("div",pt,[t("div",bt,[t("form",{class:H(`needs-validation ${e.isSubmit?"was-validated":""}`),novalidate:""},[t("div",kt,[yt,k(t("input",{type:"text",readonly:"",class:"form-control-plaintext",id:"token","onUpdate:modelValue":n[0]||(n[0]=o=>e.formModel.token=o),required:""},null,512),[[g,e.formModel.token]]),It]),t("div",gt,[xt,k(t("input",{type:"text",readonly:"",class:"form-control-plaintext",id:"tokenId","onUpdate:modelValue":n[1]||(n[1]=o=>e.formModel.tokenId=o),required:""},null,512),[[g,e.formModel.tokenId]]),Tt]),t("div",Bt,[wt,k(t("input",{type:"text",readonly:"",class:"form-control-plaintext",id:"payToken","onUpdate:modelValue":n[2]||(n[2]=o=>e.formModel.payToken=o),required:""},null,512),[[g,e.formModel.payToken]]),Lt]),t("div",At,[Mt,k(t("input",{type:"number",class:"form-control",id:"payAmount","onUpdate:modelValue":n[3]||(n[3]=o=>e.formModel.payAmount=o),required:""},null,512),[[g,e.formModel.payAmount]]),Nt]),t("div",Ct,[St,t("div",null,[t("div",Rt,[t("input",{class:"form-check-input",type:"radio",name:"isBid",id:"bidLimited",value:!1,checked:!e.isBid,onChange:n[4]||(n[4]=o=>e.changeBid(!1))},null,40,Vt),Dt]),t("div",Ft,[t("input",{class:"form-check-input",type:"radio",name:"isBid",id:"bidAuction",value:!0,checked:e.isBid,onChange:n[5]||(n[5]=o=>e.changeBid(!0))},null,40,qt),Ut])])]),e.isBid?(s(),r("div",Pt,[t("label",Ot,"Bonus Rate: "+b(e.currentBonusRate)+" %",1),k(t("input",{type:"range",class:"form-range",min:"0",max:e.maxBonusRate,step:"1",id:"bonusRate","onUpdate:modelValue":n[6]||(n[6]=o=>e.formModel.bonusRate=o),onChange:e.changeBonus,required:e.isBid},null,40,jt),[[g,e.formModel.bonusRate]])])):A("",!0),e.isBid?(s(),r("div",Et,[Yt,k(t("input",{type:"number",class:"form-control",id:"endTime","onUpdate:modelValue":n[7]||(n[7]=o=>e.formModel.endTime=o),required:e.isBid},null,8,$t),[[g,e.formModel.endTime]]),Ht])):A("",!0),t("div",Wt,[k(t("input",{type:"checkbox",class:"form-check-input",id:"agreenTerms","onUpdate:modelValue":n[8]||(n[8]=o=>e.formModel.agreenTerms=o),required:""},null,512),[[W,e.formModel.agreenTerms]]),zt]),Jt,t("button",{class:"w-100 btn btn-primary btn-lg",type:"button",disabled:e.loading,onClick:e.nftList},[e.loading?(s(),r("span",Gt)):A("",!0),M(" "+b(e.loading?"Loading...":"NFT List"),1)],8,Kt)],2)])])])])])])])}var Xt=q(ct,[["render",Qt]]);const Zt=U({__name:"list",props:{nftInfo:null},setup(_,{expose:n}){n();const f=_,e=f.nftInfo,l={props:f,nftInfo:e};return Object.defineProperty(l,"__isScriptSetup",{enumerable:!1,value:!0}),l}});function te(_,n,f,e,l,m){const o=Xt,c=z;return s(),L(c,null,{default:D(()=>[F(o,{nftInfo:e.nftInfo},null,8,["nftInfo"])]),_:1})}var ee=q(Zt,[["render",te]]);const oe=U({__name:"[token]-[tokenId]",setup(_,{expose:n}){n();const f=J(),e=f.params.token,l=f.params.tokenId,m=j(),o=E(),{$truncateAccount:c}=K(),{account:i,library:d,chainId:a}=Y();P([i,o],()=>{i.value&&v()});const h=x();async function p(){const y=new d.value.eth.Contract(R,T[a.value]),I=await y.methods.nftIdMap(e,l).call(),w=await y.methods.nftById(I).call(),u=await y.methods.collectionMap(e).call(),{data:C}=await dt(I,()=>$fetch(w.tokenURI)),S={...w,collection:u,metadata:C.value};h.value=S}function v(){!!d.value&&!!i.value&&!!a.value&&p()}function B(){!!e&&!!l&&(m.value=!0,new d.value.eth.Contract(R,T[a.value]).methods.listCancelled(e,l).send({from:i.value}).then(()=>{m.value=!1,o.value=Date.parse(new Date().toString())}).catch(I=>{console.info(I),m.value=!1}))}O(()=>{v()});const N={route:f,token:e,tokenId:l,loading:m,timestamp:o,$truncateAccount:c,account:i,library:d,chainId:a,nftInfo:h,getNftInfo:p,loadNftData:v,listCancelled:B};return Object.defineProperty(N,"__isScriptSetup",{enumerable:!1,value:!0}),N}}),V=_=>(Z("data-v-6671ea8c"),_=_(),tt(),_),ne={key:0,class:"py-5 container"},ae={class:"row py-lg-5"},se={class:"col-lg-6 col-md-12"},le={class:"ratio ratio-1x1 nft-img"},ie=["src"],de={class:"col-lg-6 col-md-12"},ce={class:"card border-0"},re={class:"card-body"},fe={class:"card-text"},_e={key:0,class:"bi bi-patch-check-fill text-primary"},ue={class:"card-body"},me={class:"card-title"},ve={class:"card-text"},he=M(" Owned by "),pe={class:"d-flex justify-content-start align-items-center"},be=["disabled"],ke={key:0,class:"spinner-border spinner-border-sm",role:"status","aria-hidden":"true"},ye=X('<div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example" data-v-6671ea8c><a href="#history" data-v-6671ea8c>History <i class="bi bi-link-45deg" data-v-6671ea8c></i></a><a class="ms-3" href="#offers" data-v-6671ea8c>Offers <i class="bi bi-link-45deg" data-v-6671ea8c></i></a><a class="ms-3" href="#listings" data-v-6671ea8c>Listings <i class="bi bi-link-45deg" data-v-6671ea8c></i></a></div>',1),Ie={class:"mb-5"},ge=V(()=>t("h4",null,"Properties",-1)),xe={class:"table table-bordered"},Te=V(()=>t("thead",null,[t("tr",null,[t("th",{scope:"col"},"Property"),t("th",{scope:"col"},"Value")])],-1)),Be={key:0},we={key:1},Le=V(()=>t("tr",{class:"text-center fw-lighter"},[t("td",{colspan:"5"},"No Data")],-1)),Ae=[Le],Me={"data-bs-spy":"scroll","data-bs-target":"#list-example","data-bs-offset":"0","data-bs-smooth-scroll":"true",class:"scrollspy-example",tabindex:"0"},Ne={class:"mb-5",id:"listings"},Ce={class:"mb-5",id:"offers"},Se={class:"mb-5",id:"history"},Re={key:1,class:"py-5 container"},Ve=V(()=>t("div",{class:"row"},[t("div",{class:"text-center"},[t("div",{class:"spinner-border",role:"status"},[t("span",{class:"visually-hidden"},"Loading...")])])],-1)),De=[Ve];function Fe(_,n,f,e,l,m){var h,p;const o=et,c=ee,i=st,d=lt,a=it;return s(),r("main",null,[(h=e.nftInfo)!=null&&h.token?(s(),r("section",ne,[t("div",ae,[t("div",se,[t("div",le,[t("img",{src:(p=e.nftInfo.metadata)==null?void 0:p.fileUrl},null,8,ie)])]),t("div",de,[t("div",ce,[t("div",re,[t("p",fe,[F(o,{to:`/account/nfts/${e.nftInfo.collection.token}`},{default:D(()=>[M(b(e.nftInfo.collection.name),1)]),_:1},8,["to"]),e.nftInfo.collection.approve?(s(),r("i",_e)):A("",!0)])]),t("div",ue,[t("h3",me,b(e.nftInfo.metadata.name),1),t("p",ve,[he,F(o,{to:`/account/${e.nftInfo.owner}`},{default:D(()=>[M(b(e.$truncateAccount(e.nftInfo.owner)),1)]),_:1},8,["to"])]),t("div",pe,[(s(),L(c,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"])),t("button",{class:"btn btn-danger ms-3",type:"button",disabled:!e.nftInfo.onSale||e.loading,onClick:e.listCancelled},[e.loading?(s(),r("span",ke)):A("",!0),M(" "+b(e.loading?"Loading...":"List Cancelled"),1)],8,be)])])])])]),ye,t("div",Ie,[ge,t("table",xe,[Te,e.nftInfo.metadata.properties.length>0?(s(),r("tbody",Be,[(s(!0),r(G,null,Q(e.nftInfo.metadata.properties,v=>(s(),r("tr",{key:v.property},[t("th",null,b(v.property),1),t("td",null,b(v.value),1)]))),128))])):(s(),r("tbody",we,Ae))])]),t("div",Me,[t("div",Ne,[(s(),L(i,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))]),t("div",Ce,[(s(),L(d,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))]),t("div",Se,[(s(),L(a,{nftInfo:e.nftInfo,key:e.timestamp},null,8,["nftInfo"]))])])])):(s(),r("section",Re,De))])}var $e=q(oe,[["render",Fe],["__scopeId","data-v-6671ea8c"]]);export{$e as default};
