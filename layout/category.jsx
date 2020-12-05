const { Component, Fragment } = require('inferno');
const Index = require('./index');

module.exports = class extends Component {
    render() {
        const { config, page, helper } = this.props;
        const { url_for, _p } = helper;

        return <Fragment>
            <div class="card">
                <div class="card-content">
                    <nav class="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><a href={url_for('/categories')}>{_p('common.category', Infinity)}</a></li>
                            {page.parents.map(category => {
                                return <li><a href={url_for(category.path)}>{category.name}</a></li>;
                            })}
                            <li class="is-active"><a href="#" aria-current="page">{page.category}</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <Index config={config} page={page} helper={helper} />
        </Fragment>;
    }
};
