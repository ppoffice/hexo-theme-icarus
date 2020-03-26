# Contributing Guidelines

## Code styles

Please refer to the [.eslintrc.json](https://github.com/ppoffice/hexo-theme-icarus/blob/master/.eslintrc.json).
You can also use `npm run lint` or `yarn lint` to fix code style issues.

## Project versioning

We use [SemVer](http://semver.org/) for versioning.
Any changes to the code base should not be released using an existing version.

## Commit message format

The commit message should follow the [Bluejava commit message format](https://github.com/bluejava/git-commit-guide).
The supported scopes are:

- **core** for changes related to Hexo extensions and Icarus-specific functions
- **comment** for comment plugin layout, schema, style, or script changes
- **share** for share plugin layout, schema, style, or script changes
- **donate** for donation plugin layout, schema, style, or script changes
- **search** for search plugin layout, schema, style, or script changes
- **widget** for widget layout, schema, style, or script changes
- **plugin** for other plugin layout, schema, style, or script changes
- **i18n** for adding or updating translations
- **test** for testing or linting-related commits
- **build** for build scripts, CI, other development or deployment related commits
- use __\*__ or leave empty to refer to commits that do not have a clear scope

## Submit changes

1. Fork this repository, make changes to it, and run it against some actual Hexo sites to see if 
anything is broken.
You should also run `npm run lint` or `yarn lint` to find and fix any code formatting issue.
2. Submit a pull request to our repository. Please make sure you followed the instructions
above.
3. We will review the pull request regularly and inform you of our questions and any changes 
that need to be made before we can merge your pull request.
4. We expect your response within two weeks, after which your pull request may be closed if
no activity is shown.
