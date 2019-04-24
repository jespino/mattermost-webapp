// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {FormattedMessage} from 'react-intl';

import FullScreenModal from 'components/widgets/modals/full_screen_modal';
import ConfirmModal from 'components/confirm_modal.jsx';

import InvitationModalInitialStep from './invitation_modal_initial_step.jsx';
import InvitationModalMembersStep from './invitation_modal_members_step.jsx';
import InvitationModalGuestsStep from './invitation_modal_guests_step.jsx';

const STEPS_INITIAL = 'initial';
const STEPS_INVITE_MEMBERS = 'members';
const STEPS_INVITE_GUESTS = 'guests';

export default class InvitationModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool,
        currentTeam: PropTypes.object.isRequired,
        invitableChannels: PropTypes.array.isRequired,
        actions: PropTypes.shape({
            closeModal: PropTypes.func.isRequired,
            sendGuestInvites: PropTypes.func.isRequired,
            searchProfiles: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            step: STEPS_INITIAL,
            confirmModal: false,
            hasChanges: false,
        };
    }

    goToInitialStep = () => {
        this.setState({step: STEPS_INITIAL, hasChanges: false});
    }

    goToMembers = () => {
        this.setState({step: STEPS_INVITE_MEMBERS, hasChanges: false});
    }

    goToGuests = () => {
        this.setState({step: STEPS_INVITE_GUESTS, hasChanges: false});
    }

    onEdit = () => {
        this.setState({hasChanges: true});
    }

    close = async () => {
        if (this.state.hasChanges) {
            this.setState({confirmModal: true});
        } else {
            this.props.actions.closeModal();
        }
    }

    confirmClose = () => {
        this.props.actions.closeModal();
        this.setState({confirmModal: false});
    }

    cancelConfirm = () => {
        this.setState({confirmModal: false});
    }

    render() {
        return (
            <FullScreenModal
                show={Boolean(this.props.show)}
                onClose={this.close}
            >
                <div className='InvitationModal'>
                    <ConfirmModal
                        show={this.state.confirmModal}
                        title={
                            <FormattedMessage
                                id='invitation-modal.discard-changes.title'
                                defaultMessage='Discard Changes'
                            />
                        }
                        message={
                            <FormattedMessage
                                id='invitation-modal.discard-changes.message'
                                defaultMessage='You have unsent invitations, are you sure you want to discard them?'
                            />
                        }
                        confirmButtonText={
                            <FormattedMessage
                                id='invitation-modal.discard-changes.button'
                                defaultMessage='Yes, Discard'
                            />
                        }
                        modalClass='invitation-modal-confirm'
                        onConfirm={this.confirmClose}
                        onCancel={this.cancelConfirm}
                    />
                    {this.state.step === STEPS_INITIAL &&
                        <InvitationModalInitialStep
                            teamName={this.props.currentTeam.display_name}
                            goToMembers={this.goToMembers}
                            goToGuests={this.goToGuests}
                        />
                    }
                    {this.state.step === STEPS_INVITE_MEMBERS &&
                        <InvitationModalMembersStep
                            inviteId={this.props.currentTeam.invite_id}
                            goBack={this.goToInitialStep}
                            currentTeamId={this.props.currentTeam.id}
                            searchProfiles={this.props.actions.searchProfiles}
                            onEdit={this.onEdit}
                        />
                    }
                    {this.state.step === STEPS_INVITE_GUESTS &&
                        <InvitationModalGuestsStep
                            goBack={this.goToInitialStep}
                            currentTeamId={this.props.currentTeam.id}
                            myInvitableChannels={this.props.invitableChannels}
                            sendGuestInvites={this.props.actions.sendGuestInvites}
                            onEdit={this.onEdit}
                        />
                    }
                </div>
            </FullScreenModal>
        );
    }
}
