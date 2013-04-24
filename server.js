var connect = require('connect')
  , http = require('http')
  , fs = require('fs')

var server;

// URL jobID regex
var regex = /^\/(.*?)\//; //Smallest possible first url segment;

module.exports = {
    start: function(opts, results, cb){
      var app = connect()
        , testfileregex = new RegExp(opts.testfile);

      app.use(connect.bodyParser());

      if (opts.useID){
        app.use(function(req, res, next){
          req.origUrl = req.url;
          var m = regex.exec(req.url)
          req.jobID = m && m[1];
          if (req.jobID){
            req.url = req.url.replace(regex, '/')
          }
          next();
        })
      }

      if (opts.middleware){
        if (opts.middleware.length){
          opts.middleware.forEach(function(m){
            app.use(m)
          })
        } else {
          app.use(opts.middleware);
        }
      }


      app.use(function(req, res, next){

        if (req.url == '/strider-progress'){
          var data = JSON.parse(req.body.data)
            , m = regex.exec(data.url)
          data.id = m ? m[1] : undefined; 

          if (opts.progressCB){
            opts.progressCB(null, data);
          }
          return res.end("Progress..");

        } else if (req.url == '/strider-report'){
          var data = JSON.parse(req.body.data)
            , m = regex.exec(data.url)
          data.id = m ? m[1] : undefined;

          if (data.tracebacks) {
            for (var i = 0; i<data.tracebacks.length; i++){
              data.tracebacks[i] = JSON.parse(data.tracebacks[i])
            }
          }

          results(data);
          return res.end("Results received")

        } else if (testfileregex.test(req.url)){
          var f = fs.readFileSync(opts.testfile, 'utf8')
          // Replace body close tag with script, body
          f = f.replace(/(.*)<\/body>/,
              "$1<script type='text/javascript'>" + 
                  fs.readFileSync(__dirname + "/qunit-plugin.js", "utf8") + 
                "</script></body>");
          return res.end(f);
        }

        if (/\.php$/.test(req.url)){
          console.log("PHP: " + req.url);
        }

        return next();
      });
      

      app.use(connect.static(opts.testdir))
      server = http.createServer(app)
      server.listen(opts.port);
      cb();
    }


  , open: function(){return !!server}

  , close: function(){
    if(server){
      server.close();
      server = null;
    }
  }
}
