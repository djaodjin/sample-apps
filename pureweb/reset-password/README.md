Implementing a reset password feature
=====================================

When a visitor shows up to Website that is not part of their daily routine,
but they might have used in the past, they will invariably ask themselves:

1. Do I have an account on this Website?
2. How do I get in? what is my password?

Since [djaoapp@2026-02-23](https://www.djaodjin.com/docs/reference/djaoapp/releases/#2026-02-23),
the [authentication workflow](https://www.djaodjin.com/docs/guides/auth/)
enables a user to login with either a username/password pair, or by verifying
their e-mail address.

There is no longer the need for a clunky user interface where the user
guess what might be the password they used for the site, then invariably
click the *"forgot password?"* link.

None-the-less, if you still want to implement a reset password feature
on a [DjaoDjin](https://www.djaodjin.com/)-hosted Website, this tutorial
is for you.

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
[GitHub](https://github.com/djaodjin/sample-apps/tree/main/pureweb/reset-password).

Setting up
----------

You should be familiar with the steps to setup your development environment,
calling the hosted API from your local machine, and uploading
your modifications to a live site. If it is not the case,
I recommend you read the
[Write Javascript locally; test against hosted APIs](../apicall/) tutorial
first.

Obtaining an e-mail code
------------------------

The first step is to call the [Sends verification code](https://www.djaodjin.com/docs/reference/djaoapp/2026-02-23/api/#auth_recover_create)
with a user e-mail address.

This step sends the user an e-mail code that can be later used to verify
the user has access to that e-mail address.

Authenticating using an e-mail code
------------------------------------

Once in possession of an e-mail code, we [authenticate](https://www.djaodjin.com/docs/reference/djaoapp/2026-02-23/api/#auth_create)
with the e-mail and e-mail code pair, while also specifying the matching
username and a new password.

```
    const resp = await fetch(API_URL + "/auth", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            'username': event.target.querySelector('[name="username"]').value,
            'email': event.target.querySelector('[name="email"]').value,
            'email_code': event.target.querySelector('[name="email_code"]').value,
            'new_password': event.target.querySelector('[name="new_password"]').value,
        })
    })
```

Publish the updates
-------------------

The code works so let's publish it.

``` {.bash title="Terminal"}
$ djd upload _livedemo_/templates _livedemo_/public
```

Summary
-------

Even if it is not recommended to do so, we have seen in this tutorial how
to implement a publicly-accessible reset password feature.
