// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {Rule} from 'turndown';

import {NEW_LINE_REPLACEMENT} from './constants';

export function githubCodeTurndownRuleBuilder(hasFirstPart: boolean, hasLastPart: boolean, text: string): Rule {
    return {
        filter: (node: Node): boolean => {
            return (node.parentNode as HTMLElement)?.id === 'turndown-root' && node.nodeName === 'TABLE' && (/\b(js|blob|diff)-./).test((node as HTMLTableElement).className);
        },
        replacement: (): string => {
            let result = '';
            if (hasFirstPart) {
                result += NEW_LINE_REPLACEMENT;
            }
            result += '```\n' + text + '\n```';
            if (hasLastPart) {
                result += NEW_LINE_REPLACEMENT;
            }
            return result;
        },
    };
}