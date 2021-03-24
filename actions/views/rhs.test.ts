// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {batchActions} from 'redux-batched-actions';
import configureStore, {MockStoreEnhanced} from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as PostActions from 'mattermost-redux/actions/posts';
import * as SearchActions from 'mattermost-redux/actions/search';
import {SearchTypes} from 'mattermost-redux/action_types';
import {DispatchFunc} from 'mattermost-redux/types/actions';
import {Post} from 'mattermost-redux/types/posts';
import {UserProfile} from 'mattermost-redux/types/users';
import {IDMappedObjects} from 'mattermost-redux/types/utilities';

import {
    updateRhsState,
    selectPostFromRightHandSideSearch,
    updateSearchTerms,
    performSearch,
    showSearchResults,
    showFlaggedPosts,
    showPinnedPosts,
    showMentions,
    closeRightHandSide,
    showRHSPlugin,
    hideRHSPlugin,
    toggleRHSPlugin,
    toggleMenu,
    openMenu,
    closeMenu,
    openAtPrevious,
    updateSearchType,
} from 'actions/views/rhs';
import {trackEvent} from 'actions/telemetry_actions.jsx';
import {ActionTypes, RHSStates} from 'utils/constants';
import {getBrowserUtcOffset} from 'utils/timezone.jsx';
import {GlobalState} from 'types/store';
import {ViewsState} from 'types/store/views';

const mockStore = configureStore<GlobalState, DispatchFunc>([thunk]);

const currentChannelId = '123';
const currentTeamId = '321';
const currentUserId = 'user123';
const pluggableId = 'pluggableId';
const previousSelectedPost = {
    id: 'post123',
    channel_id: 'channel123',
    root_id: 'root123',
} as Post;

const UserSelectors = require('mattermost-redux/selectors/entities/users');
UserSelectors.getCurrentUserMentionKeys = jest.fn(() => [{key: '@here'}, {key: '@mattermost'}, {key: '@channel'}, {key: '@all'}]);

// Mock Date.now() to return a constant value.
const POST_CREATED_TIME = Date.now();
global.Date.now = jest.fn(() => POST_CREATED_TIME);

jest.mock('mattermost-redux/actions/posts', () => ({
    getPostThread: (...args: any) => ({type: 'MOCK_GET_POST_THREAD', args}),
    getProfilesAndStatusesForPosts: (...args: any) => ({type: 'MOCK_GET_PROFILES_AND_STATUSES_FOR_POSTS', args}),
}));

jest.mock('mattermost-redux/actions/search', () => ({
    searchPostsWithParams: (...args: any) => ({type: 'MOCK_SEARCH_POSTS', args}),
    searchFilesWithParams: (...args: any) => ({type: 'MOCK_SEARCH_FILES', args}),
    clearSearch: (...args: any) => ({type: 'MOCK_CLEAR_SEARCH', args}),
    getFlaggedPosts: jest.fn(),
    getPinnedPosts: jest.fn(),
}));

jest.mock('actions/telemetry_actions.jsx', () => ({
    trackEvent: jest.fn(),
}));

describe('rhs view actions', () => {
    const initialState = {
        entities: {
            general: {
                config: {
                    ExperimentalViewArchivedChannels: 'false',
                },
            },
            channels: {
                currentChannelId,
            },
            teams: {
                currentTeamId,
            },
            users: {
                currentUserId,
                profiles: {
                    user123: {
                        timezone: {
                            useAutomaticTimezone: true,
                            automaticTimezone: '',
                            manualTimezone: '',
                        },
                    } as UserProfile,
                } as IDMappedObjects<UserProfile>,
            },
            posts: {
                posts: {
                    [previousSelectedPost.id]: previousSelectedPost,
                } as IDMappedObjects<Post>,
            },
            preferences: {myPreferences: {}},
        },
        views: {
            rhs: {
                rhsState: null,
                filesSearchExtFilter: [] as string[],
            },
        },
    } as GlobalState;

    let store: MockStoreEnhanced<GlobalState, DispatchFunc>;

    beforeEach(() => {
        store = mockStore(initialState);
    });

    describe('updateRhsState', () => {
        test(`it dispatches ${ActionTypes.UPDATE_RHS_STATE} correctly`, () => {
            store.dispatch(updateRhsState(RHSStates.PIN));

            const action = {
                type: ActionTypes.UPDATE_RHS_STATE,
                state: RHSStates.PIN,
                channelId: currentChannelId,
            };

            expect(store.getActions()).toEqual([action]);
        });
    });

    describe('selectPostFromRightHandSideSearch', () => {
        const post = {
            id: 'post123',
            channel_id: 'channel123',
            root_id: 'root123',
        } as Post;

        test('it dispatches PostActions.getPostThread correctly', () => {
            store.dispatch(selectPostFromRightHandSideSearch(post));

            const compareStore = mockStore(initialState);
            compareStore.dispatch(PostActions.getPostThread(post.root_id));

            expect(store.getActions()[0]).toEqual(compareStore.getActions()[0]);
        });

        describe(`it dispatches ${ActionTypes.SELECT_POST} correctly`, () => {
            it('with mocked date', async () => {
                store = mockStore({
                    ...initialState,
                    views: {
                        rhs: {
                            rhsState: RHSStates.FLAG,
                            filesSearchExtFilter: [] as string[],
                        },
                    } as ViewsState,
                });

                await store.dispatch(selectPostFromRightHandSideSearch(post));

                const action = {
                    type: ActionTypes.SELECT_POST,
                    postId: post.root_id,
                    channelId: post.channel_id,
                    previousRhsState: RHSStates.FLAG,
                    timestamp: POST_CREATED_TIME,
                };

                expect(store.getActions()[1]).toEqual(action);
            });
        });
    });

    describe('updateSearchTerms', () => {
        test(`it dispatches ${ActionTypes.UPDATE_RHS_SEARCH_TERMS} correctly`, () => {
            const terms = '@here test terms';

            store.dispatch(updateSearchTerms(terms));

            const action = {
                type: ActionTypes.UPDATE_RHS_SEARCH_TERMS,
                terms,
            };

            expect(store.getActions()).toEqual([action]);
        });
    });

    describe('performSearch', () => {
        const terms = '@here test search';

        test('it dispatches searchPosts correctly', () => {
            store.dispatch(performSearch(terms, false));

            // timezone offset in seconds
            const timeZoneOffset = getBrowserUtcOffset() * 60;

            const compareStore = mockStore(initialState);
            compareStore.dispatch(SearchActions.searchPostsWithParams(currentTeamId, {include_deleted_channels: false, terms, is_or_search: false, time_zone_offset: timeZoneOffset, page: 0, per_page: 20}));
            compareStore.dispatch(SearchActions.searchFilesWithParams(currentTeamId, {include_deleted_channels: false, terms, is_or_search: false, time_zone_offset: timeZoneOffset, page: 0, per_page: 20}));

            expect(store.getActions()).toEqual(compareStore.getActions());

            store.dispatch(performSearch(terms, true));
            compareStore.dispatch(SearchActions.searchPostsWithParams(currentTeamId, {include_deleted_channels: false, terms, is_or_search: true, time_zone_offset: timeZoneOffset, page: 0, per_page: 20}));
            compareStore.dispatch(SearchActions.searchFilesWithParams(currentTeamId, {include_deleted_channels: false, terms, is_or_search: true, time_zone_offset: timeZoneOffset, page: 0, per_page: 20}));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });
    });

    describe('showSearchResults', () => {
        const terms = '@here test search';

        const testInitialState = {
            ...initialState,
            views: {
                rhs: {
                    searchTerms: terms,
                    filesSearchExtFilter: [] as string[],
                },
            },
        } as GlobalState;

        test('it dispatches the right actions', () => {
            store = mockStore(testInitialState);

            store.dispatch(showSearchResults());

            const compareStore = mockStore(testInitialState);
            compareStore.dispatch(updateRhsState(RHSStates.SEARCH));
            compareStore.dispatch({
                type: ActionTypes.UPDATE_RHS_SEARCH_RESULTS_TERMS,
                terms,
            });
            compareStore.dispatch(performSearch(terms));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });
    });

    describe('showFlaggedPosts', () => {
        test('it dispatches the right actions', async () => {
            (SearchActions.getFlaggedPosts as jest.Mock).mockReturnValue((dispatch: DispatchFunc) => {
                dispatch({type: 'MOCK_GET_FLAGGED_POSTS'});

                return {data: 'data'};
            });

            await store.dispatch(showFlaggedPosts());

            expect(SearchActions.getFlaggedPosts).toHaveBeenCalled();

            expect(store.getActions()).toEqual([
                {
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: RHSStates.FLAG,
                },
                {
                    type: 'MOCK_GET_FLAGGED_POSTS',
                },
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: SearchTypes.RECEIVED_SEARCH_POSTS,
                            data: 'data',
                        },
                        {
                            type: SearchTypes.RECEIVED_SEARCH_TERM,
                            data: {
                                teamId: currentTeamId,
                                terms: null,
                                isOrSearch: false,
                            },
                        },
                    ],
                },
            ]);
        });
    });

    describe('showPinnedPosts', () => {
        test('it dispatches the right actions for the current channel', async () => {
            (SearchActions.getPinnedPosts as jest.Mock).mockReturnValue((dispatch: DispatchFunc) => {
                dispatch({type: 'MOCK_GET_PINNED_POSTS'});

                return {data: 'data'};
            });

            await store.dispatch(showPinnedPosts());

            expect(SearchActions.getPinnedPosts).toHaveBeenCalledWith(currentChannelId);

            expect(store.getActions()).toEqual([
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: ActionTypes.UPDATE_RHS_STATE,
                            channelId: currentChannelId,
                            state: RHSStates.PIN,
                        },
                    ],
                },
                {
                    type: 'MOCK_GET_PINNED_POSTS',
                },
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: SearchTypes.RECEIVED_SEARCH_POSTS,
                            data: 'data',
                        },
                        {
                            type: SearchTypes.RECEIVED_SEARCH_TERM,
                            data: {
                                teamId: currentTeamId,
                                terms: null,
                                isOrSearch: false,
                            },
                        },
                    ],
                },
            ]);
        });

        test('it dispatches the right actions for a specific channel', async () => {
            const channelId = 'channel1';

            (SearchActions.getPinnedPosts as jest.Mock).mockReturnValue((dispatch: DispatchFunc) => {
                dispatch({type: 'MOCK_GET_PINNED_POSTS'});

                return {data: 'data'};
            });

            await store.dispatch(showPinnedPosts(channelId));

            expect(SearchActions.getPinnedPosts).toHaveBeenCalledWith(channelId);

            expect(store.getActions()).toEqual([
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: ActionTypes.UPDATE_RHS_STATE,
                            channelId,
                            state: RHSStates.PIN,
                        },
                    ],
                },
                {
                    type: 'MOCK_GET_PINNED_POSTS',
                },
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: SearchTypes.RECEIVED_SEARCH_POSTS,
                            data: 'data',
                        },
                        {
                            type: SearchTypes.RECEIVED_SEARCH_TERM,
                            data: {
                                teamId: currentTeamId,
                                terms: null,
                                isOrSearch: false,
                            },
                        },
                    ],
                },
            ]);
        });
    });

    describe('showMentions', () => {
        test('it dispatches the right actions', () => {
            store.dispatch(showMentions());

            const compareStore = mockStore(initialState);

            compareStore.dispatch(performSearch('@mattermost ', true));
            compareStore.dispatch(batchActions([
                {
                    type: ActionTypes.UPDATE_RHS_SEARCH_TERMS,
                    terms: '@mattermost ',
                },
                {
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: RHSStates.MENTION,
                },
            ]));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });

        test('it calls trackEvent correctly', () => {
            (trackEvent as jest.Mock).mockClear();

            store.dispatch(showMentions());

            expect(trackEvent).toHaveBeenCalledTimes(1);

            expect((trackEvent as jest.Mock).mock.calls[0][0]).toEqual('api');
            expect((trackEvent as jest.Mock).mock.calls[0][1]).toEqual('api_posts_search_mention');
        });
    });

    describe('closeRightHandSide', () => {
        test('it dispatches the right actions', () => {
            store.dispatch(closeRightHandSide());

            const compareStore = mockStore(initialState);
            compareStore.dispatch(batchActions([
                {
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: null,
                },
                {
                    type: ActionTypes.SELECT_POST,
                    postId: '',
                    channelId: '',
                    timestamp: 0,
                },
            ]));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });
    });

    it('toggleMenu dispatches the right action', () => {
        store.dispatch(toggleMenu());

        const compareStore = mockStore(initialState);
        compareStore.dispatch({
            type: ActionTypes.TOGGLE_RHS_MENU,
        });

        expect(store.getActions()).toEqual(compareStore.getActions());
    });

    it('openMenu dispatches the right action', () => {
        store.dispatch(openMenu());

        const compareStore = mockStore(initialState);
        compareStore.dispatch({
            type: ActionTypes.OPEN_RHS_MENU,
        });

        expect(store.getActions()).toEqual(compareStore.getActions());
    });

    it('closeMenu dispatches the right action', () => {
        store.dispatch(closeMenu());

        const compareStore = mockStore(initialState);
        compareStore.dispatch({
            type: ActionTypes.CLOSE_RHS_MENU,
        });

        expect(store.getActions()).toEqual(compareStore.getActions());
    });

    describe('Plugin actions', () => {
        const stateWithPluginRhs = {
            ...initialState,
            views: {
                rhs: {
                    rhsState: RHSStates.PLUGIN,
                    pluggableId,
                    filesSearchExtFilter: [] as string[],
                },
            },
        } as GlobalState;

        const stateWithoutPluginRhs = {
            ...initialState,
            views: {
                rhs: {
                    rhsState: RHSStates.PIN,
                    filesSearchExtFilter: [] as string[],
                },
            },
        } as GlobalState;

        describe('showRHSPlugin', () => {
            it('dispatches the right action', () => {
                store.dispatch(showRHSPlugin(pluggableId));

                const compareStore = mockStore(initialState);
                compareStore.dispatch({
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: RHSStates.PLUGIN,
                    pluggableId,
                });

                expect(store.getActions()).toEqual(compareStore.getActions());
            });
        });

        describe('hideRHSPlugin', () => {
            it('it dispatches the right action when plugin rhs is opened', () => {
                store = mockStore(stateWithPluginRhs);

                store.dispatch(hideRHSPlugin(pluggableId));

                const compareStore = mockStore(stateWithPluginRhs);
                compareStore.dispatch(closeRightHandSide());

                expect(store.getActions()).toEqual(compareStore.getActions());
            });

            it('it doesn\'t dispatch the action when plugin rhs is closed', () => {
                store = mockStore(stateWithoutPluginRhs);

                store.dispatch(hideRHSPlugin(pluggableId));

                const compareStore = mockStore(initialState);

                expect(store.getActions()).toEqual(compareStore.getActions());
            });

            it('it doesn\'t dispatch the action when other plugin rhs is opened', () => {
                store = mockStore(stateWithPluginRhs);

                store.dispatch(hideRHSPlugin('pluggableId2'));

                const compareStore = mockStore(initialState);

                expect(store.getActions()).toEqual(compareStore.getActions());
            });
        });

        describe('toggleRHSPlugin', () => {
            it('it dispatches hide action when rhs is open', () => {
                store = mockStore(stateWithPluginRhs);

                store.dispatch(toggleRHSPlugin(pluggableId));

                const compareStore = mockStore(initialState);
                compareStore.dispatch(closeRightHandSide());

                expect(store.getActions()).toEqual(compareStore.getActions());
            });

            it('it dispatches hide action when rhs is closed', () => {
                store = mockStore(stateWithoutPluginRhs);

                store.dispatch(toggleRHSPlugin(pluggableId));

                const compareStore = mockStore(initialState);
                compareStore.dispatch(showRHSPlugin(pluggableId));

                expect(store.getActions()).toEqual(compareStore.getActions());
            });
        });
    });

    describe('openAtPrevious', () => {
        const batchingReducerBatch = {
            type: 'BATCHING_REDUCER.BATCH',
            meta: {
                batch: true,
            },
            payload: [
                {
                    type: SearchTypes.RECEIVED_SEARCH_POSTS,
                    data: 'data',
                },
                {
                    type: SearchTypes.RECEIVED_SEARCH_TERM,
                    data: {
                        teamId: currentTeamId,
                        terms: null,
                        isOrSearch: false,
                    },
                },
            ],
        };

        function actionsForEmptySearch() {
            const compareStore = mockStore(initialState);

            compareStore.dispatch(SearchActions.clearSearch());
            compareStore.dispatch(updateSearchTerms(''));
            compareStore.dispatch({
                type: ActionTypes.UPDATE_RHS_SEARCH_RESULTS_TERMS,
                terms: '',
            });
            compareStore.dispatch(updateRhsState(RHSStates.SEARCH));

            return compareStore.getActions();
        }

        it('opens to empty search when not previously opened', () => {
            store.dispatch(openAtPrevious(null));

            expect(store.getActions()).toEqual(actionsForEmptySearch());
        });

        it('opens a mention search', () => {
            store.dispatch(openAtPrevious({isMentionSearch: true}));
            const compareStore = mockStore(initialState);

            compareStore.dispatch(performSearch('@mattermost ', true));
            compareStore.dispatch(batchActions([
                {
                    type: ActionTypes.UPDATE_RHS_SEARCH_TERMS,
                    terms: '@mattermost ',
                },
                {
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: RHSStates.MENTION,
                },
            ]));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });

        it('opens pinned posts', async () => {
            (SearchActions.getPinnedPosts as jest.Mock).mockReturnValue((dispatch: DispatchFunc) => {
                dispatch({type: 'MOCK_GET_PINNED_POSTS'});
                return {data: 'data'};
            });

            await store.dispatch(openAtPrevious({isPinnedPosts: true}));

            expect(SearchActions.getPinnedPosts).toHaveBeenCalledWith(currentChannelId);

            expect(store.getActions()).toEqual([
                {
                    type: 'BATCHING_REDUCER.BATCH',
                    meta: {
                        batch: true,
                    },
                    payload: [
                        {
                            type: ActionTypes.UPDATE_RHS_STATE,
                            channelId: currentChannelId,
                            state: RHSStates.PIN,
                        },
                    ],
                },
                {
                    type: 'MOCK_GET_PINNED_POSTS',
                },
                batchingReducerBatch,
            ]);
        });

        it('opens flagged posts', async () => {
            (SearchActions.getFlaggedPosts as jest.Mock).mockReturnValue((dispatch: DispatchFunc) => {
                dispatch({type: 'MOCK_GET_FLAGGED_POSTS'});

                return {data: 'data'};
            });

            await store.dispatch(openAtPrevious({isFlaggedPosts: true}));

            expect(SearchActions.getFlaggedPosts).toHaveBeenCalled();

            expect(store.getActions()).toEqual([
                {
                    type: ActionTypes.UPDATE_RHS_STATE,
                    state: RHSStates.FLAG,
                },
                {
                    type: 'MOCK_GET_FLAGGED_POSTS',
                },
                batchingReducerBatch,
            ]);
        });

        it('opens selected post', async () => {
            const previousState = 'flag';
            await store.dispatch(openAtPrevious({selectedPostId: previousSelectedPost.id, previousRhsState: previousState}));

            const compareStore = mockStore(initialState);
            compareStore.dispatch(PostActions.getPostThread(previousSelectedPost.root_id));
            compareStore.dispatch({
                type: ActionTypes.SELECT_POST,
                postId: previousSelectedPost.root_id,
                channelId: previousSelectedPost.channel_id,
                previousRhsState: previousState,
                timestamp: POST_CREATED_TIME,
            });

            expect(store.getActions()).toEqual(compareStore.getActions());
        });

        it('opens empty search when selected post does not exist', async () => {
            await store.dispatch(openAtPrevious({selectedPostId: 'postxyz'}));

            expect(store.getActions()).toEqual(actionsForEmptySearch());
        });

        it('opens selected post card', async () => {
            const previousState = 'flag';
            await store.dispatch(openAtPrevious({selectedPostCardId: previousSelectedPost.id, previousRhsState: previousState}));

            const compareStore = mockStore(initialState);
            compareStore.dispatch({
                type: ActionTypes.SELECT_POST_CARD,
                postId: previousSelectedPost.id,
                channelId: previousSelectedPost.channel_id,
                previousRhsState: previousState,
            });

            expect(store.getActions()).toEqual(compareStore.getActions());
        });

        it('opens empty search when selected post card does not exist', async () => {
            await store.dispatch(openAtPrevious({selectedPostCardId: 'postxyz'}));

            expect(store.getActions()).toEqual(actionsForEmptySearch());
        });

        it('opens search results', async () => {
            const terms = '@here test search';

            const searchInitialState = {
                ...initialState,
                views: {
                    rhs: {
                        searchTerms: terms,
                        filesSearchExtFilter: [] as string[],
                    },
                },
            } as GlobalState;

            store = mockStore(searchInitialState);
            await store.dispatch(openAtPrevious({searchVisible: true}));

            const compareStore = mockStore(searchInitialState);
            compareStore.dispatch(updateRhsState(RHSStates.SEARCH));
            compareStore.dispatch({
                type: ActionTypes.UPDATE_RHS_SEARCH_RESULTS_TERMS,
                terms,
            });
            compareStore.dispatch(performSearch(terms));

            expect(store.getActions()).toEqual(compareStore.getActions());
        });

        it('opens empty search when no other options set', () => {
            store.dispatch(openAtPrevious({}));

            expect(store.getActions()).toEqual(actionsForEmptySearch());
        });
    });

    describe('searchType', () => {
        test('updateSearchType', () => {
            const store = mockStore(initialState);
            store.dispatch(updateSearchType('files'));
            expect(store.getActions()).toEqual([{
                type: ActionTypes.UPDATE_RHS_SEARCH_TYPE,
                searchType: 'files',
            }]);
        });
    });
});
