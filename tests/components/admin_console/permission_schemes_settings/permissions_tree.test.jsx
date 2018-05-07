// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import PermissionsTree from 'components/admin_console/permission_schemes_settings/permissions_tree.jsx';
import PermissionGroup from 'components/admin_console/permission_schemes_settings/permission_group.jsx';

describe('components/admin_console/permission_schemes_settings/permission_tree', () => {
    const defaultProps = {
        scope: 'channel_scope',
        role: {
            name: 'test',
            permissions: [],
        },
        onToggle: jest.fn(),
        selectRow: jest.fn(),
        parentRole: null,
        readOnly: false,
    };

    test('should match snapshot on default data', () => {
        const wrapper = shallow(
            <PermissionsTree {...defaultProps}/>
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot on read only', () => {
        const wrapper = shallow(
            <PermissionsTree
                {...defaultProps}
                readOnly={true}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot on team scope', () => {
        const wrapper = shallow(
            <PermissionsTree
                {...defaultProps}
                scope={'team_scope'}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot on system scope', () => {
        const wrapper = shallow(
            <PermissionsTree
                {...defaultProps}
                scope={'system_scope'}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot with parentRole with permissions', () => {
        const wrapper = shallow(
            <PermissionsTree
                {...defaultProps}
                parentRole={{permissions: 'invite_user'}}
                scope={'system_scope'}
            />
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should ask to toggle on row toggle', () => {
        const onToggle = jest.fn();
        const wrapper = shallow(
            <PermissionsTree
                {...defaultProps}
                onToggle={onToggle}
            />
        );
        wrapper.find(PermissionGroup).first().prop('onChange')(['test_permission', 'test_permission2']);
        expect(onToggle).toBeCalledWith('test', ['test_permission', 'test_permission2']);
    });
});
