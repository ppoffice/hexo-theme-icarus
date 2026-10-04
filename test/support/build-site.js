/**
 * Child-process entry point that generates a fixture site with Hexo.
 * Usage: node build-site.js <siteDir> [extra argv such as --icarus-dont-check-config]
 *
 * Building in a separate process keeps every build isolated (fresh module caches,
 * fresh Hexo instance) and lets tests observe process.exit() calls made by the theme.
 */
const Hexo = require('hexo');

async function main() {
    const siteDir = process.argv[2];
    if (!siteDir) {
        throw new Error('Usage: node build-site.js <siteDir>');
    }
    const hexo = new Hexo(siteDir, { silent: false });
    await hexo.init();
    await hexo.call('generate', { force: true });
    await hexo.exit();
}

main().catch(err => {
    console.error(err);
    process.exitCode = 1;
});
