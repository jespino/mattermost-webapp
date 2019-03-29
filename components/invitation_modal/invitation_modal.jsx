// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';

import FullScreenModal from 'components/widgets/modals/full_screen_modal';

const STEPS_INITIAL = 'initial';
const STEPS_INVITE_MEMBERS = 'members';
const STEPS_INVITE_GUESTS = 'guests';

export default class InvitationModal extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
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

    close = () => {
        this.props.actions.closeModal();
    }

    render() {
        return (
            <FullScreenModal
                show={this.props.show}
                onClose={this.close}
            >
                {this.state.step === STEPS_INITIAL && 'Initial'}
                {this.state.step === STEPS_INVITE_MEMBERS && 'Invite members'}
                {this.state.step === STEPS_INVITE_GUESTS && 'Invite guests'}
            </FullScreenModal>
        );
    }
}
