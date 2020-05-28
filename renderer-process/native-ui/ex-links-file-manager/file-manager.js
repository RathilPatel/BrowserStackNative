const {shell} = require('electron')
const Store = require('electron-store');
const store = new Store();
const os = require('os')
var request = require('request');
var username=document.getElementById('username').value
var key=document.getElementById('accesskey').value

const fileManagerBtn = document.getElementById('open-file-manager')

// fileManagerBtn.addEventListener('click', (event) => {
//   shell.showItemInFolder(os.homedir())
// })
console.log("Hello Credentials Page");

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


document.getElementById('set_cred').addEventListener('click',(event) => {
  console.log("here");
  // setTimeout(credentials_messages, 3000);
  store.set('username',  document.getElementById('username').value);
  store.set('accesskey',  document.getElementById('accesskey').value)
  credentials_messages('Info',"Values Set","credentials_messages")

});

function get_cred() {
user = store.get('username');
key = store.get('accesskey');
if(key && user ){
  document.getElementById('username').value = store.get('username');
  document.getElementById('accesskey').value = store.get('accesskey');
}


}

document.getElementById('clear_cred').addEventListener('click',(event) =>{
  console.log(store.delete('username'));
  console.log(store.delete('accesskey'));
  document.getElementById('username').value = ""
  document.getElementById('accesskey').value = ""

});
get_cred();
// load_automate_plan();
// load_app_automate_plan();

function credentials_messages(type,message,span) {
  document.getElementById(span).innerHTML = '<div class="info-msg"><i class="fa fa-info-circle"></i>'+message+'</div>'
}
// credentials_messages();
