This is a cheatsheet I created for myself when learning Node / Express. Relatively simple stuff here but it helps me out.

* **declare Express**
  * `const express = require('express')`
  * `const app = express()`
* **import JSON file**
  * `const myData = require('./myFile.json')` // it's that easy!
* **use global template variables**
  * in app:
    * `app.locals.myVariable = 'hello moto'`
    * `app.locals.myHtmlVariable = '<p>hello moto</p>'`
  * in template:
    * `<%= myVariable %>`
    * `<%- myHtmlVariable %>` // this way doesn't escape HTML characters
* **Router**
  * in app:

        app.get('/monkey/:monkeyName', (req, res) => {
          // .render() looks in 'views' folder; '.ejs' is OPTIONAL:
          res.render('myTemplate', {
            let thisMonkey = req.params.monkeyName
            title: 'Monkey Page',
            className: 'monkey',
            funkyArray: ['harry, 'barry', 'mary']
          })
        })

* **variables in template**
  * `<body class="<%= myTitle %>">`
  * `<h1><%= myTitle %></h1>`
  * `<ul><% funkyArray.forEach(funk => %><li><%= funk %></li><% ) %></ul>`
* **ejs template includes**
  * `<% include partials/page/header.ejs %>` // note the lack of parens, and no dot-slash in front
* **`require`**
  * in parent:
    * `const myImportedVar = require('./some_module')`
  * in module:
    * type A (using empty `module.exports` object):
      * `exports.anything1 = something1` // exports is an alias of module.exports
      * `exports.anything2 = something2`
    * type B (overwriting `module.exports` object):
      * `anything = whatever_you_want`
      * `module.exports = whatever_you_want` // module.exports gets overridden and returned to caller