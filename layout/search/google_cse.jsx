const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('../util/cache');

class Google extends Component {
    render() {
        const { cx, hint } = this.props;

        const js1 = `(function() {
            var cx = '${cx}';
            var gcse = document.createElement('script');
            gcse.type = 'text/javascript';
            gcse.async = true;
            gcse.src = 'https://cse.google.com/cse.js?cx=' + cx;
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(gcse, s);
        })();`;

        const js2 = `(function (document, $) {
            function debounce(func, wait, immediate) {
                var timeout;
                return function() {
                    var context = this, args = arguments;
                    var later = function() {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            };
    
            $(document).on('click', '.navbar-main .search', function () {
                $('.searchbox').toggleClass('show');
            }).on('click', '.searchbox .searchbox-mask', function () {
                $('.searchbox').removeClass('show');
            }).on('click', '.searchbox-close', function () {
                $('.searchbox').removeClass('show');
            }).on('keydown', '.searchbox-input', debounce(function () {
                var value = $(this).val();
                try {
                    var element = google.search.cse.element.getElement('searchresults-only0');
                    if (value.trim() === '') {
                        element.clearAllResults();
                    } else {
                        element.execute(value);
                    }
                } catch (e) {}
            }, 300));
        })(document, jQuery);`;

        return <Fragment>
            <div class="searchbox google-cse-search">
                <div class="searchbox-container">
                    <div class="searchbox-input-wrapper">
                        <input type="text" class="searchbox-input" placeholder={hint} />
                        <span class="searchbox-close searchbox-selectable"><i class="fa fa-times-circle"></i></span>
                    </div>
                    {(() => {
                        if (cx) {
                            const innerHtml = '<gcse:searchresults-only></gcse:searchresults-only>';
                            return <div class="searchbox-result-wrapper" dangerouslySetInnerHTML={{ __html: innerHtml }}></div>;
                        }
                        return <div class="notification is-danger">
                            It seems that you forget to set the <code>cx</code> value for the Google CSE.
                            Please set it in <code>_config.yml</code>.
                        </div>;

                    })()}
                </div>
                {cx ? <script dangerouslySetInnerHTML={{ __html: js1 }}></script> : null}
            </div>
            <script dangerouslySetInnerHTML={{ __html: js2 }}></script>
        </Fragment>;
    }
}

module.exports = cacheComponent(Google, 'search.google', props => {
    const { helper, search } = props;

    return {
        cx: search.cx,
        hint: helper.__('search.hint')
    };
});
