/* global instantsearch, algoliasearch */
function loadAlgolia(config, translation) { // eslint-disable-line no-unused-vars
    const search = instantsearch({
        indexName: config.indexName,
        searchClient: algoliasearch(config.applicationId, config.apiKey)
    });

    search.addWidgets([
        instantsearch.widgets.configure({
            attributesToSnippet: ['excerpt']
        })
    ]);

    search.addWidget(instantsearch.widgets.searchBox({
        container: '#algolia-input',
        placeholder: translation.hint,
        showReset: false,
        showSubmit: false,
        showLoadingIndicator: false,
        cssClasses: {
            root: 'searchbox-input-container',
            form: 'searchbox-input-container',
            input: 'searchbox-input'
        }
    }));

    search.addWidget(instantsearch.widgets.poweredBy({
        container: '#algolia-poweredby'
    }));

    search.addWidget(instantsearch.widgets.hits({
        container: '.searchbox-body',
        escapeHTML: false,
        cssClasses: {
            root: 'searchbox-result-container',
            emptyRoot: ['searchbox-result-item', 'disabled']
        },
        templates: {
            empty: function(results) {
                return translation.no_result + ': ' + results.query;
            },
            item: function(hit) {
                const title = instantsearch.highlight({ attribute: 'title', hit });
                let excerpt = instantsearch.highlight({ attribute: 'excerpt', hit });
                excerpt = excerpt.replace(new RegExp('<em>', 'ig'), '[algolia-highlight]')
                    .replace(new RegExp('</em>', 'ig'), '[/algolia-highlight]')
                    .replace(/(<([^>]+)>)/ig, '')
                    .replace(/(\[algolia-highlight\])/ig, '<em>')
                    .replace(/(\[\/algolia-highlight\])/ig, '</em>');
                return `<section class="searchbox-result-section">
                        <a class="searchbox-result-item" href="${hit.permalink}">
                            <span class="searchbox-result-content">
                                <span class="searchbox-result-title">${title ? title : translation.untitled}</span>
                                <span class="searchbox-result-preview">${excerpt ? excerpt : translation.empty_preview}</span>
                            </span>
                        </a>
                    </section>`;
            }
        }
    }));

    search.addWidget(instantsearch.widgets.pagination({
        container: '.searchbox-footer',
        cssClasses: {
            list: 'searchbox-pagination',
            item: 'searchbox-pagination-item',
            link: 'searchbox-pagination-link',
            selectedItem: 'active',
            disabledItem: 'disabled'
        }
    }));

    search.start();

    if (location.hash.trim() === '#algolia-search') {
        $('.searchbox').addClass('show');
    }

    $(document).on('click', '.navbar-main .search', () => {
        $('.searchbox').toggleClass('show');
        $('.searchbox-input').focus();
    }).on('click', '.searchbox .searchbox-mask', () => {
        $('.searchbox').removeClass('show');
    }).on('click', '.searchbox-close', () => {
        $('.searchbox').removeClass('show');
    });
}
