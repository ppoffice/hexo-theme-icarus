/**
 * Waline comment JSX component.
 * @module view/comment/waline
 */
const { Component } = require('inferno');
const { cacheComponent } = require('../../util/cache');

/**
 * Waline comment JSX component.
 *
 * @see https://waline.js.org/guide/get-started.html
 * @example
 * <Waline
 *     serverURL="https://path/to/waline/server"
 *     path="window.location.pathname"
 *     lang="zh-CN"
 *     locale={{placeholder: "", ...}}
 *     emoji={["https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo"]}
 *     dark="auto"
 *     meta={["nick", "mail", "link"]}
 *     requiredMeta={[]}
 *     login="enable"
 *     wordLimit={0},
 *     pageSize={10}
 *     imageUploader={true}
 *     highlighter={true}
 *     texRenderer={false}
 *     search={true}
 *     visitor={false}
 *     pageview={false}
 *     comment={false}
 *     copyright={true}
 *     jsUrl="/path/to/Waline.js" />
 */
class Waline extends Component {
  render() {
    const {
      serverURL,
      path = 'window.location.pathname',
      lang = 'zh-CN',
      locale,
      emoji = ['https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo'],
      dark = '',
      meta = ['nick', 'mail', 'link'],
      requiredMeta = [],
      login = 'enable',
      wordLimit = 0,
      pageSize = 10,
      imageUploader = false,
      highlighter = false,
      texRenderer = false,
      search = false,
      pageview = false,
      comment = false,
      copyright = true,
      jsUrl,
      cssUrl,
    } = this.props;
    if (!serverURL) {
      return (
        <div class="notification is-danger">
          You forgot to set the <code>server_url</code> for Waline. Please set it in{' '}
          <code>_config.yml</code>.
        </div>
      );
    }
    const js = `Waline.init({
            el: '#waline-thread',
            serverURL: ${JSON.stringify(serverURL)},
            path: ${path},
            ${lang ? `lang: ${JSON.stringify(lang)},` : ''}
            ${locale ? `locale: ${JSON.stringify(locale)},` : ''}
            ${emoji ? `emoji: ${JSON.stringify(emoji)},` : ''}
            ${dark ? `dark: ${JSON.stringify(dark)},` : ''}
            ${meta ? `meta: ${JSON.stringify(meta)},` : ''}
            ${Array.isArray(requiredMeta) ? `requiredMeta: ${JSON.stringify(requiredMeta)},` : ''}
            ${login ? `login: ${JSON.stringify(login)},` : ''}
            ${wordLimit ? `wordLimit: ${JSON.stringify(wordLimit)},` : ''}
            ${pageSize ? `pageSize: ${JSON.stringify(pageSize)},` : ''}
            ${imageUploader === false ? `imageUploader: false,` : ''}
            ${highlighter === false ? `highlighter: false,` : ''}
            ${texRenderer === false ? `texRenderer: false,` : ''}
            ${search === false ? `search: false,` : ''}
            ${typeof pageview !== 'undefined' ? `pageview: ${JSON.stringify(pageview)},` : ''}
            ${typeof comment !== 'undefined' ? `comment: ${JSON.stringify(comment)},` : ''}
            ${`copyright: ${JSON.stringify(copyright)},`}
        });`;
    return (
      <>
        <div id="waline-thread" class="content"></div>
        <link rel="stylesheet" href={cssUrl} />
        <script src={jsUrl}></script>
        <script dangerouslySetInnerHTML={{ __html: js }}></script>
      </>
    );
  }
}

/**
 * Cacheable Waline comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Waline.Cacheable
 *     comment={{
 *         server_url: "https://path/to/waline/server",
 *         path: "window.location.pathname",
 *         lang: "zh-CN",
 *         locale: {placeholder: "", ...},
 *         emoji: "https://cdn.jsdelivr.net/gh/walinejs/emojis/weibo",
 *         dark: "",
 *         meta: ["nick", "mail", "link"],
 *         required_meta: [],
 *         login: false,
 *         word_limit: 0,
 *         page_size: 10,
 *         image_uploader: true,
 *         highlighter: true,
 *         tex_renderer: false,
 *         search: true,
 *         pageview: false,
 *         comment: false,
 *         copyright: true,
 *     }}
 *     helper={{ cdn: function() {...} }} />
 */
Waline.Cacheable = cacheComponent(Waline, 'comment.waline', (props) => {
  const { comment, helper, page, config } = props;

  return {
    serverURL: comment.server_url,
    path: comment.path,
    lang: comment.lang || page.lang || page.language || config.language || 'zh-CN',
    locale: comment.locale,
    emoji: comment.emoji,
    dark: comment.dark,
    meta: comment.meta,
    requiredMeta: comment.required_meta,
    login: comment.login,
    wordLimit: comment.word_limit,
    pageSize: comment.page_size,
    imageUploader: comment.image_uploader,
    highlighter: comment.highlighter,
    texRenderer: comment.tex_renderer,
    search: comment.search,
    pageview: comment.pageview,
    comment: comment.comment,
    copyright: comment.copyright,
    jsUrl: helper.cdn('@waline/client', '2.15.8', 'dist/waline.js'),
    cssUrl: helper.cdn('@waline/client', '2.15.8', 'dist/waline.css'),
  };
});

module.exports = Waline;
