1. Go to your blog's root folder and clone Icarus into `themes/icarus`:

  ```bash
  $ git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
  ```

2. Edit your blog's `_config.yml`, change the `theme` field to `icarus` to enable this theme:

  ```yaml
  theme: icarus
  ```

3. Rename `_config.yml.example` in the theme folder to `_config.yml`.

4. (Optional) Don't forget to checkout the latest version once in a while:

  ```
  $ cd themes/icarus
  $ git pull
  ```

5. (Optional) To enable [Insight Search](https://github.com/ppoffice/hexo-theme-icarus/wiki/Search#insight-search) as your default search engine, you should also install `hexo-generator-json-content` from npm.

  ```
  $ npm install -S hexo-generator-json-content
  ```