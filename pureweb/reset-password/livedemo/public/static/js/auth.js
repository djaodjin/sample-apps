const API_URL = typeof DJAOAPP_API_BASE_URL !== 'undefined' ?
  DJAOAPP_API_BASE_URL : "/api";


function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}

async function authVerifyEmail(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    // Fetch the user credentials from the form input fields
    const email = event.target.querySelector('[name="email"]').value

    // Call the authentication API
    const data1 = {
        'username': email
    };
    const resp1 = await fetch(API_URL + "/auth/recover", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data1)
    })

    event.target.style.display = 'none';
    const authForm = document.getElementById('auth');
    authForm.style.display = 'block';

    return 0;
}


async function authUser(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    // Fetch the user credentials from the form input fields
    const username = event.target.querySelector('[name="username"]').value
    const email = event.target.querySelector('[name="email"]').value
    const emailCode = event.target.querySelector('[name="email_code"]').value
    const newPassword = event.target.querySelector('[name="new_password"]').value

    // Call the authentication API
    const data2 = {
        'username': username,
        'email': email,
        'email_code': emailCode,
        'new_password': newPassword
    };
    const resp2 = await fetch(API_URL + "/auth", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data2)
    })

    if( resp2.status == 201 ) {
        // Extract the JWT and decode the user account information.
        const respData = await resp2.json();
        const authToken = respData.token;

        sessionStorage.setItem('authToken', authToken);

        // Move on to the authenticated part of the application...
        const user = parseJWT(authToken);
        if( !user.username ) return 0;
        event.target.innerHTML = `Hello ${user.printable_name}!`;

    } else {
        document.querySelector('#messages-content').innerHTML =
            'Incorrect credentials';
    }

    return 0;
}
