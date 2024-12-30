Deploy a FastAPI Application on DjaoDjin
========================================

In this tutorial, we will see how to run an application built with
the Python/FastAPI framework behind a login page on the
[DjaoDjin](https://www.djaodjin.com/) hosting service.

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
[GitHub](https://github.com/djaodjin/sample-apps/tree/main/py-fastapi).


Setting up
----------

First we will create a skeleton FastAPI application
following [FastAPI Getting Started](https://fastapi.tiangolo.com/#installation).

Make sure you have an up-to-date version of Python installed, then run
the following command in your command line (without the `$` sign). This
will setup a Python virtual environment and install the prerequisites
to run your application locally as a ASGI (Web) server.

```console
$ python -m venv .venv
$ source .venv/bin/activate
$ pip install fastapi "uvicorn[standard]" PyJWT
``

We will need `PyJWT` later to decode the session data attached by the DjaoDjin
session proxy to the HTTP request.

Create a file `main.py` with:

``` {.python title="main.py"}
from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}
```

Run the server with:

```console
$ uvicorn main:app --reload
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

In another console window, we fetch the root API endpoint we declared
earlier from the running FastAPI server.

```console
$ curl http://127.0.0.1:8000
{"Hello":"World"}
```

Everything looks to be working OK up to this point.

Create and upload a Docker image to your favorite container registry,
and deploy it to DjaoDjin's infrastructure (ex: [Deploy an image from a GitHub Packages registry](https://www.djaodjin.com/docs/tutorials/devops-github-packages-registry/)), or forward HTTP requests to a server you manage yourself.

Once you visit your Website on DjaoDjin (ex: _https://livedemo.djaoapp.com_),
and you retrieve the `{"Hello":"World"}` response, it is time to decode
session data for authenticated users.

Decoding session data
---------------------

DjaoApp handles accounts, billing and access control pages, forwarding other
HTTP requests to an application service as setup through access rules
(see [Overview of the HTTP pipeline](https://www.djaodjin.com/docs/guides/technical/)). We just have to retrieve the authenticated user
information in the application logic server now.

The session data is encoded as a JWT in the `Authorization` HTTP header.
We thus replace our previous sample implementation returning _'Hello World'_
by the following code.


``` {.python title="main.py"}
from typing import Annotated

import jwt
from fastapi import FastAPI, Header

DJAODJIN_SECRET_KEY = "**key downloaded from Rules dashboard**"
JWT_ALGORITHM = 'HS256'

app = FastAPI()


@app.get("/")
def read_root(authorization: Annotated[str | None, Header()] = None):
    session_key = None
    session_data = {}
    if authorization:
        jwt_values = authorization.split(' ')
        if (len(jwt_values) > 1 and
            jwt_values[0].lower() == 'bearer'):
            session_key = jwt_values[1]
    if session_key:
        try:
            session_data = jwt.decode(
                session_key,
                DJAODJIN_SECRET_KEY,
                algorithms=[JWT_ALGORITHM])
        except jwt.exceptions.PyJWTError:
            pass
    return session_data
```

Here we need to make sure `DJAODJIN_SECRET_KEY` is set to the value
downloaded from the site _Rules_ dashboard in order to decode sessions
properly.

Et voila!
