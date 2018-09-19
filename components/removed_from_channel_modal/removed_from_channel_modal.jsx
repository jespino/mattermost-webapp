// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import $ from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import {FormattedMessage} from 'react-intl';

import {browserHistory} from 'utils/browser_history';
import {Constants} from 'utils/constants.jsx';

export default class RemovedFromChannelModal extends React.Component {
    static propTypes = {
        currentTeam: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        channelRemovedState: PropTypes.object,
        actions: PropTypes.shape({
            removeItem: PropTypes.func.isRequired,
        }).isRequired,
    };

    constructor(props) {
        super(props);

        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            channelName: '',
            remover: '',
        };
    }

    handleShow() {
        var newState = {};
        if (this.props.channelRemovedState) {
            newState = this.props.channelRemovedState;
            this.props.actions.removeItem('channel-removed-state');
        }

        setTimeout(
            () => {
                browserHistory.push('/' + this.props.currentTeam.name + '/channels/' + Constants.DEFAULT_CHANNEL);
            },
            1
        );

        this.setState(newState);
    }

    handleClose() {
        this.setState({channelName: '', remover: ''});
    }

    componentDidMount() {
        $(ReactDOM.findDOMNode(this)).on('show.bs.modal', this.handleShow);
        $(ReactDOM.findDOMNode(this)).on('hidden.bs.modal', this.handleClose);
    }

    componentWillUnmount() {
        $(ReactDOM.findDOMNode(this)).off('show.bs.modal', this.handleShow);
        $(ReactDOM.findDOMNode(this)).off('hidden.bs.modal', this.handleClose);
    }

    render() {
        var channelName = (
            <FormattedMessage
                id='removed_channel.channelName'
                defaultMessage='the channel'
            />
        );
        if (this.state.channelName) {
            channelName = this.state.channelName;
        }

        var remover = (
            <FormattedMessage
                id='removed_channel.someone'
                defaultMessage='Someone'
            />
        );
        if (this.state.remover) {
            remover = this.state.remover;
        }

        if (this.props.currentUser != null) {
            return (
                <div
                    className='modal fade'
                    ref='modal'
                    id='removed_from_channel'
                    tabIndex='-1'
                    role='dialog'
                    aria-hidden='true'
                >
                    <div className='modal-dialog'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <button
                                    type='button'
                                    className='close'
                                    data-dismiss='modal'
                                    aria-label='Close'
                                >
                                    <span aria-hidden='true'>
                                        {'×'}
                                    </span>
                                </button>
                                <h4 className='modal-title'>
                                    <FormattedMessage
                                        id='removed_channel.from'
                                        defaultMessage='Removed from '
                                    />
                                    <span className='name'>{channelName}</span></h4>
                            </div>
                            <div className='modal-body'>
                                <p>
                                    <FormattedMessage
                                        id='removed_channel.remover'
                                        defaultMessage='{remover} removed you from {channel}'
                                        values={{
                                            remover,
                                            channel: (channelName),
                                        }}
                                    />
                                </p>
                            </div>
                            <div className='modal-footer'>
                                <button
                                    type='button'
                                    className='btn btn-primary'
                                    data-dismiss='modal'
                                >
                                    <FormattedMessage
                                        id='removed_channel.okay'
                                        defaultMessage='Okay'
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return <div/>;
    }
}
