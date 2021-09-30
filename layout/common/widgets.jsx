const logger = require('hexo-log')();
const { Component } = require('inferno');
const view = require('hexo-component-inferno/lib/core/view');
const classname = require('hexo-component-inferno/lib/util/classname');

function formatWidgets(widgets) {
    const result = {};
    if (Array.isArray(widgets)) {
        widgets.filter(widget => typeof widget === 'object').forEach(widget => {
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

function hasColumn(widgets, position, config, page) {
    const showToc = (config.toc === true) && ['page', 'post'].includes(page.layout);
    if (Array.isArray(widgets)) {
        return typeof widgets.find(widget => {
            if (widget.type === 'toc' && !showToc) {
                return false;
            }
            return widget.position === position;
        }) !== 'undefined';
    }
    return false;
}

function getColumnCount(widgets, config, page) {
    return [hasColumn(widgets, 'left', config, page), hasColumn(widgets, 'right', config, page)].filter(v => !!v).length + 1;
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
        const widgets = formatWidgets(config.widgets)[position] || [];
        const columnCount = getColumnCount(config.widgets, config, page);

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
            {position === 'left' && hasColumn(config.widgets, 'right', config, page) ? <div class={classname({
                'column-right-shadow': true,
                'is-hidden-widescreen': true,
                'is-sticky': isColumnSticky(config, 'right')
            })}></div> : null}
        </div>;
    }
}

Widgets.getColumnCount = getColumnCount;

module.exports = Widgets;
