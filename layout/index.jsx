'use strict';

const { Component, Fragment } = require('inferno');
const Article = require('./common/article');
const Paginator = require('./misc/paginator');

module.exports = class extends Component {
    render() {
        const { page } = this.props;
        // TODO
        const helper = {};
        const config = {};

        return <Fragment>
            {page.posts.each(post => <Article config={config} page={post} helper={helper} index={true} />)}
            {page.total > 1 ? <Paginator
                current={page.current}
                total={page.total}
                baseUrl={page.base}
                path={config.pagination_dir}
                urlFor={helper.url_for}
                prevTitle={helper.__('common.prev')}
                nextTitle={helper.__('common.next')} /> : null}
        </Fragment>;
    }
}