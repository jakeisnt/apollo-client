import { ReactNode } from 'react';
import { DocumentNode } from 'graphql';
import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { Observable, ObservableSubscription } from '../../utilities';
import { FetchResult } from '../../link/core';
import { ApolloError } from '../../errors';
import { ApolloCache, ApolloClient, DefaultContext, FetchPolicy, MutationOptions, NetworkStatus, ObservableQuery, OperationVariables, InternalRefetchQueriesInclude, WatchQueryOptions } from '../../core';
export type { DefaultContext as Context } from "../../core";
export declare type CommonOptions<TOptions> = TOptions & {
    client?: ApolloClient<object>;
};
export interface BaseQueryOptions<TVariables = OperationVariables> extends Omit<WatchQueryOptions<TVariables>, "query"> {
    ssr?: boolean;
    client?: ApolloClient<any>;
    context?: DefaultContext;
}
export interface QueryFunctionOptions<TData = any, TVariables = OperationVariables> extends BaseQueryOptions<TVariables> {
    displayName?: string;
    skip?: boolean;
    onCompleted?: (data: TData) => void;
    onError?: (error: ApolloError) => void;
    defaultOptions?: Partial<WatchQueryOptions<TVariables, TData>>;
}
export declare type ObservableQueryFields<TData, TVariables> = Pick<ObservableQuery<TData, TVariables>, 'startPolling' | 'stopPolling' | 'subscribeToMore' | 'updateQuery' | 'refetch' | 'reobserve' | 'variables' | 'fetchMore'>;
export interface QueryResult<TData = any, TVariables = OperationVariables> extends ObservableQueryFields<TData, TVariables> {
    client: ApolloClient<any>;
    observable: ObservableQuery<TData, TVariables>;
    data: TData | undefined;
    previousData?: TData;
    error?: ApolloError;
    loading: boolean;
    networkStatus: NetworkStatus;
    called: boolean;
}
export interface QueryDataOptions<TData = any, TVariables = OperationVariables> extends QueryFunctionOptions<TData, TVariables> {
    children?: (result: QueryResult<TData, TVariables>) => ReactNode;
    query: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface QueryHookOptions<TData = any, TVariables = OperationVariables> extends QueryFunctionOptions<TData, TVariables> {
    query?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface LazyQueryHookOptions<TData = any, TVariables = OperationVariables> extends Omit<QueryHookOptions<TData, TVariables>, 'skip'> {
}
export interface QueryLazyOptions<TVariables> {
    variables?: TVariables;
    context?: DefaultContext;
}
export declare type LazyQueryResult<TData, TVariables> = QueryResult<TData, TVariables>;
export declare type QueryTuple<TData, TVariables> = LazyQueryResultTuple<TData, TVariables>;
export declare type LazyQueryExecFunction<TData, TVariables> = (options?: Partial<LazyQueryHookOptions<TData, TVariables>>) => Promise<QueryResult<TData, TVariables>>;
export declare type LazyQueryResultTuple<TData, TVariables> = [
    LazyQueryExecFunction<TData, TVariables>,
    QueryResult<TData, TVariables>
];
export declare type RefetchQueriesFunction = (...args: any[]) => InternalRefetchQueriesInclude;
export interface BaseMutationOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends Omit<MutationOptions<TData, TVariables, TContext, TCache>, "mutation"> {
    client?: ApolloClient<object>;
    notifyOnNetworkStatusChange?: boolean;
    onCompleted?: (data: TData, clientOptions?: BaseMutationOptions) => void;
    onError?: (error: ApolloError, clientOptions?: BaseMutationOptions) => void;
    ignoreResults?: boolean;
}
export interface MutationFunctionOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
    mutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface MutationResult<TData = any> {
    data?: TData | null;
    error?: ApolloError;
    loading: boolean;
    called: boolean;
    client: ApolloClient<object>;
    reset(): void;
}
export declare type MutationFunction<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> = (options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>) => Promise<FetchResult<TData>>;
export interface MutationHookOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
    mutation?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface MutationDataOptions<TData = any, TVariables = OperationVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> extends BaseMutationOptions<TData, TVariables, TContext, TCache> {
    mutation: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export declare type MutationTuple<TData, TVariables, TContext = DefaultContext, TCache extends ApolloCache<any> = ApolloCache<any>> = [
    (options?: MutationFunctionOptions<TData, TVariables, TContext, TCache>) => Promise<FetchResult<TData>>,
    MutationResult<TData>
];
export interface OnSubscriptionDataOptions<TData = any> {
    client: ApolloClient<object>;
    subscriptionData: SubscriptionResult<TData>;
}
export interface BaseSubscriptionOptions<TData = any, TVariables = OperationVariables> {
    variables?: TVariables;
    fetchPolicy?: FetchPolicy;
    shouldResubscribe?: boolean | ((options: BaseSubscriptionOptions<TData, TVariables>) => boolean);
    client?: ApolloClient<object>;
    skip?: boolean;
    context?: DefaultContext;
    onSubscriptionData?: (options: OnSubscriptionDataOptions<TData>) => any;
    onSubscriptionComplete?: () => void;
}
export interface SubscriptionResult<TData = any, TVariables = any> {
    loading: boolean;
    data?: TData;
    error?: ApolloError;
    variables?: TVariables;
}
export interface SubscriptionHookOptions<TData = any, TVariables = OperationVariables> extends BaseSubscriptionOptions<TData, TVariables> {
    subscription?: DocumentNode | TypedDocumentNode<TData, TVariables>;
}
export interface SubscriptionDataOptions<TData = any, TVariables = OperationVariables> extends BaseSubscriptionOptions<TData, TVariables> {
    subscription: DocumentNode | TypedDocumentNode<TData, TVariables>;
    children?: null | ((result: SubscriptionResult<TData>) => JSX.Element | null);
}
export interface SubscriptionCurrentObservable {
    query?: Observable<any>;
    subscription?: ObservableSubscription;
}
//# sourceMappingURL=types.d.ts.map