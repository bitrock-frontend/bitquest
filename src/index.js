'use strict';

const types = ['json', 'text', 'response'];

const checkTypes = response => response && types.indexOf(response) >= 0;

const getQuery = queryParams => {
  const arr = Object.keys(queryParams).map(key => {
    return `${key}=${encodeURIComponent(queryParams[key])}`;
  });
  return '?' + arr.join('&');
};

const bitquest = (url, opts = {}) => {
  const _ = (u, o = {}) => {
    // Extend parameters with previous ones
    const _u = `${url}/${u}`;
    const _opts = Object.assign({}, o, opts);
    return bitquest(_u, _opts);
  };

  _.get = queryParams => _fetch('GET', url, opts, null, queryParams);

  _.post = data => _fetch('POST', url, opts, data);

  _.put = data => _fetch('PUT', url, opts, data);

  _.patch = data => _fetch('PATCH', url, opts, data);

  _.delete = () => _fetch('DELETE', url, opts);

  return _;
};

const _fetch = (method, url, opts, data, queryParams) => {
  opts.method = method;
  opts.headers = opts.headers || {};
  opts.responseAs = checkTypes(opts.responseAs) ? opts.responseAs : 'json';

  opts.headers = Object.assign({}, opts.headers, {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  });

  queryParams ? url += getQuery(queryParams) : url;

  data ? opts.body = JSON.stringify(data) : opts.body = undefined;

  return bitquest.fetch(url, opts)
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        if (opts.responseAs === 'response') {
          return response;
        }
        if (response.status === 204) {
          return null;
        }
        return response[opts.responseAs]();
      }
      const err = new Error(response.statusText);
      err.response = response;
      throw err;
    });
};

// Expose fetch so that other polyfills can be used
// Bind fetch to window to avoid TypeError: Illegal invocation
if (typeof fetch !== 'undefined') {
  bitquest.fetch = fetch.bind(window);
}

// Support CommonJS, AMD & browser
if (typeof exports === 'object') {
  module.exports = bitquest;
} else {
  window.bitquest = bitquest;
}
