'use strict';

import test from 'ava';
import fetch from 'node-fetch';
import fetchival from './../src/index';

fetchival.fetch = fetch;

const requestJSON = fetchival('http://jsonplaceholder.typicode.com', {
  mode: 'cors',
  headers: { 'X-TEST': 'test' }
});

const requestText = fetchival('http://jsonplaceholder.typicode.com', {
  mode: 'cors',
  headers: { 'X-TEST': 'test' },
  responseAs: 'text'
});

const textSuite = 'requestText(posts) [text]';
const jsonSuite = 'requestJSON(posts) [json]';

test(`${textSuite} - should #get()`, t => {
  const postsStr = requestText('posts');
  
  return postsStr
    .get()
    .then(data => t.is(data.substring(0, 1), '['))
    .catch(t)
});

test(`${jsonSuite} - should #get()`, t => {
  const posts = requestJSON('posts');

  return posts
    .get()
    .then(arr => t.truthy(arr.length))
    .catch(t)
});

test(`${jsonSuite} - should #get(1)`, t => {
  const posts = requestJSON('posts');

  return posts(1)
    .get()
    .then(obj => t.truthy(obj.title))
    .catch(t)
});