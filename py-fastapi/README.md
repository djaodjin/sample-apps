Deploy a FastAPI Application on DjaoDjin
========================================

In this tutorial, we will see how to run an application built with
the Python/FastAPI framework behind a login page on the
[DjaoDjin](https://www.djaodjin.com/) hosting service.

Prerequisites:

- URL for a Website hosted on DjaoDjin (ex: _livedemo.djaoapp.com_) -
[Register](https://www.djaodjin.com/register/)
- API Key to connect the hosted Website (ex: _ABC***123_) -
[How do I get my API Keys?](https://www.djaodjin.com/docs/faq/#api-keys)

### Notes on command line snippets

On command line snippets, lines starting with a `$` character indicate
a shell prompt, or a command for you to type. Lines that do not start
with a `$` character show a sample output from that command.
Example:

    $ whoami
    ec2-user

Text edits within source files are shown in universal diff format with lines
preceded by a '-' sign to be removed and lines preceded by a '+' sign to be
added. Example:

     def set_default_profile():     # This line for context, to be kept as-is
    -    profile = 'abc'            # This line to be removed
    +    profile = 'cde'            # This line to be added
         return profile             # This line for context, to be kept as-is

The full source code for this tutorial is available on
[GitHub](https://github.com/djaodjin/sample-apps/tree/master/py-fastapi).


Setting up
----------

First we will create a skeleton FastAPI application
following [FastAPI Getting Started](https://fastapi.tiangolo.com/#installation).

Make sure you have an up-to-date version of Python installed, then run
the following command in your command line (without the `$` sign). This
will setup a Python virtual environment and install the prerequisites
to run your application locally as a ASGI (Web) server.

    $ python -m venv .venv
    $ source .venv/bin/activate
    $ pip install fastapi "uvicorn[standard]"

Create a file `main.py` with:

    from fastapi import FastAPI

    app = FastAPI()


    @app.get("/")
    def read_root():
        return {"Hello": "World"}


Run the server with:

    $ uvicorn main:app --reload

We now open our favorite browser and go to the URL indicated above
in the ouptut of `uvicorn main:app --reload` (i.e.
*http://127.0.0.1:8000/* in this case). When the page loads properly
you will see something like the following screenshot.

![FastAPI default HTML page](/djaodjin/static/img/docs/tutorials/py-fastapi-1.png "FastAPI default HTML page")


