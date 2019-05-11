OpenFaaS Next.js Serverless Mode template
=============================================

> Template based on [Node.js 10 Express Template for OpenFaaS](https://github.com/openfaas-incubator/node10-express-template)

This template is built upon the additional context provided by the `Node.js 10 express` template in order to provide an easy setup for Next.js on serverless mode.

## Status of the template

The template makes use of the OpenFaaS incubator project [of-watchdog](https://github.com/openfaas-incubator/of-watchdog).

## Supported platforms

* x86_64 - `serverless-nextjs`

## Trying the template

```
$ faas template pull https://github.com/johnnyeric/openfaas-serverless-nextjs-template
$ faas new --lang serverless-nextjs
```

## Custom paths setup

### Parameters

The template allows the customization of two parameters:

#### Assets folder path

This is the folder that holds assets. Assets are served from the root of the function url. That way, when filename is placed at the function url it will be fetched from this folder.

```
Example: HTTP GET /function/serverless-nextjs/openfaas.png
Default value: `${__dirname}/static`
```

#### Default path

Path to the static html file that should be presented when no other route is matched.

```
Example: HTTP GET /function/serverless-nextjs/non-existent
Default:  `${__dirname}/static/404.html`
```

### Change parameter values

In order to change the default parameters you need to execute a function call.

```
const assetsPath = `${__dirname}/new-static-folder`;
const defaultPath = `${__dirname}/new-static-folder/404.html`;

// define custom paths
context.setCustomFolder(assetsPath, defaultPath);
```

## Example usage

> The following examples show how to setup React components as serverless pages with Next.js. Also, it is important to note that it is possible to use features from the `Node.js 10 express` template to create complex flows as some of the examples make usage of the context. The only difference is that the `event` object lives inside the `context` in this template.

### Next.js Serverless Pages with custom assets

```js
"use strict"

const home = require('./.next/serverless/pages/index.js');
const about = require('./.next/serverless/pages/about.js');

module.exports = (context) => {
    const contentPath = `${__dirname}/static`;
    const defaultPath = `${__dirname}/static/404.html`;

    context.servePages({
        '/': home,
        '/about': about,
    });

    // Everything not served as Next.js pages will be served as static
    context.setCustomFolder(contentPath, defaultPath); // optional
    context.serveStatic();
}
```

### Accept only HTTP GET and custom HTTP status code

```js
"use strict"

const home = require('./.next/serverless/pages/index.js');
const about = require('./.next/serverless/pages/about.js');

module.exports = (context) => {

    if (context.event.method !== 'GET') {
        return context.status(400).fail('Bad Request');
    }

    context.servePages({
        '/': home,
        '/about': about,
    });

    context.serveStatic();
}
```


### Path-based routing (multiple-handlers):

```js
"use strict"

const home = require('./.next/serverless/pages/index.js');

module.exports = (context) => {
    if (context.event.path == "/login") {
        return login(context);
    }

    context.servePages({
        '/': home,
    });

    context.serveStatic();
}

function login(context) {
    return context
        .status(200)
        .succeed('Please log in.')
}
```

Other reference:

* `.status(code)` - overrides the status code used by `fail`, or `succeed`
* `.fail(object)` - returns a 500 error if `.status(code)` was not called prior to that
* `.succeed(object)` - returns a 200 code if `.status(code)` was not called prior to that
