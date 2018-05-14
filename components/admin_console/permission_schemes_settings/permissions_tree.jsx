// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import PermissionGroup from './permission_group.jsx';

const GROUPS = [
    {
        id: 'teams',
        permissions: [
            {
                id: 'send_invites',
                combined: true,
                permissions: [
                    'invite_user',
                    'get_public_link',
                    'add_user_to_team',
                ],
            },
            'create_team',
        ],
    },
    {
        id: 'public_channel',
        permissions: [
            'create_public_channel',
            'manage_public_channel_properties',
            'manage_public_channel_members',
            'delete_public_channel',
        ],
    },
    {
        id: 'private_channel',
        permissions: [
            'create_private_channel',
            'manage_private_channel_properties',
            'manage_private_channel_members',
            'delete_private_channel',
        ],
    },
    {
        id: 'posts',
        permissions: [
            'edit_post',
            {
                id: 'delete_posts',
                permissions: [
                    'delete_post',
                    'delete_others_posts',
                ],
            },
            {
                id: 'reactions',
                combined: true,
                permissions: [
                    'add_reaction',
                    'remove_reaction',
                ],
            },
        ],
    },
    {
        id: 'integrations',
        permissions: [
            'manage_webhooks',
            'manage_oauth',
            'manage_slash_commands',
        ],
    },
];

export default class PermissionsTree extends React.Component {
    static propTypes = {
        scope: PropTypes.string.isRequired,
        role: PropTypes.object.isRequired,
        onToggle: PropTypes.func.isRequired,
        parentRole: PropTypes.object,
        selected: PropTypes.string,
        selectRow: PropTypes.func.isRequired,
        readOnly: PropTypes.bool,
    };

    static defaultProps = {
        role: {
            permissions: [],
        },
    };

    toggleGroup = (ids) => {
        if (this.props.readOnly) {
            return;
        }
        this.props.onToggle(this.props.role.name, ids);
    }

    render = () => {
        return (
            <div className='permissions-tree'>
                <div className='permissions-tree--header'>
                    <div className='permission-name'>{'Permission'}</div>
                    <div className='permission-description'>{'Description'}</div>
                </div>
                <div className='permissions-tree--body'>
                    <PermissionGroup
                        key='all'
                        id='all'
                        selected={this.props.selected}
                        selectRow={this.props.selectRow}
                        readOnly={this.props.readOnly}
                        permissions={GROUPS}
                        role={this.props.role}
                        parentRole={this.props.parentRole}
                        scope={this.props.scope}
                        combined={false}
                        onChange={this.toggleGroup}
                        root={true}
                    />
                </div>
            </div>
        );
    };
}
