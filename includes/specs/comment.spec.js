const { doc, type, defaultValue, required, requires } = require('../common/utils').descriptors;

const ChangYanSpec = {
    appid: {
        [type]: 'string',
        [doc]: 'Changyan comment app ID',
        [required]: true,
        [requires]: comment => comment.type === 'changyan'
    },
    conf: {
        [type]: 'string',
        [doc]: 'Changyan comment configuration ID',
        [required]: true,
        [requires]: comment => comment.type === 'changyan'
    }
};

const DisqusSpec = {
    shortname: {
        [type]: 'string',
        [doc]: 'Disqus shortname',
        [required]: true,
        [requires]: comment => comment.type === 'disqus'
    }
};

const GitmentGitalkSpec = {
    owner: {
        [type]: 'string',
        [doc]: 'GitHub user ID',
        [required]: true,
        [requires]: comment => comment.type === 'gitment' || comment.type === 'gitalk'
    },
    repo: {
        [type]: 'string',
        [doc]: 'GitHub repo name to store comments',
        [required]: true,
        [requires]: comment => comment.type === 'gitment' || comment.type === 'gitalk'
    },
    client_id: {
        [type]: 'string',
        [doc]: 'GitHub application client ID',
        [required]: true,
        [requires]: comment => comment.type === 'gitment' || comment.type === 'gitalk'
    },
    client_secret: {
        [type]: 'string',
        [doc]: 'GitHub application client secret',
        [required]: true,
        [requires]: comment => comment.type === 'gitment' || comment.type === 'gitalk'
    },
    admin: {
        [type]: ['string', 'array'],
        [doc]: 'GitHub repo owner and collaborators who can can initialize github issues',
        [required]: true,
        [requires]: comment => comment.type === 'gitalk',
        '*': {
            [type]: 'string',
            [required]: true
        }
    }
};

const IssoSpec = {
    url: {
        [type]: 'string',
        [doc]: 'URL to your Isso comment service',
        [required]: true,
        [requires]: comment => comment.type === 'isso'
    }
};

const LiveReSpec = {
    uid: {
        [type]: 'string',
        [doc]: 'LiveRe comment service UID',
        [required]: true,
        [requires]: comment => comment.type === 'livere'
    }
};

const ValineSpec = {
    app_id: {
        [type]: 'string',
        [doc]: 'LeanCloud APP ID',
        [required]: true,
        [requires]: comment => comment.type === 'valine'
    },
    app_key: {
        [type]: 'string',
        [doc]: 'LeanCloud APP key',
        [required]: true,
        [requires]: comment => comment.type === 'valine'
    },
    notify: {
        [type]: 'boolean',
        [doc]: 'Enable email notification when someone comments',
        [defaultValue]: false,
        [requires]: comment => comment.type === 'valine'
    },
    verify: {
        [type]: 'boolean',
        [doc]: 'Enable verification code service',
        [defaultValue]: false,
        [requires]: comment => comment.type === 'valine'
    },
    placeholder: {
        [type]: 'string',
        [doc]: 'Placeholder text in the comment box',
        [defaultValue]: 'Say something...',
        [requires]: comment => comment.type === 'valine'
    }
};

module.exports = {
    [type]: 'object',
    [doc]: 'Comment plugin settings\nhttp://ppoffice.github.io/hexo-theme-icarus/categories/Configuration/Comment-Plugins',
    type: {
        [type]: 'string',
        [doc]: 'Name of the comment plugin',
        [defaultValue]: null
    },
    ...ChangYanSpec,
    ...DisqusSpec,
    ...GitmentGitalkSpec,
    ...IssoSpec,
    ...LiveReSpec,
    ...ValineSpec
}