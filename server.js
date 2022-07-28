const express = require('express');
const app = express();
const { join } = require("path");
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `dev-kingsley.us.auth0.com/.well-known/jwks.json`
  }),

  audience: 'https://dev-kingsley.us.auth0.com/api/v2/',
  issuer: [`dev-kingsley.us.auth0.com`],
  algorithms: ['RS256']
});
var options = {
  customScopeKey: 'permissions'
};
const checkScopes = jwtAuthz([ 'read:protected' ], options);

// display user profile with protected route (authentication) 
app.get('/profile', checkScopes, (request, response) => {
  response.send(JSON.stringify(request.oidc.user));
});

/*
app.get('/api/open', function(req, res) {
  console.log("/api/open");
  res.json({
    message: "Open Endpoint"
  });
});

app.get('/api/members-only', checkJwt, function(req, res){
  console.log("/api/members-only")
  res.json({
    message: 'Members Only Endpoint'
  });
})

app.get('/api/protected', checkJwt, checkScopes, function(req, res) {
  console.log("/api/protected")
  res.json({
    message: 'Protected Endpoint'
  });
});
*/

app.use(express.static(join(__dirname, "public")));
app.listen(3000);
console.log('Listening on http://localhost:3000');