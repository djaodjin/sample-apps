async function auth(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    // Fetch the user credentials from the form input fields
    const username = event.target.querySelector('[name="username"]').value
    const password = event.target.querySelector('[name="password"]').value

    // Call the authentication API
    // `API_URL` is a global variable defined somewhere else. Example:
    // `const API_URL = "https://livedemo.djaoapp.com/api"`
    const data = {'username': username, 'password': password};
    const resp = await fetch(API_URL + "/auth", {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })

    if( resp.status == 201 ) {
        // Extract the JWT and decode the user account information.
        const respData = await resp.json();
        const token = respData.token;
        const base64Url = token.split('.')[1];
        // JWT uses base64url (RFC 4648 §5),
        // so using only atob (which uses base64) isn't enough.
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const user = JSON.parse(atob(base64));

        // Move on to the authenticated part of the application...
        document.querySelector('#messages-content').innerHTML =
            `Hello ${user.printable_name}!`;

    } else {
        document.querySelector('#messages-content').innerHTML =
            'Incorrect credentials';
    }

    return 0;
}
