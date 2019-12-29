const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { thumbnail, url, title, date, dateXml, categories } = this.props;

        const categoryTags = [];
        categories.forEach((category, i) => {
            categoryTags.push(<a class="link-muted" href={category.url}>{category.name}</a>);
            if (i < categories.length - 1) {
                categoryTags.push(' / ');
            }
        });

        return <article class="media">
            {thumbnail ? <a href={url} class="media-left">
                <p class="image is-64x64">
                    <img class="thumbnail" src={thumbnail} alt={title} />
                </p>
            </a> : null}
            <div class="media-content size-small">
                <p><time dateTime={dateXml}>{date}</time></p>
                <p><a href={url} class="title is-size-6 has-text-weight-normal link-muted">{title}</a></p>
                <p class="is-uppercase">{categoryTags.length ? categoryTags : null}</p>
            </div>
        </article>;
    }
};
