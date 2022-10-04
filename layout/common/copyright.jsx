const { Component } = require('inferno');

module.exports = class extends Component {
    render() {
        const { page, config } = this.props;
		const { article } = config;
		
		const isCopy =  page.copy_from // 是否为转载的文章
		const url = isCopy ? page.copy_from : page.permalink // 来源链接地址
		
       if (article.copyright == 'false') {
			return null;
		}
        return <div class={'copyright article-block ' + (isCopy ? 'type-1' : 'type-2') }>
		    { !isCopy ? <p>版权申明：本文为原创文章，转载请注明原文出处</p> : null }
		    <p>原文链接：<a href={ url } target="_blank">{ url }</a></p>
		</div>;
    }
};
