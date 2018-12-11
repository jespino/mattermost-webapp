// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

export default class KeyBinding extends React.Component {
    static propTypes = {
        handler: PropTypes.func.isRequired,
        filter: PropTypes.func.isRequired,
    }

    static defaultProps = {
        filter: () => true,
    }

    shouldComponentUpdate() {
        return false;
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleKeyDown = (e) => {
        e.preventDefault();
        if (this.props.filter(e)) {
            this.props.handler(e);
        }
    }

    render() {
        return null;
    }
}
