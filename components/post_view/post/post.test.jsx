// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {mountWithIntl} from 'tests/helpers/intl-test-helper';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import {MemoryRouter} from 'react-router';
import ReactRouterEnzymeContext from 'react-router-enzyme-context';

import Post from 'components/post_view/post/post.jsx';

describe('components/post_view/Post', () => {
    const mockStore = configureStore();
    const post = {
        channel_id: 'eotkdzb5sid9zyu7m3qtpnb8rh',
        create_at: 1502715365009,
        delete_at: 0,
        edit_at: 1502715372443,
        hashtags: '',
        id: 'e584uzbwwpny9kengqayx5ayzw',
        is_pinned: false,
        message: 'post message',
        original_id: '',
        parent_id: '',
        pending_post_id: '',
        props: {},
        root_id: '',
        type: '',
        update_at: 1502715372443,
        user_id: 'b4pfxi8sn78y8yq7phzxxfor7h',
    };

    const channel = {
        id: 'eotkdzb5sid9zyu7m3qtpnb8rh',
        create_at: 1543504009037,
        update_at: 1543504009037,
        delete_at: 0,
        team_id: '9bs9btmuktyb5y5pyhombjeqxa',
        type: 'O',
        display_name: 'nostrum',
        name: 'minus-6',
        header: 'quidem labore dolor hic aperiam. laboriosam cum quod maiores. itaque reprehenderit nostrum aut consequuntur. odit explicabo officiis!',
        purpose: 'dolores minus tempore quidem voluptatem quod quibusdam asperiores ducimus. qui id nostrum veritatis nobis. tenetur iure qui nulla. dignissimos amet voluptas soluta natus.',
        last_post_at: 1543504063007,
        total_msg_count: 138,
        extra_update_at: 0,
        creator_id: '',
        scheme_id: null,
        props: null
    }

    const currentUserId = 'ch4nyzwa9igy8pimtd54qrs9tw';
    const currentUser = {
        id: currentUserId,
        create_at: 1543504009186,
        update_at: 1543504009186,
        delete_at: 0,
        username: 'sysadmin',
        auth_data: '',
        auth_service: '',
        email: 'sysadmin@sample.mattermost.com',
        email_verified: true,
        nickname: '',
        first_name: 'Kenneth',
        last_name: 'Moreno',
        position: 'Software Test Engineer III',
        roles: 'system_admin system_user',
        notify_props: {
            channel: 'true',
            comments: 'never',
            desktop: 'mention',
            desktop_sound: 'true',
            email: 'true',
            first_name: 'false',
            mention_keys: ',@',
            push: 'mention',
            push_status: 'away',
        },
        last_password_update: 1543504009186,
        locale: 'en',
        timezone: {
            automaticTimezone: '',
            manualTimezone: '',
            useAutomaticTimezone: 'true',
        },
    };
    const team = {
        id: '9bs9btmuktyb5y5pyhombjeqxa',
        create_at: 1543504008940,
        update_at: 1543504008940,
        delete_at: 0,
        display_name: 'eligendi',
        name: 'ad-1',
        description: 'et iste illum reprehenderit aliquid in rem itaque in maxime eius.',
        email: '',
        type: 'O',
        company_name: '',
        allowed_domains: '',
        invite_id: '3hspm8d7uiyfbd786oqi6noozw',
        allow_open_invite: false,
        scheme_id: null,
    };

    const requiredProps = {
        post,
        currentUser,
        getPostList: jest.fn(),
        compactDisplay: false,
        actions: {
            selectPost: jest.fn(),
        },
    };

    const state = {
        entities: {
            general: {
                config: {
                },
            },
            channels: {
                currentChannelId: channel.id,
                channels: {
                    [channel.id]: channel,
                },
                channelsInTeam: {
                    [team.id]: [],
                },
            },
            emojis: {
                customEmoji: {},
            },
            teams: {
                currentTeamId: team.id,
                teams: {
                    [team.id]: team,
                },
            },
            posts: {
                posts: {
                    [post.id]: post,
                },
                reactions: {
                    [post.id]: {},
                },
            },
            users: {
                currentUserId,
                profiles: {
                    [currentUserId]: currentUser,
                },
            },
            preferences: {
                myPreferences: {
                    'display_settings--message_display': {
                        user_id: currentUser.id,
                        category: 'display_settings',
                        name: 'message_display',
                        value: 'clean',
                    },
                },
            },
        },
        views: {
            channel: {
                mobileView: false,
            },
            rhs: {
                isSidebarOpen: false,
                isSidebarExpanded: false,
            },
        },
        plugins: {
            components: {
                MessageWillFormat: [],
            },
            postTypes: {
            },
        },
    };
    const store = mockStore(state);


    test('should render in acceptable time', () => {
        const options = new ReactRouterEnzymeContext();
        var start = new Date();
        for (let i = 0; i < 500; i++) {
            const instance = mountWithIntl(<MemoryRouter><Provider store={store}><Post {...requiredProps} store={store}/></Provider></MemoryRouter>);
            instance.render();
        }
        var end = new Date();
        expect((end.getTime() - start.getTime())/500).toBeLessThanOrEqual(0);
    });
});
