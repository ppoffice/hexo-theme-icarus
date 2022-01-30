/**
 * Bulma Message Tag, see {@link https://bulma.io/documentation/components/message/}.
 *
 * @param {string} color    The color of this message, can not be set. Usable: dark, primary, link, info, success,
 *                          warning, danger.
 * @param {string} icon     The icon of this message, can not be set.
 * @param {string} title    The header of this message, can not be set, supported Markdown.
 * @param {string} size     The size of this message, can not be set. Usable: small, medium, large. The default
 *                          size is between small and medium.
 *
 * @example
 * {% message color:danger icon:info-circle 'title:Very danger!' size:small %}
 *     **You are in danger.**
 * {% endmessage %}
 */
module.exports = function(hexo) {
    hexo.extend.tag.register('message', (args, content) => {
        let color = 'dark';
        let icon = '';
        let title = '';
        let size = '';
        let header = '';

        args.forEach(element => {
            const key = element.split(':')[0].trim();
            const value = element.split(':')[1].trim();
            if (value !== null && value !== undefined && value !== '') {
                switch (key) {
                    case 'color':
                        color = value;
                        break;
                    case 'icon':
                        icon = `<i class="fas fa-${value} mr-2"></i>`;
                        break;
                    case 'title':
                        title = value;
                        break;
                    case 'size':
                        size = ` is-${value}`;
                        break;
                }
            }
        });
        if (icon !== '' || title !== '') {
            header = `
            <div class="message-header">
                ${hexo.render.renderSync({text: icon + title, engine: 'markdown'})}
            </div>
            `;
        }

        return `
        <article class="message is-${color}${size}">
            ${header}
            <div class="message-body">
            ${hexo.render.renderSync({text: content, engine: 'md'})}
            </div>
        </article>
        `;
    }, { ends: true });
};
