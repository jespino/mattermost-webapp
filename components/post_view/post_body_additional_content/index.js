// Copyright (c) 2017 Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {makeGetItem} from 'selectors/storage';
import {setItem} from 'actions/storage';

import PostBodyAdditionalContent from './post_body_additional_content.jsx';

function mapStateToProps(state, ownProps) {
    return {
        ...ownProps,
        isVisible: makeGetItem(`isVisible-${ownProps.post.id}`, ownProps.previewCollapsed.startsWith('false'))(state)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({
            setStorageItem: setItem
        }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PostBodyAdditionalContent);
