(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    __markAsModule(target);
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // .svelte-kit/output/server/chunks/index-1788aa30.js
  function noop() {
  }
  function run(fn) {
    return fn();
  }
  function blank_object() {
    return Object.create(null);
  }
  function run_all(fns) {
    fns.forEach(run);
  }
  function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  function subscribe(store, ...callbacks) {
    if (store == null) {
      return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
  }
  function set_current_component(component) {
    current_component = component;
  }
  function get_current_component() {
    if (!current_component)
      throw new Error("Function called outside component initialization");
    return current_component;
  }
  function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
  }
  function escape(html) {
    return String(html).replace(/["'&<>]/g, (match) => escaped[match]);
  }
  function each(items, fn) {
    let str = "";
    for (let i = 0; i < items.length; i += 1) {
      str += fn(items[i], i);
    }
    return str;
  }
  function validate_component(component, name) {
    if (!component || !component.$$render) {
      if (name === "svelte:component")
        name += " this={...}";
      throw new Error(`<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);
    }
    return component;
  }
  function create_ssr_component(fn) {
    function $$render(result, props, bindings, slots, context) {
      const parent_component = current_component;
      const $$ = {
        on_destroy,
        context: new Map(context || (parent_component ? parent_component.$$.context : [])),
        on_mount: [],
        before_update: [],
        after_update: [],
        callbacks: blank_object()
      };
      set_current_component({ $$ });
      const html = fn(result, props, bindings, slots);
      set_current_component(parent_component);
      return html;
    }
    return {
      render: (props = {}, { $$slots = {}, context = new Map() } = {}) => {
        on_destroy = [];
        const result = { title: "", head: "", css: new Set() };
        const html = $$render(result, props, {}, $$slots, context);
        run_all(on_destroy);
        return {
          html,
          css: {
            code: Array.from(result.css).map((css10) => css10.code).join("\n"),
            map: null
          },
          head: result.title + result.head
        };
      },
      $$render
    };
  }
  function add_attribute(name, value, boolean) {
    if (value == null || boolean && !value)
      return "";
    return ` ${name}${value === true && boolean_attributes.has(name) ? "" : `=${typeof value === "string" ? JSON.stringify(escape(value)) : `"${value}"`}`}`;
  }
  var current_component, boolean_attributes, escaped, missing_component, on_destroy;
  var init_index_1788aa30 = __esm({
    ".svelte-kit/output/server/chunks/index-1788aa30.js"() {
      Promise.resolve();
      boolean_attributes = new Set([
        "allowfullscreen",
        "allowpaymentrequest",
        "async",
        "autofocus",
        "autoplay",
        "checked",
        "controls",
        "default",
        "defer",
        "disabled",
        "formnovalidate",
        "hidden",
        "ismap",
        "loop",
        "multiple",
        "muted",
        "nomodule",
        "novalidate",
        "open",
        "playsinline",
        "readonly",
        "required",
        "reversed",
        "selected"
      ]);
      escaped = {
        '"': "&quot;",
        "'": "&#39;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
      };
      missing_component = {
        $$render: () => ""
      };
    }
  });

  // .svelte-kit/output/server/entries/pages/__layout.svelte.js
  var layout_svelte_exports = {};
  __export(layout_svelte_exports, {
    default: () => _layout
  });
  var Navbar, css, _layout;
  var init_layout_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/__layout.svelte.js"() {
      init_index_1788aa30();
      Navbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<nav class="${"bg-purple-500 flex justify-end w-full m-0 p-1 shadow-xl"}"><a class="${"font-epilogue text-md p-2 hover:text-red-500 hover:bg-purple-400 rounded mx-3 my-1"}" href="${"/"}">Home</a>
	<a class="${"font-epilogue text-md p-2 hover:text-green-500 hover:bg-purple-400 rounded mx-3 my-1"}" href="${"/about"}">About</a></nav>`;
      });
      css = {
        code: "@tailwind base;@tailwind components;@tailwind utilities;",
        map: null
      };
      _layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        $$result.css.add(css);
        return `<div class="${"p-0 mx-auto m-0 "}">${validate_component(Navbar, "Navbar").$$render($$result, {}, {}, {})}

	${slots.default ? slots.default({}) : ``}
</div>`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/0.js
  var __exports = {};
  __export(__exports, {
    css: () => css2,
    entry: () => entry,
    js: () => js,
    module: () => layout_svelte_exports
  });
  var entry, js, css2;
  var init__ = __esm({
    ".svelte-kit/output/server/nodes/0.js"() {
      init_layout_svelte();
      entry = "pages/__layout.svelte-e7f215c3.js";
      js = ["pages/__layout.svelte-e7f215c3.js", "chunks/vendor-e168ef23.js"];
      css2 = ["assets/pages/__layout.svelte-60775984.css"];
    }
  });

  // .svelte-kit/output/server/entries/pages/error.svelte.js
  var error_svelte_exports = {};
  __export(error_svelte_exports, {
    default: () => Error2,
    load: () => load
  });
  function load({ error: error2, status }) {
    return { props: { error: error2, status } };
  }
  var Error2;
  var init_error_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/error.svelte.js"() {
      init_index_1788aa30();
      Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        let { status } = $$props;
        let { error: error2 } = $$props;
        if ($$props.status === void 0 && $$bindings.status && status !== void 0)
          $$bindings.status(status);
        if ($$props.error === void 0 && $$bindings.error && error2 !== void 0)
          $$bindings.error(error2);
        return `<h1>${escape(status)}</h1>

<pre>${escape(error2.message)}</pre>



${error2.frame ? `<pre>${escape(error2.frame)}</pre>` : ``}
${error2.stack ? `<pre>${escape(error2.stack)}</pre>` : ``}`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/1.js
  var __exports2 = {};
  __export(__exports2, {
    css: () => css3,
    entry: () => entry2,
    js: () => js2,
    module: () => error_svelte_exports
  });
  var entry2, js2, css3;
  var init__2 = __esm({
    ".svelte-kit/output/server/nodes/1.js"() {
      init_error_svelte();
      entry2 = "error.svelte-726707c4.js";
      js2 = ["error.svelte-726707c4.js", "chunks/vendor-e168ef23.js"];
      css3 = [];
    }
  });

  // .svelte-kit/output/server/entries/pages/index.svelte.js
  var index_svelte_exports = {};
  __export(index_svelte_exports, {
    default: () => Routes
  });
  var Carousel, Event, Routes;
  var init_index_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/index.svelte.js"() {
      init_index_1788aa30();
      Carousel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<p class="${"font-epilogue text-center p-20"}">Insert Carousel here</p>`;
      });
      Event = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<h2><a href="${"/events"}" class="${"font-epilogue text-3xl font-black justify-start p-5"}">Events</a></h2>`;
      });
      Routes = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<h1 class="${"text-center font-epilogue font-black text-5xl p-2"}">ASU UTD</h1>

${validate_component(Carousel, "Carousel").$$render($$result, {}, {}, {})}
<p class="${"mx-4 font-epilogue p-4"}">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum aliquam repellat harum laborum non
	impedit error officia, fugit quis? Libero atque dicta quaerat ut harum laborum alias veniam minus!
	Nisi.
</p>
${validate_component(Event, "Event").$$render($$result, {}, {}, {})}`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/2.js
  var __exports3 = {};
  __export(__exports3, {
    css: () => css4,
    entry: () => entry3,
    js: () => js3,
    module: () => index_svelte_exports
  });
  var entry3, js3, css4;
  var init__3 = __esm({
    ".svelte-kit/output/server/nodes/2.js"() {
      init_index_svelte();
      entry3 = "pages/index.svelte-a69aa53b.js";
      js3 = ["pages/index.svelte-a69aa53b.js", "chunks/vendor-e168ef23.js"];
      css4 = [];
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/version.js
  var version;
  var init_version = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/version.js"() {
      version = "1.29.2";
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/constants.js
  var DEFAULT_HEADERS, STORAGE_KEY;
  var init_constants = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/constants.js"() {
      init_version();
      DEFAULT_HEADERS = { "X-Client-Info": `supabase-js/${version}` };
      STORAGE_KEY = "supabase.auth.token";
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/helpers.js
  function stripTrailingSlash(url) {
    return url.replace(/\/$/, "");
  }
  var isBrowser;
  var init_helpers = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/helpers.js"() {
      isBrowser = () => typeof window !== "undefined";
    }
  });

  // node_modules/cross-fetch/dist/browser-ponyfill.js
  var require_browser_ponyfill = __commonJS({
    "node_modules/cross-fetch/dist/browser-ponyfill.js"(exports, module) {
      var global = typeof self !== "undefined" ? self : exports;
      var __self__ = function() {
        function F() {
          this.fetch = false;
          this.DOMException = global.DOMException;
        }
        F.prototype = global;
        return new F();
      }();
      (function(self2) {
        var irrelevant = function(exports2) {
          var support = {
            searchParams: "URLSearchParams" in self2,
            iterable: "Symbol" in self2 && "iterator" in Symbol,
            blob: "FileReader" in self2 && "Blob" in self2 && function() {
              try {
                new Blob();
                return true;
              } catch (e) {
                return false;
              }
            }(),
            formData: "FormData" in self2,
            arrayBuffer: "ArrayBuffer" in self2
          };
          function isDataView(obj) {
            return obj && DataView.prototype.isPrototypeOf(obj);
          }
          if (support.arrayBuffer) {
            var viewClasses = [
              "[object Int8Array]",
              "[object Uint8Array]",
              "[object Uint8ClampedArray]",
              "[object Int16Array]",
              "[object Uint16Array]",
              "[object Int32Array]",
              "[object Uint32Array]",
              "[object Float32Array]",
              "[object Float64Array]"
            ];
            var isArrayBufferView = ArrayBuffer.isView || function(obj) {
              return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1;
            };
          }
          function normalizeName(name) {
            if (typeof name !== "string") {
              name = String(name);
            }
            if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
              throw new TypeError("Invalid character in header field name");
            }
            return name.toLowerCase();
          }
          function normalizeValue(value) {
            if (typeof value !== "string") {
              value = String(value);
            }
            return value;
          }
          function iteratorFor(items) {
            var iterator = {
              next: function() {
                var value = items.shift();
                return { done: value === void 0, value };
              }
            };
            if (support.iterable) {
              iterator[Symbol.iterator] = function() {
                return iterator;
              };
            }
            return iterator;
          }
          function Headers2(headers) {
            this.map = {};
            if (headers instanceof Headers2) {
              headers.forEach(function(value, name) {
                this.append(name, value);
              }, this);
            } else if (Array.isArray(headers)) {
              headers.forEach(function(header) {
                this.append(header[0], header[1]);
              }, this);
            } else if (headers) {
              Object.getOwnPropertyNames(headers).forEach(function(name) {
                this.append(name, headers[name]);
              }, this);
            }
          }
          Headers2.prototype.append = function(name, value) {
            name = normalizeName(name);
            value = normalizeValue(value);
            var oldValue = this.map[name];
            this.map[name] = oldValue ? oldValue + ", " + value : value;
          };
          Headers2.prototype["delete"] = function(name) {
            delete this.map[normalizeName(name)];
          };
          Headers2.prototype.get = function(name) {
            name = normalizeName(name);
            return this.has(name) ? this.map[name] : null;
          };
          Headers2.prototype.has = function(name) {
            return this.map.hasOwnProperty(normalizeName(name));
          };
          Headers2.prototype.set = function(name, value) {
            this.map[normalizeName(name)] = normalizeValue(value);
          };
          Headers2.prototype.forEach = function(callback, thisArg) {
            for (var name in this.map) {
              if (this.map.hasOwnProperty(name)) {
                callback.call(thisArg, this.map[name], name, this);
              }
            }
          };
          Headers2.prototype.keys = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push(name);
            });
            return iteratorFor(items);
          };
          Headers2.prototype.values = function() {
            var items = [];
            this.forEach(function(value) {
              items.push(value);
            });
            return iteratorFor(items);
          };
          Headers2.prototype.entries = function() {
            var items = [];
            this.forEach(function(value, name) {
              items.push([name, value]);
            });
            return iteratorFor(items);
          };
          if (support.iterable) {
            Headers2.prototype[Symbol.iterator] = Headers2.prototype.entries;
          }
          function consumed(body) {
            if (body.bodyUsed) {
              return Promise.reject(new TypeError("Already read"));
            }
            body.bodyUsed = true;
          }
          function fileReaderReady(reader) {
            return new Promise(function(resolve2, reject) {
              reader.onload = function() {
                resolve2(reader.result);
              };
              reader.onerror = function() {
                reject(reader.error);
              };
            });
          }
          function readBlobAsArrayBuffer(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsArrayBuffer(blob);
            return promise;
          }
          function readBlobAsText(blob) {
            var reader = new FileReader();
            var promise = fileReaderReady(reader);
            reader.readAsText(blob);
            return promise;
          }
          function readArrayBufferAsText(buf) {
            var view = new Uint8Array(buf);
            var chars2 = new Array(view.length);
            for (var i = 0; i < view.length; i++) {
              chars2[i] = String.fromCharCode(view[i]);
            }
            return chars2.join("");
          }
          function bufferClone(buf) {
            if (buf.slice) {
              return buf.slice(0);
            } else {
              var view = new Uint8Array(buf.byteLength);
              view.set(new Uint8Array(buf));
              return view.buffer;
            }
          }
          function Body() {
            this.bodyUsed = false;
            this._initBody = function(body) {
              this._bodyInit = body;
              if (!body) {
                this._bodyText = "";
              } else if (typeof body === "string") {
                this._bodyText = body;
              } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
                this._bodyBlob = body;
              } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
                this._bodyFormData = body;
              } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                this._bodyText = body.toString();
              } else if (support.arrayBuffer && support.blob && isDataView(body)) {
                this._bodyArrayBuffer = bufferClone(body.buffer);
                this._bodyInit = new Blob([this._bodyArrayBuffer]);
              } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
                this._bodyArrayBuffer = bufferClone(body);
              } else {
                this._bodyText = body = Object.prototype.toString.call(body);
              }
              if (!this.headers.get("content-type")) {
                if (typeof body === "string") {
                  this.headers.set("content-type", "text/plain;charset=UTF-8");
                } else if (this._bodyBlob && this._bodyBlob.type) {
                  this.headers.set("content-type", this._bodyBlob.type);
                } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
                  this.headers.set("content-type", "application/x-www-form-urlencoded;charset=UTF-8");
                }
              }
            };
            if (support.blob) {
              this.blob = function() {
                var rejected = consumed(this);
                if (rejected) {
                  return rejected;
                }
                if (this._bodyBlob) {
                  return Promise.resolve(this._bodyBlob);
                } else if (this._bodyArrayBuffer) {
                  return Promise.resolve(new Blob([this._bodyArrayBuffer]));
                } else if (this._bodyFormData) {
                  throw new Error("could not read FormData body as blob");
                } else {
                  return Promise.resolve(new Blob([this._bodyText]));
                }
              };
              this.arrayBuffer = function() {
                if (this._bodyArrayBuffer) {
                  return consumed(this) || Promise.resolve(this._bodyArrayBuffer);
                } else {
                  return this.blob().then(readBlobAsArrayBuffer);
                }
              };
            }
            this.text = function() {
              var rejected = consumed(this);
              if (rejected) {
                return rejected;
              }
              if (this._bodyBlob) {
                return readBlobAsText(this._bodyBlob);
              } else if (this._bodyArrayBuffer) {
                return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer));
              } else if (this._bodyFormData) {
                throw new Error("could not read FormData body as text");
              } else {
                return Promise.resolve(this._bodyText);
              }
            };
            if (support.formData) {
              this.formData = function() {
                return this.text().then(decode);
              };
            }
            this.json = function() {
              return this.text().then(JSON.parse);
            };
            return this;
          }
          var methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
          function normalizeMethod(method) {
            var upcased = method.toUpperCase();
            return methods.indexOf(upcased) > -1 ? upcased : method;
          }
          function Request2(input, options) {
            options = options || {};
            var body = options.body;
            if (input instanceof Request2) {
              if (input.bodyUsed) {
                throw new TypeError("Already read");
              }
              this.url = input.url;
              this.credentials = input.credentials;
              if (!options.headers) {
                this.headers = new Headers2(input.headers);
              }
              this.method = input.method;
              this.mode = input.mode;
              this.signal = input.signal;
              if (!body && input._bodyInit != null) {
                body = input._bodyInit;
                input.bodyUsed = true;
              }
            } else {
              this.url = String(input);
            }
            this.credentials = options.credentials || this.credentials || "same-origin";
            if (options.headers || !this.headers) {
              this.headers = new Headers2(options.headers);
            }
            this.method = normalizeMethod(options.method || this.method || "GET");
            this.mode = options.mode || this.mode || null;
            this.signal = options.signal || this.signal;
            this.referrer = null;
            if ((this.method === "GET" || this.method === "HEAD") && body) {
              throw new TypeError("Body not allowed for GET or HEAD requests");
            }
            this._initBody(body);
          }
          Request2.prototype.clone = function() {
            return new Request2(this, { body: this._bodyInit });
          };
          function decode(body) {
            var form = new FormData();
            body.trim().split("&").forEach(function(bytes) {
              if (bytes) {
                var split = bytes.split("=");
                var name = split.shift().replace(/\+/g, " ");
                var value = split.join("=").replace(/\+/g, " ");
                form.append(decodeURIComponent(name), decodeURIComponent(value));
              }
            });
            return form;
          }
          function parseHeaders(rawHeaders) {
            var headers = new Headers2();
            var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, " ");
            preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
              var parts = line.split(":");
              var key = parts.shift().trim();
              if (key) {
                var value = parts.join(":").trim();
                headers.append(key, value);
              }
            });
            return headers;
          }
          Body.call(Request2.prototype);
          function Response2(bodyInit, options) {
            if (!options) {
              options = {};
            }
            this.type = "default";
            this.status = options.status === void 0 ? 200 : options.status;
            this.ok = this.status >= 200 && this.status < 300;
            this.statusText = "statusText" in options ? options.statusText : "OK";
            this.headers = new Headers2(options.headers);
            this.url = options.url || "";
            this._initBody(bodyInit);
          }
          Body.call(Response2.prototype);
          Response2.prototype.clone = function() {
            return new Response2(this._bodyInit, {
              status: this.status,
              statusText: this.statusText,
              headers: new Headers2(this.headers),
              url: this.url
            });
          };
          Response2.error = function() {
            var response = new Response2(null, { status: 0, statusText: "" });
            response.type = "error";
            return response;
          };
          var redirectStatuses = [301, 302, 303, 307, 308];
          Response2.redirect = function(url, status) {
            if (redirectStatuses.indexOf(status) === -1) {
              throw new RangeError("Invalid status code");
            }
            return new Response2(null, { status, headers: { location: url } });
          };
          exports2.DOMException = self2.DOMException;
          try {
            new exports2.DOMException();
          } catch (err) {
            exports2.DOMException = function(message, name) {
              this.message = message;
              this.name = name;
              var error2 = Error(message);
              this.stack = error2.stack;
            };
            exports2.DOMException.prototype = Object.create(Error.prototype);
            exports2.DOMException.prototype.constructor = exports2.DOMException;
          }
          function fetch3(input, init) {
            return new Promise(function(resolve2, reject) {
              var request = new Request2(input, init);
              if (request.signal && request.signal.aborted) {
                return reject(new exports2.DOMException("Aborted", "AbortError"));
              }
              var xhr = new XMLHttpRequest();
              function abortXhr() {
                xhr.abort();
              }
              xhr.onload = function() {
                var options = {
                  status: xhr.status,
                  statusText: xhr.statusText,
                  headers: parseHeaders(xhr.getAllResponseHeaders() || "")
                };
                options.url = "responseURL" in xhr ? xhr.responseURL : options.headers.get("X-Request-URL");
                var body = "response" in xhr ? xhr.response : xhr.responseText;
                resolve2(new Response2(body, options));
              };
              xhr.onerror = function() {
                reject(new TypeError("Network request failed"));
              };
              xhr.ontimeout = function() {
                reject(new TypeError("Network request failed"));
              };
              xhr.onabort = function() {
                reject(new exports2.DOMException("Aborted", "AbortError"));
              };
              xhr.open(request.method, request.url, true);
              if (request.credentials === "include") {
                xhr.withCredentials = true;
              } else if (request.credentials === "omit") {
                xhr.withCredentials = false;
              }
              if ("responseType" in xhr && support.blob) {
                xhr.responseType = "blob";
              }
              request.headers.forEach(function(value, name) {
                xhr.setRequestHeader(name, value);
              });
              if (request.signal) {
                request.signal.addEventListener("abort", abortXhr);
                xhr.onreadystatechange = function() {
                  if (xhr.readyState === 4) {
                    request.signal.removeEventListener("abort", abortXhr);
                  }
                };
              }
              xhr.send(typeof request._bodyInit === "undefined" ? null : request._bodyInit);
            });
          }
          fetch3.polyfill = true;
          if (!self2.fetch) {
            self2.fetch = fetch3;
            self2.Headers = Headers2;
            self2.Request = Request2;
            self2.Response = Response2;
          }
          exports2.Headers = Headers2;
          exports2.Request = Request2;
          exports2.Response = Response2;
          exports2.fetch = fetch3;
          Object.defineProperty(exports2, "__esModule", { value: true });
          return exports2;
        }({});
      })(__self__);
      __self__.fetch.ponyfill = true;
      delete __self__.fetch.polyfill;
      var ctx = __self__;
      exports = ctx.fetch;
      exports.default = ctx.fetch;
      exports.fetch = ctx.fetch;
      exports.Headers = ctx.Headers;
      exports.Request = ctx.Request;
      exports.Response = ctx.Response;
      module.exports = exports;
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/fetch.js
  function _handleRequest(fetcher = import_cross_fetch.default, method, url, options, body) {
    return __awaiter(this, void 0, void 0, function* () {
      return new Promise((resolve2, reject) => {
        fetcher(url, _getRequestParams(method, options, body)).then((result) => {
          if (!result.ok)
            throw result;
          if (options === null || options === void 0 ? void 0 : options.noResolveJson)
            return resolve2;
          return result.json();
        }).then((data) => resolve2(data)).catch((error2) => handleError(error2, reject));
      });
    });
  }
  function get(fetcher, url, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return _handleRequest(fetcher, "GET", url, options);
    });
  }
  function post(fetcher, url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return _handleRequest(fetcher, "POST", url, options, body);
    });
  }
  function put(fetcher, url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return _handleRequest(fetcher, "PUT", url, options, body);
    });
  }
  function remove(fetcher, url, body, options) {
    return __awaiter(this, void 0, void 0, function* () {
      return _handleRequest(fetcher, "DELETE", url, options, body);
    });
  }
  var import_cross_fetch, __awaiter, _getErrorMessage, handleError, _getRequestParams;
  var init_fetch = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/fetch.js"() {
      import_cross_fetch = __toModule(require_browser_ponyfill());
      __awaiter = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      _getErrorMessage = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
      handleError = (error2, reject) => {
        if (typeof error2.json !== "function") {
          return reject(error2);
        }
        error2.json().then((err) => {
          return reject({
            message: _getErrorMessage(err),
            status: (error2 === null || error2 === void 0 ? void 0 : error2.status) || 500
          });
        });
      };
      _getRequestParams = (method, options, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === "GET") {
          return params;
        }
        params.headers = Object.assign({ "Content-Type": "text/plain;charset=UTF-8" }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return params;
      };
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/version.js
  var version2;
  var init_version2 = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/version.js"() {
      version2 = "1.22.0";
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/constants.js
  var GOTRUE_URL, DEFAULT_HEADERS2, EXPIRY_MARGIN, STORAGE_KEY2, COOKIE_OPTIONS;
  var init_constants2 = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/constants.js"() {
      init_version2();
      GOTRUE_URL = "http://localhost:9999";
      DEFAULT_HEADERS2 = { "X-Client-Info": `gotrue-js/${version2}` };
      EXPIRY_MARGIN = 60 * 1e3;
      STORAGE_KEY2 = "supabase.auth.token";
      COOKIE_OPTIONS = {
        name: "sb:token",
        lifetime: 60 * 60 * 8,
        domain: "",
        path: "/",
        sameSite: "lax"
      };
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/cookies.js
  function serialize(name, val, options) {
    const opt = options || {};
    const enc = encodeURIComponent;
    const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    if (typeof enc !== "function") {
      throw new TypeError("option encode is invalid");
    }
    if (!fieldContentRegExp.test(name)) {
      throw new TypeError("argument name is invalid");
    }
    const value = enc(val);
    if (value && !fieldContentRegExp.test(value)) {
      throw new TypeError("argument val is invalid");
    }
    let str = name + "=" + value;
    if (opt.maxAge != null) {
      const maxAge = opt.maxAge - 0;
      if (isNaN(maxAge) || !isFinite(maxAge)) {
        throw new TypeError("option maxAge is invalid");
      }
      str += "; Max-Age=" + Math.floor(maxAge);
    }
    if (opt.domain) {
      if (!fieldContentRegExp.test(opt.domain)) {
        throw new TypeError("option domain is invalid");
      }
      str += "; Domain=" + opt.domain;
    }
    if (opt.path) {
      if (!fieldContentRegExp.test(opt.path)) {
        throw new TypeError("option path is invalid");
      }
      str += "; Path=" + opt.path;
    }
    if (opt.expires) {
      if (typeof opt.expires.toUTCString !== "function") {
        throw new TypeError("option expires is invalid");
      }
      str += "; Expires=" + opt.expires.toUTCString();
    }
    if (opt.httpOnly) {
      str += "; HttpOnly";
    }
    if (opt.secure) {
      str += "; Secure";
    }
    if (opt.sameSite) {
      const sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
      switch (sameSite) {
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError("option sameSite is invalid");
      }
    }
    return str;
  }
  function isSecureEnvironment(req) {
    if (!req || !req.headers || !req.headers.host) {
      throw new Error('The "host" request header is not available');
    }
    const host = req.headers.host.indexOf(":") > -1 && req.headers.host.split(":")[0] || req.headers.host;
    if (["localhost", "127.0.0.1"].indexOf(host) > -1 || host.endsWith(".local")) {
      return false;
    }
    return true;
  }
  function serializeCookie(cookie, secure) {
    var _a, _b, _c;
    return serialize(cookie.name, cookie.value, {
      maxAge: cookie.maxAge,
      expires: new Date(Date.now() + cookie.maxAge * 1e3),
      httpOnly: true,
      secure,
      path: (_a = cookie.path) !== null && _a !== void 0 ? _a : "/",
      domain: (_b = cookie.domain) !== null && _b !== void 0 ? _b : "",
      sameSite: (_c = cookie.sameSite) !== null && _c !== void 0 ? _c : "lax"
    });
  }
  function setCookies(req, res, cookies) {
    const strCookies = cookies.map((c) => serializeCookie(c, isSecureEnvironment(req)));
    const previousCookies = res.getHeader("Set-Cookie");
    if (previousCookies) {
      if (previousCookies instanceof Array) {
        Array.prototype.push.apply(strCookies, previousCookies);
      } else if (typeof previousCookies === "string") {
        strCookies.push(previousCookies);
      }
    }
    res.setHeader("Set-Cookie", strCookies);
  }
  function setCookie(req, res, cookie) {
    setCookies(req, res, [cookie]);
  }
  function deleteCookie(req, res, name) {
    setCookie(req, res, {
      name,
      value: "",
      maxAge: -1
    });
  }
  var init_cookies = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/cookies.js"() {
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/helpers.js
  function expiresAt(expiresIn) {
    const timeNow = Math.round(Date.now() / 1e3);
    return timeNow + expiresIn;
  }
  function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == "x" ? r : r & 3 | 8;
      return v.toString(16);
    });
  }
  function getParameterByName(name, url) {
    var _a;
    if (!url)
      url = ((_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href) || "";
    name = name.replace(/[\[\]]/g, "\\$&");
    const regex = new RegExp("[?&#]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
    if (!results)
      return null;
    if (!results[2])
      return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }
  var isBrowser2;
  var init_helpers2 = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/helpers.js"() {
      isBrowser2 = () => typeof window !== "undefined";
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/GoTrueApi.js
  var __awaiter2, GoTrueApi;
  var init_GoTrueApi = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/GoTrueApi.js"() {
      init_fetch();
      init_constants2();
      init_cookies();
      init_helpers2();
      __awaiter2 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      GoTrueApi = class {
        constructor({ url = "", headers = {}, cookieOptions, fetch: fetch3 }) {
          this.url = url;
          this.headers = headers;
          this.cookieOptions = Object.assign(Object.assign({}, COOKIE_OPTIONS), cookieOptions);
          this.fetch = fetch3;
        }
        _createRequestHeaders(jwt) {
          const headers = Object.assign({}, this.headers);
          headers["Authorization"] = `Bearer ${jwt}`;
          return headers;
        }
        cookieName() {
          var _a;
          return (_a = this.cookieOptions.name) !== null && _a !== void 0 ? _a : "";
        }
        getUrlForProvider(provider, options) {
          const urlParams = [`provider=${encodeURIComponent(provider)}`];
          if (options === null || options === void 0 ? void 0 : options.redirectTo) {
            urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
          }
          if (options === null || options === void 0 ? void 0 : options.scopes) {
            urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
          }
          return `${this.url}/authorize?${urlParams.join("&")}`;
        }
        signUpWithEmail(email, password, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              let queryString = "";
              if (options.redirectTo) {
                queryString = "?redirect_to=" + encodeURIComponent(options.redirectTo);
              }
              const data = yield post(this.fetch, `${this.url}/signup${queryString}`, {
                email,
                password,
                data: options.data,
                gotrue_meta_security: { hcaptcha_token: options.captchaToken }
              }, { headers });
              const session = Object.assign({}, data);
              if (session.expires_in)
                session.expires_at = expiresAt(data.expires_in);
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        signInWithEmail(email, password, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              let queryString = "?grant_type=password";
              if (options.redirectTo) {
                queryString += "&redirect_to=" + encodeURIComponent(options.redirectTo);
              }
              const data = yield post(this.fetch, `${this.url}/token${queryString}`, { email, password }, { headers });
              const session = Object.assign({}, data);
              if (session.expires_in)
                session.expires_at = expiresAt(data.expires_in);
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        signUpWithPhone(phone, password, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              const data = yield post(this.fetch, `${this.url}/signup`, {
                phone,
                password,
                data: options.data,
                gotrue_meta_security: { hcaptcha_token: options.captchaToken }
              }, { headers });
              const session = Object.assign({}, data);
              if (session.expires_in)
                session.expires_at = expiresAt(data.expires_in);
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        signInWithPhone(phone, password) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              const queryString = "?grant_type=password";
              const data = yield post(this.fetch, `${this.url}/token${queryString}`, { phone, password }, { headers });
              const session = Object.assign({}, data);
              if (session.expires_in)
                session.expires_at = expiresAt(data.expires_in);
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        sendMagicLinkEmail(email, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              let queryString = "";
              if (options.redirectTo) {
                queryString += "?redirect_to=" + encodeURIComponent(options.redirectTo);
              }
              const data = yield post(this.fetch, `${this.url}/magiclink${queryString}`, { email, gotrue_meta_security: { hcaptcha_token: options.captchaToken } }, { headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        sendMobileOTP(phone, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              let headers = Object.assign({}, this.headers);
              const data = yield post(this.fetch, `${this.url}/otp`, { phone, gotrue_meta_security: { hcaptcha_token: options.captchaToken } }, { headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        signOut(jwt) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              yield post(this.fetch, `${this.url}/logout`, {}, { headers: this._createRequestHeaders(jwt), noResolveJson: true });
              return { error: null };
            } catch (e) {
              return { error: e };
            }
          });
        }
        verifyMobileOTP(phone, token, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              const data = yield post(this.fetch, `${this.url}/verify`, { phone, token, type: "sms", redirect_to: options.redirectTo }, { headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        inviteUserByEmail(email, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              let queryString = "";
              if (options.redirectTo) {
                queryString += "?redirect_to=" + encodeURIComponent(options.redirectTo);
              }
              const data = yield post(this.fetch, `${this.url}/invite${queryString}`, { email, data: options.data }, { headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        resetPasswordForEmail(email, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const headers = Object.assign({}, this.headers);
              let queryString = "";
              if (options.redirectTo) {
                queryString += "?redirect_to=" + encodeURIComponent(options.redirectTo);
              }
              const data = yield post(this.fetch, `${this.url}/recover${queryString}`, { email, gotrue_meta_security: { hcaptcha_token: options.captchaToken } }, { headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        refreshAccessToken(refreshToken) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield post(this.fetch, `${this.url}/token?grant_type=refresh_token`, { refresh_token: refreshToken }, { headers: this.headers });
              const session = Object.assign({}, data);
              if (session.expires_in)
                session.expires_at = expiresAt(data.expires_in);
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        setAuthCookie(req, res) {
          var _a;
          if (req.method !== "POST") {
            res.setHeader("Allow", "POST");
            res.status(405).end("Method Not Allowed");
          }
          const { event, session } = req.body;
          if (!event)
            throw new Error("Auth event missing!");
          if (event === "SIGNED_IN") {
            if (!session)
              throw new Error("Auth session missing!");
            setCookie(req, res, {
              name: this.cookieName(),
              value: session.access_token,
              domain: this.cookieOptions.domain,
              maxAge: (_a = this.cookieOptions.lifetime) !== null && _a !== void 0 ? _a : 0,
              path: this.cookieOptions.path,
              sameSite: this.cookieOptions.sameSite
            });
          }
          if (event === "SIGNED_OUT")
            deleteCookie(req, res, this.cookieName());
          res.status(200).json({});
        }
        generateLink(type, email, options = {}) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield post(this.fetch, `${this.url}/admin/generate_link`, {
                type,
                email,
                password: options.password,
                data: options.data,
                redirect_to: options.redirectTo
              }, { headers: this.headers });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        createUser(attributes) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield post(this.fetch, `${this.url}/admin/users`, attributes, {
                headers: this.headers
              });
              return { user: data, data, error: null };
            } catch (e) {
              return { user: null, data: null, error: e };
            }
          });
        }
        listUsers() {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield get(this.fetch, `${this.url}/admin/users`, {
                headers: this.headers
              });
              return { data: data.users, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        getUserById(uid) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield get(this.fetch, `${this.url}/admin/users/${uid}`, {
                headers: this.headers
              });
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        getUserByCookie(req) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              if (!req.cookies) {
                throw new Error("Not able to parse cookies! When using Express make sure the cookie-parser middleware is in use!");
              }
              const token = req.cookies[this.cookieName()];
              if (!token) {
                throw new Error("No cookie found!");
              }
              const { user, error: error2 } = yield this.getUser(token);
              if (error2)
                throw error2;
              return { token, user, data: user, error: null };
            } catch (e) {
              return { token: null, user: null, data: null, error: e };
            }
          });
        }
        updateUserById(uid, attributes) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              this;
              const data = yield put(this.fetch, `${this.url}/admin/users/${uid}`, attributes, {
                headers: this.headers
              });
              return { user: data, data, error: null };
            } catch (e) {
              return { user: null, data: null, error: e };
            }
          });
        }
        deleteUser(uid) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield remove(this.fetch, `${this.url}/admin/users/${uid}`, {}, {
                headers: this.headers
              });
              return { user: data, data, error: null };
            } catch (e) {
              return { user: null, data: null, error: e };
            }
          });
        }
        getUser(jwt) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield get(this.fetch, `${this.url}/user`, {
                headers: this._createRequestHeaders(jwt)
              });
              return { user: data, data, error: null };
            } catch (e) {
              return { user: null, data: null, error: e };
            }
          });
        }
        updateUser(jwt, attributes) {
          return __awaiter2(this, void 0, void 0, function* () {
            try {
              const data = yield put(this.fetch, `${this.url}/user`, attributes, {
                headers: this._createRequestHeaders(jwt)
              });
              return { user: data, data, error: null };
            } catch (e) {
              return { user: null, data: null, error: e };
            }
          });
        }
      };
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/polyfills.js
  function polyfillGlobalThis() {
    if (typeof globalThis === "object")
      return;
    try {
      Object.defineProperty(Object.prototype, "__magic__", {
        get: function() {
          return this;
        },
        configurable: true
      });
      __magic__.globalThis = __magic__;
      delete Object.prototype.__magic__;
    } catch (e) {
      if (typeof self !== "undefined") {
        self.globalThis = self;
      }
    }
  }
  var init_polyfills = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/polyfills.js"() {
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/GoTrueClient.js
  var __awaiter3, DEFAULT_OPTIONS, GoTrueClient;
  var init_GoTrueClient = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/GoTrueClient.js"() {
      init_GoTrueApi();
      init_helpers2();
      init_constants2();
      init_polyfills();
      __awaiter3 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      polyfillGlobalThis();
      DEFAULT_OPTIONS = {
        url: GOTRUE_URL,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS2
      };
      GoTrueClient = class {
        constructor(options) {
          this.stateChangeEmitters = new Map();
          const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
          this.currentUser = null;
          this.currentSession = null;
          this.autoRefreshToken = settings.autoRefreshToken;
          this.persistSession = settings.persistSession;
          this.multiTab = settings.multiTab;
          this.localStorage = settings.localStorage || globalThis.localStorage;
          this.api = new GoTrueApi({
            url: settings.url,
            headers: settings.headers,
            cookieOptions: settings.cookieOptions,
            fetch: settings.fetch
          });
          this._recoverSession();
          this._recoverAndRefresh();
          this._listenForMultiTabEvents();
          if (settings.detectSessionInUrl && isBrowser2() && !!getParameterByName("access_token")) {
            this.getSessionFromUrl({ storeSession: true }).then(({ error: error2 }) => {
              if (error2) {
                console.error("Error getting session from URL.", error2);
              }
            });
          }
        }
        signUp({ email, password, phone }, options = {}) {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              this._removeSession();
              const { data, error: error2 } = phone && password ? yield this.api.signUpWithPhone(phone, password, {
                data: options.data,
                captchaToken: options.captchaToken
              }) : yield this.api.signUpWithEmail(email, password, {
                redirectTo: options.redirectTo,
                data: options.data,
                captchaToken: options.captchaToken
              });
              if (error2) {
                throw error2;
              }
              if (!data) {
                throw "An error occurred on sign up.";
              }
              let session = null;
              let user = null;
              if (data.access_token) {
                session = data;
                user = session.user;
                this._saveSession(session);
                this._notifyAllSubscribers("SIGNED_IN");
              }
              if (data.id) {
                user = data;
              }
              return { user, session, error: null };
            } catch (e) {
              return { user: null, session: null, error: e };
            }
          });
        }
        signIn({ email, phone, password, refreshToken, provider }, options = {}) {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              this._removeSession();
              if (email && !password) {
                const { error: error2 } = yield this.api.sendMagicLinkEmail(email, {
                  redirectTo: options.redirectTo,
                  captchaToken: options.captchaToken
                });
                return { user: null, session: null, error: error2 };
              }
              if (email && password) {
                return this._handleEmailSignIn(email, password, {
                  redirectTo: options.redirectTo
                });
              }
              if (phone && !password) {
                const { error: error2 } = yield this.api.sendMobileOTP(phone, {
                  captchaToken: options.captchaToken
                });
                return { user: null, session: null, error: error2 };
              }
              if (phone && password) {
                return this._handlePhoneSignIn(phone, password);
              }
              if (refreshToken) {
                const { error: error2 } = yield this._callRefreshToken(refreshToken);
                if (error2)
                  throw error2;
                return {
                  user: this.currentUser,
                  session: this.currentSession,
                  error: null
                };
              }
              if (provider) {
                return this._handleProviderSignIn(provider, {
                  redirectTo: options.redirectTo,
                  scopes: options.scopes
                });
              }
              throw new Error(`You must provide either an email, phone number or a third-party provider.`);
            } catch (e) {
              return { user: null, session: null, error: e };
            }
          });
        }
        verifyOTP({ phone, token }, options = {}) {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              this._removeSession();
              const { data, error: error2 } = yield this.api.verifyMobileOTP(phone, token, options);
              if (error2) {
                throw error2;
              }
              if (!data) {
                throw "An error occurred on token verification.";
              }
              let session = null;
              let user = null;
              if (data.access_token) {
                session = data;
                user = session.user;
                this._saveSession(session);
                this._notifyAllSubscribers("SIGNED_IN");
              }
              if (data.id) {
                user = data;
              }
              return { user, session, error: null };
            } catch (e) {
              return { user: null, session: null, error: e };
            }
          });
        }
        user() {
          return this.currentUser;
        }
        session() {
          return this.currentSession;
        }
        refreshSession() {
          var _a;
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                throw new Error("Not logged in.");
              const { error: error2 } = yield this._callRefreshToken();
              if (error2)
                throw error2;
              return { data: this.currentSession, user: this.currentUser, error: null };
            } catch (e) {
              return { data: null, user: null, error: e };
            }
          });
        }
        update(attributes) {
          var _a;
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              if (!((_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token))
                throw new Error("Not logged in.");
              const { user, error: error2 } = yield this.api.updateUser(this.currentSession.access_token, attributes);
              if (error2)
                throw error2;
              if (!user)
                throw Error("Invalid user data.");
              const session = Object.assign(Object.assign({}, this.currentSession), { user });
              this._saveSession(session);
              this._notifyAllSubscribers("USER_UPDATED");
              return { data: user, user, error: null };
            } catch (e) {
              return { data: null, user: null, error: e };
            }
          });
        }
        setSession(refresh_token) {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              if (!refresh_token) {
                throw new Error("No current session.");
              }
              const { data, error: error2 } = yield this.api.refreshAccessToken(refresh_token);
              if (error2) {
                return { session: null, error: error2 };
              }
              this._saveSession(data);
              this._notifyAllSubscribers("SIGNED_IN");
              return { session: data, error: null };
            } catch (e) {
              return { error: e, session: null };
            }
          });
        }
        setAuth(access_token) {
          this.currentSession = Object.assign(Object.assign({}, this.currentSession), { access_token, token_type: "bearer", user: null });
          return this.currentSession;
        }
        getSessionFromUrl(options) {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              if (!isBrowser2())
                throw new Error("No browser detected.");
              const error_description = getParameterByName("error_description");
              if (error_description)
                throw new Error(error_description);
              const provider_token = getParameterByName("provider_token");
              const access_token = getParameterByName("access_token");
              if (!access_token)
                throw new Error("No access_token detected.");
              const expires_in = getParameterByName("expires_in");
              if (!expires_in)
                throw new Error("No expires_in detected.");
              const refresh_token = getParameterByName("refresh_token");
              if (!refresh_token)
                throw new Error("No refresh_token detected.");
              const token_type = getParameterByName("token_type");
              if (!token_type)
                throw new Error("No token_type detected.");
              const timeNow = Math.round(Date.now() / 1e3);
              const expires_at = timeNow + parseInt(expires_in);
              const { user, error: error2 } = yield this.api.getUser(access_token);
              if (error2)
                throw error2;
              const session = {
                provider_token,
                access_token,
                expires_in: parseInt(expires_in),
                expires_at,
                refresh_token,
                token_type,
                user
              };
              if (options === null || options === void 0 ? void 0 : options.storeSession) {
                this._saveSession(session);
                const recoveryMode = getParameterByName("type");
                this._notifyAllSubscribers("SIGNED_IN");
                if (recoveryMode === "recovery") {
                  this._notifyAllSubscribers("PASSWORD_RECOVERY");
                }
              }
              window.location.hash = "";
              return { data: session, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        signOut() {
          var _a;
          return __awaiter3(this, void 0, void 0, function* () {
            const accessToken = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.access_token;
            this._removeSession();
            this._notifyAllSubscribers("SIGNED_OUT");
            if (accessToken) {
              const { error: error2 } = yield this.api.signOut(accessToken);
              if (error2)
                return { error: error2 };
            }
            return { error: null };
          });
        }
        onAuthStateChange(callback) {
          try {
            const id = uuid();
            const subscription = {
              id,
              callback,
              unsubscribe: () => {
                this.stateChangeEmitters.delete(id);
              }
            };
            this.stateChangeEmitters.set(id, subscription);
            return { data: subscription, error: null };
          } catch (e) {
            return { data: null, error: e };
          }
        }
        _handleEmailSignIn(email, password, options = {}) {
          var _a, _b;
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              const { data, error: error2 } = yield this.api.signInWithEmail(email, password, {
                redirectTo: options.redirectTo
              });
              if (error2 || !data)
                return { data: null, user: null, session: null, error: error2 };
              if (((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.confirmed_at) || ((_b = data === null || data === void 0 ? void 0 : data.user) === null || _b === void 0 ? void 0 : _b.email_confirmed_at)) {
                this._saveSession(data);
                this._notifyAllSubscribers("SIGNED_IN");
              }
              return { data, user: data.user, session: data, error: null };
            } catch (e) {
              return { data: null, user: null, session: null, error: e };
            }
          });
        }
        _handlePhoneSignIn(phone, password) {
          var _a;
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              const { data, error: error2 } = yield this.api.signInWithPhone(phone, password);
              if (error2 || !data)
                return { data: null, user: null, session: null, error: error2 };
              if ((_a = data === null || data === void 0 ? void 0 : data.user) === null || _a === void 0 ? void 0 : _a.phone_confirmed_at) {
                this._saveSession(data);
                this._notifyAllSubscribers("SIGNED_IN");
              }
              return { data, user: data.user, session: data, error: null };
            } catch (e) {
              return { data: null, user: null, session: null, error: e };
            }
          });
        }
        _handleProviderSignIn(provider, options = {}) {
          const url = this.api.getUrlForProvider(provider, {
            redirectTo: options.redirectTo,
            scopes: options.scopes
          });
          try {
            if (isBrowser2()) {
              window.location.href = url;
            }
            return { provider, url, data: null, session: null, user: null, error: null };
          } catch (e) {
            if (url)
              return { provider, url, data: null, session: null, user: null, error: null };
            return { data: null, user: null, session: null, error: e };
          }
        }
        _recoverSession() {
          var _a;
          try {
            const json = isBrowser2() && ((_a = this.localStorage) === null || _a === void 0 ? void 0 : _a.getItem(STORAGE_KEY2));
            if (!json || typeof json !== "string") {
              return null;
            }
            const data = JSON.parse(json);
            const { currentSession, expiresAt: expiresAt2 } = data;
            const timeNow = Math.round(Date.now() / 1e3);
            if (expiresAt2 >= timeNow && (currentSession === null || currentSession === void 0 ? void 0 : currentSession.user)) {
              this._saveSession(currentSession);
              this._notifyAllSubscribers("SIGNED_IN");
            }
          } catch (error2) {
            console.log("error", error2);
          }
        }
        _recoverAndRefresh() {
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              const json = isBrowser2() && (yield this.localStorage.getItem(STORAGE_KEY2));
              if (!json) {
                return null;
              }
              const data = JSON.parse(json);
              const { currentSession, expiresAt: expiresAt2 } = data;
              const timeNow = Math.round(Date.now() / 1e3);
              if (expiresAt2 < timeNow) {
                if (this.autoRefreshToken && currentSession.refresh_token) {
                  const { error: error2 } = yield this._callRefreshToken(currentSession.refresh_token);
                  if (error2) {
                    console.log(error2.message);
                    yield this._removeSession();
                  }
                } else {
                  this._removeSession();
                }
              } else if (!currentSession || !currentSession.user) {
                console.log("Current session is missing data.");
                this._removeSession();
              } else {
                this._saveSession(currentSession);
                this._notifyAllSubscribers("SIGNED_IN");
              }
            } catch (err) {
              console.error(err);
              return null;
            }
          });
        }
        _callRefreshToken(refresh_token) {
          var _a;
          if (refresh_token === void 0) {
            refresh_token = (_a = this.currentSession) === null || _a === void 0 ? void 0 : _a.refresh_token;
          }
          return __awaiter3(this, void 0, void 0, function* () {
            try {
              if (!refresh_token) {
                throw new Error("No current session.");
              }
              const { data, error: error2 } = yield this.api.refreshAccessToken(refresh_token);
              if (error2)
                throw error2;
              if (!data)
                throw Error("Invalid session data.");
              this._saveSession(data);
              this._notifyAllSubscribers("TOKEN_REFRESHED");
              this._notifyAllSubscribers("SIGNED_IN");
              return { data, error: null };
            } catch (e) {
              return { data: null, error: e };
            }
          });
        }
        _notifyAllSubscribers(event) {
          this.stateChangeEmitters.forEach((x) => x.callback(event, this.currentSession));
        }
        _saveSession(session) {
          this.currentSession = session;
          this.currentUser = session.user;
          const expiresAt2 = session.expires_at;
          if (expiresAt2) {
            const timeNow = Math.round(Date.now() / 1e3);
            const expiresIn = expiresAt2 - timeNow;
            const refreshDurationBeforeExpires = expiresIn > 60 ? 60 : 0.5;
            this._startAutoRefreshToken((expiresIn - refreshDurationBeforeExpires) * 1e3);
          }
          if (this.persistSession && session.expires_at) {
            this._persistSession(this.currentSession);
          }
        }
        _persistSession(currentSession) {
          const data = { currentSession, expiresAt: currentSession.expires_at };
          isBrowser2() && this.localStorage.setItem(STORAGE_KEY2, JSON.stringify(data));
        }
        _removeSession() {
          return __awaiter3(this, void 0, void 0, function* () {
            this.currentSession = null;
            this.currentUser = null;
            if (this.refreshTokenTimer)
              clearTimeout(this.refreshTokenTimer);
            isBrowser2() && (yield this.localStorage.removeItem(STORAGE_KEY2));
          });
        }
        _startAutoRefreshToken(value) {
          if (this.refreshTokenTimer)
            clearTimeout(this.refreshTokenTimer);
          if (value <= 0 || !this.autoRefreshToken)
            return;
          this.refreshTokenTimer = setTimeout(() => this._callRefreshToken(), value);
          if (typeof this.refreshTokenTimer.unref === "function")
            this.refreshTokenTimer.unref();
        }
        _listenForMultiTabEvents() {
          if (!this.multiTab || !isBrowser2() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
            return false;
          }
          try {
            window === null || window === void 0 ? void 0 : window.addEventListener("storage", (e) => {
              var _a;
              if (e.key === STORAGE_KEY2) {
                const newSession = JSON.parse(String(e.newValue));
                if ((_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) {
                  this._recoverAndRefresh();
                  this._notifyAllSubscribers("SIGNED_IN");
                } else {
                  this._removeSession();
                  this._notifyAllSubscribers("SIGNED_OUT");
                }
              }
            });
          } catch (error2) {
            console.error("_listenForMultiTabEvents", error2);
          }
        }
      };
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/lib/types.js
  var init_types = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/lib/types.js"() {
    }
  });

  // node_modules/@supabase/gotrue-js/dist/module/index.js
  var init_module = __esm({
    "node_modules/@supabase/gotrue-js/dist/module/index.js"() {
      init_GoTrueApi();
      init_GoTrueClient();
      init_types();
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js
  var SupabaseAuthClient;
  var init_SupabaseAuthClient = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js"() {
      init_module();
      SupabaseAuthClient = class extends GoTrueClient {
        constructor(options) {
          super(options);
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/types.js
  var import_cross_fetch2, __awaiter4, PostgrestBuilder;
  var init_types2 = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/types.js"() {
      import_cross_fetch2 = __toModule(require_browser_ponyfill());
      __awaiter4 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      PostgrestBuilder = class {
        constructor(builder) {
          this.shouldThrowOnError = false;
          Object.assign(this, builder);
          this.fetch = builder.fetch || import_cross_fetch2.default;
        }
        throwOnError() {
          this.shouldThrowOnError = true;
          return this;
        }
        then(onfulfilled, onrejected) {
          if (typeof this.schema === "undefined") {
          } else if (["GET", "HEAD"].includes(this.method)) {
            this.headers["Accept-Profile"] = this.schema;
          } else {
            this.headers["Content-Profile"] = this.schema;
          }
          if (this.method !== "GET" && this.method !== "HEAD") {
            this.headers["Content-Type"] = "application/json";
          }
          let res = this.fetch(this.url.toString(), {
            method: this.method,
            headers: this.headers,
            body: JSON.stringify(this.body),
            signal: this.signal
          }).then((res2) => __awaiter4(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let error2 = null;
            let data = null;
            let count = null;
            if (res2.ok) {
              const isReturnMinimal = (_a = this.headers["Prefer"]) === null || _a === void 0 ? void 0 : _a.split(",").includes("return=minimal");
              if (this.method !== "HEAD" && !isReturnMinimal) {
                const text = yield res2.text();
                if (!text) {
                } else if (this.headers["Accept"] === "text/csv") {
                  data = text;
                } else {
                  data = JSON.parse(text);
                }
              }
              const countHeader = (_b = this.headers["Prefer"]) === null || _b === void 0 ? void 0 : _b.match(/count=(exact|planned|estimated)/);
              const contentRange = (_c = res2.headers.get("content-range")) === null || _c === void 0 ? void 0 : _c.split("/");
              if (countHeader && contentRange && contentRange.length > 1) {
                count = parseInt(contentRange[1]);
              }
            } else {
              const body = yield res2.text();
              try {
                error2 = JSON.parse(body);
              } catch (_d) {
                error2 = {
                  message: body
                };
              }
              if (error2 && this.shouldThrowOnError) {
                throw error2;
              }
            }
            const postgrestResponse = {
              error: error2,
              data,
              count,
              status: res2.status,
              statusText: res2.statusText,
              body: data
            };
            return postgrestResponse;
          }));
          if (!this.shouldThrowOnError) {
            res = res.catch((fetchError) => ({
              error: {
                message: `FetchError: ${fetchError.message}`,
                details: "",
                hint: "",
                code: fetchError.code || ""
              },
              data: null,
              body: null,
              count: null,
              status: 400,
              statusText: "Bad Request"
            }));
          }
          return res.then(onfulfilled, onrejected);
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestTransformBuilder.js
  var PostgrestTransformBuilder;
  var init_PostgrestTransformBuilder = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestTransformBuilder.js"() {
      init_types2();
      PostgrestTransformBuilder = class extends PostgrestBuilder {
        select(columns = "*") {
          let quoted = false;
          const cleanedColumns = columns.split("").map((c) => {
            if (/\s/.test(c) && !quoted) {
              return "";
            }
            if (c === '"') {
              quoted = !quoted;
            }
            return c;
          }).join("");
          this.url.searchParams.set("select", cleanedColumns);
          return this;
        }
        order(column, { ascending = true, nullsFirst = false, foreignTable } = {}) {
          const key = typeof foreignTable === "undefined" ? "order" : `${foreignTable}.order`;
          const existingOrder = this.url.searchParams.get(key);
          this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ""}${column}.${ascending ? "asc" : "desc"}.${nullsFirst ? "nullsfirst" : "nullslast"}`);
          return this;
        }
        limit(count, { foreignTable } = {}) {
          const key = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
          this.url.searchParams.set(key, `${count}`);
          return this;
        }
        range(from, to, { foreignTable } = {}) {
          const keyOffset = typeof foreignTable === "undefined" ? "offset" : `${foreignTable}.offset`;
          const keyLimit = typeof foreignTable === "undefined" ? "limit" : `${foreignTable}.limit`;
          this.url.searchParams.set(keyOffset, `${from}`);
          this.url.searchParams.set(keyLimit, `${to - from + 1}`);
          return this;
        }
        abortSignal(signal) {
          this.signal = signal;
          return this;
        }
        single() {
          this.headers["Accept"] = "application/vnd.pgrst.object+json";
          return this;
        }
        maybeSingle() {
          this.headers["Accept"] = "application/vnd.pgrst.object+json";
          const _this = new PostgrestTransformBuilder(this);
          _this.then = (onfulfilled, onrejected) => this.then((res) => {
            var _a, _b;
            if ((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.details) === null || _b === void 0 ? void 0 : _b.includes("Results contain 0 rows")) {
              return onfulfilled({
                error: null,
                data: null,
                count: res.count,
                status: 200,
                statusText: "OK",
                body: null
              });
            }
            return onfulfilled(res);
          }, onrejected);
          return _this;
        }
        csv() {
          this.headers["Accept"] = "text/csv";
          return this;
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestFilterBuilder.js
  var PostgrestFilterBuilder;
  var init_PostgrestFilterBuilder = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestFilterBuilder.js"() {
      init_PostgrestTransformBuilder();
      PostgrestFilterBuilder = class extends PostgrestTransformBuilder {
        constructor() {
          super(...arguments);
          this.cs = this.contains;
          this.cd = this.containedBy;
          this.sl = this.rangeLt;
          this.sr = this.rangeGt;
          this.nxl = this.rangeGte;
          this.nxr = this.rangeLte;
          this.adj = this.rangeAdjacent;
          this.ov = this.overlaps;
        }
        not(column, operator, value) {
          this.url.searchParams.append(`${column}`, `not.${operator}.${value}`);
          return this;
        }
        or(filters, { foreignTable } = {}) {
          const key = typeof foreignTable === "undefined" ? "or" : `${foreignTable}.or`;
          this.url.searchParams.append(key, `(${filters})`);
          return this;
        }
        eq(column, value) {
          this.url.searchParams.append(`${column}`, `eq.${value}`);
          return this;
        }
        neq(column, value) {
          this.url.searchParams.append(`${column}`, `neq.${value}`);
          return this;
        }
        gt(column, value) {
          this.url.searchParams.append(`${column}`, `gt.${value}`);
          return this;
        }
        gte(column, value) {
          this.url.searchParams.append(`${column}`, `gte.${value}`);
          return this;
        }
        lt(column, value) {
          this.url.searchParams.append(`${column}`, `lt.${value}`);
          return this;
        }
        lte(column, value) {
          this.url.searchParams.append(`${column}`, `lte.${value}`);
          return this;
        }
        like(column, pattern) {
          this.url.searchParams.append(`${column}`, `like.${pattern}`);
          return this;
        }
        ilike(column, pattern) {
          this.url.searchParams.append(`${column}`, `ilike.${pattern}`);
          return this;
        }
        is(column, value) {
          this.url.searchParams.append(`${column}`, `is.${value}`);
          return this;
        }
        in(column, values) {
          const cleanedValues = values.map((s2) => {
            if (typeof s2 === "string" && new RegExp("[,()]").test(s2))
              return `"${s2}"`;
            else
              return `${s2}`;
          }).join(",");
          this.url.searchParams.append(`${column}`, `in.(${cleanedValues})`);
          return this;
        }
        contains(column, value) {
          if (typeof value === "string") {
            this.url.searchParams.append(`${column}`, `cs.${value}`);
          } else if (Array.isArray(value)) {
            this.url.searchParams.append(`${column}`, `cs.{${value.join(",")}}`);
          } else {
            this.url.searchParams.append(`${column}`, `cs.${JSON.stringify(value)}`);
          }
          return this;
        }
        containedBy(column, value) {
          if (typeof value === "string") {
            this.url.searchParams.append(`${column}`, `cd.${value}`);
          } else if (Array.isArray(value)) {
            this.url.searchParams.append(`${column}`, `cd.{${value.join(",")}}`);
          } else {
            this.url.searchParams.append(`${column}`, `cd.${JSON.stringify(value)}`);
          }
          return this;
        }
        rangeLt(column, range) {
          this.url.searchParams.append(`${column}`, `sl.${range}`);
          return this;
        }
        rangeGt(column, range) {
          this.url.searchParams.append(`${column}`, `sr.${range}`);
          return this;
        }
        rangeGte(column, range) {
          this.url.searchParams.append(`${column}`, `nxl.${range}`);
          return this;
        }
        rangeLte(column, range) {
          this.url.searchParams.append(`${column}`, `nxr.${range}`);
          return this;
        }
        rangeAdjacent(column, range) {
          this.url.searchParams.append(`${column}`, `adj.${range}`);
          return this;
        }
        overlaps(column, value) {
          if (typeof value === "string") {
            this.url.searchParams.append(`${column}`, `ov.${value}`);
          } else {
            this.url.searchParams.append(`${column}`, `ov.{${value.join(",")}}`);
          }
          return this;
        }
        textSearch(column, query, { config, type = null } = {}) {
          let typePart = "";
          if (type === "plain") {
            typePart = "pl";
          } else if (type === "phrase") {
            typePart = "ph";
          } else if (type === "websearch") {
            typePart = "w";
          }
          const configPart = config === void 0 ? "" : `(${config})`;
          this.url.searchParams.append(`${column}`, `${typePart}fts${configPart}.${query}`);
          return this;
        }
        fts(column, query, { config } = {}) {
          const configPart = typeof config === "undefined" ? "" : `(${config})`;
          this.url.searchParams.append(`${column}`, `fts${configPart}.${query}`);
          return this;
        }
        plfts(column, query, { config } = {}) {
          const configPart = typeof config === "undefined" ? "" : `(${config})`;
          this.url.searchParams.append(`${column}`, `plfts${configPart}.${query}`);
          return this;
        }
        phfts(column, query, { config } = {}) {
          const configPart = typeof config === "undefined" ? "" : `(${config})`;
          this.url.searchParams.append(`${column}`, `phfts${configPart}.${query}`);
          return this;
        }
        wfts(column, query, { config } = {}) {
          const configPart = typeof config === "undefined" ? "" : `(${config})`;
          this.url.searchParams.append(`${column}`, `wfts${configPart}.${query}`);
          return this;
        }
        filter(column, operator, value) {
          this.url.searchParams.append(`${column}`, `${operator}.${value}`);
          return this;
        }
        match(query) {
          Object.keys(query).forEach((key) => {
            this.url.searchParams.append(`${key}`, `eq.${query[key]}`);
          });
          return this;
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestQueryBuilder.js
  var PostgrestQueryBuilder;
  var init_PostgrestQueryBuilder = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestQueryBuilder.js"() {
      init_types2();
      init_PostgrestFilterBuilder();
      PostgrestQueryBuilder = class extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch: fetch3 } = {}) {
          super({ fetch: fetch3 });
          this.url = new URL(url);
          this.headers = Object.assign({}, headers);
          this.schema = schema;
        }
        select(columns = "*", { head = false, count = null } = {}) {
          this.method = "GET";
          let quoted = false;
          const cleanedColumns = columns.split("").map((c) => {
            if (/\s/.test(c) && !quoted) {
              return "";
            }
            if (c === '"') {
              quoted = !quoted;
            }
            return c;
          }).join("");
          this.url.searchParams.set("select", cleanedColumns);
          if (count) {
            this.headers["Prefer"] = `count=${count}`;
          }
          if (head) {
            this.method = "HEAD";
          }
          return new PostgrestFilterBuilder(this);
        }
        insert(values, { upsert = false, onConflict, returning = "representation", count = null } = {}) {
          this.method = "POST";
          const prefersHeaders = [`return=${returning}`];
          if (upsert)
            prefersHeaders.push("resolution=merge-duplicates");
          if (upsert && onConflict !== void 0)
            this.url.searchParams.set("on_conflict", onConflict);
          this.body = values;
          if (count) {
            prefersHeaders.push(`count=${count}`);
          }
          this.headers["Prefer"] = prefersHeaders.join(",");
          if (Array.isArray(values)) {
            const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
            if (columns.length > 0) {
              const uniqueColumns = [...new Set(columns)].map((column) => `"${column}"`);
              this.url.searchParams.set("columns", uniqueColumns.join(","));
            }
          }
          return new PostgrestFilterBuilder(this);
        }
        upsert(values, { onConflict, returning = "representation", count = null, ignoreDuplicates = false } = {}) {
          this.method = "POST";
          const prefersHeaders = [
            `resolution=${ignoreDuplicates ? "ignore" : "merge"}-duplicates`,
            `return=${returning}`
          ];
          if (onConflict !== void 0)
            this.url.searchParams.set("on_conflict", onConflict);
          this.body = values;
          if (count) {
            prefersHeaders.push(`count=${count}`);
          }
          this.headers["Prefer"] = prefersHeaders.join(",");
          return new PostgrestFilterBuilder(this);
        }
        update(values, { returning = "representation", count = null } = {}) {
          this.method = "PATCH";
          const prefersHeaders = [`return=${returning}`];
          this.body = values;
          if (count) {
            prefersHeaders.push(`count=${count}`);
          }
          this.headers["Prefer"] = prefersHeaders.join(",");
          return new PostgrestFilterBuilder(this);
        }
        delete({ returning = "representation", count = null } = {}) {
          this.method = "DELETE";
          const prefersHeaders = [`return=${returning}`];
          if (count) {
            prefersHeaders.push(`count=${count}`);
          }
          this.headers["Prefer"] = prefersHeaders.join(",");
          return new PostgrestFilterBuilder(this);
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestRpcBuilder.js
  var PostgrestRpcBuilder;
  var init_PostgrestRpcBuilder = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/PostgrestRpcBuilder.js"() {
      init_types2();
      init_PostgrestFilterBuilder();
      PostgrestRpcBuilder = class extends PostgrestBuilder {
        constructor(url, { headers = {}, schema, fetch: fetch3 } = {}) {
          super({ fetch: fetch3 });
          this.url = new URL(url);
          this.headers = Object.assign({}, headers);
          this.schema = schema;
        }
        rpc(params, { head = false, count = null } = {}) {
          if (head) {
            this.method = "HEAD";
            if (params) {
              Object.entries(params).forEach(([name, value]) => {
                this.url.searchParams.append(name, value);
              });
            }
          } else {
            this.method = "POST";
            this.body = params;
          }
          if (count) {
            if (this.headers["Prefer"] !== void 0)
              this.headers["Prefer"] += `,count=${count}`;
            else
              this.headers["Prefer"] = `count=${count}`;
          }
          return new PostgrestFilterBuilder(this);
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/version.js
  var version3;
  var init_version3 = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/version.js"() {
      version3 = "0.35.1";
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/lib/constants.js
  var DEFAULT_HEADERS3;
  var init_constants3 = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/lib/constants.js"() {
      init_version3();
      DEFAULT_HEADERS3 = { "X-Client-Info": `postgrest-js/${version3}` };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js
  var PostgrestClient;
  var init_PostgrestClient = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js"() {
      init_PostgrestQueryBuilder();
      init_PostgrestRpcBuilder();
      init_constants3();
      PostgrestClient = class {
        constructor(url, { headers = {}, schema, fetch: fetch3 } = {}) {
          this.url = url;
          this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS3), headers);
          this.schema = schema;
          this.fetch = fetch3;
        }
        auth(token) {
          this.headers["Authorization"] = `Bearer ${token}`;
          return this;
        }
        from(table) {
          const url = `${this.url}/${table}`;
          return new PostgrestQueryBuilder(url, {
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch
          });
        }
        rpc(fn, params, { head = false, count = null } = {}) {
          const url = `${this.url}/rpc/${fn}`;
          return new PostgrestRpcBuilder(url, {
            headers: this.headers,
            schema: this.schema,
            fetch: this.fetch
          }).rpc(params, { head, count });
        }
      };
    }
  });

  // node_modules/@supabase/postgrest-js/dist/module/index.js
  var init_module2 = __esm({
    "node_modules/@supabase/postgrest-js/dist/module/index.js"() {
      init_PostgrestClient();
      init_PostgrestFilterBuilder();
      init_PostgrestQueryBuilder();
      init_types2();
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/transformers.js
  var transformers_exports = {};
  __export(transformers_exports, {
    PostgresTypes: () => PostgresTypes,
    convertCell: () => convertCell,
    convertChangeData: () => convertChangeData,
    convertColumn: () => convertColumn,
    toArray: () => toArray,
    toBoolean: () => toBoolean,
    toJson: () => toJson,
    toNumber: () => toNumber,
    toTimestampString: () => toTimestampString
  });
  var PostgresTypes, convertChangeData, convertColumn, convertCell, noop3, toBoolean, toNumber, toJson, toArray, toTimestampString;
  var init_transformers = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/transformers.js"() {
      (function(PostgresTypes2) {
        PostgresTypes2["abstime"] = "abstime";
        PostgresTypes2["bool"] = "bool";
        PostgresTypes2["date"] = "date";
        PostgresTypes2["daterange"] = "daterange";
        PostgresTypes2["float4"] = "float4";
        PostgresTypes2["float8"] = "float8";
        PostgresTypes2["int2"] = "int2";
        PostgresTypes2["int4"] = "int4";
        PostgresTypes2["int4range"] = "int4range";
        PostgresTypes2["int8"] = "int8";
        PostgresTypes2["int8range"] = "int8range";
        PostgresTypes2["json"] = "json";
        PostgresTypes2["jsonb"] = "jsonb";
        PostgresTypes2["money"] = "money";
        PostgresTypes2["numeric"] = "numeric";
        PostgresTypes2["oid"] = "oid";
        PostgresTypes2["reltime"] = "reltime";
        PostgresTypes2["text"] = "text";
        PostgresTypes2["time"] = "time";
        PostgresTypes2["timestamp"] = "timestamp";
        PostgresTypes2["timestamptz"] = "timestamptz";
        PostgresTypes2["timetz"] = "timetz";
        PostgresTypes2["tsrange"] = "tsrange";
        PostgresTypes2["tstzrange"] = "tstzrange";
      })(PostgresTypes || (PostgresTypes = {}));
      convertChangeData = (columns, record, options = {}) => {
        var _a;
        const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
        return Object.keys(record).reduce((acc, rec_key) => {
          acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
          return acc;
        }, {});
      };
      convertColumn = (columnName, columns, record, skipTypes) => {
        const column = columns.find((x) => x.name === columnName);
        const colType = column === null || column === void 0 ? void 0 : column.type;
        const value = record[columnName];
        if (colType && !skipTypes.includes(colType)) {
          return convertCell(colType, value);
        }
        return noop3(value);
      };
      convertCell = (type, value) => {
        if (type.charAt(0) === "_") {
          const dataType = type.slice(1, type.length);
          return toArray(value, dataType);
        }
        switch (type) {
          case PostgresTypes.bool:
            return toBoolean(value);
          case PostgresTypes.float4:
          case PostgresTypes.float8:
          case PostgresTypes.int2:
          case PostgresTypes.int4:
          case PostgresTypes.int8:
          case PostgresTypes.numeric:
          case PostgresTypes.oid:
            return toNumber(value);
          case PostgresTypes.json:
          case PostgresTypes.jsonb:
            return toJson(value);
          case PostgresTypes.timestamp:
            return toTimestampString(value);
          case PostgresTypes.abstime:
          case PostgresTypes.date:
          case PostgresTypes.daterange:
          case PostgresTypes.int4range:
          case PostgresTypes.int8range:
          case PostgresTypes.money:
          case PostgresTypes.reltime:
          case PostgresTypes.text:
          case PostgresTypes.time:
          case PostgresTypes.timestamptz:
          case PostgresTypes.timetz:
          case PostgresTypes.tsrange:
          case PostgresTypes.tstzrange:
            return noop3(value);
          default:
            return noop3(value);
        }
      };
      noop3 = (value) => {
        return value;
      };
      toBoolean = (value) => {
        switch (value) {
          case "t":
            return true;
          case "f":
            return false;
          default:
            return value;
        }
      };
      toNumber = (value) => {
        if (typeof value === "string") {
          const parsedValue = parseFloat(value);
          if (!Number.isNaN(parsedValue)) {
            return parsedValue;
          }
        }
        return value;
      };
      toJson = (value) => {
        if (typeof value === "string") {
          try {
            return JSON.parse(value);
          } catch (error2) {
            console.log(`JSON parse error: ${error2}`);
            return value;
          }
        }
        return value;
      };
      toArray = (value, type) => {
        if (typeof value !== "string") {
          return value;
        }
        const lastIdx = value.length - 1;
        const closeBrace = value[lastIdx];
        const openBrace = value[0];
        if (openBrace === "{" && closeBrace === "}") {
          let arr;
          const valTrim = value.slice(1, lastIdx);
          try {
            arr = JSON.parse("[" + valTrim + "]");
          } catch (_) {
            arr = valTrim ? valTrim.split(",") : [];
          }
          return arr.map((val) => convertCell(type, val));
        }
        return value;
      };
      toTimestampString = (value) => {
        if (typeof value === "string") {
          return value.replace(" ", "T");
        }
        return value;
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/version.js
  var version4;
  var init_version4 = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/version.js"() {
      version4 = "1.3.5";
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/constants.js
  var DEFAULT_HEADERS4, VSN, DEFAULT_TIMEOUT, WS_CLOSE_NORMAL, SOCKET_STATES, CHANNEL_STATES, CHANNEL_EVENTS, TRANSPORTS;
  var init_constants4 = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/constants.js"() {
      init_version4();
      DEFAULT_HEADERS4 = { "X-Client-Info": `realtime-js/${version4}` };
      VSN = "1.0.0";
      DEFAULT_TIMEOUT = 1e4;
      WS_CLOSE_NORMAL = 1e3;
      (function(SOCKET_STATES2) {
        SOCKET_STATES2[SOCKET_STATES2["connecting"] = 0] = "connecting";
        SOCKET_STATES2[SOCKET_STATES2["open"] = 1] = "open";
        SOCKET_STATES2[SOCKET_STATES2["closing"] = 2] = "closing";
        SOCKET_STATES2[SOCKET_STATES2["closed"] = 3] = "closed";
      })(SOCKET_STATES || (SOCKET_STATES = {}));
      (function(CHANNEL_STATES2) {
        CHANNEL_STATES2["closed"] = "closed";
        CHANNEL_STATES2["errored"] = "errored";
        CHANNEL_STATES2["joined"] = "joined";
        CHANNEL_STATES2["joining"] = "joining";
        CHANNEL_STATES2["leaving"] = "leaving";
      })(CHANNEL_STATES || (CHANNEL_STATES = {}));
      (function(CHANNEL_EVENTS2) {
        CHANNEL_EVENTS2["close"] = "phx_close";
        CHANNEL_EVENTS2["error"] = "phx_error";
        CHANNEL_EVENTS2["join"] = "phx_join";
        CHANNEL_EVENTS2["reply"] = "phx_reply";
        CHANNEL_EVENTS2["leave"] = "phx_leave";
        CHANNEL_EVENTS2["access_token"] = "access_token";
      })(CHANNEL_EVENTS || (CHANNEL_EVENTS = {}));
      (function(TRANSPORTS2) {
        TRANSPORTS2["websocket"] = "websocket";
      })(TRANSPORTS || (TRANSPORTS = {}));
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/timer.js
  var Timer;
  var init_timer = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/timer.js"() {
      Timer = class {
        constructor(callback, timerCalc) {
          this.callback = callback;
          this.timerCalc = timerCalc;
          this.timer = void 0;
          this.tries = 0;
          this.callback = callback;
          this.timerCalc = timerCalc;
        }
        reset() {
          this.tries = 0;
          clearTimeout(this.timer);
        }
        scheduleTimeout() {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.tries = this.tries + 1;
            this.callback();
          }, this.timerCalc(this.tries + 1));
        }
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/push.js
  var Push;
  var init_push = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/push.js"() {
      init_constants4();
      Push = class {
        constructor(channel, event, payload = {}, timeout = DEFAULT_TIMEOUT) {
          this.channel = channel;
          this.event = event;
          this.payload = payload;
          this.timeout = timeout;
          this.sent = false;
          this.timeoutTimer = void 0;
          this.ref = "";
          this.receivedResp = null;
          this.recHooks = [];
          this.refEvent = null;
        }
        resend(timeout) {
          this.timeout = timeout;
          this._cancelRefEvent();
          this.ref = "";
          this.refEvent = null;
          this.receivedResp = null;
          this.sent = false;
          this.send();
        }
        send() {
          if (this._hasReceived("timeout")) {
            return;
          }
          this.startTimeout();
          this.sent = true;
          this.channel.socket.push({
            topic: this.channel.topic,
            event: this.event,
            payload: this.payload,
            ref: this.ref
          });
        }
        updatePayload(payload) {
          this.payload = Object.assign(Object.assign({}, this.payload), payload);
        }
        receive(status, callback) {
          var _a;
          if (this._hasReceived(status)) {
            callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
          }
          this.recHooks.push({ status, callback });
          return this;
        }
        startTimeout() {
          if (this.timeoutTimer) {
            return;
          }
          this.ref = this.channel.socket.makeRef();
          this.refEvent = this.channel.replyEventName(this.ref);
          this.channel.on(this.refEvent, (payload) => {
            this._cancelRefEvent();
            this._cancelTimeout();
            this.receivedResp = payload;
            this._matchReceive(payload);
          });
          this.timeoutTimer = setTimeout(() => {
            this.trigger("timeout", {});
          }, this.timeout);
        }
        trigger(status, response) {
          if (this.refEvent)
            this.channel.trigger(this.refEvent, { status, response });
        }
        destroy() {
          this._cancelRefEvent();
          this._cancelTimeout();
        }
        _cancelRefEvent() {
          if (!this.refEvent) {
            return;
          }
          this.channel.off(this.refEvent);
        }
        _cancelTimeout() {
          clearTimeout(this.timeoutTimer);
          this.timeoutTimer = void 0;
        }
        _matchReceive({ status, response }) {
          this.recHooks.filter((h) => h.status === status).forEach((h) => h.callback(response));
        }
        _hasReceived(status) {
          return this.receivedResp && this.receivedResp.status === status;
        }
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/RealtimeSubscription.js
  var RealtimeSubscription;
  var init_RealtimeSubscription = __esm({
    "node_modules/@supabase/realtime-js/dist/module/RealtimeSubscription.js"() {
      init_constants4();
      init_push();
      init_timer();
      RealtimeSubscription = class {
        constructor(topic, params = {}, socket) {
          this.topic = topic;
          this.params = params;
          this.socket = socket;
          this.bindings = [];
          this.state = CHANNEL_STATES.closed;
          this.joinedOnce = false;
          this.pushBuffer = [];
          this.timeout = this.socket.timeout;
          this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
          this.rejoinTimer = new Timer(() => this.rejoinUntilConnected(), this.socket.reconnectAfterMs);
          this.joinPush.receive("ok", () => {
            this.state = CHANNEL_STATES.joined;
            this.rejoinTimer.reset();
            this.pushBuffer.forEach((pushEvent) => pushEvent.send());
            this.pushBuffer = [];
          });
          this.onClose(() => {
            this.rejoinTimer.reset();
            this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
            this.state = CHANNEL_STATES.closed;
            this.socket.remove(this);
          });
          this.onError((reason) => {
            if (this.isLeaving() || this.isClosed()) {
              return;
            }
            this.socket.log("channel", `error ${this.topic}`, reason);
            this.state = CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
          });
          this.joinPush.receive("timeout", () => {
            if (!this.isJoining()) {
              return;
            }
            this.socket.log("channel", `timeout ${this.topic}`, this.joinPush.timeout);
            this.state = CHANNEL_STATES.errored;
            this.rejoinTimer.scheduleTimeout();
          });
          this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
            this.trigger(this.replyEventName(ref), payload);
          });
        }
        rejoinUntilConnected() {
          this.rejoinTimer.scheduleTimeout();
          if (this.socket.isConnected()) {
            this.rejoin();
          }
        }
        subscribe(timeout = this.timeout) {
          if (this.joinedOnce) {
            throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
          } else {
            this.joinedOnce = true;
            this.rejoin(timeout);
            return this.joinPush;
          }
        }
        onClose(callback) {
          this.on(CHANNEL_EVENTS.close, callback);
        }
        onError(callback) {
          this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
        }
        on(event, callback) {
          this.bindings.push({ event, callback });
        }
        off(event) {
          this.bindings = this.bindings.filter((bind) => bind.event !== event);
        }
        canPush() {
          return this.socket.isConnected() && this.isJoined();
        }
        push(event, payload, timeout = this.timeout) {
          if (!this.joinedOnce) {
            throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
          }
          let pushEvent = new Push(this, event, payload, timeout);
          if (this.canPush()) {
            pushEvent.send();
          } else {
            pushEvent.startTimeout();
            this.pushBuffer.push(pushEvent);
          }
          return pushEvent;
        }
        updateJoinPayload(payload) {
          this.joinPush.updatePayload(payload);
        }
        unsubscribe(timeout = this.timeout) {
          this.state = CHANNEL_STATES.leaving;
          let onClose = () => {
            this.socket.log("channel", `leave ${this.topic}`);
            this.trigger(CHANNEL_EVENTS.close, "leave", this.joinRef());
          };
          this.joinPush.destroy();
          let leavePush = new Push(this, CHANNEL_EVENTS.leave, {}, timeout);
          leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
          leavePush.send();
          if (!this.canPush()) {
            leavePush.trigger("ok", {});
          }
          return leavePush;
        }
        onMessage(event, payload, ref) {
          return payload;
        }
        isMember(topic) {
          return this.topic === topic;
        }
        joinRef() {
          return this.joinPush.ref;
        }
        rejoin(timeout = this.timeout) {
          if (this.isLeaving()) {
            return;
          }
          this.socket.leaveOpenTopic(this.topic);
          this.state = CHANNEL_STATES.joining;
          this.joinPush.resend(timeout);
        }
        trigger(event, payload, ref) {
          let { close, error: error2, leave, join } = CHANNEL_EVENTS;
          let events2 = [close, error2, leave, join];
          if (ref && events2.indexOf(event) >= 0 && ref !== this.joinRef()) {
            return;
          }
          let handledPayload = this.onMessage(event, payload, ref);
          if (payload && !handledPayload) {
            throw "channel onMessage callbacks must return the payload, modified or unmodified";
          }
          this.bindings.filter((bind) => {
            if (bind.event === "*") {
              return event === (payload === null || payload === void 0 ? void 0 : payload.type);
            } else {
              return bind.event === event;
            }
          }).map((bind) => bind.callback(handledPayload, ref));
        }
        replyEventName(ref) {
          return `chan_reply_${ref}`;
        }
        isClosed() {
          return this.state === CHANNEL_STATES.closed;
        }
        isErrored() {
          return this.state === CHANNEL_STATES.errored;
        }
        isJoined() {
          return this.state === CHANNEL_STATES.joined;
        }
        isJoining() {
          return this.state === CHANNEL_STATES.joining;
        }
        isLeaving() {
          return this.state === CHANNEL_STATES.leaving;
        }
      };
    }
  });

  // node_modules/es5-ext/global.js
  var require_global = __commonJS({
    "node_modules/es5-ext/global.js"(exports, module) {
      var naiveFallback = function() {
        if (typeof self === "object" && self)
          return self;
        if (typeof window === "object" && window)
          return window;
        throw new Error("Unable to resolve global `this`");
      };
      module.exports = function() {
        if (this)
          return this;
        if (typeof globalThis === "object" && globalThis)
          return globalThis;
        try {
          Object.defineProperty(Object.prototype, "__global__", {
            get: function() {
              return this;
            },
            configurable: true
          });
        } catch (error2) {
          return naiveFallback();
        }
        try {
          if (!__global__)
            return naiveFallback();
          return __global__;
        } finally {
          delete Object.prototype.__global__;
        }
      }();
    }
  });

  // node_modules/websocket/package.json
  var require_package = __commonJS({
    "node_modules/websocket/package.json"(exports, module) {
      module.exports = {
        name: "websocket",
        description: "Websocket Client & Server Library implementing the WebSocket protocol as specified in RFC 6455.",
        keywords: [
          "websocket",
          "websockets",
          "socket",
          "networking",
          "comet",
          "push",
          "RFC-6455",
          "realtime",
          "server",
          "client"
        ],
        author: "Brian McKelvey <theturtle32@gmail.com> (https://github.com/theturtle32)",
        contributors: [
          "I\xF1aki Baz Castillo <ibc@aliax.net> (http://dev.sipdoc.net)"
        ],
        version: "1.0.34",
        repository: {
          type: "git",
          url: "https://github.com/theturtle32/WebSocket-Node.git"
        },
        homepage: "https://github.com/theturtle32/WebSocket-Node",
        engines: {
          node: ">=4.0.0"
        },
        dependencies: {
          bufferutil: "^4.0.1",
          debug: "^2.2.0",
          "es5-ext": "^0.10.50",
          "typedarray-to-buffer": "^3.1.5",
          "utf-8-validate": "^5.0.2",
          yaeti: "^0.0.6"
        },
        devDependencies: {
          "buffer-equal": "^1.0.0",
          gulp: "^4.0.2",
          "gulp-jshint": "^2.0.4",
          "jshint-stylish": "^2.2.1",
          jshint: "^2.0.0",
          tape: "^4.9.1"
        },
        config: {
          verbose: false
        },
        scripts: {
          test: "tape test/unit/*.js",
          gulp: "gulp"
        },
        main: "index",
        directories: {
          lib: "./lib"
        },
        browser: "lib/browser.js",
        license: "Apache-2.0"
      };
    }
  });

  // node_modules/websocket/lib/version.js
  var require_version = __commonJS({
    "node_modules/websocket/lib/version.js"(exports, module) {
      module.exports = require_package().version;
    }
  });

  // node_modules/websocket/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/websocket/lib/browser.js"(exports, module) {
      var _globalThis;
      if (typeof globalThis === "object") {
        _globalThis = globalThis;
      } else {
        try {
          _globalThis = require_global();
        } catch (error2) {
        } finally {
          if (!_globalThis && typeof window !== "undefined") {
            _globalThis = window;
          }
          if (!_globalThis) {
            throw new Error("Could not determine global this");
          }
        }
      }
      var NativeWebSocket = _globalThis.WebSocket || _globalThis.MozWebSocket;
      var websocket_version = require_version();
      function W3CWebSocket(uri, protocols) {
        var native_instance;
        if (protocols) {
          native_instance = new NativeWebSocket(uri, protocols);
        } else {
          native_instance = new NativeWebSocket(uri);
        }
        return native_instance;
      }
      if (NativeWebSocket) {
        ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach(function(prop) {
          Object.defineProperty(W3CWebSocket, prop, {
            get: function() {
              return NativeWebSocket[prop];
            }
          });
        });
      }
      module.exports = {
        "w3cwebsocket": NativeWebSocket ? W3CWebSocket : null,
        "version": websocket_version
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/lib/serializer.js
  var Serializer;
  var init_serializer = __esm({
    "node_modules/@supabase/realtime-js/dist/module/lib/serializer.js"() {
      Serializer = class {
        constructor() {
          this.HEADER_LENGTH = 1;
        }
        decode(rawPayload, callback) {
          if (rawPayload.constructor === ArrayBuffer) {
            return callback(this._binaryDecode(rawPayload));
          }
          if (typeof rawPayload === "string") {
            return callback(JSON.parse(rawPayload));
          }
          return callback({});
        }
        _binaryDecode(buffer) {
          const view = new DataView(buffer);
          const decoder = new TextDecoder();
          return this._decodeBroadcast(buffer, view, decoder);
        }
        _decodeBroadcast(buffer, view, decoder) {
          const topicSize = view.getUint8(1);
          const eventSize = view.getUint8(2);
          let offset = this.HEADER_LENGTH + 2;
          const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
          offset = offset + topicSize;
          const event = decoder.decode(buffer.slice(offset, offset + eventSize));
          offset = offset + eventSize;
          const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
          return { ref: null, topic, event, payload: data };
        }
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js
  var import_websocket, __awaiter5, noop4, RealtimeClient;
  var init_RealtimeClient = __esm({
    "node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js"() {
      init_constants4();
      init_timer();
      init_RealtimeSubscription();
      import_websocket = __toModule(require_browser());
      init_serializer();
      __awaiter5 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      noop4 = () => {
      };
      RealtimeClient = class {
        constructor(endPoint, options) {
          this.accessToken = null;
          this.channels = [];
          this.endPoint = "";
          this.headers = DEFAULT_HEADERS4;
          this.params = {};
          this.timeout = DEFAULT_TIMEOUT;
          this.transport = import_websocket.w3cwebsocket;
          this.heartbeatIntervalMs = 3e4;
          this.longpollerTimeout = 2e4;
          this.heartbeatTimer = void 0;
          this.pendingHeartbeatRef = null;
          this.ref = 0;
          this.logger = noop4;
          this.conn = null;
          this.sendBuffer = [];
          this.serializer = new Serializer();
          this.stateChangeCallbacks = {
            open: [],
            close: [],
            error: [],
            message: []
          };
          this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
          if (options === null || options === void 0 ? void 0 : options.params)
            this.params = options.params;
          if (options === null || options === void 0 ? void 0 : options.headers)
            this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
          if (options === null || options === void 0 ? void 0 : options.timeout)
            this.timeout = options.timeout;
          if (options === null || options === void 0 ? void 0 : options.logger)
            this.logger = options.logger;
          if (options === null || options === void 0 ? void 0 : options.transport)
            this.transport = options.transport;
          if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs)
            this.heartbeatIntervalMs = options.heartbeatIntervalMs;
          if (options === null || options === void 0 ? void 0 : options.longpollerTimeout)
            this.longpollerTimeout = options.longpollerTimeout;
          this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : (tries) => {
            return [1e3, 2e3, 5e3, 1e4][tries - 1] || 1e4;
          };
          this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
            return callback(JSON.stringify(payload));
          };
          this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
          this.reconnectTimer = new Timer(() => __awaiter5(this, void 0, void 0, function* () {
            yield this.disconnect();
            this.connect();
          }), this.reconnectAfterMs);
        }
        connect() {
          if (this.conn) {
            return;
          }
          this.conn = new this.transport(this.endPointURL(), [], null, this.headers);
          if (this.conn) {
            this.conn.binaryType = "arraybuffer";
            this.conn.onopen = () => this._onConnOpen();
            this.conn.onerror = (error2) => this._onConnError(error2);
            this.conn.onmessage = (event) => this.onConnMessage(event);
            this.conn.onclose = (event) => this._onConnClose(event);
          }
        }
        disconnect(code, reason) {
          return new Promise((resolve2, _reject) => {
            try {
              if (this.conn) {
                this.conn.onclose = function() {
                };
                if (code) {
                  this.conn.close(code, reason || "");
                } else {
                  this.conn.close();
                }
                this.conn = null;
                this.heartbeatTimer && clearInterval(this.heartbeatTimer);
                this.reconnectTimer.reset();
              }
              resolve2({ error: null, data: true });
            } catch (error2) {
              resolve2({ error: error2, data: false });
            }
          });
        }
        log(kind, msg, data) {
          this.logger(kind, msg, data);
        }
        onOpen(callback) {
          this.stateChangeCallbacks.open.push(callback);
        }
        onClose(callback) {
          this.stateChangeCallbacks.close.push(callback);
        }
        onError(callback) {
          this.stateChangeCallbacks.error.push(callback);
        }
        onMessage(callback) {
          this.stateChangeCallbacks.message.push(callback);
        }
        connectionState() {
          switch (this.conn && this.conn.readyState) {
            case SOCKET_STATES.connecting:
              return "connecting";
            case SOCKET_STATES.open:
              return "open";
            case SOCKET_STATES.closing:
              return "closing";
            default:
              return "closed";
          }
        }
        isConnected() {
          return this.connectionState() === "open";
        }
        remove(channel) {
          this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
        }
        channel(topic, chanParams = {}) {
          let chan = new RealtimeSubscription(topic, chanParams, this);
          this.channels.push(chan);
          return chan;
        }
        push(data) {
          let { topic, event, payload, ref } = data;
          let callback = () => {
            this.encode(data, (result) => {
              var _a;
              (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
            });
          };
          this.log("push", `${topic} ${event} (${ref})`, payload);
          if (this.isConnected()) {
            callback();
          } else {
            this.sendBuffer.push(callback);
          }
        }
        onConnMessage(rawMessage) {
          this.decode(rawMessage.data, (msg) => {
            let { topic, event, payload, ref } = msg;
            if (ref && ref === this.pendingHeartbeatRef) {
              this.pendingHeartbeatRef = null;
            } else if (event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
              this._resetHeartbeat();
            }
            this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
            this.channels.filter((channel) => channel.isMember(topic)).forEach((channel) => channel.trigger(event, payload, ref));
            this.stateChangeCallbacks.message.forEach((callback) => callback(msg));
          });
        }
        endPointURL() {
          return this._appendParams(this.endPoint, Object.assign({}, this.params, { vsn: VSN }));
        }
        makeRef() {
          let newRef = this.ref + 1;
          if (newRef === this.ref) {
            this.ref = 0;
          } else {
            this.ref = newRef;
          }
          return this.ref.toString();
        }
        setAuth(token) {
          this.accessToken = token;
          try {
            this.channels.forEach((channel) => {
              token && channel.updateJoinPayload({ user_token: token });
              if (channel.joinedOnce && channel.isJoined()) {
                channel.push(CHANNEL_EVENTS.access_token, { access_token: token });
              }
            });
          } catch (error2) {
            console.log("setAuth error", error2);
          }
        }
        leaveOpenTopic(topic) {
          let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
          if (dupChannel) {
            this.log("transport", `leaving duplicate topic "${topic}"`);
            dupChannel.unsubscribe();
          }
        }
        _onConnOpen() {
          this.log("transport", `connected to ${this.endPointURL()}`);
          this._flushSendBuffer();
          this.reconnectTimer.reset();
          this._resetHeartbeat();
          this.stateChangeCallbacks.open.forEach((callback) => callback());
        }
        _onConnClose(event) {
          this.log("transport", "close", event);
          this._triggerChanError();
          this.heartbeatTimer && clearInterval(this.heartbeatTimer);
          this.reconnectTimer.scheduleTimeout();
          this.stateChangeCallbacks.close.forEach((callback) => callback(event));
        }
        _onConnError(error2) {
          this.log("transport", error2.message);
          this._triggerChanError();
          this.stateChangeCallbacks.error.forEach((callback) => callback(error2));
        }
        _triggerChanError() {
          this.channels.forEach((channel) => channel.trigger(CHANNEL_EVENTS.error));
        }
        _appendParams(url, params) {
          if (Object.keys(params).length === 0) {
            return url;
          }
          const prefix2 = url.match(/\?/) ? "&" : "?";
          const query = new URLSearchParams(params);
          return `${url}${prefix2}${query}`;
        }
        _flushSendBuffer() {
          if (this.isConnected() && this.sendBuffer.length > 0) {
            this.sendBuffer.forEach((callback) => callback());
            this.sendBuffer = [];
          }
        }
        _resetHeartbeat() {
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer && clearInterval(this.heartbeatTimer);
          this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
        }
        _sendHeartbeat() {
          var _a;
          if (!this.isConnected()) {
            return;
          }
          if (this.pendingHeartbeatRef) {
            this.pendingHeartbeatRef = null;
            this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
            (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(WS_CLOSE_NORMAL, "hearbeat timeout");
            return;
          }
          this.pendingHeartbeatRef = this.makeRef();
          this.push({
            topic: "phoenix",
            event: "heartbeat",
            payload: {},
            ref: this.pendingHeartbeatRef
          });
          this.setAuth(this.accessToken);
        }
      };
    }
  });

  // node_modules/@supabase/realtime-js/dist/module/index.js
  var init_module3 = __esm({
    "node_modules/@supabase/realtime-js/dist/module/index.js"() {
      init_transformers();
      init_RealtimeClient();
      init_RealtimeSubscription();
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/SupabaseRealtimeClient.js
  var SupabaseRealtimeClient;
  var init_SupabaseRealtimeClient = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/SupabaseRealtimeClient.js"() {
      init_module3();
      SupabaseRealtimeClient = class {
        constructor(socket, headers, schema, tableName) {
          const chanParams = {};
          const topic = tableName === "*" ? `realtime:${schema}` : `realtime:${schema}:${tableName}`;
          const userToken = headers["Authorization"].split(" ")[1];
          if (userToken) {
            chanParams["user_token"] = userToken;
          }
          this.subscription = socket.channel(topic, chanParams);
        }
        getPayloadRecords(payload) {
          const records = {
            new: {},
            old: {}
          };
          if (payload.type === "INSERT" || payload.type === "UPDATE") {
            records.new = transformers_exports.convertChangeData(payload.columns, payload.record);
          }
          if (payload.type === "UPDATE" || payload.type === "DELETE") {
            records.old = transformers_exports.convertChangeData(payload.columns, payload.old_record);
          }
          return records;
        }
        on(event, callback) {
          this.subscription.on(event, (payload) => {
            let enrichedPayload = {
              schema: payload.schema,
              table: payload.table,
              commit_timestamp: payload.commit_timestamp,
              eventType: payload.type,
              new: {},
              old: {},
              errors: payload.errors
            };
            enrichedPayload = Object.assign(Object.assign({}, enrichedPayload), this.getPayloadRecords(payload));
            callback(enrichedPayload);
          });
          return this;
        }
        subscribe(callback = () => {
        }) {
          this.subscription.onError((e) => callback("SUBSCRIPTION_ERROR", e));
          this.subscription.onClose(() => callback("CLOSED"));
          this.subscription.subscribe().receive("ok", () => callback("SUBSCRIBED")).receive("error", (e) => callback("SUBSCRIPTION_ERROR", e)).receive("timeout", () => callback("RETRYING_AFTER_TIMEOUT"));
          return this.subscription;
        }
      };
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder.js
  var SupabaseQueryBuilder;
  var init_SupabaseQueryBuilder = __esm({
    "node_modules/@supabase/supabase-js/dist/module/lib/SupabaseQueryBuilder.js"() {
      init_module2();
      init_SupabaseRealtimeClient();
      SupabaseQueryBuilder = class extends PostgrestQueryBuilder {
        constructor(url, { headers = {}, schema, realtime, table, fetch: fetch3 }) {
          super(url, { headers, schema, fetch: fetch3 });
          this._subscription = null;
          this._realtime = realtime;
          this._headers = headers;
          this._schema = schema;
          this._table = table;
        }
        on(event, callback) {
          if (!this._realtime.isConnected()) {
            this._realtime.connect();
          }
          if (!this._subscription) {
            this._subscription = new SupabaseRealtimeClient(this._realtime, this._headers, this._schema, this._table);
          }
          return this._subscription.on(event, callback);
        }
      };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/fetch.js
  function _handleRequest2(fetcher = import_cross_fetch3.default, method, url, options, parameters, body) {
    return __awaiter6(this, void 0, void 0, function* () {
      return new Promise((resolve2, reject) => {
        fetcher(url, _getRequestParams2(method, options, parameters, body)).then((result) => {
          if (!result.ok)
            throw result;
          if (options === null || options === void 0 ? void 0 : options.noResolveJson)
            return resolve2(result);
          return result.json();
        }).then((data) => resolve2(data)).catch((error2) => handleError2(error2, reject));
      });
    });
  }
  function get2(fetcher, url, options, parameters) {
    return __awaiter6(this, void 0, void 0, function* () {
      return _handleRequest2(fetcher, "GET", url, options, parameters);
    });
  }
  function post2(fetcher, url, body, options, parameters) {
    return __awaiter6(this, void 0, void 0, function* () {
      return _handleRequest2(fetcher, "POST", url, options, parameters, body);
    });
  }
  function put2(fetcher, url, body, options, parameters) {
    return __awaiter6(this, void 0, void 0, function* () {
      return _handleRequest2(fetcher, "PUT", url, options, parameters, body);
    });
  }
  function remove2(fetcher, url, body, options, parameters) {
    return __awaiter6(this, void 0, void 0, function* () {
      return _handleRequest2(fetcher, "DELETE", url, options, parameters, body);
    });
  }
  var import_cross_fetch3, __awaiter6, _getErrorMessage2, handleError2, _getRequestParams2;
  var init_fetch2 = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/fetch.js"() {
      import_cross_fetch3 = __toModule(require_browser_ponyfill());
      __awaiter6 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      _getErrorMessage2 = (err) => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
      handleError2 = (error2, reject) => {
        if (typeof error2.json !== "function") {
          return reject(error2);
        }
        error2.json().then((err) => {
          return reject({
            message: _getErrorMessage2(err),
            status: (error2 === null || error2 === void 0 ? void 0 : error2.status) || 500
          });
        });
      };
      _getRequestParams2 = (method, options, parameters, body) => {
        const params = { method, headers: (options === null || options === void 0 ? void 0 : options.headers) || {} };
        if (method === "GET") {
          return params;
        }
        params.headers = Object.assign({ "Content-Type": "application/json" }, options === null || options === void 0 ? void 0 : options.headers);
        params.body = JSON.stringify(body);
        return Object.assign(Object.assign({}, params), parameters);
      };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/version.js
  var version5;
  var init_version5 = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/version.js"() {
      version5 = "0.0.0";
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/constants.js
  var DEFAULT_HEADERS5;
  var init_constants5 = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/constants.js"() {
      init_version5();
      DEFAULT_HEADERS5 = { "X-Client-Info": `storage-js/${version5}` };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/StorageBucketApi.js
  var __awaiter7, StorageBucketApi;
  var init_StorageBucketApi = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/StorageBucketApi.js"() {
      init_fetch2();
      init_constants5();
      __awaiter7 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      StorageBucketApi = class {
        constructor(url, headers = {}, fetch3) {
          this.url = url;
          this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS5), headers);
          this.fetch = fetch3;
        }
        listBuckets() {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield get2(this.fetch, `${this.url}/bucket`, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        getBucket(id) {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield get2(this.fetch, `${this.url}/bucket/${id}`, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        createBucket(id, options = { public: false }) {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield post2(this.fetch, `${this.url}/bucket`, { id, name: id, public: options.public }, { headers: this.headers });
              return { data: data.name, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        updateBucket(id, options) {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield put2(this.fetch, `${this.url}/bucket/${id}`, { id, name: id, public: options.public }, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        emptyBucket(id) {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield post2(this.fetch, `${this.url}/bucket/${id}/empty`, {}, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        deleteBucket(id) {
          return __awaiter7(this, void 0, void 0, function* () {
            try {
              const data = yield remove2(this.fetch, `${this.url}/bucket/${id}`, {}, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
      };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/StorageFileApi.js
  var import_cross_fetch4, __awaiter8, DEFAULT_SEARCH_OPTIONS, DEFAULT_FILE_OPTIONS, StorageFileApi;
  var init_StorageFileApi = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/StorageFileApi.js"() {
      init_fetch2();
      import_cross_fetch4 = __toModule(require_browser_ponyfill());
      __awaiter8 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      DEFAULT_SEARCH_OPTIONS = {
        limit: 100,
        offset: 0,
        sortBy: {
          column: "name",
          order: "asc"
        }
      };
      DEFAULT_FILE_OPTIONS = {
        cacheControl: "3600",
        contentType: "text/plain;charset=UTF-8",
        upsert: false
      };
      StorageFileApi = class {
        constructor(url, headers = {}, bucketId, fetch3) {
          this.url = url;
          this.headers = headers;
          this.bucketId = bucketId;
          this.fetch = fetch3;
        }
        uploadOrUpdate(method, path, fileBody, fileOptions) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              let body;
              const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
              const headers = Object.assign(Object.assign({}, this.headers), method === "POST" && { "x-upsert": String(options.upsert) });
              if (typeof Blob !== "undefined" && fileBody instanceof Blob) {
                body = new FormData();
                body.append("cacheControl", options.cacheControl);
                body.append("", fileBody);
              } else if (typeof FormData !== "undefined" && fileBody instanceof FormData) {
                body = fileBody;
                body.append("cacheControl", options.cacheControl);
              } else {
                body = fileBody;
                headers["cache-control"] = `max-age=${options.cacheControl}`;
                headers["content-type"] = options.contentType;
              }
              const cleanPath = this._removeEmptyFolders(path);
              const _path = this._getFinalPath(cleanPath);
              const res = yield (0, import_cross_fetch4.default)(`${this.url}/object/${_path}`, {
                method,
                body,
                headers
              });
              if (res.ok) {
                return { data: { Key: _path }, error: null };
              } else {
                const error2 = yield res.json();
                return { data: null, error: error2 };
              }
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        upload(path, fileBody, fileOptions) {
          return __awaiter8(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("POST", path, fileBody, fileOptions);
          });
        }
        update(path, fileBody, fileOptions) {
          return __awaiter8(this, void 0, void 0, function* () {
            return this.uploadOrUpdate("PUT", path, fileBody, fileOptions);
          });
        }
        move(fromPath, toPath) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              const data = yield post2(this.fetch, `${this.url}/object/move`, { bucketId: this.bucketId, sourceKey: fromPath, destinationKey: toPath }, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        createSignedUrl(path, expiresIn) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              const _path = this._getFinalPath(path);
              let data = yield post2(this.fetch, `${this.url}/object/sign/${_path}`, { expiresIn }, { headers: this.headers });
              const signedURL = `${this.url}${data.signedURL}`;
              data = { signedURL };
              return { data, error: null, signedURL };
            } catch (error2) {
              return { data: null, error: error2, signedURL: null };
            }
          });
        }
        download(path) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              const _path = this._getFinalPath(path);
              const res = yield get2(this.fetch, `${this.url}/object/${_path}`, {
                headers: this.headers,
                noResolveJson: true
              });
              const data = yield res.blob();
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        getPublicUrl(path) {
          try {
            const _path = this._getFinalPath(path);
            const publicURL = `${this.url}/object/public/${_path}`;
            const data = { publicURL };
            return { data, error: null, publicURL };
          } catch (error2) {
            return { data: null, error: error2, publicURL: null };
          }
        }
        remove(paths) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              const data = yield remove2(this.fetch, `${this.url}/object/${this.bucketId}`, { prefixes: paths }, { headers: this.headers });
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        list(path, options, parameters) {
          return __awaiter8(this, void 0, void 0, function* () {
            try {
              const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), { prefix: path || "" });
              const data = yield post2(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, { headers: this.headers }, parameters);
              return { data, error: null };
            } catch (error2) {
              return { data: null, error: error2 };
            }
          });
        }
        _getFinalPath(path) {
          return `${this.bucketId}/${path}`;
        }
        _removeEmptyFolders(path) {
          return path.replace(/^\/|\/$/g, "").replace(/\/+/g, "/");
        }
      };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/types.js
  var init_types3 = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/types.js"() {
    }
  });

  // node_modules/@supabase/storage-js/dist/module/lib/index.js
  var init_lib = __esm({
    "node_modules/@supabase/storage-js/dist/module/lib/index.js"() {
      init_StorageBucketApi();
      init_StorageFileApi();
      init_types3();
      init_constants5();
    }
  });

  // node_modules/@supabase/storage-js/dist/module/SupabaseStorageClient.js
  var SupabaseStorageClient;
  var init_SupabaseStorageClient = __esm({
    "node_modules/@supabase/storage-js/dist/module/SupabaseStorageClient.js"() {
      init_lib();
      SupabaseStorageClient = class extends StorageBucketApi {
        constructor(url, headers = {}, fetch3) {
          super(url, headers, fetch3);
        }
        from(id) {
          return new StorageFileApi(this.url, this.headers, id, this.fetch);
        }
      };
    }
  });

  // node_modules/@supabase/storage-js/dist/module/index.js
  var init_module4 = __esm({
    "node_modules/@supabase/storage-js/dist/module/index.js"() {
      init_SupabaseStorageClient();
      init_types3();
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js
  var __awaiter9, DEFAULT_OPTIONS2, SupabaseClient;
  var init_SupabaseClient = __esm({
    "node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js"() {
      init_constants();
      init_helpers();
      init_SupabaseAuthClient();
      init_SupabaseQueryBuilder();
      init_module4();
      init_module2();
      init_module3();
      __awaiter9 = function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      DEFAULT_OPTIONS2 = {
        schema: "public",
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        multiTab: true,
        headers: DEFAULT_HEADERS
      };
      SupabaseClient = class {
        constructor(supabaseUrl2, supabaseKey, options) {
          this.supabaseUrl = supabaseUrl2;
          this.supabaseKey = supabaseKey;
          if (!supabaseUrl2)
            throw new Error("supabaseUrl is required.");
          if (!supabaseKey)
            throw new Error("supabaseKey is required.");
          supabaseUrl2 = stripTrailingSlash(supabaseUrl2);
          const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS2), options);
          this.restUrl = `${supabaseUrl2}/rest/v1`;
          this.realtimeUrl = `${supabaseUrl2}/realtime/v1`.replace("http", "ws");
          this.authUrl = `${supabaseUrl2}/auth/v1`;
          this.storageUrl = `${supabaseUrl2}/storage/v1`;
          this.schema = settings.schema;
          this.multiTab = settings.multiTab;
          this.fetch = settings.fetch;
          this.headers = Object.assign(Object.assign({}, DEFAULT_HEADERS), options === null || options === void 0 ? void 0 : options.headers);
          this.auth = this._initSupabaseAuthClient(settings);
          this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers }, settings.realtime));
          this._listenForAuthEvents();
          this._listenForMultiTabEvents();
        }
        get storage() {
          return new SupabaseStorageClient(this.storageUrl, this._getAuthHeaders(), this.fetch);
        }
        from(table) {
          const url = `${this.restUrl}/${table}`;
          return new SupabaseQueryBuilder(url, {
            headers: this._getAuthHeaders(),
            schema: this.schema,
            realtime: this.realtime,
            table,
            fetch: this.fetch
          });
        }
        rpc(fn, params, { head = false, count = null } = {}) {
          const rest = this._initPostgRESTClient();
          return rest.rpc(fn, params, { head, count });
        }
        removeAllSubscriptions() {
          return __awaiter9(this, void 0, void 0, function* () {
            const subscriptions = this.realtime.channels.slice();
            return yield Promise.allSettled(subscriptions.map((sub) => this.removeSubscription(sub)));
          });
        }
        removeSubscription(subscription) {
          return new Promise((resolve2) => __awaiter9(this, void 0, void 0, function* () {
            try {
              yield this._closeSubscription(subscription);
              const allSubscriptions = this.getSubscriptions();
              const openSubscriptionsCount = allSubscriptions.filter((chan) => chan.isJoined()).length;
              if (!allSubscriptions.length) {
                const { error: error2 } = yield this.realtime.disconnect();
                if (error2)
                  return resolve2({ error: error2 });
              }
              return resolve2({ error: null, data: { openSubscriptions: openSubscriptionsCount } });
            } catch (error2) {
              return resolve2({ error: error2 });
            }
          }));
        }
        _closeSubscription(subscription) {
          return __awaiter9(this, void 0, void 0, function* () {
            if (!subscription.isClosed()) {
              yield this._closeChannel(subscription);
            }
            return new Promise((resolve2) => {
              this.realtime.remove(subscription);
              return resolve2(true);
            });
          });
        }
        getSubscriptions() {
          return this.realtime.channels;
        }
        _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, localStorage, headers, fetch: fetch3 }) {
          const authHeaders = {
            Authorization: `Bearer ${this.supabaseKey}`,
            apikey: `${this.supabaseKey}`
          };
          return new SupabaseAuthClient({
            url: this.authUrl,
            headers: Object.assign(Object.assign({}, headers), authHeaders),
            autoRefreshToken,
            persistSession,
            detectSessionInUrl,
            localStorage,
            fetch: fetch3
          });
        }
        _initRealtimeClient(options) {
          return new RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), { params: Object.assign(Object.assign({}, options === null || options === void 0 ? void 0 : options.params), { apikey: this.supabaseKey }) }));
        }
        _initPostgRESTClient() {
          return new PostgrestClient(this.restUrl, {
            headers: this._getAuthHeaders(),
            schema: this.schema,
            fetch: this.fetch
          });
        }
        _getAuthHeaders() {
          var _a, _b;
          const headers = this.headers;
          const authBearer = (_b = (_a = this.auth.session()) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
          headers["apikey"] = this.supabaseKey;
          headers["Authorization"] = `Bearer ${authBearer}`;
          return headers;
        }
        _closeChannel(subscription) {
          return new Promise((resolve2, reject) => {
            subscription.unsubscribe().receive("ok", () => {
              return resolve2(true);
            }).receive("error", (e) => reject(e));
          });
        }
        _listenForMultiTabEvents() {
          if (!this.multiTab || !isBrowser() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
            return null;
          }
          try {
            return window === null || window === void 0 ? void 0 : window.addEventListener("storage", (e) => {
              var _a, _b, _c;
              if (e.key === STORAGE_KEY) {
                const newSession = JSON.parse(String(e.newValue));
                const accessToken = (_b = (_a = newSession === null || newSession === void 0 ? void 0 : newSession.currentSession) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : void 0;
                const previousAccessToken = (_c = this.auth.session()) === null || _c === void 0 ? void 0 : _c.access_token;
                if (!accessToken) {
                  this._handleTokenChanged("SIGNED_OUT", accessToken, "STORAGE");
                } else if (!previousAccessToken && accessToken) {
                  this._handleTokenChanged("SIGNED_IN", accessToken, "STORAGE");
                } else if (previousAccessToken !== accessToken) {
                  this._handleTokenChanged("TOKEN_REFRESHED", accessToken, "STORAGE");
                }
              }
            });
          } catch (error2) {
            console.error("_listenForMultiTabEvents", error2);
            return null;
          }
        }
        _listenForAuthEvents() {
          let { data } = this.auth.onAuthStateChange((event, session) => {
            this._handleTokenChanged(event, session === null || session === void 0 ? void 0 : session.access_token, "CLIENT");
          });
          return data;
        }
        _handleTokenChanged(event, token, source) {
          if ((event === "TOKEN_REFRESHED" || event === "SIGNED_IN") && this.changedAccessToken !== token) {
            this.realtime.setAuth(token);
            if (source == "STORAGE")
              this.auth.setAuth(token);
            this.changedAccessToken = token;
          } else if (event === "SIGNED_OUT" || event === "USER_DELETED") {
            this.removeAllSubscriptions();
            if (source == "STORAGE")
              this.auth.signOut();
          }
        }
      };
    }
  });

  // node_modules/@supabase/supabase-js/dist/module/index.js
  var createClient;
  var init_module5 = __esm({
    "node_modules/@supabase/supabase-js/dist/module/index.js"() {
      init_SupabaseClient();
      init_module();
      init_module3();
      createClient = (supabaseUrl2, supabaseKey, options) => {
        return new SupabaseClient(supabaseUrl2, supabaseKey, options);
      };
    }
  });

  // .svelte-kit/output/server/chunks/supabaseClient-c7a431a8.js
  function writable2(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
      if (safe_not_equal(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue2.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue2.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue2.length; i += 2) {
              subscriber_queue2[i][0](subscriber_queue2[i + 1]);
            }
            subscriber_queue2.length = 0;
          }
        }
      }
    }
    function update(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe: subscribe2 };
  }
  var subscriber_queue2, supabaseUrl, supabaseAnonKey, supabase;
  var init_supabaseClient_c7a431a8 = __esm({
    ".svelte-kit/output/server/chunks/supabaseClient-c7a431a8.js"() {
      init_index_1788aa30();
      init_module5();
      subscriber_queue2 = [];
      supabaseUrl = "https://soxjotxetohyeoqzsiiy.supabase.co";
      supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQyNjgyOTQ0LCJleHAiOjE5NTgyNTg5NDR9.NGqIzEpufeplSn7u6jB_VsFb6KhhhIwYIUuGDrcMRmQ";
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log(supabase);
    }
  });

  // .svelte-kit/output/server/entries/pages/events/index.svelte.js
  var index_svelte_exports2 = {};
  __export(index_svelte_exports2, {
    default: () => Events
  });
  var events, getData, Events;
  var init_index_svelte2 = __esm({
    ".svelte-kit/output/server/entries/pages/events/index.svelte.js"() {
      init_index_1788aa30();
      init_supabaseClient_c7a431a8();
      events = writable2([]);
      getData = async () => {
        console.log("Hello");
        const { data, error: error2 } = await supabase.from("events").select();
        if (error2)
          return console.error(error2);
        console.log(data);
        events.set(data);
      };
      Events = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        let $events, $$unsubscribe_events;
        $$unsubscribe_events = subscribe(events, (value) => $events = value);
        getData();
        $$unsubscribe_events();
        return `<main>${each($events, (event) => {
          return `<div class="${"rounded p-4 m-4 drop-shadow-lg hover:bg-slate-200"}"><p class="${"font-epilogue mx-auto p-4 "}">${escape(event.description)}</p>
			<a class="${"rounded px-4 py-3 bg-purple-500 hover:bg-purple-400"}"${add_attribute("href", `/forms/${event.id}`, 0)}>Register
			</a>
		</div>`;
        })}</main>`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/3.js
  var __exports4 = {};
  __export(__exports4, {
    css: () => css5,
    entry: () => entry4,
    js: () => js4,
    module: () => index_svelte_exports2
  });
  var entry4, js4, css5;
  var init__4 = __esm({
    ".svelte-kit/output/server/nodes/3.js"() {
      init_index_svelte2();
      entry4 = "pages/events/index.svelte-b50cf8af.js";
      js4 = ["pages/events/index.svelte-b50cf8af.js", "chunks/vendor-e168ef23.js", "chunks/supabaseClient-379353d4.js"];
      css5 = [];
    }
  });

  // .svelte-kit/output/server/entries/pages/about.svelte.js
  var about_svelte_exports = {};
  __export(about_svelte_exports, {
    default: () => About
  });
  var About;
  var init_about_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/about.svelte.js"() {
      init_index_1788aa30();
      About = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<p class="${"font-epilogue"}">Lorem ipsum dolor sit amet consectetur adipisicing elit. At, perferendis dignissimos. Voluptatem
	fuga aspernatur, iure nesciunt nulla itaque distinctio autem voluptas atque, dolore ipsam
	laboriosam dolorum aut debitis! A, perferendis.
</p>`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/4.js
  var __exports5 = {};
  __export(__exports5, {
    css: () => css6,
    entry: () => entry5,
    js: () => js5,
    module: () => about_svelte_exports
  });
  var entry5, js5, css6;
  var init__5 = __esm({
    ".svelte-kit/output/server/nodes/4.js"() {
      init_about_svelte();
      entry5 = "pages/about.svelte-57d3ecab.js";
      js5 = ["pages/about.svelte-57d3ecab.js", "chunks/vendor-e168ef23.js"];
      css6 = [];
    }
  });

  // .svelte-kit/output/server/entries/pages/forms/index.svelte.js
  var index_svelte_exports3 = {};
  __export(index_svelte_exports3, {
    default: () => Forms
  });
  var Forms;
  var init_index_svelte3 = __esm({
    ".svelte-kit/output/server/entries/pages/forms/index.svelte.js"() {
      init_index_1788aa30();
      Forms = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return ``;
      });
    }
  });

  // .svelte-kit/output/server/nodes/5.js
  var __exports6 = {};
  __export(__exports6, {
    css: () => css7,
    entry: () => entry6,
    js: () => js6,
    module: () => index_svelte_exports3
  });
  var entry6, js6, css7;
  var init__6 = __esm({
    ".svelte-kit/output/server/nodes/5.js"() {
      init_index_svelte3();
      entry6 = "pages/forms/index.svelte-1b185aa3.js";
      js6 = ["pages/forms/index.svelte-1b185aa3.js", "chunks/vendor-e168ef23.js"];
      css7 = [];
    }
  });

  // .svelte-kit/output/server/entries/pages/forms/register.svelte.js
  var register_svelte_exports = {};
  __export(register_svelte_exports, {
    default: () => Register
  });
  var Register;
  var init_register_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/forms/register.svelte.js"() {
      init_index_1788aa30();
      Register = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        return `<h1 class="${"font-epilogue"}">Registration Page. Very Important</h1>`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/6.js
  var __exports7 = {};
  __export(__exports7, {
    css: () => css8,
    entry: () => entry7,
    js: () => js7,
    module: () => register_svelte_exports
  });
  var entry7, js7, css8;
  var init__7 = __esm({
    ".svelte-kit/output/server/nodes/6.js"() {
      init_register_svelte();
      entry7 = "pages/forms/register.svelte-52ddd156.js";
      js7 = ["pages/forms/register.svelte-52ddd156.js", "chunks/vendor-e168ef23.js"];
      css8 = [];
    }
  });

  // .svelte-kit/output/server/entries/pages/forms/_id_.svelte.js
  var id_svelte_exports = {};
  __export(id_svelte_exports, {
    default: () => U5Bidu5D,
    load: () => load2
  });
  async function load2({ params }) {
    const id = params.id;
    console.log(id);
    return { props: { id } };
  }
  var personId, Form, U5Bidu5D;
  var init_id_svelte = __esm({
    ".svelte-kit/output/server/entries/pages/forms/_id_.svelte.js"() {
      init_index_1788aa30();
      init_supabaseClient_c7a431a8();
      personId = writable2([]);
      Form = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        let $$unsubscribe_personId;
        $$unsubscribe_personId = subscribe(personId, (value) => value);
        let firstName = "";
        let lastName = "";
        let { id } = $$props;
        if ($$props.id === void 0 && $$bindings.id && id !== void 0)
          $$bindings.id(id);
        $$unsubscribe_personId();
        return `<form class="${"my-6 max-w-sm"}"><label class="${"font-bold mb-2 text-gray-800"}" for="${"firstName"}">First Name</label>
	<input class="${"appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500"}" type="${"text"}" name="${"firstName"}" placeholder="${"First Name"}"${add_attribute("value", firstName, 0)}>

	<label class="${"font-bold mb-2 text-gray-800"}" for="${"lastName"}">Last Name</label>
	<input class="${"appearance-none shadow-sm border border-gray-200 p-2 focus:outline-none focus:border-gray-500"}" type="${"text"}" name="${"lastName"}" placeholder="${"Last Name"}"${add_attribute("value", lastName, 0)}>
	<button type="${"submit"}" class="${"w-20 shadow-sm rounded bg-purple-500 hover:bg-purple-400 text-black py-2"}">Submit</button></form>`;
      });
      U5Bidu5D = create_ssr_component(($$result, $$props, $$bindings, slots) => {
        let { id } = $$props;
        console.log(id);
        if ($$props.id === void 0 && $$bindings.id && id !== void 0)
          $$bindings.id(id);
        return `${validate_component(Form, "Form").$$render($$result, { id }, {}, {})}`;
      });
    }
  });

  // .svelte-kit/output/server/nodes/7.js
  var __exports8 = {};
  __export(__exports8, {
    css: () => css9,
    entry: () => entry8,
    js: () => js8,
    module: () => id_svelte_exports
  });
  var entry8, js8, css9;
  var init__8 = __esm({
    ".svelte-kit/output/server/nodes/7.js"() {
      init_id_svelte();
      entry8 = "pages/forms/_id_.svelte-7fe6aa8e.js";
      js8 = ["pages/forms/_id_.svelte-7fe6aa8e.js", "chunks/vendor-e168ef23.js", "chunks/supabaseClient-379353d4.js"];
      css9 = [];
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/mime/Mime.js
  var require_Mime = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/mime/Mime.js"(exports, module) {
      "use strict";
      function Mime() {
        this._types = Object.create(null);
        this._extensions = Object.create(null);
        for (let i = 0; i < arguments.length; i++) {
          this.define(arguments[i]);
        }
        this.define = this.define.bind(this);
        this.getType = this.getType.bind(this);
        this.getExtension = this.getExtension.bind(this);
      }
      Mime.prototype.define = function(typeMap, force) {
        for (let type in typeMap) {
          let extensions = typeMap[type].map(function(t) {
            return t.toLowerCase();
          });
          type = type.toLowerCase();
          for (let i = 0; i < extensions.length; i++) {
            const ext = extensions[i];
            if (ext[0] === "*") {
              continue;
            }
            if (!force && ext in this._types) {
              throw new Error('Attempt to change mapping for "' + ext + '" extension from "' + this._types[ext] + '" to "' + type + '". Pass `force=true` to allow this, otherwise remove "' + ext + '" from the list of extensions for "' + type + '".');
            }
            this._types[ext] = type;
          }
          if (force || !this._extensions[type]) {
            const ext = extensions[0];
            this._extensions[type] = ext[0] !== "*" ? ext : ext.substr(1);
          }
        }
      };
      Mime.prototype.getType = function(path) {
        path = String(path);
        let last = path.replace(/^.*[/\\]/, "").toLowerCase();
        let ext = last.replace(/^.*\./, "").toLowerCase();
        let hasPath = last.length < path.length;
        let hasDot = ext.length < last.length - 1;
        return (hasDot || !hasPath) && this._types[ext] || null;
      };
      Mime.prototype.getExtension = function(type) {
        type = /^\s*([^;\s]*)/.test(type) && RegExp.$1;
        return type && this._extensions[type.toLowerCase()] || null;
      };
      module.exports = Mime;
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/mime/types/standard.js
  var require_standard = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/mime/types/standard.js"(exports, module) {
      module.exports = { "application/andrew-inset": ["ez"], "application/applixware": ["aw"], "application/atom+xml": ["atom"], "application/atomcat+xml": ["atomcat"], "application/atomdeleted+xml": ["atomdeleted"], "application/atomsvc+xml": ["atomsvc"], "application/atsc-dwd+xml": ["dwd"], "application/atsc-held+xml": ["held"], "application/atsc-rsat+xml": ["rsat"], "application/bdoc": ["bdoc"], "application/calendar+xml": ["xcs"], "application/ccxml+xml": ["ccxml"], "application/cdfx+xml": ["cdfx"], "application/cdmi-capability": ["cdmia"], "application/cdmi-container": ["cdmic"], "application/cdmi-domain": ["cdmid"], "application/cdmi-object": ["cdmio"], "application/cdmi-queue": ["cdmiq"], "application/cu-seeme": ["cu"], "application/dash+xml": ["mpd"], "application/davmount+xml": ["davmount"], "application/docbook+xml": ["dbk"], "application/dssc+der": ["dssc"], "application/dssc+xml": ["xdssc"], "application/ecmascript": ["es", "ecma"], "application/emma+xml": ["emma"], "application/emotionml+xml": ["emotionml"], "application/epub+zip": ["epub"], "application/exi": ["exi"], "application/express": ["exp"], "application/fdt+xml": ["fdt"], "application/font-tdpfr": ["pfr"], "application/geo+json": ["geojson"], "application/gml+xml": ["gml"], "application/gpx+xml": ["gpx"], "application/gxf": ["gxf"], "application/gzip": ["gz"], "application/hjson": ["hjson"], "application/hyperstudio": ["stk"], "application/inkml+xml": ["ink", "inkml"], "application/ipfix": ["ipfix"], "application/its+xml": ["its"], "application/java-archive": ["jar", "war", "ear"], "application/java-serialized-object": ["ser"], "application/java-vm": ["class"], "application/javascript": ["js", "mjs"], "application/json": ["json", "map"], "application/json5": ["json5"], "application/jsonml+json": ["jsonml"], "application/ld+json": ["jsonld"], "application/lgr+xml": ["lgr"], "application/lost+xml": ["lostxml"], "application/mac-binhex40": ["hqx"], "application/mac-compactpro": ["cpt"], "application/mads+xml": ["mads"], "application/manifest+json": ["webmanifest"], "application/marc": ["mrc"], "application/marcxml+xml": ["mrcx"], "application/mathematica": ["ma", "nb", "mb"], "application/mathml+xml": ["mathml"], "application/mbox": ["mbox"], "application/mediaservercontrol+xml": ["mscml"], "application/metalink+xml": ["metalink"], "application/metalink4+xml": ["meta4"], "application/mets+xml": ["mets"], "application/mmt-aei+xml": ["maei"], "application/mmt-usd+xml": ["musd"], "application/mods+xml": ["mods"], "application/mp21": ["m21", "mp21"], "application/mp4": ["mp4s", "m4p"], "application/msword": ["doc", "dot"], "application/mxf": ["mxf"], "application/n-quads": ["nq"], "application/n-triples": ["nt"], "application/node": ["cjs"], "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "exe", "dll", "deb", "dmg", "iso", "img", "msi", "msp", "msm", "buffer"], "application/oda": ["oda"], "application/oebps-package+xml": ["opf"], "application/ogg": ["ogx"], "application/omdoc+xml": ["omdoc"], "application/onenote": ["onetoc", "onetoc2", "onetmp", "onepkg"], "application/oxps": ["oxps"], "application/p2p-overlay+xml": ["relo"], "application/patch-ops-error+xml": ["xer"], "application/pdf": ["pdf"], "application/pgp-encrypted": ["pgp"], "application/pgp-signature": ["asc", "sig"], "application/pics-rules": ["prf"], "application/pkcs10": ["p10"], "application/pkcs7-mime": ["p7m", "p7c"], "application/pkcs7-signature": ["p7s"], "application/pkcs8": ["p8"], "application/pkix-attr-cert": ["ac"], "application/pkix-cert": ["cer"], "application/pkix-crl": ["crl"], "application/pkix-pkipath": ["pkipath"], "application/pkixcmp": ["pki"], "application/pls+xml": ["pls"], "application/postscript": ["ai", "eps", "ps"], "application/provenance+xml": ["provx"], "application/pskc+xml": ["pskcxml"], "application/raml+yaml": ["raml"], "application/rdf+xml": ["rdf", "owl"], "application/reginfo+xml": ["rif"], "application/relax-ng-compact-syntax": ["rnc"], "application/resource-lists+xml": ["rl"], "application/resource-lists-diff+xml": ["rld"], "application/rls-services+xml": ["rs"], "application/route-apd+xml": ["rapd"], "application/route-s-tsid+xml": ["sls"], "application/route-usd+xml": ["rusd"], "application/rpki-ghostbusters": ["gbr"], "application/rpki-manifest": ["mft"], "application/rpki-roa": ["roa"], "application/rsd+xml": ["rsd"], "application/rss+xml": ["rss"], "application/rtf": ["rtf"], "application/sbml+xml": ["sbml"], "application/scvp-cv-request": ["scq"], "application/scvp-cv-response": ["scs"], "application/scvp-vp-request": ["spq"], "application/scvp-vp-response": ["spp"], "application/sdp": ["sdp"], "application/senml+xml": ["senmlx"], "application/sensml+xml": ["sensmlx"], "application/set-payment-initiation": ["setpay"], "application/set-registration-initiation": ["setreg"], "application/shf+xml": ["shf"], "application/sieve": ["siv", "sieve"], "application/smil+xml": ["smi", "smil"], "application/sparql-query": ["rq"], "application/sparql-results+xml": ["srx"], "application/srgs": ["gram"], "application/srgs+xml": ["grxml"], "application/sru+xml": ["sru"], "application/ssdl+xml": ["ssdl"], "application/ssml+xml": ["ssml"], "application/swid+xml": ["swidtag"], "application/tei+xml": ["tei", "teicorpus"], "application/thraud+xml": ["tfi"], "application/timestamped-data": ["tsd"], "application/toml": ["toml"], "application/trig": ["trig"], "application/ttml+xml": ["ttml"], "application/ubjson": ["ubj"], "application/urc-ressheet+xml": ["rsheet"], "application/urc-targetdesc+xml": ["td"], "application/voicexml+xml": ["vxml"], "application/wasm": ["wasm"], "application/widget": ["wgt"], "application/winhlp": ["hlp"], "application/wsdl+xml": ["wsdl"], "application/wspolicy+xml": ["wspolicy"], "application/xaml+xml": ["xaml"], "application/xcap-att+xml": ["xav"], "application/xcap-caps+xml": ["xca"], "application/xcap-diff+xml": ["xdf"], "application/xcap-el+xml": ["xel"], "application/xcap-ns+xml": ["xns"], "application/xenc+xml": ["xenc"], "application/xhtml+xml": ["xhtml", "xht"], "application/xliff+xml": ["xlf"], "application/xml": ["xml", "xsl", "xsd", "rng"], "application/xml-dtd": ["dtd"], "application/xop+xml": ["xop"], "application/xproc+xml": ["xpl"], "application/xslt+xml": ["*xsl", "xslt"], "application/xspf+xml": ["xspf"], "application/xv+xml": ["mxml", "xhvml", "xvml", "xvm"], "application/yang": ["yang"], "application/yin+xml": ["yin"], "application/zip": ["zip"], "audio/3gpp": ["*3gpp"], "audio/adpcm": ["adp"], "audio/amr": ["amr"], "audio/basic": ["au", "snd"], "audio/midi": ["mid", "midi", "kar", "rmi"], "audio/mobile-xmf": ["mxmf"], "audio/mp3": ["*mp3"], "audio/mp4": ["m4a", "mp4a"], "audio/mpeg": ["mpga", "mp2", "mp2a", "mp3", "m2a", "m3a"], "audio/ogg": ["oga", "ogg", "spx", "opus"], "audio/s3m": ["s3m"], "audio/silk": ["sil"], "audio/wav": ["wav"], "audio/wave": ["*wav"], "audio/webm": ["weba"], "audio/xm": ["xm"], "font/collection": ["ttc"], "font/otf": ["otf"], "font/ttf": ["ttf"], "font/woff": ["woff"], "font/woff2": ["woff2"], "image/aces": ["exr"], "image/apng": ["apng"], "image/avif": ["avif"], "image/bmp": ["bmp"], "image/cgm": ["cgm"], "image/dicom-rle": ["drle"], "image/emf": ["emf"], "image/fits": ["fits"], "image/g3fax": ["g3"], "image/gif": ["gif"], "image/heic": ["heic"], "image/heic-sequence": ["heics"], "image/heif": ["heif"], "image/heif-sequence": ["heifs"], "image/hej2k": ["hej2"], "image/hsj2": ["hsj2"], "image/ief": ["ief"], "image/jls": ["jls"], "image/jp2": ["jp2", "jpg2"], "image/jpeg": ["jpeg", "jpg", "jpe"], "image/jph": ["jph"], "image/jphc": ["jhc"], "image/jpm": ["jpm"], "image/jpx": ["jpx", "jpf"], "image/jxr": ["jxr"], "image/jxra": ["jxra"], "image/jxrs": ["jxrs"], "image/jxs": ["jxs"], "image/jxsc": ["jxsc"], "image/jxsi": ["jxsi"], "image/jxss": ["jxss"], "image/ktx": ["ktx"], "image/ktx2": ["ktx2"], "image/png": ["png"], "image/sgi": ["sgi"], "image/svg+xml": ["svg", "svgz"], "image/t38": ["t38"], "image/tiff": ["tif", "tiff"], "image/tiff-fx": ["tfx"], "image/webp": ["webp"], "image/wmf": ["wmf"], "message/disposition-notification": ["disposition-notification"], "message/global": ["u8msg"], "message/global-delivery-status": ["u8dsn"], "message/global-disposition-notification": ["u8mdn"], "message/global-headers": ["u8hdr"], "message/rfc822": ["eml", "mime"], "model/3mf": ["3mf"], "model/gltf+json": ["gltf"], "model/gltf-binary": ["glb"], "model/iges": ["igs", "iges"], "model/mesh": ["msh", "mesh", "silo"], "model/mtl": ["mtl"], "model/obj": ["obj"], "model/step+xml": ["stpx"], "model/step+zip": ["stpz"], "model/step-xml+zip": ["stpxz"], "model/stl": ["stl"], "model/vrml": ["wrl", "vrml"], "model/x3d+binary": ["*x3db", "x3dbz"], "model/x3d+fastinfoset": ["x3db"], "model/x3d+vrml": ["*x3dv", "x3dvz"], "model/x3d+xml": ["x3d", "x3dz"], "model/x3d-vrml": ["x3dv"], "text/cache-manifest": ["appcache", "manifest"], "text/calendar": ["ics", "ifb"], "text/coffeescript": ["coffee", "litcoffee"], "text/css": ["css"], "text/csv": ["csv"], "text/html": ["html", "htm", "shtml"], "text/jade": ["jade"], "text/jsx": ["jsx"], "text/less": ["less"], "text/markdown": ["markdown", "md"], "text/mathml": ["mml"], "text/mdx": ["mdx"], "text/n3": ["n3"], "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"], "text/richtext": ["rtx"], "text/rtf": ["*rtf"], "text/sgml": ["sgml", "sgm"], "text/shex": ["shex"], "text/slim": ["slim", "slm"], "text/spdx": ["spdx"], "text/stylus": ["stylus", "styl"], "text/tab-separated-values": ["tsv"], "text/troff": ["t", "tr", "roff", "man", "me", "ms"], "text/turtle": ["ttl"], "text/uri-list": ["uri", "uris", "urls"], "text/vcard": ["vcard"], "text/vtt": ["vtt"], "text/xml": ["*xml"], "text/yaml": ["yaml", "yml"], "video/3gpp": ["3gp", "3gpp"], "video/3gpp2": ["3g2"], "video/h261": ["h261"], "video/h263": ["h263"], "video/h264": ["h264"], "video/iso.segment": ["m4s"], "video/jpeg": ["jpgv"], "video/jpm": ["*jpm", "jpgm"], "video/mj2": ["mj2", "mjp2"], "video/mp2t": ["ts"], "video/mp4": ["mp4", "mp4v", "mpg4"], "video/mpeg": ["mpeg", "mpg", "mpe", "m1v", "m2v"], "video/ogg": ["ogv"], "video/quicktime": ["qt", "mov"], "video/webm": ["webm"] };
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/mime/types/other.js
  var require_other = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/mime/types/other.js"(exports, module) {
      module.exports = { "application/prs.cww": ["cww"], "application/vnd.1000minds.decision-model+xml": ["1km"], "application/vnd.3gpp.pic-bw-large": ["plb"], "application/vnd.3gpp.pic-bw-small": ["psb"], "application/vnd.3gpp.pic-bw-var": ["pvb"], "application/vnd.3gpp2.tcap": ["tcap"], "application/vnd.3m.post-it-notes": ["pwn"], "application/vnd.accpac.simply.aso": ["aso"], "application/vnd.accpac.simply.imp": ["imp"], "application/vnd.acucobol": ["acu"], "application/vnd.acucorp": ["atc", "acutc"], "application/vnd.adobe.air-application-installer-package+zip": ["air"], "application/vnd.adobe.formscentral.fcdt": ["fcdt"], "application/vnd.adobe.fxp": ["fxp", "fxpl"], "application/vnd.adobe.xdp+xml": ["xdp"], "application/vnd.adobe.xfdf": ["xfdf"], "application/vnd.ahead.space": ["ahead"], "application/vnd.airzip.filesecure.azf": ["azf"], "application/vnd.airzip.filesecure.azs": ["azs"], "application/vnd.amazon.ebook": ["azw"], "application/vnd.americandynamics.acc": ["acc"], "application/vnd.amiga.ami": ["ami"], "application/vnd.android.package-archive": ["apk"], "application/vnd.anser-web-certificate-issue-initiation": ["cii"], "application/vnd.anser-web-funds-transfer-initiation": ["fti"], "application/vnd.antix.game-component": ["atx"], "application/vnd.apple.installer+xml": ["mpkg"], "application/vnd.apple.keynote": ["key"], "application/vnd.apple.mpegurl": ["m3u8"], "application/vnd.apple.numbers": ["numbers"], "application/vnd.apple.pages": ["pages"], "application/vnd.apple.pkpass": ["pkpass"], "application/vnd.aristanetworks.swi": ["swi"], "application/vnd.astraea-software.iota": ["iota"], "application/vnd.audiograph": ["aep"], "application/vnd.balsamiq.bmml+xml": ["bmml"], "application/vnd.blueice.multipass": ["mpm"], "application/vnd.bmi": ["bmi"], "application/vnd.businessobjects": ["rep"], "application/vnd.chemdraw+xml": ["cdxml"], "application/vnd.chipnuts.karaoke-mmd": ["mmd"], "application/vnd.cinderella": ["cdy"], "application/vnd.citationstyles.style+xml": ["csl"], "application/vnd.claymore": ["cla"], "application/vnd.cloanto.rp9": ["rp9"], "application/vnd.clonk.c4group": ["c4g", "c4d", "c4f", "c4p", "c4u"], "application/vnd.cluetrust.cartomobile-config": ["c11amc"], "application/vnd.cluetrust.cartomobile-config-pkg": ["c11amz"], "application/vnd.commonspace": ["csp"], "application/vnd.contact.cmsg": ["cdbcmsg"], "application/vnd.cosmocaller": ["cmc"], "application/vnd.crick.clicker": ["clkx"], "application/vnd.crick.clicker.keyboard": ["clkk"], "application/vnd.crick.clicker.palette": ["clkp"], "application/vnd.crick.clicker.template": ["clkt"], "application/vnd.crick.clicker.wordbank": ["clkw"], "application/vnd.criticaltools.wbs+xml": ["wbs"], "application/vnd.ctc-posml": ["pml"], "application/vnd.cups-ppd": ["ppd"], "application/vnd.curl.car": ["car"], "application/vnd.curl.pcurl": ["pcurl"], "application/vnd.dart": ["dart"], "application/vnd.data-vision.rdz": ["rdz"], "application/vnd.dbf": ["dbf"], "application/vnd.dece.data": ["uvf", "uvvf", "uvd", "uvvd"], "application/vnd.dece.ttml+xml": ["uvt", "uvvt"], "application/vnd.dece.unspecified": ["uvx", "uvvx"], "application/vnd.dece.zip": ["uvz", "uvvz"], "application/vnd.denovo.fcselayout-link": ["fe_launch"], "application/vnd.dna": ["dna"], "application/vnd.dolby.mlp": ["mlp"], "application/vnd.dpgraph": ["dpg"], "application/vnd.dreamfactory": ["dfac"], "application/vnd.ds-keypoint": ["kpxx"], "application/vnd.dvb.ait": ["ait"], "application/vnd.dvb.service": ["svc"], "application/vnd.dynageo": ["geo"], "application/vnd.ecowin.chart": ["mag"], "application/vnd.enliven": ["nml"], "application/vnd.epson.esf": ["esf"], "application/vnd.epson.msf": ["msf"], "application/vnd.epson.quickanime": ["qam"], "application/vnd.epson.salt": ["slt"], "application/vnd.epson.ssf": ["ssf"], "application/vnd.eszigno3+xml": ["es3", "et3"], "application/vnd.ezpix-album": ["ez2"], "application/vnd.ezpix-package": ["ez3"], "application/vnd.fdf": ["fdf"], "application/vnd.fdsn.mseed": ["mseed"], "application/vnd.fdsn.seed": ["seed", "dataless"], "application/vnd.flographit": ["gph"], "application/vnd.fluxtime.clip": ["ftc"], "application/vnd.framemaker": ["fm", "frame", "maker", "book"], "application/vnd.frogans.fnc": ["fnc"], "application/vnd.frogans.ltf": ["ltf"], "application/vnd.fsc.weblaunch": ["fsc"], "application/vnd.fujitsu.oasys": ["oas"], "application/vnd.fujitsu.oasys2": ["oa2"], "application/vnd.fujitsu.oasys3": ["oa3"], "application/vnd.fujitsu.oasysgp": ["fg5"], "application/vnd.fujitsu.oasysprs": ["bh2"], "application/vnd.fujixerox.ddd": ["ddd"], "application/vnd.fujixerox.docuworks": ["xdw"], "application/vnd.fujixerox.docuworks.binder": ["xbd"], "application/vnd.fuzzysheet": ["fzs"], "application/vnd.genomatix.tuxedo": ["txd"], "application/vnd.geogebra.file": ["ggb"], "application/vnd.geogebra.tool": ["ggt"], "application/vnd.geometry-explorer": ["gex", "gre"], "application/vnd.geonext": ["gxt"], "application/vnd.geoplan": ["g2w"], "application/vnd.geospace": ["g3w"], "application/vnd.gmx": ["gmx"], "application/vnd.google-apps.document": ["gdoc"], "application/vnd.google-apps.presentation": ["gslides"], "application/vnd.google-apps.spreadsheet": ["gsheet"], "application/vnd.google-earth.kml+xml": ["kml"], "application/vnd.google-earth.kmz": ["kmz"], "application/vnd.grafeq": ["gqf", "gqs"], "application/vnd.groove-account": ["gac"], "application/vnd.groove-help": ["ghf"], "application/vnd.groove-identity-message": ["gim"], "application/vnd.groove-injector": ["grv"], "application/vnd.groove-tool-message": ["gtm"], "application/vnd.groove-tool-template": ["tpl"], "application/vnd.groove-vcard": ["vcg"], "application/vnd.hal+xml": ["hal"], "application/vnd.handheld-entertainment+xml": ["zmm"], "application/vnd.hbci": ["hbci"], "application/vnd.hhe.lesson-player": ["les"], "application/vnd.hp-hpgl": ["hpgl"], "application/vnd.hp-hpid": ["hpid"], "application/vnd.hp-hps": ["hps"], "application/vnd.hp-jlyt": ["jlt"], "application/vnd.hp-pcl": ["pcl"], "application/vnd.hp-pclxl": ["pclxl"], "application/vnd.hydrostatix.sof-data": ["sfd-hdstx"], "application/vnd.ibm.minipay": ["mpy"], "application/vnd.ibm.modcap": ["afp", "listafp", "list3820"], "application/vnd.ibm.rights-management": ["irm"], "application/vnd.ibm.secure-container": ["sc"], "application/vnd.iccprofile": ["icc", "icm"], "application/vnd.igloader": ["igl"], "application/vnd.immervision-ivp": ["ivp"], "application/vnd.immervision-ivu": ["ivu"], "application/vnd.insors.igm": ["igm"], "application/vnd.intercon.formnet": ["xpw", "xpx"], "application/vnd.intergeo": ["i2g"], "application/vnd.intu.qbo": ["qbo"], "application/vnd.intu.qfx": ["qfx"], "application/vnd.ipunplugged.rcprofile": ["rcprofile"], "application/vnd.irepository.package+xml": ["irp"], "application/vnd.is-xpr": ["xpr"], "application/vnd.isac.fcs": ["fcs"], "application/vnd.jam": ["jam"], "application/vnd.jcp.javame.midlet-rms": ["rms"], "application/vnd.jisp": ["jisp"], "application/vnd.joost.joda-archive": ["joda"], "application/vnd.kahootz": ["ktz", "ktr"], "application/vnd.kde.karbon": ["karbon"], "application/vnd.kde.kchart": ["chrt"], "application/vnd.kde.kformula": ["kfo"], "application/vnd.kde.kivio": ["flw"], "application/vnd.kde.kontour": ["kon"], "application/vnd.kde.kpresenter": ["kpr", "kpt"], "application/vnd.kde.kspread": ["ksp"], "application/vnd.kde.kword": ["kwd", "kwt"], "application/vnd.kenameaapp": ["htke"], "application/vnd.kidspiration": ["kia"], "application/vnd.kinar": ["kne", "knp"], "application/vnd.koan": ["skp", "skd", "skt", "skm"], "application/vnd.kodak-descriptor": ["sse"], "application/vnd.las.las+xml": ["lasxml"], "application/vnd.llamagraphics.life-balance.desktop": ["lbd"], "application/vnd.llamagraphics.life-balance.exchange+xml": ["lbe"], "application/vnd.lotus-1-2-3": ["123"], "application/vnd.lotus-approach": ["apr"], "application/vnd.lotus-freelance": ["pre"], "application/vnd.lotus-notes": ["nsf"], "application/vnd.lotus-organizer": ["org"], "application/vnd.lotus-screencam": ["scm"], "application/vnd.lotus-wordpro": ["lwp"], "application/vnd.macports.portpkg": ["portpkg"], "application/vnd.mapbox-vector-tile": ["mvt"], "application/vnd.mcd": ["mcd"], "application/vnd.medcalcdata": ["mc1"], "application/vnd.mediastation.cdkey": ["cdkey"], "application/vnd.mfer": ["mwf"], "application/vnd.mfmp": ["mfm"], "application/vnd.micrografx.flo": ["flo"], "application/vnd.micrografx.igx": ["igx"], "application/vnd.mif": ["mif"], "application/vnd.mobius.daf": ["daf"], "application/vnd.mobius.dis": ["dis"], "application/vnd.mobius.mbk": ["mbk"], "application/vnd.mobius.mqy": ["mqy"], "application/vnd.mobius.msl": ["msl"], "application/vnd.mobius.plc": ["plc"], "application/vnd.mobius.txf": ["txf"], "application/vnd.mophun.application": ["mpn"], "application/vnd.mophun.certificate": ["mpc"], "application/vnd.mozilla.xul+xml": ["xul"], "application/vnd.ms-artgalry": ["cil"], "application/vnd.ms-cab-compressed": ["cab"], "application/vnd.ms-excel": ["xls", "xlm", "xla", "xlc", "xlt", "xlw"], "application/vnd.ms-excel.addin.macroenabled.12": ["xlam"], "application/vnd.ms-excel.sheet.binary.macroenabled.12": ["xlsb"], "application/vnd.ms-excel.sheet.macroenabled.12": ["xlsm"], "application/vnd.ms-excel.template.macroenabled.12": ["xltm"], "application/vnd.ms-fontobject": ["eot"], "application/vnd.ms-htmlhelp": ["chm"], "application/vnd.ms-ims": ["ims"], "application/vnd.ms-lrm": ["lrm"], "application/vnd.ms-officetheme": ["thmx"], "application/vnd.ms-outlook": ["msg"], "application/vnd.ms-pki.seccat": ["cat"], "application/vnd.ms-pki.stl": ["*stl"], "application/vnd.ms-powerpoint": ["ppt", "pps", "pot"], "application/vnd.ms-powerpoint.addin.macroenabled.12": ["ppam"], "application/vnd.ms-powerpoint.presentation.macroenabled.12": ["pptm"], "application/vnd.ms-powerpoint.slide.macroenabled.12": ["sldm"], "application/vnd.ms-powerpoint.slideshow.macroenabled.12": ["ppsm"], "application/vnd.ms-powerpoint.template.macroenabled.12": ["potm"], "application/vnd.ms-project": ["mpp", "mpt"], "application/vnd.ms-word.document.macroenabled.12": ["docm"], "application/vnd.ms-word.template.macroenabled.12": ["dotm"], "application/vnd.ms-works": ["wps", "wks", "wcm", "wdb"], "application/vnd.ms-wpl": ["wpl"], "application/vnd.ms-xpsdocument": ["xps"], "application/vnd.mseq": ["mseq"], "application/vnd.musician": ["mus"], "application/vnd.muvee.style": ["msty"], "application/vnd.mynfc": ["taglet"], "application/vnd.neurolanguage.nlu": ["nlu"], "application/vnd.nitf": ["ntf", "nitf"], "application/vnd.noblenet-directory": ["nnd"], "application/vnd.noblenet-sealer": ["nns"], "application/vnd.noblenet-web": ["nnw"], "application/vnd.nokia.n-gage.ac+xml": ["*ac"], "application/vnd.nokia.n-gage.data": ["ngdat"], "application/vnd.nokia.n-gage.symbian.install": ["n-gage"], "application/vnd.nokia.radio-preset": ["rpst"], "application/vnd.nokia.radio-presets": ["rpss"], "application/vnd.novadigm.edm": ["edm"], "application/vnd.novadigm.edx": ["edx"], "application/vnd.novadigm.ext": ["ext"], "application/vnd.oasis.opendocument.chart": ["odc"], "application/vnd.oasis.opendocument.chart-template": ["otc"], "application/vnd.oasis.opendocument.database": ["odb"], "application/vnd.oasis.opendocument.formula": ["odf"], "application/vnd.oasis.opendocument.formula-template": ["odft"], "application/vnd.oasis.opendocument.graphics": ["odg"], "application/vnd.oasis.opendocument.graphics-template": ["otg"], "application/vnd.oasis.opendocument.image": ["odi"], "application/vnd.oasis.opendocument.image-template": ["oti"], "application/vnd.oasis.opendocument.presentation": ["odp"], "application/vnd.oasis.opendocument.presentation-template": ["otp"], "application/vnd.oasis.opendocument.spreadsheet": ["ods"], "application/vnd.oasis.opendocument.spreadsheet-template": ["ots"], "application/vnd.oasis.opendocument.text": ["odt"], "application/vnd.oasis.opendocument.text-master": ["odm"], "application/vnd.oasis.opendocument.text-template": ["ott"], "application/vnd.oasis.opendocument.text-web": ["oth"], "application/vnd.olpc-sugar": ["xo"], "application/vnd.oma.dd2+xml": ["dd2"], "application/vnd.openblox.game+xml": ["obgx"], "application/vnd.openofficeorg.extension": ["oxt"], "application/vnd.openstreetmap.data+xml": ["osm"], "application/vnd.openxmlformats-officedocument.presentationml.presentation": ["pptx"], "application/vnd.openxmlformats-officedocument.presentationml.slide": ["sldx"], "application/vnd.openxmlformats-officedocument.presentationml.slideshow": ["ppsx"], "application/vnd.openxmlformats-officedocument.presentationml.template": ["potx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ["xlsx"], "application/vnd.openxmlformats-officedocument.spreadsheetml.template": ["xltx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ["docx"], "application/vnd.openxmlformats-officedocument.wordprocessingml.template": ["dotx"], "application/vnd.osgeo.mapguide.package": ["mgp"], "application/vnd.osgi.dp": ["dp"], "application/vnd.osgi.subsystem": ["esa"], "application/vnd.palm": ["pdb", "pqa", "oprc"], "application/vnd.pawaafile": ["paw"], "application/vnd.pg.format": ["str"], "application/vnd.pg.osasli": ["ei6"], "application/vnd.picsel": ["efif"], "application/vnd.pmi.widget": ["wg"], "application/vnd.pocketlearn": ["plf"], "application/vnd.powerbuilder6": ["pbd"], "application/vnd.previewsystems.box": ["box"], "application/vnd.proteus.magazine": ["mgz"], "application/vnd.publishare-delta-tree": ["qps"], "application/vnd.pvi.ptid1": ["ptid"], "application/vnd.quark.quarkxpress": ["qxd", "qxt", "qwd", "qwt", "qxl", "qxb"], "application/vnd.rar": ["rar"], "application/vnd.realvnc.bed": ["bed"], "application/vnd.recordare.musicxml": ["mxl"], "application/vnd.recordare.musicxml+xml": ["musicxml"], "application/vnd.rig.cryptonote": ["cryptonote"], "application/vnd.rim.cod": ["cod"], "application/vnd.rn-realmedia": ["rm"], "application/vnd.rn-realmedia-vbr": ["rmvb"], "application/vnd.route66.link66+xml": ["link66"], "application/vnd.sailingtracker.track": ["st"], "application/vnd.seemail": ["see"], "application/vnd.sema": ["sema"], "application/vnd.semd": ["semd"], "application/vnd.semf": ["semf"], "application/vnd.shana.informed.formdata": ["ifm"], "application/vnd.shana.informed.formtemplate": ["itp"], "application/vnd.shana.informed.interchange": ["iif"], "application/vnd.shana.informed.package": ["ipk"], "application/vnd.simtech-mindmapper": ["twd", "twds"], "application/vnd.smaf": ["mmf"], "application/vnd.smart.teacher": ["teacher"], "application/vnd.software602.filler.form+xml": ["fo"], "application/vnd.solent.sdkm+xml": ["sdkm", "sdkd"], "application/vnd.spotfire.dxp": ["dxp"], "application/vnd.spotfire.sfs": ["sfs"], "application/vnd.stardivision.calc": ["sdc"], "application/vnd.stardivision.draw": ["sda"], "application/vnd.stardivision.impress": ["sdd"], "application/vnd.stardivision.math": ["smf"], "application/vnd.stardivision.writer": ["sdw", "vor"], "application/vnd.stardivision.writer-global": ["sgl"], "application/vnd.stepmania.package": ["smzip"], "application/vnd.stepmania.stepchart": ["sm"], "application/vnd.sun.wadl+xml": ["wadl"], "application/vnd.sun.xml.calc": ["sxc"], "application/vnd.sun.xml.calc.template": ["stc"], "application/vnd.sun.xml.draw": ["sxd"], "application/vnd.sun.xml.draw.template": ["std"], "application/vnd.sun.xml.impress": ["sxi"], "application/vnd.sun.xml.impress.template": ["sti"], "application/vnd.sun.xml.math": ["sxm"], "application/vnd.sun.xml.writer": ["sxw"], "application/vnd.sun.xml.writer.global": ["sxg"], "application/vnd.sun.xml.writer.template": ["stw"], "application/vnd.sus-calendar": ["sus", "susp"], "application/vnd.svd": ["svd"], "application/vnd.symbian.install": ["sis", "sisx"], "application/vnd.syncml+xml": ["xsm"], "application/vnd.syncml.dm+wbxml": ["bdm"], "application/vnd.syncml.dm+xml": ["xdm"], "application/vnd.syncml.dmddf+xml": ["ddf"], "application/vnd.tao.intent-module-archive": ["tao"], "application/vnd.tcpdump.pcap": ["pcap", "cap", "dmp"], "application/vnd.tmobile-livetv": ["tmo"], "application/vnd.trid.tpt": ["tpt"], "application/vnd.triscape.mxs": ["mxs"], "application/vnd.trueapp": ["tra"], "application/vnd.ufdl": ["ufd", "ufdl"], "application/vnd.uiq.theme": ["utz"], "application/vnd.umajin": ["umj"], "application/vnd.unity": ["unityweb"], "application/vnd.uoml+xml": ["uoml"], "application/vnd.vcx": ["vcx"], "application/vnd.visio": ["vsd", "vst", "vss", "vsw"], "application/vnd.visionary": ["vis"], "application/vnd.vsf": ["vsf"], "application/vnd.wap.wbxml": ["wbxml"], "application/vnd.wap.wmlc": ["wmlc"], "application/vnd.wap.wmlscriptc": ["wmlsc"], "application/vnd.webturbo": ["wtb"], "application/vnd.wolfram.player": ["nbp"], "application/vnd.wordperfect": ["wpd"], "application/vnd.wqd": ["wqd"], "application/vnd.wt.stf": ["stf"], "application/vnd.xara": ["xar"], "application/vnd.xfdl": ["xfdl"], "application/vnd.yamaha.hv-dic": ["hvd"], "application/vnd.yamaha.hv-script": ["hvs"], "application/vnd.yamaha.hv-voice": ["hvp"], "application/vnd.yamaha.openscoreformat": ["osf"], "application/vnd.yamaha.openscoreformat.osfpvg+xml": ["osfpvg"], "application/vnd.yamaha.smaf-audio": ["saf"], "application/vnd.yamaha.smaf-phrase": ["spf"], "application/vnd.yellowriver-custom-menu": ["cmp"], "application/vnd.zul": ["zir", "zirz"], "application/vnd.zzazz.deck+xml": ["zaz"], "application/x-7z-compressed": ["7z"], "application/x-abiword": ["abw"], "application/x-ace-compressed": ["ace"], "application/x-apple-diskimage": ["*dmg"], "application/x-arj": ["arj"], "application/x-authorware-bin": ["aab", "x32", "u32", "vox"], "application/x-authorware-map": ["aam"], "application/x-authorware-seg": ["aas"], "application/x-bcpio": ["bcpio"], "application/x-bdoc": ["*bdoc"], "application/x-bittorrent": ["torrent"], "application/x-blorb": ["blb", "blorb"], "application/x-bzip": ["bz"], "application/x-bzip2": ["bz2", "boz"], "application/x-cbr": ["cbr", "cba", "cbt", "cbz", "cb7"], "application/x-cdlink": ["vcd"], "application/x-cfs-compressed": ["cfs"], "application/x-chat": ["chat"], "application/x-chess-pgn": ["pgn"], "application/x-chrome-extension": ["crx"], "application/x-cocoa": ["cco"], "application/x-conference": ["nsc"], "application/x-cpio": ["cpio"], "application/x-csh": ["csh"], "application/x-debian-package": ["*deb", "udeb"], "application/x-dgc-compressed": ["dgc"], "application/x-director": ["dir", "dcr", "dxr", "cst", "cct", "cxt", "w3d", "fgd", "swa"], "application/x-doom": ["wad"], "application/x-dtbncx+xml": ["ncx"], "application/x-dtbook+xml": ["dtb"], "application/x-dtbresource+xml": ["res"], "application/x-dvi": ["dvi"], "application/x-envoy": ["evy"], "application/x-eva": ["eva"], "application/x-font-bdf": ["bdf"], "application/x-font-ghostscript": ["gsf"], "application/x-font-linux-psf": ["psf"], "application/x-font-pcf": ["pcf"], "application/x-font-snf": ["snf"], "application/x-font-type1": ["pfa", "pfb", "pfm", "afm"], "application/x-freearc": ["arc"], "application/x-futuresplash": ["spl"], "application/x-gca-compressed": ["gca"], "application/x-glulx": ["ulx"], "application/x-gnumeric": ["gnumeric"], "application/x-gramps-xml": ["gramps"], "application/x-gtar": ["gtar"], "application/x-hdf": ["hdf"], "application/x-httpd-php": ["php"], "application/x-install-instructions": ["install"], "application/x-iso9660-image": ["*iso"], "application/x-iwork-keynote-sffkey": ["*key"], "application/x-iwork-numbers-sffnumbers": ["*numbers"], "application/x-iwork-pages-sffpages": ["*pages"], "application/x-java-archive-diff": ["jardiff"], "application/x-java-jnlp-file": ["jnlp"], "application/x-keepass2": ["kdbx"], "application/x-latex": ["latex"], "application/x-lua-bytecode": ["luac"], "application/x-lzh-compressed": ["lzh", "lha"], "application/x-makeself": ["run"], "application/x-mie": ["mie"], "application/x-mobipocket-ebook": ["prc", "mobi"], "application/x-ms-application": ["application"], "application/x-ms-shortcut": ["lnk"], "application/x-ms-wmd": ["wmd"], "application/x-ms-wmz": ["wmz"], "application/x-ms-xbap": ["xbap"], "application/x-msaccess": ["mdb"], "application/x-msbinder": ["obd"], "application/x-mscardfile": ["crd"], "application/x-msclip": ["clp"], "application/x-msdos-program": ["*exe"], "application/x-msdownload": ["*exe", "*dll", "com", "bat", "*msi"], "application/x-msmediaview": ["mvb", "m13", "m14"], "application/x-msmetafile": ["*wmf", "*wmz", "*emf", "emz"], "application/x-msmoney": ["mny"], "application/x-mspublisher": ["pub"], "application/x-msschedule": ["scd"], "application/x-msterminal": ["trm"], "application/x-mswrite": ["wri"], "application/x-netcdf": ["nc", "cdf"], "application/x-ns-proxy-autoconfig": ["pac"], "application/x-nzb": ["nzb"], "application/x-perl": ["pl", "pm"], "application/x-pilot": ["*prc", "*pdb"], "application/x-pkcs12": ["p12", "pfx"], "application/x-pkcs7-certificates": ["p7b", "spc"], "application/x-pkcs7-certreqresp": ["p7r"], "application/x-rar-compressed": ["*rar"], "application/x-redhat-package-manager": ["rpm"], "application/x-research-info-systems": ["ris"], "application/x-sea": ["sea"], "application/x-sh": ["sh"], "application/x-shar": ["shar"], "application/x-shockwave-flash": ["swf"], "application/x-silverlight-app": ["xap"], "application/x-sql": ["sql"], "application/x-stuffit": ["sit"], "application/x-stuffitx": ["sitx"], "application/x-subrip": ["srt"], "application/x-sv4cpio": ["sv4cpio"], "application/x-sv4crc": ["sv4crc"], "application/x-t3vm-image": ["t3"], "application/x-tads": ["gam"], "application/x-tar": ["tar"], "application/x-tcl": ["tcl", "tk"], "application/x-tex": ["tex"], "application/x-tex-tfm": ["tfm"], "application/x-texinfo": ["texinfo", "texi"], "application/x-tgif": ["*obj"], "application/x-ustar": ["ustar"], "application/x-virtualbox-hdd": ["hdd"], "application/x-virtualbox-ova": ["ova"], "application/x-virtualbox-ovf": ["ovf"], "application/x-virtualbox-vbox": ["vbox"], "application/x-virtualbox-vbox-extpack": ["vbox-extpack"], "application/x-virtualbox-vdi": ["vdi"], "application/x-virtualbox-vhd": ["vhd"], "application/x-virtualbox-vmdk": ["vmdk"], "application/x-wais-source": ["src"], "application/x-web-app-manifest+json": ["webapp"], "application/x-x509-ca-cert": ["der", "crt", "pem"], "application/x-xfig": ["fig"], "application/x-xliff+xml": ["*xlf"], "application/x-xpinstall": ["xpi"], "application/x-xz": ["xz"], "application/x-zmachine": ["z1", "z2", "z3", "z4", "z5", "z6", "z7", "z8"], "audio/vnd.dece.audio": ["uva", "uvva"], "audio/vnd.digital-winds": ["eol"], "audio/vnd.dra": ["dra"], "audio/vnd.dts": ["dts"], "audio/vnd.dts.hd": ["dtshd"], "audio/vnd.lucent.voice": ["lvp"], "audio/vnd.ms-playready.media.pya": ["pya"], "audio/vnd.nuera.ecelp4800": ["ecelp4800"], "audio/vnd.nuera.ecelp7470": ["ecelp7470"], "audio/vnd.nuera.ecelp9600": ["ecelp9600"], "audio/vnd.rip": ["rip"], "audio/x-aac": ["aac"], "audio/x-aiff": ["aif", "aiff", "aifc"], "audio/x-caf": ["caf"], "audio/x-flac": ["flac"], "audio/x-m4a": ["*m4a"], "audio/x-matroska": ["mka"], "audio/x-mpegurl": ["m3u"], "audio/x-ms-wax": ["wax"], "audio/x-ms-wma": ["wma"], "audio/x-pn-realaudio": ["ram", "ra"], "audio/x-pn-realaudio-plugin": ["rmp"], "audio/x-realaudio": ["*ra"], "audio/x-wav": ["*wav"], "chemical/x-cdx": ["cdx"], "chemical/x-cif": ["cif"], "chemical/x-cmdf": ["cmdf"], "chemical/x-cml": ["cml"], "chemical/x-csml": ["csml"], "chemical/x-xyz": ["xyz"], "image/prs.btif": ["btif"], "image/prs.pti": ["pti"], "image/vnd.adobe.photoshop": ["psd"], "image/vnd.airzip.accelerator.azv": ["azv"], "image/vnd.dece.graphic": ["uvi", "uvvi", "uvg", "uvvg"], "image/vnd.djvu": ["djvu", "djv"], "image/vnd.dvb.subtitle": ["*sub"], "image/vnd.dwg": ["dwg"], "image/vnd.dxf": ["dxf"], "image/vnd.fastbidsheet": ["fbs"], "image/vnd.fpx": ["fpx"], "image/vnd.fst": ["fst"], "image/vnd.fujixerox.edmics-mmr": ["mmr"], "image/vnd.fujixerox.edmics-rlc": ["rlc"], "image/vnd.microsoft.icon": ["ico"], "image/vnd.ms-dds": ["dds"], "image/vnd.ms-modi": ["mdi"], "image/vnd.ms-photo": ["wdp"], "image/vnd.net-fpx": ["npx"], "image/vnd.pco.b16": ["b16"], "image/vnd.tencent.tap": ["tap"], "image/vnd.valve.source.texture": ["vtf"], "image/vnd.wap.wbmp": ["wbmp"], "image/vnd.xiff": ["xif"], "image/vnd.zbrush.pcx": ["pcx"], "image/x-3ds": ["3ds"], "image/x-cmu-raster": ["ras"], "image/x-cmx": ["cmx"], "image/x-freehand": ["fh", "fhc", "fh4", "fh5", "fh7"], "image/x-icon": ["*ico"], "image/x-jng": ["jng"], "image/x-mrsid-image": ["sid"], "image/x-ms-bmp": ["*bmp"], "image/x-pcx": ["*pcx"], "image/x-pict": ["pic", "pct"], "image/x-portable-anymap": ["pnm"], "image/x-portable-bitmap": ["pbm"], "image/x-portable-graymap": ["pgm"], "image/x-portable-pixmap": ["ppm"], "image/x-rgb": ["rgb"], "image/x-tga": ["tga"], "image/x-xbitmap": ["xbm"], "image/x-xpixmap": ["xpm"], "image/x-xwindowdump": ["xwd"], "message/vnd.wfa.wsc": ["wsc"], "model/vnd.collada+xml": ["dae"], "model/vnd.dwf": ["dwf"], "model/vnd.gdl": ["gdl"], "model/vnd.gtw": ["gtw"], "model/vnd.mts": ["mts"], "model/vnd.opengex": ["ogex"], "model/vnd.parasolid.transmit.binary": ["x_b"], "model/vnd.parasolid.transmit.text": ["x_t"], "model/vnd.sap.vds": ["vds"], "model/vnd.usdz+zip": ["usdz"], "model/vnd.valve.source.compiled-map": ["bsp"], "model/vnd.vtu": ["vtu"], "text/prs.lines.tag": ["dsc"], "text/vnd.curl": ["curl"], "text/vnd.curl.dcurl": ["dcurl"], "text/vnd.curl.mcurl": ["mcurl"], "text/vnd.curl.scurl": ["scurl"], "text/vnd.dvb.subtitle": ["sub"], "text/vnd.fly": ["fly"], "text/vnd.fmi.flexstor": ["flx"], "text/vnd.graphviz": ["gv"], "text/vnd.in3d.3dml": ["3dml"], "text/vnd.in3d.spot": ["spot"], "text/vnd.sun.j2me.app-descriptor": ["jad"], "text/vnd.wap.wml": ["wml"], "text/vnd.wap.wmlscript": ["wmls"], "text/x-asm": ["s", "asm"], "text/x-c": ["c", "cc", "cxx", "cpp", "h", "hh", "dic"], "text/x-component": ["htc"], "text/x-fortran": ["f", "for", "f77", "f90"], "text/x-handlebars-template": ["hbs"], "text/x-java-source": ["java"], "text/x-lua": ["lua"], "text/x-markdown": ["mkd"], "text/x-nfo": ["nfo"], "text/x-opml": ["opml"], "text/x-org": ["*org"], "text/x-pascal": ["p", "pas"], "text/x-processing": ["pde"], "text/x-sass": ["sass"], "text/x-scss": ["scss"], "text/x-setext": ["etx"], "text/x-sfv": ["sfv"], "text/x-suse-ymp": ["ymp"], "text/x-uuencode": ["uu"], "text/x-vcalendar": ["vcs"], "text/x-vcard": ["vcf"], "video/vnd.dece.hd": ["uvh", "uvvh"], "video/vnd.dece.mobile": ["uvm", "uvvm"], "video/vnd.dece.pd": ["uvp", "uvvp"], "video/vnd.dece.sd": ["uvs", "uvvs"], "video/vnd.dece.video": ["uvv", "uvvv"], "video/vnd.dvb.file": ["dvb"], "video/vnd.fvt": ["fvt"], "video/vnd.mpegurl": ["mxu", "m4u"], "video/vnd.ms-playready.media.pyv": ["pyv"], "video/vnd.uvvu.mp4": ["uvu", "uvvu"], "video/vnd.vivo": ["viv"], "video/x-f4v": ["f4v"], "video/x-fli": ["fli"], "video/x-flv": ["flv"], "video/x-m4v": ["m4v"], "video/x-matroska": ["mkv", "mk3d", "mks"], "video/x-mng": ["mng"], "video/x-ms-asf": ["asf", "asx"], "video/x-ms-vob": ["vob"], "video/x-ms-wm": ["wm"], "video/x-ms-wmv": ["wmv"], "video/x-ms-wmx": ["wmx"], "video/x-ms-wvx": ["wvx"], "video/x-msvideo": ["avi"], "video/x-sgi-movie": ["movie"], "video/x-smv": ["smv"], "x-conference/x-cooltalk": ["ice"] };
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/mime/index.js
  var require_mime = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/mime/index.js"(exports, module) {
      "use strict";
      var Mime = require_Mime();
      module.exports = new Mime(require_standard(), require_other());
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/@cloudflare/kv-asset-handler/dist/types.js
  var require_types = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/@cloudflare/kv-asset-handler/dist/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InternalError = exports.NotFoundError = exports.MethodNotAllowedError = exports.KVError = void 0;
      var KVError = class extends Error {
        constructor(message, status = 500) {
          super(message);
          Object.setPrototypeOf(this, new.target.prototype);
          this.name = KVError.name;
          this.status = status;
        }
      };
      exports.KVError = KVError;
      var MethodNotAllowedError = class extends KVError {
        constructor(message = `Not a valid request method`, status = 405) {
          super(message, status);
        }
      };
      exports.MethodNotAllowedError = MethodNotAllowedError;
      var NotFoundError = class extends KVError {
        constructor(message = `Not Found`, status = 404) {
          super(message, status);
        }
      };
      exports.NotFoundError = NotFoundError;
      var InternalError = class extends KVError {
        constructor(message = `Internal Error in KV Asset Handler`, status = 500) {
          super(message, status);
        }
      };
      exports.InternalError = InternalError;
    }
  });

  // .svelte-kit/cloudflare-workers-tmp/node_modules/@cloudflare/kv-asset-handler/dist/index.js
  var require_dist = __commonJS({
    ".svelte-kit/cloudflare-workers-tmp/node_modules/@cloudflare/kv-asset-handler/dist/index.js"(exports) {
      "use strict";
      var __awaiter10 = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
        function adopt(value) {
          return value instanceof P ? value : new P(function(resolve2) {
            resolve2(value);
          });
        }
        return new (P || (P = Promise))(function(resolve2, reject) {
          function fulfilled(value) {
            try {
              step(generator.next(value));
            } catch (e) {
              reject(e);
            }
          }
          function rejected(value) {
            try {
              step(generator["throw"](value));
            } catch (e) {
              reject(e);
            }
          }
          function step(result) {
            result.done ? resolve2(result.value) : adopt(result.value).then(fulfilled, rejected);
          }
          step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.InternalError = exports.NotFoundError = exports.MethodNotAllowedError = exports.serveSinglePageApp = exports.mapRequestToAsset = exports.getAssetFromKV = void 0;
      var mime = require_mime();
      var types_1 = require_types();
      Object.defineProperty(exports, "MethodNotAllowedError", { enumerable: true, get: function() {
        return types_1.MethodNotAllowedError;
      } });
      Object.defineProperty(exports, "NotFoundError", { enumerable: true, get: function() {
        return types_1.NotFoundError;
      } });
      Object.defineProperty(exports, "InternalError", { enumerable: true, get: function() {
        return types_1.InternalError;
      } });
      var defaultCacheControl = {
        browserTTL: null,
        edgeTTL: 2 * 60 * 60 * 24,
        bypassCache: false
      };
      var parseStringAsObject = (maybeString) => typeof maybeString === "string" ? JSON.parse(maybeString) : maybeString;
      var getAssetFromKVDefaultOptions = {
        ASSET_NAMESPACE: typeof __STATIC_CONTENT !== "undefined" ? __STATIC_CONTENT : void 0,
        ASSET_MANIFEST: typeof __STATIC_CONTENT_MANIFEST !== "undefined" ? parseStringAsObject(__STATIC_CONTENT_MANIFEST) : void 0,
        cacheControl: defaultCacheControl,
        defaultMimeType: "text/plain",
        defaultDocument: "index.html"
      };
      function assignOptions(options) {
        return Object.assign({}, getAssetFromKVDefaultOptions, options);
      }
      var mapRequestToAsset = (request, options) => {
        options = assignOptions(options);
        const parsedUrl = new URL(request.url);
        let pathname = parsedUrl.pathname;
        if (pathname.endsWith("/")) {
          pathname = pathname.concat(options.defaultDocument);
        } else if (!mime.getType(pathname)) {
          pathname = pathname.concat("/" + options.defaultDocument);
        }
        parsedUrl.pathname = pathname;
        return new Request(parsedUrl.toString(), request);
      };
      exports.mapRequestToAsset = mapRequestToAsset;
      function serveSinglePageApp(request, options) {
        options = assignOptions(options);
        request = mapRequestToAsset(request, options);
        const parsedUrl = new URL(request.url);
        if (parsedUrl.pathname.endsWith(".html")) {
          return new Request(`${parsedUrl.origin}/${options.defaultDocument}`, request);
        } else {
          return request;
        }
      }
      exports.serveSinglePageApp = serveSinglePageApp;
      var getAssetFromKV2 = (event, options) => __awaiter10(void 0, void 0, void 0, function* () {
        options = assignOptions(options);
        const request = event.request;
        const ASSET_NAMESPACE = options.ASSET_NAMESPACE;
        const ASSET_MANIFEST = parseStringAsObject(options.ASSET_MANIFEST);
        if (typeof ASSET_NAMESPACE === "undefined") {
          throw new types_1.InternalError(`there is no KV namespace bound to the script`);
        }
        const rawPathKey = new URL(request.url).pathname.replace(/^\/+/, "");
        let pathIsEncoded = false;
        let requestKey;
        if (options.mapRequestToAsset) {
          requestKey = options.mapRequestToAsset(request);
        } else if (ASSET_MANIFEST[rawPathKey]) {
          requestKey = request;
        } else if (ASSET_MANIFEST[decodeURIComponent(rawPathKey)]) {
          pathIsEncoded = true;
          requestKey = request;
        } else {
          const mappedRequest = mapRequestToAsset(request);
          const mappedRawPathKey = new URL(mappedRequest.url).pathname.replace(/^\/+/, "");
          if (ASSET_MANIFEST[decodeURIComponent(mappedRawPathKey)]) {
            pathIsEncoded = true;
            requestKey = mappedRequest;
          } else {
            requestKey = mapRequestToAsset(request, options);
          }
        }
        const SUPPORTED_METHODS = ["GET", "HEAD"];
        if (!SUPPORTED_METHODS.includes(requestKey.method)) {
          throw new types_1.MethodNotAllowedError(`${requestKey.method} is not a valid request method`);
        }
        const parsedUrl = new URL(requestKey.url);
        const pathname = pathIsEncoded ? decodeURIComponent(parsedUrl.pathname) : parsedUrl.pathname;
        let pathKey = pathname.replace(/^\/+/, "");
        const cache = caches.default;
        let mimeType = mime.getType(pathKey) || options.defaultMimeType;
        if (mimeType.startsWith("text") || mimeType === "application/javascript") {
          mimeType += "; charset=utf-8";
        }
        let shouldEdgeCache = false;
        if (typeof ASSET_MANIFEST !== "undefined") {
          if (ASSET_MANIFEST[pathKey]) {
            pathKey = ASSET_MANIFEST[pathKey];
            shouldEdgeCache = true;
          }
        }
        let cacheKey = new Request(`${parsedUrl.origin}/${pathKey}`, request);
        const evalCacheOpts = (() => {
          switch (typeof options.cacheControl) {
            case "function":
              return options.cacheControl(request);
            case "object":
              return options.cacheControl;
            default:
              return defaultCacheControl;
          }
        })();
        const formatETag = (entityId = pathKey, validatorType = "strong") => {
          if (!entityId) {
            return "";
          }
          switch (validatorType) {
            case "weak":
              if (!entityId.startsWith("W/")) {
                return `W/${entityId}`;
              }
              return entityId;
            case "strong":
              if (entityId.startsWith(`W/"`)) {
                entityId = entityId.replace("W/", "");
              }
              if (!entityId.endsWith(`"`)) {
                entityId = `"${entityId}"`;
              }
              return entityId;
            default:
              return "";
          }
        };
        options.cacheControl = Object.assign({}, defaultCacheControl, evalCacheOpts);
        if (options.cacheControl.bypassCache || options.cacheControl.edgeTTL === null || request.method == "HEAD") {
          shouldEdgeCache = false;
        }
        const shouldSetBrowserCache = typeof options.cacheControl.browserTTL === "number";
        let response = null;
        if (shouldEdgeCache) {
          response = yield cache.match(cacheKey);
        }
        if (response) {
          if (response.status > 300 && response.status < 400) {
            if (response.body && "cancel" in Object.getPrototypeOf(response.body)) {
              response.body.cancel();
              console.log("Body exists and environment supports readable streams. Body cancelled");
            } else {
              console.log("Environment doesnt support readable streams");
            }
            response = new Response(null, response);
          } else {
            let opts = {
              headers: new Headers(response.headers),
              status: 0,
              statusText: ""
            };
            opts.headers.set("cf-cache-status", "HIT");
            if (response.status) {
              opts.status = response.status;
              opts.statusText = response.statusText;
            } else if (opts.headers.has("Content-Range")) {
              opts.status = 206;
              opts.statusText = "Partial Content";
            } else {
              opts.status = 200;
              opts.statusText = "OK";
            }
            response = new Response(response.body, opts);
          }
        } else {
          const body = yield ASSET_NAMESPACE.get(pathKey, "arrayBuffer");
          if (body === null) {
            throw new types_1.NotFoundError(`could not find ${pathKey} in your content namespace`);
          }
          response = new Response(body);
          if (shouldEdgeCache) {
            response.headers.set("Accept-Ranges", "bytes");
            response.headers.set("Content-Length", body.length);
            if (!response.headers.has("etag")) {
              response.headers.set("etag", formatETag(pathKey, "strong"));
            }
            response.headers.set("Cache-Control", `max-age=${options.cacheControl.edgeTTL}`);
            event.waitUntil(cache.put(cacheKey, response.clone()));
            response.headers.set("CF-Cache-Status", "MISS");
          }
        }
        response.headers.set("Content-Type", mimeType);
        if (response.status === 304) {
          let etag = formatETag(response.headers.get("etag"), "strong");
          let ifNoneMatch = cacheKey.headers.get("if-none-match");
          let proxyCacheStatus = response.headers.get("CF-Cache-Status");
          if (etag) {
            if (ifNoneMatch && ifNoneMatch === etag && proxyCacheStatus === "MISS") {
              response.headers.set("CF-Cache-Status", "EXPIRED");
            } else {
              response.headers.set("CF-Cache-Status", "REVALIDATED");
            }
            response.headers.set("etag", formatETag(etag, "weak"));
          }
        }
        if (shouldSetBrowserCache) {
          response.headers.set("Cache-Control", `max-age=${options.cacheControl.browserTTL}`);
        } else {
          response.headers.delete("Cache-Control");
        }
        return response;
      });
      exports.getAssetFromKV = getAssetFromKV2;
    }
  });

  // .svelte-kit/output/server/app.js
  init_index_1788aa30();
  function afterUpdate() {
  }
  var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
    let { stores } = $$props;
    let { page } = $$props;
    let { components } = $$props;
    let { props_0 = null } = $$props;
    let { props_1 = null } = $$props;
    let { props_2 = null } = $$props;
    setContext("__svelte__", stores);
    afterUpdate(stores.page.notify);
    if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
      $$bindings.stores(stores);
    if ($$props.page === void 0 && $$bindings.page && page !== void 0)
      $$bindings.page(page);
    if ($$props.components === void 0 && $$bindings.components && components !== void 0)
      $$bindings.components(components);
    if ($$props.props_0 === void 0 && $$bindings.props_0 && props_0 !== void 0)
      $$bindings.props_0(props_0);
    if ($$props.props_1 === void 0 && $$bindings.props_1 && props_1 !== void 0)
      $$bindings.props_1(props_1);
    if ($$props.props_2 === void 0 && $$bindings.props_2 && props_2 !== void 0)
      $$bindings.props_2(props_2);
    {
      stores.page.set(page);
    }
    return `


${components[1] ? `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {
      default: () => {
        return `${components[2] ? `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {
          default: () => {
            return `${validate_component(components[2] || missing_component, "svelte:component").$$render($$result, Object.assign(props_2 || {}), {}, {})}`;
          }
        })}` : `${validate_component(components[1] || missing_component, "svelte:component").$$render($$result, Object.assign(props_1 || {}), {}, {})}`}`;
      }
    })}` : `${validate_component(components[0] || missing_component, "svelte:component").$$render($$result, Object.assign(props_0 || {}), {}, {})}`}

${``}`;
  });
  function to_headers(object) {
    const headers = new Headers();
    if (object) {
      for (const key in object) {
        const value = object[key];
        if (!value)
          continue;
        if (typeof value === "string") {
          headers.set(key, value);
        } else {
          value.forEach((value2) => {
            headers.append(key, value2);
          });
        }
      }
    }
    return headers;
  }
  function hash(value) {
    let hash2 = 5381;
    let i = value.length;
    if (typeof value === "string") {
      while (i)
        hash2 = hash2 * 33 ^ value.charCodeAt(--i);
    } else {
      while (i)
        hash2 = hash2 * 33 ^ value[--i];
    }
    return (hash2 >>> 0).toString(36);
  }
  function decode_params(params) {
    for (const key in params) {
      params[key] = params[key].replace(/%23/g, "#").replace(/%3[Bb]/g, ";").replace(/%2[Cc]/g, ",").replace(/%2[Ff]/g, "/").replace(/%3[Ff]/g, "?").replace(/%3[Aa]/g, ":").replace(/%40/g, "@").replace(/%26/g, "&").replace(/%3[Dd]/g, "=").replace(/%2[Bb]/g, "+").replace(/%24/g, "$");
    }
    return params;
  }
  function error(body) {
    return new Response(body, {
      status: 500
    });
  }
  function is_string(s2) {
    return typeof s2 === "string" || s2 instanceof String;
  }
  var text_types = new Set([
    "application/xml",
    "application/json",
    "application/x-www-form-urlencoded",
    "multipart/form-data"
  ]);
  function is_text(content_type) {
    if (!content_type)
      return true;
    const type = content_type.split(";")[0].toLowerCase();
    return type.startsWith("text/") || type.endsWith("+xml") || text_types.has(type);
  }
  async function render_endpoint(event, route, match) {
    const mod = await route.load();
    const handler = mod[event.request.method.toLowerCase().replace("delete", "del")];
    if (!handler) {
      return;
    }
    event.params = route.params ? decode_params(route.params(match)) : {};
    const response = await handler(event);
    const preface = `Invalid response from route ${event.url.pathname}`;
    if (typeof response !== "object") {
      return error(`${preface}: expected an object, got ${typeof response}`);
    }
    if (response.fallthrough) {
      return;
    }
    const { status = 200, body = {} } = response;
    const headers = response.headers instanceof Headers ? response.headers : to_headers(response.headers);
    const type = headers.get("content-type");
    if (!is_text(type) && !(body instanceof Uint8Array || is_string(body))) {
      return error(`${preface}: body must be an instance of string or Uint8Array if content-type is not a supported textual content-type`);
    }
    let normalized_body;
    if (is_pojo(body) && (!type || type.startsWith("application/json"))) {
      headers.set("content-type", "application/json; charset=utf-8");
      normalized_body = JSON.stringify(body);
    } else {
      normalized_body = body;
    }
    if ((typeof normalized_body === "string" || normalized_body instanceof Uint8Array) && !headers.has("etag")) {
      const cache_control = headers.get("cache-control");
      if (!cache_control || !/(no-store|immutable)/.test(cache_control)) {
        headers.set("etag", `"${hash(normalized_body)}"`);
      }
    }
    return new Response(normalized_body, {
      status,
      headers
    });
  }
  function is_pojo(body) {
    if (typeof body !== "object")
      return false;
    if (body) {
      if (body instanceof Uint8Array)
        return false;
      if (body._readableState && body._writableState && body._events)
        return false;
      if (body[Symbol.toStringTag] === "ReadableStream")
        return false;
    }
    return true;
  }
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
  var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
  var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
  var escaped2 = {
    "<": "\\u003C",
    ">": "\\u003E",
    "/": "\\u002F",
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t",
    "\0": "\\0",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
  function devalue(value) {
    var counts = new Map();
    function walk(thing) {
      if (typeof thing === "function") {
        throw new Error("Cannot stringify a function");
      }
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (!isPrimitive(thing)) {
        var type = getType(thing);
        switch (type) {
          case "Number":
          case "String":
          case "Boolean":
          case "Date":
          case "RegExp":
            return;
          case "Array":
            thing.forEach(walk);
            break;
          case "Set":
          case "Map":
            Array.from(thing).forEach(walk);
            break;
          default:
            var proto = Object.getPrototypeOf(thing);
            if (proto !== Object.prototype && proto !== null && Object.getOwnPropertyNames(proto).sort().join("\0") !== objectProtoOwnPropertyNames) {
              throw new Error("Cannot stringify arbitrary non-POJOs");
            }
            if (Object.getOwnPropertySymbols(thing).length > 0) {
              throw new Error("Cannot stringify POJOs with symbolic keys");
            }
            Object.keys(thing).forEach(function(key) {
              return walk(thing[key]);
            });
        }
      }
    }
    walk(value);
    var names = new Map();
    Array.from(counts).filter(function(entry9) {
      return entry9[1] > 1;
    }).sort(function(a, b) {
      return b[1] - a[1];
    }).forEach(function(entry9, i) {
      names.set(entry9[0], getName(i));
    });
    function stringify(thing) {
      if (names.has(thing)) {
        return names.get(thing);
      }
      if (isPrimitive(thing)) {
        return stringifyPrimitive(thing);
      }
      var type = getType(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          return "Object(" + stringify(thing.valueOf()) + ")";
        case "RegExp":
          return "new RegExp(" + stringifyString(thing.source) + ', "' + thing.flags + '")';
        case "Date":
          return "new Date(" + thing.getTime() + ")";
        case "Array":
          var members = thing.map(function(v, i) {
            return i in thing ? stringify(v) : "";
          });
          var tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
          return "[" + members.join(",") + tail + "]";
        case "Set":
        case "Map":
          return "new " + type + "([" + Array.from(thing).map(stringify).join(",") + "])";
        default:
          var obj = "{" + Object.keys(thing).map(function(key) {
            return safeKey(key) + ":" + stringify(thing[key]);
          }).join(",") + "}";
          var proto = Object.getPrototypeOf(thing);
          if (proto === null) {
            return Object.keys(thing).length > 0 ? "Object.assign(Object.create(null)," + obj + ")" : "Object.create(null)";
          }
          return obj;
      }
    }
    var str = stringify(value);
    if (names.size) {
      var params_1 = [];
      var statements_1 = [];
      var values_1 = [];
      names.forEach(function(name, thing) {
        params_1.push(name);
        if (isPrimitive(thing)) {
          values_1.push(stringifyPrimitive(thing));
          return;
        }
        var type = getType(thing);
        switch (type) {
          case "Number":
          case "String":
          case "Boolean":
            values_1.push("Object(" + stringify(thing.valueOf()) + ")");
            break;
          case "RegExp":
            values_1.push(thing.toString());
            break;
          case "Date":
            values_1.push("new Date(" + thing.getTime() + ")");
            break;
          case "Array":
            values_1.push("Array(" + thing.length + ")");
            thing.forEach(function(v, i) {
              statements_1.push(name + "[" + i + "]=" + stringify(v));
            });
            break;
          case "Set":
            values_1.push("new Set");
            statements_1.push(name + "." + Array.from(thing).map(function(v) {
              return "add(" + stringify(v) + ")";
            }).join("."));
            break;
          case "Map":
            values_1.push("new Map");
            statements_1.push(name + "." + Array.from(thing).map(function(_a) {
              var k = _a[0], v = _a[1];
              return "set(" + stringify(k) + ", " + stringify(v) + ")";
            }).join("."));
            break;
          default:
            values_1.push(Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}");
            Object.keys(thing).forEach(function(key) {
              statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
            });
        }
      });
      statements_1.push("return " + str);
      return "(function(" + params_1.join(",") + "){" + statements_1.join(";") + "}(" + values_1.join(",") + "))";
    } else {
      return str;
    }
  }
  function getName(num) {
    var name = "";
    do {
      name = chars[num % chars.length] + name;
      num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "_" : name;
  }
  function isPrimitive(thing) {
    return Object(thing) !== thing;
  }
  function stringifyPrimitive(thing) {
    if (typeof thing === "string")
      return stringifyString(thing);
    if (thing === void 0)
      return "void 0";
    if (thing === 0 && 1 / thing < 0)
      return "-0";
    var str = String(thing);
    if (typeof thing === "number")
      return str.replace(/^(-)?0\./, "$1.");
    return str;
  }
  function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
  }
  function escapeUnsafeChar(c) {
    return escaped2[c] || c;
  }
  function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
  }
  function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify(key));
  }
  function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
  }
  function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
      var char = str.charAt(i);
      var code = char.charCodeAt(0);
      if (char === '"') {
        result += '\\"';
      } else if (char in escaped2) {
        result += escaped2[char];
      } else if (code >= 55296 && code <= 57343) {
        var next = str.charCodeAt(i + 1);
        if (code <= 56319 && (next >= 56320 && next <= 57343)) {
          result += char + str[++i];
        } else {
          result += "\\u" + code.toString(16).toUpperCase();
        }
      } else {
        result += char;
      }
    }
    result += '"';
    return result;
  }
  function noop2() {
  }
  function safe_not_equal2(a, b) {
    return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
  }
  Promise.resolve();
  var subscriber_queue = [];
  function writable(value, start = noop2) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
      if (safe_not_equal2(value, new_value)) {
        value = new_value;
        if (stop) {
          const run_queue = !subscriber_queue.length;
          for (const subscriber of subscribers) {
            subscriber[1]();
            subscriber_queue.push(subscriber, value);
          }
          if (run_queue) {
            for (let i = 0; i < subscriber_queue.length; i += 2) {
              subscriber_queue[i][0](subscriber_queue[i + 1]);
            }
            subscriber_queue.length = 0;
          }
        }
      }
    }
    function update(fn) {
      set(fn(value));
    }
    function subscribe2(run2, invalidate = noop2) {
      const subscriber = [run2, invalidate];
      subscribers.add(subscriber);
      if (subscribers.size === 1) {
        stop = start(set) || noop2;
      }
      run2(value);
      return () => {
        subscribers.delete(subscriber);
        if (subscribers.size === 0) {
          stop();
          stop = null;
        }
      };
    }
    return { set, update, subscribe: subscribe2 };
  }
  function coalesce_to_error(err) {
    return err instanceof Error || err && err.name && err.message ? err : new Error(JSON.stringify(err));
  }
  var escape_json_string_in_html_dict = {
    '"': '\\"',
    "<": "\\u003C",
    ">": "\\u003E",
    "/": "\\u002F",
    "\\": "\\\\",
    "\b": "\\b",
    "\f": "\\f",
    "\n": "\\n",
    "\r": "\\r",
    "	": "\\t",
    "\0": "\\0",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029"
  };
  function escape_json_string_in_html(str) {
    return escape2(str, escape_json_string_in_html_dict, (code) => `\\u${code.toString(16).toUpperCase()}`);
  }
  var escape_html_attr_dict = {
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  };
  function escape_html_attr(str) {
    return '"' + escape2(str, escape_html_attr_dict, (code) => `&#${code};`) + '"';
  }
  function escape2(str, dict, unicode_encoder) {
    let result = "";
    for (let i = 0; i < str.length; i += 1) {
      const char = str.charAt(i);
      const code = char.charCodeAt(0);
      if (char in dict) {
        result += dict[char];
      } else if (code >= 55296 && code <= 57343) {
        const next = str.charCodeAt(i + 1);
        if (code <= 56319 && next >= 56320 && next <= 57343) {
          result += char + str[++i];
        } else {
          result += unicode_encoder(code);
        }
      } else {
        result += char;
      }
    }
    return result;
  }
  var s = JSON.stringify;
  function create_prerendering_url_proxy(url) {
    return new Proxy(url, {
      get: (target, prop, receiver) => {
        if (prop === "search" || prop === "searchParams") {
          throw new Error(`Cannot access url.${prop} on a page with prerendering enabled`);
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }
  async function render_response({
    branch,
    options,
    state,
    $session,
    page_config,
    status,
    error: error2,
    url,
    params,
    ssr,
    stuff
  }) {
    const css10 = new Set(options.manifest._.entry.css);
    const js9 = new Set(options.manifest._.entry.js);
    const styles = new Map();
    const serialized_data = [];
    let rendered;
    let is_private = false;
    let maxage;
    if (error2) {
      error2.stack = options.get_stack(error2);
    }
    if (ssr) {
      branch.forEach(({ node, loaded, fetched, uses_credentials }) => {
        if (node.css)
          node.css.forEach((url2) => css10.add(url2));
        if (node.js)
          node.js.forEach((url2) => js9.add(url2));
        if (node.styles)
          Object.entries(node.styles).forEach(([k, v]) => styles.set(k, v));
        if (fetched && page_config.hydrate)
          serialized_data.push(...fetched);
        if (uses_credentials)
          is_private = true;
        maxage = loaded.maxage;
      });
      const session = writable($session);
      const props = {
        stores: {
          page: writable(null),
          navigating: writable(null),
          session
        },
        page: {
          url: state.prerender ? create_prerendering_url_proxy(url) : url,
          params,
          status,
          error: error2,
          stuff
        },
        components: branch.map(({ node }) => node.module.default)
      };
      const print_error = (property, replacement) => {
        Object.defineProperty(props.page, property, {
          get: () => {
            throw new Error(`$page.${property} has been replaced by $page.url.${replacement}`);
          }
        });
      };
      print_error("origin", "origin");
      print_error("path", "pathname");
      print_error("query", "searchParams");
      for (let i = 0; i < branch.length; i += 1) {
        props[`props_${i}`] = await branch[i].loaded.props;
      }
      let session_tracking_active = false;
      const unsubscribe = session.subscribe(() => {
        if (session_tracking_active)
          is_private = true;
      });
      session_tracking_active = true;
      try {
        rendered = options.root.render(props);
      } finally {
        unsubscribe();
      }
    } else {
      rendered = { head: "", html: "", css: { code: "", map: null } };
    }
    let { head, html: body } = rendered;
    const inlined_style = Array.from(styles.values()).join("\n");
    if (options.amp) {
      head += `
		<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style>
		<noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
		<script async src="https://cdn.ampproject.org/v0.js"><\/script>

		<style amp-custom>${inlined_style}
${rendered.css.code}</style>`;
      if (options.service_worker) {
        head += '<script async custom-element="amp-install-serviceworker" src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"><\/script>';
        body += `<amp-install-serviceworker src="${options.service_worker}" layout="nodisplay"></amp-install-serviceworker>`;
      }
    } else {
      if (inlined_style) {
        head += `
	<style${options.dev ? " data-svelte" : ""}>${inlined_style}</style>`;
      }
      head += Array.from(css10).map((dep) => `
	<link${styles.has(dep) ? ' disabled media="(max-width: 0)"' : ""} rel="stylesheet" href="${options.prefix + dep}">`).join("");
      if (page_config.router || page_config.hydrate) {
        head += Array.from(js9).map((dep) => `
	<link rel="modulepreload" href="${options.prefix + dep}">`).join("");
        head += `
			<script type="module">
				import { start } from ${s(options.prefix + options.manifest._.entry.file)};
				start({
					target: ${options.target ? `document.querySelector(${s(options.target)})` : "document.body"},
					paths: ${s(options.paths)},
					session: ${try_serialize($session, (error3) => {
          throw new Error(`Failed to serialize session data: ${error3.message}`);
        })},
					route: ${!!page_config.router},
					spa: ${!ssr},
					trailing_slash: ${s(options.trailing_slash)},
					hydrate: ${ssr && page_config.hydrate ? `{
						status: ${status},
						error: ${serialize_error(error2)},
						nodes: [
							${(branch || []).map(({ node }) => `import(${s(options.prefix + node.entry)})`).join(",\n						")}
						],
						url: new URL(${s(url.href)}),
						params: ${devalue(params)}
					}` : "null"}
				});
			<\/script>${options.service_worker ? `
			<script>
				if ('serviceWorker' in navigator) {
					navigator.serviceWorker.register('${options.service_worker}');
				}
			<\/script>` : ""}`;
        body += serialized_data.map(({ url: url2, body: body2, json }) => {
          let attributes = `type="application/json" data-type="svelte-data" data-url=${escape_html_attr(url2)}`;
          if (body2)
            attributes += ` data-body="${hash(body2)}"`;
          return `<script ${attributes}>${json}<\/script>`;
        }).join("\n\n	");
      }
    }
    const segments = url.pathname.slice(options.paths.base.length).split("/").slice(2);
    const assets2 = options.paths.assets || (segments.length > 0 ? segments.map(() => "..").join("/") : ".");
    const html = options.template({ head, body, assets: assets2 });
    const headers = new Headers({
      "content-type": "text/html",
      etag: `"${hash(html)}"`
    });
    if (maxage) {
      headers.set("cache-control", `${is_private ? "private" : "public"}, max-age=${maxage}`);
    }
    if (!options.floc) {
      headers.set("permissions-policy", "interest-cohort=()");
    }
    return new Response(html, {
      status,
      headers
    });
  }
  function try_serialize(data, fail) {
    try {
      return devalue(data);
    } catch (err) {
      if (fail)
        fail(coalesce_to_error(err));
      return null;
    }
  }
  function serialize_error(error2) {
    if (!error2)
      return null;
    let serialized = try_serialize(error2);
    if (!serialized) {
      const { name, message, stack } = error2;
      serialized = try_serialize({ ...error2, name, message, stack });
    }
    if (!serialized) {
      serialized = "{}";
    }
    return serialized;
  }
  function normalize(loaded) {
    const has_error_status = loaded.status && loaded.status >= 400 && loaded.status <= 599 && !loaded.redirect;
    if (loaded.error || has_error_status) {
      const status = loaded.status;
      if (!loaded.error && has_error_status) {
        return {
          status: status || 500,
          error: new Error()
        };
      }
      const error2 = typeof loaded.error === "string" ? new Error(loaded.error) : loaded.error;
      if (!(error2 instanceof Error)) {
        return {
          status: 500,
          error: new Error(`"error" property returned from load() must be a string or instance of Error, received type "${typeof error2}"`)
        };
      }
      if (!status || status < 400 || status > 599) {
        console.warn('"error" returned from load() without a valid status code \u2014 defaulting to 500');
        return { status: 500, error: error2 };
      }
      return { status, error: error2 };
    }
    if (loaded.redirect) {
      if (!loaded.status || Math.floor(loaded.status / 100) !== 3) {
        return {
          status: 500,
          error: new Error('"redirect" property returned from load() must be accompanied by a 3xx status code')
        };
      }
      if (typeof loaded.redirect !== "string") {
        return {
          status: 500,
          error: new Error('"redirect" property returned from load() must be a string')
        };
      }
    }
    if (loaded.context) {
      throw new Error('You are returning "context" from a load function. "context" was renamed to "stuff", please adjust your code accordingly.');
    }
    return loaded;
  }
  var absolute = /^([a-z]+:)?\/?\//;
  var scheme = /^[a-z]+:/;
  function resolve(base2, path) {
    if (scheme.test(path))
      return path;
    const base_match = absolute.exec(base2);
    const path_match = absolute.exec(path);
    if (!base_match) {
      throw new Error(`bad base path: "${base2}"`);
    }
    const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
    const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
    baseparts.pop();
    for (let i = 0; i < pathparts.length; i += 1) {
      const part = pathparts[i];
      if (part === ".")
        continue;
      else if (part === "..")
        baseparts.pop();
      else
        baseparts.push(part);
    }
    const prefix2 = path_match && path_match[0] || base_match && base_match[0] || "";
    return `${prefix2}${baseparts.join("/")}`;
  }
  function is_root_relative(path) {
    return path[0] === "/" && path[1] !== "/";
  }
  async function load_node({
    event,
    options,
    state,
    route,
    url,
    params,
    node,
    $session,
    stuff,
    is_error,
    status,
    error: error2
  }) {
    const { module } = node;
    let uses_credentials = false;
    const fetched = [];
    let set_cookie_headers = [];
    let loaded;
    if (module.load) {
      const load_input = {
        url: state.prerender ? create_prerendering_url_proxy(url) : url,
        params,
        get session() {
          uses_credentials = true;
          return $session;
        },
        fetch: async (resource, opts = {}) => {
          let requested;
          if (typeof resource === "string") {
            requested = resource;
          } else {
            requested = resource.url;
            opts = {
              method: resource.method,
              headers: resource.headers,
              body: resource.body,
              mode: resource.mode,
              credentials: resource.credentials,
              cache: resource.cache,
              redirect: resource.redirect,
              referrer: resource.referrer,
              integrity: resource.integrity,
              ...opts
            };
          }
          opts.headers = new Headers(opts.headers);
          const resolved = resolve(event.url.pathname, requested.split("?")[0]);
          let response;
          const prefix2 = options.paths.assets || options.paths.base;
          const filename = (resolved.startsWith(prefix2) ? resolved.slice(prefix2.length) : resolved).slice(1);
          const filename_html = `${filename}/index.html`;
          const is_asset = options.manifest.assets.has(filename);
          const is_asset_html = options.manifest.assets.has(filename_html);
          if (is_asset || is_asset_html) {
            const file = is_asset ? filename : filename_html;
            if (options.read) {
              const type = is_asset ? options.manifest._.mime[filename.slice(filename.lastIndexOf("."))] : "text/html";
              response = new Response(options.read(file), {
                headers: type ? { "content-type": type } : {}
              });
            } else {
              response = await fetch(`${url.origin}/${file}`, opts);
            }
          } else if (is_root_relative(resolved)) {
            const relative = resolved;
            if (opts.credentials !== "omit") {
              uses_credentials = true;
              const cookie = event.request.headers.get("cookie");
              const authorization = event.request.headers.get("authorization");
              if (cookie) {
                opts.headers.set("cookie", cookie);
              }
              if (authorization && !opts.headers.has("authorization")) {
                opts.headers.set("authorization", authorization);
              }
            }
            if (opts.body && typeof opts.body !== "string") {
              throw new Error("Request body must be a string");
            }
            const rendered = await respond(new Request(new URL(requested, event.url).href, opts), options, {
              fetched: requested,
              initiator: route
            });
            if (rendered) {
              if (state.prerender) {
                state.prerender.dependencies.set(relative, rendered);
              }
              response = rendered;
            } else {
              return fetch(new URL(requested, event.url).href, {
                method: opts.method || "GET",
                headers: opts.headers
              });
            }
          } else {
            if (resolved.startsWith("//")) {
              throw new Error(`Cannot request protocol-relative URL (${requested}) in server-side fetch`);
            }
            if (`.${new URL(requested).hostname}`.endsWith(`.${event.url.hostname}`) && opts.credentials !== "omit") {
              uses_credentials = true;
              const cookie = event.request.headers.get("cookie");
              if (cookie)
                opts.headers.set("cookie", cookie);
            }
            const external_request = new Request(requested, opts);
            response = await options.hooks.externalFetch.call(null, external_request);
          }
          if (response) {
            const proxy = new Proxy(response, {
              get(response2, key, _receiver) {
                async function text() {
                  const body = await response2.text();
                  const headers = {};
                  for (const [key2, value] of response2.headers) {
                    if (key2 === "set-cookie") {
                      set_cookie_headers = set_cookie_headers.concat(value);
                    } else if (key2 !== "etag") {
                      headers[key2] = value;
                    }
                  }
                  if (!opts.body || typeof opts.body === "string") {
                    fetched.push({
                      url: requested,
                      body: opts.body,
                      json: `{"status":${response2.status},"statusText":${s(response2.statusText)},"headers":${s(headers)},"body":"${escape_json_string_in_html(body)}"}`
                    });
                  }
                  return body;
                }
                if (key === "text") {
                  return text;
                }
                if (key === "json") {
                  return async () => {
                    return JSON.parse(await text());
                  };
                }
                return Reflect.get(response2, key, response2);
              }
            });
            return proxy;
          }
          return response || new Response("Not found", {
            status: 404
          });
        },
        stuff: { ...stuff }
      };
      if (options.dev) {
        Object.defineProperty(load_input, "page", {
          get: () => {
            throw new Error("`page` in `load` functions has been replaced by `url` and `params`");
          }
        });
      }
      if (is_error) {
        load_input.status = status;
        load_input.error = error2;
      }
      loaded = await module.load.call(null, load_input);
      if (!loaded) {
        throw new Error(`load function must return a value${options.dev ? ` (${node.entry})` : ""}`);
      }
    } else {
      loaded = {};
    }
    if (loaded.fallthrough && !is_error) {
      return;
    }
    return {
      node,
      loaded: normalize(loaded),
      stuff: loaded.stuff || stuff,
      fetched,
      set_cookie_headers,
      uses_credentials
    };
  }
  async function respond_with_error({ event, options, state, $session, status, error: error2, ssr }) {
    try {
      const default_layout = await options.manifest._.nodes[0]();
      const default_error = await options.manifest._.nodes[1]();
      const params = {};
      const layout_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        url: event.url,
        params,
        node: default_layout,
        $session,
        stuff: {},
        is_error: false
      });
      const error_loaded = await load_node({
        event,
        options,
        state,
        route: null,
        url: event.url,
        params,
        node: default_error,
        $session,
        stuff: layout_loaded ? layout_loaded.stuff : {},
        is_error: true,
        status,
        error: error2
      });
      return await render_response({
        options,
        state,
        $session,
        page_config: {
          hydrate: options.hydrate,
          router: options.router
        },
        stuff: error_loaded.stuff,
        status,
        error: error2,
        branch: [layout_loaded, error_loaded],
        url: event.url,
        params,
        ssr
      });
    } catch (err) {
      const error3 = coalesce_to_error(err);
      options.handle_error(error3, event);
      return new Response(error3.stack, {
        status: 500
      });
    }
  }
  async function respond$1(opts) {
    const { event, options, state, $session, route, ssr } = opts;
    let nodes;
    if (!ssr) {
      return await render_response({
        ...opts,
        branch: [],
        page_config: {
          hydrate: true,
          router: true
        },
        status: 200,
        url: event.url,
        stuff: {}
      });
    }
    try {
      nodes = await Promise.all(route.a.map((n) => options.manifest._.nodes[n] && options.manifest._.nodes[n]()));
    } catch (err) {
      const error3 = coalesce_to_error(err);
      options.handle_error(error3, event);
      return await respond_with_error({
        event,
        options,
        state,
        $session,
        status: 500,
        error: error3,
        ssr
      });
    }
    const leaf = nodes[nodes.length - 1].module;
    let page_config = get_page_config(leaf, options);
    if (!leaf.prerender && state.prerender && !state.prerender.all) {
      return new Response(void 0, {
        status: 204
      });
    }
    let branch = [];
    let status = 200;
    let error2;
    let set_cookie_headers = [];
    let stuff = {};
    ssr:
      if (ssr) {
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          let loaded;
          if (node) {
            try {
              loaded = await load_node({
                ...opts,
                url: event.url,
                node,
                stuff,
                is_error: false
              });
              if (!loaded)
                return;
              set_cookie_headers = set_cookie_headers.concat(loaded.set_cookie_headers);
              if (loaded.loaded.redirect) {
                return with_cookies(new Response(void 0, {
                  status: loaded.loaded.status,
                  headers: {
                    location: encodeURI(loaded.loaded.redirect)
                  }
                }), set_cookie_headers);
              }
              if (loaded.loaded.error) {
                ({ status, error: error2 } = loaded.loaded);
              }
            } catch (err) {
              const e = coalesce_to_error(err);
              options.handle_error(e, event);
              status = 500;
              error2 = e;
            }
            if (loaded && !error2) {
              branch.push(loaded);
            }
            if (error2) {
              while (i--) {
                if (route.b[i]) {
                  const error_node = await options.manifest._.nodes[route.b[i]]();
                  let node_loaded;
                  let j = i;
                  while (!(node_loaded = branch[j])) {
                    j -= 1;
                  }
                  try {
                    const error_loaded = await load_node({
                      ...opts,
                      url: event.url,
                      node: error_node,
                      stuff: node_loaded.stuff,
                      is_error: true,
                      status,
                      error: error2
                    });
                    if (error_loaded.loaded.error) {
                      continue;
                    }
                    page_config = get_page_config(error_node.module, options);
                    branch = branch.slice(0, j + 1).concat(error_loaded);
                    stuff = { ...node_loaded.stuff, ...error_loaded.stuff };
                    break ssr;
                  } catch (err) {
                    const e = coalesce_to_error(err);
                    options.handle_error(e, event);
                    continue;
                  }
                }
              }
              return with_cookies(await respond_with_error({
                event,
                options,
                state,
                $session,
                status,
                error: error2,
                ssr
              }), set_cookie_headers);
            }
          }
          if (loaded && loaded.loaded.stuff) {
            stuff = {
              ...stuff,
              ...loaded.loaded.stuff
            };
          }
        }
      }
    try {
      return with_cookies(await render_response({
        ...opts,
        stuff,
        url: event.url,
        page_config,
        status,
        error: error2,
        branch: branch.filter(Boolean)
      }), set_cookie_headers);
    } catch (err) {
      const error3 = coalesce_to_error(err);
      options.handle_error(error3, event);
      return with_cookies(await respond_with_error({
        ...opts,
        status: 500,
        error: error3
      }), set_cookie_headers);
    }
  }
  function get_page_config(leaf, options) {
    if ("ssr" in leaf) {
      throw new Error("`export const ssr` has been removed \u2014 use the handle hook instead: https://kit.svelte.dev/docs#hooks-handle");
    }
    return {
      router: "router" in leaf ? !!leaf.router : options.router,
      hydrate: "hydrate" in leaf ? !!leaf.hydrate : options.hydrate
    };
  }
  function with_cookies(response, set_cookie_headers) {
    if (set_cookie_headers.length) {
      set_cookie_headers.forEach((value) => {
        response.headers.append("set-cookie", value);
      });
    }
    return response;
  }
  async function render_page(event, route, match, options, state, ssr) {
    if (state.initiator === route) {
      return new Response(`Not found: ${event.url.pathname}`, {
        status: 404
      });
    }
    const params = route.params ? decode_params(route.params(match)) : {};
    const $session = await options.hooks.getSession(event);
    const response = await respond$1({
      event,
      options,
      state,
      $session,
      route,
      params,
      ssr
    });
    if (response) {
      return response;
    }
    if (state.fetched) {
      return new Response(`Bad request in load function: failed to fetch ${state.fetched}`, {
        status: 500
      });
    }
  }
  async function respond(request, options, state = {}) {
    const url = new URL(request.url);
    if (url.pathname !== "/" && options.trailing_slash !== "ignore") {
      const has_trailing_slash = url.pathname.endsWith("/");
      if (has_trailing_slash && options.trailing_slash === "never" || !has_trailing_slash && options.trailing_slash === "always" && !(url.pathname.split("/").pop() || "").includes(".")) {
        url.pathname = has_trailing_slash ? url.pathname.slice(0, -1) : url.pathname + "/";
        if (url.search === "?")
          url.search = "";
        return new Response(void 0, {
          status: 301,
          headers: {
            location: url.pathname + url.search
          }
        });
      }
    }
    const { parameter, allowed } = options.method_override;
    const method_override = url.searchParams.get(parameter)?.toUpperCase();
    if (method_override) {
      if (request.method === "POST") {
        if (allowed.includes(method_override)) {
          request = new Proxy(request, {
            get: (target, property, _receiver) => {
              if (property === "method")
                return method_override;
              return Reflect.get(target, property, target);
            }
          });
        } else {
          const verb = allowed.length === 0 ? "enabled" : "allowed";
          const body = `${parameter}=${method_override} is not ${verb}. See https://kit.svelte.dev/docs#configuration-methodoverride`;
          return new Response(body, {
            status: 400
          });
        }
      } else {
        throw new Error(`${parameter}=${method_override} is only allowed with POST requests`);
      }
    }
    const event = {
      request,
      url,
      params: {},
      locals: {}
    };
    const removed = (property, replacement, suffix = "") => ({
      get: () => {
        throw new Error(`event.${property} has been replaced by event.${replacement}` + suffix);
      }
    });
    const details = ". See https://github.com/sveltejs/kit/pull/3384 for details";
    const body_getter = {
      get: () => {
        throw new Error("To access the request body use the text/json/arrayBuffer/formData methods, e.g. `body = await request.json()`" + details);
      }
    };
    Object.defineProperties(event, {
      method: removed("method", "request.method", details),
      headers: removed("headers", "request.headers", details),
      origin: removed("origin", "url.origin"),
      path: removed("path", "url.pathname"),
      query: removed("query", "url.searchParams"),
      body: body_getter,
      rawBody: body_getter
    });
    let ssr = true;
    try {
      return await options.hooks.handle({
        event,
        resolve: async (event2, opts) => {
          if (opts && "ssr" in opts)
            ssr = opts.ssr;
          if (state.prerender && state.prerender.fallback) {
            return await render_response({
              url: event2.url,
              params: event2.params,
              options,
              state,
              $session: await options.hooks.getSession(event2),
              page_config: { router: true, hydrate: true },
              stuff: {},
              status: 200,
              branch: [],
              ssr: false
            });
          }
          let decoded = decodeURI(event2.url.pathname);
          if (options.paths.base) {
            if (!decoded.startsWith(options.paths.base))
              return;
            decoded = decoded.slice(options.paths.base.length) || "/";
          }
          for (const route of options.manifest._.routes) {
            const match = route.pattern.exec(decoded);
            if (!match)
              continue;
            const response = route.type === "endpoint" ? await render_endpoint(event2, route, match) : await render_page(event2, route, match, options, state, ssr);
            if (response) {
              if (response.status === 200 && response.headers.has("etag")) {
                let if_none_match_value = request.headers.get("if-none-match");
                if (if_none_match_value?.startsWith('W/"')) {
                  if_none_match_value = if_none_match_value.substring(2);
                }
                const etag = response.headers.get("etag");
                if (if_none_match_value === etag) {
                  const headers = new Headers({ etag });
                  for (const key of [
                    "cache-control",
                    "content-location",
                    "date",
                    "expires",
                    "vary"
                  ]) {
                    const value = response.headers.get(key);
                    if (value)
                      headers.set(key, value);
                  }
                  return new Response(void 0, {
                    status: 304,
                    headers
                  });
                }
              }
              return response;
            }
          }
          if (!state.initiator) {
            const $session = await options.hooks.getSession(event2);
            return await respond_with_error({
              event: event2,
              options,
              state,
              $session,
              status: 404,
              error: new Error(`Not found: ${event2.url.pathname}`),
              ssr
            });
          }
        },
        get request() {
          throw new Error("request in handle has been replaced with event" + details);
        }
      });
    } catch (e) {
      const error2 = coalesce_to_error(e);
      options.handle_error(error2, event);
      try {
        const $session = await options.hooks.getSession(event);
        return await respond_with_error({
          event,
          options,
          state,
          $session,
          status: 500,
          error: error2,
          ssr
        });
      } catch (e2) {
        const error3 = coalesce_to_error(e2);
        return new Response(options.dev ? error3.stack : error3.message, {
          status: 500
        });
      }
    }
  }
  var base = "";
  var assets = "";
  function set_paths(paths) {
    base = paths.base;
    assets = paths.assets || base;
  }
  var user_hooks = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module"
  });
  var template = ({ head, body, assets: assets2 }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<meta name="description" content="" />\n		<link rel="icon" href="' + assets2 + '/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<link rel="preconnect" href="https://fonts.googleapis.com" />\n		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n		<link\n			href="https://fonts.googleapis.com/css2?family=Epilogue:ital,wght@0,300;0,700;1,200;1,400&family=Poppins:wght@900&family=Press+Start+2P&display=swap"\n			rel="stylesheet"\n		/>\n		' + head + '\n	</head>\n	<body class="bg-slate-100 m-0 p-0">\n		<div id="svelte">' + body + "</div>\n	</body>\n</html>\n";
  var read = null;
  set_paths({ "base": "", "assets": "" });
  var get_hooks = (hooks) => ({
    getSession: hooks.getSession || (() => ({})),
    handle: hooks.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
    handleError: hooks.handleError || (({ error: error2 }) => console.error(error2.stack)),
    externalFetch: hooks.externalFetch || fetch
  });
  var App = class {
    constructor(manifest2) {
      const hooks = get_hooks(user_hooks);
      this.options = {
        amp: false,
        dev: false,
        floc: false,
        get_stack: (error2) => String(error2),
        handle_error: (error2, event) => {
          hooks.handleError({
            error: error2,
            event,
            get request() {
              throw new Error("request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details");
            }
          });
          error2.stack = this.options.get_stack(error2);
        },
        hooks,
        hydrate: true,
        manifest: manifest2,
        method_override: { "parameter": "_method", "allowed": [] },
        paths: { base, assets },
        prefix: assets + "/_app/",
        prerender: true,
        read,
        root: Root,
        service_worker: null,
        router: true,
        target: "#svelte",
        template,
        trailing_slash: "never"
      };
    }
    render(request, {
      prerender
    } = {}) {
      if (!(request instanceof Request)) {
        throw new Error("The first argument to app.render must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details");
      }
      return respond(request, this.options, { prerender });
    }
  };

  // .svelte-kit/cloudflare-workers-tmp/manifest.js
  var manifest = {
    appDir: "_app",
    assets: new Set(["favicon.png"]),
    _: {
      mime: { ".png": "image/png" },
      entry: { "file": "start-b0d2f4f9.js", "js": ["start-b0d2f4f9.js", "chunks/vendor-e168ef23.js"], "css": [] },
      nodes: [
        () => Promise.resolve().then(() => (init__(), __exports)),
        () => Promise.resolve().then(() => (init__2(), __exports2)),
        () => Promise.resolve().then(() => (init__3(), __exports3)),
        () => Promise.resolve().then(() => (init__4(), __exports4)),
        () => Promise.resolve().then(() => (init__5(), __exports5)),
        () => Promise.resolve().then(() => (init__6(), __exports6)),
        () => Promise.resolve().then(() => (init__7(), __exports7)),
        () => Promise.resolve().then(() => (init__8(), __exports8))
      ],
      routes: [
        {
          type: "page",
          pattern: /^\/$/,
          params: null,
          path: "/",
          a: [0, 2],
          b: [1]
        },
        {
          type: "page",
          pattern: /^\/events\/?$/,
          params: null,
          path: "/events",
          a: [0, 3],
          b: [1]
        },
        {
          type: "page",
          pattern: /^\/about\/?$/,
          params: null,
          path: "/about",
          a: [0, 4],
          b: [1]
        },
        {
          type: "page",
          pattern: /^\/forms\/?$/,
          params: null,
          path: "/forms",
          a: [0, 5],
          b: [1]
        },
        {
          type: "page",
          pattern: /^\/forms\/register\/?$/,
          params: null,
          path: "/forms/register",
          a: [0, 6],
          b: [1]
        },
        {
          type: "page",
          pattern: /^\/forms\/([^/]+?)\/?$/,
          params: (m) => ({ id: m[1] }),
          path: null,
          a: [0, 7],
          b: [1]
        }
      ]
    }
  };
  var prerendered = new Set([]);

  // .svelte-kit/cloudflare-workers-tmp/entry.js
  var import_kv_asset_handler = __toModule(require_dist());
  var app = new App(manifest);
  var prefix = `/${manifest.appDir}/`;
  addEventListener("fetch", (event) => {
    event.respondWith(handle(event));
  });
  async function handle(event) {
    const { request } = event;
    const url = new URL(request.url);
    if (url.pathname.startsWith(prefix)) {
      const res = await (0, import_kv_asset_handler.getAssetFromKV)(event);
      return new Response(res.body, {
        headers: {
          "cache-control": "public, immutable, max-age=31536000",
          "content-type": res.headers.get("content-type")
        }
      });
    }
    const pathname = url.pathname.replace(/\/$/, "");
    let file = pathname.substring(1);
    try {
      file = decodeURIComponent(file);
    } catch (err) {
    }
    if (manifest.assets.has(file) || manifest.assets.has(file + "/index.html") || prerendered.has(pathname || "/")) {
      return await (0, import_kv_asset_handler.getAssetFromKV)(event);
    }
    try {
      return await app.render(request);
    } catch (e) {
      return new Response("Error rendering route:" + (e.message || e.toString()), { status: 500 });
    }
  }
})();
