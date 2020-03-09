/**
 * Insight search plugin
 * @author PPOffice { @link https://github.com/ppoffice }
 */
function loadInsight(config, translation) { // eslint-disable-line no-unused-vars
    const $main = $('.searchbox');
    const $input = $main.find('.searchbox-input');
    const $container = $main.find('.searchbox-body');

    function section(title) {
        return $('<section>').addClass('searchbox-result-section').append($('<header>').text(title));
    }

    function merge(ranges) {
        let last;
        const result = [];

        ranges.forEach(r => {
            if (!last || r[0] > last[1]) {
                result.push(last = r);
            } else if (r[1] > last[1]) {
                last[1] = r[1];
            }
        });

        return result;
    }

    function findAndHighlight(text, matches, maxlen) {
        if (!Array.isArray(matches) || !matches.length || !text) {
            return maxlen ? text.slice(0, maxlen) : text;
        }
        const testText = text.toLowerCase();
        const indices = matches.map(match => {
            const index = testText.indexOf(match.toLowerCase());
            if (!match || index === -1) {
                return null;
            }
            return [index, index + match.length];
        }).filter(match => {
            return match !== null;
        }).sort((a, b) => {
            return a[0] - b[0] || a[1] - b[1];
        });

        if (!indices.length) {
            return text;
        }

        let result = ''; let last = 0;
        const ranges = merge(indices);
        const sumRange = [ranges[0][0], ranges[ranges.length - 1][1]];
        if (maxlen && maxlen < sumRange[1]) {
            last = sumRange[0];
        }

        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            result += text.slice(last, Math.min(range[0], sumRange[0] + maxlen));
            if (maxlen && range[0] >= sumRange[0] + maxlen) {
                break;
            }
            result += '<em>' + text.slice(range[0], range[1]) + '</em>';
            last = range[1];
            if (i === ranges.length - 1) {
                if (maxlen) {
                    result += text.slice(range[1], Math.min(text.length, sumRange[0] + maxlen + 1));
                } else {
                    result += text.slice(range[1]);
                }
            }
        }

        return result;
    }

    function searchItem(icon, title, slug, preview, url) {
        title = title != null && title !== '' ? title : translation.untitled;

        return `<a class="searchbox-result-item" href="${url}">
            <span class="searchbox-result-icon">
                <i class="fa fa-${icon}" />
            </span>
            <span class="searchbox-result-content">
                <span class="searchbox-result-title">
                    ${title}
                    ${slug ? '<span class="searchbox-result-title-secondary">(' + slug + ')</span>' : ''}
                </span>
                ${preview ? '<span class="searchbox-result-preview">' + preview + '</span>' : ''}
            </span>
        </a>`;
    }

    function sectionFactory(keywords, type, array) {
        let $searchItems;
        if (array.length === 0) return null;
        const sectionTitle = translation[type.toLowerCase()];
        switch (type) {
            case 'POSTS':
            case 'PAGES':
                $searchItems = array.map(item => {
                    const title = findAndHighlight(item.title, keywords);
                    const text = findAndHighlight(item.text, keywords, 100);
                    return searchItem('file', title, null, text, item.link);
                });
                break;
            case 'CATEGORIES':
            case 'TAGS':
                $searchItems = array.map(item => {
                    const name = findAndHighlight(item.name, keywords);
                    const slug = findAndHighlight(item.slug, keywords);
                    return searchItem(type === 'CATEGORIES' ? 'folder' : 'tag', name, slug, null, item.link);
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
            return keyword.toLowerCase();
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
                if (obj[field].toLowerCase().indexOf(keyword) > -1) {
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

    function searchResultToDOM(keywords, searchResult) {
        $container.empty();
        for (const key in searchResult) {
            $container.append(sectionFactory(parseKeywords(keywords),
                key.toUpperCase(), searchResult[key]));
        }
    }

    function scrollTo($item) {
        if ($item.length === 0) return;
        const wrapperHeight = $container[0].clientHeight;
        const itemTop = $item.position().top - $container.scrollTop();
        const itemBottom = $item[0].clientHeight + $item.position().top;
        if (itemBottom > wrapperHeight + $container.scrollTop()) {
            $container.scrollTop(itemBottom - $container[0].clientHeight);
        }
        if (itemTop < 0) {
            $container.scrollTop($item.position().top);
        }
    }

    function selectItemByDiff(value) {
        const $items = $.makeArray($container.find('.searchbox-result-item'));
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
            location.href = $item.attr('href');
        }
    }

    $.getJSON(config.contentUrl, json => {
        if (location.hash.trim() === '#insight-search') {
            $main.addClass('show');
        }
        $input.on('input', function() {
            const keywords = $(this).val();
            searchResultToDOM(keywords, search(json, keywords));
        });
        $input.trigger('input');
    });

    let touch = false;
    $(document).on('click focus', '.navbar-main .search', () => {
        $main.addClass('show');
        $main.find('.searchbox-input').focus();
    }).on('click touchend', '.searchbox-result-item', function(e) {
        if (e.type !== 'click' && !touch) {
            return;
        }
        gotoLink($(this));
        touch = false;
    }).on('click touchend', '.searchbox-close', e => {
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
                gotoLink($container.find('.searchbox-result-item.active').eq(0)); break;
        }
    }).on('touchstart', e => {
        touch = true;
    }).on('touchmove', e => {
        touch = false;
    });
}
