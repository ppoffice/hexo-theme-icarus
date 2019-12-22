'use strict';

const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Baidu extends Component {
    render() {
        const { url, __, url_for } = this.props;

        const js = `(function ($) {
            $('.search-form').on('submit', function (e) {
                var keyword = $('.searchbox-input[name="wd"]').val();
                window.location = 'https://www.baidu.com/s?wd=site:${url.replace(/http(s)*:\/\//, '')} ' + keyword;
                return false;
            });
        })(jQuery);
        (function (document, $) {
            $(document).on('click', '.navbar-main .search', function () {
                $('.searchbox').toggleClass('show');
            }).on('click', '.searchbox .searchbox-mask', function () {
                $('.searchbox').removeClass('show');
            }).on('click', '.searchbox-close', function () {
                $('.searchbox').removeClass('show');
            });
        })(document, jQuery);`;

        return <Fragment>
            <link rel="stylesheet" href={url_for('/css/search.css')} />
            <div className="searchbox">
                <div className="searchbox-container">
                    <div className="searchbox-input-wrapper">
                        <form className="search-form">
                            <input name="wd" type="text" className="searchbox-input" placeholder={__('search.hint')} />
                            <span className="searchbox-close searchbox-selectable"><i className="fa fa-times-circle"></i></span>
                        </form>
                    </div>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Baidu, 'search.baidu', props => {
    return {
        url: props.config.url,
        __: props.__,
        url_for: props.url_for
    };
});
