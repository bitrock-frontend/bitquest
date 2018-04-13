;( (window) => {

  const defaults = (target, obj) => {
    for (let prop in obj) target[prop] = target[prop] || obj[prop]
  }

  const getQuery = (queryParams) => {
    const arr = Object.keys(queryParams).map( (k) => {
      return k + '=' + encodeURIComponent(queryParams[k])
    })
    return '?' + arr.join('&')
  }

  const _fetch = (method, url, opts, data, queryParams) => {
    opts.method = method
    opts.headers = opts.headers || {}
    opts.responseAs = (opts.responseAs && ['json', 'text', 'response'].indexOf(opts.responseAs) >= 0) ? opts.responseAs : 'json'

    defaults(opts.headers, {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    queryParams ? url += getQuery(queryParams) : url;

    data ? opts.body = JSON.stringify(data) : delete opts.body;

    return fetchival.fetch(url, opts)
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          if(opts.responseAs=="response")
            return response
          if (response.status == 204)
            return null;
          return response[opts.responseAs]();
        }
        const err = new Error(response.statusText)
        err.response = response
        throw err
      });
  }

  const fetchival = (url, opts = {}) => {

    const _ = (u, o = {}) => {
      // Extend parameters with previous ones
      const _u = `${url}/${u}`;
      defaults(o, opts)
      return fetchival(_u, o)
    }

    _.get = (queryParams) => _fetch('GET', url, opts, null, queryParams);

    _.post = (data) => _fetch('POST', url, opts, data);

    _.put =  (data) => _fetch('PUT', url, opts, data);

    _.patch = (data) => _fetch('PATCH', url, opts, data);

    _.delete = () =>  _fetch('DELETE', url, opts);

    return _;
  }

  // Expose fetch so that other polyfills can be used
  // Bind fetch to window to avoid TypeError: Illegal invocation
  fetchival.fetch = typeof fetch !== 'undefined' ? fetch.bind(window) : null

  // Support CommonJS, AMD & browser
  if (typeof exports === 'object')
    module.exports = fetchival
  else if (typeof define === 'function' && define.amd)
    define(function() { return fetchival })
  else
    window.fetchival = fetchival

})(typeof window != 'undefined' ? window : undefined);
