In this tutorial, we will see how to create  a VueJS application
and deploy it to the DjaoDjin hosting service.

The full source code for this tutorial is available at
https://github.com/djaodjin/sample-apps under the vuejs/deploy directory.

First we will create a skeleton Vue Single-page application (SPA)
following [Vue Getting Started](https://vuejs.org/guide/quick-start.html).

Make sure you have an up-to-date version of Node.js installed, then run
the following command in your command line (without the $ sign). We will
name the project "deploy", otherwise choose all default options.

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

    $ cd deploy
    $ npm install

Let's check the app comes up.

    $ npm run dev
    VITE v3.2.3  ready in 280 ms

    ➜  Local:   http://localhost:5173/

We now open our favorite browser and go to the URL http://localhost:5173/
a shown in the ouptut of `npm run dev`. When the page loads properly
you will see something like the following screenshot.

    XXX screenshot


Let's now deploy our app to DjaoDjin hosting service so it is available
on the Web for users around the World.

We sign-up on djaojdin.com, go through the Wizard to create a new site
and retrieve the URL at which our site is available.

XXX retrieves API key


    $ npm install djd


    $ npm run build
    $ npm run djd upload


We go to the djaoapp URL in our favorite browser a shown in the ouptut of
`npm run dev`. As the page loads properly we see the same page that we
have running the App on our local development machine.








