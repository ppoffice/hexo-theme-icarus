# Test suite

Tests for the theme's Node.js code (configuration, migrations, layouts) and for the
generated sites in a real browser. Requires Node.js 20.18 or later.

| Command | What it runs | Time |
| --- | --- | --- |
| `npm test` | unit + integration tests (mocha) | ~25 s |
| `npm run test:unit` | unit tests only | ~2 s |
| `npm run test:integration` | real Hexo builds of the fixture site | ~25 s |
| `npm run test:e2e` | browser tests (Playwright, Chromium) | ~25 s |
| `npm run test:all` | everything | ~50 s |

Browser tests need Chromium: run `npx playwright install chromium` once.

## Layout

```
test/
├── unit/          In-process tests of include/ and layout/ (JSX rendered with real Hexo helpers)
├── integration/   Hexo builds of the fixture site, checked with cheerio
├── e2e/           Playwright tests against the built sites served locally
├── fixtures/
│   ├── site/      A small Hexo site: configs, posts covering the theme's features and edge cases
│   └── variants.js  Config variations of that site (PJAX, animejs, zh-CN, one column, ...)
└── support/       Helpers: site builder, JSX renderer, output capture, knownBug()
```

- **Unit tests** render components with `test/support/render.js`. Components receive a merged
  `config` (fixture site config + fixture theme config, plus per-test overrides), a `page`, and a
  `helper` object made of Hexo's real helpers and the theme's translations.
- **Integration tests** call `getSite(variant)` from `test/support/site.js`. It copies the
  fixture site to `test/.tmp/sites/<variant>/`, applies the variant, links this repository in as
  `themes/icarus`, and runs `hexo generate` in a child process. Each variant is built once per
  test run.
- **Browser tests** build the variants listed in `test/e2e/global-setup.js` and serve each on a
  local port. They never touch the network: jQuery, moment, clipboard.js and PJAX are served from
  devDependencies pinned to the exact versions the layouts reference (`test/e2e/cdn.js`, checked
  by `test/unit/vendor.test.js`), and every other external request gets an empty response.
  Failure traces and screenshots are written to `test/.tmp/playwright-results/`.

To add a scenario, prefer a new post in `fixtures/site/source/_posts/` or a new entry in
`fixtures/variants.js` over ad-hoc setup in a test.

## Known bugs

Confirmed bugs that are not fixed yet have tests that assert the **correct** behavior and are
marked as known bugs:

- mocha: `knownBug('title', fn)` from `test/support/known-bug.js`
- Playwright: `knownBug('reason')` from `test/e2e/fixtures.js` at the top of the test

These tests pass while the bug exists and **fail once the bug is fixed**, with a message asking
to remove the marker. After a fix, turn `knownBug(...)` into `it(...)` (or drop the Playwright
`knownBug()` call) so the test becomes a regression test.

Run with `SHOW_KNOWN_BUGS=1` to see why each known-bug test currently fails (to check that it
fails for the documented reason and not because the test itself is broken):

```bash
SHOW_KNOWN_BUGS=1 npm test
SHOW_KNOWN_BUGS=1 npm run test:e2e
```

Current list:

| Area | Bug | Test |
| --- | --- | --- |
| Browser | animejs: page stays invisible if animation.js does not run | `e2e/animejs.spec.js` |
