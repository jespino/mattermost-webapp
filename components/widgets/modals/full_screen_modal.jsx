// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

export default class FullScreenModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequried,
        onClose: PropTypes.func.isRequried,
    }

    static defaultProps = {
        show: true,
    }

    close = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div
                className='FullScreenModal'
                show={this.props.show}
            >
                <i
                    className='fa fa-close close-x'
                    onClick={this.close}
                />
                {this.props.children}
            </div>
        );
    }
}
