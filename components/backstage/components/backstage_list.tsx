// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {Link} from 'react-router-dom';

import * as Utils from 'utils/utils.jsx';
import LoadingScreen from 'components/loading_screen.jsx';
import SearchIcon from 'components/widgets/icons/fa_search_icon';

type Props = {
    children: React.ReactNode | (string): any[];
    header: React.ReactNode;
    addLink?: string;
    addText?: React.ReactNode;
    addButtonId?: string;
    emptyText?: React.ReactNode;
    emptyTextSearch?: React.ReactElement;
    helpText?: React.ReactNode;
    loading: boolean;
    searchPlaceholder?: string;
};

type State = {
    filter: string;
}

export default class BackstageList extends React.Component<Props, State> {
    public static defaultProps = {
        searchPlaceholder: Utils.localizeMessage('backstage_list.search', 'Search'),
    }

    public constructor(props: Props) {
        super(props);

        this.state = {
            filter: '',
        };
    }

    private updateFilter = (e: React.ChangeEvent) => {
        this.setState({
            filter: (e.target as HTMLInputElement).value,
        });
    }

    public render() {
        const filter = this.state.filter.toLowerCase();

        let children;
        if (this.props.loading) {
            children = <LoadingScreen/>;
        } else {
            children = this.props.children;
            let hasChildren = true;
            if (typeof children === 'function') {
                [children, hasChildren] = children(filter);
            }
            children = React.Children.map(children, (child) => {
                return React.cloneElement(child, {filter});
            });
            if (children.length === 0 || !hasChildren) {
                if (!filter) {
                    if (this.props.emptyText) {
                        children = (
                            <span className='backstage-list__item backstage-list__empty'>
                                {this.props.emptyText}
                            </span>
                        );
                    }
                } else if (this.props.emptyTextSearch) {
                    children = (
                        <span
                            className='backstage-list__item backstage-list__empty'
                            id='emptySearchResultsMessage'
                        >
                            {React.cloneElement(this.props.emptyTextSearch, {values: {searchTerm: filter}})}
                        </span>
                    );
                }
            }
        }

        let addLink = null;

        if (this.props.addLink && this.props.addText) {
            addLink = (
                <Link
                    className='add-link'
                    to={this.props.addLink}
                >
                    <button
                        type='button'
                        className='btn btn-primary'
                        id={this.props.addButtonId}
                    >
                        <span>
                            {this.props.addText}
                        </span>
                    </button>
                </Link>
            );
        }

        return (
            <div className='backstage-content'>
                <div className='backstage-header'>
                    <h1>
                        {this.props.header}
                    </h1>
                    {addLink}
                </div>
                <div className='backstage-filters'>
                    <div className='backstage-filter__search'>
                        <SearchIcon/>
                        <input
                            type='search'
                            className='form-control'
                            placeholder={this.props.searchPlaceholder}
                            value={this.state.filter}
                            onChange={this.updateFilter}
                            style={style.search}
                            id='searchInput'
                        />
                    </div>
                </div>
                <span className='backstage-list__help'>
                    {this.props.helpText}
                </span>
                <div className='backstage-list'>
                    {children}
                </div>
            </div>
        );
    }
}

const style = {
    search: {flexGrow: 0, flexShrink: 0},
};
