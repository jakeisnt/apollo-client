import { __assign, __extends } from "tslib";
import * as React from 'react';
import { ApolloClient } from "../../core/index.js";
import { InMemoryCache as Cache } from "../../cache/index.js";
import { ApolloProvider } from "../../react/context/index.js";
import { MockLink } from "../core/index.js";
var MockedProvider = (function (_super) {
    __extends(MockedProvider, _super);
    function MockedProvider(props) {
        var _this = _super.call(this, props) || this;
        var _a = _this.props, mocks = _a.mocks, addTypename = _a.addTypename, defaultOptions = _a.defaultOptions, cache = _a.cache, resolvers = _a.resolvers, link = _a.link;
        var client = new ApolloClient({
            cache: cache || new Cache({ addTypename: addTypename }),
            defaultOptions: defaultOptions,
            link: link || new MockLink(mocks || [], addTypename),
            resolvers: resolvers,
        });
        _this.state = { client: client };
        return _this;
    }
    MockedProvider.prototype.render = function () {
        var _a = this.props, children = _a.children, childProps = _a.childProps;
        return React.isValidElement(children) ? (React.createElement(ApolloProvider, { client: this.state.client }, React.cloneElement(React.Children.only(children), __assign({}, childProps)))) : null;
    };
    MockedProvider.prototype.componentWillUnmount = function () {
        this.state.client.stop();
    };
    MockedProvider.defaultProps = {
        addTypename: true
    };
    return MockedProvider;
}(React.Component));
export { MockedProvider };
//# sourceMappingURL=MockedProvider.js.map