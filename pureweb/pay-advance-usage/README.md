Pay use charge in advance
=========================

In this tutorial, we will see how to implement usage-based pricing
with payment of use charges in advance.

To do so we will add a form to login from the homepage directly.

Prerequisites:

- URL for a Website hosted on DjaoDjin (ex: _livedemo.djaoapp.com_) -
[Register](https://www.djaodjin.com/register/)
- API Key to connect the hosted Website (ex: _ABC***123_) -
[How do I get my API Keys?](https://www.djaodjin.com/docs/faq/#api-keys)

### Notes on command line snipsets

On command line snipsets, lines starting with a `$` character indicate
a shell prompt, or a command for you to type. Lines that do not start
with a `$` character show a sample output from that command.
Example:

```bash
$ whoami
ec2-user
```

Text edits within source files are shown in universal diff format with lines
preceded by a '-' sign to be removed and lines preceded by a '+' sign to be
added. Example:

``` {.python title="diff"}
 def set_default_profile():     # This line for context, to be kept as-is
-    profile = 'abc'            # This line to be removed
+    profile = 'cde'            # This line to be added
     return profile             # This line for context, to be kept as-is
```

The full source code for this tutorial is available on
[GitHub](https://github.com/djaodjin/sample-apps/tree/main/pay-advance-usage).


Setting up
----------

You should be familiar with the steps to setup your development environment
and run an edit/run/debug cycle against the APIs. If it is not the case,
I recommend you read the
[Write Javascript locally; test against hosted APIs](../apicall/) tutorial
first.

Create a Plan with a UseCharge. Example:

    Plan
    - slug:
    - title:
    - is_active:
    - unit:
    - period_amount:
    - period_type:
    - period_length:

    UseCharge
    - slug:
    - title:
    - plan:
    - use_amount:
    - quota:
    - maximum_limit:


API used
--------

      <p>
XXX pay use charge in advance and consumption?
      </p>
      <ul>(subscriber)
        <li>POST /api/cart</li>
        <li>GET /api/billing/{profile}/checkout</li>
        <li>POST /api/billing/{profile}/checkout (card, payment successful)
          returns a receipt link</li>
      </ul>
      <ul>(provider)
        <li>POST /api/{profile}/balance</li>
      </ul>
