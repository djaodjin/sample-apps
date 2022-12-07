In this tutorial, we will see how to retrieves an indentity JSON Web Token
(JWT) used in subsequent HTTP requests to authenticate with the API Gateway
(djaoapp).

We will start from tutorial vuejs/deploy where we create a VueJS application
and deploy it to the DjaoDjin hosting service.

The full source code for this tutorial is available at
https://github.com/djaodjin/sample-apps under the vuejs/auth directory.

    $ npm install axios

    $ mkdir -p src/apis
    $ cat src/apis/base.js

When we run the VueJS app on the local development machine, we notice
calling the API returns a CORS policy error.

    Access to XMLHttpRequest at 'http://localhost:8020/' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

That's because we are not running the VueJS and API on the same domain.
In order to develop locally the VueJS we will turn off enforcement of CORS
security policies on the API gateway. We will be sure to turn it back on
in production. Go to Settings > Rules, then uncheck "Add CORS headers".

XXX screenshot

