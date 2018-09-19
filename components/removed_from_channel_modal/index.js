// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';
import {getCurrentTeam} from 'mattermost-redux/selectors/entities/teams';

import {getItem} from 'utils/utils.jsx';
import {removeItem} from 'actions/storage';

import RemovedFromChannelModal from './removed_from_channel_modal.jsx';

function mapStateToProps(state) {
    const currentUser = getCurrentUser(state);
    const currentTeam = getCurrentTeam(state);
    const channelRemovedState = getItem('channel-removed-state');

    return {
        currentUser,
        currentTeam,
        channelRemovedState,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            removeItem,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RemovedFromChannelModal);
