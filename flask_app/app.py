# Copyright (c) 2016, DjaoDjin inc.
# All rights reserved.
#
# Redistribution and use in source and binary forms, with or without
# modification, are permitted provided that the following conditions are met:
#
# 1. Redistributions of source code must retain the above copyright notice,
#    this list of conditions and the following disclaimer.
# 2. Redistributions in binary form must reproduce the above copyright
#    notice, this list of conditions and the following disclaimer in the
#    documentation and/or other materials provided with the distribution.
#
# THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
# "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED
# TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
# PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
# CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
# EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
# PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
# OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
# WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
# OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
# ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

from __future__ import absolute_import

import logging, logging.config, os, sys

from deployutils import load_config
from deployutils.apps.flask import sessions, settings
from flask import Flask
from flask import render_template


app = Flask(__name__)
session = sessions.Session()


@app.route('/')
def index():
    return render_template('index.html')


def main(args):
    app_name = os.path.basename(
        os.path.dirname(os.path.abspath(__file__)))
    config = load_config(app_name, 'credentials', 'site.conf', verbose=True,
        s3_bucket=os.getenv("SETTINGS_BUCKET", None),
        passphrase=os.getenv("SETTINGS_CRYPT_KEY", None))
    config.update({
        'SESSION_COOKIE_NAME': 'sessionid',
        'ALLOWED_NO_HOST': ['/static/']})
    app.config.update(config)

    settings.update(DEBUG=app.debug, APP_NAME=app_name)

    logging.config.dictConfig({
        'version': 1,
        'disable_existing_loggers': False,
        'filters': {
        },
        'formatters': {
            'simple': {
                'format': 'X X %(levelname)s [%(asctime)s] %(message)s',
                'datefmt': '%d/%b/%Y:%H:%M:%S %z'
            },
        },
        'handlers': {
            'logfile': {
                'level': 'DEBUG',
                'formatter': 'simple',
                'filters': [],
                'class':'logging.StreamHandler',
            },
        },
        'loggers': {
            'deployutils': {
                'handlers': [],
                'level': 'INFO',
            },
        # This is the root logger.
        # The level will only be taken into account if the record is not
        # propagated from a child logger.
        #https://docs.python.org/2/library/logging.html#logging.Logger.propagate
            '': {
                'handlers': ['logfile'],
                'level': 'INFO'
            },
        },
    })
    global session
    session = sessions.Session()
    session.init_app(app)
    app.run()


if __name__ == '__main__':
    main(sys.argv)
