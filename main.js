const { google } = require("googleapis");
const axios = require("axios");

const keys = require("./keys.json");

// Spreadsheet update creds
const openNodeActiviesUrl = `https://dev-api.opennode.com/v2/activities`;

async function sendDataToSheets() {
  const config = {
    headers: {
      Authorization: "bed3c018-1efd-4807-a618-30369aec7bb9",
    },
  };
  let res = await axios.get(openNodeActiviesUrl, config);
  let data = res.data.data.items;

  //console.log(data);

  // Map through the data response
  data.map((results) => {
    const entity = results.entity;
    console.log(typeof entity);
    const description = entity.description;
    const metadata = entity.metadata;
    const fname = metadata["First Name"];
    const lname = metadata["Last Name"];
    const email = metadata["email"];
    const phone = metadata["phone"];
    const ticket = "Ticket";

    const spreadsheetId = `195MHGETEqhUl-e5YeK4RpEbEMJXIGROJJAID0X-Opzg`;
    const range = "Purchases!A2:E";
    const valueInputOption = "USER_ENTERED";
    // Set the values for Google Sheets from the data response
    const values = [
      fname ? fname : "N/A",
      lname ? lname : "N/A",
      email ? email : "N/A",
      phone ? phone : "N/A",
      ticket ? ticket : "",
    ];
    //console.log(ticket ? ticket : "");

    function getSheetData() {
      const client = new google.auth.JWT(
        keys.client_email,
        null,
        keys.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"]
      );

      client.authorize((err, tokens) => {
        if (err) {
          console.log(err);
        } else {
          //console.log("Connected!");
          getSheet(client);
        }
      });
    }

    async function getSheet(gsclient) {
      const gsapi = google.sheets({ version: "v4", auth: gsclient });

      const options = {
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: valueInputOption,
        insertDataOption: "INSERT_ROWS",
        requestBody: {
          values: [values],
        },
      };

      await gsapi.spreadsheets.values.append(options);
      //console.log("Response: ");
    }
    getSheetData();
  });
}
sendDataToSheets();
