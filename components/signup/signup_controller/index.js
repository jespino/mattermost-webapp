// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getConfig, getLicense} from 'mattermost-redux/selectors/entities/general';
import {getCurrentUser} from 'mattermost-redux/selectors/entities/users';

import {getGlobalItem} from 'selectors/storage';
import {removeGlobalItem} from 'actions/storage';

import SignupController from './signup_controller.jsx';

function mapStateToProps(state) {
    const license = getLicense(state);
    const config = getConfig(state);
    const currentUser = getCurrentUser(state);

    const isLicensed = license && license.IsLicensed === 'true';
    const enableOpenServer = config.EnableOpenServer === 'true';
    const noAccounts = config.NoAccounts === 'true';
    const enableSignUpWithEmail = config.EnableSignUpWithEmail === 'true';
    const enableSignUpWithGitLab = config.EnableSignUpWithGitLab === 'true';
    const enableSignUpWithGoogle = config.EnableSignUpWithGoogle === 'true';
    const enableSignUpWithOffice365 = config.EnableSignUpWithOffice365 === 'true';
    const enableLDAP = config.EnableLdap === 'true';
    const enableSAML = config.EnableSaml === 'true';
    const samlLoginButtonText = config.SamlLoginButtonText;
    const siteName = config.SiteName;

    const params = new URLSearchParams(this.props.location.search || '');
    const token = params.get('t') || '';
    const inviteId = params.get('id') || '';

    let usedBefore = false;
    if (!inviteId && token && !currentUser) {
        usedBefore = getGlobalItem(state, token);
    }

    return {
        isLicensed,
        enableOpenServer,
        noAccounts,
        enableSignUpWithEmail,
        enableSignUpWithGitLab,
        enableSignUpWithGoogle,
        enableSignUpWithOffice365,
        enableLDAP,
        enableSAML,
        samlLoginButtonText,
        siteName,
        currentUser,
        token,
        inviteId,
        usedBefore,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            removeGlobalItem,
        }, dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupController);
