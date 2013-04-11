# Node-Run-Qunit

Often you want to run your browser tests but get results in node - for
use in a CI system for example. This module serves your tests, injects
code to report back, and will call a callback whenever the tests finish.

## API
```javascript
var q = require('run-qunit')

q.start({}, function(results){
  // This function is called every time a browser finishes the tests.

  console.log(results.passed, results.failed, results.tracebacks); // &c...
})

q.close() // Kill the server

```
