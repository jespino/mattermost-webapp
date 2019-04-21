// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import AsyncSelect from 'react-select/lib/AsyncCreatable';
import {components} from 'react-select';

import {isEmail} from 'mattermost-redux/utils/helpers';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import PublicChannelIcon from 'components/svg/globe_icon.jsx';
import MailIcon from 'components/svg/mail_icon';
import MailPlusIcon from 'components/svg/mail_plus_icon';

export default class UsersEmailsInput extends React.Component {
    static propTypes = {
        placeholder: PropTypes.string,
        usersLoader: PropTypes.func,
        onChange: PropTypes.func,
    }

    state = {
        error: false,
        inputValue: '',
    }

    getOptionValue = (user) => {
        return user.id || user.value;
    }

    formatUserName = (user) => {
        let displayName = '@' + user.username + ' - ' + user.first_name + ' ' + user.last_name;
        if (user.nickname) {
            displayName = displayName + ' (' + user.nickname + ')';
        }
        return displayName;
    }

    formatShortUserName = (user) => {
        if (user.first_name || user.last_name) {
            return user.first_name + ' ' + user.last_name;
        }
        return user.username;
    }

    formatOptionLabel = (user, options) => {
        if (options.context === 'menu') {
            if (user.value && isEmail(user.value)) {
                return this.getCreateLabel(user.value);
            }

            // TODO Use the user avatar here
            const avatar = <PublicChannelIcon className='public-channel-icon'/>;
            return (
                <React.Fragment>
                    {avatar}
                    {this.formatUserName(user)}
                </React.Fragment>
            );
        }

        if (user.value && isEmail(user.value)) {
            return (
                <React.Fragment>
                    <MailIcon className='mail-icon'/>
                    <span>{user.value}</span>
                </React.Fragment>
            );
        }

        // TODO Use the user avatar here
        const avatar = <PublicChannelIcon className='public-channel-icon'/>;
        return (
            <React.Fragment>
                {avatar}
                {this.formatShortUserName(user)}
            </React.Fragment>
        );
    }

    onChange = (value) => {
        if (this.props.onChange) {
            this.props.onChange(value.map((v) => v.id));
        }
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
        <FormattedMarkdownMessage
            id='widgets.emails_input.invalid_email'
            defaultMessage='No one found matching *{text}*, type email to invite'
            values={{text: this.state.inputValue}}
        >
            {(message) => (
                <components.NoOptionsMessage {...props}>
                    {message}
                </components.NoOptionsMessage>
            )}
        </FormattedMarkdownMessage>
    );

    MultiValueLabel = (props) => {
        return (
            <React.Fragment>
                <components.MultiValueLabel {...props}/>
            </React.Fragment>
        );
    }

    components = {
        NoOptionsMessage: this.NoOptionsMessage,
        IndicatorsContainer: () => null,
        MultiValueLabel: this.MultiValueLabel,
    };

    render() {
        return (
            <AsyncSelect
                styles={this.customStyles}
                onChange={this.onChange}
                loadOptions={this.props.usersLoader}
                isValidNewOption={isEmail}
                isMulti={true}
                isClearable={false}
                className='UsersEmailsInput'
                classNamePrefix='users-emails-input'
                placeholder={this.props.placeholder}
                components={this.components}
                onInputChange={this.onInputChange}
                getOptionValue={this.getOptionValue}
                formatOptionLabel={this.formatOptionLabel}
                defaultOptions={true}
            />
        );
    }
}
