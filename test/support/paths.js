const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '../..');
const TMP_DIR = path.join(REPO_ROOT, 'test/.tmp');
const FIXTURE_SITE = path.join(REPO_ROOT, 'test/fixtures/site');

module.exports = { REPO_ROOT, TMP_DIR, FIXTURE_SITE };
