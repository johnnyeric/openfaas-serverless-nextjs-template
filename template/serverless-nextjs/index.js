// Copyright (c) Alex Ellis 2017. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

"use strict"

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const handler = require('./function/handler');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text({ type : "text/*" }));
app.disable('x-powered-by');

class FunctionEvent {
  constructor(req,res) {
    this.body = req.body;
    this.headers = req.headers;
    this.method = req.method;
    this.path = req.path;
    this.query = req.query;
    this.req = req;
    this.res = res;
  }
}

class FunctionContext {
  constructor(event, cb) {
    this.cb = cb;
    this.contentPath = `${__dirname}/function/static`;;
    this.defaultPath = `${__dirname}/404.html`;
    this.event = event;
    this.headerValues = {};
    this.shouldServeStatic = true;
    this.value = 200;
  }

  status(value) {
    if(!value) {
      return this.value;
    }

    this.value = value;
    return this;
  }

  headers(value) {
    if(!value) {
        return this.headerValues;
    }

    this.headerValues = value;
    return this;    
  }

  succeed(value) {
    let err;
    this.cb(err, value);
  }

  fail(value) {
    let message;
    this.cb(value, message);
  }

  servePages(pages) {
    const { path } = this.event;
    const page = pages[path];

    if (typeof page !== 'undefined') {
      page.render(this.event.req, this.event.res);
      this.shouldServeStatic = false;
    }
  }

  setCustomFolder(contentPath, defaultPath) {
    this.contentPath = contentPath;
    this.defaultPath = defaultPath;
  }

  serveStatic() {
    if (!this.shouldServeStatic) {
      return;
    }

    const { path } = this.event;
    
    this.headerValues['Content-Type'] = '' ;

    if (/.*\.png/.test(path)) {
      this.headerValues['Content-Type'] = 'image/png';
      return this.event.res.set(this.headers()).sendFile(`${this.contentPath}${path}`);
    } 

    if (/.*\.js/.test(path)) {
      this.headerValues['Content-Type'] = 'application/javascript';
    } else if (/.*\.css/.test(path)) {
      this.headerValues['Content-Type'] = 'text/css';
    } else if (/.*\.ico/.test(path)) {
      this.headerValues['Content-Type'] = 'image/x-icon';
    } else if (/.*\.json/.test(path)) {
      this.headerValues['Content-Type'] = 'application/json';
    } else if (/.*\.map/.test(path)) {
      this.headerValues['Content-Type'] = 'application/octet-stream';
    }

    if (path.includes('_next')) {
      this.contentPath = `${__dirname}/function${path}`.replace('_next', '.next');
    } else if (this.headerValues['Content-Type'] === '') {
      this.contentPath = this.defaultPath;
    } else {
      this.contentPath = `${this.contentPath}${path}`;
    }

    fs.readFile(this.contentPath, (err, data) => {
      if (err) {
        this
          .status(500)
          .fail(err);
  
        return;
      }
  
      const content = data.toString();

      this
        .status(200)
        .succeed(content);
    });
  }
}

var middleware = (req, res) => {
  let cb = (err, functionResult) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    if(isArray(functionResult) || isObject(functionResult)) {
      res.set(fnContext.headers()).status(fnContext.status()).send(JSON.stringify(functionResult));
    } else {
      res.set(fnContext.headers()).status(fnContext.status()).send(functionResult);
    }
  };

  let fnEvent = new FunctionEvent(req,res);
  let fnContext = new FunctionContext(fnEvent, cb);

  handler(fnContext, cb);
};

app.post('/*', middleware);
app.get('/*', middleware);

const port = process.env.http_port || 3000;

app.listen(port, () => {
  console.log(`OpenFaaS Node.js listening on port: ${port}`)
});

let isArray = (a) => {
  return (!!a) && (a.constructor === Array);
};

let isObject = (a) => {
  return (!!a) && (a.constructor === Object);
};
