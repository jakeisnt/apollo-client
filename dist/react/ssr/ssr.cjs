'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var React = require('react');
var tsInvariant = require('ts-invariant');
var index_js = require('ts-invariant/process/index.js');
var graphql = require('graphql');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        for (var k in e) {
            n[k] = e[k];
        }
    }
    n["default"] = e;
    return Object.freeze(n);
}

var React__namespace = /*#__PURE__*/_interopNamespace(React);

function maybe(thunk) {
    try {
        return thunk();
    }
    catch (_a) { }
}

var global$1 = (maybe(function () { return globalThis; }) ||
    maybe(function () { return window; }) ||
    maybe(function () { return self; }) ||
    maybe(function () { return global; }) || maybe(function () { return maybe.constructor("return this")(); }));

var __ = "__";
var GLOBAL_KEY = [__, __].join("DEV");
function getDEV() {
    try {
        return Boolean(__DEV__);
    }
    catch (_a) {
        Object.defineProperty(global$1, GLOBAL_KEY, {
            value: maybe(function () { return process.env.NODE_ENV; }) !== "production",
            enumerable: false,
            configurable: true,
            writable: true,
        });
        return global$1[GLOBAL_KEY];
    }
}
var DEV = getDEV();

function removeTemporaryGlobals() {
    return typeof graphql.Source === "function" ? index_js.remove() : index_js.remove();
}

function checkDEV() {
    __DEV__ ? tsInvariant.invariant("boolean" === typeof DEV, DEV) : tsInvariant.invariant("boolean" === typeof DEV, 36);
}
removeTemporaryGlobals();
checkDEV();

typeof WeakMap === 'function' &&
    maybe(function () { return navigator.product; }) !== 'ReactNative';
var canUseSymbol = typeof Symbol === 'function' &&
    typeof Symbol.for === 'function';
typeof maybe(function () { return window.document.createElement; }) === "function";
maybe(function () { return navigator.userAgent.indexOf("jsdom") >= 0; }) || false;

var contextKey = canUseSymbol
    ? Symbol.for('__APOLLO_CONTEXT__')
    : '__APOLLO_CONTEXT__';
function getApolloContext() {
    var context = React__namespace.createContext[contextKey];
    if (!context) {
        Object.defineProperty(React__namespace.createContext, contextKey, {
            value: context = React__namespace.createContext({}),
            enumerable: false,
            writable: false,
            configurable: true,
        });
        context.displayName = 'ApolloContext';
    }
    return context;
}

function makeDefaultQueryInfo() {
    return {
        seen: false,
        observable: null
    };
}
var RenderPromises = (function () {
    function RenderPromises() {
        this.queryPromises = new Map();
        this.queryInfoTrie = new Map();
        this.stopped = false;
    }
    RenderPromises.prototype.stop = function () {
        if (!this.stopped) {
            this.queryPromises.clear();
            this.queryInfoTrie.clear();
            this.stopped = true;
        }
    };
    RenderPromises.prototype.registerSSRObservable = function (observable) {
        if (this.stopped)
            return;
        this.lookupQueryInfo(observable.options).observable = observable;
    };
    RenderPromises.prototype.getSSRObservable = function (props) {
        return this.lookupQueryInfo(props).observable;
    };
    RenderPromises.prototype.addQueryPromise = function (queryInstance, finish) {
        if (!this.stopped) {
            var info = this.lookupQueryInfo(queryInstance.getOptions());
            if (!info.seen) {
                this.queryPromises.set(queryInstance.getOptions(), new Promise(function (resolve) {
                    resolve(queryInstance.fetchData());
                }));
                return null;
            }
        }
        return finish ? finish() : null;
    };
    RenderPromises.prototype.addObservableQueryPromise = function (obsQuery) {
        return this.addQueryPromise({
            getOptions: function () { return obsQuery.options; },
            fetchData: function () { return new Promise(function (resolve) {
                var sub = obsQuery.subscribe({
                    next: function (result) {
                        if (!result.loading) {
                            resolve();
                            sub.unsubscribe();
                        }
                    },
                    error: function () {
                        resolve();
                        sub.unsubscribe();
                    },
                    complete: function () {
                        resolve();
                    },
                });
            }); },
        });
    };
    RenderPromises.prototype.hasPromises = function () {
        return this.queryPromises.size > 0;
    };
    RenderPromises.prototype.consumeAndAwaitPromises = function () {
        var _this = this;
        var promises = [];
        this.queryPromises.forEach(function (promise, queryInstance) {
            _this.lookupQueryInfo(queryInstance).seen = true;
            promises.push(promise);
        });
        this.queryPromises.clear();
        return Promise.all(promises);
    };
    RenderPromises.prototype.lookupQueryInfo = function (props) {
        var queryInfoTrie = this.queryInfoTrie;
        var query = props.query, variables = props.variables;
        var varMap = queryInfoTrie.get(query) || new Map();
        if (!queryInfoTrie.has(query))
            queryInfoTrie.set(query, varMap);
        var variablesString = JSON.stringify(variables);
        var info = varMap.get(variablesString) || makeDefaultQueryInfo();
        if (!varMap.has(variablesString))
            varMap.set(variablesString, info);
        return info;
    };
    return RenderPromises;
}());

function getDataFromTree(tree, context) {
    if (context === void 0) { context = {}; }
    return getMarkupFromTree({
        tree: tree,
        context: context,
        renderFunction: require('react-dom/server').renderToStaticMarkup
    });
}
function getMarkupFromTree(_a) {
    var tree = _a.tree, _b = _a.context, context = _b === void 0 ? {} : _b, _c = _a.renderFunction, renderFunction = _c === void 0 ? require('react-dom/server').renderToStaticMarkup : _c;
    var renderPromises = new RenderPromises();
    function process() {
        var ApolloContext = getApolloContext();
        return new Promise(function (resolve) {
            var element = React__namespace.createElement(ApolloContext.Provider, { value: tslib.__assign(tslib.__assign({}, context), { renderPromises: renderPromises }) }, tree);
            resolve(renderFunction(element));
        }).then(function (html) {
            return renderPromises.hasPromises()
                ? renderPromises.consumeAndAwaitPromises().then(process)
                : html;
        }).finally(function () {
            renderPromises.stop();
        });
    }
    return Promise.resolve().then(process);
}

function renderToStringWithData(component) {
    return getMarkupFromTree({
        tree: component,
        renderFunction: require('react-dom/server').renderToString
    });
}

exports.RenderPromises = RenderPromises;
exports.getDataFromTree = getDataFromTree;
exports.getMarkupFromTree = getMarkupFromTree;
exports.renderToStringWithData = renderToStringWithData;
//# sourceMappingURL=ssr.cjs.map
