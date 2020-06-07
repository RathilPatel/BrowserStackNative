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
if (document.getElementById('username').value=='' || document.getElementById('accesskey').value=='') {

   credentials_messages('error',"Username/Accesskey values cannot be null","credentials_messages",5)

}
else {
  store.set('username',  document.getElementById('username').value);
   store.set('accesskey',  document.getElementById('accesskey').value)
   credentials_messages('info',"Credentials Saved","credentials_messages",5)
}

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
  if(store.get('username')==null && store.get('accesskey')==null){
    credentials_messages('info',"Credentials not saved ","credentials_messages",5)
  }
  else{
    credentials_messages('info',"Credentials cleared ","credentials_messages",5)

  }
  console.log(store.delete('username'));
  console.log(store.delete('accesskey'));
  document.getElementById('username').value = ""
  document.getElementById('accesskey').value = ""


});
get_cred();
// load_automate_plan();
// load_app_automate_plan();

function credentials_messages(type,message,span,timeout) {
  switch (type){
    case 'info':
      document.getElementById(span).innerHTML = '<div class="info-msg"><i class="fa fa-info-circle"></i>'+message+'</div>'
      if(timeout!=0){
                setTimeout(remove_message,timeout*1000,span)
      }
      break;
    case 'error':
      document.getElementById(span).innerHTML = '<div class="error-msg"><i class="fa fa-times-circle"></i>'+message+'</div>'
      if(timeout!=0){
                setTimeout(remove_message,timeout*1000,span)
      }      break;
    case 'success':
    document.getElementById(span).innerHTML = '<div class="success-msg"><i class="fa fa-check"></i>'+message+'</div>'
    if(timeout!=0){
              setTimeout(remove_message,timeout*1000,span)
    }      break;
    default:

  }
}
function remove_message(span){
  console.log("removing message from here  :"+span);
  document.getElementById(span).innerHTML = ''


}
window.credentials_messages = credentials_messages;
// credentials_messages();
