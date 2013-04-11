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
}

var cb = function(){} // called after server is started.

q.start(opts, function(results){
  // This function is called every time a browser finishes the tests.

  console.log(results.passed, results.failed, results.tracebacks); // &c...
}, cb)

q.close() // Kill the server

```



