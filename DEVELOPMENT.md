# WMCS toolforge buildpack image building 
## Buildpack configuration
See https://github.com/heroku/buildpacks-nodejs
Added engines section to package.json

According to https://devcenter.heroku.com/articles/nodejs-support#node-js-runtime 22.x should be available but it isn't in heruko-22 it seems. Setting it to 20.x to get the maintenance LTS worked.

## Test locally using pack
Make sure pack-cli-bin and docker is installed from AUR:
```
$ pack build --builder tools-harbor.wmcloud.org/toolforge/heroku-builder:22 myimage
$ docker run -e PORT=8000 -p 8000:8000 --rm --entrypoint web myimage
# navigate to http://127.0.0.1:8000 to check that it works
```

## Buildpack tutorial
Generic: https://wikitech.wikimedia.org/wiki/Help:Toolforge/Building_container_images#Supported_languages
Deployment on heroku https://blog.md.engineer/vite-heroku-clkmnkq8h000709l7hxqe689p using serve

Node specific tutorial is currently missing but based on what I read this should work:
* Adding serve to your project with `$ npm install --save serve`
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

Indeed it did work.

This is how you start it
```
$ toolforge webservice --mount=none buildservice start
```

The logs are here
```
$ toolforge webservice buildservice logs -f
```

## Update
Commit to master, then:
```
$ toolforge build start https://github.com/dpriskorn/topic-creator-frontend.git --envvar USE_NPM_INSTALL
$ toolforge webservice --mount=none buildservice restart
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