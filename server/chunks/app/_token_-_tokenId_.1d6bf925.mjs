import { d as _export_sfc, f as useTimestamp, e as useRoute, g as useNuxtApp, a as useWeb3, M as MarketABI, b as MarketContractAddress, h as useAsyncData, i as __nuxt_component_0$3, s as _sfc_main$c, k as _sfc_main$o, l as _sfc_main$n, m as _sfc_main$m } from './server.mjs';
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
  __name: "[token]-[tokenId]",
  __ssrInlineRender: true,
  setup(__props) {
    const timestamp = useTimestamp();
    const route = useRoute();
    const token = route.params.token;
    const tokenId = route.params.tokenId;
    const { $truncateAccount } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, timestamp], () => {
      if (!!account.value) {
        loadNftData();
      }
    });
    const nftInfo = vue_cjs_prod.ref();
    async function getNftInfo() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      const nftId = await contract.methods.nftIdMap(token, tokenId).call();
      const value = await contract.methods.nftById(nftId).call();
      const collection = await contract.methods.collectionMap(token).call();
      const { data } = await useAsyncData(nftId, () => $fetch(value.tokenURI), "$dovNqb6iGz");
      const tempItem = {
        ...value,
        ...{ collection, metadata: data.value }
      };
      nftInfo.value = tempItem;
    }
    function loadNftData() {
      if (!!library.value && !!account.value && !!chainId.value) {
        getNftInfo();
      }
    }
    vue_cjs_prod.onMounted(() => {
      loadNftData();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0$3;
      const _component_NftAssets = _sfc_main$c;
      const _component_NftPaymentList = _sfc_main$o;
      const _component_NftOfferList = _sfc_main$n;
      const _component_NftHistoryList = _sfc_main$m;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-6d104b92>`);
      if ((_a = nftInfo.value) == null ? void 0 : _a.token) {
        _push(`<section class="py-5 container" data-v-6d104b92><div class="row py-lg-5" data-v-6d104b92><div class="col-lg-6 col-md-12" data-v-6d104b92><div class="ratio ratio-1x1 nft-img" data-v-6d104b92><img${serverRenderer.exports.ssrRenderAttr("src", (_b = nftInfo.value.metadata) == null ? void 0 : _b.fileUrl)} data-v-6d104b92></div></div><div class="col-lg-6 col-md-12" data-v-6d104b92><div class="card border-0" data-v-6d104b92><div class="card-body" data-v-6d104b92><p class="card-text" data-v-6d104b92>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
          to: `/account/nfts/${nftInfo.value.collection.token}`
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(nftInfo.value.collection.name)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(nftInfo.value.collection.name), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (nftInfo.value.collection.approve) {
          _push(`<i class="bi bi-patch-check-fill text-primary" data-v-6d104b92></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div><div class="card-body" data-v-6d104b92><h3 class="card-title" data-v-6d104b92>${serverRenderer.exports.ssrInterpolate(nftInfo.value.metadata.name)}</h3><p class="card-text" data-v-6d104b92> Owned by `);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
          to: `/account/${nftInfo.value.owner}`
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref($truncateAccount)(nftInfo.value.owner))}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(vue_cjs_prod.unref($truncateAccount)(nftInfo.value.owner)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p><div class="d-flex justify-content-start align-items-center" data-v-6d104b92>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftAssets, { nftInfo: nftInfo.value }, null, _parent));
        _push(`</div></div></div></div></div><div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example" data-v-6d104b92><a href="#history" data-v-6d104b92>History <i class="bi bi-link-45deg" data-v-6d104b92></i></a><a class="ms-3" href="#offers" data-v-6d104b92>Offers <i class="bi bi-link-45deg" data-v-6d104b92></i></a><a class="ms-3" href="#listings" data-v-6d104b92>Listings <i class="bi bi-link-45deg" data-v-6d104b92></i></a></div><div class="mb-5" data-v-6d104b92><h4 data-v-6d104b92>Properties</h4><table class="table table-bordered" data-v-6d104b92><thead data-v-6d104b92><tr data-v-6d104b92><th scope="col" data-v-6d104b92>Property</th><th scope="col" data-v-6d104b92>Value</th></tr></thead>`);
        if (nftInfo.value.metadata.properties.length > 0) {
          _push(`<tbody data-v-6d104b92><!--[-->`);
          serverRenderer.exports.ssrRenderList(nftInfo.value.metadata.properties, (property) => {
            _push(`<tr data-v-6d104b92><th data-v-6d104b92>${serverRenderer.exports.ssrInterpolate(property.property)}</th><td data-v-6d104b92>${serverRenderer.exports.ssrInterpolate(property.value)}</td></tr>`);
          });
          _push(`<!--]--></tbody>`);
        } else {
          _push(`<tbody data-v-6d104b92><tr class="text-center fw-lighter" data-v-6d104b92><td colspan="5" data-v-6d104b92>No Data</td></tr></tbody>`);
        }
        _push(`</table></div><div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-offset="0" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0" data-v-6d104b92><div class="mb-5" id="listings" data-v-6d104b92>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftPaymentList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div><div class="mb-5" id="offers" data-v-6d104b92>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftOfferList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div><div class="mb-5" id="history" data-v-6d104b92>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftHistoryList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<section class="py-5 container" data-v-6d104b92><div class="row" data-v-6d104b92><div class="text-center" data-v-6d104b92><div class="spinner-border" role="status" data-v-6d104b92><span class="visually-hidden" data-v-6d104b92>Loading...</span></div></div></div></section>`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assets/[token]-[tokenId].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _token___tokenId_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6d104b92"]]);

export { _token___tokenId_ as default };
//# sourceMappingURL=_token_-_tokenId_.1d6bf925.mjs.map
