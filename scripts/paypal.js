const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

hexo.extend.tag.register('paypal', () => {
  const htmlTmlSrc = path.join(__dirname, '..', 'layout', 'paypal.ejs');
  const htmlTml = ejs.compile(fs.readFileSync(htmlTmlSrc, 'utf-8'));
  return htmlTml({});
});
