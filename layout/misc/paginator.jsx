/**
 * Pagination links.
 *
 * Based on hexo-component-inferno's misc/paginator. The disabled "Previous" link on the first
 * page and "Next" link on the last page are kept as invisible placeholders for the layout, but
 * without an href, so they no longer point at pages that do not exist (/page/0/, /page/N+1/).
 */
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { current, total, baseUrl, path, urlFor, prevTitle, nextTitle } = this.props;

        function getPageUrl(i) {
            return urlFor(i === 1 ? baseUrl : baseUrl + path + '/' + i + '/');
        }

        function pagination(c, m) {
            const delta = 1;
            const left = c - delta;
            const right = c + delta + 1;
            const range = [];
            const elements = [];
            let l;

            for (let i = 1; i <= m; i++) {
                if (i === 1 || i === m || (i >= left && i < right)) {
                    range.push(i);
                }
            }

            for (const i of range) {
                if (l) {
                    if (i - l === 2) {
                        elements.push(<li><a class="pagination-link" href={getPageUrl(l + 1)}>{l + 1}</a></li>);
                    } else if (i - l !== 1) {
                        elements.push(<li><span class="pagination-ellipsis" dangerouslySetInnerHTML={{ __html: '&hellip;' }}></span></li>);
                    }
                }
                elements.push(<li><a class={`pagination-link${c === i ? ' is-current' : ''}`} href={getPageUrl(i)}>{i}</a></li>);
                l = i;
            }
            return elements;
        }

        const hasPrev = current > 1;
        const hasNext = current < total;

        return <nav class="pagination" role="navigation" aria-label="pagination">
            <div class={`pagination-previous${hasPrev ? '' : ' is-invisible is-hidden-mobile'}`}>
                <a href={hasPrev ? getPageUrl(current - 1) : null}>{prevTitle}</a>
            </div>
            <div class={`pagination-next${hasNext ? '' : ' is-invisible is-hidden-mobile'}`}>
                <a href={hasNext ? getPageUrl(current + 1) : null}>{nextTitle}</a>
            </div>
            <ul class="pagination-list is-hidden-mobile">
                {pagination(current, total)}
            </ul>
        </nav>;
    }
};
