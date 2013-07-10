//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , port = (process.env.PORT || 3000)
    , FB = require('fb')
    , config = require('./config')
    , Step = require('step');

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.set('view engine', 'ejs');
    server.use(express.logger());
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

//Setup FB
FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri
});

///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req, res){
   var accessToken = req.session.access_token;
   if(!accessToken){
        res.render( 'login', {
            loginUrl: FB.getLoginUrl({scope: 'user_about_me'})
        });
   } else {
        res.render('index');
   }
});

server.get('/login/callback', function(req, res, next) {
  var code = req.query.code;
  console.log(code);

  if(req.query.error) {
    return res.send('login-error' + req.query.error_description);
  } else if (!code) {
    return res.redirect('/');
  }


  Step(
    function exchangeCodeForAccessToken() {
      console.log(FB.options('appSecret'));
      FB.napi('oauth/access_token',  {
        client_id: FB.options('appId'),
        client_secret: FB.options('appSecret'),
        redirect_uri: FB.options('redirectUri'),
        code: code
      }, this);
    },
    function extendAccessToken(err, result) {
      console.log(err);
      FB.napi('oauth/access_token', {
        client_id:          FB.options('appId'),
        client_secret:      FB.options('appSecret'),
        grant_type:         'fb_exchange_token',
        fb_exchange_token:  result.access_token
      }, this);
    },
    function (err, result) {
      console.log(result);
      if(err) console.log(err);   

      req.session.access_token    = result.access_token;
      req.session.expires         = result.expires || 0;

      if(req.query.state) {
        var params = JSON.parse(req.query.state);
        params.access_token = req.session.access_token;

        console.log(params);

         FB.api('me', params, function (result) {
            console.log(result);
            if(!result || result.error) {
                return res.send(500, result || 'error');
                // return res.send(500, 'error');
            }

            return res.redirect('/');
        });
      } else {
          return res.redirect('/');
      }
    }
  );
});

//NEXT UP: A route for getting recent posts

//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});


function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
