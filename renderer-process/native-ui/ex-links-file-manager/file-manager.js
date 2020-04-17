const {shell} = require('electron')
const os = require('os')
var request = require('request');
var username=document.getElementById('username').value
var key=document.getElementById('accesskey').value

const fileManagerBtn = document.getElementById('open-file-manager')

// fileManagerBtn.addEventListener('click', (event) => {
//   shell.showItemInFolder(os.homedir())
// })
console.log("testing with Credentials Page");

function load_automate_plan() {
//Automate plan here
  var options = {
    url: 'https://'+username+':'+key+'api.browserstack.com/automate/plan.json',

};
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
      console.log("Error Loading automate_plan: "+error);
    }
}

request(options, function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
    }
    else {
      console.log("Error Loading automate_plan: "+error);
    }
});

}
//App Automate Plan
function load_app_automate_plan() {


var options = {
  url: 'https://'+username+':'+key+'api-cloud.browserstack.com/app-automate/plan.json',

};
function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
      console.log(body);
  }
  else {
    console.log("Error Loading app_automate_plan : "+error);
  }
}

request(options, callback);

}

// load_automate_plan();
// load_app_automate_plan();
