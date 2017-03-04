/**
 * Insight search plugin
 * @author PPOffice { @link https://github.com/ppoffice }
 */
(($, { TRANSLATION, ROOT_URL, CONTENT_URL }) => {
  const $main = $('.ins-search');
  const $input = $main.find('.ins-search-input');
  const $wrapper = $main.find('.ins-section-wrapper');
  const $container = $main.find('.ins-section-container');
  $main.parent().remove('.ins-search');
  $('body').append($main);

  function section (title) {
    return $('<section>').addClass('ins-section').append($('<header>').addClass('ins-section-header').text(title));
  }

  function searchItem (icon, title, slug, preview, url) {
    return $('<div>')
      .addClass('ins-selectable')
      .addClass('ins-search-item')
      .append(
        $('<header>')
          .append($('<i>').addClass('fa').addClass(`fa-${icon}`))
          .append(title !== null && title !== '' ? title : TRANSLATION['UNTITLED'])
          .append(slug ? $('<span>').addClass('ins-slug').text(slug) : null)
      )
      .append(preview ? $('<p>').addClass('ins-search-preview').text(preview) : null)
      .attr('data-url', url);
  }

  function sectionFactory (type, array) {
    let $searchItems;
    if (array.length === 0) return null;
    const sectionTitle = TRANSLATION[type];
    switch (type) {
    case 'POSTS':
    case 'PAGES':
      $searchItems = array.map((
          { title, text, path } // Use config.root instead of permalink to fix url issue
        ) => searchItem('file', title, null, text.slice(0, 150), ROOT_URL + path));
      break;
    case 'CATEGORIES':
    case 'TAGS':
      $searchItems = array.map(({ name, slug, permalink }) => searchItem(type === 'CATEGORIES' ? 'folder' : 'tag', name, slug, null, permalink));
      break;
    default:
      return null;
    }
    return section(sectionTitle).append($searchItems);
  }

  function extractToSet ({ pages, posts }, key) {
    const values = {};
    const entries = pages.concat(posts);
    entries.forEach(entry => {
      if (entry[key]) {
        entry[key].forEach(value => {
          values[value.name] = value;
        });
      }
    });
    const result = [];
    for (const key in values) {
      result.push(values[key]);
    }
    return result;
  }

  function parseKeywords (keywords) {
    return keywords.split(' ').filter(keyword => !!keyword).map(keyword => keyword.toUpperCase());
  }

  /**
   * Judge if a given post/page/category/tag contains all of the keywords.
   * @param Object            obj     Object to be weighted
   * @param Array<String>     fields  Object's fields to find matches
   */
  function filter (keywords, obj, fields) {
    const keywordArray = parseKeywords(keywords);
    const containKeywords = keywordArray.filter(keyword => {
      const containFields = fields.filter(field => {
        if (!obj.hasOwnProperty(field)) return false;
        if (obj[field].toUpperCase().indexOf(keyword) > -1) return true;
      });
      if (containFields.length > 0) return true;
      return false;
    });
    return containKeywords.length === keywordArray.length;
  }

  function filterFactory (keywords) {
    return {
      POST (obj) {
        return filter(keywords, obj, ['title', 'text']);
      },
      PAGE (obj) {
        return filter(keywords, obj, ['title', 'text']);
      },
      CATEGORY (obj) {
        return filter(keywords, obj, ['name', 'slug']);
      },
      TAG (obj) {
        return filter(keywords, obj, ['name', 'slug']);
      },
    };
  }

  /**
   * Calculate the weight of a matched post/page/category/tag.
   * @param Object            obj     Object to be weighted
   * @param Array<String>     fields  Object's fields to find matches
   * @param Array<Integer>    weights Weight of every field
   */
  function weight (keywords, obj, fields, weights) {
    let value = 0;
    parseKeywords(keywords).forEach(keyword => {
      const pattern = new RegExp(keyword, 'img'); // Global, Multi-line, Case-insensitive
      fields.forEach((field, index) => {
        if (obj.hasOwnProperty(field)) {
          const matches = obj[field].match(pattern);
          value += matches ? matches.length * weights[index] : 0;
        }
      });
    });
    return value;
  }

  function weightFactory (keywords) {
    return {
      POST (obj) {
        return weight(keywords, obj, ['title', 'text'], [3, 1]);
      },
      PAGE (obj) {
        return weight(keywords, obj, ['title', 'text'], [3, 1]);
      },
      CATEGORY (obj) {
        return weight(keywords, obj, ['name', 'slug'], [1, 1]);
      },
      TAG (obj) {
        return weight(keywords, obj, ['name', 'slug'], [1, 1]);
      },
    };
  }

  function search (json, keywords) {
    const WEIGHTS = weightFactory(keywords);
    const FILTERS = filterFactory(keywords);
    const posts = json.posts;
    const pages = json.pages;
    const tags = extractToSet(json, 'tags');
    const categories = extractToSet(json, 'categories');
    return {
      posts     : posts.filter(FILTERS.POST).sort((a, b) => WEIGHTS.POST(b) - WEIGHTS.POST(a)).slice(0, 5),
      pages     : pages.filter(FILTERS.PAGE).sort((a, b) => WEIGHTS.PAGE(b) - WEIGHTS.PAGE(a)).slice(0, 5),
      categories: categories.filter(FILTERS.CATEGORY).sort((a, b) => WEIGHTS.CATEGORY(b) - WEIGHTS.CATEGORY(a)).slice(0, 5),
      tags      : tags.filter(FILTERS.TAG).sort((a, b) => WEIGHTS.TAG(b) - WEIGHTS.TAG(a)).slice(0, 5),
    };
  }

  function searchResultToDOM (searchResult) {
    $container.empty();
    for (const key in searchResult) {
      $container.append(sectionFactory(key.toUpperCase(), searchResult[key]));
    }
  }

  function scrollTo ($item) {
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

  function selectItemByDiff (value) {
    const $items = $.makeArray($container.find('.ins-selectable'));
    let prevPosition = -1;
    $items.forEach((item, index) => {
      if ($(item).hasClass('active')) {
        prevPosition = index;
        return;
      }
    });
    const nextPosition = ($items.length + prevPosition + value) % $items.length;
    $($items[prevPosition]).removeClass('active');
    $($items[nextPosition]).addClass('active');
    scrollTo($($items[nextPosition]));
  }

  function gotoLink ($item) {
    if ($item && $item.length) {
      location.href = $item.attr('data-url');
    }
  }

  $.getJSON(CONTENT_URL, json => {
    if (location.hash.trim() === '#ins-search') {
      $main.addClass('show');
    }
    $input.on('input', function () {
      const keywords = $(this).val();
      searchResultToDOM(search(json, keywords));
    });
    $input.trigger('input');
  });

  $(document)
    .on('click focus', '.search-form-input', () => {
      $main.addClass('show');
      $main.find('.ins-search-input').focus();
    })
    .on('click', '.ins-search-item', function () {
      gotoLink($(this));
    })
    .on('click', '.ins-close', () => {
      $main.removeClass('show');
    })
    .on('keydown', ({ keyCode }) => {
      if (!$main.hasClass('show')) return;
      switch (keyCode) {
      case 27: // ESC
        $main.removeClass('show');
        break;
      case 38: // UP
        selectItemByDiff(-1);
        break;
      case 40: // DOWN
        selectItemByDiff(1);
        break;
      case 13: // ENTER
        gotoLink($container.find('.ins-selectable.active').eq(0));
        break;
      }
    });
})(jQuery, window.INSIGHT_CONFIG);
