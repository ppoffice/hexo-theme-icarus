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
            return 'is-4-tablet is-4-desktop is-3-widescreen';
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
    renderWidgets(widgets) {
        const { site, config, helper, page } = this.props;
        return widgets.map(widget => {
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
        });
    }

    renderColumnRightShadow() {
        const { config, page, position } = this.props;
        return position === 'left' && hasColumn(config.widgets, 'right', config, page) ? <div class={classname({
            'column-right-shadow': true,
            'is-hidden-widescreen': true,
        })}></div> : null;
    }

    render() {
        const { config, page, position } = this.props;
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
            {widgets[0].type === 'profile' ? 
                <>{this.renderWidgets([widgets.shift()])}
                {widgets.length ? <div class="column-sticky is-sticky">
                    {this.renderWidgets(widgets)}
                    {this.renderColumnRightShadow()}
                </div>: null}
                </> : <>
                    {this.renderWidgets(widgets)}
                    {this.renderColumnRightShadow()}
                </>
            }
        </div>;
    }
}

Widgets.getColumnCount = getColumnCount;

module.exports = Widgets;
