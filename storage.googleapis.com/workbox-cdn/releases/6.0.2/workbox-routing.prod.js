this.workbox = this.workbox || {}, this.workbox.routing = function(t, e) {
    "use strict";
    try {
        self["workbox:routing:6.0.2"] && _()
    } catch (t) {}
    const s = t => t && "object" == typeof t ? t : {
        handle: t
    };
    class r {
        constructor(t, e, r = "GET") {
            this.handler = s(e), this.match = t, this.method = r
        }
    }
    class n extends r {
        constructor(t, e, s) {
            super((({
                url: e
            }) => {
                const s = t.exec(e.href);
                if (s && (e.origin === location.origin || 0 === s.index)) return s.slice(1)
            }), e, s)
        }
    }
    class o {
        constructor() {
            this.ft = new Map, this.dt = new Map
        }
        get routes() {
            return this.ft
        }
        addFetchListener() {
            self.addEventListener("fetch", (t => {
                const {
                    request: e
                } = t, s = this.handleRequest({
                    request: e,
                    event: t
                });
                s && t.respondWith(s)
            }))
        }
        addCacheListener() {
            self.addEventListener("message", (t => {
                if (t.data && "CACHE_URLS" === t.data.type) {
                    const {
                        payload: e
                    } = t.data, s = Promise.all(e.urlsToCache.map((e => {
                        "string" == typeof e && (e = [e]);
                        const s = new Request(...e);
                        return this.handleRequest({
                            request: s,
                            event: t
                        })
                    })));
                    t.waitUntil(s), t.ports && t.ports[0] && s.then((() => t.ports[0].postMessage(!0)))
                }
            }))
        }
        handleRequest({
            request: t,
            event: e
        }) {
            const s = new URL(t.url, location.href);
            if (!s.protocol.startsWith("http")) return;
            const r = s.origin === location.origin,
                {
                    params: n,
                    route: o
                } = this.findMatchingRoute({
                    event: e,
                    request: t,
                    sameOrigin: r,
                    url: s
                });
            let i = o && o.handler;
            const u = t.method;
            if (!i && this.dt.has(u) && (i = this.dt.get(u)), !i) return;
            let c;
            try {
                c = i.handle({
                    url: s,
                    request: t,
                    event: e,
                    params: n
                })
            } catch (t) {
                c = Promise.reject(t)
            }
            return c instanceof Promise && this.wt && (c = c.catch((r => this.wt.handle({
                url: s,
                request: t,
                event: e
            })))), c
        }
        findMatchingRoute({
            url: t,
            sameOrigin: e,
            request: s,
            event: r
        }) {
            const n = this.ft.get(s.method) || [];
            for (const o of n) {
                let n;
                const i = o.match({
                    url: t,
                    sameOrigin: e,
                    request: s,
                    event: r
                });
                if (i) return n = i, (Array.isArray(i) && 0 === i.length || i.constructor === Object && 0 === Object.keys(i).length || "boolean" == typeof i) && (n = void 0), {
                    route: o,
                    params: n
                }
            }
            return {}
        }
        setDefaultHandler(t, e = "GET") {
            this.dt.set(e, s(t))
        }
        setCatchHandler(t) {
            this.wt = s(t)
        }
        registerRoute(t) {
            this.ft.has(t.method) || this.ft.set(t.method, []), this.ft.get(t.method).push(t)
        }
        unregisterRoute(t) {
            if (!this.ft.has(t.method)) throw new e.WorkboxError("unregister-route-but-not-found-with-method", {
                method: t.method
            });
            const s = this.ft.get(t.method).indexOf(t);
            if (!(s > -1)) throw new e.WorkboxError("unregister-route-route-not-registered");
            this.ft.get(t.method).splice(s, 1)
        }
    }
    let i;
    const u = () => (i || (i = new o, i.addFetchListener(), i.addCacheListener()), i);
    return t.NavigationRoute = class extends r {
        constructor(t, {
            allowlist: e = [/./],
            denylist: s = []
        } = {}) {
            super((t => this.gt(t)), t), this.qt = e, this.yt = s
        }
        gt({
            url: t,
            request: e
        }) {
            if (e && "navigate" !== e.mode) return !1;
            const s = t.pathname + t.search;
            for (const t of this.yt)
                if (t.test(s)) return !1;
            return !!this.qt.some((t => t.test(s)))
        }
    }, t.RegExpRoute = n, t.Route = r, t.Router = o, t.registerRoute = function(t, s, o) {
        let i;
        if ("string" == typeof t) {
            const e = new URL(t, location.href);
            i = new r((({
                url: t
            }) => t.href === e.href), s, o)
        } else if (t instanceof RegExp) i = new n(t, s, o);
        else if ("function" == typeof t) i = new r(t, s, o);
        else {
            if (!(t instanceof r)) throw new e.WorkboxError("unsupported-route-type", {
                moduleName: "workbox-routing",
                funcName: "registerRoute",
                paramName: "capture"
            });
            i = t
        }
        return u().registerRoute(i), i
    }, t.setCatchHandler = function(t) {
        u().setCatchHandler(t)
    }, t.setDefaultHandler = function(t) {
        u().setDefaultHandler(t)
    }, t
}({}, workbox.core._private);
//# sourceMappingURL=workbox-routing.prod.js.map