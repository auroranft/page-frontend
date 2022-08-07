import { d as _export_sfc, e as useRoute, g as useNuxtApp, a as useWeb3, n as useClipResult, M as MarketABI, b as MarketContractAddress, h as useAsyncData, i as __nuxt_component_0$3 } from './server.mjs';
import { v as vue_cjs_prod, s as serverRenderer } from '../handlers/renderer.mjs';
import 'ufo';
import '@instadapp/vue-web3';
import 'jsbi/dist/jsbi-umd.js';
import 'ipfs-http-client';
import 'clipboard';
import '../nitro/node-server.mjs';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
import 'h3';
import 'ohmyfetch';
import 'radix3';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'ohash';
import 'unstorage';
import 'fs';
import 'pathe';
import 'url';
import 'unenv/runtime/mock/proxy';
import 'stream';

const _sfc_main = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "[token]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const collectionAddress = route.params.token;
    const { $clip, $compare } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account], () => {
      if (!!account.value) {
        getNftsList();
      }
    });
    const isCopy = useClipResult();
    const nftsList = vue_cjs_prod.ref([]);
    function getNftsList() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.methods.getCurrentNFTId().call({ from: account.value }).then(async (value) => {
        if (value > 0) {
          for (let index = 1; index <= value; index++) {
            const item = await contract.methods.nftById(index).call();
            if (item.token === collectionAddress) {
              const collection = await contract.methods.collectionMap(item.token).call();
              const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$uPWu9TTvGL");
              const tempItem = {
                ...item,
                ...{ collection, metadata: data.value }
              };
              nftsList.value.push(tempItem);
            }
          }
          nftsList.value.sort($compare("nftId"));
        }
      });
    }
    vue_cjs_prod.onMounted(() => {
      if (!!library.value && !!account.value && !!chainId.value) {
        getNftsList();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-cef56a70><section class="py-5 text-center container" data-v-cef56a70><div class="row py-lg-5" data-v-cef56a70><div class="col-lg-6 col-md-8 mx-auto" data-v-cef56a70><h1 class="fw-light" data-v-cef56a70>My Collection</h1><p class="lead text-muted text-truncate" data-v-cef56a70>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(collectionAddress))}</p><p data-v-cef56a70><button class="${serverRenderer.exports.ssrRenderClass(`btn my-2 ${vue_cjs_prod.unref(isCopy) ? "btn-success" : "btn-primary"}`)}" data-v-cef56a70><i class="${serverRenderer.exports.ssrRenderClass(`bi ${vue_cjs_prod.unref(isCopy) ? "bi-clipboard2-check" : "bi-clipboard2"}`)}" data-v-cef56a70></i> ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(isCopy) ? "Cope Success" : "Cope Address")}</button></p></div></div></section><div class="album py-5 bg-light" data-v-cef56a70>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-cef56a70><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-cef56a70><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-cef56a70><div class="card shadow-sm" data-v-cef56a70><div class="card-body" data-v-cef56a70><p class="card-text" data-v-cef56a70>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/account/nfts/${item.collection.token}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer.exports.ssrInterpolate(item.collection.name)}`);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.collection.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (item.collection.approve) {
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-cef56a70></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/account/nfts/${item.token}-${item.tokenId}`,
            class: "ratio ratio-1x1 nft-img"
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-cef56a70${_scopeId}>`);
              } else {
                return [
                  vue_cjs_prod.createVNode("img", {
                    src: (_b = item.metadata) == null ? void 0 : _b.fileUrl
                  }, null, 8, ["src"])
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`<div class="card-body" data-v-cef56a70><p class="card-text" data-v-cef56a70>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/account/nfts/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer.exports.ssrInterpolate(item.collection.symbol)} - ${serverRenderer.exports.ssrInterpolate(item.tokenId)}`);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(item.collection.symbol) + " - " + vue_cjs_prod.toDisplayString(item.tokenId), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-cef56a70><div class="btn-group" data-v-cef56a70>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/account/nfts/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-cef56a70${_scopeId}>View</button>`);
              } else {
                return [
                  vue_cjs_prod.createVNode("button", {
                    type: "button",
                    class: "btn btn-sm btn-outline-primary"
                  }, "View")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div><small class="text-muted" data-v-cef56a70>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-cef56a70><div class="row py-lg-5" data-v-cef56a70><div class="col-lg-6 col-md-8 mx-auto" data-v-cef56a70><p class="lead text-muted" data-v-cef56a70>No NFTs to show here..</p><p data-v-cef56a70>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-cef56a70${_scopeId}> Create </button>`);
            } else {
              return [
                vue_cjs_prod.createVNode("button", {
                  type: "button",
                  class: "btn btn-primary"
                }, " Create ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p></div></div></div>`);
      }
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/nfts/[token].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _token_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cef56a70"]]);

export { _token_ as default };
//# sourceMappingURL=_token_.1816d52b.mjs.map
