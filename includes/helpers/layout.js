/**
 * Helper functions for controlling layout.
 *
* @example
*     <%- get_widgets(position) %>
*     <%- get_widgets_by_columns(position, column) %>
*     <%- has_column() %>
*     <%- column_count() %>
 */
module.exports = function (hexo) {
    hexo.extend.helper.register('has_widget', function (type) {
        const hasWidgets = hexo.extend.helper.get('has_config').bind(this)('widgets');
        if (!hasWidgets) {
            return false;
        }
        const widgets = hexo.extend.helper.get('get_config').bind(this)('widgets');
        return widgets.some(widget => widget.hasOwnProperty('type') && widget.type === type);
    });

    hexo.extend.helper.register('get_widgets', function (position) {
        const hasWidgets = hexo.extend.helper.get('has_config').bind(this)('widgets');
        if (!hasWidgets) {
            return [];
        }
        const widgets = hexo.extend.helper.get('get_config').bind(this)('widgets');
        return widgets.filter(widget => widget.hasOwnProperty('position') && widget.position === position);
    });

    hexo.extend.helper.register('get_widgets_by_columns', function(position, column) {
        const hasWidgets = hexo.extend.helper.get('has_config').bind(this)('widgets');
        if (!hasWidgets) {
            return [];
        }
        const widgets = hexo.extend.helper.get('get_config').bind(this)('widgets');
        for(var i=0; i<widgets.length; ++i){
            if(widgets[i].type === 'recent_posts'){
                widgets[i].position = (column === 2 ? 'left' : 'right');
            }
        }
        return widgets.filter(widget => widget.hasOwnProperty('position') && widget.position === position); 
    });

    hexo.extend.helper.register('has_column', function (position) {
        const getWidgets = hexo.extend.helper.get('get_widgets').bind(this);
        return getWidgets(position).length > 0;
    });

    hexo.extend.helper.register('column_count', function () {
        let columns = 1;
        if (this.page.__post === true || this.page.__page === true) {
            return 2;
        }
        const hasColumn = hexo.extend.helper.get('has_column').bind(this);
        columns += hasColumn('left') ? 1 : 0;
        columns += hasColumn('right') ? 1 : 0;
        return columns;
    });
}