// Relies on `API_URL` to be defined.


async function addToCart(event, plan) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    // The cart API will set the selected plan as a Cookie for unauthenticated
    // users. We thus need to pass `credentials: 'include'` in CORS requests
    // so cookies can be set in the browser.
    // This constraint, in turn, requires to pass a 'X-CSRFToken' header
    // since we will have pass the CSRF cookie as a result
    // of `credentials: 'include'`.
    //
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch:
    // "Note that if a cookie's SameSite attribute is set to Strict or Lax,
    // then the cookie will not be sent cross-site, even if credentials
    // is set to include."
    // Django will set the 'sessionid' Cookie to 'Lax'.
    let headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
    }
    const authToken = sessionStorage.getItem('authToken');
    if( authToken ) {
        headers['Authorization'] = "Bearer " + authToken;
    }
    const resp = await fetch(API_URL + "/cart", {
        method: "POST",
        credentials: 'include',
        headers: headers,
        body: JSON.stringify({plan: plan})
    })

    if( !resp.ok ) {
        alert('error adding to cart');
    }

    return 0;
}

async function createPaymentURL(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    const authToken = sessionStorage.getItem('authToken');
    const user = await getUser(authToken);
    const profile = user.roles[0].profile.slug;

    const resp1 = await fetch(API_URL + `/billing/${profile}/checkout`, {
        method: "GET",
        credentials: 'include',
        headers: {
            'Authorization': "Bearer " + authToken,
            'Accept': "application/json",
        }
    })
    if( !resp1.ok ) {
        alert('error createPaymentURL');
    }
    const resp1Data = await resp1.json();

    const resp = await fetch(API_URL + `/billing/${profile}/checkout/paylater`,
    {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })

    if( !resp.ok ) {
        alert('error createPaymentURL');
    }

    const respData = await resp.json();
    const location = resp.headers.get('Location');
    document.querySelector('#paymentURL').value = location;
    document.querySelector('[name="claimCode"]').value = respData.claim_code;
    document.querySelector('[name="profile"]').value = profile;
    return 0;
}


async function markAsPaid(event) {
    // Prevents the form to be submitted to the server
    // through the `action` attribute.
    event.preventDefault();

    const authToken = sessionStorage.getItem('authToken');
    const user = await getUser(authToken);

    const claimCode = event.target.querySelector('[name="claimCode"]').value
    const profile = event.target.querySelector('[name="profile"]').value
    const resp = await fetch(API_URL + `/billing/${profile}/payments/${claimCode}/collected`, {
        method: "POST",
        headers: {
            'Authorization': "Bearer " + authToken,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            paid: true
        })
    })

    if( resp.status != 200 ) {
        alert('error markAsPaid');
    }

    return 0;
}

