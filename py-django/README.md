Sassifying a Django application on DjaoDjin
===========================================

In this tutorial, we will see how to decode session data forwarded to
the server-side backend, and retrieve an authenticated `User`.

Prerequisites:

- URL for a Website hosted on DjaoDjin (ex: _livedemo.djaoapp.com_) -
[Register](https://www.djaodjin.com/register/)
- Access rules configured to forward HTTP requests to the application logic
server - ex: [Deploy an image from a GitHub Packages registry](https://www.djaodjin.com/docs/tutorials/devops-github-packages-registry/)

### Notes on command line snippets

On command line snippets, lines starting with a `$` character indicate
a shell prompt, or a command for you to type. Lines that do not start
with a `$` character show a sample output from that command.
Example:

```console
$ whoami
ec2-user
```

Text edits within source files are shown in universal diff format with lines
preceded by a '-' sign to be removed and lines preceded by a '+' sign to be
added. Example:

``` {.python title="diff"}
 def set_default_profile():     # This line for context, to be kept as-is
-    profile = 'abc'            # This line to be removed
+    profile = 'cde'            # This line to be added
     return profile             # This line for context, to be kept as-is
```

The full source code for this tutorial is available on
[GitHub](https://github.com/djaodjin/sample-apps/tree/main/py-django).

Creating the Django skeleton app
--------------------------------

Make sure you have an up-to-date version of Python installed, then run
the following command in your command line (without the $ sign). We will
name the project _django_app_, otherwise choose all default options.

```console
$ python -m venv .venv
$ source .venv/bin/activate
$ pip install Django
$ django-admin startproject _django_app_
```

We check the skeleton Webserver is running by starting it and loading the
index page in a Web browser.

```console
$ python manage.py runserver
...
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

Great! It is time to decode DjaoApp sessions in the application logic server.

Identifying authenticated users
-------------------------------

DjaoApp handles accounts, billing and access control pages, forwarding other
HTTP requests to an application service as setup through access rules
(see [Overview of the HTTP pipeline](https://www.djaodjin.com/docs/guides/technical/)). We just have to retrieve the authenticated user
information in the application logic server now.

The session data is encoded as a JWT in the `Authorization` HTTP header.
We could decode the JWT ourself as done in the [FastAPI tutorial](https://www.djaodjin.com/docs/tutorials/py-fastapi/), but DjaoDjin provides helper
mixins and functions that make life of a Django developer much easier.

Let's install those tools.

```console
$ pip install djaodjin-deployutils
```

Note:
djaodjin-deployutils requires a recent version of pip. Unfortunately a bug
in pip itself will not recognize pip version number 10.0.0b1 or 10.0.0b2 as
actual version numbers (because of the b1/b2 suffixes). If you encounter issues
installing pip, try downgrading to version 9.0.3 (i.e. run
`pip install pip==9.0.3`).

Then modify the Django project settings.py to include deployutils in
`INSTALLED_APPS` and configure your project to use the deployutils session
backend instead of the default one.

``` {.python title="setings.py"}
  INSTALLED_APPS = (
+    'deployutils.apps.django',
  )

  MIDDLEWARE_CLASSES = (
-    'django.contrib.sessions.middleware.SessionMiddleware',
+    'deployutils.apps.django.middleware.SessionMiddleware',
  )

+ SESSION_ENGINE = 'deployutils.apps.django.backends.encrypted_cookies'

+ AUTHENTICATION_BACKENDS = (
+     'deployutils.apps.django.backends.auth.ProxyUserBackend'
  )

+ DJAODJIN_SECRET_KEY = "App secret key"
```

If you are using [Django Rest Framework](https://www.django-rest-framework.org/)
to implement the application backend APIs, you will also want to configure
rest_framework to authenticate requests using the `SessionAuthentication`
backend.

``` {.python title="setings.py"}
  REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
+        'rest_framework.authentication.SessionAuthentication',
    )
  }
```

When the application backend receives an HTTP request, the deployutils
session middleware with the help of the deployutils session engine
and authentication backend, will decode the session data sent by
DjaoApp Session Proxy and populate `request.user`
with an authenticated user.
If your code relies on the default Django `User` model,
it will function properly.


Debugging with DjaoDjin session
-------------------------------

The number one issue that arises when first integrating with DjaoDjin is
that the application always returns `PermissionDenied` or sees an
`AnonymousUser`. These are often related to a different
`DJAODJIN_SECRET_KEY` used by DjaoDjin to encrypt the session
data and the application to decrypt it.

First enable debbuging of the deployutils session pipeline to understand
what is going on. For example, in the application
settings.py, you can setup logging as follow:


``` {.python title="setings.py"}
  LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'simple': {
            'format': 'X X %(levelname)s [%(asctime)s] %(message)s',
            'datefmt': '%d/%b/%Y:%H:%M:%S %z'
        },
    },
    'handlers': {
        'log': {
            'level': 'DEBUG',
            'formatter': 'simple',
            'class':'logging.StreamHandler',
        },
    },
    'loggers': {
        'deployutils': {
            'handlers': [],
            'level': 'DEBUG',
        },
        # If we don't remove handlers on django here,
        # we get duplicate messages in the log.
        'django': {
            'handlers': [],
        },
        # This is the root logger.
        # The level will only be taken into account if the record is not
        # propagated from a child logger.
        #https://docs.python.org/2/library/logging.html#logging.Logger.propagate
        '': {
            'handlers': ['log'],
            'level': 'INFO'
        },
    }
}
```

This will show on `stderr` the data received and decoded
by the deployutils session middleware. It might look something like:

```console
DEBUG [01/Jan/2020:00:00:00 +0000] ==========================================
DEBUG [01/Jan/2020:00:00:00 +0000] salt:    ****************
DEBUG [01/Jan/2020:00:00:00 +0000] key:     b'***** ...'
DEBUG [01/Jan/2020:00:00:00 +0000] iv:      b'*******************************'
DEBUG [01/Jan/2020:00:00:00 +0000] encrypt: '****** ...'
DEBUG [01/Jan/2020:00:00:00 +0000] plain:   '{
  "username": "xia",
  "roles": {
    "manager": [{
        "slug": "xia",
        "printable_name": "Xia Lee",
        "created_at": "2020-01-01T00:00:00Z",
        "email": "smirolo+7@djaodjin.com",
        "subscriptions": [{
            "plan": "basic",
            "ends_at": "2020-01-01T00:00:00Z"
          }]
      }]
  },
  "site": {
    "printable_name": "Chamoix Coworking",
    "email": "smirolo+2@djaodjin.com"
  },
   "last_visited": null
}'
DEBUG [01/Jan/2020:00:00:00 +0000] *****************************************
```

Here everything looks great. The plain text is a JSON formatted data structure
with the authenticated user.

In case of key mismatch, we might get an output that looks like:

```console
error: while loading session, 'utf-8' codec can't decode byte 0xb6 in position 2: invalid start byte
```

In this case, the easiest fix it to generate a new key in DjaoDjin and use the
new key as a value for `DJAODJIN_SECRET_KEY` in the application
code.

![Rules Dashboard](https://www.djaodjin.com/static/img/docs/final-step-4.png "Rules Dashboard")


Testing with mockup sessions
----------------------------

When a request matches the set of conditions (i.e. authenticated,
subscribed to plan, etc.) for a specified path prefix, the request
is decorated with session data and forwarded to the application backend.
It is often advised to test the application on a local developer machine
separate from the djaodjin session proxy. For that purpose deployutils
provides a mechanism to mockup sessions.

Add mockup sessions in the application settings.py.
For example:

``` {.python title="setings.py"}
DEPLOYUTILS = {
    # Hardcoded mockups here.
    'MOCKUP_SESSIONS': {
      "alice": {
        "username": "alice",
        "roles": {
          "manager": [{
            "slug": "cowork",
            "printable_name": "Chamoix Coworking",
            "created_at": "2017-09-14T23:16:55Z",
            "email": "support@cowork.net",
          }]
        },
        "site": {
          "printable_name": "Chamoix Coworking",
          "email": "support@cowork.net"
        },
        "last_visited": null
      },
      "xia": {
        "username": "xia",
        "roles": {
          "manager": [{
            "slug": "xia",
            "printable_name": "Xia Lee",
            "created_at": "2017-09-14T23:16:55Z",
            "email": "xia@example.com",
            "subscriptions": [{
              "plan": "basic",
              "ends_at": "2020-01-01T09:00:00Z"
            }]
          }]
        },
        "site": {
          "printable_name": "Chamoix Coworking",
          "email": "support@cowork.net"
        },
        "last_visited": null
      },
    }
}
```

Add the mockup login view in the applications urls.py:

``` {.python title="urls.py"}
urlpatterns = [
...
    url(r'', include('deployutils.apps.django.mockup.urls')),
]
```

By default, the deploytils session middleware will deny requests which do
not have a djaodjin session attached. We still want the login page and
most likely the static files to be served to everyone, so we explicitely
add them to the `ALLOWED_NO_SESSION` in settings.py:

``` {.python title="urls.py"}
DEPLOYUTILS = {
...
    'ALLOWED_NO_SESSION': [
        STATIC_URL,
        reverse_lazy('login')]
}
```

When running the application locally, you can now login with one of the username
in the mockups and a bogus password (here from example above: xia, a subscriber,
or alice, a manager for the site). This will create a djaodjin session, encrypt
it using the `DJAODJIN_SECRET_KEY` and send it as a cookie to the
browser. The next HTTP request from that browser will thus contain all
information as-if sent by djaodjin.

To create your own mockups, here the schema and an example of session data
sent by djaodjin:

```console
 Session:
  {
    "username": string,
    "roles": {
      role_key: [Organization, ...]
    },
    "site": {
      "printable_name": string,
      "email": string
    },
     "last_visited": date_iso_8601|null
  }
role_key:
  "manager"|"contributor"|...
Organization:
  {
    "slug": string,
    "printable_name": string,
    "created_at": date_iso_8601,
    "email": string,
    "subscriptions": [Subscription, ...]
  }
Subscription:
  {
    "plan": string,
    "ends_at": date_iso_8601
  }
```

``` json
{
  "username": "xia",
  "roles": {
    "manager": [{
        "slug": "xia",
        "printable_name": "Xia Lee",
        "created_at": "2017-09-14T23:16:55Z",
        "email": "xia@example.com",
        "subscriptions": [{
            "plan": "basic",
            "ends_at": "2020-01-01T09:00:00Z"
          }]
      }]
  },
  "site": {
    "printable_name": "Chamoix Coworking",
    "email": "support@cowork.net"
  },
   "last_visited": null
}
```

The `username` is a unique identifier for the User that is
authenticated and generating the HTTP request. `site`
describes the application created on DjaoDjin that is emitting the
HTTP request (this can be useful when you have multiple application on
DjaoDjin all sending requests to the same backend server).
`last_visited` is either null or an ISO 8601 formatted date
that respectively indicates it is the first time the user triggers
the forward rule or when the user triggered the rule last (this can be useful
to display special on-boarding screens).

Various `roles` with regards to organizations is also listed
as well as the subscriptions for each of these organizations. Some application
will want to customize the user interface based on roles and subscriptions.
This is the reason those fields are here. The rules to grant or deny access
to a page or API call should be setup on DjaoDjin.

Accessing extra session data
----------------------------

If your application backend end point is `/app/{organization}/`
and the `request.user` must be a direct manager of
_{organization}_ while such organization is subscribed to an
'All Courses' plan to access it, this can be inforced by creating
a rule on djaodjin as such:

![Rules Dashboard](https://www.djaodjin.com/static/img/docs/learning-restrict-access-3.png "Rules Dashboard")

You can be sure your end point will not be called unless those conditions hold
true.

In the cases were you want to customize the user interface based on the
roles, organizations and subscriptions attached to a user, deployutils
provides a set of useful mixins and functions.

we have seen previously that `request.user` is set automatically by
`deployutils.apps.django.middleware.SessionMiddleware`.
You can also access the raw session data by accessing it by key in
`request.session`. For example to retrieve the dictionnary of roles
for the authenticated user, use the following code:

``` python
roles = request.session.get('roles', {})
```

You can also add `deployutils.apps.django.mixins.AccessiblesMixin`
to your views and benefit from often used methods such as
`managed_accounts`, the list of all organizations managed
by the authenticated user. Example:

``` python
from django.views.generic import TemplateView
from deployutils.apps.django.mixins import AccessiblesMixin

class AppView(AccessiblesMixin, TemplateView):
...
    def get_context_data(self, *args, **kwargs):
        context = super(AppView, self).get_context_data(*args, **kwargs)
        context.update({'managed_accounts': self.managed_accounts})
        return context
```

To go further, find more [helper mixins and functions](https://djaodjin-deployutils.readthedocs.io/en/latest/deploy-django.html#helper-mixins) in [djaodjin-deployutils](https://github.com/djaodjin/djaodjin-deployutils/).



