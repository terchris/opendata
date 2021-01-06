/* Test of brreg.no API
To run it use 
node brregNameSearch.js
*/
const axios = require('axios')




const orgNameArray = [
    {
        "comment": "valid name 1",
        "navn": "Smarte Byer Norge"
    },
    {
        "comment": "just one letter in name",
        "navn": "a"
    },
    {
        "comment": "number as empty string",
        "navn": ""
    },
    {
        "comment": "number as null value ",
        "navn": null
    },
    {
        "comment": "norwegian letter in name",
        "navn": "SNØHETTA"
    },
    {
        "comment": "special chat % in search",
        "navn": "100%"
    },
    {
        "comment": "valid number with spaces",
        "navn": " 819 439 842 "
    }

]

console.log("Starting brregNameSearch");


brregNameSearch(orgNameArray);




async function brregNameSearch(orgNameArray) {


    const BRREG_ENHETER_URL = "https://data.brreg.no/enhetsregisteret/api/enheter/";
    let brregRequestURL;

    let data;
    let response;

    let totOrgNames = orgNameArray.length;
    let status = "";
    let statusText = "";
    let orgNameSearchTxt = "";
    

    console.log("Looping " + totOrgNames + " organization names (simple version)")
    for (let i = 0; i < totOrgNames; i++) {

        data = "none";
        status = "none";
        statusText = "none";
        
        orgNameSearchTxt = ""

        if (orgNameArray[i].navn) { // has value and is not null 

            orgNameSearchTxt = orgNameArray[i].navn.toString(); //make sure we are dealing with a string
            orgNameSearchTxt = orgNameSearchTxt.toUpperCase(); //make uppercase
            orgNameSearchTxt = orgNameSearchTxt.trim(); //remove blanks
    
            orgNameSearchTxt = encodeURIComponent(orgNameSearchTxt); // encode it correctly
    
            brregRequestURL = BRREG_ENHETER_URL + "?navn=" + orgNameSearchTxt;



                try {
                    response = await axios.get(brregRequestURL);
                    status = response.status;
                    statusText = response.statusText

                    if (null != response.data.page) { // there is a result set            
                        if (response.data.hasOwnProperty('_embedded')) {
                            if (response.data._embedded.hasOwnProperty('enheter')) {
                                data = response.data._embedded.enheter;
                            } else {
                                console.log("err no enheter:", JSON.stringify(response));
                            }
        
                        } else {
                            console.log("err no _embedded:", JSON.stringify(response));
                        }
        
                    } else {
                        console.log("err  no page:", JSON.stringify(response));
                    }

                }
                catch (e) {
                    console.error("catch error :", JSON.stringify(e, null, 2));
                    status = e.response.status;
                    statusText = e.response.statusText
                }

        } else { // has no value eg. null 
            data = "none";
        }

        if (data != "none")
            console.log("OK " + (i + 1) + "/" + totOrgNames + " navn:" + orgNameArray[i].navn + " (" + orgNameArray[i].comment + ") Got:" + data.length+ " of " + response.data.page.totalElements  + " status:" + status + " statusText:" + statusText);
        else
            console.log("-Err " + (i + 1) + "/" + totOrgNames + " navn:" + orgNameArray[i].navn + " (" + orgNameArray[i].comment + ")" + " status:" + status + " statusText:" + statusText);


    }
}
