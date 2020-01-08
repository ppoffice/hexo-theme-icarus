const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class SubscribeEmail extends Component {
    render() {
        const { title, description, feedburnerId, buttonTitle } = this.props;

        return <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <form action="https://feedburner.google.com/fb/a/mailverify" method="post" target="popupwindow"
                        onsubmit={`window.open('https://feedburner.google.com/fb/a/mailverify?uri=${feedburnerId}','popupwindow','scrollbars=yes,width=550,height=520');return true`}>
                        <input type="hidden" value={feedburnerId} name="uri" />
                        <input type="hidden" name="loc" value="en_US" />
                        <div class="field has-addons">
                            <div class="control has-icons-left is-expanded">
                                <input class="input" name="email" type="email" placeholder="Email" />
                                <span class="icon is-small is-left">
                                    <i class="fas fa-envelope"></i>
                                </span>
                            </div>
                            <div class="control">
                                <input class="button is-primary" type="submit" value={buttonTitle} />
                            </div>
                        </div>
                        {description ? <p class="help">{description}</p> : null}
                    </form>
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
        title: helper.__('widget.subscribe_email'),
        buttonTitle: helper.__('widget.subscribe')
    };
});
