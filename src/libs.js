'use strict';

export const defaults = (target, obj) => {
  for (let prop in obj) target[prop] = target[prop] || obj[prop];
  return target;
}

export const getQuery = (queryParams) => {
  const arr = Object.keys(queryParams).map((k) => {
    return k + '=' + encodeURIComponent(queryParams[k])
  })
  return '?' + arr.join('&')
}