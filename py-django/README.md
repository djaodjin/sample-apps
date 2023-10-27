In this tutorial, we will see how to create  a Django project
and deploy it to the DjaoDjin hosting service.

The full source code for this tutorial is available at
https://github.com/djaodjin/sample-apps under the django_app/deploy directory.

We will need an Internet-accessible Docker registry to deploy our container
to DjaoDjin hosting service.

We thus start to [create a public repository on GitHub](https://docs.github.com/en/get-started/quickstart/create-a-repo).
Let's name that repository `deploy`.
We then clone that repository on our development machine and create
a skeleton Django project.

Make sure you have an up-to-date version of Python installed, then run
the following command in your command line (without the $ sign). We will
name the project "deploy", otherwise choose all default options.

    $ git clone git@github.com:*profile_name*/deploy.git

    $ python -m venv deploy/.venv
    $ source deploy/.venv/bin/activate
    $ pip install Django
    $ django-admin startproject deploy

We check the skeleton Webserver is running by starting it and loading the
index page in a Web browser.

    $ python manage.py runserver
    ...
    Starting development server at http://127.0.0.1:8000/
    Quit the server with CONTROL-C.

The page at http://127.0.0.1:8000/ is showing up. Great! Let's package
the project as a Docker container.

We edit a `Dockerfile` that looks like this:

    FROM python:3.9-slim-bullseye
    RUN /usr/local/bin/python3 -m venv --upgrade-deps --system-site-packages /app
    RUN /app/bin/pip install Django gunicorn

    # Bundle app source
    COPY . /app/reps/deploy
    WORKDIR /app/reps/deploy

    # Expose application http port
    Expose 80

    # Run
    CMD ["/app/bin/gunicorn", "-c", "/etc/djaoapp/gunicorn.conf", "djaoapp.wsgi"]

We build the Docker image and run it locally to check everything works well.

   $ docker build .
   $ docker run -p 8000:80 XXX

The page at http://127.0.0.1:8000/ is showing up. Great!
Let's stop the container.

   $ docker stop XXX

At this point we are ready to push the image to a Docker registry. Since the
code repository is on GitHub, we will pick GitHub Packages as a registry.

https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

We first create a [personal access token (classic)](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) by going to *Settings* > *Developer settings* > *Personal access tokens* > *Tokens (classic)*, then click on *Generate new token*.
We add a note and select *write:packages*.

We safely save write down the generated token, later referenced as *token*.

At this point we authenticate with the Docker registry (GitHub Packages here).

  $ export GITHUB_TOKEN=*token*
  $ echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin
  Login Succeeded

Then we push the container image we previously built to the Docker registry.

  $ docker push ghcr.io/NAMESPACE/IMAGE_NAME:latest

We then verify the package is present on GitHub Packages by browsing to the
*Packages* section of the repository on GitHub. Great!

It is time to deploy the container image on DjaoDjin Hosting service.

We browse to *Image* page and copy/paste the container image location into
the input field, then click the *Update* button.

We browse to djaoapp.com URL for our Website. We are met with the login
page. Once logged in, we land of the default app page. It is time to
forward HTTP requests to the skeleton project we just built.

We browse to *Settings* > *Rules* and add the following rule:

XXX /app



After a little while, our skeleton page shows up when we browse to .





