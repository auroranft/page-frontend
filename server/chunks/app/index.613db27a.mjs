import { d as _export_sfc, g as useNuxtApp, a as useWeb3, n as useClipResult, M as MarketABI, b as MarketContractAddress, h as useAsyncData, i as __nuxt_component_0$3 } from './server.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { $clip, $compare } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account], () => {
      if (!!account.value) {
        getNftsList();
      }
    });
    useClipResult();
    const nftsList = vue_cjs_prod.ref([]);
    function getNftsList() {
      nftsList.value = [];
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.methods.getSaleNFTList(true, false).call({ from: account.value }).then(async (value) => {
        if (value.length > 0) {
          const getResult = value.map(async (item, index2) => {
            const { data } = await useAsyncData(index2.toString(), () => $fetch(item.tokenURI), "$nrD5bEV4VZ");
            const tempItem = {
              ...item,
              ...{ metadata: data.value }
            };
            nftsList.value.push(tempItem);
          });
          await Promise.all(getResult);
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
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-3660c18c><section class="py-5 text-center container" data-v-3660c18c><div class="row py-lg-5" data-v-3660c18c><div class="col-lg-6 col-md-8 mx-auto" data-v-3660c18c><h1 class="fw-light" data-v-3660c18c>Limited NFTs</h1><p class="lead text-muted" data-v-3660c18c>Limited</p><p data-v-3660c18c><a href="/account/nfts" class="btn btn-primary my-2" data-v-3660c18c>My Nfts</a></p></div></div></section><div class="album py-5 bg-light" data-v-3660c18c>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-3660c18c><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-3660c18c><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-3660c18c><div class="card shadow-sm" data-v-3660c18c><div class="card-body" data-v-3660c18c><p class="card-text" data-v-3660c18c>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.collection.token}`
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
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-3660c18c></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</p></div>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`,
            class: "ratio ratio-1x1 nft-img"
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-3660c18c${_scopeId}>`);
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
          _push(`<div class="card-body" data-v-3660c18c><p class="card-text" data-v-3660c18c>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`
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
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-3660c18c><div class="btn-group" data-v-3660c18c>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-3660c18c${_scopeId}>View</button>`);
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
          _push(`</div><small class="text-muted" data-v-3660c18c>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-3660c18c><div class="row py-lg-5" data-v-3660c18c><div class="col-lg-6 col-md-8 mx-auto" data-v-3660c18c><p class="lead text-muted" data-v-3660c18c>No NFTs to show here..</p><p data-v-3660c18c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-3660c18c${_scopeId}> Create </button>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/limited/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-3660c18c"]]);

export { index as default };
//# sourceMappingURL=index.613db27a.mjs.map
