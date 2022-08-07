import{_ as A,d as S,L as M,u as B,w as F,b as L,r as V,e as j,o as c,c as n,a as t,t as l,i as d,n as w,g as v,F as D,f as R,j as i,k as r,l as T,h as U,p as z,m as E}from"./entry-58e7afa6.mjs";import{u as H}from"./asyncData-5962a627.mjs";import{u as W}from"./useWeb3-5d18194c.mjs";import{M as q,a as G}from"./Market_abi-93ee176c.mjs";const f=u=>(z("data-v-cef56a70"),u=u(),E(),u),J={class:"py-5 text-center container"},K={class:"row py-lg-5"},O={class:"col-lg-6 col-md-8 mx-auto"},P=f(()=>t("h1",{class:"fw-light"},"My Collection",-1)),Q={class:"lead text-muted text-truncate"},X={class:"album py-5 bg-light"},Y={key:0,class:"container"},Z={class:"row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"},tt={class:"card shadow-sm"},st={class:"card-body"},ot={class:"card-text"},et={key:0,class:"bi bi-patch-check-fill text-primary"},at=["src"],ct={class:"card-body"},nt={class:"card-text"},lt={class:"d-flex justify-content-between align-items-center"},dt={class:"btn-group"},it=f(()=>t("button",{type:"button",class:"btn btn-sm btn-outline-primary"},"View",-1)),rt={class:"text-muted"},ut={key:1,class:"container"},_t={class:"row py-lg-5"},pt={class:"col-lg-6 col-md-8 mx-auto"},ht=f(()=>t("p",{class:"lead text-muted"},"No NFTs to show here..",-1)),ft=f(()=>t("button",{type:"button",class:"btn btn-primary"}," Create ",-1)),mt=S({__name:"[token]",setup(u){const m=M().params.token,{$clip:g,$compare:I}=B(),{account:_,library:k,chainId:y}=W();F([_],()=>{_.value&&x()});function C(a,e){g(a,e)}const b=L(),p=V([]);function x(){const a=new k.value.eth.Contract(q,G[y.value]);a.methods.getCurrentNFTId().call({from:_.value}).then(async e=>{if(e>0){for(let o=1;o<=e;o++){const s=await a.methods.nftById(o).call();if(s.token===m){const h=await a.methods.collectionMap(s.token).call(),{data:$}=await H(o.toString(),()=>$fetch(s.tokenURI),"$tHSkvwoFjp"),N={...s,collection:h,metadata:$.value};p.value.push(N)}}p.value.sort(I("nftId"))}})}return j(()=>{!!k.value&&!!_.value&&!!y.value&&x()}),(a,e)=>{const o=T;return c(),n("main",null,[t("section",J,[t("div",K,[t("div",O,[P,t("p",Q,l(d(m)),1),t("p",null,[t("button",{class:w(`btn my-2 ${d(b)?"btn-success":"btn-primary"}`),onClick:e[0]||(e[0]=s=>C(d(m),s))},[t("i",{class:w(`bi ${d(b)?"bi-clipboard2-check":"bi-clipboard2"}`)},null,2),v(" "+l(d(b)?"Cope Success":"Cope Address"),1)],2)])])])]),t("div",X,[p.value.length>0?(c(),n("div",Y,[t("div",Z,[(c(!0),n(D,null,R(p.value,s=>(c(),n("div",{class:"col",key:s.nftId},[t("div",tt,[t("div",st,[t("p",ot,[i(o,{to:`/account/nfts/${s.collection.token}`},{default:r(()=>[v(l(s.collection.name),1)]),_:2},1032,["to"]),s.collection.approve?(c(),n("i",et)):U("",!0)])]),i(o,{to:`/account/nfts/${s.token}-${s.tokenId}`,class:"ratio ratio-1x1 nft-img"},{default:r(()=>{var h;return[t("img",{src:(h=s.metadata)==null?void 0:h.fileUrl},null,8,at)]}),_:2},1032,["to"]),t("div",ct,[t("p",nt,[i(o,{to:`/account/nfts/${s.token}-${s.tokenId}`},{default:r(()=>[v(l(s.collection.symbol)+" - "+l(s.tokenId),1)]),_:2},1032,["to"])]),t("div",lt,[t("div",dt,[i(o,{to:`/account/nfts/${s.token}-${s.tokenId}`},{default:r(()=>[it]),_:2},1032,["to"])]),t("small",rt,"ID: "+l(s.nftId),1)])])])]))),128))])])):(c(),n("div",ut,[t("div",_t,[t("div",pt,[ht,t("p",null,[i(o,{to:"/create"},{default:r(()=>[ft]),_:1})])])])]))])])}}});var wt=A(mt,[["__scopeId","data-v-cef56a70"]]);export{wt as default};