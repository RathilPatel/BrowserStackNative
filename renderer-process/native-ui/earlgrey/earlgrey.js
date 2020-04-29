console.log("Hello EarlGrey");
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const { clipboard } = require('electron')
var fs = require("fs");
var request = require("request");
const exec = require('child_process').exec;
const autostatus = document.getElementById('earlgreystatus');
var button = document.getElementById('getearlgrey');
button.onclick = load_apps;
const upload = document.getElementById('uploadearlgrey')
const earlgrey_copy = document.getElementById('earlgrey_copy_button')
const earlgrey_app = document.getElementById('earlgreyapp')
const earlgrey_app_options = document.getElementById('earlgrey-refresh-app')
var app = null
var device = null
var earlgrey_checked_devices = []



function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// --------------- Upload Zip File --------------------//

upload.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  const filepath=document.getElementById('earlgreyfile').files[0].path
  document.getElementById('earlgrey-loader').removeAttribute("hidden");
  document.getElementById('earlgreystatus').setAttribute("hidden","true");
  if(!document.getElementById('earlgrey_custom_id').value){
    console.log("no cusotm_id");
    var options = {
      method: 'POST',
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgrey/app-dir',
      formData: {
        file: fs.createReadStream(filepath)
      }
    };

  }
  else {
      console.log("cusotm_id");
      var options = {
        method: 'POST',
        url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgrey/app-dir',
        formData: {
          file: fs.createReadStream(filepath),
          custom_id: document.getElementById('earlgrey_custom_id').value
        }
      };

  }



  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    autostatus.innerHTML=body;
    document.getElementById('earlgrey-loader').setAttribute("hidden",true);
    document.getElementById('earlgreystatus').removeAttribute("hidden");

  });
});

// --------------- Get Recent Upload on EarlGrey  --------------------//

function load_apps() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgrey/app-dirs',
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  var customers = new Array();
  customers.push(["Name","App_Dir_URL","Delete","Copy URL"]);
    parsedbody = JSON.parse(body);
    console.log(parsedbody);
    for(var i= 0;i<parsedbody.length;i++){
      customers.push([parsedbody[i].app_dir_name,parsedbody[i].app_dir_id,parsedbody[i].app_dir_id,parsedbody[i].app_dir_id]);

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
                     var button = document.createElement('button');
                     button.setAttribute('class', 'delete_button');
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

           var dvTable = document.getElementById("earlgrey_table");
           dvTable.innerHTML = "";
           dvTable.appendChild(table);

           x = document.querySelectorAll('.copy_button')
           for (var i = 0; i < x.length; i++) {
             x[i].innerHTML = '<img src ="assets/img/copy.png" ,alt="copy" class="icon">'
           }
           x = document.querySelectorAll('.delete_button')
           for (var i = 0; i < x.length; i++) {
             x[i].innerHTML = '<img src ="assets/img/trash.png" ,alt="delete" class="icon">'
           }
  });

}




// --------------- Delete EarlGrey dir --------------------//

function deleteapp(element) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  console.log(element);
  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgrey/app-dirs/'+element,
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
earlgrey_app_options.addEventListener('click',(event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgrey/app-dirs'
  };
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      earlgrey_app.innerHTML = ""

      var options = document.createElement('option')
      options.setAttribute("id","earlgrey-app-option1")
      options.setAttribute("value","")
      earlgrey_app.appendChild(options)
      document.getElementById('earlgrey-app-option1').innerHTML = "Select App"
        parsedbody = JSON.parse(body);
        for(i=0;i<parsedbody.length;i++){
          var options = document.createElement('option')
          options.setAttribute("value",parsedbody[i].app_dir_url)
          options.setAttribute("id",parsedbody[i].app_dir_url)

          earlgrey_app.appendChild(options)
          document.getElementById(parsedbody[i].app_dir_url).innerHTML =parsedbody[i].app_dir_name
        }
    }
    else {
      console.log(response);
    }
}

request(options, callback);
});

// --------------- Generate Test App Options List --------------------//

// earlgrey_testapp_options.addEventListener('click',(event) => {
//   var username=document.getElementById('username').value
//   var key=document.getElementById('accesskey').value
//   var options = {
//     method: 'GET',
//     url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/earlgreytest/test-suites'
//   };
// function callback(error, response, body) {
//     if (!error && response.statusCode == 200) {
//         parsedbody = JSON.parse(body);
//         earlgrey_test_app.innerHTML = ""
//         var options = document.createElement('option')
//         options.setAttribute("id","earlgrey-test-option1")
//         options.setAttribute("value","")
//         earlgrey_test_app.appendChild(options)
//         document.getElementById('earlgrey-test-option1').innerHTML = "Select Test"
//         for(i=0;i<parsedbody.length;i++){
//           var options = document.createElement('option')
//           options.setAttribute("value",parsedbody[i].test_suite_url)
//           options.setAttribute("id",parsedbody[i].test_suite_url)
//
//           earlgrey_test_app.appendChild(options)
//           document.getElementById(parsedbody[i].test_suite_url).innerHTML =parsedbody[i].test_suite_name
//         }
//     }
//     else {
//       console.log(response);
//     }
// }
//
// request(options, callback);
// });

// --------------- Loading Apps in Dropdown --------------------//

earlgrey_app.addEventListener("change", (event) => {
earlgrey_curl_text(earlgrey_app.value,"app")
});


// --------------- Loading Test App in Dropdown  --------------------//

// earlgrey_test_app.addEventListener("change", (event) => {
// console.log("Changed the Test App");
// earlgrey_curl_text(earlgrey_test_app.value,"test")
// });


// --------------- Generating code snippet --------------------//


earlgrey_copy.addEventListener('click',(event) => {

  clipboard.writeText(document.getElementById('earlgrey-curl-textarea').value)
  console.log("copied");
});

// --------------- Generating code snippet --------------------//

function earlgrey_curl_text(string,variable) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  switch (variable) {
    case 'app':
      app = string
      break;
    case 'device':
      device = string
    break;
    default:
    break;

  }
  document.getElementById('earlgrey-curl-textarea').value = 'curl -X POST "https://api-cloud.browserstack.com/app-automate/earlgrey/build" -d \\ "{\\"devices\\": ['+device+'], \\"appDir\\": \\"'+app+'\\", \\"deviceLogs\\" : \\"true\\"}" -H "Content-Type: application/json" -u "'+username+':'+key+'"'
}




// --------------- OnChange for Device function --------------------//
function device_change(elem) {
  // console.log(elem.id);
  var x = document.querySelectorAll('.earlgrey-devices')
  earlgrey_checked_devices = []
  for (var i = 0; i < x.length; i++) {

    if (x[i].checked) {
      earlgrey_checked_devices.push(x[i].id)
    }
  }

  device_string(earlgrey_checked_devices);

}

// --------------- changing device array to stirng --------------------//

function device_string(earlgrey_checked_devices){
var data = "";
  for (i = 0 ; i<earlgrey_checked_devices.length;i++){
    if(i == earlgrey_checked_devices.length-1){
      data += '\\"'+earlgrey_checked_devices[i]+'\\"'
    }
    else{
        data += '\\"'+earlgrey_checked_devices[i]+'\\",'
    }

  }
  earlgrey_curl_text(data,'device');
  // console.log(data);

}



// --------------- Generating ios List --------------------//
function ios_device_list() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value

  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/devices.json',
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {


        // console.log(body);

        parsedbody = JSON.parse(body);
        var device_div = document.getElementById('earlgrey-device-list');
        for(i=0; i<parsedbody.length;i++){
          if(parsedbody[i].os=='ios'){
            var select = document.createElement('input')
            select.setAttribute("type","checkbox");
            select.setAttribute("class","earlgrey-devices");
            select.setAttribute("name","earlgrey-"+parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("id",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("value",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.addEventListener('change',function(){
              device_change(this);
            });
            var label = document.createElement('label')
            label.setAttribute("for","earlgrey-"+parsedbody[i].device+"-"+parsedbody[i].os_version);
            label.setAttribute("id","earlgrey-"+parsedbody[i].device+"-"+parsedbody[i].os_version+"label");



            // var device_div = document.getElementById('earlgrey-device-list');
            device_div.appendChild(select);
            device_div.appendChild(label);
            var br = document.createElement('br');
            device_div.appendChild(br);
            document.getElementById("earlgrey-"+parsedbody[i].device+"-"+parsedbody[i].os_version+"label").innerHTML = parsedbody[i].device+"-"+parsedbody[i].os_version
            // console.log(parsedbody[i].device+"-"+parsedbody[i].os_version);

          }


        }
    }
}

request(options, callback);

}

earlgrey_curl_text();
document.getElementById('earlgrey-refresh-device').addEventListener('click',(event) =>{
  console.log("here");
  document.getElementById('earlgrey-device-list').innerHTML=""
  ios_device_list();

});
