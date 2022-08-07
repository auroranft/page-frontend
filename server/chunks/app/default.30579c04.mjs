import { A as ALL_SUPPORTED_CHAIN_IDS, d as _export_sfc, e as useRoute, w as _imports_0$1, a as useWeb3, y as useHead, x as _sfc_main$7 } from './server.mjs';
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { WalletConnectConnector, UserRejectedRequestError as UserRejectedRequestError$1 } from '@web3-react/walletconnect-connector';
import { setWeb3LibraryCallback, UnsupportedChainIdError } from '@instadapp/vue-web3';
import Web3 from 'web3';
import { v as vue_cjs_prod, s as serverRenderer } from '../handlers/renderer.mjs';
import 'ufo';
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

const _sfc_main$3 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navList = [
      {
        id: 1,
        name: "Marketplace",
        url: "marketplace"
      },
      {
        id: 4,
        name: "Create",
        url: "create"
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Web3ConnectBtn = _sfc_main$7;
      _push(`<header${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "p-3 mb-3 border-bottom navbar-expand-lg navbar-dark bg-dark fixed-top" }, _attrs))} data-v-ae829c14><div class="container-fluid" data-v-ae829c14><div class="d-flex flex-wrap align-items-center justify-content-between" data-v-ae829c14><div class="d-flex flex-wrap align-items-center justify-content-lg-start justify-content-between" data-v-ae829c14><a href="/" class="d-flex align-items-center mb-2 mb-lg-0 text-light text-decoration-none" data-v-ae829c14><img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} alt="nft" width="40" height="40" data-v-ae829c14></a><button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-v-ae829c14><span class="navbar-toggler-icon" data-v-ae829c14></span></button><div class="collapse navbar-collapse" id="navbarSupportedContent" data-v-ae829c14><ul class="nav col-12 col-lg-auto me-lg-auto mb-2 mb-md-0" data-v-ae829c14><!--[-->`);
      serverRenderer.exports.ssrRenderList(navList, (item) => {
        _push(`<li data-v-ae829c14><a${serverRenderer.exports.ssrRenderAttr("href", `/${item.url}`)} class="${serverRenderer.exports.ssrRenderClass(`nav-link px-2 link-light ${item.url === vue_cjs_prod.unref(route).name ? "active" : ""}`)}" data-v-ae829c14>${serverRenderer.exports.ssrInterpolate(item.name)}</a></li>`);
      });
      _push(`<!--]--></ul></div></div>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Web3ConnectBtn, null, null, _parent));
      _push(`</div></div></header>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-ae829c14"]]);
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<footer${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "container-fluid bg-dark text-light" }, _attrs))} data-v-061fb56d><div class="row" data-v-061fb56d><div class="col" data-v-061fb56d><div class="container" data-v-061fb56d><div class="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5" data-v-061fb56d><div class="col mb-3" data-v-061fb56d><a href="/" class="d-flex align-items-center mb-3 link-light text-decoration-none" data-v-061fb56d><img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} alt="nft" width="40" height="40" data-v-061fb56d></a><p class="text-light" data-v-061fb56d>NFTrade is the first cross-chain and blockchain-agnostic NFT platform. We are an aggregator of all NFT marketplaces and host the complete NFT lifecycle, allowing anyone to seamlessly create, buy, sell, swap, farm, and leverage NFTs across different blockchains.</p></div><div class="col mb-3" data-v-061fb56d></div><div class="col mb-3" data-v-061fb56d><h5 data-v-061fb56d>Section</h5><ul class="nav flex-column" data-v-061fb56d><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Home</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Features</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Pricing</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>FAQs</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>About</a></li></ul></div><div class="col mb-3" data-v-061fb56d><h5 data-v-061fb56d>Section</h5><ul class="nav flex-column" data-v-061fb56d><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Home</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Features</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Pricing</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>FAQs</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>About</a></li></ul></div><div class="col mb-3" data-v-061fb56d><h5 data-v-061fb56d>Section</h5><ul class="nav flex-column" data-v-061fb56d><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Home</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Features</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>Pricing</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>FAQs</a></li><li class="nav-item mb-2" data-v-061fb56d><a href="#" class="nav-link p-0 text-light" data-v-061fb56d>About</a></li></ul></div></div><div class="d-flex flex-column flex-sm-row justify-content-between py-4 my-4 border-top" data-v-061fb56d><p data-v-061fb56d>\xA9 2022 Company, Inc. All rights reserved.</p><ul class="list-unstyled d-flex" data-v-061fb56d><li class="ms-3" data-v-061fb56d><a class="link-light" href="#" data-v-061fb56d><i class="bi bi-twitter" data-v-061fb56d></i></a></li><li class="ms-3" data-v-061fb56d><a class="link-light" href="#" data-v-061fb56d><i class="bi bi-instagram" data-v-061fb56d></i></a></li><li class="ms-3" data-v-061fb56d><a class="link-light" href="#" data-v-061fb56d><i class="bi bi-facebook" data-v-061fb56d></i></a></li></ul></div></div></div></div></footer>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-061fb56d"]]);
function getLibrary(provider) {
  return new Web3(provider);
}
setWeb3LibraryCallback(getLibrary);
const RPC_URLS = {
  1: "https://rpc.ankr.com/eth",
  137: "https://rpc.ankr.com/polygon"
};
const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS
});
new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
});
new NetworkConnector({
  urls: { 1: RPC_URLS[1] },
  defaultChainId: 1
});
function useEagerConnect() {
  const { activate, active } = useWeb3();
  const tried = vue_cjs_prod.ref(false);
  vue_cjs_prod.onMounted(() => {
    injected.isAuthorized().then((isAuthorized) => {
      if (isAuthorized) {
        activate(injected, void 0, true).catch(() => {
          tried.value = true;
        });
      } else {
        tried.value = true;
      }
    });
  });
  vue_cjs_prod.watch([tried, active], () => {
    if (!tried.value && active.value) {
      tried.value = true;
    }
  });
  return {
    tried
  };
}
const _sfc_main$1 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "connectAccount",
  __ssrInlineRender: true,
  setup(__props) {
    const connectorsByName = {
      ["MetaMask"]: injected
    };
    function getErrorMessage(error2) {
      if (error2 instanceof NoEthereumProviderError) {
        return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
      } else if (error2 instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
      } else if (error2 instanceof UserRejectedRequestError || error2 instanceof UserRejectedRequestError$1) {
        return "Please authorize this website to access your Ethereum account.";
      } else {
        console.error(error2);
        return "An unknown error occurred. Check the console for more details.";
      }
    }
    const { activate, connector, error } = useWeb3();
    useEagerConnect();
    const activatingConnector = vue_cjs_prod.ref();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: "modal fade",
        id: "modalConnectAccount",
        tabindex: "-1",
        "aria-labelledby": "modalConnectAccountLabel",
        "aria-hidden": "true"
      }, _attrs))}><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalConnectAccountLabel">Select Wallet</h5><button id="closeModalConnectAccount" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="d-grid gap-2"><!--[-->`);
      serverRenderer.exports.ssrRenderList(connectorsByName, (newConnector, name) => {
        _push(`<button class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">`);
        if (newConnector === vue_cjs_prod.unref(connector)) {
          _push(`<span class="mr-2" role="img" aria-label="check"> \u2705 </span>`);
        } else if (activatingConnector.value === newConnector) {
          _push(`<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-indigo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${serverRenderer.exports.ssrInterpolate(name)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (!!vue_cjs_prod.unref(error)) {
        _push(`<h4 style="${serverRenderer.exports.ssrRenderStyle({ marginTop: "1rem", marginBottom: "0" })}">${serverRenderer.exports.ssrInterpolate(getErrorMessage(vue_cjs_prod.unref(error)))}</h4>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modal/connectAccount.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useHead({
      title: `${route.meta.title ? route.meta.title : "NFT"} - AuroraNFT`,
      meta: [{ name: "title", content: `${route.meta.title} - AuroraNFT` }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Header = __nuxt_component_0;
      const _component_Footer = __nuxt_component_1;
      const _component_ModalConnectAccount = _sfc_main$1;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-fe261374>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Header, null, null, _parent));
      _push(`<div class="wrap" data-v-fe261374>`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_Footer, null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_ModalConnectAccount, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fe261374"]]);

export { _default as default };
//# sourceMappingURL=default.30579c04.mjs.map
