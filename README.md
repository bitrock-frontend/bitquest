# Bitquest [![Build Status](https://travis-ci.org/bitrock-frontend/bitquest.svg?branch=master)](https://travis-ci.org/bitrock-frontend/bitquest)

> Makes writing JSON requests with [fetch](https://github.com/github/fetch) easier, in Bitrock style!

Bitquest is a tiny (0.5kb min/gz) fetch wrapper that can be used in the __browser__ (IE11+) and __Node__.

__Before__

```javascript
// POST /users
fetch('/users', {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Typicode',
    login: 'typicode',
  })
})
.then(function(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  }
  throw new Error(response.statusText)
})
.then(function(json) {
  // ...
})
```

__After__

```javascript
// POST /users
bitquest('/users').post({
  name: 'Typicode',
  login: 'typicode'
})
.then(function(json) {
  // ...
})
```

`.get()`, `.put()`, `.patch()` and `.delete()` methods are also available.

## Installation

Bitquest is available on NPM.

__Browser__
```bash
npm install es6-promise whatwg-fetch # polyfills
npm install fetchival
```

__Node__

```bash
npm install node-fetch fetchival --save
```

## Usage examples

```javascript
const posts = bitquest('/posts')

//posts
posts.get()
posts.post({ title: 'Bitquest' })

//posts?category=javascript
posts.get({ category: 'javascript' })

//posts/1
posts(1).get()
posts(1).put({ title: 'Bitquest is simple' })
posts(1).patch({ title: 'Bitquest is simple' })
posts(1).delete()

const comments = posts('1/comments')

//posts/1/comments
comments.get()

//posts/1/comments/1
comments(1).get()
```

You can also pass fetch options to `bitquest()`

```javascript
const posts = bitquest('/posts', fetchOptions)
const comments = posts('1/comments') // Will inherit fetchOptions
```

To catch errors

```javascript
bitquest('/posts')
  .get()
  .catch(function(err) {
    console.log(err)
  })
```

To enable CORS

```javascript
const request = bitquest('/', { mode: 'cors' })
const posts = request('posts')
```

To fetch plain text (for example, HTML views)

```javascript
const request = bitquest('/', { responseAs: 'text' })
const posts = request('posts')
```

`responseAs` can be `response`, `text` or `json` (default)

To use bitquest in Node, you need to install `node-fetch` and configure fetchival to use it

```javascript
const bitquest = require('bitquest')
bitquest.fetch = require('node-fetch')
```

## Browser Support

Chrome | Firefox | IE | Opera | Safari | Edge
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | 11 ✔ | Latest ✔ | 6.1+ ✔ | Latest ✔ |

## Forking fetchival
We forked the [original project Fetchival](https://github.com/typicode/fetchival) because we liked the idea of using standard Fetch API with a thin layer on top of it to avoid boilerplate on projects, but we needed to have it fashioned on our code style & worfklow.

Notable changes from fetchival are:

* the name
* removed browser version (*you can build it from source if you need it*) and Bower package
* main code refactored in Typescript with a bit more functional approach
* tests have been refactored to Ava.js
* add code linting with XO


## License
MIT
