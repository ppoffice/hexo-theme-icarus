const assert = require('assert').strict;
const fs = require('fs');
const os = require('os');
const path = require('path');
const { SchemaLoader } = require('hexo-component-inferno/lib/core/schema');
const { REPO_ROOT } = require('../support/paths');

const schemaDir = path.join(REPO_ROOT, 'include/schema');
const rootSchema = require('../../include/schema/config.json');
const profileSchema = require('hexo-component-inferno/lib/schema/widget/profile.json');

describe('Profile schema resolution', () => {
    it('uses the library fallback for the unchanged widget reference', () => {
        assert.equal(fs.existsSync(path.join(schemaDir, 'widget/profile.json')), false);
        const loader = SchemaLoader.load(rootSchema, schemaDir);
        assert.equal(loader.getSchema('/widget/profile.json').def, profileSchema);
        assert.ok(require('../../include/schema/common/widgets.json').items.oneOf.some(option => option.$ref === '/widget/profile.json'));
    });

    it('validates existing options through the full theme configuration schema', () => {
        const schema = SchemaLoader.load(rootSchema, schemaDir).getSchema('/config.json');
        const valid = widget => schema.validate({ version: '5.1.0', widgets: [Object.assign({ type: 'profile', position: 'left' }, widget)] }) === true;
        for (const widget of [{}, { avatar: null }, { avatar: '/me.png', gravatar: 'a@example.com', avatar_rounded: true },
            { author: null, author_title: 'Writer', location: 'London', follow_link: '/follow/', social_links: {
                Blog: '/blog/', GitHub: { icon: 'fab fa-github', url: 'https://github.com/author' }
            } }]) {
            assert.ok(valid(widget), JSON.stringify(widget));
        }
        for (const widget of [{ avatar: 42 }, { avatar_rounded: 'true' }, { gravatar: 123 }, { follow_link: [] }]) {
            assert.equal(valid(widget), false, JSON.stringify(widget));
        }
    });

    it('still gives an explicit same-id theme schema priority over the library', () => {
        const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'icarus-profile-schema-'));
        try {
            fs.mkdirSync(path.join(directory, 'widget'));
            const override = Object.assign({}, profileSchema, {
                properties: Object.assign({}, profileSchema.properties, { local_only: { type: 'string' } }),
                required: profileSchema.required.concat('local_only')
            });
            fs.writeFileSync(path.join(directory, 'widget/profile.json'), JSON.stringify(override));
            const loader = SchemaLoader.load(rootSchema, [directory, schemaDir]);
            assert.deepEqual(loader.getSchema('/widget/profile.json').def, override);
            const schema = loader.getSchema('/config.json');
            assert.equal(schema.validate({ version: '5.1.0', widgets: [{ type: 'profile', position: 'left', local_only: 'theme' }] }), true);
            assert.notEqual(schema.validate({ version: '5.1.0', widgets: [{ type: 'profile', position: 'left' }] }), true);
            assert.equal(SchemaLoader.load(rootSchema, schemaDir).getSchema('/widget/profile.json').def, profileSchema);
        } finally {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    });
});
