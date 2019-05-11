"use strict"

const home = require('./.next/serverless/pages/index.js');
const about = require('./.next/serverless/pages/about.js');

module.exports = (context) => {
  const contentPath = `${__dirname}/static`;
  const defaultPath = `${__dirname}/static/404.html`;

  if (context.event.method !== 'GET') {
    return context.status(400).fail('Bad Request');
  }

  context.servePages({
    '/': home,
    '/about': about,
  });

  // Everything not served as Next.js pages will be served as static
  context.setCustomFolder(contentPath, defaultPath); // optional
  context.serveStatic();
}

// TODO: define your function name in next.config.js so _next calls are prefixed with it.
// In case there is a proxy in front of your function, it may not be necessary.