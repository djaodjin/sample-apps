Deploy a Vue Application on DjaoDjin
====================================

In this tutorial, we will see how to create  a VueJS application
and deploy it to the [DjaoDjin](https://www.djaodjin.com/) hosting service.

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
[GitHub](https://github.com/djaodjin/sample-apps/tree/master/vuejs/deploy).


Setting up
----------

First we will create a skeleton Vue Single-page application (SPA)
following [Vue Getting Started](https://vuejs.org/guide/quick-start.html).

Make sure you have an up-to-date version of Node.js installed, then run
the following command in your command line (without the `$` sign). We will
name the project <em>deploy</em>, otherwise choose all default options.

    :::bash
    $ npm init vue@latest

    Vue.js - The Progressive JavaScript Framework

    ✔ Project name: … deploy
    ✔ Add TypeScript? … No / Yes
    ✔ Add JSX Support? … No / Yes
    ✔ Add Vue Router for Single Page Application development? … No / Yes
    ✔ Add Pinia for state management? … No / Yes
    ✔ Add Vitest for Unit Testing? … No / Yes
    ✔ Add an End-to-End Testing Solution? › No
    ✔ Add ESLint for code quality? … No / Yes

    Scaffolding project in sample-apps/vuejs/deploy...

    Done.

We install all prerequisites.

    :::bash
    $ cd deploy
    $ npm install

Let's check the app comes up.

    :::bash
    $ npm run dev
    VITE v3.2.3  ready in 280 ms

    ➜  Local:   http://localhost:5173/

We now open our favorite browser and go to the URL indicated above
in the ouptut of `npm run dev` (i.e. <strong>http://localhost:5173/</strong>
in this case). When the page loads properly
you will see something like the following screenshot.

![Vue App default HTML page](/djaodjin/static/img/docs/tutorials/vuejs-deploy-1.png "Vue App default HTML page")

Let's now deploy our app to the DjaoDjin hosting service so it is available
on the Web for users around the World.

We will first install the command-line helper tools from DjaoDjin,
<code>djupload</code>, then build the Vue code so it is ready for production.

    :::bash
    $ npm install @djaodjin/djaodjin-deployutils
    $ npm run build

    vite v4.4.11 building for production...
    ✓ 23 modules transformed.
    dist/assets/logo-277e0e97.svg    0.28 kB │ gzip:  0.20 kB
    dist/index.html                  0.42 kB │ gzip:  0.28 kB
    dist/assets/index-ef4f98ff.css   3.69 kB │ gzip:  1.19 kB
    dist/assets/index-0ded4fc5.js   60.06 kB │ gzip: 23.86 kB
    ✓ built in 382ms

    :::bash
  "scripts": {
+    "deploy": "djupload dist",
+    "fetch": "djupload --download",
    "dev": "vite",

    $ npm run deploy

    read configuration from ~/.djd/credentials
    Please enter the name of the project.
    By default a project is hosted at *project*.djaoapp.com
    (project defaults to deploy): 
    Please enter the domain for project 'deploy'
    (default to: deploy.djaoapp.com): 
    Please enter an API Key for https://deploy.djaoapp.com
    (see https://www.djaodjin.com/docs/faq/#api-keys for help): 
    saved configuration in ~/.djd/credentials


We go to the djaoapp URL in our favorite browser a shown in the ouptut of
`npm run dev`. As the page loads properly we see the same page that we
have running the App on our local development machine.








