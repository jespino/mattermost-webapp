// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';
import {getMyChannels} from 'mattermost-redux/selectors/entities/channels';
import {haveIChannelPermission} from 'mattermost-redux/selectors/entities/roles';
import {sendEmailInviteGuestsToChannels} from 'mattermost-redux/actions/teams';
import {Permissions} from 'mattermost-redux/constants';

import {closeModal} from 'actions/views/modals';
import {isModalOpen} from 'selectors/views/modals';
import {ModalIdentifiers, Constants} from 'utils/constants';

import InvitationModal from './invitation_modal.jsx';

function mapStateToProps(state) {
    const channels = getMyChannels(state);
    const currentTeam = getCurrentTeam(state);
    const invitableChannels = channels.filter((channel) => {
        if (channel.type === Constants.DM_CHANNEL || channel.type === Constants.GM_CHANNEL) {
            return false;
        }
        if (channel.type === Constants.PRIVATE_CHANNEL) {
            return haveIChannelPermission(state, {channel: channel.id, team: currentTeam.id, permission: Permissions.MANAGE_PRIVATE_CHANNEL_MEMBERS});
        }
        return haveIChannelPermission(state, {channel: channel.id, team: currentTeam.id, permission: Permissions.MANAGE_PUBLIC_CHANNEL_MEMBERS});
    });
    return {
        invitableChannels,
        currentTeam,
        show: isModalOpen(state, ModalIdentifiers.INVITATION),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            closeModal: () => closeModal(ModalIdentifiers.INVITATION),
            sendGuestInvites: sendEmailInviteGuestsToChannels,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationModal);
