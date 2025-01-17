import { NetworkStatus } from './networkStatus';
import { Observable } from '../utilities';
import { ApolloError } from '../errors';
import { QueryManager } from './QueryManager';
import { ApolloQueryResult, OperationVariables, TypedDocumentNode } from './types';
import { WatchQueryOptions, FetchMoreQueryOptions, SubscribeToMoreOptions } from './watchQueryOptions';
import { QueryInfo } from './QueryInfo';
import { MissingFieldError } from '../cache';
import { MissingTree } from '../cache/core/types/common';
export interface FetchMoreOptions<TData = any, TVariables = OperationVariables> {
    updateQuery?: (previousQueryResult: TData, options: {
        fetchMoreResult?: TData;
        variables?: TVariables;
    }) => TData;
}
export interface UpdateQueryOptions<TVariables> {
    variables?: TVariables;
}
export declare class ObservableQuery<TData = any, TVariables = OperationVariables> extends Observable<ApolloQueryResult<TData>> {
    readonly options: WatchQueryOptions<TVariables, TData>;
    readonly queryId: string;
    readonly queryName?: string;
    get query(): TypedDocumentNode<TData, TVariables>;
    get variables(): TVariables | undefined;
    private isTornDown;
    private queryManager;
    private observers;
    private subscriptions;
    private last?;
    private queryInfo;
    private concast?;
    private observer?;
    private pollingInfo?;
    constructor({ queryManager, queryInfo, options, }: {
        queryManager: QueryManager<any>;
        queryInfo: QueryInfo;
        options: WatchQueryOptions<TVariables, TData>;
    });
    result(): Promise<ApolloQueryResult<TData>>;
    getCurrentResult(saveAsLastResult?: boolean): ApolloQueryResult<TData>;
    isDifferentFromLastResult(newResult: ApolloQueryResult<TData>): boolean;
    private getLast;
    getLastResult(variablesMustMatch?: boolean): ApolloQueryResult<TData> | undefined;
    getLastError(variablesMustMatch?: boolean): ApolloError | undefined;
    resetLastResults(): void;
    resetQueryStoreErrors(): void;
    refetch(variables?: Partial<TVariables>): Promise<ApolloQueryResult<TData>>;
    fetchMore<TFetchData = TData, TFetchVars = TVariables>(fetchMoreOptions: FetchMoreQueryOptions<TFetchVars, TFetchData> & {
        updateQuery?: (previousQueryResult: TData, options: {
            fetchMoreResult: TFetchData;
            variables: TFetchVars;
        }) => TData;
    }): Promise<ApolloQueryResult<TFetchData>>;
    subscribeToMore<TSubscriptionData = TData, TSubscriptionVariables = TVariables>(options: SubscribeToMoreOptions<TData, TSubscriptionVariables, TSubscriptionData>): () => void;
    setOptions(newOptions: Partial<WatchQueryOptions<TVariables, TData>>): Promise<ApolloQueryResult<TData>>;
    setVariables(variables: TVariables): Promise<ApolloQueryResult<TData> | void>;
    updateQuery<TVars = TVariables>(mapFn: (previousQueryResult: TData, options: Pick<WatchQueryOptions<TVars, TData>, "variables">) => TData): void;
    startPolling(pollInterval: number): void;
    stopPolling(): void;
    private applyNextFetchPolicy;
    private fetch;
    private updatePolling;
    private updateLastResult;
    reobserve(newOptions?: Partial<WatchQueryOptions<TVariables, TData>>, newNetworkStatus?: NetworkStatus): Promise<ApolloQueryResult<TData>>;
    private observe;
    private reportResult;
    private reportError;
    hasObservers(): boolean;
    private tearDownQuery;
}
export declare function reobserveCacheFirst<TData, TVars>(obsQuery: ObservableQuery<TData, TVars>): Promise<ApolloQueryResult<TData>>;
export declare function logMissingFieldErrors(missing: MissingFieldError[] | MissingTree | undefined): void;
//# sourceMappingURL=ObservableQuery.d.ts.map