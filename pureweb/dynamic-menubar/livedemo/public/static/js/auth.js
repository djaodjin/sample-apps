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


async function authUser(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    // Fetch the user credentials from the form input fields
    const username = event.target.querySelector('[name="username"]').value
    const password = event.target.querySelector('[name="password"]').value

    // Call the authentication API
    const data = {'username': username, 'password': password};
    const resp = await fetch(API_URL + "/auth?cookie=1", {
        method: "POST",
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if( resp.status == 201 ) {
        // Extract the JWT and decode the user account information.
        const respData = await resp.json();
        const authToken = respData.token;

        sessionStorage.setItem('authToken', authToken);

        // Move on to the authenticated part of the application...
        injectUserMenubarItem();

    } else {
        document.querySelector('#messages-content').innerHTML =
            'Incorrect credentials';
    }

    return 0;
}
