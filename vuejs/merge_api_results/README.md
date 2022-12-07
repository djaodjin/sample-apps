Merge API results
=================

In this tutorial, we will see how to merge API results retrieved from two
different backends, one being djaoapp.

We will start from tutorial vuejs/auth where we authenticate with djaoapp
and retrieved a JWT token.

API calls and SQL queries
-------------------------

The client front-end will typically present a list of items as one page of
results and some pagination controls to go from page to page (see screenshot).

![subscriptions page](https://www.djaodjin.com/static/img/docs/laptop-dashboard_profile_subscriptions-donny.png)

Even with infinite scrolling, the client will load one page at a time, merging
the newly retrieved results into the currently visible items.

The API call sequence for displaying a page of items into the client front-end
will thus look like the following diagram.


![One List API Call](https://www.djaodjin.com/static/img/docs/list-api-call.png)

Unless there is a natural order both queries follow, when we are looking
to merge the results of two list API calls, we will need to squence them,
passing keys retrieved in the first call to the second call.
The number of keys is limited to a page of results (i.e. 25 items when using
the djaoapp API).

![Merge List API Calls](https://www.djaodjin.com/static/img/docs/merge-api-calls.png)

Because we are using keys present in the first API results, searching
and ordering based on first API query parameters works. If we are looking
to search and order based on second API query parameters, we will need
to reverse the order of the API calls.


Understanding the client code
-----------------------------

We install all prerequisites.

    $ cd merge_api_results
    $ npm install

Let's check the app comes up.

    $ npm run dev
    VITE v3.2.5  ready in 385 ms

    ➜  Local:   http://localhost:5173/

In this example, we will the last payment date and amount for each subscriber
to a plan. In order to do this, we will merge the results of
[Lists plan active subscriptions API](https://www.djaodjin.com/docs/reference/djaoapp/latest/api/#listPlanActiveSubscribers) and [Lists provider payouts API]
(https://www.djaodjin.com/docs/reference/djaoapp/latest/api/#listTransfer).



