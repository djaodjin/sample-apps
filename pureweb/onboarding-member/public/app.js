// `API_URL` is a global variable defined somewhere else. Example:
// `const API_URL = "https://livedemo.djaoapp.com/api"`

function parseJWT(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
      window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}


async function onboard(event) {
  event.preventDefault();

  // retrieve information inputed on the form.
  const fullName = document.getElementsByName('full_name')[0].value;
  const dateOfBirth = document.getElementsByName('date_of_birth')[0].value;
  const gender = document.getElementsByName('gender')[0].value;
  const contactKinship = document.getElementsByName('contact_kinship')[0].value;
  const contactFullName = document.getElementsByName(
      'contact_full_name')[0].value;
  const contactPhone = document.getElementsByName('contact_phone')[0].value;
  const contactEmail = document.getElementsByName('contact_email')[0].value;
  const streetAddress = document.getElementsByName('street_address')[0].value;
  const postalCode = document.getElementsByName('postal_code')[0].value;
  const locality = document.getElementsByName('locality')[0].value;
  const country = document.getElementsByName('country')[0].value;
  const plan = document.getElementsByName('plan')[0].value;

  // Registering contact user account
  // --------------------------------

  // https://www.djaodjin.com/docs/reference/djaoapp/2024-03-15/api/#auth_register_create
  const resp1 = await fetch(API_URL + '/api/auth/register', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          full_name: contactFullName,
          email: contactEmail,
          phone: contactPhone,
          // We generate a random password to activate the user account
          // without requesting the user to enter a password.
          new_password: window.crypto.getRandomValues(new Uint32Array(1)).toString(16),
          'terms-of-use': "true"
      }),
  });
  const result1 = await resp1.json();
  if( resp1.status != 200 && resp1.status != 201 ) {
      alert("error calling registering user:", resp1.status);
      return false;
  }
  const authToken = result1.token;
  const user = parseJWT(authToken);

  // Creating member profile
  // -----------------------

  // https://www.djaodjin.com/docs/reference/djaoapp/2024-03-15/api/#users_profiles_create
  const resp2 = await fetch(API_URL + '/api/users/' + user.username + '/profiles', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authToken,
      },
      body: JSON.stringify({
          full_name: fullName,
          street_address: streetAddress,
          postal_code: postalCode,
          locality: locality,
          country: country,
          email: contactEmail,
          phone: contactPhone,
          extra: {date_of_birth: dateOfBirth, gender: gender},
      }),
  });
  const result2 = await resp2.json();
  if( resp2.status != 200 && resp2.status != 201 ) {
      alert("error creating member profile:", resp2.status);
      return false;
  }
  const member = result2;

  // uploading profile picture
  if( document.getElementsByName('picture')[0].files.length > 0 ) {
      const picture = document.getElementsByName('picture')[0].files[0];
      var data = new FormData()
      data.append('file', picture)
      const resp2b = await fetch(API_URL + '/api/profile/' + member.slug + '/picture', {
          method: "POST",
          headers: {
              "Authorization": "Bearer " + authToken,
          },
          body: data
      });
      const result2b = await resp2b.json();
      if( resp2b.status != 200 && resp2b.status != 201 ) {
          alert("error uploading picture:", resp2b.status);
          return false;
      }
  }

  // adding kinship meta information between profile and user
  // https://www.djaodjin.com/docs/reference/djaoapp/2024-03-15/api/#XXX
  const resp3 = await fetch(API_URL + '/api/profile/' + member.slug + '/roles/manager/' + user.username, {
      method: "PUT",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authToken,
      },
      body: JSON.stringify({
          extra: {kinship: contactKinship},
      }),
  });
  const result3 = await resp3.json();
  if( resp3.status != 200 && resp3.status != 201 ) {
      alert("error adding kinship meta information:", resp3.status);
      return false;
  }

  // Subscribing member to classes
  // -----------------------------

  // https://www.djaodjin.com/docs/reference/djaoapp/2024-03-15/api/#cart_create
  const resp4 = await fetch(API_URL + '/api/cart', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authToken,
      },
      body: JSON.stringify({
          plan: plan,
          quantity: 1
      }),
  });
  const result3 = await resp4.json();
  if( resp4.status != 200 && resp4.status != 201 ) {
      alert("error preparing cart:", resp4.status);
      return false;
  }

  // https://www.djaodjin.com/docs/reference/djaoapp/2024-03-15/api/#billing_checkout_create
  const resp5 = await fetch(API_URL + '/api/billing/' + member.slug + '/checkout', {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + authToken,
      },
      body: JSON.stringify({
      }),
  });
  const result5 = await resp5.json();
  if( resp5.status != 200 && resp5.status != 201 ) {
      alert("error subscribing member to classes:", resp5.status);
      return false;
  }

  return false;
}
