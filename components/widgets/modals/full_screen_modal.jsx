// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import CloseIcon from 'components/svg/close_icon';

export default class FullScreenModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        children: PropTypes.node.isRequired,
        onClose: PropTypes.func.isRequired,
    }

    close = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div className={'FullScreenModal' + (this.props.show ? ' show' : '')}>
                <CloseIcon
                    className='close-x'
                    onClick={this.close}
                />
                {this.props.children}
            </div>
        );
    }
}
