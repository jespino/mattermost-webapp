// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

export default class PluginErrorBoundary extends React.Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError() {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        // You can also log the error to an error reporting service
        console.debug(error, info);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <span className='plugin-error'>
                    <FormattedMessage
                        id='plugin-error'
                        defaultMessage='Plugin error'
                    />
                </span>
            );
        }

        return this.props.children;
    }
}
