// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import {Permissions} from 'utils/constants.jsx';

import PermissionCheckbox from './permission_checkbox.jsx';
import PermissionRow from './permission_row.jsx';

export default class PermissionGroup extends React.Component {
    static propTypes = {
        code: PropTypes.string.isRequired,
        permissions: PropTypes.array.isRequired,
        readOnly: PropTypes.bool,
        role: PropTypes.object,
        parentRole: PropTypes.object,
        scope: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
        };
    }

    toggleExpanded = (e) => {
        e.stopPropagation();
        this.setState({expanded: !this.state.expanded});
    }

    toggleSelectRow = (code) => {
        if (this.props.readOnly) {
            return;
        }
        this.props.onChange([code]);
    }

    toggleSelectGroup = () => {
        if (this.props.readOnly) {
            return;
        }
        if (this.getStatus() === 'checked' || this.getStatus() === '') {
            this.props.onChange(this.props.permissions.filter((p) => !this.fromParent(p)));
        } else {
            const permissionsToToggle = [];
            for (const permission of this.props.permissions) {
                if (this.props.role.permissions.indexOf(permission) === -1 && !this.fromParent(permission)) {
                    permissionsToToggle.push(permission);
                }
            }
            this.props.onChange(permissionsToToggle);
        }
    }

    isInScope = (permission) => {
        if (this.props.scope === 'channel_scope' && permission.scope !== 'channel_scope') {
            return false;
        }
        if (this.props.scope === 'team_scope' && permission.scope === 'system_scope') {
            return false;
        }
        return true;
    }

    renderPermission = (permission) => {
        const p = Permissions[permission];
        if (!this.isInScope(p)) {
            return null;
        }
        const comesFromParent = this.fromParent(p.code);
        const active = comesFromParent || this.props.role.permissions.indexOf(p.code) !== -1;
        return (
            <PermissionRow
                key={p.code}
                code={p.code}
                readOnly={this.props.readOnly || comesFromParent}
                inherited={comesFromParent ? this.props.parentRole : null}
                value={active ? 'checked' : ''}
                onChange={this.toggleSelectRow}
            />
        );
    }

    fromParent = (code) => {
        return this.props.parentRole && this.props.parentRole.permissions.indexOf(code) !== -1;
    }

    getStatus = () => {
        let anyChecked = false;
        let anyUnchecked = false;
        for (const permission of this.props.permissions) {
            const p = Permissions[permission];
            if (!this.isInScope(p)) {
                continue;
            }
            anyChecked = anyChecked || this.fromParent(p.code) || this.props.role.permissions.indexOf(p.code) !== -1;
            anyUnchecked = anyUnchecked || (!this.fromParent(p.code) && this.props.role.permissions.indexOf(p.code) === -1);
        }
        if (anyChecked && anyUnchecked) {
            return 'intermediate';
        }
        if (anyChecked && !anyUnchecked) {
            return 'checked';
        }
        return '';
    }

    hasPermissionsOnScope = () => {
        for (const permission of this.props.permissions) {
            const p = Permissions[permission];
            if (this.isInScope(p)) {
                return true;
            }
        }
        return false;
    }

    allPermissionsFromParent = () => {
        for (const permission of this.props.permissions) {
            const p = Permissions[permission];
            if (this.isInScope(p) && !this.fromParent(p.code)) {
                return false;
            }
        }
        return true;
    }

    render = () => {
        const {code, permissions, readOnly} = this.props;
        if (!this.hasPermissionsOnScope()) {
            return null;
        }
        return (
            <div className='permission-group'>
                <div
                    className={'permission-group-row ' + (readOnly || this.allPermissionsFromParent() ? 'read-only' : '')}
                    onClick={this.toggleSelectGroup}
                >
                    <div
                        className={'fa fa-caret-right permission-arrow ' + (this.state.expanded ? 'open' : '')}
                        onClick={this.toggleExpanded}
                    />
                    <PermissionCheckbox value={this.getStatus()}/>
                    <span className='permission-name'>
                        <FormattedMessage id={'admin.permissions.group.' + code + '.name'}/>
                    </span>
                    <span className='permission-description'>
                        <FormattedMessage id={'admin.permissions.group.' + code + '.description'}/>
                    </span>
                </div>
                <div className={'permission-group-permissions ' + (this.state.expanded ? 'open' : '')}>
                    {permissions.map(this.renderPermission)}
                </div>
            </div>
        );
    };
}
