// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import AsyncSelect from 'react-select/lib/AsyncCreatable';
import {components} from 'react-select';

import {isEmail} from 'mattermost-redux/utils/helpers';

import FormattedMarkdownMessage from 'components/formatted_markdown_message';
import MailIcon from 'components/svg/mail_icon';
import MailPlusIcon from 'components/svg/mail_plus_icon';
import {imageURLForUser} from 'utils/utils.jsx';

export default class UsersEmailsInput extends React.Component {
    static propTypes = {
        placeholder: PropTypes.string,
        usersLoader: PropTypes.func,
        onChange: PropTypes.func,
    }

    state = {
        error: false,
        inputValue: '',
        isMenuOpen: false,
    }

    getOptionValue = (user) => {
        return user.id || user.value;
    }

    usersLoader = async (term) => {
        if (isEmail(term)) {
            return [];
        }
        return this.props.usersLoader(term);
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
        const profileImg = imageURLForUser(user);
        const avatar = (
            <img
                className='avatar'
                alt={`${user.username || 'user'} profile image`}
                src={profileImg}
            />
        );

        if (options.context === 'menu') {
            if (user.value && isEmail(user.value)) {
                return this.getCreateLabel(user.value);
            }
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

    NoOptionsMessage = (props) => {
        if (this.state.inputValue) {
            return (
                <div className='users-emails-input__option'>
                    <FormattedMarkdownMessage
                        id='widgets.emails_input.no_user_found_matching'
                        defaultMessage='No one found matching **{text}**, type email to invite'
                        values={{text: this.state.inputValue}}
                    >
                        {(message) => (
                            <components.NoOptionsMessage {...props}>
                                {message}
                            </components.NoOptionsMessage>
                        )}
                    </FormattedMarkdownMessage>
                </div>
            );
        }
        return (
            <div className='users-emails-input__option'>
                <FormattedMarkdownMessage
                    id='widgets.emails_input.no_user_found_empty'
                    defaultMessage='No one found outside this team, type email to invite'
                    values={{text: this.state.inputValue}}
                >
                    {(message) => (
                        <components.NoOptionsMessage {...props}>
                            {message}
                        </components.NoOptionsMessage>
                    )}
                </FormattedMarkdownMessage>
            </div>
        );
    };

    components = {
        NoOptionsMessage: this.NoOptionsMessage,
        IndicatorsContainer: () => null,
    };

    render() {
        return (
            <AsyncSelect
                styles={this.customStyles}
                onChange={this.onChange}
                loadOptions={this.usersLoader}
                isValidNewOption={isEmail}
                menuIsOpen={true}
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
