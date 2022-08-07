import { v as vue_cjs_prod, s as serverRenderer, r as require$$0 } from '../handlers/renderer.mjs';
import { joinURL, hasProtocol, isEqual, withBase, withQuery } from 'ufo';
import { useWeb3 as useWeb3$1 } from '@instadapp/vue-web3';
import * as JSBI from 'jsbi/dist/jsbi-umd.js';
import { create } from 'ipfs-http-client';
import Clipboard from 'clipboard';
import { u as useRuntimeConfig$1 } from '../nitro/node-server.mjs';
import 'h3';
import 'unenv/runtime/mock/proxy';
import 'stream';
import 'node-fetch-native/polyfill';
import 'http';
import 'https';
import 'destr';
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

const suspectProtoRx = /"(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["{[]|^-?[0-9][0-9.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(val) {
  if (typeof val !== "string") {
    return val;
  }
  const _lval = val.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return NaN;
  }
  if (_lval === "infinity") {
    return Infinity;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(val)) {
    return val;
  }
  try {
    if (suspectProtoRx.test(val) || suspectConstructorRx.test(val)) {
      return JSON.parse(val, jsonParseTransform);
    }
    return JSON.parse(val);
  } catch (_e) {
    return val;
  }
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*`\-.^~]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    if (ctx.options.retry !== false) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, {
          ...ctx.options,
          retry: retries - 1
        });
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: { ...globalOptions.defaults, ..._opts },
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.params) {
        ctx.request = withQuery(ctx.request, ctx.options.params);
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = typeof ctx.options.body === "string" ? ctx.options.body : JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (!ctx.response.ok) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
    }
    return ctx.response.ok ? ctx.response : onError(ctx);
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch({
    ...globalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch2;
}
const _globalThis$2 = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis$2.fetch || (() => Promise.reject(new Error("[ohmyfetch] global.fetch is not supported!")));
const Headers = _globalThis$2.Headers;
const $fetch$1 = createFetch({ fetch, Headers });
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const buildAssetsDir = () => appConfig.buildAssetsDir;
const buildAssetsURL = (...path) => joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
const publicAssetsURL = (...path) => {
  const publicBase = appConfig.cdnURL || appConfig.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
};
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createContext() {
  let currentInstance = null;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  return {
    use: () => currentInstance,
    tryUse: () => currentInstance,
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = null;
      isSingleton = false;
    },
    call: (instance, cb) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return cb();
      } finally {
        if (!isSingleton) {
          currentInstance = null;
        }
      }
    },
    async callAsync(instance, cb) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = cb();
        if (!isSingleton) {
          currentInstance = null;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace() {
  const contexts = {};
  return {
    get(key) {
      if (!contexts[key]) {
        contexts[key] = createContext();
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
const getContext = (key) => defaultNamespace.get(key);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = /* @__PURE__ */ new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = /* @__PURE__ */ new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: vue_cjs_prod.reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    isHydrating: false,
    _asyncDataPromises: {},
    ...options
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const vm = vue_cjs_prod.getCurrentInstance();
  if (!vm) {
    const nuxtAppInstance = nuxtAppCtx.use();
    if (!nuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return nuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var vueRouter_prod = {};
/*!
  * vue-router v4.1.3
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  var vue = require$$0;
  function isESModule(obj) {
    return obj.__esModule || obj[Symbol.toStringTag] === "Module";
  }
  const assign = Object.assign;
  function applyToParams(fn, params) {
    const newParams = {};
    for (const key in params) {
      const value = params[key];
      newParams[key] = isArray2(value) ? value.map(fn) : fn(value);
    }
    return newParams;
  }
  const noop = () => {
  };
  const isArray2 = Array.isArray;
  const TRAILING_SLASH_RE = /\/$/;
  const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
  function parseURL(parseQuery2, location2, currentLocation = "/") {
    let path, query = {}, searchString = "", hash = "";
    const hashPos = location2.indexOf("#");
    let searchPos = location2.indexOf("?");
    if (hashPos < searchPos && hashPos >= 0) {
      searchPos = -1;
    }
    if (searchPos > -1) {
      path = location2.slice(0, searchPos);
      searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
      query = parseQuery2(searchString);
    }
    if (hashPos > -1) {
      path = path || location2.slice(0, hashPos);
      hash = location2.slice(hashPos, location2.length);
    }
    path = resolveRelativePath(path != null ? path : location2, currentLocation);
    return {
      fullPath: path + (searchString && "?") + searchString + hash,
      path,
      query,
      hash
    };
  }
  function stringifyURL(stringifyQuery2, location2) {
    const query = location2.query ? stringifyQuery2(location2.query) : "";
    return location2.path + (query && "?") + query + (location2.hash || "");
  }
  function stripBase(pathname, base) {
    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
      return pathname;
    return pathname.slice(base.length) || "/";
  }
  function isSameRouteLocation(stringifyQuery2, a, b) {
    const aLastIndex = a.matched.length - 1;
    const bLastIndex = b.matched.length - 1;
    return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
  }
  function isSameRouteRecord(a, b) {
    return (a.aliasOf || a) === (b.aliasOf || b);
  }
  function isSameRouteLocationParams(a, b) {
    if (Object.keys(a).length !== Object.keys(b).length)
      return false;
    for (const key in a) {
      if (!isSameRouteLocationParamsValue(a[key], b[key]))
        return false;
    }
    return true;
  }
  function isSameRouteLocationParamsValue(a, b) {
    return isArray2(a) ? isEquivalentArray(a, b) : isArray2(b) ? isEquivalentArray(b, a) : a === b;
  }
  function isEquivalentArray(a, b) {
    return isArray2(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
  }
  function resolveRelativePath(to, from) {
    if (to.startsWith("/"))
      return to;
    if (!to)
      return from;
    const fromSegments = from.split("/");
    const toSegments = to.split("/");
    let position = fromSegments.length - 1;
    let toPosition;
    let segment;
    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
      segment = toSegments[toPosition];
      if (segment === ".")
        continue;
      if (segment === "..") {
        if (position > 1)
          position--;
      } else
        break;
    }
    return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
  }
  var NavigationType;
  (function(NavigationType2) {
    NavigationType2["pop"] = "pop";
    NavigationType2["push"] = "push";
  })(NavigationType || (NavigationType = {}));
  var NavigationDirection;
  (function(NavigationDirection2) {
    NavigationDirection2["back"] = "back";
    NavigationDirection2["forward"] = "forward";
    NavigationDirection2["unknown"] = "";
  })(NavigationDirection || (NavigationDirection = {}));
  const START = "";
  function normalizeBase(base) {
    if (!base) {
      {
        base = "/";
      }
    }
    if (base[0] !== "/" && base[0] !== "#")
      base = "/" + base;
    return removeTrailingSlash(base);
  }
  const BEFORE_HASH_RE = /^[^#]+#/;
  function createHref(base, location2) {
    return base.replace(BEFORE_HASH_RE, "#") + location2;
  }
  const computeScrollPosition = () => ({
    left: window.pageXOffset,
    top: window.pageYOffset
  });
  let createBaseLocation = () => location.protocol + "//" + location.host;
  function createCurrentLocation(base, location2) {
    const { pathname, search, hash } = location2;
    const hashPos = base.indexOf("#");
    if (hashPos > -1) {
      let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
      let pathFromHash = hash.slice(slicePos);
      if (pathFromHash[0] !== "/")
        pathFromHash = "/" + pathFromHash;
      return stripBase(pathFromHash, "");
    }
    const path = stripBase(pathname, base);
    return path + search + hash;
  }
  function useHistoryListeners(base, historyState, currentLocation, replace) {
    let listeners = [];
    let teardowns = [];
    let pauseState = null;
    const popStateHandler = ({ state }) => {
      const to = createCurrentLocation(base, location);
      const from = currentLocation.value;
      const fromState = historyState.value;
      let delta = 0;
      if (state) {
        currentLocation.value = to;
        historyState.value = state;
        if (pauseState && pauseState === from) {
          pauseState = null;
          return;
        }
        delta = fromState ? state.position - fromState.position : 0;
      } else {
        replace(to);
      }
      listeners.forEach((listener) => {
        listener(currentLocation.value, from, {
          delta,
          type: NavigationType.pop,
          direction: delta ? delta > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
        });
      });
    };
    function pauseListeners() {
      pauseState = currentLocation.value;
    }
    function listen(callback) {
      listeners.push(callback);
      const teardown = () => {
        const index = listeners.indexOf(callback);
        if (index > -1)
          listeners.splice(index, 1);
      };
      teardowns.push(teardown);
      return teardown;
    }
    function beforeUnloadListener() {
      const { history: history2 } = window;
      if (!history2.state)
        return;
      history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
    }
    function destroy() {
      for (const teardown of teardowns)
        teardown();
      teardowns = [];
      window.removeEventListener("popstate", popStateHandler);
      window.removeEventListener("beforeunload", beforeUnloadListener);
    }
    window.addEventListener("popstate", popStateHandler);
    window.addEventListener("beforeunload", beforeUnloadListener);
    return {
      pauseListeners,
      listen,
      destroy
    };
  }
  function buildState(back, current, forward, replaced = false, computeScroll = false) {
    return {
      back,
      current,
      forward,
      replaced,
      position: window.history.length,
      scroll: computeScroll ? computeScrollPosition() : null
    };
  }
  function useHistoryStateNavigation(base) {
    const { history: history2, location: location2 } = window;
    const currentLocation = {
      value: createCurrentLocation(base, location2)
    };
    const historyState = { value: history2.state };
    if (!historyState.value) {
      changeLocation(currentLocation.value, {
        back: null,
        current: currentLocation.value,
        forward: null,
        position: history2.length - 1,
        replaced: true,
        scroll: null
      }, true);
    }
    function changeLocation(to, state, replace2) {
      const hashIndex = base.indexOf("#");
      const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
      try {
        history2[replace2 ? "replaceState" : "pushState"](state, "", url);
        historyState.value = state;
      } catch (err) {
        {
          console.error(err);
        }
        location2[replace2 ? "replace" : "assign"](url);
      }
    }
    function replace(to, data) {
      const state = assign({}, history2.state, buildState(
        historyState.value.back,
        to,
        historyState.value.forward,
        true
      ), data, { position: historyState.value.position });
      changeLocation(to, state, true);
      currentLocation.value = to;
    }
    function push(to, data) {
      const currentState = assign(
        {},
        historyState.value,
        history2.state,
        {
          forward: to,
          scroll: computeScrollPosition()
        }
      );
      changeLocation(currentState.current, currentState, true);
      const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
      changeLocation(to, state, false);
      currentLocation.value = to;
    }
    return {
      location: currentLocation,
      state: historyState,
      push,
      replace
    };
  }
  function createWebHistory(base) {
    base = normalizeBase(base);
    const historyNavigation = useHistoryStateNavigation(base);
    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
    function go(delta, triggerListeners = true) {
      if (!triggerListeners)
        historyListeners.pauseListeners();
      history.go(delta);
    }
    const routerHistory = assign({
      location: "",
      base,
      go,
      createHref: createHref.bind(null, base)
    }, historyNavigation, historyListeners);
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => historyNavigation.location.value
    });
    Object.defineProperty(routerHistory, "state", {
      enumerable: true,
      get: () => historyNavigation.state.value
    });
    return routerHistory;
  }
  function createMemoryHistory(base = "") {
    let listeners = [];
    let queue = [START];
    let position = 0;
    base = normalizeBase(base);
    function setLocation(location2) {
      position++;
      if (position === queue.length) {
        queue.push(location2);
      } else {
        queue.splice(position);
        queue.push(location2);
      }
    }
    function triggerListeners(to, from, { direction, delta }) {
      const info = {
        direction,
        delta,
        type: NavigationType.pop
      };
      for (const callback of listeners) {
        callback(to, from, info);
      }
    }
    const routerHistory = {
      location: START,
      state: {},
      base,
      createHref: createHref.bind(null, base),
      replace(to) {
        queue.splice(position--, 1);
        setLocation(to);
      },
      push(to, data) {
        setLocation(to);
      },
      listen(callback) {
        listeners.push(callback);
        return () => {
          const index = listeners.indexOf(callback);
          if (index > -1)
            listeners.splice(index, 1);
        };
      },
      destroy() {
        listeners = [];
        queue = [START];
        position = 0;
      },
      go(delta, shouldTrigger = true) {
        const from = this.location;
        const direction = delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
        position = Math.max(0, Math.min(position + delta, queue.length - 1));
        if (shouldTrigger) {
          triggerListeners(this.location, from, {
            direction,
            delta
          });
        }
      }
    };
    Object.defineProperty(routerHistory, "location", {
      enumerable: true,
      get: () => queue[position]
    });
    return routerHistory;
  }
  function createWebHashHistory(base) {
    base = location.host ? base || location.pathname + location.search : "";
    if (!base.includes("#"))
      base += "#";
    return createWebHistory(base);
  }
  function isRouteLocation(route) {
    return typeof route === "string" || route && typeof route === "object";
  }
  function isRouteName(name) {
    return typeof name === "string" || typeof name === "symbol";
  }
  const START_LOCATION_NORMALIZED = {
    path: "/",
    name: void 0,
    params: {},
    query: {},
    hash: "",
    fullPath: "/",
    matched: [],
    meta: {},
    redirectedFrom: void 0
  };
  const NavigationFailureSymbol = Symbol("");
  exports.NavigationFailureType = void 0;
  (function(NavigationFailureType) {
    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
  })(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
  const ErrorTypeMessages = {
    [1]({ location: location2, currentLocation }) {
      return `No match for
 ${JSON.stringify(location2)}${currentLocation ? "\nwhile being at\n" + JSON.stringify(currentLocation) : ""}`;
    },
    [2]({ from, to }) {
      return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
    },
    [4]({ from, to }) {
      return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
    },
    [8]({ from, to }) {
      return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
    },
    [16]({ from, to }) {
      return `Avoided redundant navigation to current location: "${from.fullPath}".`;
    }
  };
  function createRouterError(type, params) {
    {
      return assign(new Error(ErrorTypeMessages[type](params)), {
        type,
        [NavigationFailureSymbol]: true
      }, params);
    }
  }
  function isNavigationFailure(error, type) {
    return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
  }
  const propertiesToLog = ["params", "query", "hash"];
  function stringifyRoute(to) {
    if (typeof to === "string")
      return to;
    if ("path" in to)
      return to.path;
    const location2 = {};
    for (const key of propertiesToLog) {
      if (key in to)
        location2[key] = to[key];
    }
    return JSON.stringify(location2, null, 2);
  }
  const BASE_PARAM_PATTERN = "[^/]+?";
  const BASE_PATH_PARSER_OPTIONS = {
    sensitive: false,
    strict: false,
    start: true,
    end: true
  };
  const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
  function tokensToParser(segments, extraOptions) {
    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
    const score = [];
    let pattern = options.start ? "^" : "";
    const keys = [];
    for (const segment of segments) {
      const segmentScores = segment.length ? [] : [90];
      if (options.strict && !segment.length)
        pattern += "/";
      for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
        const token = segment[tokenIndex];
        let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
        if (token.type === 0) {
          if (!tokenIndex)
            pattern += "/";
          pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
          subSegmentScore += 40;
        } else if (token.type === 1) {
          const { value, repeatable, optional, regexp } = token;
          keys.push({
            name: value,
            repeatable,
            optional
          });
          const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
          if (re2 !== BASE_PARAM_PATTERN) {
            subSegmentScore += 10;
            try {
              new RegExp(`(${re2})`);
            } catch (err) {
              throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
            }
          }
          let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
          if (!tokenIndex)
            subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
          if (optional)
            subPattern += "?";
          pattern += subPattern;
          subSegmentScore += 20;
          if (optional)
            subSegmentScore += -8;
          if (repeatable)
            subSegmentScore += -20;
          if (re2 === ".*")
            subSegmentScore += -50;
        }
        segmentScores.push(subSegmentScore);
      }
      score.push(segmentScores);
    }
    if (options.strict && options.end) {
      const i = score.length - 1;
      score[i][score[i].length - 1] += 0.7000000000000001;
    }
    if (!options.strict)
      pattern += "/?";
    if (options.end)
      pattern += "$";
    else if (options.strict)
      pattern += "(?:/|$)";
    const re = new RegExp(pattern, options.sensitive ? "" : "i");
    function parse(path) {
      const match = path.match(re);
      const params = {};
      if (!match)
        return null;
      for (let i = 1; i < match.length; i++) {
        const value = match[i] || "";
        const key = keys[i - 1];
        params[key.name] = value && key.repeatable ? value.split("/") : value;
      }
      return params;
    }
    function stringify(params) {
      let path = "";
      let avoidDuplicatedSlash = false;
      for (const segment of segments) {
        if (!avoidDuplicatedSlash || !path.endsWith("/"))
          path += "/";
        avoidDuplicatedSlash = false;
        for (const token of segment) {
          if (token.type === 0) {
            path += token.value;
          } else if (token.type === 1) {
            const { value, repeatable, optional } = token;
            const param = value in params ? params[value] : "";
            if (isArray2(param) && !repeatable) {
              throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
            }
            const text = isArray2(param) ? param.join("/") : param;
            if (!text) {
              if (optional) {
                if (segment.length < 2) {
                  if (path.endsWith("/"))
                    path = path.slice(0, -1);
                  else
                    avoidDuplicatedSlash = true;
                }
              } else
                throw new Error(`Missing required param "${value}"`);
            }
            path += text;
          }
        }
      }
      return path || "/";
    }
    return {
      re,
      score,
      keys,
      parse,
      stringify
    };
  }
  function compareScoreArray(a, b) {
    let i = 0;
    while (i < a.length && i < b.length) {
      const diff = b[i] - a[i];
      if (diff)
        return diff;
      i++;
    }
    if (a.length < b.length) {
      return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
    } else if (a.length > b.length) {
      return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
    }
    return 0;
  }
  function comparePathParserScore(a, b) {
    let i = 0;
    const aScore = a.score;
    const bScore = b.score;
    while (i < aScore.length && i < bScore.length) {
      const comp = compareScoreArray(aScore[i], bScore[i]);
      if (comp)
        return comp;
      i++;
    }
    if (Math.abs(bScore.length - aScore.length) === 1) {
      if (isLastScoreNegative(aScore))
        return 1;
      if (isLastScoreNegative(bScore))
        return -1;
    }
    return bScore.length - aScore.length;
  }
  function isLastScoreNegative(score) {
    const last = score[score.length - 1];
    return score.length > 0 && last[last.length - 1] < 0;
  }
  const ROOT_TOKEN = {
    type: 0,
    value: ""
  };
  const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
  function tokenizePath(path) {
    if (!path)
      return [[]];
    if (path === "/")
      return [[ROOT_TOKEN]];
    if (!path.startsWith("/")) {
      throw new Error(`Invalid path "${path}"`);
    }
    function crash(message) {
      throw new Error(`ERR (${state})/"${buffer}": ${message}`);
    }
    let state = 0;
    let previousState = state;
    const tokens = [];
    let segment;
    function finalizeSegment() {
      if (segment)
        tokens.push(segment);
      segment = [];
    }
    let i = 0;
    let char;
    let buffer = "";
    let customRe = "";
    function consumeBuffer() {
      if (!buffer)
        return;
      if (state === 0) {
        segment.push({
          type: 0,
          value: buffer
        });
      } else if (state === 1 || state === 2 || state === 3) {
        if (segment.length > 1 && (char === "*" || char === "+"))
          crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
        segment.push({
          type: 1,
          value: buffer,
          regexp: customRe,
          repeatable: char === "*" || char === "+",
          optional: char === "*" || char === "?"
        });
      } else {
        crash("Invalid state to consume buffer");
      }
      buffer = "";
    }
    function addCharToBuffer() {
      buffer += char;
    }
    while (i < path.length) {
      char = path[i++];
      if (char === "\\" && state !== 2) {
        previousState = state;
        state = 4;
        continue;
      }
      switch (state) {
        case 0:
          if (char === "/") {
            if (buffer) {
              consumeBuffer();
            }
            finalizeSegment();
          } else if (char === ":") {
            consumeBuffer();
            state = 1;
          } else {
            addCharToBuffer();
          }
          break;
        case 4:
          addCharToBuffer();
          state = previousState;
          break;
        case 1:
          if (char === "(") {
            state = 2;
          } else if (VALID_PARAM_RE.test(char)) {
            addCharToBuffer();
          } else {
            consumeBuffer();
            state = 0;
            if (char !== "*" && char !== "?" && char !== "+")
              i--;
          }
          break;
        case 2:
          if (char === ")") {
            if (customRe[customRe.length - 1] == "\\")
              customRe = customRe.slice(0, -1) + char;
            else
              state = 3;
          } else {
            customRe += char;
          }
          break;
        case 3:
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
          customRe = "";
          break;
        default:
          crash("Unknown state");
          break;
      }
    }
    if (state === 2)
      crash(`Unfinished custom RegExp for param "${buffer}"`);
    consumeBuffer();
    finalizeSegment();
    return tokens;
  }
  function createRouteRecordMatcher(record, parent, options) {
    const parser = tokensToParser(tokenizePath(record.path), options);
    const matcher = assign(parser, {
      record,
      parent,
      children: [],
      alias: []
    });
    if (parent) {
      if (!matcher.record.aliasOf === !parent.record.aliasOf)
        parent.children.push(matcher);
    }
    return matcher;
  }
  function createRouterMatcher(routes2, globalOptions) {
    const matchers = [];
    const matcherMap = /* @__PURE__ */ new Map();
    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
    function getRecordMatcher(name) {
      return matcherMap.get(name);
    }
    function addRoute(record, parent, originalRecord) {
      const isRootAdd = !originalRecord;
      const mainNormalizedRecord = normalizeRouteRecord(record);
      mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
      const options = mergeOptions(globalOptions, record);
      const normalizedRecords = [
        mainNormalizedRecord
      ];
      if ("alias" in record) {
        const aliases = typeof record.alias === "string" ? [record.alias] : record.alias;
        for (const alias of aliases) {
          normalizedRecords.push(assign({}, mainNormalizedRecord, {
            components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
            path: alias,
            aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          }));
        }
      }
      let matcher;
      let originalMatcher;
      for (const normalizedRecord of normalizedRecords) {
        const { path } = normalizedRecord;
        if (parent && path[0] !== "/") {
          const parentPath = parent.record.path;
          const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
          normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
        }
        matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
        if (originalRecord) {
          originalRecord.alias.push(matcher);
        } else {
          originalMatcher = originalMatcher || matcher;
          if (originalMatcher !== matcher)
            originalMatcher.alias.push(matcher);
          if (isRootAdd && record.name && !isAliasRecord(matcher))
            removeRoute(record.name);
        }
        if (mainNormalizedRecord.children) {
          const children = mainNormalizedRecord.children;
          for (let i = 0; i < children.length; i++) {
            addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
          }
        }
        originalRecord = originalRecord || matcher;
        insertMatcher(matcher);
      }
      return originalMatcher ? () => {
        removeRoute(originalMatcher);
      } : noop;
    }
    function removeRoute(matcherRef) {
      if (isRouteName(matcherRef)) {
        const matcher = matcherMap.get(matcherRef);
        if (matcher) {
          matcherMap.delete(matcherRef);
          matchers.splice(matchers.indexOf(matcher), 1);
          matcher.children.forEach(removeRoute);
          matcher.alias.forEach(removeRoute);
        }
      } else {
        const index = matchers.indexOf(matcherRef);
        if (index > -1) {
          matchers.splice(index, 1);
          if (matcherRef.record.name)
            matcherMap.delete(matcherRef.record.name);
          matcherRef.children.forEach(removeRoute);
          matcherRef.alias.forEach(removeRoute);
        }
      }
    }
    function getRoutes() {
      return matchers;
    }
    function insertMatcher(matcher) {
      let i = 0;
      while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
        i++;
      matchers.splice(i, 0, matcher);
      if (matcher.record.name && !isAliasRecord(matcher))
        matcherMap.set(matcher.record.name, matcher);
    }
    function resolve(location2, currentLocation) {
      let matcher;
      let params = {};
      let path;
      let name;
      if ("name" in location2 && location2.name) {
        matcher = matcherMap.get(location2.name);
        if (!matcher)
          throw createRouterError(1, {
            location: location2
          });
        name = matcher.record.name;
        params = assign(
          paramsFromLocation(
            currentLocation.params,
            matcher.keys.filter((k) => !k.optional).map((k) => k.name)
          ),
          location2.params
        );
        path = matcher.stringify(params);
      } else if ("path" in location2) {
        path = location2.path;
        matcher = matchers.find((m) => m.re.test(path));
        if (matcher) {
          params = matcher.parse(path);
          name = matcher.record.name;
        }
      } else {
        matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
        if (!matcher)
          throw createRouterError(1, {
            location: location2,
            currentLocation
          });
        name = matcher.record.name;
        params = assign({}, currentLocation.params, location2.params);
        path = matcher.stringify(params);
      }
      const matched = [];
      let parentMatcher = matcher;
      while (parentMatcher) {
        matched.unshift(parentMatcher.record);
        parentMatcher = parentMatcher.parent;
      }
      return {
        name,
        path,
        params,
        matched,
        meta: mergeMetaFields(matched)
      };
    }
    routes2.forEach((route) => addRoute(route));
    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
  }
  function paramsFromLocation(params, keys) {
    const newParams = {};
    for (const key of keys) {
      if (key in params)
        newParams[key] = params[key];
    }
    return newParams;
  }
  function normalizeRouteRecord(record) {
    return {
      path: record.path,
      redirect: record.redirect,
      name: record.name,
      meta: record.meta || {},
      aliasOf: void 0,
      beforeEnter: record.beforeEnter,
      props: normalizeRecordProps(record),
      children: record.children || [],
      instances: {},
      leaveGuards: /* @__PURE__ */ new Set(),
      updateGuards: /* @__PURE__ */ new Set(),
      enterCallbacks: {},
      components: "components" in record ? record.components || null : record.component && { default: record.component }
    };
  }
  function normalizeRecordProps(record) {
    const propsObject = {};
    const props = record.props || false;
    if ("component" in record) {
      propsObject.default = props;
    } else {
      for (const name in record.components)
        propsObject[name] = typeof props === "boolean" ? props : props[name];
    }
    return propsObject;
  }
  function isAliasRecord(record) {
    while (record) {
      if (record.record.aliasOf)
        return true;
      record = record.parent;
    }
    return false;
  }
  function mergeMetaFields(matched) {
    return matched.reduce((meta2, record) => assign(meta2, record.meta), {});
  }
  function mergeOptions(defaults, partialOptions) {
    const options = {};
    for (const key in defaults) {
      options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
    }
    return options;
  }
  function isRecordChildOf(record, parent) {
    return parent.children.some((child) => child === record || isRecordChildOf(record, child));
  }
  const HASH_RE = /#/g;
  const AMPERSAND_RE = /&/g;
  const SLASH_RE = /\//g;
  const EQUAL_RE = /=/g;
  const IM_RE = /\?/g;
  const PLUS_RE = /\+/g;
  const ENC_BRACKET_OPEN_RE = /%5B/g;
  const ENC_BRACKET_CLOSE_RE = /%5D/g;
  const ENC_CARET_RE = /%5E/g;
  const ENC_BACKTICK_RE = /%60/g;
  const ENC_CURLY_OPEN_RE = /%7B/g;
  const ENC_PIPE_RE = /%7C/g;
  const ENC_CURLY_CLOSE_RE = /%7D/g;
  const ENC_SPACE_RE = /%20/g;
  function commonEncode(text) {
    return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
  }
  function encodeHash(text) {
    return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryValue(text) {
    return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
  }
  function encodeQueryKey(text) {
    return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
  }
  function encodePath(text) {
    return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
  }
  function encodeParam(text) {
    return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
  }
  function decode(text) {
    try {
      return decodeURIComponent("" + text);
    } catch (err) {
    }
    return "" + text;
  }
  function parseQuery(search) {
    const query = {};
    if (search === "" || search === "?")
      return query;
    const hasLeadingIM = search[0] === "?";
    const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
    for (let i = 0; i < searchParams.length; ++i) {
      const searchParam = searchParams[i].replace(PLUS_RE, " ");
      const eqPos = searchParam.indexOf("=");
      const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
      const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
      if (key in query) {
        let currentValue = query[key];
        if (!isArray2(currentValue)) {
          currentValue = query[key] = [currentValue];
        }
        currentValue.push(value);
      } else {
        query[key] = value;
      }
    }
    return query;
  }
  function stringifyQuery(query) {
    let search = "";
    for (let key in query) {
      const value = query[key];
      key = encodeQueryKey(key);
      if (value == null) {
        if (value !== void 0) {
          search += (search.length ? "&" : "") + key;
        }
        continue;
      }
      const values = isArray2(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
      values.forEach((value2) => {
        if (value2 !== void 0) {
          search += (search.length ? "&" : "") + key;
          if (value2 != null)
            search += "=" + value2;
        }
      });
    }
    return search;
  }
  function normalizeQuery(query) {
    const normalizedQuery = {};
    for (const key in query) {
      const value = query[key];
      if (value !== void 0) {
        normalizedQuery[key] = isArray2(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
      }
    }
    return normalizedQuery;
  }
  const matchedRouteKey = Symbol("");
  const viewDepthKey = Symbol("");
  const routerKey = Symbol("");
  const routeLocationKey = Symbol("");
  const routerViewLocationKey = Symbol("");
  function useCallbacks() {
    let handlers = [];
    function add(handler) {
      handlers.push(handler);
      return () => {
        const i = handlers.indexOf(handler);
        if (i > -1)
          handlers.splice(i, 1);
      };
    }
    function reset() {
      handlers = [];
    }
    return {
      add,
      list: () => handlers,
      reset
    };
  }
  function registerGuard(record, name, guard) {
    const removeFromList = () => {
      record[name].delete(guard);
    };
    vue.onUnmounted(removeFromList);
    vue.onDeactivated(removeFromList);
    vue.onActivated(() => {
      record[name].add(guard);
    });
    record[name].add(guard);
  }
  function onBeforeRouteLeave(leaveGuard) {
    const activeRecord = vue.inject(
      matchedRouteKey,
      {}
    ).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "leaveGuards", leaveGuard);
  }
  function onBeforeRouteUpdate(updateGuard) {
    const activeRecord = vue.inject(
      matchedRouteKey,
      {}
    ).value;
    if (!activeRecord) {
      return;
    }
    registerGuard(activeRecord, "updateGuards", updateGuard);
  }
  function guardToPromiseFn(guard, to, from, record, name) {
    const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
    return () => new Promise((resolve, reject) => {
      const next = (valid) => {
        if (valid === false) {
          reject(createRouterError(4, {
            from,
            to
          }));
        } else if (valid instanceof Error) {
          reject(valid);
        } else if (isRouteLocation(valid)) {
          reject(createRouterError(2, {
            from: to,
            to: valid
          }));
        } else {
          if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
            enterCallbackArray.push(valid);
          }
          resolve();
        }
      };
      const guardReturn = guard.call(record && record.instances[name], to, from, next);
      let guardCall = Promise.resolve(guardReturn);
      if (guard.length < 3)
        guardCall = guardCall.then(next);
      guardCall.catch((err) => reject(err));
    });
  }
  function extractComponentsGuards(matched, guardType, to, from) {
    const guards = [];
    for (const record of matched) {
      for (const name in record.components) {
        let rawComponent = record.components[name];
        if (guardType !== "beforeRouteEnter" && !record.instances[name])
          continue;
        if (isRouteComponent(rawComponent)) {
          const options = rawComponent.__vccOpts || rawComponent;
          const guard = options[guardType];
          guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
        } else {
          let componentPromise = rawComponent();
          guards.push(() => componentPromise.then((resolved) => {
            if (!resolved)
              return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
            const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
            record.components[name] = resolvedComponent;
            const options = resolvedComponent.__vccOpts || resolvedComponent;
            const guard = options[guardType];
            return guard && guardToPromiseFn(guard, to, from, record, name)();
          }));
        }
      }
    }
    return guards;
  }
  function isRouteComponent(component) {
    return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
  }
  function loadRouteLocation(route) {
    return route.matched.every((record) => record.redirect) ? Promise.reject(new Error("Cannot load a route that redirects.")) : Promise.all(route.matched.map((record) => record.components && Promise.all(Object.keys(record.components).reduce((promises, name) => {
      const rawComponent = record.components[name];
      if (typeof rawComponent === "function" && !("displayName" in rawComponent)) {
        promises.push(rawComponent().then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}". Ensure you passed a function that returns a promise.`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          return;
        }));
      }
      return promises;
    }, [])))).then(() => route);
  }
  function useLink(props) {
    const router = vue.inject(routerKey);
    const currentRoute = vue.inject(routeLocationKey);
    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
    const activeRecordIndex = vue.computed(() => {
      const { matched } = route.value;
      const { length } = matched;
      const routeMatched = matched[length - 1];
      const currentMatched = currentRoute.matched;
      if (!routeMatched || !currentMatched.length)
        return -1;
      const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
      if (index > -1)
        return index;
      const parentRecordPath = getOriginalPath(matched[length - 2]);
      return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index;
    });
    const isActive = vue.computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
    function navigate(e = {}) {
      if (guardEvent(e)) {
        return router[vue.unref(props.replace) ? "replace" : "push"](
          vue.unref(props.to)
        ).catch(noop);
      }
      return Promise.resolve();
    }
    return {
      route,
      href: vue.computed(() => route.value.href),
      isActive,
      isExactActive,
      navigate
    };
  }
  const RouterLinkImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterLink",
    compatConfig: { MODE: 3 },
    props: {
      to: {
        type: [String, Object],
        required: true
      },
      replace: Boolean,
      activeClass: String,
      exactActiveClass: String,
      custom: Boolean,
      ariaCurrentValue: {
        type: String,
        default: "page"
      }
    },
    useLink,
    setup(props, { slots }) {
      const link = vue.reactive(useLink(props));
      const { options } = vue.inject(routerKey);
      const elClass = vue.computed(() => ({
        [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
        [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
      }));
      return () => {
        const children = slots.default && slots.default(link);
        return props.custom ? children : vue.h("a", {
          "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
          href: link.href,
          onClick: link.navigate,
          class: elClass.value
        }, children);
      };
    }
  });
  const RouterLink = RouterLinkImpl;
  function guardEvent(e) {
    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
      return;
    if (e.defaultPrevented)
      return;
    if (e.button !== void 0 && e.button !== 0)
      return;
    if (e.currentTarget && e.currentTarget.getAttribute) {
      const target = e.currentTarget.getAttribute("target");
      if (/\b_blank\b/i.test(target))
        return;
    }
    if (e.preventDefault)
      e.preventDefault();
    return true;
  }
  function includesParams(outer, inner) {
    for (const key in inner) {
      const innerValue = inner[key];
      const outerValue = outer[key];
      if (typeof innerValue === "string") {
        if (innerValue !== outerValue)
          return false;
      } else {
        if (!isArray2(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
          return false;
      }
    }
    return true;
  }
  function getOriginalPath(record) {
    return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
  }
  const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
  const RouterViewImpl = /* @__PURE__ */ vue.defineComponent({
    name: "RouterView",
    inheritAttrs: false,
    props: {
      name: {
        type: String,
        default: "default"
      },
      route: Object
    },
    compatConfig: { MODE: 3 },
    setup(props, { attrs, slots }) {
      const injectedRoute = vue.inject(routerViewLocationKey);
      const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
      const injectedDepth = vue.inject(viewDepthKey, 0);
      const depth = vue.computed(() => {
        let initialDepth = vue.unref(injectedDepth);
        const { matched } = routeToDisplay.value;
        let matchedRoute;
        while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
          initialDepth++;
        }
        return initialDepth;
      });
      const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth.value]);
      vue.provide(viewDepthKey, vue.computed(() => depth.value + 1));
      vue.provide(matchedRouteKey, matchedRouteRef);
      vue.provide(routerViewLocationKey, routeToDisplay);
      const viewRef = vue.ref();
      vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
        if (to) {
          to.instances[name] = instance;
          if (from && from !== to && instance && instance === oldInstance) {
            if (!to.leaveGuards.size) {
              to.leaveGuards = from.leaveGuards;
            }
            if (!to.updateGuards.size) {
              to.updateGuards = from.updateGuards;
            }
          }
        }
        if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
          (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
        }
      }, { flush: "post" });
      return () => {
        const route = routeToDisplay.value;
        const currentName = props.name;
        const matchedRoute = matchedRouteRef.value;
        const ViewComponent = matchedRoute && matchedRoute.components[currentName];
        if (!ViewComponent) {
          return normalizeSlot(slots.default, { Component: ViewComponent, route });
        }
        const routePropsOption = matchedRoute.props[currentName];
        const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
        const onVnodeUnmounted = (vnode) => {
          if (vnode.component.isUnmounted) {
            matchedRoute.instances[currentName] = null;
          }
        };
        const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
          onVnodeUnmounted,
          ref: viewRef
        }));
        return normalizeSlot(slots.default, { Component: component, route }) || component;
      };
    }
  });
  function normalizeSlot(slot, data) {
    if (!slot)
      return null;
    const slotContent = slot(data);
    return slotContent.length === 1 ? slotContent[0] : slotContent;
  }
  const RouterView = RouterViewImpl;
  function createRouter(options) {
    const matcher = createRouterMatcher(options.routes, options);
    const parseQuery$1 = options.parseQuery || parseQuery;
    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
    const routerHistory = options.history;
    const beforeGuards = useCallbacks();
    const beforeResolveGuards = useCallbacks();
    const afterGuards = useCallbacks();
    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
    let pendingLocation = START_LOCATION_NORMALIZED;
    const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
    const encodeParams = applyToParams.bind(null, encodeParam);
    const decodeParams = applyToParams.bind(null, decode);
    function addRoute(parentOrRoute, route) {
      let parent;
      let record;
      if (isRouteName(parentOrRoute)) {
        parent = matcher.getRecordMatcher(parentOrRoute);
        record = route;
      } else {
        record = parentOrRoute;
      }
      return matcher.addRoute(record, parent);
    }
    function removeRoute(name) {
      const recordMatcher = matcher.getRecordMatcher(name);
      if (recordMatcher) {
        matcher.removeRoute(recordMatcher);
      }
    }
    function getRoutes() {
      return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
    }
    function hasRoute(name) {
      return !!matcher.getRecordMatcher(name);
    }
    function resolve(rawLocation, currentLocation) {
      currentLocation = assign({}, currentLocation || currentRoute.value);
      if (typeof rawLocation === "string") {
        const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
        const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
        const href2 = routerHistory.createHref(locationNormalized.fullPath);
        return assign(locationNormalized, matchedRoute2, {
          params: decodeParams(matchedRoute2.params),
          hash: decode(locationNormalized.hash),
          redirectedFrom: void 0,
          href: href2
        });
      }
      let matcherLocation;
      if ("path" in rawLocation) {
        matcherLocation = assign({}, rawLocation, {
          path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
        });
      } else {
        const targetParams = assign({}, rawLocation.params);
        for (const key in targetParams) {
          if (targetParams[key] == null) {
            delete targetParams[key];
          }
        }
        matcherLocation = assign({}, rawLocation, {
          params: encodeParams(rawLocation.params)
        });
        currentLocation.params = encodeParams(currentLocation.params);
      }
      const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
      const hash = rawLocation.hash || "";
      matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
      const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
        hash: encodeHash(hash),
        path: matchedRoute.path
      }));
      const href = routerHistory.createHref(fullPath);
      return assign({
        fullPath,
        hash,
        query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      }, matchedRoute, {
        redirectedFrom: void 0,
        href
      });
    }
    function locationAsObject(to) {
      return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
    }
    function checkCanceledNavigation(to, from) {
      if (pendingLocation !== to) {
        return createRouterError(8, {
          from,
          to
        });
      }
    }
    function push(to) {
      return pushWithRedirect(to);
    }
    function replace(to) {
      return push(assign(locationAsObject(to), { replace: true }));
    }
    function handleRedirectRecord(to) {
      const lastMatched = to.matched[to.matched.length - 1];
      if (lastMatched && lastMatched.redirect) {
        const { redirect } = lastMatched;
        let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
        if (typeof newTargetLocation === "string") {
          newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
          newTargetLocation.params = {};
        }
        return assign({
          query: to.query,
          hash: to.hash,
          params: "path" in newTargetLocation ? {} : to.params
        }, newTargetLocation);
      }
    }
    function pushWithRedirect(to, redirectedFrom) {
      const targetLocation = pendingLocation = resolve(to);
      const from = currentRoute.value;
      const data = to.state;
      const force = to.force;
      const replace2 = to.replace === true;
      const shouldRedirect = handleRedirectRecord(targetLocation);
      if (shouldRedirect)
        return pushWithRedirect(
          assign(locationAsObject(shouldRedirect), {
            state: data,
            force,
            replace: replace2
          }),
          redirectedFrom || targetLocation
        );
      const toLocation = targetLocation;
      toLocation.redirectedFrom = redirectedFrom;
      let failure;
      if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
        failure = createRouterError(16, { to: toLocation, from });
        handleScroll();
      }
      return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? isNavigationFailure(error, 2) ? error : markAsReady(error) : triggerError(error, toLocation, from)).then((failure2) => {
        if (failure2) {
          if (isNavigationFailure(failure2, 2)) {
            return pushWithRedirect(
              assign({
                replace: replace2
              }, locationAsObject(failure2.to), {
                state: data,
                force
              }),
              redirectedFrom || toLocation
            );
          }
        } else {
          failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
        }
        triggerAfterEach(toLocation, from, failure2);
        return failure2;
      });
    }
    function checkCanceledNavigationAndReject(to, from) {
      const error = checkCanceledNavigation(to, from);
      return error ? Promise.reject(error) : Promise.resolve();
    }
    function navigate(to, from) {
      let guards;
      const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
      guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
      for (const record of leavingRecords) {
        record.leaveGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards).then(() => {
        guards = [];
        for (const guard of beforeGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
        for (const record of updatingRecords) {
          record.updateGuards.forEach((guard) => {
            guards.push(guardToPromiseFn(guard, to, from));
          });
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const record of to.matched) {
          if (record.beforeEnter && !from.matched.includes(record)) {
            if (isArray2(record.beforeEnter)) {
              for (const beforeEnter of record.beforeEnter)
                guards.push(guardToPromiseFn(beforeEnter, to, from));
            } else {
              guards.push(guardToPromiseFn(record.beforeEnter, to, from));
            }
          }
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        to.matched.forEach((record) => record.enterCallbacks = {});
        guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).then(() => {
        guards = [];
        for (const guard of beforeResolveGuards.list()) {
          guards.push(guardToPromiseFn(guard, to, from));
        }
        guards.push(canceledNavigationCheck);
        return runGuardQueue(guards);
      }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
    }
    function triggerAfterEach(to, from, failure) {
      for (const guard of afterGuards.list())
        guard(to, from, failure);
    }
    function finalizeNavigation(toLocation, from, isPush, replace2, data) {
      const error = checkCanceledNavigation(toLocation, from);
      if (error)
        return error;
      const isFirstNavigation = from === START_LOCATION_NORMALIZED;
      const state = {};
      if (isPush) {
        if (replace2 || isFirstNavigation)
          routerHistory.replace(toLocation.fullPath, assign({
            scroll: isFirstNavigation && state && state.scroll
          }, data));
        else
          routerHistory.push(toLocation.fullPath, data);
      }
      currentRoute.value = toLocation;
      handleScroll();
      markAsReady();
    }
    let removeHistoryListener;
    function setupListeners() {
      if (removeHistoryListener)
        return;
      removeHistoryListener = routerHistory.listen((to, _from, info) => {
        if (!router.listening)
          return;
        const toLocation = resolve(to);
        const shouldRedirect = handleRedirectRecord(toLocation);
        if (shouldRedirect) {
          pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
          return;
        }
        pendingLocation = toLocation;
        const from = currentRoute.value;
        navigate(toLocation, from).catch((error) => {
          if (isNavigationFailure(error, 4 | 8)) {
            return error;
          }
          if (isNavigationFailure(error, 2)) {
            pushWithRedirect(
              error.to,
              toLocation
            ).then((failure) => {
              if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
                routerHistory.go(-1, false);
              }
            }).catch(noop);
            return Promise.reject();
          }
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          }
          return triggerError(error, toLocation, from);
        }).then((failure) => {
          failure = failure || finalizeNavigation(
            toLocation,
            from,
            false
          );
          if (failure) {
            if (info.delta && !isNavigationFailure(failure, 8)) {
              routerHistory.go(-info.delta, false);
            } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
              routerHistory.go(-1, false);
            }
          }
          triggerAfterEach(toLocation, from, failure);
        }).catch(noop);
      });
    }
    let readyHandlers = useCallbacks();
    let errorHandlers = useCallbacks();
    let ready;
    function triggerError(error, to, from) {
      markAsReady(error);
      const list = errorHandlers.list();
      if (list.length) {
        list.forEach((handler) => handler(error, to, from));
      } else {
        console.error(error);
      }
      return Promise.reject(error);
    }
    function isReady() {
      if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
        return Promise.resolve();
      return new Promise((resolve2, reject) => {
        readyHandlers.add([resolve2, reject]);
      });
    }
    function markAsReady(err) {
      if (!ready) {
        ready = !err;
        setupListeners();
        readyHandlers.list().forEach(([resolve2, reject]) => err ? reject(err) : resolve2());
        readyHandlers.reset();
      }
      return err;
    }
    function handleScroll(to, from, isPush, isFirstNavigation) {
      return Promise.resolve();
    }
    const go = (delta) => routerHistory.go(delta);
    const installedApps = /* @__PURE__ */ new Set();
    const router = {
      currentRoute,
      listening: true,
      addRoute,
      removeRoute,
      hasRoute,
      getRoutes,
      resolve,
      options,
      push,
      replace,
      go,
      back: () => go(-1),
      forward: () => go(1),
      beforeEach: beforeGuards.add,
      beforeResolve: beforeResolveGuards.add,
      afterEach: afterGuards.add,
      onError: errorHandlers.add,
      isReady,
      install(app) {
        const router2 = this;
        app.component("RouterLink", RouterLink);
        app.component("RouterView", RouterView);
        app.config.globalProperties.$router = router2;
        Object.defineProperty(app.config.globalProperties, "$route", {
          enumerable: true,
          get: () => vue.unref(currentRoute)
        });
        const reactiveRoute = {};
        for (const key in START_LOCATION_NORMALIZED) {
          reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
        }
        app.provide(routerKey, router2);
        app.provide(routeLocationKey, vue.reactive(reactiveRoute));
        app.provide(routerViewLocationKey, currentRoute);
        const unmountApp = app.unmount;
        installedApps.add(app);
        app.unmount = function() {
          installedApps.delete(app);
          if (installedApps.size < 1) {
            pendingLocation = START_LOCATION_NORMALIZED;
            removeHistoryListener && removeHistoryListener();
            removeHistoryListener = null;
            currentRoute.value = START_LOCATION_NORMALIZED;
            ready = false;
          }
          unmountApp();
        };
      }
    };
    return router;
  }
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
  }
  function extractChangingRecords(to, from) {
    const leavingRecords = [];
    const updatingRecords = [];
    const enteringRecords = [];
    const len = Math.max(from.matched.length, to.matched.length);
    for (let i = 0; i < len; i++) {
      const recordFrom = from.matched[i];
      if (recordFrom) {
        if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
          updatingRecords.push(recordFrom);
        else
          leavingRecords.push(recordFrom);
      }
      const recordTo = to.matched[i];
      if (recordTo) {
        if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
          enteringRecords.push(recordTo);
        }
      }
    }
    return [leavingRecords, updatingRecords, enteringRecords];
  }
  function useRouter2() {
    return vue.inject(routerKey);
  }
  function useRoute2() {
    return vue.inject(routeLocationKey);
  }
  exports.RouterLink = RouterLink;
  exports.RouterView = RouterView;
  exports.START_LOCATION = START_LOCATION_NORMALIZED;
  exports.createMemoryHistory = createMemoryHistory;
  exports.createRouter = createRouter;
  exports.createRouterMatcher = createRouterMatcher;
  exports.createWebHashHistory = createWebHashHistory;
  exports.createWebHistory = createWebHistory;
  exports.isNavigationFailure = isNavigationFailure;
  exports.loadRouteLocation = loadRouteLocation;
  exports.matchedRouteKey = matchedRouteKey;
  exports.onBeforeRouteLeave = onBeforeRouteLeave;
  exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
  exports.parseQuery = parseQuery;
  exports.routeLocationKey = routeLocationKey;
  exports.routerKey = routerKey;
  exports.routerViewLocationKey = routerViewLocationKey;
  exports.stringifyQuery = stringifyQuery;
  exports.useLink = useLink;
  exports.useRoute = useRoute2;
  exports.useRouter = useRouter2;
  exports.viewDepthKey = viewDepthKey;
})(vueRouter_prod);
var vueRouter_cjs_prod = vueRouter_prod;
const wrapInRef = (value) => vue_cjs_prod.isRef(value) ? value : vue_cjs_prod.ref(value);
const getDefault = () => null;
function useAsyncData(key, handler, options = {}) {
  var _a, _b, _c, _d, _e;
  if (typeof key !== "string") {
    throw new TypeError("asyncData key must be a string");
  }
  if (typeof handler !== "function") {
    throw new TypeError("asyncData handler must be a function");
  }
  options = { server: true, default: getDefault, ...options };
  if (options.defer) {
    console.warn("[useAsyncData] `defer` has been renamed to `lazy`. Support for `defer` will be removed in RC.");
  }
  options.lazy = (_b = (_a = options.lazy) != null ? _a : options.defer) != null ? _b : false;
  options.initialCache = (_c = options.initialCache) != null ? _c : true;
  const nuxt = useNuxtApp();
  const instance = vue_cjs_prod.getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      vue_cjs_prod.onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      vue_cjs_prod.onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: vue_cjs_prod.ref(!useInitialCache()),
    error: vue_cjs_prod.ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
  };
  asyncData.refresh = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      return nuxt._asyncDataPromises[key];
    }
    if (opts._initial && useInitialCache()) {
      return nuxt.payload.data[key];
    }
    asyncData.pending.value = true;
    nuxt._asyncDataPromises[key] = Promise.resolve(handler(nuxt)).then((result) => {
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      asyncData.error.value = error;
      asyncData.data.value = vue_cjs_prod.unref(options.default());
    }).finally(() => {
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = true;
      }
      delete nuxt._asyncDataPromises[key];
    });
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer) {
    const promise = initialFetch();
    vue_cjs_prod.onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const useState = (key, init) => {
  const nuxt = useNuxtApp();
  const state = vue_cjs_prod.toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (vue_cjs_prod.isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
};
const useError = () => {
  const nuxtApp = useNuxtApp();
  return useState("error", () => nuxtApp.ssrContext.error);
};
const throwError = (_err) => {
  const nuxtApp = useNuxtApp();
  useError();
  const err = typeof _err === "string" ? new Error(_err) : _err;
  nuxtApp.callHook("app:error", err);
  {
    nuxtApp.ssrContext.error = nuxtApp.ssrContext.error || err;
  }
  return err;
};
const MIMES = {
  html: "text/html",
  json: "application/json"
};
const defer = typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      event.res.end(data);
      resolve(void 0);
    });
  });
}
function defaultContentType(event, type) {
  if (type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", type);
  }
}
function sendRedirect(event, location2, code = 302) {
  event.res.statusCode = code;
  event.res.setHeader("Location", location2);
  const html = `<!DOCTYPE html>
<html>
  <head><meta http-equiv="refresh" content="0; url=${encodeURI(location2)}"></head>
  <body>Redirecting to <a href=${JSON.stringify(location2)}>${encodeURI(location2)}</a></body>
</html>`;
  return send(event, html, MIMES.html);
}
class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.fatal = false;
    this.unhandled = false;
    this.statusMessage = "Internal Server Error";
  }
}
H3Error.__h3_error__ = true;
function createError(input) {
  var _a;
  if (typeof input === "string") {
    return new H3Error(input);
  }
  if (isError(input)) {
    return input;
  }
  const err = new H3Error((_a = input.message) != null ? _a : input.statusMessage, input.cause ? { cause: input.cause } : void 0);
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  }
  if (input.data) {
    err.data = input.data;
  }
  if (input.fatal !== void 0) {
    err.fatal = input.fatal;
  }
  if (input.unhandled !== void 0) {
    err.unhandled = input.unhandled;
  }
  return err;
}
function isError(input) {
  var _a;
  return ((_a = input == null ? void 0 : input.constructor) == null ? void 0 : _a.__h3_error__) === true;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const navigateTo = (to, options = {}) => {
  if (!to) {
    to = "/";
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, options.redirectCode || 302));
    }
  }
  return options.replace ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  return vue_cjs_prod.defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = vue_cjs_prod.computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = vue_cjs_prod.computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return vue_cjs_prod.h(vue_cjs_prod.resolveComponent("RouterLink"), {
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue
          }, slots.default);
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        return vue_cjs_prod.h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0$3 = defineNuxtLink({ componentName: "NuxtLink" });
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index;
  let lastIndex = 0;
  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index) {
      html += str.slice(lastIndex, index);
    }
    lastIndex = index + 1;
    html += escaped;
  }
  return lastIndex !== index ? html + str.slice(lastIndex, index) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$1(a);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.genPropsAccessExp = genPropsAccessExp;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject$1;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useHead(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
const components = {};
function _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47_46nuxt_47components_46plugin_46mjs(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var BODY_TAG_ATTR_NAME = `data-meta-body`;
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    if (key === "body" && attrs.body === true) {
      el.setAttribute(BODY_TAG_ATTR_NAME, "true");
    } else {
      let value = attrs[key];
      if (key === "key" || value === false) {
        continue;
      }
      if (key === "children") {
        el.textContent = value;
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "noscript",
  "htmlAttrs",
  "bodyAttrs"
];
var renderTemplate = (template, title) => {
  if (template == null)
    return "";
  if (typeof template === "string") {
    return template.replace("%s", title != null ? title : "");
  }
  return template(vue_cjs_prod.unref(title));
};
var headObjToTags = (obj) => {
  const tags = [];
  const keys = Object.keys(obj);
  for (const key of keys) {
    if (obj[key] == null)
      continue;
    switch (key) {
      case "title":
        tags.push({ tag: key, props: { children: obj[key] } });
        break;
      case "titleTemplate":
        break;
      case "base":
        tags.push({ tag: key, props: __spreadValues({ key: "default" }, obj[key]) });
        break;
      default:
        if (acceptFields.includes(key)) {
          const value = obj[key];
          if (Array.isArray(value)) {
            value.forEach((item) => {
              tags.push({ tag: key, props: item });
            });
          } else if (value) {
            tags.push({ tag: key, props: value });
          }
        }
        break;
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a, _b;
  const head = document2.head;
  const body = document2.body;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  let bodyMetaElements = body.querySelectorAll(`[${BODY_TAG_ATTR_NAME}]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldHeadElements = [];
  const oldBodyElements = [];
  if (bodyMetaElements) {
    for (let i = 0; i < bodyMetaElements.length; i++) {
      if (bodyMetaElements[i] && ((_a = bodyMetaElements[i].tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldBodyElements.push(bodyMetaElements[i]);
      }
    }
  }
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_b = j == null ? void 0 : j.tagName) == null ? void 0 : _b.toLowerCase()) === type) {
        oldHeadElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => {
    var _a2;
    return {
      element: createElement(tag.tag, tag.props, document2),
      body: (_a2 = tag.props.body) != null ? _a2 : false
    };
  });
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldHeadElements.length; i++) {
      const oldEl = oldHeadElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldHeadElements.splice(i, 1);
        return false;
      }
    }
    for (let i = 0; i < oldBodyElements.length; i++) {
      const oldEl = oldBodyElements[i];
      if (isEqualNode(oldEl, newEl.element)) {
        oldBodyElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldBodyElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  oldHeadElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    if (t.body === true) {
      body.insertAdjacentElement("beforeend", t.element);
    } else {
      head.insertBefore(t.element, headCountEl);
    }
  });
  headCountEl.setAttribute("content", "" + (headCount - oldHeadElements.length + newElements.filter((t) => !t.body).length));
};
var createHead = (initHeadObject) => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  if (initHeadObject) {
    allHeadObjs.push(vue_cjs_prod.shallowRef(initHeadObject));
  }
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      const titleTemplate = allHeadObjs.map((i) => vue_cjs_prod.unref(i).titleTemplate).reverse().find((i) => i != null);
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(vue_cjs_prod.unref(objs));
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index = i;
                  break;
                }
              }
              if (index !== -1) {
                deduped.splice(index, 1);
              }
            }
          }
          if (titleTemplate && tag.tag === "title") {
            tag.props.children = renderTemplate(titleTemplate, tag.props.children);
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document2, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i) => previousTags.add(i));
    }
  };
  return head;
};
var tagToString = (tag) => {
  let isBodyTag = false;
  if (tag.props.body) {
    isBodyTag = true;
    delete tag.props.body;
  }
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}${isBodyTag ? `  ${BODY_TAG_ATTR_NAME}="true"` : ""}>`;
  }
  return `<${tag.tag}${attrs}${isBodyTag ? ` ${BODY_TAG_ATTR_NAME}="true"` : ""}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  let bodyTags = [];
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else if (tag.props.body) {
      bodyTags.push(tagToString(tag));
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps(__spreadValues({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps(__spreadValues({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    },
    get bodyTags() {
      return bodyTags.join("");
    }
  };
};
function isObject(val) {
  return val !== null && typeof val === "object";
}
function _defu(baseObj, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObj, {}, namespace, merger);
  }
  const obj = Object.assign({}, defaults);
  for (const key in baseObj) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const val = baseObj[key];
    if (val === null || val === void 0) {
      continue;
    }
    if (merger && merger(obj, key, val, namespace)) {
      continue;
    }
    if (Array.isArray(val) && Array.isArray(obj[key])) {
      obj[key] = val.concat(obj[key]);
    } else if (isObject(val) && isObject(obj[key])) {
      obj[key] = _defu(val, obj[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      obj[key] = val;
    }
  }
  return obj;
}
function createDefu(merger) {
  return (...args) => args.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    vue_cjs_prod.watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = vue_cjs_prod.ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = vue_cjs_prod.ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = vue_cjs_prod.computed(() => {
      const overrides = { meta: [] };
      if (titleTemplate.value && "title" in meta2.value) {
        overrides.title = typeof titleTemplate.value === "function" ? titleTemplate.value(meta2.value.title) : titleTemplate.value.replace(/%s/g, meta2.value.title);
      }
      if (meta2.value.charset) {
        overrides.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides, meta2.value);
    });
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = vue_cjs_prod.defineComponent({
  name: "Script",
  inheritAttrs: false,
  props: {
    ...globalProps,
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  },
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = vue_cjs_prod.defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = vue_cjs_prod.defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = vue_cjs_prod.defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = vue_cjs_prod.defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  },
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = vue_cjs_prod.defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = { ...props };
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const metaConfig = { "globalMeta": { "charset": "utf-8", "viewport": "width=device-width, initial-scale=1, maximum-scale=1", "meta": [{ "hid": "title", "name": "title", "content": "AuroraNFT" }, { "hid": "description", "name": "description", "content": "description" }], "link": [{ "rel": "icon", "type": "image/x-icon", "href": "/favicon.ico" }, { "rel": "stylesheet", "href": "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" }, { "rel": "stylesheet", "href": "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.9.1/font/bootstrap-icons.css" }], "style": [{ "children": "html { height: 100% }", "type": "text/css" }], "script": [{ "src": "https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js" }], "title": "AuroraNFT" } };
const metaMixin = {
  created() {
    const instance = vue_cjs_prod.getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47head_47runtime_47plugin = defineNuxtPlugin((nuxtApp) => {
  useHead(vue_cjs_prod.markRaw({ title: "", ...metaConfig.globalMeta }));
  nuxtApp.vueApp.mixin(metaMixin);
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => m.components.default === routeProps.Component.type);
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const Fragment = {
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
};
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? vue_cjs_prod.h(component, props === true ? {} : props, slots) : vue_cjs_prod.h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    const isNested = vue_cjs_prod.inject(isNestedKey, false);
    vue_cjs_prod.provide(isNestedKey, true);
    return () => {
      return vue_cjs_prod.h(vueRouter_cjs_prod.RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(vue_cjs_prod.Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : vue_cjs_prod.h(vue_cjs_prod.Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const meta$e = {
  title: "404"
};
const _sfc_main$u = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="container py-5"><ul class="nav nav-tabs" id="myTab" role="tablist"><li class="nav-item" role="presentation"><button class="nav-link active" id="activity-tab" data-bs-toggle="tab" data-bs-target="#activity-tab-pane" type="button" role="tab" aria-controls="activity-tab-pane" aria-selected="true">Activity</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button></li><li class="nav-item" role="presentation"><button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button></li></ul><div class="tab-content" id="myTabContent"><div class="tab-pane fade show active" id="activity-tab-pane" role="tabpanel" aria-labelledby="activity-tab" tabindex="0"> No Activities </div><div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0"> this is content </div><div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0"> this is content </div></div></div></main>`);
    };
  }
});
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/index.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const meta$d = {
  title: "Activity"
};
const useLoading = () => useState("loading", () => false);
const useTimestamp = () => useState("timestamp", () => Date.parse(new Date().toString()));
const useWeb3 = () => useWeb3$1();
const useClipResult = () => useState("clipResult", () => false);
const _imports_0$1 = buildAssetsURL("logo.9641c0a8.png");
const MarketContractAddress = {
  5777: "0xB96aC9a526d5116a0F43e508b6bE4d6E40fad0A6",
  256: "0x110c600Fa6e3B29e22dCD50a0143205341EB5ca2"
};
const TokenAddressERC20 = {
  5777: "0x07248D2c3D295a4621171cFd7AD3D0f962BEC738",
  256: "0xd2f169c79553654452a3889b210AEeF494eB2374"
};
const NullAddress = "0x0000000000000000000000000000000000000000";
const ipfsUploadDomain = "http://127.0.0.1";
const ipfsUploadPort = ":5001";
const MarketABI = [
  {
    inputs: [
      {
        internalType: "address payable",
        name: "wallet_",
        type: "address"
      },
      {
        internalType: "address payable",
        name: "feeRecipient_",
        type: "address"
      },
      {
        internalType: "address",
        name: "newNFTFeeToken_",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "newNFTFeeAmount_",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "transferFeeRate_",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32"
      }
    ],
    name: "RoleAdminChanged",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleGranted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      }
    ],
    name: "RoleRevoked",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "address",
        name: "payToken",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "payAmount",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "createTime",
        type: "uint256"
      }
    ],
    name: "historyEvent",
    type: "event"
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "MANAGER_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "royalty",
        type: "uint256"
      }
    ],
    name: "addCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "marnagerAddress",
        type: "address"
      }
    ],
    name: "addManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "approve",
        type: "bool"
      }
    ],
    name: "auditCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "buy",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "collectionMap",
    outputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "string",
        name: "name",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string"
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "royalty",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "createTime",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "approve",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "show",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "deal",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [],
    name: "feeRecipient",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "getCollectionTokenList",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "getCurrentNFTId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      }
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "bool",
        name: "isBid",
        type: "bool"
      },
      {
        internalType: "address",
        name: "payToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "payAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "bonusRate",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256"
      }
    ],
    name: "list",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      }
    ],
    name: "listCancelled",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [],
    name: "maxBonusRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "maxRoyaltyRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "maxTransferFeeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "collection",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "string",
        name: "uri",
        type: "string"
      }
    ],
    name: "newNFT",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [],
    name: "newNFTFeeAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "newNFTFeeToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "nftById",
    outputs: [
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "address payable",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address payable",
        name: "creator",
        type: "address"
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string"
      },
      {
        internalType: "bool",
        name: "isBid",
        type: "bool"
      },
      {
        internalType: "bool",
        name: "onSale",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "nftIdMap",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "offer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "offerLast",
    outputs: [
      {
        internalType: "uint256",
        name: "offerId",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "paymentMap",
    outputs: [
      {
        internalType: "address",
        name: "lister",
        type: "address"
      },
      {
        internalType: "address",
        name: "payToken",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "payAmount",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "bonusRate",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "createTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "cancelTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "finishedTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "endTime",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "txRoundId",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "rateDenominator",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "marnagerAddress",
        type: "address"
      }
    ],
    name: "removeManager",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32"
      },
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string"
      }
    ],
    name: "setCollectionURI",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_feeRecipient",
        type: "address"
      }
    ],
    name: "setFeeRecipient",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxBonusRate",
        type: "uint256"
      }
    ],
    name: "setMaxBonusRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxRoyaltyRate",
        type: "uint256"
      }
    ],
    name: "setMaxRoyaltyRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_maxTransferFeeRate",
        type: "uint256"
      }
    ],
    name: "setMaxTransferFeeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_newNFTFeeAmount",
        type: "uint256"
      }
    ],
    name: "setNewNFTFeeAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newNFTFeeToken",
        type: "address"
      }
    ],
    name: "setNewNFTFeeToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_transferFeeRate",
        type: "uint256"
      }
    ],
    name: "setTransferFeeRate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "_wallet",
        type: "address"
      }
    ],
    name: "setWallet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "token",
        type: "address"
      },
      {
        internalType: "bool",
        name: "show",
        type: "bool"
      }
    ],
    name: "showCollection",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4"
      }
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "transferFeeRate",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    name: "txRoundIdByNFTId",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    inputs: [],
    name: "wallet",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  },
  {
    stateMutability: "payable",
    type: "receive",
    payable: true
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "nftId",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "txRoundId",
        type: "uint256"
      }
    ],
    name: "getOfferList",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "offerId",
            type: "uint256"
          },
          {
            internalType: "address",
            name: "account",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "createTime",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "finishedTime",
            type: "uint256"
          },
          {
            internalType: "uint256",
            name: "txRoundId",
            type: "uint256"
          }
        ],
        internalType: "struct Constant.Offer[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function",
    constant: true
  }
];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$t = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "collection",
  __ssrInlineRender: true,
  setup(__props) {
    const { $compare, $clip } = useNuxtApp();
    const loading = useLoading();
    const timestamp = useTimestamp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, library, chainId, timestamp], () => {
      if (!!library.value && !!account.value && !!chainId.value) {
        getCollectionList();
      }
    });
    const selectedAddress = vue_cjs_prod.ref("");
    const isCopy = useClipResult();
    const collectionList = vue_cjs_prod.ref([]);
    function getCollectionList() {
      collectionList.value = [];
      loading.value = true;
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.methods.getCollectionTokenList().call({ from: account.value }).then(async (tokenList) => {
        if (tokenList.length > 0) {
          const getResult = tokenList.map(async (item) => {
            const collection = await contract.methods.collectionMap(item).call();
            const { data } = await useAsyncData(collection.token, () => $fetch(collection.tokenURI), "$t7ofzy38ep");
            const tempItem = {
              ...collection,
              ...{ metadata: data.value }
            };
            collectionList.value.push(tempItem);
          });
          await Promise.all(getResult);
          if (collectionList.value.length > 0) {
            collectionList.value.sort($compare("createTime"));
          }
        }
        loading.value = false;
      });
    }
    vue_cjs_prod.onMounted(() => {
      getCollectionList();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "py-3 bg-light" }, _attrs))} data-v-418b75ef>`);
      if (collectionList.value.length > 0) {
        _push(`<div class="container" data-v-418b75ef><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-418b75ef><!--[-->`);
        serverRenderer.exports.ssrRenderList(collectionList.value, (item) => {
          _push(`<div class="col" data-v-418b75ef><div class="card shadow-sm position-relative" data-v-418b75ef><span class="${serverRenderer.exports.ssrRenderClass(`position-absolute top-0 start-100 translate-middle p-2 border border-light rounded-circle ${item.show ? "bg-success" : "bg-danger"}`)}" data-v-418b75ef><span class="visually-hidden" data-v-418b75ef>Is Show</span></span><img${serverRenderer.exports.ssrRenderAttr("src", _imports_0$1)} class="card-img-top" data-v-418b75ef><div class="card-body" data-v-418b75ef><h5 class="card-title" data-v-418b75ef>${serverRenderer.exports.ssrInterpolate(item.symbol)} - ${serverRenderer.exports.ssrInterpolate(item.name)} `);
          if (item.approve) {
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-418b75ef></i>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</h5><p class="card-text" data-v-418b75ef>${serverRenderer.exports.ssrInterpolate(item.metadata.description)}</p></div><ul class="list-group list-group-flush" data-v-418b75ef><li class="list-group-item" data-v-418b75ef> Token: <a class="${serverRenderer.exports.ssrRenderClass(`card-link ${vue_cjs_prod.unref(isCopy) && item.token === selectedAddress.value ? "text-success" : ""}`)}" data-v-418b75ef>${serverRenderer.exports.ssrInterpolate(item.token)} <i class="${serverRenderer.exports.ssrRenderClass(`bi ${vue_cjs_prod.unref(isCopy) && item.token === selectedAddress.value ? "bi-clipboard2-check" : "bi-clipboard2"}`)}" data-v-418b75ef></i></a></li><li class="list-group-item" data-v-418b75ef>Owner: ${serverRenderer.exports.ssrInterpolate(item.owner)}</li><li class="list-group-item" data-v-418b75ef>Royalty: ${serverRenderer.exports.ssrInterpolate(item.royalty)} %</li><li class="list-group-item" data-v-418b75ef>Create Time: ${serverRenderer.exports.ssrInterpolate(_ctx.$parseTime(item.createTime))}</li></ul><div class="card-body" data-v-418b75ef><div class="btn-group" data-v-418b75ef><button type="button" class="btn btn-sm btn-primary" data-v-418b75ef>${serverRenderer.exports.ssrInterpolate(item.approve ? "Audit Cancel" : "Audit Pass")}</button><button type="button" class="btn btn-sm btn-outline-primary" data-v-418b75ef>${serverRenderer.exports.ssrInterpolate(item.show ? "Show Cancel" : "Show Pass")}</button></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-418b75ef><div class="row py-lg-5" data-v-418b75ef><div class="col-lg-6 col-md-8 mx-auto" data-v-418b75ef><p class="lead text-muted" data-v-418b75ef>No NFTs to show here..</p><p data-v-418b75ef>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-418b75ef${_scopeId}> Create </button>`);
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/collection.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const __nuxt_component_0$2 = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-418b75ef"]]);
const useSubmit = () => useState("isSubmit", () => false);
const _sfc_main$s = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "staff",
  __ssrInlineRender: true,
  setup(__props) {
    const loading = useLoading();
    const isSubmit = useSubmit();
    const formAccount = vue_cjs_prod.ref(null);
    const accountIsValid = vue_cjs_prod.ref(false);
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, library, chainId], () => {
      if (!!library.value && !!account.value && !!chainId.value) {
        getCollectionRole();
      }
    });
    const roleManageValue = vue_cjs_prod.ref("");
    async function getCollectionRole() {
      loading.value = true;
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      roleManageValue.value = await contract.methods.MANAGER_ROLE().call();
      loading.value = false;
    }
    vue_cjs_prod.onMounted(() => {
      getCollectionRole();
    });
    const CollectionIsManage = vue_cjs_prod.ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "py-3" }, _attrs))}><div class="container"><h4>Staff Manage</h4>`);
      if (accountIsValid.value) {
        _push(`<div class="alert alert-danger fade show" role="alert"> Address is invalid!!! </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="${serverRenderer.exports.ssrRenderClass(`needs-validation ${vue_cjs_prod.unref(isSubmit) ? "was-validated" : ""}`)}" novalidate><div class="mb-3"><label for="account" class="form-label">Account</label><input class="form-control" id="account"${serverRenderer.exports.ssrRenderAttr("value", formAccount.value)} placeholder="Required Account Address" required><div class="invalid-feedback"> Required Account Address </div></div><div class="mb-3"><label for="account" class="form-label">Result: ${serverRenderer.exports.ssrInterpolate(CollectionIsManage.value)}</label></div><div class="mb-3"><button class="btn btn-primary" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(!formAccount.value || vue_cjs_prod.unref(loading) || accountIsValid.value) ? " disabled" : ""}>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Query")}</button><button class="btn btn-danger ms-3" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(!formAccount.value || vue_cjs_prod.unref(loading) || accountIsValid.value) ? " disabled" : ""}>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : CollectionIsManage.value ? "Remove" : "Approve")}</button></div></form></div></div>`);
    };
  }
});
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/manage/staff.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const _sfc_main$r = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/manage.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const meta$c = {
  title: "Manage"
};
const __nuxt_component_0$1 = vue_cjs_prod.defineComponent({
  name: "ClientOnly",
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  setup(_, { slots }) {
    const mounted = vue_cjs_prod.ref(false);
    vue_cjs_prod.onMounted(() => {
      mounted.value = true;
    });
    return (props) => {
      var _a;
      if (mounted.value) {
        return (_a = slots.default) == null ? void 0 : _a.call(slots);
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return slot();
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return vue_cjs_prod.createElementBlock(fallbackTag, null, fallbackStr);
    };
  }
});
const _sfc_main$q = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "nftList",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = vue_cjs_prod.ref();
    nftInfo.value = props.nftInfo;
    const loading = useLoading();
    const isSubmit = useSubmit();
    useTimestamp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        getBaseInfo();
      }
    });
    const formModel = vue_cjs_prod.ref({
      token: nftInfo.value.token,
      tokenId: nftInfo.value.tokenId,
      isBid: false,
      payToken: null,
      payAmount: null,
      bonusRate: 0,
      endTime: Date.parse(new Date().toString()) / 1e3 + 10 * 60,
      agreenTerms: false
    });
    const isBid = vue_cjs_prod.ref(true);
    const currentBonusRate = vue_cjs_prod.ref(0);
    const maxBonusRate = vue_cjs_prod.ref(0);
    async function getBaseInfo() {
      formModel.value.token = nftInfo.value.token;
      formModel.value.tokenId = nftInfo.value.tokenId;
      formModel.value.payToken = TokenAddressERC20[chainId.value];
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      maxBonusRate.value = await contract.methods.maxBonusRate().call({ from: account.value });
      const newNftInfo = await contract.methods.nftById(nftInfo.value.nftId).call();
      const tempItem = {
        ...nftInfo,
        ...newNftInfo
      };
      nftInfo.value = tempItem;
    }
    vue_cjs_prod.onMounted(() => {
      getBaseInfo();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ style: { "display": "inline-block" } }, _attrs))}><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalNftList"${serverRenderer.exports.ssrIncludeBooleanAttr(nftInfo.value.onSale) ? " disabled" : ""}> List </button><div class="modal fade" id="modalNftList" tabindex="-1" aria-labelledby="modalNftListLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalNftListLabel">NFT List</h5><button id="closeModalNftList" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="row g-5"><div class="col"><form class="${serverRenderer.exports.ssrRenderClass(`needs-validation ${vue_cjs_prod.unref(isSubmit) ? "was-validated" : ""}`)}" novalidate><div class="my-4"><label for="token" class="form-label">Token</label><input type="text" readonly class="form-control-plaintext" id="token"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.token)} required><div class="invalid-feedback"> You must input token </div></div><div class="my-4"><label for="tokenId" class="form-label">TokenId</label><input type="text" readonly class="form-control-plaintext" id="tokenId"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.tokenId)} required><div class="invalid-feedback"> You must input tokenId </div></div><div class="my-4"><label for="payToken" class="form-label">PayToken</label><input type="text" readonly class="form-control-plaintext" id="payToken"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.payToken)} required><div class="invalid-feedback"> You must input payToken </div></div><div class="my-4"><label for="payAmount" class="form-label">PayAmount</label><input type="number" class="form-control" id="payAmount"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.payAmount)} required><div class="invalid-feedback"> You must input payAmount </div></div><div class="my-4"><label for="isBid" class="form-label">Bid</label><div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="isBid" id="bidLimited"${serverRenderer.exports.ssrRenderAttr("value", false)}${serverRenderer.exports.ssrIncludeBooleanAttr(!isBid.value) ? " checked" : ""}><label class="form-check-label" for="bidLimited">Limited</label></div><div class="form-check form-check-inline"><input class="form-check-input" type="radio" name="isBid" id="bidAuction"${serverRenderer.exports.ssrRenderAttr("value", true)}${serverRenderer.exports.ssrIncludeBooleanAttr(isBid.value) ? " checked" : ""}><label class="form-check-label" for="bidAuction">Auction</label></div></div></div>`);
      if (isBid.value) {
        _push(`<div class="my-4"><label for="bonusRate" class="form-label">Bonus Rate: ${serverRenderer.exports.ssrInterpolate(currentBonusRate.value)} %</label><input type="range" class="form-range" min="0"${serverRenderer.exports.ssrRenderAttr("max", maxBonusRate.value)} step="1" id="bonusRate"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.bonusRate)}${serverRenderer.exports.ssrIncludeBooleanAttr(isBid.value) ? " required" : ""}></div>`);
      } else {
        _push(`<!---->`);
      }
      if (isBid.value) {
        _push(`<div class="my-4"><label for="endTime" class="form-label">EndTime</label><input type="number" class="form-control" id="endTime"${serverRenderer.exports.ssrRenderAttr("value", formModel.value.endTime)}${serverRenderer.exports.ssrIncludeBooleanAttr(isBid.value) ? " required" : ""}><div class="invalid-feedback"> You must input endTime </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="form-check"><input type="checkbox" class="form-check-input" id="agreenTerms"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(formModel.value.agreenTerms) ? serverRenderer.exports.ssrLooseContain(formModel.value.agreenTerms, null) : formModel.value.agreenTerms) ? " checked" : ""} required><label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade&#39;s Terms &amp; Conditions</label></div><hr class="my-4"><button class="w-100 btn btn-primary btn-lg" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(vue_cjs_prod.unref(loading)) ? " disabled" : ""}>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "NFT List")}</button></form></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modal/nftList.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const _sfc_main$p = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "list",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = props.nftInfo;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_ModalNftList = _sfc_main$q;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_ModalNftList, { nftInfo: vue_cjs_prod.unref(nftInfo) }, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_ModalNftList, { nftInfo: vue_cjs_prod.unref(nftInfo) }, null, 8, ["nftInfo"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/list.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const _sfc_main$o = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "paymentList",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = props.nftInfo;
    const { $compare, $truncateAccount, $parseTime } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        getNftPaymentList();
      }
    });
    const nftPaymentList = vue_cjs_prod.ref([]);
    async function getNftPaymentList() {
      nftPaymentList.value = [];
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      const txRoundIdByNFTId = await contract.methods.txRoundIdByNFTId(nftInfo.nftId).call();
      for (let index = 1; index <= txRoundIdByNFTId; index++) {
        const item = await contract.methods.paymentMap(nftInfo.nftId, index).call();
        const tempItem = {
          lister: $truncateAccount(item.lister),
          payToken: $truncateAccount(item.payToken),
          payAmount: JSBI.greaterThan(JSBI.BigInt(item.payAmount), JSBI.BigInt(0)) ? parseFloat(library.value.utils.fromWei(item.payAmount.toString())) : 0,
          bonusRate: item.bonusRate,
          createTime: $parseTime(parseInt(item.createTime)),
          cancelTime: $parseTime(parseInt(item.cancelTime)),
          finishedTime: $parseTime(parseInt(item.finishedTime)),
          endTime: $parseTime(parseInt(item.endTime)),
          txRoundId: item.txRoundId
        };
        nftPaymentList.value.push(tempItem);
      }
      nftPaymentList.value.sort($compare("txRoundId"));
    }
    vue_cjs_prod.onMounted(() => {
      getNftPaymentList();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><h4>Listings</h4><div class="table-responsive"><table class="table table-borderless"><thead><tr><th scope="col">FROM</th><th scope="col">PRICE</th><th scope="col">DATE</th><th scope="col">STATUS</th><th scope="col">ACTION</th></tr></thead>`);
      if (nftPaymentList.value.length > 0) {
        _push(`<tbody><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftPaymentList.value, (payment) => {
          _push(`<tr><td>${serverRenderer.exports.ssrInterpolate(payment.lister)}</td><td>${serverRenderer.exports.ssrInterpolate(payment.payAmount)}</td><td>${serverRenderer.exports.ssrInterpolate(payment.createTime)}</td>`);
          if (!payment.cancelTime && !payment.finishedTime) {
            _push(`<td class="text-primary">Active</td>`);
          } else {
            _push(`<!---->`);
          }
          if (payment.cancelTime && !payment.finishedTime) {
            _push(`<td class="text-danger">Cancelled</td>`);
          } else {
            _push(`<!---->`);
          }
          if (!payment.cancelTime && payment.finishedTime) {
            _push(`<td class="text-info">Finished</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td></td></tr>`);
        });
        _push(`<!--]--></tbody>`);
      } else {
        _push(`<tbody><tr class="text-center fw-lighter"><td colspan="5">No Data</td></tr></tbody>`);
      }
      _push(`</table></div></div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/paymentList.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "offerList",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = vue_cjs_prod.ref();
    nftInfo.value = props.nftInfo;
    const loading = useLoading();
    const timestamp = useTimestamp();
    const { $compare, $truncateAccount, $parseTime } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, timestamp], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        getNftOfferList();
      }
    });
    const nftOfferLast = vue_cjs_prod.ref();
    const nftOfferList = vue_cjs_prod.ref([]);
    async function getNftOfferList() {
      nftOfferList.value = [];
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      const txRoundIdByNFTId = await contract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
      nftOfferLast.value = await contract.methods.offerLast(nftInfo.value.nftId, txRoundIdByNFTId).call();
      contract.methods.getOfferList(nftInfo.value.nftId, txRoundIdByNFTId).call({ from: account.value }).then(async (value) => {
        if (value.length > 0) {
          const getResult = value.map((item) => {
            const tempItem2 = {
              offerId: item.offerId,
              account: $truncateAccount(item.account),
              amount: library.value.utils.fromWei(item.amount.toString()),
              createTime: $parseTime(parseInt(item.createTime.toString())),
              finishedTime: $parseTime(parseInt(item.finishedTime.toString())),
              txRoundId: item.txRoundId
            };
            nftOfferList.value.push(tempItem2);
          });
          await Promise.all(getResult);
          nftOfferList.value.sort($compare("offerId"));
        }
      });
      const newNftInfo = await contract.methods.nftById(nftInfo.value.nftId).call();
      const tempItem = {
        ...nftInfo,
        ...newNftInfo
      };
      nftInfo.value = tempItem;
    }
    vue_cjs_prod.onMounted(() => {
      getNftOfferList();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><h4>Offers</h4><div class="table-responsive"><table class="table table-borderless"><thead><tr><th scope="col">FROM</th><th scope="col">PRICE</th><th scope="col">DATE</th><th scope="col">STATUS</th><th scope="col">ACTION</th></tr></thead>`);
      if (nftOfferList.value.length > 0) {
        _push(`<tbody><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftOfferList.value, (offer) => {
          _push(`<tr><td>${serverRenderer.exports.ssrInterpolate(offer.account)}</td><td>${serverRenderer.exports.ssrInterpolate(offer.amount)}</td><td>${serverRenderer.exports.ssrInterpolate(offer.createTime)}</td>`);
          if (!offer.finishedTime && nftInfo.value.onSale) {
            _push(`<td class="text-primary">Active</td>`);
          } else {
            _push(`<!---->`);
          }
          if (!offer.finishedTime && !nftInfo.value.onSale) {
            _push(`<td class="text-danger">Failed</td>`);
          } else {
            _push(`<!---->`);
          }
          if (offer.finishedTime && !nftInfo.value.onSale) {
            _push(`<td class="text-info">Succeeded</td>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<td>`);
          if (offer.offerId === nftOfferLast.value.offerId && nftInfo.value.owner === vue_cjs_prod.unref(account) && nftInfo.value.onSale) {
            _push(`<button type="button" class="btn btn-outline-primary btn-sm" style="${serverRenderer.exports.ssrRenderStyle({ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" })}"${serverRenderer.exports.ssrIncludeBooleanAttr(vue_cjs_prod.unref(loading)) ? " disabled" : ""}>`);
            if (vue_cjs_prod.unref(loading)) {
              _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
            } else {
              _push(`<!---->`);
            }
            _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Accept")}</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</td></tr>`);
        });
        _push(`<!--]--></tbody>`);
      } else {
        _push(`<tbody><tr class="text-center fw-lighter"><td colspan="5">No Data</td></tr></tbody>`);
      }
      _push(`</table></div></div>`);
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/offerList.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const _sfc_main$m = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "historyList",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = props.nftInfo;
    const { $compare, $truncateAccount, $parseTime } = useNuxtApp();
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        getNftHistoryList();
      }
    });
    const nftHistoryList = vue_cjs_prod.ref([]);
    async function getNftHistoryList() {
      nftHistoryList.value = [];
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.events.allEvents({
        filter: {
          address: MarketContractAddress[chainId.value]
        }
      }, function(error, event) {
        console.log(error);
        console.log(event);
      });
      contract.getPastEvents("historyEvent", {
        filter: {
          token: nftInfo.token,
          tokenId: nftInfo.tokenId
        }
      }, async (error, events) => {
        if (events && events.length > 0) {
          const getResult = events.map((event) => {
            const tempItem = {
              ...event.returnValues,
              ...{
                blockHash: event.blockHash,
                blockNumber: event.blockNumber,
                token: $truncateAccount(event.returnValues.token),
                from: event.returnValues.from !== NullAddress ? $truncateAccount(event.returnValues.from) : "Null Address",
                to: event.returnValues.to !== NullAddress ? $truncateAccount(event.returnValues.to) : "",
                payToken: $truncateAccount(event.returnValues.payToken),
                payAmount: library.value.utils.fromWei(event.returnValues.payAmount.toString()),
                createTime: $parseTime(parseInt(event.returnValues.createTime.toString()))
              }
            };
            nftHistoryList.value.push(tempItem);
          });
          await Promise.all(getResult);
          nftHistoryList.value.sort($compare("blockNumber"));
        }
      });
    }
    vue_cjs_prod.onMounted(() => {
      getNftHistoryList();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><h4>History</h4><div class="table-responsive"><table class="table table-borderless"><thead><tr><th scope="col">EVENT</th><th scope="col">PRICE</th><th scope="col">FROM</th><th scope="col"></th><th scope="col">TO</th><th scope="col">DATE</th></tr></thead>`);
      if (nftHistoryList.value.length > 0) {
        _push(`<tbody><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftHistoryList.value, (history2) => {
          _push(`<tr><td>${serverRenderer.exports.ssrInterpolate(history2.name)}</td><td>${serverRenderer.exports.ssrInterpolate(parseFloat(history2.payAmount) > 0 ? history2.payAmount : "")}</td><td>${serverRenderer.exports.ssrInterpolate(history2.from)}</td><td>&gt;</td><td>${serverRenderer.exports.ssrInterpolate(history2.to)}</td><td>${serverRenderer.exports.ssrInterpolate(history2.createTime)}</td></tr>`);
        });
        _push(`<!--]--></tbody>`);
      } else {
        _push(`<tbody><tr class="text-center fw-lighter"><td colspan="5">No Data</td></tr></tbody>`);
      }
      _push(`</table></div></div>`);
    };
  }
});
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/historyList.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "[token]-[tokenId]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const token = route.params.token;
    const tokenId = route.params.tokenId;
    const loading = useLoading();
    const timestamp = useTimestamp();
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
      const { data } = await useAsyncData(nftId, () => $fetch(value.tokenURI), "$CrfTibqiLZ");
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
      const _component_NftList = _sfc_main$p;
      const _component_NftPaymentList = _sfc_main$o;
      const _component_NftOfferList = _sfc_main$n;
      const _component_NftHistoryList = _sfc_main$m;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-6671ea8c>`);
      if ((_a = nftInfo.value) == null ? void 0 : _a.token) {
        _push(`<section class="py-5 container" data-v-6671ea8c><div class="row py-lg-5" data-v-6671ea8c><div class="col-lg-6 col-md-12" data-v-6671ea8c><div class="ratio ratio-1x1 nft-img" data-v-6671ea8c><img${serverRenderer.exports.ssrRenderAttr("src", (_b = nftInfo.value.metadata) == null ? void 0 : _b.fileUrl)} data-v-6671ea8c></div></div><div class="col-lg-6 col-md-12" data-v-6671ea8c><div class="card border-0" data-v-6671ea8c><div class="card-body" data-v-6671ea8c><p class="card-text" data-v-6671ea8c>`);
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
          _push(`<i class="bi bi-patch-check-fill text-primary" data-v-6671ea8c></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div><div class="card-body" data-v-6671ea8c><h3 class="card-title" data-v-6671ea8c>${serverRenderer.exports.ssrInterpolate(nftInfo.value.metadata.name)}</h3><p class="card-text" data-v-6671ea8c> Owned by `);
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
        _push(`</p><div class="d-flex justify-content-start align-items-center" data-v-6671ea8c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`<button class="btn btn-danger ms-3" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(!nftInfo.value.onSale || vue_cjs_prod.unref(loading)) ? " disabled" : ""} data-v-6671ea8c>`);
        if (vue_cjs_prod.unref(loading)) {
          _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" data-v-6671ea8c></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "List Cancelled")}</button></div></div></div></div></div><div class="d-flex justify-content-start align-items-center pt-5 pb-5" id="list-example" data-v-6671ea8c><a href="#history" data-v-6671ea8c>History <i class="bi bi-link-45deg" data-v-6671ea8c></i></a><a class="ms-3" href="#offers" data-v-6671ea8c>Offers <i class="bi bi-link-45deg" data-v-6671ea8c></i></a><a class="ms-3" href="#listings" data-v-6671ea8c>Listings <i class="bi bi-link-45deg" data-v-6671ea8c></i></a></div><div class="mb-5" data-v-6671ea8c><h4 data-v-6671ea8c>Properties</h4><table class="table table-bordered" data-v-6671ea8c><thead data-v-6671ea8c><tr data-v-6671ea8c><th scope="col" data-v-6671ea8c>Property</th><th scope="col" data-v-6671ea8c>Value</th></tr></thead>`);
        if (nftInfo.value.metadata.properties.length > 0) {
          _push(`<tbody data-v-6671ea8c><!--[-->`);
          serverRenderer.exports.ssrRenderList(nftInfo.value.metadata.properties, (property) => {
            _push(`<tr data-v-6671ea8c><th data-v-6671ea8c>${serverRenderer.exports.ssrInterpolate(property.property)}</th><td data-v-6671ea8c>${serverRenderer.exports.ssrInterpolate(property.value)}</td></tr>`);
          });
          _push(`<!--]--></tbody>`);
        } else {
          _push(`<tbody data-v-6671ea8c><tr class="text-center fw-lighter" data-v-6671ea8c><td colspan="5" data-v-6671ea8c>No Data</td></tr></tbody>`);
        }
        _push(`</table></div><div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-offset="0" data-bs-smooth-scroll="true" class="scrollspy-example" tabindex="0" data-v-6671ea8c><div class="mb-5" id="listings" data-v-6671ea8c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftPaymentList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div><div class="mb-5" id="offers" data-v-6671ea8c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftOfferList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div><div class="mb-5" id="history" data-v-6671ea8c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NftHistoryList, {
          nftInfo: nftInfo.value,
          key: vue_cjs_prod.unref(timestamp)
        }, null, _parent));
        _push(`</div></div></section>`);
      } else {
        _push(`<section class="py-5 container" data-v-6671ea8c><div class="row" data-v-6671ea8c><div class="text-center" data-v-6671ea8c><div class="spinner-border" role="status" data-v-6671ea8c><span class="visually-hidden" data-v-6671ea8c>Loading...</span></div></div></div></section>`);
      }
      _push(`</main>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/nfts/[token]-[tokenId].vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const meta$b = {
  title: "NFTs"
};
const _sfc_main$k = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
              const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$ghobVsVmoh");
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
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/nfts/[token].vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const meta$a = {
  title: "NFTs - My Collection"
};
const _sfc_main$j = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
    const isCopy = useClipResult();
    const nftsList = vue_cjs_prod.ref([]);
    function getNftsList() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.methods.getCurrentNFTId().call({ from: account.value }).then(async (value) => {
        if (value > 0) {
          for (let index = 1; index <= value; index++) {
            const item = await contract.methods.nftById(index).call();
            if (item.owner === account.value) {
              const collection = await contract.methods.collectionMap(item.token).call();
              const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$MFBRb9eSda");
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
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-4dd9a748><section class="py-5 text-center container" data-v-4dd9a748><div class="row py-lg-5" data-v-4dd9a748><div class="col-lg-6 col-md-8 mx-auto" data-v-4dd9a748><h1 class="fw-light" data-v-4dd9a748>My NFTs</h1><p class="lead text-muted text-truncate" data-v-4dd9a748>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(account))}</p><p data-v-4dd9a748><button class="${serverRenderer.exports.ssrRenderClass(`btn my-2 ${vue_cjs_prod.unref(isCopy) ? "btn-success" : "btn-primary"}`)}" data-v-4dd9a748><i class="${serverRenderer.exports.ssrRenderClass(`bi ${vue_cjs_prod.unref(isCopy) ? "bi-clipboard2-check" : "bi-clipboard2"}`)}" data-v-4dd9a748></i> ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(isCopy) ? "Cope Success" : "Cope Address")}</button></p></div></div></section><div class="album py-5 bg-light" data-v-4dd9a748>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-4dd9a748><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-4dd9a748><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-4dd9a748><div class="card shadow-sm" data-v-4dd9a748><div class="card-body" data-v-4dd9a748><p class="card-text" data-v-4dd9a748>`);
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
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-4dd9a748></i>`);
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
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-4dd9a748${_scopeId}>`);
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
          _push(`<div class="card-body" data-v-4dd9a748><p class="card-text" data-v-4dd9a748>`);
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
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-4dd9a748><div class="btn-group" data-v-4dd9a748>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/account/nfts/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-4dd9a748${_scopeId}>View</button>`);
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
          _push(`</div><small class="text-muted" data-v-4dd9a748>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-4dd9a748><div class="row py-lg-5" data-v-4dd9a748><div class="col-lg-6 col-md-8 mx-auto" data-v-4dd9a748><p class="lead text-muted" data-v-4dd9a748>No NFTs to show here..</p><p data-v-4dd9a748>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-4dd9a748${_scopeId}> Create </button>`);
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
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/nfts/index.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const meta$9 = {
  title: "NFTs"
};
const meta$8 = {
  title: "Preferences"
};
const _sfc_main$i = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Account",
  __ssrInlineRender: true,
  props: {
    isTruncate: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const { account } = useWeb3();
    const isTruncate = props.isTruncate;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${serverRenderer.exports.ssrRenderAttrs(_attrs)}>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(isTruncate) ? _ctx.$truncateAccount(vue_cjs_prod.unref(account)) : vue_cjs_prod.unref(account))}</span>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/web3/Account.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
var SupportedChainId = /* @__PURE__ */ ((SupportedChainId2) => {
  SupportedChainId2[SupportedChainId2["BSC_MAINNET"] = 56] = "BSC_MAINNET";
  SupportedChainId2[SupportedChainId2["BSC_TESTNET"] = 97] = "BSC_TESTNET";
  SupportedChainId2[SupportedChainId2["HECO_MAINNET"] = 128] = "HECO_MAINNET";
  SupportedChainId2[SupportedChainId2["HECO_TESTNET"] = 256] = "HECO_TESTNET";
  SupportedChainId2[SupportedChainId2["LOCALHOST"] = 5777] = "LOCALHOST";
  return SupportedChainId2;
})(SupportedChainId || {});
const ALL_SUPPORTED_CHAIN_IDS = Object.values(SupportedChainId).filter(
  (id) => typeof id === "number"
);
const NETWORK_URLS = {
  [SupportedChainId.BSC_MAINNET]: `https://bsc-dataseed1.binance.org/`,
  [SupportedChainId.BSC_TESTNET]: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
  [SupportedChainId.HECO_MAINNET]: `https://http-mainnet.hecochain.com/`,
  [SupportedChainId.HECO_TESTNET]: `https://http-testnet.hecochain.com/`,
  [SupportedChainId.LOCALHOST]: ``
};
const CHAIN_INFO = {
  [SupportedChainId.BSC_MAINNET]: {
    networkType: 0,
    docs: "https://docs.daoswap.cc/",
    explorer: "https://bscscan.com/",
    infoLink: "https://info.bsc.daoswap.cc",
    officialLink: "https://bsc.www.daoswap.cc",
    label: "Binance Smart Chain Mainnet",
    logoUrl: _imports_0$1,
    addNetworkInfo: {
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.BSC_MAINNET]
    }
  },
  [SupportedChainId.BSC_TESTNET]: {
    networkType: 0,
    docs: "https://docs.daoswap.cc/",
    explorer: "https://testnet.bscscan.com/",
    infoLink: "https://info.chapel.daoswap.cc",
    officialLink: "https://bsc.www.daoswap.cc",
    label: "Binance Smart Chain Testnet",
    logoUrl: _imports_0$1,
    addNetworkInfo: {
      nativeCurrency: { name: "tBNB", symbol: "tBNB", decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.BSC_TESTNET]
    }
  },
  [SupportedChainId.HECO_MAINNET]: {
    networkType: 0,
    docs: "https://docs.daoswap.cc/",
    explorer: "https://hecoinfo.com/",
    infoLink: "https://info.heco.daoswap.cc",
    officialLink: "https://www.daoswap.cc",
    label: "Heco Chain Mainnet",
    logoUrl: _imports_0$1,
    addNetworkInfo: {
      nativeCurrency: { name: "HT", symbol: "HT", decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.HECO_MAINNET]
    }
  },
  [SupportedChainId.HECO_TESTNET]: {
    networkType: 0,
    docs: "https://docs.daoswap.cc/",
    explorer: "https://testnet.hecoinfo.com/",
    infoLink: "",
    officialLink: "https://www.daoswap.cc",
    label: "Heco Chain Testnet",
    logoUrl: _imports_0$1,
    addNetworkInfo: {
      nativeCurrency: { name: "htt", symbol: "htt", decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.HECO_TESTNET]
    }
  },
  [SupportedChainId.LOCALHOST]: {
    networkType: 0,
    docs: "",
    explorer: "",
    infoLink: "",
    officialLink: "",
    label: "Localhost",
    logoUrl: _imports_0$1,
    addNetworkInfo: {
      nativeCurrency: { name: "loc", symbol: "loc", decimals: 18 },
      rpcUrl: NETWORK_URLS[SupportedChainId.LOCALHOST]
    }
  }
};
const _sfc_main$h = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "Balance",
  __ssrInlineRender: true,
  setup(__props) {
    const { account, library, chainId } = useWeb3();
    const balance = vue_cjs_prod.ref();
    const nativeCurrencySymbol = vue_cjs_prod.ref();
    vue_cjs_prod.watch([account, library, chainId], () => {
      if (!!library.value && !!account.value) {
        library.value.eth.getBalance(account.value).then((value) => {
          balance.value = value;
        }).catch(() => {
        });
        const chainInfo = CHAIN_INFO[chainId.value];
        nativeCurrencySymbol.value = chainInfo ? chainInfo.addNetworkInfo.nativeCurrency.symbol : "";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<span${serverRenderer.exports.ssrRenderAttrs(_attrs)}>${serverRenderer.exports.ssrInterpolate(balance.value === null ? "Error" : balance.value ? `${vue_cjs_prod.unref(library).utils.fromWei(balance.value)}` : "")} ${serverRenderer.exports.ssrInterpolate(nativeCurrencySymbol.value)}</span>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/web3/Balance.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_spender",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_from",
        type: "address"
      },
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address"
      },
      {
        name: "_value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address"
      },
      {
        name: "_spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    payable: true,
    stateMutability: "payable",
    type: "fallback"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  }
];
const _sfc_main$g = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "TokenBalance",
  __ssrInlineRender: true,
  props: {
    tokenAddress: null
  },
  setup(__props) {
    const props = __props;
    const { account, library, chainId } = useWeb3();
    const address = vue_cjs_prod.ref();
    const name = vue_cjs_prod.ref();
    const symbol = vue_cjs_prod.ref();
    const balance = vue_cjs_prod.ref();
    vue_cjs_prod.watch([account, library, chainId], () => {
      address.value = props.tokenAddress[chainId.value];
      if (!!library.value && !!account.value) {
        const contract = new library.value.eth.Contract(ERC20_ABI, address.value);
        contract.methods.name().call({ from: account.value }).then((value) => {
          name.value = value;
        }).catch(() => {
        });
        contract.methods.symbol().call({ from: account.value }).then((value) => {
          symbol.value = value;
        }).catch(() => {
        });
        contract.methods.balanceOf(account.value).call({ from: account.value }).then((value) => {
          balance.value = value;
        }).catch(() => {
        });
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "card mb-3" }, _attrs))}><h4 class="card-header">${serverRenderer.exports.ssrInterpolate(symbol.value)}</h4><div class="card-body"><p class="card-text">Token Name: ${serverRenderer.exports.ssrInterpolate(name.value)}</p><p class="card-text">Token Symbol: ${serverRenderer.exports.ssrInterpolate(symbol.value)}</p><p class="card-text">Token Address: ${serverRenderer.exports.ssrInterpolate(address.value)}</p><p class="card-text">Token Balance: ${serverRenderer.exports.ssrInterpolate(balance.value === null ? "Error" : balance.value ? `${vue_cjs_prod.unref(library).utils.fromWei(balance.value)}` : "")}</p></div></div>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/web3/TokenBalance.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const DAO = {
  [SupportedChainId.BSC_MAINNET]: "0xc096332CAacF00319703558988aD03eC6586e704",
  [SupportedChainId.BSC_TESTNET]: "0xdb5D970F03bfD19c1E51D57BcEd114BC35A0808f",
  [SupportedChainId.HECO_MAINNET]: "0xc096332CAacF00319703558988aD03eC6586e704",
  [SupportedChainId.HECO_TESTNET]: "0xd2f169c79553654452a3889b210AEeF494eB2374",
  [SupportedChainId.LOCALHOST]: "0x07248D2c3D295a4621171cFd7AD3D0f962BEC738"
};
const USDT = {
  [SupportedChainId.BSC_MAINNET]: "0x55d398326f99059fF775485246999027B3197955",
  [SupportedChainId.BSC_TESTNET]: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
  [SupportedChainId.HECO_MAINNET]: "0xa71EdC38d189767582C38A3145b5873052c3e47a",
  [SupportedChainId.HECO_TESTNET]: "0x04F535663110A392A6504839BEeD34E019FdB4E0",
  [SupportedChainId.LOCALHOST]: "0x07248D2c3D295a4621171cFd7AD3D0f962BEC738"
};
const DST = {
  [SupportedChainId.BSC_MAINNET]: "0xC2ed68A614760BFE65e932329199d2F703219B8C",
  [SupportedChainId.BSC_TESTNET]: "0xd04808F83419776Cc85b7a1cf516a6dEeaA66F0D",
  [SupportedChainId.HECO_MAINNET]: "0xae21384FafC42FB8FA25706CB107185a98d5CB57",
  [SupportedChainId.HECO_TESTNET]: "0xd1c3d3cB6CE2D43aaBe8d1A78Dd5ADa60e5166c9",
  [SupportedChainId.LOCALHOST]: "0x07248D2c3D295a4621171cFd7AD3D0f962BEC738"
};
const _sfc_main$f = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/account/wallet.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const meta$7 = {
  title: "Account"
};
const TokenERC20ABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string"
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string"
      },
      {
        internalType: "uint256",
        name: "totalSupply_",
        type: "uint256"
      }
    ],
    stateMutability: "nonpayable",
    type: "constructor"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "OwnershipTransferred",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Paused",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "Unpaused",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "burnFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256"
      }
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256"
      }
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "paused",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address"
      }
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "unpause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256"
      }
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];
const _sfc_main$e = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "nftBuy",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = vue_cjs_prod.ref();
    nftInfo.value = props.nftInfo;
    const loading = useLoading();
    const timestamp = useTimestamp();
    const isSale = nftInfo.value.onSale && !nftInfo.value.isBid;
    const ableSale = vue_cjs_prod.ref(isSale);
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, timestamp], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        ableSale.value = isSale && account.value !== nftInfo.value.owner;
      }
    });
    const paymentToken = vue_cjs_prod.ref(null);
    const paymentAmount = vue_cjs_prod.ref("0");
    const ableBalance = vue_cjs_prod.ref(false);
    const ableApprove = vue_cjs_prod.ref(false);
    async function queryBalanceAndApprove() {
      const marketContractAddress = MarketContractAddress[chainId.value];
      const marketContract = new library.value.eth.Contract(MarketABI, marketContractAddress);
      const txRoundIdByNFTId = await marketContract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
      const paymentInfo = await marketContract.methods.paymentMap(nftInfo.value.nftId, txRoundIdByNFTId).call();
      paymentToken.value = paymentInfo.payToken;
      paymentAmount.value = paymentInfo.payAmount;
      const newNftInfo = await marketContract.methods.nftById(nftInfo.value.nftId).call();
      const tempItem = {
        ...nftInfo,
        ...newNftInfo
      };
      nftInfo.value = tempItem;
      const erc20Contract = new library.value.eth.Contract(TokenERC20ABI, paymentInfo.payToken);
      const balance = await erc20Contract.methods.balanceOf(account.value).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(balance), JSBI.BigInt(paymentAmount.value))) {
        ableBalance.value = true;
      } else {
        ableBalance.value = false;
      }
      const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(allowance), JSBI.BigInt(paymentAmount.value))) {
        ableApprove.value = true;
      } else {
        ableApprove.value = false;
      }
    }
    vue_cjs_prod.onMounted(() => {
      if (!!library.value && !!account.value && !!chainId.value) {
        ableSale.value = isSale && account.value !== nftInfo.value.owner;
        queryBalanceAndApprove();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ style: { "display": "inline-block" } }, _attrs))}><button class="w-100 btn btn-primary" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(!ableSale.value || vue_cjs_prod.unref(loading)) ? " disabled" : ""}>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Buy now")}</button></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modal/nftBuy.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "nftOffer",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = vue_cjs_prod.ref();
    nftInfo.value = props.nftInfo;
    const isSale = nftInfo.value.onSale && nftInfo.value.isBid;
    const ableSale = vue_cjs_prod.ref(isSale);
    const isExpire = vue_cjs_prod.ref(false);
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, isExpire], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        ableSale.value = isSale && account.value !== nftInfo.value.owner && !isExpire.value;
      }
    });
    const loading = useLoading();
    useSubmit();
    useTimestamp();
    const formModel = vue_cjs_prod.ref({
      token: nftInfo.value.token,
      tokenId: nftInfo.value.tokenId,
      amount: 0,
      agreenTerms: false
    });
    const offerAmount = vue_cjs_prod.ref(0);
    const paymentToken = vue_cjs_prod.ref(null);
    const paymentAmount = vue_cjs_prod.ref(0);
    const ableBalance = vue_cjs_prod.ref(false);
    const ableApprove = vue_cjs_prod.ref(false);
    async function queryBalanceAndApprove() {
      formModel.value.token = nftInfo.value.token;
      formModel.value.tokenId = nftInfo.value.tokenId;
      const marketContractAddress = MarketContractAddress[chainId.value];
      const marketContract = new library.value.eth.Contract(MarketABI, marketContractAddress);
      const txRoundIdByNFTId = await marketContract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
      const paymentInfo = await marketContract.methods.paymentMap(nftInfo.value.nftId, txRoundIdByNFTId).call();
      paymentToken.value = paymentInfo.payToken;
      paymentAmount.value = paymentInfo.payAmount;
      isExpire.value = parseInt(paymentInfo.endTime) <= Date.parse(new Date().toString()) / 1e3;
      const newNftInfo = await marketContract.methods.nftById(nftInfo.value.nftId).call();
      const tempItem = {
        ...nftInfo,
        ...newNftInfo
      };
      nftInfo.value = tempItem;
      const erc20Contract = new library.value.eth.Contract(TokenERC20ABI, paymentInfo.payToken);
      const balance = await erc20Contract.methods.balanceOf(account.value).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(balance), JSBI.BigInt(paymentAmount.value))) {
        ableBalance.value = true;
      } else {
        ableBalance.value = false;
      }
      const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(allowance), JSBI.BigInt(paymentAmount.value))) {
        ableApprove.value = true;
      } else {
        ableApprove.value = false;
      }
    }
    const minPrice = vue_cjs_prod.ref(0);
    const offerListLength = vue_cjs_prod.ref(0);
    const isAbleAmount = vue_cjs_prod.ref(false);
    const isAbleAgreen = vue_cjs_prod.ref(false);
    async function queryLastOffer() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      const txRoundIdByNFTId = await contract.methods.txRoundIdByNFTId(nftInfo.value.nftId).call();
      const offerLast = await contract.methods.offerLast(nftInfo.value.nftId, txRoundIdByNFTId).call();
      minPrice.value = parseFloat(library.value.utils.fromWei(offerLast.amount.toString(), "ether"));
      const offerList = await contract.methods.getOfferList(nftInfo.value.nftId, txRoundIdByNFTId).call();
      offerListLength.value = offerList.length;
      if (offerList.length > 0) {
        offerAmount.value = minPrice.value + 1;
      } else {
        offerAmount.value = minPrice.value;
      }
      isAbleAmount.value = true;
    }
    vue_cjs_prod.onMounted(() => {
      if (!!library.value && !!account.value && !!chainId.value) {
        queryBalanceAndApprove();
        queryLastOffer();
        ableSale.value = isSale && account.value !== nftInfo.value.owner && !isExpire.value;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ style: { "display": "inline-block" } }, _attrs))} data-v-0838ef2a><button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#modalNftOffer"${serverRenderer.exports.ssrIncludeBooleanAttr(!ableSale.value || vue_cjs_prod.unref(loading)) ? " disabled" : ""} data-v-0838ef2a>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" data-v-0838ef2a></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Place an offer")}</button><div class="modal fade" id="modalNftOffer" tabindex="-1" aria-labelledby="modalNftOfferLabel" aria-hidden="true" data-v-0838ef2a><div class="modal-dialog modal-lg modal-dialog-centered" data-v-0838ef2a><div class="modal-content" data-v-0838ef2a><div class="modal-header" data-v-0838ef2a><h5 class="modal-title" id="modalNftOfferLabel" data-v-0838ef2a>Place an Offer</h5><button id="closeModalNftOffer" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" data-v-0838ef2a></button></div><div class="modal-body" data-v-0838ef2a><div class="row g-5" data-v-0838ef2a><div class="col" data-v-0838ef2a><form data-v-0838ef2a><div class="my-4" data-v-0838ef2a><label for="amount" class="form-label" data-v-0838ef2a>Price</label><input type="number" class="${serverRenderer.exports.ssrRenderClass(`form-control ${isAbleAmount.value ? "is-valid" : "is-invalid"}`)}" id="amount" aria-describedby="validationAmountFeedback"${serverRenderer.exports.ssrRenderAttr("value", offerAmount.value)}${serverRenderer.exports.ssrRenderAttr("min", minPrice.value)} max="999999999999999999.999999999999999999" step="0.000000000000000001" required data-v-0838ef2a><div id="validationAmountFeedback" class="invalid-feedback" data-v-0838ef2a> You must input amount </div></div><div class="form-check" data-v-0838ef2a><input type="checkbox" class="${serverRenderer.exports.ssrRenderClass(`form-check-input ${isAbleAgreen.value ? "is-valid" : "is-invalid"}`)}" id="agreenTerms"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(formModel.value.agreenTerms) ? serverRenderer.exports.ssrLooseContain(formModel.value.agreenTerms, null) : formModel.value.agreenTerms) ? " checked" : ""} required data-v-0838ef2a><label class="form-check-label fw-lighter" for="agreenTerms" data-v-0838ef2a>I approve NFTrade&#39;s Terms &amp; Conditions</label></div><hr class="my-4" data-v-0838ef2a><button class="w-100 btn btn-primary btn-lg" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(vue_cjs_prod.unref(loading) || !isAbleAmount.value || !isAbleAgreen.value) ? " disabled" : ""} data-v-0838ef2a>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" data-v-0838ef2a></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Place Your Offer")}</button></form></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modal/nftOffer.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-0838ef2a"]]);
const _sfc_main$c = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "assets",
  __ssrInlineRender: true,
  props: {
    nftInfo: null
  },
  setup(__props) {
    const props = __props;
    const nftInfo = props.nftInfo;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_ModalNftBuy = _sfc_main$e;
      const _component_ModalNftOffer = __nuxt_component_2;
      _push(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_ModalNftBuy, { nftInfo: vue_cjs_prod.unref(nftInfo) }, null, _parent2, _scopeId));
            _push2(serverRenderer.exports.ssrRenderComponent(_component_ModalNftOffer, {
              nftInfo: vue_cjs_prod.unref(nftInfo),
              class: "ms-3"
            }, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_ModalNftBuy, { nftInfo: vue_cjs_prod.unref(nftInfo) }, null, 8, ["nftInfo"]),
              vue_cjs_prod.createVNode(_component_ModalNftOffer, {
                nftInfo: vue_cjs_prod.unref(nftInfo),
                class: "ms-3"
              }, null, 8, ["nftInfo"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/assets.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
      const { data } = await useAsyncData(nftId, () => $fetch(value.tokenURI), "$KR1fWx5UxX");
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assets/[token]-[tokenId].vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const meta$6 = {
  title: "NFTs - Detail"
};
const _sfc_main$a = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
            if (item.token === collectionAddress && item.onSale) {
              const collection = await contract.methods.collectionMap(item.token).call();
              const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$pw0RcgzQAW");
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
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-40027c76><section class="py-5 text-center container" data-v-40027c76><div class="row py-lg-5" data-v-40027c76><div class="col-lg-6 col-md-8 mx-auto" data-v-40027c76><h1 class="fw-light" data-v-40027c76>My Collection</h1><p class="lead text-muted text-truncate" data-v-40027c76>${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(collectionAddress))}</p><p data-v-40027c76><button class="${serverRenderer.exports.ssrRenderClass(`btn my-2 ${vue_cjs_prod.unref(isCopy) ? "btn-success" : "btn-primary"}`)}" data-v-40027c76><i class="${serverRenderer.exports.ssrRenderClass(`bi ${vue_cjs_prod.unref(isCopy) ? "bi-clipboard2-check" : "bi-clipboard2"}`)}" data-v-40027c76></i> ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(isCopy) ? "Cope Success" : "Cope Address")}</button></p></div></div></section><div class="album py-5 bg-light" data-v-40027c76>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-40027c76><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-40027c76><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-40027c76><div class="card shadow-sm" data-v-40027c76><div class="card-body" data-v-40027c76><p class="card-text" data-v-40027c76>`);
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
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-40027c76></i>`);
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
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-40027c76${_scopeId}>`);
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
          _push(`<div class="card-body" data-v-40027c76><p class="card-text" data-v-40027c76>`);
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
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-40027c76><div class="btn-group" data-v-40027c76>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-40027c76${_scopeId}>View</button>`);
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
          _push(`</div><small class="text-muted" data-v-40027c76>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-40027c76><div class="row py-lg-5" data-v-40027c76><div class="col-lg-6 col-md-8 mx-auto" data-v-40027c76><p class="lead text-muted" data-v-40027c76>No NFTs to show here..</p><p data-v-40027c76>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-40027c76${_scopeId}> Create </button>`);
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/assets/[token].vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const meta$5 = {
  title: "NFTs - Collection"
};
const _sfc_main$9 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
      contract.methods.getSaleNFTList(true, true).call({ from: account.value }).then(async (value) => {
        if (value.length > 0) {
          const getResult = value.map(async (item, index) => {
            const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$YKp8kPHBjb");
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
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-6e845cf6><section class="py-5 text-center container" data-v-6e845cf6><div class="row py-lg-5" data-v-6e845cf6><div class="col-lg-6 col-md-8 mx-auto" data-v-6e845cf6><h1 class="fw-light" data-v-6e845cf6>Auction NFTs</h1><p class="lead text-muted" data-v-6e845cf6>Auction</p><p data-v-6e845cf6><a href="/account/nfts" class="btn btn-primary my-2" data-v-6e845cf6>My Nfts</a></p></div></div></section><div class="album py-5 bg-light" data-v-6e845cf6>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-6e845cf6><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-6e845cf6><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-6e845cf6><div class="card shadow-sm" data-v-6e845cf6><div class="card-body" data-v-6e845cf6><p class="card-text" data-v-6e845cf6>`);
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
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-6e845cf6></i>`);
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
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-6e845cf6${_scopeId}>`);
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
          _push(`<div class="card-body" data-v-6e845cf6><p class="card-text" data-v-6e845cf6>`);
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
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-6e845cf6><div class="btn-group" data-v-6e845cf6>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-6e845cf6${_scopeId}>View</button>`);
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
          _push(`</div><small class="text-muted" data-v-6e845cf6>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-6e845cf6><div class="row py-lg-5" data-v-6e845cf6><div class="col-lg-6 col-md-8 mx-auto" data-v-6e845cf6><p class="lead text-muted" data-v-6e845cf6>No NFTs to show here..</p><p data-v-6e845cf6>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-6e845cf6${_scopeId}> Create </button>`);
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auction/index.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const meta$4 = {
  title: "Auction"
};
const defalutCollectionForm = {
  name: null,
  symbol: null,
  royalty: 0,
  verifyRights: false,
  agreenTerms: false
};
const _sfc_main$8 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "addCollection",
  __ssrInlineRender: true,
  setup(__props) {
    const { account, library, chainId } = useWeb3();
    vue_cjs_prod.watch([account, library, chainId], () => {
      if (!!account.value && !!library.value && !!chainId.value) {
        getBaseInfo();
      }
    });
    const loading = useLoading();
    const isSubmit = useSubmit();
    useTimestamp();
    const formModel = defalutCollectionForm;
    const currentRoyaltyRate = vue_cjs_prod.ref(0);
    const maxRoyaltyRate = vue_cjs_prod.ref(0);
    async function getBaseInfo() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      maxRoyaltyRate.value = await contract.methods.maxRoyaltyRate().call({ from: account.value });
    }
    vue_cjs_prod.onMounted(() => {
      getBaseInfo();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ style: { "display": "inline-block" } }, _attrs))}><button type="button" class="btn btn-outline-primary" style="${serverRenderer.exports.ssrRenderStyle({ "--bs-btn-padding-y": ".25rem", "--bs-btn-padding-x": ".5rem", "--bs-btn-font-size": ".75rem" })}" data-bs-toggle="modal" data-bs-target="#modalAddCollection"><i class="bi bi-plus"></i></button><div class="modal fade" id="modalAddCollection" tabindex="-1" aria-labelledby="modalAddCollectionLabel" aria-hidden="true"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="modalAddCollectionLabel">Create New Collection</h5><button id="closeModalAddCollection" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="row g-5"><div class="col"><p class="fw-lighter">When creating a new collection, you are deploying your own contract to the blockchain! NFTrade charges zero platform transaction fees, so you only need to pay for the network gas fees. This is a collection under your own unique contract, meaning you are the owner of the contract and you&#39;ll be able to add as many NFTs to that collection as you&#39;d like. Your minted tokens will receive incremental IDs starting from 1, increasing with each new NFT in the collection.</p><p class="fw-lighter">Since this is a unique contract address, you will have the opportunity to verify your collection later on.</p><form class="${serverRenderer.exports.ssrRenderClass(`needs-validation ${vue_cjs_prod.unref(isSubmit) ? "was-validated" : ""}`)}" novalidate><div class="my-4"><label for="name" class="form-label">Name</label><p class="fw-lighter">Crypto Punks / Meebits / etc..</p><input type="text" class="form-control" id="name" placeholder="Enter the collection&#39;s name"${serverRenderer.exports.ssrRenderAttr("value", vue_cjs_prod.unref(formModel).name)} required><div class="invalid-feedback"> You must choose a name </div></div><div class="my-4"><label for="symbol" class="form-label">Symbol</label><p class="fw-lighter">CPNKS / MBTS / etc..</p><input type="text" class="form-control" id="symbol" placeholder="Enter the collection&#39;s symbol"${serverRenderer.exports.ssrRenderAttr("value", vue_cjs_prod.unref(formModel).symbol)} required><div class="invalid-feedback"> You must choose a symbol </div></div><div class="my-4"><label for="royaltyRate" class="form-label">RoyaltyRate: ${serverRenderer.exports.ssrInterpolate(currentRoyaltyRate.value)} %</label><input type="range" class="form-range" min="0"${serverRenderer.exports.ssrRenderAttr("max", maxRoyaltyRate.value)} step="1" id="royaltyRate"${serverRenderer.exports.ssrRenderAttr("value", currentRoyaltyRate.value)} required></div><div class="my-4"></div><div class="form-check"><input type="checkbox" class="form-check-input" id="verifyRights"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(vue_cjs_prod.unref(formModel).verifyRights) ? serverRenderer.exports.ssrLooseContain(vue_cjs_prod.unref(formModel).verifyRights, null) : vue_cjs_prod.unref(formModel).verifyRights) ? " checked" : ""} required><label class="form-check-label fw-lighter" for="verifyRights">I verify I am minting a unique collection and that this is not a reproduction, stolen intellectual property, or a scam.</label></div><div class="form-check"><input type="checkbox" class="form-check-input" id="agreenTerms"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(vue_cjs_prod.unref(formModel).agreenTerms) ? serverRenderer.exports.ssrLooseContain(vue_cjs_prod.unref(formModel).agreenTerms, null) : vue_cjs_prod.unref(formModel).agreenTerms) ? " checked" : ""} required><label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade&#39;s Terms &amp; Conditions</label></div><hr class="my-4"><button class="w-100 btn btn-primary btn-lg" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(vue_cjs_prod.unref(loading)) ? " disabled" : ""}>`);
      if (vue_cjs_prod.unref(loading)) {
        _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Create Collection")}</button></form></div></div></div></div></div></div></div>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/modal/addCollection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _imports_0 = buildAssetsURL("avatar.c1f5a41d.png");
const _sfc_main$7 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "ConnectBtn",
  __ssrInlineRender: true,
  setup(__props) {
    const { active, account, deactivate } = useWeb3();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      if (vue_cjs_prod.unref(active)) {
        _push(`<div class="dropdown text-end"><a href="#" class="d-block link-light text-decoration-none dropdown-toggle" id="dropdownAccount" data-bs-toggle="dropdown" aria-expanded="false"><img${serverRenderer.exports.ssrRenderAttr("src", _imports_0)} alt="account" width="32" height="32" class="rounded-circle"> ${serverRenderer.exports.ssrInterpolate(_ctx.$truncateAccount(vue_cjs_prod.unref(account)))}</a><ul class="dropdown-menu text-small" aria-labelledby="dropdownAccount"><li><a class="dropdown-item disabled" href="/account"><i class="bi bi-person-circle"></i> My Account</a></li><li><a class="dropdown-item" href="/account/nfts"><i class="bi bi-columns-gap"></i> My NFTs</a></li><li><a class="dropdown-item" href="/account/wallet"><i class="bi bi-wallet-fill"></i> My wallet</a></li><li><a class="dropdown-item disabled" href="/account/preferences"><i class="bi bi-gear-fill"></i> Preferences</a></li><li><a class="dropdown-item" href="/account/manage"><i class="bi bi-kanban"></i> Manage</a></li><li><hr class="dropdown-divider"></li><li><button class="dropdown-item" type="button"><i class="bi bi-box-arrow-right"></i> Disconnect</button></li></ul></div>`);
      } else {
        _push(`<div><button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#modalConnectAccount"> Connect Account </button></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/web3/ConnectBtn.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const defalutNftForm = {
  fileUrl: null,
  name: null,
  description: null,
  properties: [],
  collection: null,
  approveRights: false,
  agreenTerms: false
};
const _sfc_main$6 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    create({ url: ipfsUploadDomain + ipfsUploadPort + "/api/v0" });
    const { account, library, chainId } = useWeb3();
    useRouter();
    const { $compare } = useNuxtApp();
    const loading = useLoading();
    const isSubmit = useSubmit();
    const timestamp = useTimestamp();
    const formModel = defalutNftForm;
    vue_cjs_prod.watch([account, library, timestamp], () => {
      if (!!library.value && !!account.value) {
        refreshCollection();
        queryBalanceAndApprove();
      }
    });
    const newNFTFeeToken = vue_cjs_prod.ref(null);
    const newNFTFeeAmount = vue_cjs_prod.ref("0");
    const ableBalance = vue_cjs_prod.ref(false);
    const ableApprove = vue_cjs_prod.ref(false);
    async function queryBalanceAndApprove() {
      const marketContractAddress = MarketContractAddress[chainId.value];
      const marketContract = new library.value.eth.Contract(MarketABI, marketContractAddress);
      newNFTFeeToken.value = await marketContract.methods.newNFTFeeToken().call();
      newNFTFeeAmount.value = await marketContract.methods.newNFTFeeAmount().call();
      const erc20Contract = new library.value.eth.Contract(TokenERC20ABI, newNFTFeeToken.value);
      const balance = await erc20Contract.methods.balanceOf(account.value).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(balance), JSBI.BigInt(newNFTFeeAmount.value))) {
        ableBalance.value = true;
      } else {
        ableBalance.value = false;
      }
      const allowance = await erc20Contract.methods.allowance(account.value, marketContractAddress).call();
      if (JSBI.greaterThanOrEqual(JSBI.BigInt(allowance), JSBI.BigInt(newNFTFeeAmount.value))) {
        ableApprove.value = true;
      } else {
        ableApprove.value = false;
      }
    }
    const collectionList = vue_cjs_prod.ref([]);
    function refreshCollection() {
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      collectionList.value = [];
      contract.methods.getCollectionTokenList().call({ from: account.value }).then(async (tokenList) => {
        if (tokenList.length > 0) {
          const getResult = tokenList.map(async (item) => {
            const collection = await contract.methods.collectionMap(item).call();
            if (collection.owner === account.value) {
              collectionList.value.push(collection);
            }
          });
          await Promise.all(getResult);
          if (collectionList.value.length > 0) {
            collectionList.value.sort($compare("createTime"));
            formModel.collection = collectionList.value[0].token;
          }
        }
      });
    }
    const propertiesList = useState("propertiesList", () => [{
      property: null,
      value: null
    }]);
    vue_cjs_prod.onMounted(() => {
      if (!!library.value && !!account.value && !!chainId.value) {
        refreshCollection();
        queryBalanceAndApprove();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_ModalAddCollection = _sfc_main$8;
      const _component_Web3ConnectBtn = _sfc_main$7;
      if (vue_cjs_prod.unref(account)) {
        _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="pb-5 text-center"><h2>Create NFTs</h2><p class="lead fw-lighter">NFTs can represent essentially any type of digital file, with artists creating NFTs featuring pictures, videos, gifs, audio files, and mixtures of them all. There are also utility NFT tokens, which provide a good or service and contain inherent value coded within them, what&#39;s your vision?</p></div><div class="row g-5"><div class="col"><form class="${serverRenderer.exports.ssrRenderClass(`needs-validation ${vue_cjs_prod.unref(isSubmit) ? "was-validated" : ""}`)}" novalidate><div class="row g-3"><div class="col-12"><label for="uploadFile" class="form-label">Upload File</label><p class="fw-lighter">Add your unique image / video / audio file</p><input class="form-control" type="file" id="uploadFile" required>`);
        if (vue_cjs_prod.unref(formModel).fileUrl) {
          _push(`<div class="text-center"><img${serverRenderer.exports.ssrRenderAttr("src", vue_cjs_prod.unref(formModel).fileUrl)} class="rounded" alt=""></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="invalid-feedback"> You must upload a file </div></div><div class="col-12"><label for="name" class="form-label">Name</label><p class="fw-lighter">Choose a unique name for your NFT</p><input type="text" class="form-control" id="name" placeholder="Enter the NFT&#39;s name"${serverRenderer.exports.ssrRenderAttr("value", vue_cjs_prod.unref(formModel).name)} required><div class="invalid-feedback"> You must choose a name </div></div><div class="col-12"><label for="description" class="form-label">Description</label><p class="fw-lighter">Describe your NFT, help other users understand what&#39;s unique about it</p><textarea class="form-control" id="description" rows="3" placeholder="Enter the NFT&#39;s description">${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formModel).description)}</textarea></div><div class="col-12"><label for="properties" class="form-label">Properties</label><p class="fw-lighter">List attributes that represents your NFT (color, shape, mood, etc..)</p><!--[-->`);
        serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(propertiesList), (item, index) => {
          _push(`<div class="row my-3"><div class="col-6"><input type="text" class="form-control"${serverRenderer.exports.ssrRenderAttr("id", `property-${index}`)} placeholder="Property"${serverRenderer.exports.ssrRenderAttr("value", item.property)}></div><div class="col-6"><input type="text" class="form-control"${serverRenderer.exports.ssrRenderAttr("id", `value-${index}`)} placeholder="Value"${serverRenderer.exports.ssrRenderAttr("value", item.value)}></div></div>`);
        });
        _push(`<!--]--></div><div class="col-12"><label for="collection" class="form-label"> Collection `);
        _push(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, null, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(serverRenderer.exports.ssrRenderComponent(_component_ModalAddCollection, null, null, _parent2, _scopeId));
            } else {
              return [
                vue_cjs_prod.createVNode(_component_ModalAddCollection)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</label><p class="fw-lighter">The collection where your NFT will appear.</p><div class="input-group has-validation"><select class="form-select" id="collection" aria-label="Select a Collection" placeholder="Select a Collection" required><!--[-->`);
        serverRenderer.exports.ssrRenderList(collectionList.value, (item) => {
          _push(`<option${serverRenderer.exports.ssrRenderAttr("value", item.token)}>${serverRenderer.exports.ssrInterpolate(item.name)}</option>`);
        });
        _push(`<!--]--></select><button class="btn btn-outline-secondary" type="button"><i class="bi bi-arrow-repeat"></i></button><div class="invalid-feedback"> You must choose / create a collection </div></div></div></div><hr class="my-4"><p class="fw-semibold fst-italic">Note, the process of minting an NFT is an irreversible process, make sure all the above details are right.</p><div class="form-check"><input type="checkbox" class="form-check-input" id="approveRights"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(vue_cjs_prod.unref(formModel).approveRights) ? serverRenderer.exports.ssrLooseContain(vue_cjs_prod.unref(formModel).approveRights, null) : vue_cjs_prod.unref(formModel).approveRights) ? " checked" : ""} required><label class="form-check-label fw-lighter" for="approveRights">I approve that I&#39;m the owner or have the rights of publication and sale.</label></div><div class="form-check"><input type="checkbox" class="form-check-input" id="agreenTerms"${serverRenderer.exports.ssrIncludeBooleanAttr(Array.isArray(vue_cjs_prod.unref(formModel).agreenTerms) ? serverRenderer.exports.ssrLooseContain(vue_cjs_prod.unref(formModel).agreenTerms, null) : vue_cjs_prod.unref(formModel).agreenTerms) ? " checked" : ""} required><label class="form-check-label fw-lighter" for="agreenTerms">I approve NFTrade&#39;s Terms &amp; Conditions</label></div><hr class="my-4">`);
        if (ableBalance.value) {
          _push(`<button class="w-100 btn btn-primary btn-lg" type="button"${serverRenderer.exports.ssrIncludeBooleanAttr(vue_cjs_prod.unref(loading)) ? " disabled" : ""}>`);
          if (vue_cjs_prod.unref(loading)) {
            _push(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(` ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(loading) ? "Loading..." : "Create")}</button>`);
        } else if (!ableBalance.value) {
          _push(`<button class="w-100 btn btn-primary btn-lg" type="button" disabled> Insufficient Balance </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</form></div></div></div>`);
      } else {
        _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="pb-5 text-center">`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_Web3ConnectBtn, null, null, _parent));
        _push(`</div></div>`);
      }
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/nft/create.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      const _component_NftCreate = _sfc_main$6;
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="container py-5">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_NftCreate, null, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_NftCreate)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></main>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/create/index.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const meta$3 = {
  title: "Create"
};
const meta$2 = {
  title: "Home"
};
const _sfc_main$4 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
          const getResult = value.map(async (item, index) => {
            const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$KjxPhhTtO8");
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/limited/index.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const meta$1 = {
  title: "Limited"
};
const _sfc_main$3 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
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
      const contract = new library.value.eth.Contract(MarketABI, MarketContractAddress[chainId.value]);
      contract.methods.getCurrentNFTId().call({ from: account.value }).then(async (value) => {
        if (value > 0) {
          for (let index = 1; index <= value; index++) {
            const item = await contract.methods.nftById(index).call();
            if (item.onSale) {
              const collection = await contract.methods.collectionMap(item.token).call();
              if (collection.show) {
                const { data } = await useAsyncData(index.toString(), () => $fetch(item.tokenURI), "$kR5Ko3Rioj");
                const tempItem = {
                  ...item,
                  ...{ collection, metadata: data.value }
                };
                nftsList.value.push(tempItem);
              }
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
      _push(`<main${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-8da4f852><section class="py-5 text-center container" data-v-8da4f852><div class="row py-lg-5" data-v-8da4f852><div class="col-lg-6 col-md-8 mx-auto" data-v-8da4f852><h1 class="fw-light" data-v-8da4f852>NFT Marketplace</h1><p class="lead text-muted" data-v-8da4f852>MarketplaceMarketplaceMarketplace</p></div></div></section><div class="album py-5 bg-light" data-v-8da4f852>`);
      if (nftsList.value.length > 0) {
        _push(`<div class="container" data-v-8da4f852><div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4" data-v-8da4f852><!--[-->`);
        serverRenderer.exports.ssrRenderList(nftsList.value, (item) => {
          _push(`<div class="col" data-v-8da4f852><div class="card shadow-sm" data-v-8da4f852><div class="card-body" data-v-8da4f852><p class="card-text" data-v-8da4f852>`);
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
            _push(`<i class="bi bi-patch-check-fill text-primary" data-v-8da4f852></i>`);
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
                _push2(`<img${serverRenderer.exports.ssrRenderAttr("src", (_a = item.metadata) == null ? void 0 : _a.fileUrl)} data-v-8da4f852${_scopeId}>`);
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
          _push(`<div class="card-body" data-v-8da4f852><p class="card-text" data-v-8da4f852>`);
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
          _push(`</p><div class="d-flex justify-content-between align-items-center" data-v-8da4f852><div class="btn-group" data-v-8da4f852>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
            to: `/assets/${item.token}-${item.tokenId}`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<button type="button" class="btn btn-sm btn-outline-primary" data-v-8da4f852${_scopeId}>View</button>`);
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
          _push(`</div><small class="text-muted" data-v-8da4f852>ID: ${serverRenderer.exports.ssrInterpolate(item.nftId)}</small></div></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      } else {
        _push(`<div class="container" data-v-8da4f852><div class="row py-lg-5" data-v-8da4f852><div class="col-lg-6 col-md-8 mx-auto" data-v-8da4f852><p class="lead text-muted" data-v-8da4f852>No NFTs to show here..</p><p data-v-8da4f852>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/create" }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<button type="button" class="btn btn-primary" data-v-8da4f852${_scopeId}> Create </button>`);
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/marketplace/index.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const meta = {
  title: "Marketplace"
};
const routes = [
  {
    name: "404",
    path: "/:catchAll(.*)*",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/404.vue",
    children: [],
    meta: meta$e,
    alias: (meta$e == null ? void 0 : meta$e.alias) || [],
    component: () => import('./404.699fe39b.mjs')
  },
  {
    name: "account",
    path: "/account",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/index.vue",
    children: [],
    meta: meta$d,
    alias: (meta$d == null ? void 0 : meta$d.alias) || [],
    component: () => import('./index.d6529200.mjs')
  },
  {
    name: "account-manage",
    path: "/account/manage",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/manage.vue",
    children: [],
    meta: meta$c,
    alias: (meta$c == null ? void 0 : meta$c.alias) || [],
    component: () => import('./manage.cd285785.mjs')
  },
  {
    name: "account-nfts-token-tokenId",
    path: "/account/nfts/:token-:tokenId",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/nfts/[token]-[tokenId].vue",
    children: [],
    meta: meta$b,
    alias: (meta$b == null ? void 0 : meta$b.alias) || [],
    component: () => import('./_token_-_tokenId_.7fcf9e73.mjs')
  },
  {
    name: "account-nfts-token",
    path: "/account/nfts/:token",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/nfts/[token].vue",
    children: [],
    meta: meta$a,
    alias: (meta$a == null ? void 0 : meta$a.alias) || [],
    component: () => import('./_token_.1816d52b.mjs')
  },
  {
    name: "account-nfts",
    path: "/account/nfts",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/nfts/index.vue",
    children: [],
    meta: meta$9,
    alias: (meta$9 == null ? void 0 : meta$9.alias) || [],
    component: () => import('./index.775d3aa0.mjs')
  },
  {
    name: "account-preferences",
    path: "/account/preferences",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/preferences.vue",
    children: [],
    meta: meta$8,
    alias: (meta$8 == null ? void 0 : meta$8.alias) || [],
    component: () => import('./preferences.e21e43fc.mjs')
  },
  {
    name: "account-wallet",
    path: "/account/wallet",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/account/wallet.vue",
    children: [],
    meta: meta$7,
    alias: (meta$7 == null ? void 0 : meta$7.alias) || [],
    component: () => import('./wallet.699287df.mjs')
  },
  {
    name: "assets-token-tokenId",
    path: "/assets/:token-:tokenId",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/assets/[token]-[tokenId].vue",
    children: [],
    meta: meta$6,
    alias: (meta$6 == null ? void 0 : meta$6.alias) || [],
    component: () => import('./_token_-_tokenId_.1d6bf925.mjs')
  },
  {
    name: "assets-token",
    path: "/assets/:token",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/assets/[token].vue",
    children: [],
    meta: meta$5,
    alias: (meta$5 == null ? void 0 : meta$5.alias) || [],
    component: () => import('./_token_.093d1402.mjs')
  },
  {
    name: "auction",
    path: "/auction",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/auction/index.vue",
    children: [],
    meta: meta$4,
    alias: (meta$4 == null ? void 0 : meta$4.alias) || [],
    component: () => import('./index.e7074490.mjs')
  },
  {
    name: "create",
    path: "/create",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/create/index.vue",
    children: [],
    meta: meta$3,
    alias: (meta$3 == null ? void 0 : meta$3.alias) || [],
    component: () => import('./index.224dd73f.mjs')
  },
  {
    name: "index",
    path: "/",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/index.vue",
    children: [],
    meta: meta$2,
    alias: (meta$2 == null ? void 0 : meta$2.alias) || [],
    component: () => import('./index.6fbb8418.mjs')
  },
  {
    name: "limited",
    path: "/limited",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/limited/index.vue",
    children: [],
    meta: meta$1,
    alias: (meta$1 == null ? void 0 : meta$1.alias) || [],
    component: () => import('./index.613db27a.mjs')
  },
  {
    name: "marketplace",
    path: "/marketplace",
    file: "/Users/blues/Workspaces/DaoswapDex/auroranft/page-frontend/pages/marketplace/index.vue",
    children: [],
    meta,
    alias: (meta == null ? void 0 : meta.alias) || [],
    component: () => import('./index.bf0d1baf.mjs')
  }
];
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions
};
const error_45global = defineNuxtRouteMiddleware((to) => {
  if ("middleware" in to.query) {
    return throwError("error in middleware");
  }
});
const globalMiddleware = [
  error_45global
];
const namedMiddleware = {};
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47pages_47runtime_47router = defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const routerHistory = vueRouter_cjs_prod.createMemoryHistory(baseURL2);
  const initialURL = nuxtApp.ssrContext.url;
  const router = vueRouter_cjs_prod.createRouter({
    ...routerOptions,
    history: routerHistory,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = vue_cjs_prod.shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _activeRoute.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a, _b, _c, _d;
    if (((_b = (_a = to.matched[0]) == null ? void 0 : _a.components) == null ? void 0 : _b.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const activeRoute = {};
  for (const key in _activeRoute.value) {
    activeRoute[key] = vue_cjs_prod.computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp._activeRoute = vue_cjs_prod.reactive(activeRoute);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      await router.push(initialURL);
    }
    await router.isReady();
  } catch (error2) {
    callWithNuxt(nuxtApp, throwError, [error2]);
  }
  router.beforeEach(async (to, from) => {
    var _a;
    to.meta = vue_cjs_prod.reactive(to.meta);
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a = namedMiddleware[entry2]) == null ? void 0 : _a.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError({
            statusMessage: `Route navigation aborted: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, throwError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, throwError, [createError({
        statusCode: 404,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        force: true
      });
    } catch (error2) {
      callWithNuxt(nuxtApp, throwError, [error2]);
    }
  });
  return { provide: { router } };
});
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47array_46ts = defineNuxtPlugin(() => {
  return {
    provide: {
      compare: (property) => {
        return function(a, b) {
          var value1 = a[property];
          var value2 = b[property];
          return value2 - value1;
        };
      }
    }
  };
});
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47error_46ts = defineNuxtPlugin((nuxtApp) => {
});
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47string_46ts = defineNuxtPlugin(() => {
  return {
    provide: {
      truncateAccount: (text, beginLength = 5, endLength = 4, suffix = "...") => {
        text = text.toLowerCase();
        let atLeastLength = beginLength + endLength;
        if (text.length > atLeastLength) {
          return text.substring(0, beginLength) + suffix + text.substring(text.length - endLength, text.length);
        } else {
          return text;
        }
      },
      clip: (text, event) => {
        const clipResult = useClipResult();
        const clipboard = new Clipboard(event.target, {
          action: () => "copy",
          text: () => text
        });
        clipboard.on("success", () => {
          clipboard.destroy();
          clipResult.value = true;
          setTimeout(() => {
            clipResult.value = false;
          }, 3e3);
        });
        clipboard.on("error", () => {
          clipboard.destroy();
        });
      }
    }
  };
});
const _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47time_46ts = defineNuxtPlugin(() => {
  return {
    provide: {
      parseTime: (time, cFormat) => {
        if (!time) {
          return null;
        }
        const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
        let date;
        if (typeof time === "object") {
          date = time;
        } else {
          if (typeof time === "string" && /^[0-9]+$/.test(time)) {
            time = parseInt(time);
          }
          if (typeof time === "number" && time.toString().length === 10) {
            time = time * 1e3;
          }
          date = new Date(time);
        }
        const formatObj = {
          y: date.getFullYear(),
          m: date.getMonth() + 1,
          d: date.getDate(),
          h: date.getHours(),
          i: date.getMinutes(),
          s: date.getSeconds(),
          a: date.getDay()
        };
        const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
          const value = formatObj[key];
          if (key === "a") {
            return ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"][value];
          }
          return value.toString().padStart(2, "0");
        });
        return time_str;
      }
    }
  };
});
const _plugins = [
  preload,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47_46nuxt_47components_46plugin_46mjs,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47head_47runtime_47lib_47vueuse_45head_46plugin,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47head_47runtime_47plugin,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47node_modules_47nuxt_47dist_47pages_47runtime_47router,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47array_46ts,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47error_46ts,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47string_46ts,
  _47Users_47blues_47Workspaces_47DaoswapDex_47auroranft_47page_45frontend_47plugins_47time_46ts
];
const _sfc_main$2 = /* @__PURE__ */ vue_cjs_prod.defineComponent({
  __name: "error",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$3;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        class: "relative font-sans",
        n: "green6"
      }, _attrs))}><div class="container max-w-200 mx-auto py-10 px-4"><h1>${serverRenderer.exports.ssrInterpolate(__props.error.message)}</h1> There was an error \u{1F631} <br><button> Clear error </button><br>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/404" }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Trigger another error `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" Trigger another error ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<br>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Navigate home `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" Navigate home ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("error.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    vue_cjs_prod.onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = vue_cjs_prod.resolveComponent("App");
      serverRenderer.exports.ssrRenderSuspense(_push, {
        default: () => {
          if (vue_cjs_prod.unref(error)) {
            _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$2), { error: vue_cjs_prod.unref(error) }, null, _parent));
          } else {
            _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const layouts = {
  default: vue_cjs_prod.defineAsyncComponent(() => import('./default.30579c04.mjs'))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0 = vue_cjs_prod.defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute();
    return () => {
      var _a, _b, _c;
      const layout = (_b = (_a = vue_cjs_prod.isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(vue_cjs_prod.Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_ClientOnly = __nuxt_component_0$1;
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(serverRenderer.exports.ssrRenderComponent(_component_ClientOnly, null, {
          default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent3, _scopeId2));
            } else {
              return [
                vue_cjs_prod.createVNode(_component_NuxtPage)
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          vue_cjs_prod.createVNode(_component_ClientOnly, null, {
            default: vue_cjs_prod.withCtx(() => [
              vue_cjs_prod.createVNode(_component_NuxtPage)
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch$1.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = vue_cjs_prod.createApp(_sfc_main$1);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      ssrContext.error = ssrContext.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { ALL_SUPPORTED_CHAIN_IDS as A, DAO as D, MarketABI as M, USDT as U, __nuxt_component_0$2 as _, useWeb3 as a, MarketContractAddress as b, _sfc_main$s as c, _export_sfc as d, entry$1 as default, useRoute as e, useTimestamp as f, useNuxtApp as g, useAsyncData as h, __nuxt_component_0$3 as i, _sfc_main$p as j, _sfc_main$o as k, _sfc_main$n as l, _sfc_main$m as m, useClipResult as n, DST as o, _sfc_main$i as p, _sfc_main$h as q, _sfc_main$g as r, _sfc_main$c as s, __nuxt_component_0$1 as t, useLoading as u, _sfc_main$6 as v, _imports_0$1 as w, _sfc_main$7 as x, useHead as y };
//# sourceMappingURL=server.mjs.map
