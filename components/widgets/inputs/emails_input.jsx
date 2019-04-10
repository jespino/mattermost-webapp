// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import Creatable from 'react-select/lib/Creatable';
import {components} from 'react-select';
import {FormattedMessage} from 'react-intl';

import {isEmail} from 'mattermost-redux/utils/helpers';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import MailIcon from 'components/svg/mail_icon';
import MailPlusIcon from 'components/svg/mail_plus_icon';

export default class EmailsInput extends React.Component {
    static propTypes = {
        placeholder: PropTypes.string,
    }

    state = {
        error: false,
        inputValue: '',
        isMenuOpen: false,
    }

    onInputChange = (inputValue, action) => {
        if (action.action !== 'input-blur' && action.action !== 'menu-close') {
            this.setState({inputValue, error: false, isMenuOpen: Boolean(inputValue)});
        }
    }

    getCreateLabel = (value) => (
        <React.Fragment>
            <MailPlusIcon className='mail-plus-icon'/>
            <FormattedMarkdownMessage
                key='widgets.emails_input.valid_email'
                id='widgets.emails_input.valid_email'
                defaultMessage='Invite **{email}** as a channel guest'
                values={{email: value}}
            />
        </React.Fragment>
    );

    NoOptionsMessage = (props) => (
        <FormattedMessage
            id='widgets.emails_input.invalid_email'
            defaultMessage='Type a valid email address to invite new people'
        >
            {(message) => (
                <components.NoOptionsMessage {...props}>
                    {message}
                </components.NoOptionsMessage>
            )}
        </FormattedMessage>
    );

    MultiValueLabel = (props) => (
        <React.Fragment>
            <MailIcon className='mail-icon'/>
            <components.MultiValueLabel {...props}/>
        </React.Fragment>
    );

    components = {
        NoOptionsMessage: this.NoOptionsMessage,
        IndicatorsContainer: () => null,
        MultiValueLabel: this.MultiValueLabel,
    };

    render() {
        return (
            <Creatable
                styles={this.customStyles}
                selectOption={this.onSelect}
                isMulti={true}
                menuIsOpen={this.state.isMenuOpen}
                inputValue={this.state.inputValue}
                isClearable={false}
                isValidNewOption={isEmail}
                onInputChange={this.onInputChange}
                formatCreateLabel={this.getCreateLabel}
                className='EmailsInput'
                classNamePrefix='emails-input'
                placeholder={this.props.placeholder}
                components={this.components}
            />
        );
    }
}
