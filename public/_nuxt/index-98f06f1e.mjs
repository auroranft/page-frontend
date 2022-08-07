import{_ as w,d as g,u as I,w as N,b as $,r as M,e as C,o as e,c as o,a as s,F as S,f as V,j as n,k as l,M as B,l as F,g as k,t as u,h as A,p as L,m as T}from"./entry-58e7afa6.mjs";import{u as D}from"./asyncData-5962a627.mjs";import{u as j}from"./useWeb3-5d18194c.mjs";import{M as O,a as R}from"./Market_abi-93ee176c.mjs";const h=d=>(L("data-v-8da4f852"),d=d(),T(),d),U=B('<section class="py-5 text-center container" data-v-8da4f852><div class="row py-lg-5" data-v-8da4f852><div class="col-lg-6 col-md-8 mx-auto" data-v-8da4f852><h1 class="fw-light" data-v-8da4f852>NFT Marketplace</h1><p class="lead text-muted" data-v-8da4f852>MarketplaceMarketplaceMarketplace</p></div></div></section>',1),W={class:"album py-5 bg-light"},E={key:0,class:"container"},J={class:"row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4"},P={class:"card shadow-sm"},q={class:"card-body"},z={class:"card-text"},G={key:0,class:"bi bi-patch-check-fill text-primary"},H=["src"],K={class:"card-body"},Q={class:"card-text"},X={class:"d-flex justify-content-between align-items-center"},Y={class:"btn-group"},Z=h(()=>s("button",{type:"button",class:"btn btn-sm btn-outline-primary"},"View",-1)),tt={class:"text-muted"},st={key:1,class:"container"},at={class:"row py-lg-5"},et={class:"col-lg-6 col-md-8 mx-auto"},ot=h(()=>s("p",{class:"lead text-muted"},"No NFTs to show here..",-1)),ct=h(()=>s("button",{type:"button",class:"btn btn-primary"}," Create ",-1)),nt=g({__name:"index",setup(d){const{$clip:lt,$compare:y}=I(),{account:i,library:f,chainId:m}=j();N([i],()=>{i.value&&v()}),$();const r=M([]);function v(){const _=new f.value.eth.Contract(O,R[m.value]);_.methods.getCurrentNFTId().call({from:i.value}).then(async p=>{if(p>0){for(let a=1;a<=p;a++){const t=await _.methods.nftById(a).call();if(t.onSale){const c=await _.methods.collectionMap(t.token).call();if(c.show){const{data:x}=await D(a.toString(),()=>$fetch(t.tokenURI),"$Wy8P0OlVOJ"),b={...t,collection:c,metadata:x.value};r.value.push(b)}}}r.value.sort(y("nftId"))}})}return C(()=>{!!f.value&&!!i.value&&!!m.value&&v()}),(_,p)=>{const a=F;return e(),o("main",null,[U,s("div",W,[r.value.length>0?(e(),o("div",E,[s("div",J,[(e(!0),o(S,null,V(r.value,t=>(e(),o("div",{class:"col",key:t.nftId},[s("div",P,[s("div",q,[s("p",z,[n(a,{to:`/assets/${t.collection.token}`},{default:l(()=>[k(u(t.collection.name),1)]),_:2},1032,["to"]),t.collection.approve?(e(),o("i",G)):A("",!0)])]),n(a,{to:`/assets/${t.token}-${t.tokenId}`,class:"ratio ratio-1x1 nft-img"},{default:l(()=>{var c;return[s("img",{src:(c=t.metadata)==null?void 0:c.fileUrl},null,8,H)]}),_:2},1032,["to"]),s("div",K,[s("p",Q,[n(a,{to:`/assets/${t.token}-${t.tokenId}`},{default:l(()=>[k(u(t.collection.symbol)+" - "+u(t.tokenId),1)]),_:2},1032,["to"])]),s("div",X,[s("div",Y,[n(a,{to:`/assets/${t.token}-${t.tokenId}`},{default:l(()=>[Z]),_:2},1032,["to"])]),s("small",tt,"ID: "+u(t.nftId),1)])])])]))),128))])])):(e(),o("div",st,[s("div",at,[s("div",et,[ot,s("p",null,[n(a,{to:"/create"},{default:l(()=>[ct]),_:1})])])])]))])])}}});var ut=w(nt,[["__scopeId","data-v-8da4f852"]]);export{ut as default};
