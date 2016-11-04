This project contains sample applications to show how to deploy an application
behind DjaoDjin session proxy.

    $ virtualenv ~/workspace
    $ source  ~/workspace/bin/activate

With Django

    # cd django_app
    $ pip install -r requirements.txt
    $ make initdb
    $ python manage.py runserver
