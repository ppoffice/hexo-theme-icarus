const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { current, total, baseUrl, path, urlFor, prevTitle, nextTitle } = this.props;

        function getPageUrl(i) {
            return urlFor(i === 1 ? baseUrl : baseUrl + path + '/' + i + '/');
        }

        function pagination(c, m) {
            const current = c;
            const last = m;
            const delta = 1;
            const left = current - delta;
            const right = current + delta + 1;
            const range = [];
            const elements = [];
            let l;

            for (let i = 1; i <= last; i++) {
                if (i === 1 || i === last || (i >= left && i < right)) {
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

        return <nav class="pagination is-centered mt-4" role="navigation" aria-label="pagination">
            <div class={`pagination-previous${current > 1 ? '' : ' is-invisible is-hidden-mobile'}`}>
                <a href={getPageUrl(current - 1)}>{prevTitle}</a>
            </div>
            <div class={`pagination-next${current < total ? '' : ' is-invisible is-hidden-mobile'}`}>
                <a href={getPageUrl(current + 1)}>{nextTitle}</a>
            </div>
            <ul class="pagination-list is-hidden-mobile">
                {pagination(current, total)}
            </ul>
        </nav>;
    }
};
