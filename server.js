var connect = require('connect')
  , http = require('http')
  , fs = require('fs')

var server;

module.exports = {
    start: function(opts, results, cb){
      var app = connect()

      app.use(connect.bodyParser());

      app.use(function(req, res, next){
        if (req.url == '/strider-report'){
          results(req.body);
          return res.end("Results received")

        } else if (/\/test\/index\.html/.test(req.url)){
          console.log("!!>> Strider serve test", req.url)
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
