// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {closeModal} from 'actions/views/modals';
import {isModalOpen} from 'selectors/views/modals';
import Constants from 'utils/constants';

import InvitationModal from './invitation_modal.jsx';

function mapStateToProps(state) {
    return {
        show: isModalOpen(state, Constants.INVITATION_MODAL),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            closeModal: () => closeModal(Constants.INVITATION_MODAL),
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InvitationModal);
