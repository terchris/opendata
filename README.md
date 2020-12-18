[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/terchris/opendata)

# opendata
Stuff for testing various open data services

## geonorge

testing their API

### geonorgeAddressLookup.js
Shows that if you send adresses like Snarøyveien 30 or Gaustadalléen 21 to their API
Then their server will reply with a status:500 statusText:INTERNAL SERVER ERROR
It seems that the characters ø and é messes up he server.

To test it read the howto.
Select geonorgeAddressLookup in debugging and look at the debug console



# howto test
You dont need to install the stuff here on your machine. 
Using gitpod you will have a full development machine set up so that you can test.

1. start by clicking on the gitpod button
2. in the terminal window type 
npm install
3. click on the debugging icon
4. selct the test ou want to run


