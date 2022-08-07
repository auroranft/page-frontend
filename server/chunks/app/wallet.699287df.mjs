import { D as DAO, U as USDT, o as DST, p as _sfc_main$i, q as _sfc_main$h, r as _sfc_main$g } from './server.mjs';
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
  __name: "wallet",
  __ssrInlineRender: true,
  setup(__props) {
    const tokenList = [DAO, USDT, DST];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Web3Account = _sfc_main$i;
      const _component_Web3Balance = _sfc_main$h;
      const _component_Web3TokenBalance = _sfc_main$g;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="container py-5"><div class="card"><h4 class="card-header"><i class="bi bi-wallet-fill"></i> Wallet Info </h4><div class="card-body"><p class="card-text">Account Address: `);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Web3Account, null, null, _parent));
      _push(`</p><p class="card-text">Account Balance: `);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Web3Balance, null, null, _parent));
      _push(`</p></div></div><hr class="my-4"><div class="card"><h4 class="card-header"><i class="bi bi-list-task"></i> Token List </h4><div class="card-body"><!--[-->`);
      serverRenderer.exports.ssrRenderList(tokenList, (token, index) => {
        _push(serverRenderer.exports.ssrRenderComponent(_component_Web3TokenBalance, {
          key: index,
          tokenAddress: token
        }, null, _parent));
      });
      _push(`<!--]--></div></div></div></main>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/wallet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=wallet.699287df.mjs.map
