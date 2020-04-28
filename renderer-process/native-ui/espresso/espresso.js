console.log("Hello Espresso");
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const { clipboard } = require('electron')
var fs = require("fs");
var request = require("request");
const exec = require('child_process').exec;
const autostatus = document.getElementById('espressostatus');
var button = document.getElementById('getespresso');
button.onclick = load_apps;
const upload = document.getElementById('uploadespresso')
const copy = document.getElementById('espresso_copy_button')
const espresso_app = document.getElementById('espressoapp')
const espresso_test_app = document.getElementById('espressotestapp')
const espresso_app_options = document.getElementById('refresh-app')
const espresso_testapp_options = document.getElementById('refresh-testapp')
var app = null
var test = null
var device = null
var checked_devices = []



function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// --------------- Upload Zip File --------------------//

upload.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  const filepath=document.getElementById('espressofile').files[0].path
  document.getElementById('espresso-loader').removeAttribute("hidden");
  document.getElementById('espressostatus').setAttribute("hidden","true");
  if(!document.getElementById('espresso_custom_id').value){
    console.log("no cusotm_id");
    var options = {
      method: 'POST',
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/espresso/test-suite',
      formData: {
        file: fs.createReadStream(filepath)
      }
    };

  }
  else {
      console.log("cusotm_id");
      var options = {
        method: 'POST',
        url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/espresso/test-suite',
        formData: {
          file: fs.createReadStream(filepath),
          custom_id: document.getElementById('espresso_custom_id').value
        }
      };

  }




  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    autostatus.innerHTML=body;
    document.getElementById('espresso-loader').setAttribute("hidden",true);
    document.getElementById('espressostatus').removeAttribute("hidden");

  });
});

// --------------- Get Recent Upload on espresso  --------------------//

function load_apps() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/espresso/test-suites',
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  var customers = new Array();
  customers.push(["Name","App_Dir_URL","Custom ID","Delete","Copy URL"]);
    parsedbody = JSON.parse(body);
    console.log(parsedbody);
    for(var i= 0;i<parsedbody.length;i++){
      customers.push([parsedbody[i].test_suite_name,parsedbody[i].test_suite_id,parsedbody[i].custom_id,parsedbody[i].test_suite_url,parsedbody[i].test_suite_url]);

    }
   ///////////////////////////////////////////////////

   //Create a HTML Table element.
           var table = document.createElement("TABLE");
           table.border = "1";

           //Get the count of columns.
           var columnCount = customers[0].length;

           //Add the header row.
           var row = table.insertRow(-1);
           for (var i = 0; i < columnCount; i++) {
               var headerCell = document.createElement("TH");
               headerCell.innerHTML = customers[0][i];
               row.appendChild(headerCell);
           }



           for (var i = 1; i < customers.length; i++) {
               row = table.insertRow(-1);
               for (var j = 0; j < columnCount; j++) {
                   var cell = row.insertCell(-1);
                   if(j == columnCount-2){
                     var button = document.createElement('input');
                     button.setAttribute('type', 'button');
                     button.setAttribute('value', 'Delete');
                     button.setAttribute('name','delete_button');
                     button.setAttribute('id', customers[i][j]);
                     button.addEventListener('click',function(){
                       deleteapp(this.id);
                     });
                     // button.onclick =  deleteapp;
                     cell.appendChild(button);
                   }else if (j == columnCount-1) {
                     var button = document.createElement('button');
                     button.setAttribute('class','copy_button');
                     button.setAttribute('value', 'copy');
                     button.setAttribute('name','copy_button');
                     button.setAttribute('id', customers[i][j]);
                     button.addEventListener('click',function () {
                       copyappid(this.id);
                     });
                     cell.appendChild(button);
                   }
                   else {
                     cell.innerHTML = customers[i][j];
                   }
               }
           }

           var dvTable = document.getElementById("espresso_table");
           dvTable.innerHTML = "";
           dvTable.appendChild(table);

           x = document.querySelectorAll('.copy_button')
           for (var i = 0; i < x.length; i++) {
             x[i].innerHTML = '<img src ="assets/img/copy.png" ,alt="copy" style="height:10px;width:10px">'
           }


  });

}




// --------------- Delete espresso dir --------------------//
function deleteapp(element) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  console.log(element);
  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/espresso/test-suites/'+element,
    method: 'DELETE'
};
console.log(options);
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        load_apps();
    }

}
request(options, callback);
load_apps();
}

// --------------- Copy dir id --------------------//

function copyappid(elementid) {
  console.log(elementid);
  clipboard.writeText(elementid);
}

// --------------- Generate App Options List --------------------//
espresso_app_options.addEventListener('click',(event) => {

  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/recent_apps'
  };
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      espresso_app.innerHTML = ""

      var options = document.createElement('option')
      options.setAttribute("id","app-option1")
      options.setAttribute("value","<hashed appid>")
      espresso_app.appendChild(options)
      document.getElementById('app-option1').innerHTML = "Select App"
        parsedbody = JSON.parse(body);
        for(i=0;i<parsedbody.length;i++){
          var options = document.createElement('option')
          options.setAttribute("value",parsedbody[i].app_id)
          options.setAttribute("id",parsedbody[i].app_id)

          espresso_app.appendChild(options)
          document.getElementById(parsedbody[i].app_id).innerHTML =parsedbody[i].app_name+"-"+parsedbody[i].app_version
        }
    }
    else {
      console.log("error");
    }
}

request(options, callback);
});

// --------------- Generate Test App Options List --------------------//

espresso_testapp_options.addEventListener('click',(event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/espresso/test-suites'
  };
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        parsedbody = JSON.parse(body);
        espresso_test_app.innerHTML = ""
        var options = document.createElement('option')
        options.setAttribute("id","test-option1")
        options.setAttribute("value","<hashed testid>")
        espresso_test_app.appendChild(options)
        document.getElementById('test-option1').innerHTML = "Select Test"
        for(i=0;i<parsedbody.length;i++){
          var options = document.createElement('option')
          options.setAttribute("value",parsedbody[i].test_suite_id)
          options.setAttribute("id",parsedbody[i].test_suite_id)

          espresso_test_app.appendChild(options)
          document.getElementById(parsedbody[i].test_suite_id).innerHTML =parsedbody[i].test_suite_name
        }
    }
    else {
      console.log(response);
    }
}

request(options, callback);
});

// --------------- Loading Apps in Dropdown --------------------//

espresso_app.addEventListener("change", (event) => {
espresso_curl_text(espresso_app.value,"app")
});


// --------------- Loading Test App in Dropdown  --------------------//

espresso_test_app.addEventListener("change", (event) => {
console.log("Changed the Test App");
espresso_curl_text(espresso_test_app.value,"test")
});


// --------------- Generating code snippet --------------------//


copy.addEventListener('click',(event) => {

  clipboard.writeText(document.getElementById('espresso-curl-textarea').value)
  console.log("copied");
});

// --------------- Generating code snippet --------------------//

function espresso_curl_text(string,variable) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  switch (variable) {
    case 'app':
      app = string
      break;
    case 'test':
    test = string
    break;
    case 'device':
      device = string
    break;
    default:
    break;

  }
  document.getElementById('espresso-curl-textarea').value = 'curl -X POST "https://api-cloud.browserstack.com/app-automate/espresso/build" -d \\ "{\\"devices\\": ['+device+'], \\"app\\": \\"bs://'+app+'\\", \\"deviceLogs\\" : true, \\"testSuite\\": \\"bs://'+test+'\\"}" -H "Content-Type: application/json" -u "'+username+':'+key+'"'
}




// --------------- OnChange for Device function --------------------//
function device_change(elem) {
  // console.log(elem.id);
  var x = document.querySelectorAll('.devices')
  checked_devices = []
  for (var i = 0; i < x.length; i++) {

    if (x[i].checked) {
      checked_devices.push(x[i].id)
    }
  }

  device_string(checked_devices);

}

// --------------- changing device array to stirng --------------------//

function device_string(checked_devices){
var data = "";
  for (i = 0 ; i<checked_devices.length;i++){
    if(i == checked_devices.length-1){
      data += '\\"'+checked_devices[i]+'\\"'
    }
    else{
        data += '\\"'+checked_devices[i]+'\\",'
    }

  }
  espresso_curl_text(data,'device');
  // console.log(data);

}



// --------------- Generating android List --------------------//
function android_device_list() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value

  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/devices.json',
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {


        // console.log(body);

        parsedbody = JSON.parse(body);
        var device_div = document.getElementById('espresso-device-list');
        for(i=0; i<parsedbody.length;i++){
          if(parsedbody[i].os=='android'){
            var select = document.createElement('input')
            select.setAttribute("type","checkbox");
            select.setAttribute("class","devices");
            select.setAttribute("name",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("id",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("value",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.addEventListener('change',function(){
              device_change(this);
            });
            var label = document.createElement('label')
            label.setAttribute("for",parsedbody[i].device+"-"+parsedbody[i].os_version);
            label.setAttribute("id",parsedbody[i].device+"-"+parsedbody[i].os_version+"label");



            // var device_div = document.getElementById('espresso-device-list');
            device_div.appendChild(select);
            device_div.appendChild(label);
            var br = document.createElement('br');
            device_div.appendChild(br);
            document.getElementById(parsedbody[i].device+"-"+parsedbody[i].os_version+"label").innerHTML = parsedbody[i].device+"-"+parsedbody[i].os_version
            // console.log(parsedbody[i].device+"-"+parsedbody[i].os_version);

          }


        }
    }
}

request(options, callback);

}

espresso_curl_text();
document.getElementById('refresh-device').addEventListener('click',(event) =>{
  console.log("here");
  document.getElementById('espresso-device-list').innerHTML=""
  android_device_list();

});
