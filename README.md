OpenFaaS Next.js Serverless Mode template
=============================================

> Template based on [Node.js 10 Express Template for OpenFaaS](https://github.com/openfaas-incubator/node10-express-template)

This template provides additional context and control over the HTTP response from your function. Using this context as base, this template also provides a builtin setup for Next.js on serverless mode.

## Status of the template

The template makes use of the OpenFaaS incubator project [of-watchdog](https://github.com/openfaas-incubator/of-watchdog).

## Supported platforms

* x86_64 - `serverless-nextjs`

## Trying the template

```
$ faas template pull https://github.com/johnnyeric/openfaas-serverless-nextjs-template
$ faas new --lang serverless-nextjs
```

## Example usage

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

### Redirect (setting Location header):

```js
"use strict"

module.exports = (context) => {
  context
    .headers({'Location': 'https://www.google.com/'})
    .status(307)    // Temporary
    .succeed('Page has moved.')
}
```


### Path-based routing (multiple-handlers):

```js
"use strict"

module.exports = (context) => {
  if (context.event.path == "/login") {
      return login(context);
  }

  return context
        .status(200)
        .succeed('Welcome to the homepage.')
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
