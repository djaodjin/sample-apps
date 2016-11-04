"""
Django settings for a sample app interacting
with the DjaoDjin subscription session proxy.
"""

import os, sys
from deployutils import load_config, update_settings

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP_NAME = os.path.basename(BASE_DIR)

update_settings(sys.modules[__name__],
    load_config(APP_NAME, 'credentials', 'site.conf', verbose=True,
        s3_bucket=os.getenv("SETTINGS_BUCKET", None),
        passphrase=os.getenv("SETTINGS_CRYPT_KEY", None)))

if os.getenv('DEBUG'):
    # Enable override on command line.
    DEBUG = True if int(os.getenv('DEBUG')) > 0 else False

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'deployutils'
]


LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        },
    },
    'formatters': {
        'simple': {
            'format': 'X X %(levelname)s [%(asctime)s] %(message)s',
            'datefmt': '%d/%b/%Y:%H:%M:%S %z'
        },
    },
    'handlers': {
        'logfile': {
            'level':'DEBUG',
            'formatter': 'simple',
            'class':'logging.handlers.WatchedFileHandler',
            'filename': LOG_FILE
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'deployutils': {
            'handlers': [],
            'level': 'INFO',
        },
        'django.request': {
            'handlers': [],
            'level': 'ERROR',
        },
        # This is the root logger.
        # The level will only be taken into account if the record is not
        # propagated from a child logger.
        #https://docs.python.org/2/library/logging.html#logging.Logger.propagate
        '': {
            'handlers': ['logfile', 'mail_admins'],
            'level': 'INFO'
        },
    },
}

if DEBUG:
    LOGGING['handlers'].update({
        'logfile':{
            'level':'DEBUG',
            'class':'logging.StreamHandler',
            'formatter': 'simple',
        },
    })

ROOT_URLCONF = 'django_app.urls'
WSGI_APPLICATION = 'django_app.wsgi.application'


MIDDLEWARE_CLASSES = [
    'django.middleware.security.SecurityMiddleware',
    'deployutils.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# Static assets
# -------------

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.9/howto/static-files/
STATIC_URL = '/static/'


# Templates
# ---------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, APP_NAME, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# Database
# https://docs.djangoproject.com/en/1.9/ref/settings/#databases
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': DB_NAME,
    }
}


# User settings
# -------------

# The Django Middleware expects to find the authentication backend
# before returning an authenticated user model.
AUTHENTICATION_BACKENDS = (
    'deployutils.backends.auth.ProxyUserBackend',)

# https://docs.djangoproject.com/en/1.9/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [{
'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    }, {
'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    }, {
'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    }, {
'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Session settings
# ----------------
# The default session serializer switched to JSONSerializer in Django 1.6
# but just to be sure:
SESSION_SERIALIZER = 'django.contrib.sessions.serializers.JSONSerializer'
SESSION_ENGINE = 'deployutils.backends.encrypted_cookies'

DEPLOYUTILS = {
    'ALLOWED_NO_SESSION': [
        STATIC_URL,
    ]
}


# Internationalization
# https://docs.djangoproject.com/en/1.9/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True
