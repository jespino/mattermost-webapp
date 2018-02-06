// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

export default class SystemPermissionGate extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.invert !== nextProps.invert ||
               this.props.hasPerm !== nextProps.hasPerm;
    }

    static defaultProps = {
        invert: false
    }

    static propTypes = {

        /**
         * Permissions enough to pass the gate (binary OR)
         */
        perms: PropTypes.arrayOf(PropTypes.string).isRequired,

        /**
         * Has permission
         */
        hasPerm: PropTypes.bool.isRequired,

        /**
         * Invert the permission (used for else)
         */
        invert: PropTypes.bool.isRequired,

        /**
         * Content protected by the permissions gate
         */
        children: PropTypes.node.isRequired
    };

    render() {
        if (this.props.hasPerm && !this.props.invert) {
            return this.props.children;
        }
        if (!this.props.hasPerm && this.props.invert) {
            return this.props.children;
        }
        return null;
    }
}
