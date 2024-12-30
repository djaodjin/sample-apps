#!/usr/bin/env python

import os
from fastapi import FastAPI
from fastapi.responses import FileResponse, HTMLResponse
from jinja2 import Environment, PackageLoader, select_autoescape
from jinja2.ext import i18n

DJAOAPP_SUBDOMAIN = "livedemo"

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
    return FileResponse(os.path.join(
        DJAOAPP_SUBDOMAIN, 'public', 'static', asset_path))


# Serves HTML pages, i.e. http://127.0.0.1:8000/{page}/
@app.get("/{page:path}/", response_class=HTMLResponse)
def read_page(page):
    template = env.get_template("%s.html" % page)
    return template.render(urls={})
