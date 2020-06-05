const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');
const classname = require('hexo-component-inferno/lib/util/classname');

function formatWidgets(widgets, page) {
    const result = {};
    if (Array.isArray(widgets)) {
        widgets.filter(widget => typeof widget === 'object').forEach(widget => {
            // Decide the widget should show in the page or not
            if ('pages' in widget && typeof widget.pages === 'object') {
                const pageName = getPageName(page);
                var pageShow = false;
                widget.pages.forEach(item => {
                    if (item === pageName) {
                      pageShow = true;
                    }
                });
                if (!pageShow) {
                    return;
                }
            }
            // Just left or right should the widget show in
            if ('position' in widget && (widget.position === 'left' || widget.position === 'right')) {
                if (!(widget.position in result)) {
                    result[widget.position] = [widget];
                } else {
                    result[widget.position].push(widget);
                }
            }
        });
    }
    return result;
}

// eg: index, archive, category, tag, post
function getPageName(page) {
    if (page.__index === true ) {
        return 'index';
    } else if (page.archive === true) {
        return 'archive';
    } else if (page.__categories === true) {
        return 'category';
    } else if (page.__tags === true) {
        return 'tag';
    } else if (page.__post === true) {
        return 'post';
    }
}

function hasColumn(widgets, page, position) {
    var hasColumn = false;
    if (Array.isArray(widgets)) {
        const pageName = getPageName(page);
        widgets.forEach(widget => {
            var hasPos = widget.position === position;
            var hasPage = false;
            if (!('pages' in widget)) {
                hasPage = true;
            } else if (Array.isArray(widget.pages)) {
                widget.pages.forEach(item => {
                    if (item === pageName) {
                        hasPage = true;
                        return;
                    }
                });
            }
            if (hasPos && hasPage) {
                hasColumn = true;
                return;
            }
        });
    }
    return hasColumn;
}

function getColumnCount(widgets, page) {
    return [hasColumn(widgets, page, 'left') , hasColumn(widgets, page, 'right')].filter(v => !!v).length + 1;
}

function getColumnSizeClass(columnCount) {
    switch (columnCount) {
        case 2:
            return 'is-4-tablet is-4-desktop is-4-widescreen';
        case 3:
            return 'is-4-tablet is-4-desktop is-3-widescreen';
    }
    return '';
}

function getColumnVisibilityClass(columnCount, position) {
    if (columnCount === 3 && position === 'right') {
        return 'is-hidden-touch is-hidden-desktop-only';
    }
    return '';
}

function getColumnOrderClass(position) {
    return position === 'left' ? 'order-1' : 'order-3';
}

function isColumnSticky(config, position) {
    return typeof config.sidebar === 'object'
        && position in config.sidebar
        && config.sidebar[position].sticky === true;
}

class Widgets extends Component {
    render() {
        const { site, config, helper, page, position } = this.props;
        const widgets = formatWidgets(config.widgets, page)[position] || [];
        const columnCount = getColumnCount(config.widgets, page);

        if (!widgets.length) {
            return null;
        }

        return <div class={classname({
            'column': true,
            ['column-' + position]: true,
            [getColumnSizeClass(columnCount)]: true,
            [getColumnVisibilityClass(columnCount, position)]: true,
            [getColumnOrderClass(position)]: true,
            'is-sticky': isColumnSticky(config, position)
        })}>
            {widgets.map(widget => {
                // widget type is not defined
                if (!widget.type) {
                    return null;
                }
                try {
                    let Widget = view.require('widget/' + widget.type);
                    Widget = Widget.Cacheable ? Widget.Cacheable : Widget;
                    return <Widget site={site} helper={helper} config={config} page={page} widget={widget} />;
                } catch (e) {
                    logger.w(`Icarus cannot load widget "${widget.type}"`);
                }
                return null;
            })}
            {position === 'left' && hasColumn(config.widgets, page, 'right') ? <div class={classname({
                'column-right-shadow': true,
                'is-hidden-widescreen': true,
                'is-sticky': isColumnSticky(config, 'right')
            })}></div> : null}
        </div>;
    }
}

Widgets.getColumnCount = getColumnCount;

module.exports = Widgets;
