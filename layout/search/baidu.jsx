const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Baidu extends Component {
    render() {
        const { url, hint } = this.props;

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
            <div class="searchbox">
                <div class="searchbox-container">
                    <div class="searchbox-input-wrapper">
                        <form class="search-form">
                            <input name="wd" type="text" class="searchbox-input" placeholder={hint} />
                            <span class="searchbox-close searchbox-selectable"><i class="fa fa-times-circle"></i></span>
                        </form>
                    </div>
                </div>
            </div>
            <script dangerouslySetInnerHTML={{ __html: js }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Baidu, 'search.baidu', props => {
    const { config, helper } = props;

    return {
        url: config.url,
        hint: helper.__('search.hint')
    };
});
