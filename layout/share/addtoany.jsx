'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class AddToAny extends Component {
    render() {
        return <Fragment>
            <div className="a2a_kit a2a_kit_size_32 a2a_default_style">
                <a className="a2a_dd" href="https://www.addtoany.com/share"></a>
                <a className="a2a_button_facebook"></a>
                <a className="a2a_button_twitter"></a>
                <a className="a2a_button_telegram"></a>
                <a className="a2a_button_whatsapp"></a>
                <a className="a2a_button_reddit"></a>
            </div>
            <script src="https://static.addtoany.com/menu/page.js" async={true}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(AddToAny, 'share.addtoany', props => {
    return {};
});
