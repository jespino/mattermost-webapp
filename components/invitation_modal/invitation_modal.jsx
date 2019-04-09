// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import FullScreenModal from 'components/widgets/modals/full_screen_modal';
import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import InviteIcon from 'components/svg/invite_icon';

import {getSiteURL} from 'utils/url.jsx';

const STEPS_INITIAL = 'initial';
const STEPS_INVITE_MEMBERS = 'members';
const STEPS_INVITE_GUESTS = 'guests';

export default class InvitationModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        currentTeam: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            closeModal: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            step: STEPS_INITIAL,
        };
    }

    goToMembers = () => {
        this.setState({step: STEPS_INVITE_MEMBERS});
    }

    goToGuests = () => {
        this.setState({step: STEPS_INVITE_GUESTS});
    }

    close = () => {
        this.props.actions.closeModal();
    }

    renderInitialStep() {
        return (
            <div className='InvitationModal'>
                <InviteIcon/>
                <h1>
                    <FormattedMarkdownMessage
                        id='invitation_modal.title'
                        defaultMessage='Invite people to **{teamName}**'
                        values={{
                            teamName: this.props.currentTeam.display_name,
                        }}
                    />
                </h1>
                <div
                    className='invitation-modal-option'
                    onClick={this.goToMembers}
                >
                    <div>
                        <h2>
                            <FormattedMarkdownMessage
                                id='invitation_modal.invite_members.title'
                                defaultMessage='Invite **Members**'
                            />
                        </h2>
                        <FormattedMessage
                            id='invitation_modal.invite_members.description'
                            defaultMessage='Invite new team members with a link or by email. Team members have access to messages and files in open teams and public channels.'
                        />
                    </div>
                    <span className='fa fa-angle-right arrow'/>
                </div>
                <div
                    className='invitation-modal-option'
                    onClick={this.goToGuests}
                >
                    <div>
                        <h2>
                            <FormattedMarkdownMessage
                                id='invitation_modal.invite_guests.title'
                                defaultMessage='Invite **Guests**'
                            />
                        </h2>
                        <FormattedMessage
                            id='invitation_modal.invite_guests.description'
                            defaultMessage='Invite guests to one or more channels. Guests only have access to messages, files, and people in the channels they are members of.'
                        />
                    </div>
                    <span className='fa fa-angle-right arrow'/>
                </div>
            </div>
        );
    }

    renderInviteMembersStep = () => {
        const inviteUrl = getSiteURL() + '/signup_user_complete/?id=' + this.props.currentTeam.invite_id;
        return (
            <div className='InvitationModal'>
                <InviteIcon/>
                <h1>
                    <FormattedMarkdownMessage
                        id='invitation_modal.members.title'
                        defaultMessage='Invite **Members**'
                    />
                </h1>
                <div className='share-link'>
                    <h2>
                        <FormattedMarkdownMessage
                            id='invitation_modal.members.share_link.title'
                            defaultMessage='Share This Link'
                        />
                    </h2>
                    <div className='share-link-input-block'>
                        <input
                            className='share-link-input'
                            type='text'
                            disabled='distabled'
                            value={inviteUrl}
                        />
                        <button className='share-link-input-button'>
                            <span className='fa fa-link'/>
                            <FormattedMarkdownMessage
                                id='invitation_modal.members.share_link.copy_button'
                                defaultMessage='Copy Link'
                            />
                        </button>
                    </div>
                    <div className='help-text'>
                        <FormattedMarkdownMessage
                            id='invitation_modal.members.share_link.description'
                            defaultMessage='Share this link to grant member access to this team.'
                        />
                    </div>
                </div>
                <div className='invitation-modal-or'>
                    <hr/>
                    <div>
                        <FormattedMarkdownMessage
                            id='invitation_modal.members.or'
                            defaultMessage='OR'
                        />
                    </div>
                </div>
                <div className='search-and-add'>
                    <h2>
                        <FormattedMarkdownMessage
                            id='invitation_modal.members.search_and_add.title'
                            defaultMessage='Search and Add People'
                        />
                    </h2>
                    <div>
                        <FormattedMessage
                            id='invitation_modal.members.search-and-add.placeholder'
                            defaultMessage='Add members or email addresses'
                        >
                            {(placeholder) => (
                                <input
                                    className='search-and-add-input'
                                    type='text'
                                    placeholder={placeholder}
                                />
                            )}
                        </FormattedMessage>
                    </div>
                    <div className='help-text'>
                        <FormattedMarkdownMessage
                            id='invitation_modal.members.search-and-add.description'
                            defaultMessage='Search and add existing users or email an invitation to new users.'
                        />
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <FullScreenModal
                show={this.props.show}
                onClose={this.close}
            >
                {this.state.step === STEPS_INITIAL && this.renderInitialStep()}
                {this.state.step === STEPS_INVITE_MEMBERS && this.renderInviteMembersStep()}
                {this.state.step === STEPS_INVITE_GUESTS && 'Invite guests'}
            </FullScreenModal>
        );
    }
}
