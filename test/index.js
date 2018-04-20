'use strict';

import test from 'ava';
import fetch from 'node-fetch';
import bitquest from './../src';

bitquest.fetch = fetch;

const requestJSON = bitquest('http://jsonplaceholder.typicode.com', {
  mode: 'cors',
  headers: {'X-TEST': 'test'}
});

const requestText = bitquest('http://jsonplaceholder.typicode.com', {
  mode: 'cors',
  headers: {'X-TEST': 'test'},
  responseAs: 'text'
});

const textSuite = 'requestText(posts) [text]';
const jsonSuite = 'requestJSON(posts) [json]';

test(`${textSuite} - should #get()`, t => {
  const postsStr = requestText('posts');

  return postsStr
    .get()
    .then(data => t.is(data.substring(0, 1), '['))
    .catch(t);
});

test(`${jsonSuite} - should #get()`, t => {
  const posts = requestJSON('posts');

  return posts
    .get()
    .then(arr => t.truthy(arr.length))
    .catch(t);
});

test(`${jsonSuite} - should #get(1)`, t => {
  const posts = requestJSON('posts');

  return posts(1)
    .get()
    .then(obj => t.truthy(obj.title))
    .catch(t);
});

test(`${jsonSuite} - should #get({ query: })`, t => {
  const posts = requestJSON('posts');

  return posts
    .get({userId: 1})
    .then(arr => t.is(arr.length, 10))
    .catch(t);
});

test(`${jsonSuite} - should #post({ data: }`, t => {
  const posts = requestJSON('posts');

  return posts
    .post({title: 'foo'})
    .then(obj => t.truthy(obj.id))
    .catch(t);
});

test(`${jsonSuite} - should #put({ data: }`, t => {
  const posts = requestJSON('posts');

  return posts(1)
    .put({title: 'foo'})
    .then(obj => t.is(obj.title, 'foo'))
    .catch(t);
});

test(`${jsonSuite} - should #patch({ data: }`, t => {
  const posts = requestJSON('posts');

  return posts(1)
    .patch({title: 'foo'})
    .then(obj => t.is(obj.title, 'foo'))
    .catch(t);
});

test(`${jsonSuite} - should #delete()`, t => {
  const posts = requestJSON('posts');

  return posts(1)
    .delete()
    .then(obj => t.deepEqual(obj, {}))
    .catch(t);
});

test(`requestJSON(posts/1/comments) - should #get()`, t => {
  const posts = requestJSON('posts');
  const comments = posts(1 + '/comments');

  return comments
    .get()
    .then(arr => t.truthy(arr.length))
    .catch(t);
});

test(`requestJSON(not/found) - should fail with 404`, t => {
  const notFound = requestJSON('not/found');

  return notFound
    .get()
    .catch(err => t.is(err.response.status, 404));
});
