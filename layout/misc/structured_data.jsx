const urlFn = require('url');
const moment = require('moment');
const { Component } = require('inferno');
const { stripHTML, escapeHTML } = require('hexo-util');

module.exports = class extends Component {
    render() {
        const { title, url, author } = this.props;
        let { description, images, date, updated } = this.props;

        if (description) {
            description = escapeHTML(stripHTML(description).substring(0, 200).trim())
                .replace(/\n/g, ' ');
        }

        if (!Array.isArray(images)) {
            images = [images];
        }
        images = images.map(path => {
            if (!urlFn.parse(path).host) {
                // resolve `path`'s absolute path relative to current page's url
                // `path` can be both absolute (starts with `/`) or relative.
                return urlFn.resolve(url, path);
            }
            return path;
        }).filter(url => url.endsWith('.jpg') || url.endsWith('.png') || url.endsWith('.gif'));

        if (date && (moment.isMoment(date) || moment.isDate(date)) && !isNaN(date.valueOf())) {
            date = date.toISOString();
        }

        if (updated && (moment.isMoment(updated) || moment.isDate(updated)) && !isNaN(updated.valueOf())) {
            updated = updated.toISOString();
        }

        const data = {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'mainEntityOfPage': {
                '@type': 'WebPage',
                '@id': url
            },
            'headline': title,
            'image': images,
            'datePublished': date,
            'dateModified': updated,
            'author': {
                '@type': 'Person',
                'name': author
            },
            'description': description
        };

        return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}></script>;
    }
};
