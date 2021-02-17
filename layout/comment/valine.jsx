/**
 * Valine comment JSX component.
 * @module view/comment/valine
 */
const { Component, Fragment } = require('inferno');
const { cacheComponent } = require('hexo-component-inferno/lib/util/cache');

/**
 * Valine comment JSX component.
 *
 * @see https://valine.js.org/quickstart.html
 * @example
 * <Valine
 *     appId="******"
 *     appKey="******"
 *     placeholder="******"
 *     avatar="mm"
 *     avatarForce={false}
 *     meta={['nick', 'mail', 'link']}
 *     pageSize={10}
 *     lang="zh-CN"
 *     visitor={false}
 *     highlight={true}
 *     recordIP={false}
 *     serverURLs="http[s]://[tab/us].avoscloud.com"
 *     emojiCDN=""
 *     emojiMaps={null}
 *     enableQQ={false}
 *     requiredFields={[]}
 *     jsUrl="/path/to/Valine.js" />
 */
class Valine extends Component {
  render() {
    const {
      appId,
      appKey,
      placeholder,
      avatar = 'mm',
      avatarForce = false,
      meta = ['nick', 'mail', 'link'],
      pageSize = 10,
      lang = 'zh-CN',
      visitor = false,
      highlight = true,
      recordIP = false,
      serverURLs = '',
      emojiCDN = '',
      emojiMaps = null,
      enableQQ = false,
      requiredFields: fields = [],
      jsUrl,
    } = this.props;
    if (!appId || !appKey) {
      return (
        <div class="notification is-danger">
          You forgot to set the <code>app_id</code> or <code>app_key</code> for Valine. Please set
          it in <code>_config.yml</code>.
        </div>
      );
    }
    const js = `new Valine({
            el: '#valine-thread' ,
            appId: ${JSON.stringify(appId)},
            appKey: ${JSON.stringify(appKey)},
            ${placeholder ? `placeholder: ${JSON.stringify(placeholder)},` : ''}
            ${avatar ? `avatar: ${JSON.stringify(avatar)},` : ''}
            ${avatarForce ? `avatarForce: ${JSON.stringify(avatarForce)},` : ''}
            ${meta ? `meta: ${JSON.stringify(meta)},` : ''}
            ${pageSize ? `pageSize: ${JSON.stringify(pageSize)},` : ''}
            ${lang ? `lang: ${JSON.stringify(lang)},` : ''}
            ${visitor ? `visitor: ${JSON.stringify(visitor)},` : ''}
            ${highlight ? `highlight: ${JSON.stringify(highlight)},` : ''}
            ${recordIP ? `recordIP: ${JSON.stringify(recordIP)},` : ''}
            ${serverURLs ? `serverURLs: ${JSON.stringify(serverURLs)},` : ''}
            ${emojiCDN ? `emojiCDN: ${JSON.stringify(emojiCDN)},` : ''}
            ${emojiMaps ? `emojiMaps: ${JSON.stringify(emojiMaps)},` : ''}
            ${enableQQ ? `enableQQ: ${JSON.stringify(enableQQ)},` : ''}
            ${Array.isArray(fields) ? `requiredFields: ${JSON.stringify(fields)},` : ''}
        });`;
    return (
      <Fragment>
        <div id="valine-thread" class="content"></div>
        <script src="//cdn1.lncld.net/static/js/3.0.4/av-min.js"></script>
        <script src={jsUrl}></script>
        <script dangerouslySetInnerHTML={{ __html: js }}></script>
      </Fragment>
    );
  }
}

/**
 * Cacheable Valine comment JSX component.
 * <p>
 * This class is supposed to be used in combination with the <code>locals</code> hexo filter
 * ({@link module:hexo/filter/locals}).
 *
 * @see module:util/cache.cacheComponent
 * @example
 * <Valine.Cacheable
 *     comment={{
 *         app_id="******"
 *         app_key="******"
 *         placeholder="******"
 *         avatar="mm"
 *         avatar_force={false}
 *         meta={['nick', 'mail', 'link']}
 *         page_size={10}
 *         lang="zh-CN"
 *         visitor={false}
 *         highlight={true}
 *         record_ip={false}
 *         server_urls="http[s]://[tab/us].avoscloud.com"
 *         emoji_cdn=""
 *         emoji_maps={null}
 *         enable_qq={false}
 *         required_fields={[]}
 *     }}
 *     helper={{ cdn: function() {...} }} />
 */
Valine.Cacheable = cacheComponent(Valine, 'comment.valine', (props) => {
  const { comment, helper, page, config } = props;

  return {
    appId: comment.app_id,
    appKey: comment.app_key,
    placeholder: comment.placeholder,
    avatar: comment.avatar,
    avatarForce: comment.avatar_force,
    meta: comment.meta,
    pageSize: comment.page_size,
    lang: comment.lang || page.lang || page.language || config.language || 'zh-CN',
    visitor: comment.visitor,
    highlight: comment.highlight,
    recordIP: comment.record_ip,
    serverURLs: comment.server_urls,
    emojiCDN: comment.emoji_cdn,
    emojiMaps: comment.emoji_maps,
    enableQQ: comment.enable_qq,
    requiredFields: comment.required_fields,
    jsUrl: '/js/imaegoo/valine.js',
  };
});

module.exports = Valine;
