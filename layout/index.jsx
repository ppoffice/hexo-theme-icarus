const { Component, Fragment } = require('inferno');
const Article = require('./common/article');
const Paginator = require('./misc/paginator');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __, url_for } = helper;

        return <Fragment>
            {page.posts.map(post => <Article config={config} page={post} helper={helper} index={true} />)}
            {page.total > 1 ? <Paginator
                current={page.current}
                total={page.total}
                baseUrl={page.base}
                path={config.pagination_dir}
                urlFor={url_for}
                prevTitle={__('common.prev')}
                nextTitle={__('common.next')} /> : null}
        </Fragment>;
    }
};
