globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, defineMiddleware, useQuery, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { parseURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import { promises } from 'fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"public":{}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        entry.value = void 0;
        entry.integrity = void 0;
        entry.mtime = void 0;
        entry.expires = void 0;
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      return decodeURI(parseURL(event.req.originalUrl || event.req.url).pathname).replace(/\/$/, "/index");
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(_error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(_error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    description: "",
    data: _error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (errorObject.statusCode !== 404) {
    console.error("[nuxt] [request error]", errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const url = withQuery("/__nuxt_error", errorObject);
  const html = await $fetch(url).catch((error) => {
    console.error("[nitro] Error while generating error response", error);
    return errorObject.statusMessage;
  });
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/404.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"6ae-60X/UxPRZfAzjlL/p9NM3Hv4aGA\"",
    "mtime": "2022-08-07T07:29:13.052Z",
    "path": "../public/404.html"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"10be-8AKg7TrVn625RgXwaYnzCtbN9uc\"",
    "mtime": "2022-08-07T07:29:13.051Z",
    "path": "../public/favicon.ico"
  },
  "/_nuxt/404-796c7b0d.mjs": {
    "type": "application/javascript",
    "etag": "\"98-azKKWqtlqX8KrZWREW1lX0/vNW8\"",
    "mtime": "2022-08-07T07:29:13.050Z",
    "path": "../public/_nuxt/404-796c7b0d.mjs"
  },
  "/_nuxt/ConnectBtn-feb3cc6b.mjs": {
    "type": "application/javascript",
    "etag": "\"670-SklR6Rx/eDTDTcvodkYoIMKAx+g\"",
    "mtime": "2022-08-07T07:29:13.050Z",
    "path": "../public/_nuxt/ConnectBtn-feb3cc6b.mjs"
  },
  "/_nuxt/Market_abi-93ee176c.mjs": {
    "type": "application/javascript",
    "etag": "\"30c5-QZIIkQFtIDt7DkWCAhOIeA0jIfs\"",
    "mtime": "2022-08-07T07:29:13.050Z",
    "path": "../public/_nuxt/Market_abi-93ee176c.mjs"
  },
  "/_nuxt/TokenERC20_abi-e6f25529.mjs": {
    "type": "application/javascript",
    "etag": "\"1176-WH535ehTX1zeJUONXJpHyKL154c\"",
    "mtime": "2022-08-07T07:29:13.049Z",
    "path": "../public/_nuxt/TokenERC20_abi-e6f25529.mjs"
  },
  "/_nuxt/_token_-188646f7.mjs": {
    "type": "application/javascript",
    "etag": "\"d10-vATeP/wfeDqsNCZ3JnFxvWeyZn0\"",
    "mtime": "2022-08-07T07:29:13.049Z",
    "path": "../public/_nuxt/_token_-188646f7.mjs"
  },
  "/_nuxt/_token_-_tokenId_-306cd214.mjs": {
    "type": "application/javascript",
    "etag": "\"2c05-bmEANjemXWGzv6A7EzGSlY/GJNU\"",
    "mtime": "2022-08-07T07:29:13.048Z",
    "path": "../public/_nuxt/_token_-_tokenId_-306cd214.mjs"
  },
  "/_nuxt/_token_-_tokenId_-db15efd4.mjs": {
    "type": "application/javascript",
    "etag": "\"418e-xEXVndTlT0Bv5RolMNURo8/9LS8\"",
    "mtime": "2022-08-07T07:29:13.048Z",
    "path": "../public/_nuxt/_token_-_tokenId_-db15efd4.mjs"
  },
  "/_nuxt/_token_-d338dafe.mjs": {
    "type": "application/javascript",
    "etag": "\"d1e-KAPs2ixMgB5rei5u7I6h4C6sRpQ\"",
    "mtime": "2022-08-07T07:29:13.048Z",
    "path": "../public/_nuxt/_token_-d338dafe.mjs"
  },
  "/_nuxt/asyncData-5962a627.mjs": {
    "type": "application/javascript",
    "etag": "\"770-t7ZSlxB5rPdewB2KOWtWgvnISXI\"",
    "mtime": "2022-08-07T07:29:13.047Z",
    "path": "../public/_nuxt/asyncData-5962a627.mjs"
  },
  "/_nuxt/avatar.c1f5a41d.png": {
    "type": "image/png",
    "etag": "\"79e9-NCoGJIslWnz5IcZpYM/M6eKhn6Y\"",
    "mtime": "2022-08-07T07:29:13.047Z",
    "path": "../public/_nuxt/avatar.c1f5a41d.png"
  },
  "/_nuxt/default-4e4f1a05.mjs": {
    "type": "application/javascript",
    "etag": "\"16e134-wAhvHGmVM3LF1p1mx5rleY8sxrc\"",
    "mtime": "2022-08-07T07:29:13.046Z",
    "path": "../public/_nuxt/default-4e4f1a05.mjs"
  },
  "/_nuxt/default.d3855e97.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105-QLt278sxa2n3MSCsUiy/m1gRyFg\"",
    "mtime": "2022-08-07T07:29:13.043Z",
    "path": "../public/_nuxt/default.d3855e97.css"
  },
  "/_nuxt/entry-58e7afa6.mjs": {
    "type": "application/javascript",
    "etag": "\"5a468-3qYBeej9dhjiN/QNp9dPTnW9Cik\"",
    "mtime": "2022-08-07T07:29:13.042Z",
    "path": "../public/_nuxt/entry-58e7afa6.mjs"
  },
  "/_nuxt/entry.337e3319.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"419-3QNpP6gGMWyCNV83zX8t1pcrNns\"",
    "mtime": "2022-08-07T07:29:13.041Z",
    "path": "../public/_nuxt/entry.337e3319.css"
  },
  "/_nuxt/historyList-dda1ebec.mjs": {
    "type": "application/javascript",
    "etag": "\"19ee-P7oDKtZ9u1Wyzfy7jUZsp2Gn2EM\"",
    "mtime": "2022-08-07T07:29:13.040Z",
    "path": "../public/_nuxt/historyList-dda1ebec.mjs"
  },
  "/_nuxt/index-487b0846.mjs": {
    "type": "application/javascript",
    "etag": "\"cf8-raiehJsyyxacv6VAFoJhkk5dHCQ\"",
    "mtime": "2022-08-07T07:29:13.040Z",
    "path": "../public/_nuxt/index-487b0846.mjs"
  },
  "/_nuxt/index-55f693b2.mjs": {
    "type": "application/javascript",
    "etag": "\"36b99-MlZjOFjrfC8QAbzWGp6nyl2vbSQ\"",
    "mtime": "2022-08-07T07:29:13.039Z",
    "path": "../public/_nuxt/index-55f693b2.mjs"
  },
  "/_nuxt/index-84cf9ab8.mjs": {
    "type": "application/javascript",
    "etag": "\"da2e-rYcKtFcrf7ABTfQsNuCOsvtLEkU\"",
    "mtime": "2022-08-07T07:29:13.038Z",
    "path": "../public/_nuxt/index-84cf9ab8.mjs"
  },
  "/_nuxt/index-98f06f1e.mjs": {
    "type": "application/javascript",
    "etag": "\"c10-dQygBbt0FmYwKOhmXc9lrhl9dpo\"",
    "mtime": "2022-08-07T07:29:13.037Z",
    "path": "../public/_nuxt/index-98f06f1e.mjs"
  },
  "/_nuxt/index-a2651ab3.mjs": {
    "type": "application/javascript",
    "etag": "\"110b-EIQiLWSyxI1wbOkUE+s5gX2nrRE\"",
    "mtime": "2022-08-07T07:29:13.036Z",
    "path": "../public/_nuxt/index-a2651ab3.mjs"
  },
  "/_nuxt/index-c1f697fa.mjs": {
    "type": "application/javascript",
    "etag": "\"bf6-ljyfSCwwDxIBjs6gPuUtVliuOJA\"",
    "mtime": "2022-08-07T07:29:13.035Z",
    "path": "../public/_nuxt/index-c1f697fa.mjs"
  },
  "/_nuxt/index-d89574ba.mjs": {
    "type": "application/javascript",
    "etag": "\"bfb-hXZmrEPBNZtQAq0X1QX/ugbmdbM\"",
    "mtime": "2022-08-07T07:29:13.034Z",
    "path": "../public/_nuxt/index-d89574ba.mjs"
  },
  "/_nuxt/index-ebdd40bb.mjs": {
    "type": "application/javascript",
    "etag": "\"5d5-n+GKWza0DYhxIuXeP4RgIQlW+1s\"",
    "mtime": "2022-08-07T07:29:13.034Z",
    "path": "../public/_nuxt/index-ebdd40bb.mjs"
  },
  "/_nuxt/logo.9641c0a8.png": {
    "type": "image/png",
    "etag": "\"72b2-MeP3a52D5r7jFnXxwkJxvzt+nPc\"",
    "mtime": "2022-08-07T07:29:13.033Z",
    "path": "../public/_nuxt/logo.9641c0a8.png"
  },
  "/_nuxt/manage-0da39d2b.mjs": {
    "type": "application/javascript",
    "etag": "\"1f33-mXdhgYb+U95RKdLImsrycvWa6FM\"",
    "mtime": "2022-08-07T07:29:13.033Z",
    "path": "../public/_nuxt/manage-0da39d2b.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1bad-SPqlqq++X+XzJFe1YgS4bDjP7wE\"",
    "mtime": "2022-08-07T07:29:13.032Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/preferences-dffa95f5.mjs": {
    "type": "application/javascript",
    "etag": "\"c2-RwdupzHszcI2JNsxc+daMCFXS7g\"",
    "mtime": "2022-08-07T07:29:13.031Z",
    "path": "../public/_nuxt/preferences-dffa95f5.mjs"
  },
  "/_nuxt/useSubmit-99431132.mjs": {
    "type": "application/javascript",
    "etag": "\"bd-qZylCgcYyAHwSKyRbkOGXc9qCxU\"",
    "mtime": "2022-08-07T07:29:13.031Z",
    "path": "../public/_nuxt/useSubmit-99431132.mjs"
  },
  "/_nuxt/useWeb3-5d18194c.mjs": {
    "type": "application/javascript",
    "etag": "\"4bdf-Uz+M/EBmi+rv2qz+1f1BcMYMWRM\"",
    "mtime": "2022-08-07T07:29:13.030Z",
    "path": "../public/_nuxt/useWeb3-5d18194c.mjs"
  },
  "/_nuxt/wallet-7591d4b4.mjs": {
    "type": "application/javascript",
    "etag": "\"10c0-iC1L1juAbST0eCtkrGzhdKDMwpg\"",
    "mtime": "2022-08-07T07:29:13.029Z",
    "path": "../public/_nuxt/wallet-7591d4b4.mjs"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _f4b49z = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _bPKEl2 = defineMiddleware((req, res, next) => {
  if ("api" in useQuery(req)) {
    throw new Error("Server middleware error");
  }
  next();
});

const _lazy_D8VxB7 = () => import('../handlers/renderer.mjs').then(function (n) { return n.a; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _bPKEl2, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_D8VxB7, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_D8VxB7, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const hostname = process.env.NITRO_HOST || process.env.HOST || "0.0.0.0";
server.listen(port, hostname, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
