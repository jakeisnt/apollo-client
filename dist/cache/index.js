import "../utilities/globals/index.js";
export { ApolloCache } from "./core/cache.js";
export { Cache } from "./core/types/Cache.js";
export { MissingFieldError } from "./core/types/common.js";
export { isReference, makeReference, } from "../utilities/index.js";
export { EntityStore } from "./inmemory/entityStore.js";
export { fieldNameFromStoreName, defaultDataIdFromObject, } from "./inmemory/helpers.js";
export { InMemoryCache, } from "./inmemory/inMemoryCache.js";
export { makeVar, cacheSlot, } from "./inmemory/reactiveVars.js";
export { Policies, } from "./inmemory/policies.js";
export { canonicalStringify, } from "./inmemory/object-canon.js";
export * from "./inmemory/types.js";
//# sourceMappingURL=index.js.map