/**
 * Insight search plugin
 * @author PPOffice { @link https://github.com/ppoffice }
 */
(function($, CONFIG) {
    const $main = $('.ins-search');
    const $input = $main.find('.ins-search-input');
    const $wrapper = $main.find('.ins-section-wrapper');
    const $container = $main.find('.ins-section-container');
    $main.parent().remove('.ins-search');
    $('body').append($main);

    function section(title) {
        return $('<section>').addClass('ins-section')
            .append($('<header>').addClass('ins-section-header').text(title));
    }

    function searchItem(icon, title, slug, preview, url) {
        return $('<div>').addClass('ins-selectable').addClass('ins-search-item')
            .append($('<header>').append($('<i>').addClass('fa').addClass('fa-' + icon))
                .append($('<span>').addClass('ins-title').text(title != null && title !== '' ? title : CONFIG.TRANSLATION.UNTITLED))
                .append(slug ? $('<span>').addClass('ins-slug').text(slug) : null))
            .append(preview ? $('<p>').addClass('ins-search-preview').text(preview) : null)
            .attr('data-url', url);
    }

    function sectionFactory(type, array) {
        let $searchItems;
        if (array.length === 0) return null;
        const sectionTitle = CONFIG.TRANSLATION[type];
        switch (type) {
            case 'POSTS':
            case 'PAGES':
                $searchItems = array.map(item => {
                    // Use config.root instead of permalink to fix url issue
                    return searchItem('file', item.title, null, item.text.slice(0, 150), item.link);
                });
                break;
            case 'CATEGORIES':
            case 'TAGS':
                $searchItems = array.map(item => {
                    return searchItem(type === 'CATEGORIES' ? 'folder' : 'tag', item.name, item.slug, null, item.link);
                });
                break;
            default:
                return null;
        }
        return section(sectionTitle).append($searchItems);
    }

    function parseKeywords(keywords) {
        return keywords.split(' ').filter(keyword => {
            return !!keyword;
        }).map(keyword => {
            return keyword.toUpperCase();
        });
    }

    /**
     * Judge if a given post/page/category/tag contains all of the keywords.
     * @param Object            obj     Object to be weighted
     * @param Array<String>     fields  Object's fields to find matches
     */
    function filter(keywords, obj, fields) {
        const keywordArray = parseKeywords(keywords);
        const containKeywords = keywordArray.filter(keyword => {
            const containFields = fields.filter(field => {
                if (!Object.prototype.hasOwnProperty.call(obj, field)) {
                    return false;
                }
                if (obj[field].toUpperCase().indexOf(keyword) > -1) {
                    return true;
                }
                return false;
            });
            if (containFields.length > 0) {
                return true;
            }
            return false;
        });
        return containKeywords.length === keywordArray.length;
    }

    function filterFactory(keywords) {
        return {
            post: function(obj) {
                return filter(keywords, obj, ['title', 'text']);
            },
            page: function(obj) {
                return filter(keywords, obj, ['title', 'text']);
            },
            category: function(obj) {
                return filter(keywords, obj, ['name', 'slug']);
            },
            tag: function(obj) {
                return filter(keywords, obj, ['name', 'slug']);
            }
        };
    }

    /**
     * Calculate the weight of a matched post/page/category/tag.
     * @param Object            obj     Object to be weighted
     * @param Array<String>     fields  Object's fields to find matches
     * @param Array<Integer>    weights Weight of every field
     */
    function weight(keywords, obj, fields, weights) {
        let value = 0;
        parseKeywords(keywords).forEach(keyword => {
            const pattern = new RegExp(keyword, 'img'); // Global, Multi-line, Case-insensitive
            fields.forEach((field, index) => {
                if (Object.prototype.hasOwnProperty.call(obj, field)) {
                    const matches = obj[field].match(pattern);
                    value += matches ? matches.length * weights[index] : 0;
                }
            });
        });
        return value;
    }

    function weightFactory(keywords) {
        return {
            post: function(obj) {
                return weight(keywords, obj, ['title', 'text'], [3, 1]);
            },
            page: function(obj) {
                return weight(keywords, obj, ['title', 'text'], [3, 1]);
            },
            category: function(obj) {
                return weight(keywords, obj, ['name', 'slug'], [1, 1]);
            },
            tag: function(obj) {
                return weight(keywords, obj, ['name', 'slug'], [1, 1]);
            }
        };
    }

    function search(json, keywords) {
        const weights = weightFactory(keywords);
        const filters = filterFactory(keywords);
        const posts = json.posts;
        const pages = json.pages;
        const tags = json.tags;
        const categories = json.categories;
        return {
            posts: posts.filter(filters.post).sort((a, b) => { return weights.post(b) - weights.post(a); }).slice(0, 5),
            pages: pages.filter(filters.page).sort((a, b) => { return weights.page(b) - weights.page(a); }).slice(0, 5),
            categories: categories.filter(filters.category).sort((a, b) => { return weights.category(b) - weights.category(a); }).slice(0, 5),
            tags: tags.filter(filters.tag).sort((a, b) => { return weights.tag(b) - weights.tag(a); }).slice(0, 5)
        };
    }

    function searchResultToDOM(searchResult) {
        $container.empty();
        for (const key in searchResult) {
            $container.append(sectionFactory(key.toUpperCase(), searchResult[key]));
        }
    }

    function scrollTo($item) {
        if ($item.length === 0) return;
        const wrapperHeight = $wrapper[0].clientHeight;
        const itemTop = $item.position().top - $wrapper.scrollTop();
        const itemBottom = $item[0].clientHeight + $item.position().top;
        if (itemBottom > wrapperHeight + $wrapper.scrollTop()) {
            $wrapper.scrollTop(itemBottom - $wrapper[0].clientHeight);
        }
        if (itemTop < 0) {
            $wrapper.scrollTop($item.position().top);
        }
    }

    function selectItemByDiff(value) {
        const $items = $.makeArray($container.find('.ins-selectable'));
        let prevPosition = -1;
        $items.forEach((item, index) => {
            if ($(item).hasClass('active')) {
                prevPosition = index;

            }
        });
        const nextPosition = ($items.length + prevPosition + value) % $items.length;
        $($items[prevPosition]).removeClass('active');
        $($items[nextPosition]).addClass('active');
        scrollTo($($items[nextPosition]));
    }

    function gotoLink($item) {
        if ($item && $item.length) {
            location.href = $item.attr('data-url');
        }
    }

    $.getJSON(CONFIG.CONTENT_URL, json => {
        if (location.hash.trim() === '#ins-search') {
            $main.addClass('show');
        }
        $input.on('input', function() {
            const keywords = $(this).val();
            searchResultToDOM(search(json, keywords));
        });
        $input.trigger('input');
    });

    let touch = false;
    $(document).on('click focus', '.navbar-main .search', () => {
        $main.addClass('show');
        $main.find('.ins-search-input').focus();
    }).on('click touchend', '.ins-search-item', function(e) {
        if (e.type !== 'click' && !touch) {
            return;
        }
        gotoLink($(this));
        touch = false;
    }).on('click touchend', '.ins-close', e => {
        if (e.type !== 'click' && !touch) {
            return;
        }
        $('.navbar-main').css('pointer-events', 'none');
        setTimeout(() => {
            $('.navbar-main').css('pointer-events', 'auto');
        }, 400);
        $main.removeClass('show');
        touch = false;
    }).on('keydown', e => {
        if (!$main.hasClass('show')) return;
        switch (e.keyCode) {
            case 27: // ESC
                $main.removeClass('show'); break;
            case 38: // UP
                selectItemByDiff(-1); break;
            case 40: // DOWN
                selectItemByDiff(1); break;
            case 13: // ENTER
                gotoLink($container.find('.ins-selectable.active').eq(0)); break;
        }
    }).on('touchstart', e => {
        touch = true;
    }).on('touchmove', e => {
        touch = false;
    });
}(jQuery, window.INSIGHT_CONFIG));
