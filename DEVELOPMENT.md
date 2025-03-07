# WMCS toolforge image building 
## Buildpack configuration
See https://github.com/heroku/buildpacks-nodejs
Added engines section to package.json

## tutorial
Generic: https://wikitech.wikimedia.org/wiki/Help:Toolforge/Building_container_images#Supported_languages
Deployment on heroku https://blog.md.engineer/vite-heroku-clkmnkq8h000709l7hxqe689p using serve

Node specific tutorial is currently missing but based on what I read this should work:
* Adding a Procfile with a web line e.g. "web: npm start" where package.json has the following:

```
    "scripts": {
        "start": "serve -s dist"
    },

```

I'm assuming that the nodejs container is set up to build the nodejs project by default.

Given that, this should work:
```
$ become mytool
$ toolforge build start https://github.com/dpriskorn/topic-creator-frontend.git --envvar USE_NPM_INSTALL
$ # wait until command finishes
```

### Background:
https://devcenter.heroku.com/articles/buildpacks


# Code formatting
see https://dev.to/drunckj/setting-up-code-formatting-with-eslint-typescript-and-prettier-in-visual-studio-code-44an

also:
 Set Prettier as Default Formatter

    Open VS Code Settings (Ctrl+, or Cmd+, on Mac).
    Search for "editor.defaultFormatter".
    Set it to Prettier.

also: 
see other settings when searching for "format"