/* Test of geonorge.no API
To run it use 
node geonorgeAddressLookup.js
*/

const axios = require('axios')


const addressArray = [
    {
        "comment": "valid address",
        "road": "vestengkleiva 3",
        "zipcode": "1385"
    },
    {
        "comment": "wrog address to SINTEF",
        "road": "Strindv. 2",
        "zipcode": "7034"
    },
    {
        "comment": "Telenor official address",
        "road": "Snarøyveien 30",
        "zipcode": "1331"
    },
    {
        "comment": "forskningsparken",
        "road": "Gaustadalléen 21",
        "zipcode": "0349"
    },

]

console.log("Starting geonorge-test");


geonorgeAddressLookup(addressArray);



async function geonorgeAddressLookup(addressArray) {


    const GEONORGE_ADRESS_URL = "https://ws.geonorge.no/adresser/v1/sok?";
    let geonorgeRequestURL;
    let data;
    let response;
    let totAdresses = addressArray.length;
    let status = "";
    let statusText = "";

    console.log("Looping " + totAdresses + " adresses (simple version)")
    for (let i = 0; i < totAdresses; i++) {        
        let road = encodeURIComponent(addressArray[i].road); // encode it correctly
        let zipcode = addressArray[i].zipcode;
        geonorgeRequestURL = GEONORGE_ADRESS_URL + "adressetekst=" + road + "&postnummer=" + zipcode
        data = "none";
        status = "";
        statusText = "";

        try {
            response = await axios.get(geonorgeRequestURL);
            status = response.status;
            statusText = response.statusText

            if (null != response.data.metadata) { // there is a result set            
                if (response.data.metadata.hasOwnProperty('totaltAntallTreff')) {
                    let numResponses = parseInt(response.data.metadata.totaltAntallTreff);
                    if (numResponses == 1) { //only valid if there is just one response
                        data = response.data.adresser[0]; // return the one that is there
                    }
                } else
                    console.error("err no totaltAntallTreff:", JSON.stringify(response));
            } else
                console.error("err no metadata:", JSON.stringify(response));

        }
        catch (e) {
            console.error("catch error :", JSON.stringify(e, null, 2));
            status = e.response.status;
            statusText = e.response.statusText
        }


        if (data != "none")
            console.log("OK " + (i + 1) + "/" + totAdresses + " adressetekst:" + data.adressetekst + " (" + addressArray[i].comment + ")" + " status:" + status + " statusText:" + statusText)
        else
            console.log("-Err " + (i + 1) + "/" + totAdresses + " road:" + addressArray[i].road + " (" + addressArray[i].comment + ")" + " status:" + status + " statusText:" + statusText)

    }
}
