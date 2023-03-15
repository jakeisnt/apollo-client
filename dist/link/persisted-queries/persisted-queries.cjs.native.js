'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var tsInvariant = require('ts-invariant');
var index_js = require('ts-invariant/process/index.js');
var graphql = require('graphql');
var zenObservableTs = require('zen-observable-ts');
require('symbol-observable');

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

function getOperationName(doc) {
    return (doc.definitions
        .filter(function (definition) {
        return definition.kind === 'OperationDefinition' && definition.name;
    })
        .map(function (x) { return x.name.value; })[0] || null);
}

function isNonEmptyArray(value) {
    return Array.isArray(value) && value.length > 0;
}

function compact() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    var result = Object.create(null);
    objects.forEach(function (obj) {
        if (!obj)
            return;
        Object.keys(obj).forEach(function (key) {
            var value = obj[key];
            if (value !== void 0) {
                result[key] = value;
            }
        });
    });
    return result;
}

function validateOperation(operation) {
    var OPERATION_FIELDS = [
        'query',
        'operationName',
        'variables',
        'extensions',
        'context',
    ];
    for (var _i = 0, _a = Object.keys(operation); _i < _a.length; _i++) {
        var key = _a[_i];
        if (OPERATION_FIELDS.indexOf(key) < 0) {
            throw __DEV__ ? new tsInvariant.InvariantError("illegal argument: ".concat(key)) : new tsInvariant.InvariantError(24);
        }
    }
    return operation;
}

function createOperation(starting, operation) {
    var context = tslib.__assign({}, starting);
    var setContext = function (next) {
        if (typeof next === 'function') {
            context = tslib.__assign(tslib.__assign({}, context), next(context));
        }
        else {
            context = tslib.__assign(tslib.__assign({}, context), next);
        }
    };
    var getContext = function () { return (tslib.__assign({}, context)); };
    Object.defineProperty(operation, 'setContext', {
        enumerable: false,
        value: setContext,
    });
    Object.defineProperty(operation, 'getContext', {
        enumerable: false,
        value: getContext,
    });
    return operation;
}

function transformOperation(operation) {
    var transformedOperation = {
        variables: operation.variables || {},
        extensions: operation.extensions || {},
        operationName: operation.operationName,
        query: operation.query,
    };
    if (!transformedOperation.operationName) {
        transformedOperation.operationName =
            typeof transformedOperation.query !== 'string'
                ? getOperationName(transformedOperation.query) || undefined
                : '';
    }
    return transformedOperation;
}

function passthrough(op, forward) {
    return (forward ? forward(op) : zenObservableTs.Observable.of());
}
function toLink(handler) {
    return typeof handler === 'function' ? new ApolloLink(handler) : handler;
}
function isTerminating(link) {
    return link.request.length <= 1;
}
var LinkError = (function (_super) {
    tslib.__extends(LinkError, _super);
    function LinkError(message, link) {
        var _this = _super.call(this, message) || this;
        _this.link = link;
        return _this;
    }
    return LinkError;
}(Error));
var ApolloLink = (function () {
    function ApolloLink(request) {
        if (request)
            this.request = request;
    }
    ApolloLink.empty = function () {
        return new ApolloLink(function () { return zenObservableTs.Observable.of(); });
    };
    ApolloLink.from = function (links) {
        if (links.length === 0)
            return ApolloLink.empty();
        return links.map(toLink).reduce(function (x, y) { return x.concat(y); });
    };
    ApolloLink.split = function (test, left, right) {
        var leftLink = toLink(left);
        var rightLink = toLink(right || new ApolloLink(passthrough));
        if (isTerminating(leftLink) && isTerminating(rightLink)) {
            return new ApolloLink(function (operation) {
                return test(operation)
                    ? leftLink.request(operation) || zenObservableTs.Observable.of()
                    : rightLink.request(operation) || zenObservableTs.Observable.of();
            });
        }
        else {
            return new ApolloLink(function (operation, forward) {
                return test(operation)
                    ? leftLink.request(operation, forward) || zenObservableTs.Observable.of()
                    : rightLink.request(operation, forward) || zenObservableTs.Observable.of();
            });
        }
    };
    ApolloLink.execute = function (link, operation) {
        return (link.request(createOperation(operation.context, transformOperation(validateOperation(operation)))) || zenObservableTs.Observable.of());
    };
    ApolloLink.concat = function (first, second) {
        var firstLink = toLink(first);
        if (isTerminating(firstLink)) {
            __DEV__ && tsInvariant.invariant.warn(new LinkError("You are calling concat on a terminating link, which will have no effect", firstLink));
            return firstLink;
        }
        var nextLink = toLink(second);
        if (isTerminating(nextLink)) {
            return new ApolloLink(function (operation) {
                return firstLink.request(operation, function (op) { return nextLink.request(op) || zenObservableTs.Observable.of(); }) || zenObservableTs.Observable.of();
            });
        }
        else {
            return new ApolloLink(function (operation, forward) {
                return (firstLink.request(operation, function (op) {
                    return nextLink.request(op, forward) || zenObservableTs.Observable.of();
                }) || zenObservableTs.Observable.of());
            });
        }
    };
    ApolloLink.prototype.split = function (test, left, right) {
        return this.concat(ApolloLink.split(test, left, right || new ApolloLink(passthrough)));
    };
    ApolloLink.prototype.concat = function (next) {
        return ApolloLink.concat(this, next);
    };
    ApolloLink.prototype.request = function (operation, forward) {
        throw __DEV__ ? new tsInvariant.InvariantError('request is not implemented') : new tsInvariant.InvariantError(19);
    };
    ApolloLink.prototype.onError = function (error, observer) {
        if (observer && observer.error) {
            observer.error(error);
            return false;
        }
        throw error;
    };
    ApolloLink.prototype.setOnError = function (fn) {
        this.onError = fn;
        return this;
    };
    return ApolloLink;
}());

var VERSION = 1;
exports.PersistedQueryLink = void 0;
(function (PersistedQueryLink) {
})(exports.PersistedQueryLink || (exports.PersistedQueryLink = {}));
function collectErrorsByMessage(graphQLErrors) {
    var collected = Object.create(null);
    if (isNonEmptyArray(graphQLErrors)) {
        graphQLErrors.forEach(function (error) { return collected[error.message] = error; });
    }
    return collected;
}
var defaultOptions = {
    disable: function (_a) {
        var graphQLErrors = _a.graphQLErrors, operation = _a.operation;
        var errorMessages = collectErrorsByMessage(graphQLErrors);
        if (errorMessages.PersistedQueryNotSupported) {
            return true;
        }
        if (errorMessages.PersistedQueryNotFound) {
            return false;
        }
        var response = operation.getContext().response;
        if (response &&
            response.status &&
            (response.status === 400 || response.status === 500)) {
            return true;
        }
        return false;
    },
    useGETForHashedQueries: false,
};
function operationDefinesMutation(operation) {
    return operation.query.definitions.some(function (d) { return d.kind === 'OperationDefinition' && d.operation === 'mutation'; });
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hashesByQuery = new WeakMap();
var nextHashesChildKey = 0;
var createPersistedQueryLink = function (options) {
    __DEV__ ? tsInvariant.invariant(options && (typeof options.sha256 === 'function' ||
        typeof options.generateHash === 'function'), 'Missing/invalid "sha256" or "generateHash" function. Please ' +
        'configure one using the "createPersistedQueryLink(options)" options ' +
        'parameter.') : tsInvariant.invariant(options && (typeof options.sha256 === 'function' ||
        typeof options.generateHash === 'function'), 22);
    var _a = compact(defaultOptions, options), sha256 = _a.sha256, _b = _a.generateHash, generateHash = _b === void 0 ? function (query) {
        return Promise.resolve(sha256(graphql.print(query)));
    } : _b, disable = _a.disable, useGETForHashedQueries = _a.useGETForHashedQueries;
    var supportsPersistedQueries = true;
    var hashesChildKey = 'forLink' + nextHashesChildKey++;
    var getHashPromise = function (query) {
        return new Promise(function (resolve) { return resolve(generateHash(query)); });
    };
    function getQueryHash(query) {
        if (!query || typeof query !== 'object') {
            return getHashPromise(query);
        }
        var hashes = hashesByQuery.get(query);
        if (!hashes)
            hashesByQuery.set(query, hashes = Object.create(null));
        return hasOwnProperty.call(hashes, hashesChildKey)
            ? hashes[hashesChildKey]
            : hashes[hashesChildKey] = getHashPromise(query);
    }
    return new ApolloLink(function (operation, forward) {
        __DEV__ ? tsInvariant.invariant(forward, 'PersistedQueryLink cannot be the last link in the chain.') : tsInvariant.invariant(forward, 23);
        var query = operation.query;
        return new zenObservableTs.Observable(function (observer) {
            var subscription;
            var retried = false;
            var originalFetchOptions;
            var setFetchOptions = false;
            var retry = function (_a, cb) {
                var response = _a.response, networkError = _a.networkError;
                if (!retried && ((response && response.errors) || networkError)) {
                    retried = true;
                    var graphQLErrors = [];
                    var responseErrors = response && response.errors;
                    if (isNonEmptyArray(responseErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, responseErrors);
                    }
                    var networkErrors = networkError &&
                        networkError.result &&
                        networkError.result.errors;
                    if (isNonEmptyArray(networkErrors)) {
                        graphQLErrors.push.apply(graphQLErrors, networkErrors);
                    }
                    var disablePayload = {
                        response: response,
                        networkError: networkError,
                        operation: operation,
                        graphQLErrors: isNonEmptyArray(graphQLErrors) ? graphQLErrors : void 0,
                    };
                    supportsPersistedQueries = !disable(disablePayload);
                    if (collectErrorsByMessage(graphQLErrors).PersistedQueryNotFound ||
                        !supportsPersistedQueries) {
                        if (subscription)
                            subscription.unsubscribe();
                        operation.setContext({
                            http: {
                                includeQuery: true,
                                includeExtensions: supportsPersistedQueries,
                            },
                            fetchOptions: {
                                method: 'POST',
                            },
                        });
                        if (setFetchOptions) {
                            operation.setContext({ fetchOptions: originalFetchOptions });
                        }
                        subscription = forward(operation).subscribe(handler);
                        return;
                    }
                }
                cb();
            };
            var handler = {
                next: function (response) {
                    retry({ response: response }, function () { return observer.next(response); });
                },
                error: function (networkError) {
                    retry({ networkError: networkError }, function () { return observer.error(networkError); });
                },
                complete: observer.complete.bind(observer),
            };
            operation.setContext({
                http: {
                    includeQuery: !supportsPersistedQueries,
                    includeExtensions: supportsPersistedQueries,
                },
            });
            if (useGETForHashedQueries &&
                supportsPersistedQueries &&
                !operationDefinesMutation(operation)) {
                operation.setContext(function (_a) {
                    var _b = _a.fetchOptions, fetchOptions = _b === void 0 ? {} : _b;
                    originalFetchOptions = fetchOptions;
                    return {
                        fetchOptions: tslib.__assign(tslib.__assign({}, fetchOptions), { method: 'GET' }),
                    };
                });
                setFetchOptions = true;
            }
            if (supportsPersistedQueries) {
                getQueryHash(query).then(function (sha256Hash) {
                    operation.extensions.persistedQuery = {
                        version: VERSION,
                        sha256Hash: sha256Hash,
                    };
                    subscription = forward(operation).subscribe(handler);
                }).catch(observer.error.bind(observer));
            }
            else {
                subscription = forward(operation).subscribe(handler);
            }
            return function () {
                if (subscription)
                    subscription.unsubscribe();
            };
        });
    });
};

exports.VERSION = VERSION;
exports.createPersistedQueryLink = createPersistedQueryLink;
//# sourceMappingURL=persisted-queries.cjs.map
