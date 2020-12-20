/* Test of brreg.no API
To run it use 
node brregOrganisasjonsnummerLookup.js
*/
const axios = require('axios')




const orgnumberArray = [
    {
        "comment": "valid number 1",
        "organisasjonsnummer": "819439842"
    },
    {
        "comment": "to short number",
        "organisasjonsnummer": "91930380"
    },
    {
        "comment": "number as empty string",
        "organisasjonsnummer": ""
    },
    {
        "comment": "number as null value ",
        "organisasjonsnummer": null
    },
    {
        "comment": "non existing number",
        "organisasjonsnummer": "999999999"
    },
    {
        "comment": "random text",
        "organisasjonsnummer": "Jalla jalla"
    },
    {
        "comment": "valid number with spaces",
        "organisasjonsnummer": " 819 439 842 "
    }

]

console.log("Starting brregOrganisasjonsnummerLookup");


brregOrganisasjonsnummerLookup(orgnumberArray);




async function brregOrganisasjonsnummerLookup(orgnumberArray) {


    const BRREG_ENHETER_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/";
    let brregRequestURL;

    let data;
    let response;

    let totOrgNum = orgnumberArray.length;
    let status = "";
    let statusText = "";
    let validOrgNumber = "";
    let isValidOrgNumber = false;

    console.log("Looping " + totOrgNum + " organization numbers (simple version)")
    for (let i = 0; i < totOrgNum; i++) {

        data = "none";
        status = "none";
        statusText = "none";
        isValidOrgNumber = false;
        validOrgNumber = "";

        if (orgnumberArray[i].organisasjonsnummer) { // has value and is not null 

            validOrgNumber = orgnumberArray[i].organisasjonsnummer;
            validOrgNumber = validOrgNumber.trim(); // trim spaces at beginning and end
            validOrgNumber = validOrgNumber.replace(/\D/g, ''); // remove non numeric characters

            if (validOrgNumber.length == 9) // lenght must be 9 numbers
                isValidOrgNumber = true;



            if (isValidOrgNumber) { //if there is a valid number


                brregRequestURL = BRREG_ENHETER_URL + validOrgNumber;



                try {
                    response = await axios.get(brregRequestURL);
                    status = response.status;
                    statusText = response.statusText

                    if (null != response.data.organisasjonsnummer) { // there is a result set            
                        data = response.data; // return the one that is there
                    } else {
                        console.error("err no organisasjonsnummer:", JSON.stringify(response));
                    }

                }
                catch (e) {
                    console.error("catch error :", JSON.stringify(e, null, 2));
                    status = e.response.status;
                    statusText = e.response.statusText
                }


            } else { //no valid number
                data = "none";
            }
        } else { // has no value eg. null 
            data = "none";
        }

        if (data != "none")
            console.log("OK " + (i + 1) + "/" + totOrgNum + " navn:" + data.navn + " (" + orgnumberArray[i].comment + ")" + " status:" + status + " statusText:" + statusText);
        else
            console.log("-Err " + (i + 1) + "/" + totOrgNum + " orgNum:" + orgnumberArray[i].organisasjonsnummer + " (" + orgnumberArray[i].comment + ")" + " status:" + status + " statusText:" + statusText);


    }
}
