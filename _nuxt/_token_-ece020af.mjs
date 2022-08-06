import{_ as L,d as M,L as B,u as V,w as F,b as j,r as D,e as R,o as n,c as a,a as t,t as l,n as I,g,F as T,f as U,i as r,j as _,p as z,k as E,l as O,h as P}from"./entry-f37e1690.mjs";import{u as W}from"./asyncData-3edde299.mjs";import{u as q}from"./useWeb3-0193a35d.mjs";import{M as G,a as H}from"./Market_abi-93ee176c.mjs";const J=M({__name:"[token]",setup(d,{expose:u}){u();const b=B(),o=b.params.token,{$clip:y,$compare:v}=V(),{account:e,library:s,chainId:c}=q();F([e],()=>{e.value&&x()});function C(i,p){y(i,p)}const A=j(),k=D([]);function x(){const i=new s.value.eth.Contract(G,H[c.value]);i.methods.getCurrentNFTId().call({from:e.value}).then(async p=>{if(p>0){for(let f=1;f<=p;f++){const h=await i.methods.nftById(f).call();if(h.token===o){const N=await i.methods.collectionMap(h.token).call(),{data:S}=await W(f.toString(),()=>$fetch(h.tokenURI)),$={...h,collection:N,metadata:S.value};k.value.push($)}}k.value.sort(v("nftId"))}})}R(()=>{!!s.value&&!!e.value&&!!c.value&&x()});const w={route:b,collectionAddress:o,$clip:y,$compare:v,account:e,library:s,chainId:c,copyAddress:C,isCopy:A,nftsList:k,getNftsList:x};return Object.defineProperty(w,"__isScriptSetup",{enumerable:!1,value:!0}),w}}),m=d=>(z("data-v-cef56a70"),d=d(),E(),d),K={class:"py-5 text-center container"},Q={class:"row py-lg-5"},X={class:"col-lg-6 col-md-8 mx-auto"},Y=m(()=>t("h1",{class:"fw-light"},"My Collection",-1)),Z={class:"lead text-muted text-truncate"},tt={class:"album py-5 bg-light"},st={key:0,class:"container"},ot={class:"row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"},et={class:"card shadow-sm"},ct={class:"card-body"},nt={class:"card-text"},at={key:0,class:"bi bi-patch-check-fill text-primary"},lt=["src"],dt={class:"card-body"},it={class:"card-text"},rt={class:"d-flex justify-content-between align-items-center"},_t={class:"btn-group"},ut=m(()=>t("button",{type:"button",class:"btn btn-sm btn-outline-primary"},"View",-1)),pt={class:"text-muted"},ft={key:1,class:"container"},ht={class:"row py-lg-5"},mt={class:"col-lg-6 col-md-8 mx-auto"},bt=m(()=>t("p",{class:"lead text-muted"},"No NFTs to show here..",-1)),yt=m(()=>t("button",{type:"button",class:"btn btn-primary"}," Create ",-1));function vt(d,u,b,o,y,v){const e=O;return n(),a("main",null,[t("section",K,[t("div",Q,[t("div",X,[Y,t("p",Z,l(o.collectionAddress),1),t("p",null,[t("button",{class:I(`btn my-2 ${o.isCopy?"btn-success":"btn-primary"}`),onClick:u[0]||(u[0]=s=>o.copyAddress(o.collectionAddress,s))},[t("i",{class:I(`bi ${o.isCopy?"bi-clipboard2-check":"bi-clipboard2"}`)},null,2),g(" "+l(o.isCopy?"Cope Success":"Cope Address"),1)],2)])])])]),t("div",tt,[o.nftsList.length>0?(n(),a("div",st,[t("div",ot,[(n(!0),a(T,null,U(o.nftsList,s=>(n(),a("div",{class:"col",key:s.nftId},[t("div",et,[t("div",ct,[t("p",nt,[r(e,{to:`/account/nfts/${s.collection.token}`},{default:_(()=>[g(l(s.collection.name),1)]),_:2},1032,["to"]),s.collection.approve?(n(),a("i",at)):P("",!0)])]),r(e,{to:`/account/nfts/${s.token}-${s.tokenId}`,class:"ratio ratio-1x1 nft-img"},{default:_(()=>{var c;return[t("img",{src:(c=s.metadata)==null?void 0:c.fileUrl},null,8,lt)]}),_:2},1032,["to"]),t("div",dt,[t("p",it,[r(e,{to:`/account/nfts/${s.token}-${s.tokenId}`},{default:_(()=>[g(l(s.collection.symbol)+" - "+l(s.tokenId),1)]),_:2},1032,["to"])]),t("div",rt,[t("div",_t,[r(e,{to:`/account/nfts/${s.token}-${s.tokenId}`},{default:_(()=>[ut]),_:2},1032,["to"])]),t("small",pt,"ID: "+l(s.nftId),1)])])])]))),128))])])):(n(),a("div",ft,[t("div",ht,[t("div",mt,[bt,t("p",null,[r(e,{to:"/create"},{default:_(()=>[yt]),_:1})])])])]))])])}var It=L(J,[["render",vt],["__scopeId","data-v-cef56a70"]]);export{It as default};
