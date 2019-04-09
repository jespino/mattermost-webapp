// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import FullScreenModal from 'components/widgets/modals/full_screen_modal';

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

    goToInitialStep = () => {
        this.setState({step: STEPS_INITIAL});
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

    render() {
        return (
            <FullScreenModal
                show={Boolean(this.props.show)}
                onClose={this.close}
            >
                <div className='InvitationModal'>
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
                        />
                    }
                    {this.state.step === STEPS_INVITE_GUESTS &&
                        <InvitationModalGuestsStep
                            goBack={this.goToInitialStep}
                        />
                    }
                </div>
            </FullScreenModal>
        );
    }
}
