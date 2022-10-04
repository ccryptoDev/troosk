export const environment = {
    production: true,
    // salesapiurl: 'https://infinity-sales-api.alchemylms.com/',
    adminapiurl: 'https://troosk-admin-api.alchemylms.com/',
    borrowerapiurl: 'https://troosk-borrower-api.alchemylms.com/',
    // installerapiurl: 'https://infinity-installer-api.alchemylms.com/',
    // salesapiurl : "http://localhost:3000/",
    // adminapiurl : "http://localhost:3001/",
    plaidApiVersion: 'v2',
    plaidEnv: 'sandbox',
    title: 'troosk',
  };
  export const dispalySettings = {
    helpEmail: 'help@troosk.com',
    name: 'troosk',
  };
  export const readyMade = {
    pattern: {
      email:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/,
      //email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      decimal: /^[0-9]\d*(\.\d+)?$/,
      number: /^[0-9]*$/,
      name: /^[a-zA-Z ]*$/,
    },
  };
  