'use strict';

const { Component, Fragment } = require('inferno');
const Index = require('./index');

module.exports = class extends Component {
    render() {
        const { page } = this.props;
        // TODO
        const helper = {};
        const { url_for, _p } = helper;

        return <Fragment>
            <div className="card">
                <div className="card-content">
                    <nav className="breadcrumb" aria-label="breadcrumbs">
                        <ul>
                            <li><a href={url_for('/tags')}>{_p('common.tag', Infinity)}</a></li>
                            <li className="is-active"><a href="#" aria-current="page">{page.tag}</a></li>
                        </ul>
                    </nav>
                </div>
            </div>
            <Index {...this.props} />
        </Fragment>;
    }
}