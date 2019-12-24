const moment = require('moment');
const { Component, Fragment } = require('inferno');
const Paginator = require('./misc/paginator');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { url_for, __, has_thumbnail, get_thumbnail, date_xml, date } = helper;

        const language = page.lang || page.language || config.language;

        function renderArticleList(posts, year, month = null) {
            const time = moment([page.year, page.month ? page.month - 1 : null].filter(i => i !== null));

            return <div class="card widget">
                <div class="card-content">
                    <h3 class="tag is-link">{month === null ? year : time.locale(language).format('MMMM YYYY')}</h3>
                    <div class="timeline">
                        {posts.map(post => {
                            const categories = [];
                            post.categories.forEach((category, i) => {
                                categories.push(<a class="has-link-grey" href={category.url}>{category.name}</a>);
                                if (i < post.categories.length - 1) {
                                    categories.push('/');
                                }
                            });
                            return <article class="media">
                                {has_thumbnail(post) ? <a href={url_for(post.link || post.path)} class="media-left">
                                    <p class="image is-64x64">
                                        <img class="thumbnail" src={get_thumbnail(post)} alt={post.title || get_thumbnail(post)} />
                                    </p>
                                </a> : null}
                                <div class="media-content">
                                    <div class="content">
                                        <time class="has-text-grey is-size-7 is-block is-uppercase"
                                            dateTime={date_xml(post.date)}>{date(post.date)}</time>
                                        <a class="title has-link-black-ter is-size-6 has-text-weight-normal"
                                            href={url_for(post.link || post.path)} >{post.title}</a>
                                        <div class="level article-meta is-mobile">
                                            <div class="level-left">
                                                {categories.length ? <div class="level-item is-size-7 is-uppercase">
                                                    {categories}
                                                </div> : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>;
                        })}
                    </div>
                </div>
            </div>;
        }

        let articleList;
        if (!page.year) {
            const years = {};
            page.posts.each(p => { years[p.date.year()] = null; });
            articleList = Object.keys(years).sort((a, b) => b - a).map(year => {
                const posts = page.posts.filter(p => p.date.year() === parseInt(year, 10));
                return renderArticleList(posts, year, null);
            });
        } else {
            articleList = renderArticleList(page.posts, page.year, page.month);
        }

        return <Fragment>
            {articleList}
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
