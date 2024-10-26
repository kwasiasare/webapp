// Import the required modules
const { DefaultAzureCredential } = require("@azure/identity");
const fetch = require("node-fetch");

// Function to get an access token and call the Azure Function App API
async function callFunctionApi() {
  try {
    // Create a credential instance to get a token
    const credential = new DefaultAzureCredential();
    const tokenResponse = await credential.getToken("dde66ae8-5db5-4b8e-bbfa-a18223bee00c");

    // Replace with your actual Function App URL
    const functionAppUrl = "https://webappfuncapp202410.azurewebsites.net/api/HttpTrigger1";

    // Make a request to the Function App endpoint using the acquired token
    const response = await fetch(functionAppUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${tokenResponse.token}`
      }
    });

    // Handle the response
    if (response.ok) {
      const data = await response.json();
      console.log("Function App Response:", data);
    } else {
      console.error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error acquiring token or calling Function App:', error);
  }
}

// Execute the function
callFunctionApi();

