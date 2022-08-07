import { u as useLoading, a as useWeb3, M as MarketABI, b as MarketContractAddress, _ as __nuxt_component_0$2, c as _sfc_main$s } from './server.mjs';
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
  __name: "manage",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = useLoading();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, library], () => {
      if (!!library.value && !!account.value && !!chainId.value) {
        getCollectionRole();
      }
    });
    const CollectionIsAdmin = vue_cjs_prod.ref(false);
    const CollectionIsManage = vue_cjs_prod.ref(false);
    async function getCollectionRole() {
      loading.value = true;
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      const CollectionRoleAdmin = await contract.methods.DEFAULT_ADMIN_ROLE().call();
      const CollectionRoleManage = await contract.methods.MANAGER_ROLE().call();
      CollectionIsAdmin.value = await contract.methods.hasRole(CollectionRoleAdmin, account.value).call();
      CollectionIsManage.value = await contract.methods.hasRole(CollectionRoleManage, account.value).call();
      loading.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ManageCollection = __nuxt_component_0$2;
      const _component_ManageStaff = _sfc_main$s;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      if (CollectionIsManage.value) {
        _push(`<div class="container py-5"><ul class="nav nav-tabs" id="manageTab" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link active" id="collection-tab" data-bs-toggle="tab" data-bs-target="#collection-tab-pane" type="button" role="tab" aria-controls="collection-tab-pane" aria-selected="true"> Collection Manage </button></li>`);
        if (CollectionIsAdmin.value) {
          _push(`<li class="nav-item" role="presentation"><button class="nav-link" id="staff-tab" data-bs-toggle="tab" data-bs-target="#staff-tab-pane" type="button" role="tab" aria-controls="staff-tab-pane" aria-selected="false"> Market Manage </button></li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</ul><div class="tab-content" id="manageTabContent"><div class="tab-pane fade show active" id="collection-tab-pane" role="tabpanel" aria-labelledby="collection-tab" tabindex="0">`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_ManageCollection, null, null, _parent));
        _push(`</div>`);
        if (CollectionIsAdmin.value) {
          _push(`<div class="tab-pane fade" id="staff-tab-pane" role="tabpanel" aria-labelledby="staff-tab" tabindex="0">`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_ManageStaff, null, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<div class="container py-5"><h1>No permission</h1></div>`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/manage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=manage.cd285785.mjs.map
