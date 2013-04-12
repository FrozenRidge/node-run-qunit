// Here begins strider-qunit extension plugin
;(function(){

  // Tiny Ajax Post
  var post = function (url, json, cb){
    var req;

    if (window.ActiveXObject)
      req = new ActiveXObject('Microsoft.XMLHTTP');
    else if (window.XMLHttpRequest)
      req = new XMLHttpRequest();
    else
      throw "Strider: No ajax"

    req.onreadystatechange = function () {
        if (req.readyState==4)
          cb(req.responseText);
      };
    var data = "data=" + JSON.stringify(json)
    req.open("POST", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    req.setRequestHeader('Content-length',  data.length);
    req.setRequestHeader('Connection', 'close');
    req.send(data);
  }
  
  var striderErrors = [];

  QUnit.log(function(res){
    if (!res || !res.result){
      // Failure:
      striderErrors.push(JSON.stringify(res));
    }
  })

  QUnit.done(function(results){
    results.tracebacks = striderErrors;
    results.url = window.location.pathname;
    post("/strider-report", results, function(){});
  })
})();
// End Strider
