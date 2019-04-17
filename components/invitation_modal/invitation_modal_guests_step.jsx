// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import InviteIcon from 'components/svg/invite_icon';
import CloseCircleIcon from 'components/svg/close_circle_icon';

import EmailsInput from 'components/widgets/inputs/emails_input.jsx';
import ChannelsInput from 'components/widgets/inputs/channels_input.jsx';

import BackIcon from 'components/svg/back_icon';

export default class InvitationModalGuestsStep extends React.Component {
    static propTypes = {
        goBack: PropTypes.func.isRequired,
        myInvitableChannels: PropTypes.array.isRequired,
        currentTeamId: PropTypes.string.isRequired,
        sendGuestInvites: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            customMessageOpen: false,
            customMessage: '',
            emails: [],
            channels: [],
        };
    }

    onEmailsChange = (emails) => {
        this.setState({emails});
    }

    onChannelsChange = (channels) => {
        this.setState({channels});
    }

    channelsLoader = async (value) => {
        if (!value) {
            return this.props.myInvitableChannels;
        }
        return this.props.myInvitableChannels.filter((channel) => {
            return channel.display_name.toLowerCase().indexOf(value.toLowerCase()) === 0;
        });
    }

    openCustomMessage = () => {
        this.setState({customMessageOpen: true});
    }

    closeCustomMessage = () => {
        this.setState({customMessageOpen: false});
    }

    onMessageChange = (e) => {
        this.setState({customMessage: e.target.value});
    }

    sendInvites = () => {
        this.props.sendGuestInvites(
            this.props.currentTeamId,
            this.state.channels,
            this.state.emails,
            this.state.customMessageOpen ? this.state.customMessage : '',
        );
    }

    render() {
        return (
            <div className='InvitationModalGuestsStep'>
                <BackIcon
                    className='back'
                    onClick={this.props.goBack}
                />
                <div className='modal-icon'>
                    <InviteIcon/>
                </div>
                <h1>
                    <FormattedMarkdownMessage
                        id='invitation_modal.guests.title'
                        defaultMessage='Invite **Guests**'
                    />
                </h1>
                <div className='add-people'>
                    <h2>
                        <FormattedMarkdownMessage
                            id='invitation_modal.guests.add_people.title'
                            defaultMessage='Add People'
                        />
                    </h2>
                    <div>
                        <FormattedMessage
                            id='invitation_modal.guests.add_people.placeholder'
                            defaultMessage='Add email address'
                        >
                            {(placeholder) => (
                                <EmailsInput
                                    placeholder={placeholder}
                                    onChange={this.onEmailsChange}
                                />
                            )}
                        </FormattedMessage>
                    </div>
                    <div className='help-text'>
                        <FormattedMarkdownMessage
                            id='invitation_modal.guests.add_people.description'
                            defaultMessage='Email an invitation to new users.'
                        />
                    </div>
                </div>
                <div className='add-channels'>
                    <h2>
                        <FormattedMarkdownMessage
                            id='invitation_modal.guests.add_channels.title'
                            defaultMessage='Search and Add Channels'
                        />
                    </h2>
                    <div>
                        <FormattedMessage
                            id='invitation_modal.guests.add_channels.placeholder'
                            defaultMessage='Search and add Channels'
                        >
                            {(placeholder) => (
                                <ChannelsInput
                                    placeholder={placeholder}
                                    channelsLoader={this.channelsLoader}
                                    onChange={this.onChannelsChange}
                                />
                            )}
                        </FormattedMessage>
                    </div>
                    <div className='help-text'>
                        <FormattedMarkdownMessage
                            id='invitation_modal.guests.add-channels.description'
                            defaultMessage='Specify the channels the guests have access to.'
                        />
                    </div>
                </div>
                <div className='custom-message'>
                    {!this.state.customMessageOpen &&
                        <a onClick={this.openCustomMessage}>
                            <FormattedMarkdownMessage
                                id='invitation_modal.guests.custom-message.link'
                                defaultMessage='Set a custom message'
                            />
                        </a>
                    }
                    {this.state.customMessageOpen &&
                        <React.Fragment>
                            <div>
                                <FormattedMarkdownMessage
                                    id='invitation_modal.guests.custom-message.title'
                                    defaultMessage='Custom message'
                                />
                                <CloseCircleIcon onClick={this.closeCustomMessage}/>
                            </div>
                            <textarea
                                onChange={this.onMessageChange}
                                value={this.state.customMessage}
                            />
                        </React.Fragment>
                    }
                    <div className='help-text'>
                        <FormattedMarkdownMessage
                            id='invitation_modal.guests.custom-message.description'
                            defaultMessage='Create a custom message to make your invite more personal.'
                        />
                    </div>
                </div>
                <div className='invite-guests'>
                    <button
                        className='btn btn-primary'
                        disabled={this.state.channels.length === 0 || this.state.emails.length === 0}
                        onClick={this.sendInvites}
                    >
                        <FormattedMessage
                            id='invitation_modal.guests.invite_button'
                            defaultMessage='Invite Guests'
                        />
                    </button>
                </div>
            </div>
        );
    }
}
