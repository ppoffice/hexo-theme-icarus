/** Render consent fixtures with Inferno's compiler outside Playwright's JSX hook. */
const { render, fixtureConfig } = require('./render');

(async () => {
    const fixtures = {};
    for (const type of ['opt-in', 'opt-out', 'info']) {
        const config = fixtureConfig({ plugins: {
            cookie_consent: { type },
            umami: { website_id: 'fixture-consent', script_url: 'https://analytics.example/consent.js' }
        } });
        fixtures[type] = {
            head: (await render('common/plugins', { config, head: true })).html,
            footer: (await render('common/plugins', { config, head: false })).html
        };
    }
    process.stdout.write(JSON.stringify(fixtures));
})().catch(error => {
    console.error(error);
    process.exitCode = 1;
});
