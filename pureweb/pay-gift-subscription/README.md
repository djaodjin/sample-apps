Pay gift subscription
=====================

In this tutorial, we will see how to implement an online order
with an offline payment.

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
[GitHub](https://github.com/djaodjin/sample-apps/tree/main/pay-gift-subscription).


Setting up
----------

You should be familiar with the steps to setup your development environment
and run an edit/run/debug cycle against the APIs. If it is not the case,
I recommend you read the
[Write Javascript locally; test against hosted APIs](../apicall/) tutorial
first.


API used
--------

    <div>
      <h2>Group Buy</h2>
      <div>
        <h3>Group Buy, grantee profile exists</h3>
        <ul>
          <li>POST /api/cart (with email)</li>
          <li>GET /api/billing/{profile}/checkout</li>
          <li>POST /api/billing/{profile}/checkout (card, payment successful)
            returns a receipt link</li>
        </ul>
        <ul>
          <li>Receives invite (subscription created ealier,
            so purely notification?)</li>
        </ul>
      </div>
      <div>
        <h3>Group Buy, grantee profile must be invited</h3>
        <ul>
          <li>POST /api/cart (with email)</li>
          <li>GET /api/billing/{profile}/checkout</li>
          <li>POST /api/billing/{profile}/checkout (card, payment successful)
            returns a receipt link</li>
        </ul>
        <ul>
          <li>Receives invite</li>
          <li>Create profile</li>
          <li>Create subscription based on invite (verification_key? Cart claim_code)</li>
        </ul>
      </div>
    </div>
