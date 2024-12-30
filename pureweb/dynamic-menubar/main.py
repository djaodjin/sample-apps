#!/usr/bin/env python

import os, sys
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse, HTMLResponse
from jinja2 import Environment, PackageLoader, select_autoescape
from jinja2.ext import i18n

DJAOAPP_SUBDOMAIN = "livedemo"
DJAOAPP_API_BASE_URL = os.getenv('DJAOAPP_API_BASE_URL')
if not DJAOAPP_API_BASE_URL:
    sys.stderr.write("warning: cannot find DJAOAPP_API_BASE_URL"\
" in the environment. Please define DJAOAPP_API_BASE_URL before running"\
" the server on your development machine. For example:"\
" `export DJAOAPP_API_BASE_URL=\"https://livedemo.djaoapp.com/api\"`.")

app = FastAPI()

env = Environment(
    loader=PackageLoader(DJAOAPP_SUBDOMAIN),
    autoescape=select_autoescape(),
    extensions=[i18n]
)
env.install_null_translations()

def prefix_filter(path):
    if not path.startswith('/'):
        path = '/' + path
    return path

env.filters['asset'] = prefix_filter
env.filters['site_url'] = prefix_filter

# Serves the homepage, i.e. http://127.0.0.1:8000/
@app.get("/", response_class=HTMLResponse)
def read_root():
    return read_page('index')


# Serves the favicon
@app.get("/favicon.ico")
def read_favicon():
    return FileResponse(os.path.join(
        DJAOAPP_SUBDOMAIN, 'public', 'favicon.ico'))


# Serves public static assets such as .css and .js files.
@app.get("/static/{asset_path:path}")
def read_asset(asset_path):
    pathname = os.path.join(DJAOAPP_SUBDOMAIN, 'public', 'static', asset_path)
    if not os.path.exists(pathname):
        raise HTTPException(status_code=404)
    return FileResponse(pathname)


# Serves HTML pages, i.e. http://127.0.0.1:8000/{page}/
@app.get("/{page:path}/", response_class=HTMLResponse)
def read_page(page):
    template = env.get_template("%s.html" % page)
    return template.render(urls={'api_base': DJAOAPP_API_BASE_URL})
