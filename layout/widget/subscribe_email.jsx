'use strict';

const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class SubscribeEmail extends Component {
    render() {
        const { title, description, feedburnerId, buttonTitle } = this.props;

        return <div className="card widget">
            <div className="card-content">
                <div className="menu">
                    <h3 className="menu-label">{title}</h3>
                    <div>
                        <form action="https://feedburner.google.com/fb/a/mailverify" method="post" target="popupwindow"
                            onsubmit={`window.open('https://feedburner.google.com/fb/a/mailverify?uri=${feedburnerId}','popupwindow','scrollbars=yes,width=550,height=520');return true`}>
                            <input type="hidden" value={feedburnerId} name="uri" />
                            <input type="hidden" name="loc" value="en_US" />
                            <div className="field">
                                <div className="control has-icons-left">
                                    <input className="input" name="email" type="email" />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-envelope"></i>
                                    </span>
                                </div>
                                <p className="help">{description}</p>
                            </div>
                            <div className="field is-grouped is-grouped-right">
                                <div className="control">
                                    <input className="button is-link" type="submit" value={buttonTitle} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(SubscribeEmail, 'widget.subscribeemail', props => {
    const { helper, widget } = props;
    const { feedburner_id, description } = widget;

    return {
        description,
        feedburnerId: feedburner_id,
        title: helper.__('widget.email.title'),
        buttonTitle: helper.__('widget.email.button')
    };
});
