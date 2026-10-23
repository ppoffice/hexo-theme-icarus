const { Component, Fragment } = require('inferno');
const Paginator = require('hexo-component-inferno/lib/view/misc/paginator');
const Article = require('./common/article');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { __, url_for } = helper;
        // Only the first cover of the page is loaded right away (page.posts is a Query or an array)
        let hasCover = false;

        return <Fragment>
            {page.posts.map(post => {
                const lazyCover = hasCover;
                hasCover = hasCover || !!post.cover;
                return <Article config={config} page={post} helper={helper} index={true} lazyCover={lazyCover} />;
            })}
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
