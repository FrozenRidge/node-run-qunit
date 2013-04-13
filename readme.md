# Node-Run-Qunit

Often you want to run your browser tests but get results in node - for
use in a CI system for example. This module serves your tests, injects
code to report back, and will call a callback whenever the tests finish.

## API
```javascript
var q = require('run-qunit')

var opts = {
  testdir : "/path/to/your/test/directory"
, testpage : "/path/to/your/test/index.html"
, port: 8090 // Port to use for the server

, middleware: [] // Optional connect middleware to insert.
}

var cb = function(){} // called after server is started.

q.start(opts, function(results){
  // This function is called every time a browser finishes the tests.

  console.log(results.passed, results.failed, results.tracebacks); // &c...
}, cb)

q.close() // Kill the server

```

## Passing an ID

If you are testing with many browsers, you may want to pass a job id to
QUnit so that you can tell which results correspond to which browser etc.

We do this with some creative URL munging. If you enable `opts.useID = true`
then an url prefixed with a job id will be passed back to the callbacks.
An example is easier than explaining.

```javascript
q.start({useID:true}, function(results){
  console.log(results.id);
}), cb)
```

and then the test browser goes to:

```
GET /foo-job-id/test/index.html
-> Translates to:
GET /test/index.html id: foo-job-id
```

so the console log above will say `foo-job-id`






