// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import {isEmail} from 'mattermost-redux/utils/helpers';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import InviteIcon from 'components/svg/invite_icon';
import UsersEmailsInput from 'components/widgets/inputs/users_emails_input.jsx';

import BackIcon from 'components/svg/back_icon';

import {getSiteURL} from 'utils/url.jsx';
import debouncePromise from 'utils/debounce_promise.jsx';

export default class InvitationModalMembersStep extends React.Component {
    static propTypes = {
        inviteId: PropTypes.string.isRequired,
        goBack: PropTypes.func.isRequired,
        searchProfiles: PropTypes.func.isRequired,
        currentTeamId: PropTypes.string.isRequired,
        onEdit: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            usersAndEmails: [],
        };
    }

    usersLoader = async (term) => {
        if (isEmail(term)) {
            return [];
        }
        const {data} = await this.props.searchProfiles(term, this.props.currentTeamId);
        return data;
    }
    debouncedUsersLoader = debouncePromise(this.usersLoader, 150);

    onChange = (usersAndEmails) => {
        this.setState({usersAndEmails});
        this.props.onEdit();
    }

    render() {
        const inviteUrl = getSiteURL() + '/signup_user_complete/?id=' + this.props.inviteId;
        return (
            <div className='InvitationModalMembersStep'>
                <BackIcon
                    className='back'
                    onClick={this.props.goBack}
                />
                <div className='modal-icon'>
                    <InviteIcon/>
                </div>
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
                                <UsersEmailsInput
                                    usersLoader={this.debouncedUsersLoader}
                                    placeholder={placeholder}
                                    onChange={this.onChange}
                                    value={this.state.usersAndEmails}
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
                <div className='invite-members'>
                    <button className='btn btn-primary'>
                        <FormattedMessage
                            id='invitation_modal.members.invite_button'
                            defaultMessage='Invite Members'
                        />
                    </button>
                </div>
            </div>
        );
    }
}
