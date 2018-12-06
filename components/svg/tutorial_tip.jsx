// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import PropTypes from 'prop-types';

import {localizeMessage} from 'utils/utils.jsx';

export default class TutorialTip extends React.PureComponent {
    static defaultProps = {
        color: '#ffffff',
    }

    static propTypes = {
        color: PropTypes.string.isRequired,
    }

    render() {
        const circleStyles = {
            opacity: 1,
            fill: 'none',
            'fill-opacity': 1,
            stroke: this.props.color,
            'stroke-width': 1,
            'stroke-linejoin': 'miter',
            'stroke-miterlimit': 4,
            'stroke-dasharray': 'none',
            'stroke-dashoffset': 0,
            'stroke-opacity': 1,
        };
        const tipStyles = {
            width: '35px',
            height: '35px',
            animation: 'pulse 0.7s linear infinite',
            cursor: 'pointer',
        };
        return (
            <span className='tip-button'>
                <svg
                    width='70'
                    height='70'
                    viewBox='0 0 18.5 18.5'
                    role='icon'
                    style={tipStyles}
                    title={localizeMessage('generic_icons.tutorial_tip', 'Tutorial Tip Icon')}
                >
                    <circle
                        style={circleStyles}
                        cx='9.260416'
                        cy='9.260416'
                        r='7.5'
                    />
                    <circle
                        style={circleStyles}
                        cx='9.260416'
                        cy='9.260416'
                        r='9'
                    />
                    <circle
                        style={circleStyles}
                        cx='9.260416'
                        cy='9.260416'
                        r='4.5'
                    />
                </svg>
            </span>
        );
    }
}
