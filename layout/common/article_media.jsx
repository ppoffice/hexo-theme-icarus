/**
 * Post item of the archive timeline and the recent posts widget: the ArticleMedia of
 * hexo-component-inferno, whose thumbnails are only loaded when they are about to be scrolled to.
 */
const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { thumbnail, url, title, date, dateXml, categories } = this.props;

        const categoryTags = [];
        categories.forEach((category, i) => {
            categoryTags.push(<a href={category.url}>{category.name}</a>);
            if (i < categories.length - 1) {
                categoryTags.push(' / ');
            }
        });

        return <article class="media">
            {thumbnail ? <figure class="media-left">
                <a class="image" href={url}>
                    <img src={thumbnail} alt={title} loading="lazy" decoding="async" />
                </a>
            </figure> : null}
            <div class="media-content">
                <p class="date"><time dateTime={dateXml}>{date}</time></p>
                <p class="title"><a href={url}>{title}</a></p>
                {categoryTags.length ? <p class="categories">{categoryTags}</p> : null}
            </div>
        </article>;
    }
};
