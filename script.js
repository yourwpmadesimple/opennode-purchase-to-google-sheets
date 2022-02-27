const button = document.getElementById("button");
button.hidden = true;

function makeApiCall() {
  button.hidden = false;
  const config = {
    headers: {
      Authorization: "bed3c018-1efd-4807-a618-30369aec7bb9",
    },
  };
  const openNodeActiviesUrl = `https://dev-api.opennode.com/v2/activities`;
  fetch(openNodeActiviesUrl, config)
    .then((res) => res.json())
    .then((req) => {
      console.log(req);
      let data = req.data.items;
      data.map((results) => {
        const entity = results.entity;
        const description = entity.description;
        const metadata = entity.metadata;
        const fname = metadata["First Name"];
        const lname = metadata["Last Name"];
        const email = metadata["email"];
        const phone = metadata["phone"];
        const ticket = "Ticket";

        var params = {
          // The ID of the spreadsheet to update.
          spreadsheetId: "195MHGETEqhUl-e5YeK4RpEbEMJXIGROJJAID0X-Opzg",
          range: "Purchases!A2:E",
          valueInputOption: "USER_ENTERED",
          insertDataOption: "INSERT_ROWS",
          values: [[fname, lname, email, phone, ticket]],
        };
        var request = gapi.client.sheets.spreadsheets.values.append(params);
        request.then(
          function (response) {
            // TODO: Change code below to process the `response` object:
            console.log(response.result);
          },
          function (reason) {
            console.error("error: " + reason.result.error.message);
          }
        );
      });
    });
}

function initClient() {
  var API_KEY = "AIzaSyAhF9ynakxaV4Qp0yEX7LNQL7CyydAksWc"; // TODO: Update placeholder with desired API key.

  var CLIENT_ID =
    "647030225817-emjtpddjbhja0gsnunfmms8bqk6pbea1.apps.googleusercontent.com"; //
  var SCOPE = "https://www.googleapis.com/auth/spreadsheets";

  gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      scope: SCOPE,
      discoveryDocs: [
        "https://sheets.googleapis.com/$discovery/rest?version=v4",
      ],
    })
    .then(function () {
      gapi.auth2.getAuthInstance().isSignedIn.listen(updateSignInStatus);
      updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}
// let sendData = () => {
//
// };

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}
button.addEventListener("click", handleClientLoad);

function updateSignInStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById("signin-button").hidden = true;
    document.getElementById("button").hidden = false;
    button.addEventListener("click", () => {
      makeApiCall();
    });
  } else {
    document.getElementById("signin-button").hidden = false;
    document.getElementById("button").hidden = true;
  }
}

function handleSignInClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignOutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}
