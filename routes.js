var FB = require('fb'),
    Step = require('step'),
    config = require('./config');
//Setup FB
FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri
});

module.exports = {
    index : function(req, res){
        var accessToken = req.session.access_token;
        if(false && !accessToken){
            res.render( 'login', {
                loginUrl: FB.getLoginUrl({scope: 'user_about_me'})
            });
        } else {
            res.render('index');
        }
    },
    loginCallback: function(req, res, next){
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
                          }

                          return res.redirect('/');
                      });
                  } else {
                      return res.redirect('/');
                  }
              }
      );

    }
}
