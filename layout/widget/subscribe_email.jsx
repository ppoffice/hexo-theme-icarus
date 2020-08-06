/**
 * Google FeedBurner widget JSX component.
 * @module view/widget/subscribe_email
 */
const { Component } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Google FeedBurner widget JSX component.
 *
 * @see https://feedburner.google.com/
 * @example
 * <SubscribeEmail
 *     title="Widget title"
 *     description="Description text"
 *     feedburnerId="******"
 *     buttonTitle="Subscribe now" />
 */
class SubscribeEmail extends Component {
    render() {
        const { title, description, feedburnerId, buttonTitle } = this.props;

        return <div class="card widget" id="subscribe-email">
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

/**
 * Cacheable Google FeedBurner widget JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <SubscribeEmail.Cacheable
 *     widget={{
 *         description: 'Description text',
 *         feedburner_id: '******'
 *     }}
 *     helper={{ __: function() {...} }} />
 */
SubscribeEmail.Cacheable = cacheComponent(SubscribeEmail, 'widget.subscribeemail', props => {
    const { helper, widget } = props;
    const { feedburner_id, description } = widget;

    return {
        description,
        feedburnerId: feedburner_id,
        title: helper.__('widget.subscribe_email'),
        buttonTitle: helper.__('widget.subscribe')
    };
});

module.exports = SubscribeEmail;
