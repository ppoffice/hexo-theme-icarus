const { Component } = require('inferno');
const { cacheComponent } = require('../util/cache');

class AdSense extends Component {
    render() {
        const { title, clientId, slotId } = this.props;
        if (!clientId || !slotId) {
            return <div class="card widget">
                <div class="card-content">
                    <div class="notification is-danger">
                        You need to set <code>client_id</code> and <code>slot_id</code> to show this AD unit.
                        Please set it in <code>_config.yml</code>.
                    </div>
                </div>
            </div>;
        }
        return <div class="card widget">
            <div class="card-content">
                <div class="menu">
                    <h3 class="menu-label">{title}</h3>
                    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
                    <ins class="adsbygoogle"
                        data-ad-client={clientId}
                        data-ad-slot={slotId}></ins>
                    <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({});' }}></script>
                </div>
            </div>
        </div>;
    }
}

module.exports = cacheComponent(AdSense, 'widget.adsense', props => {
    const { widget, helper } = props;
    const { client_id, slot_id } = widget;

    return {
        title: helper.__('widget.adsense'),
        clientId: client_id,
        slotId: slot_id
    };
});
