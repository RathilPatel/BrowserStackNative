console.log("Hello XCUI");
const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const { clipboard } = require('electron')
var fs = require("fs");
var request = require("request");
const exec = require('child_process').exec;
const autostatus = document.getElementById('xcuistatus');
var button = document.getElementById('getxcui');
button.onclick = load_apps;
const upload = document.getElementById('uploadxcui')
const xcui_copy = document.getElementById('xcui_copy_button')
const xcui_app = document.getElementById('xcuiapp')
const xcui_test_app = document.getElementById('xcuitestapp')
const xcui_app_options = document.getElementById('xcui-refresh-app')
const xcui_testapp_options = document.getElementById('xcui-refresh-testapp')
var app = null
var test = null
var device = null
var ios_checked_devices = []



function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// --------------- Upload Zip File --------------------//

upload.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else if (!document.getElementById('xcuifile').files[0]) {
    credentials_messages('error','Select a app','xcuitest_messages',10)

  }
  else {
    const filepath=document.getElementById('xcuifile').files[0].path
    document.getElementById('xcui-loader').removeAttribute("hidden");
    document.getElementById('xcuistatus').setAttribute("hidden","true");
    if(!document.getElementById('xcui_custom_id').value){
      console.log("no cusotm_id");
      var options = {
        method: 'POST',
        url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suite',
        formData: {
          file: fs.createReadStream(filepath)
        }
      };

    }
    else {
        console.log("cusotm_id");
        var options = {
          method: 'POST',
          url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suite',
          formData: {
            file: fs.createReadStream(filepath),
            custom_id: document.getElementById('xcui_custom_id').value
          }
        };

    }




    request(options, function (error, response, body) {
      if(response.statusCode == 200){
        console.log(body);
        autostatus.innerHTML=body;
        document.getElementById('xcui-loader').setAttribute("hidden",true);
        document.getElementById('xcuistatus').removeAttribute("hidden");
        credentials_messages('success','XCUI Test Uploaded','xcuitest_messages',10)

      }
      else if (response.statusCode == 401) {
        credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)
        document.getElementById('xcui-loader').setAttribute("hidden",true);
        document.getElementById('xcuistatus').removeAttribute("hidden");

      }else {
        credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
        document.getElementById('xcui-loader').setAttribute("hidden",true);
        document.getElementById('xcuistatus').removeAttribute("hidden");
      }


    });
  }

});

// --------------- Get Recent Upload on xcui  --------------------//

function load_apps() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }

  else {
    var options = {
      method: 'GET',
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suites',
    };

    request(options, function (error, response, body) {
      if(response.statusCode == 200){

      if (error) throw new Error(error);

    var customers = new Array();
    customers.push(["Name","App_Dir_URL","Custom ID","Delete","Copy URL"]);
      parsedbody = JSON.parse(body);
      console.log(parsedbody);
      for(var i= 0;i<parsedbody.length;i++){
        customers.push([parsedbody[i].test_suite_name,parsedbody[i].test_suite_id,parsedbody[i].custom_id,parsedbody[i].test_suite_id,parsedbody[i].test_suite_id]);

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

             var dvTable = document.getElementById("xcui_table");
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
}
             else if (response.statusCode == 401) {
               credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

             }else {
               credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
             }
    });
  }


}




// --------------- Delete xcui dir --------------------//
function deleteapp(element) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else{
  console.log(element);
  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suites/'+element,
    method: 'DELETE'
};
console.log(options);
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        load_apps();
    }
    else if (response.statusCode == 401) {
      credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

    }else {
      credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
    }

}
request(options, callback);
load_apps();
}
}

// --------------- Copy dir id --------------------//

function copyappid(elementid) {
  console.log(elementid);
  clipboard.writeText(elementid);
  credentials_messages('info','Copied','xcuitest_messages',3)
}



// --------------- Generate App Options List --------------------//
xcui_app_options.addEventListener('click',(event) => {
console.log("xcui_app");
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else{
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/recent_apps'
  };
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      xcui_app.innerHTML = ""

      var options = document.createElement('option')
      options.setAttribute("id","xcui-app-option1")
      options.setAttribute("value","")
      xcui_app.appendChild(options)
      document.getElementById('xcui-app-option1').innerHTML = "Select App"
        parsedbody = JSON.parse(body);
        for(i=0;i<parsedbody.length;i++){
          var options = document.createElement('option')
          options.setAttribute("value",parsedbody[i].app_url)
          options.setAttribute("id",parsedbody[i].app_url)

          xcui_app.appendChild(options)
          document.getElementById(parsedbody[i].app_url).innerHTML =parsedbody[i].app_name+"-"+parsedbody[i].app_version
        }
    }
    else if (response.statusCode == 401) {
      credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

    }else {
      credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
    }
}

request(options, callback);
}
});

// --------------- Generate Test App Options List --------------------//

xcui_testapp_options.addEventListener('click',(event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else{
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suites'
  };
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        parsedbody = JSON.parse(body);
        xcui_test_app.innerHTML = ""
        var options = document.createElement('option')
        options.setAttribute("id","xcui-test-option1")
        options.setAttribute("value","")
        xcui_test_app.appendChild(options)
        document.getElementById('xcui-test-option1').innerHTML = "Select Test"
        for(i=0;i<parsedbody.length;i++){
          var options = document.createElement('option')
          options.setAttribute("value",parsedbody[i].test_suite_url)
          options.setAttribute("id",parsedbody[i].test_suite_url)

          xcui_test_app.appendChild(options)
          document.getElementById(parsedbody[i].test_suite_url).innerHTML =parsedbody[i].test_suite_name
        }
    }
    else if (response.statusCode == 401) {
      credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

    }else {
      credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
    }
}

request(options, callback);
}
});

// --------------- Loading Apps in Dropdown --------------------//

xcui_app.addEventListener("change", (event) => {
xcui_curl_text(xcui_app.value,"app")
});


// --------------- Loading Test App in Dropdown  --------------------//

xcui_test_app.addEventListener("change", (event) => {
console.log("Changed the Test App");
xcui_curl_text(xcui_test_app.value,"test")
});


// --------------- Generating code snippet --------------------//


xcui_copy.addEventListener('click',(event) => {

  clipboard.writeText(document.getElementById('xcui-curl-textarea').value)
  console.log("copied");
  credentials_messages('info','Copied','xcuitest_messages',3)

});

// --------------- Generating code snippet --------------------//

function xcui_curl_text(string,variable) {
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
    case 'run':
    if(!app || !test || !device){
      credentials_messages('error','Select valid Device/app/Test','xcuitest_messages',10)
      console.log("Missing either app/test/device");
    }
    else{
      console.log("call running function: App="+app+" Test:"+test+" Device:"+device);
      running_xcui(app,test,device)
    }
    default:
    break;

  }
  document.getElementById('xcui-curl-textarea').value = 'curl -X POST "https://api-cloud.browserstack.com/app-automate/xcuitest/build" -d \\ "{\\"devices\\": ['+device+'], \\"app\\": \\"'+app+'\\", \\"deviceLogs\\" : true, \\"testSuite\\": \\"'+test+'\\"}" -H "Content-Type: application/json" -u "'+username+':'+key+'"'
}




// --------------- OnChange for Device function --------------------//
function device_change(elem) {
  // console.log(elem.id);
  var x = document.querySelectorAll('.xcui-devices')
  ios_checked_devices = []
  for (var i = 0; i < x.length; i++) {

    if (x[i].checked) {
      ios_checked_devices.push(x[i].id)
    }
  }

  device_string(ios_checked_devices);

}

// --------------- changing device array to stirng --------------------//

function device_string(ios_checked_devices){
var data = "";
  for (i = 0 ; i<ios_checked_devices.length;i++){
    if(i == ios_checked_devices.length-1){
      data += '\\"'+ios_checked_devices[i]+'\\"'
    }
    else{
        data += '\\"'+ios_checked_devices[i]+'\\",'
    }

  }
  xcui_curl_text(data,'device');
  // console.log(data);

}



// --------------- Generating android List --------------------//
function ios_device_list() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else{
  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/devices.json',
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {


        // console.log(body);

        parsedbody = JSON.parse(body);
        var device_div = document.getElementById('xcui-device-list');
        for(i=0; i<parsedbody.length;i++){
          if(parsedbody[i].os=='ios'){
            var select = document.createElement('input')
            select.setAttribute("type","checkbox");
            select.setAttribute("class","xcui-devices");
            select.setAttribute("name",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("id",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.setAttribute("value",parsedbody[i].device+"-"+parsedbody[i].os_version);
            select.addEventListener('change',function(){
              device_change(this);
            });
            var label = document.createElement('label')
            label.setAttribute("for",parsedbody[i].device+"-"+parsedbody[i].os_version);
            label.setAttribute("id",parsedbody[i].device+"-"+parsedbody[i].os_version+"label");



            // var device_div = document.getElementById('xcui-device-list');
            device_div.appendChild(select);
            device_div.appendChild(label);
            var br = document.createElement('br');
            device_div.appendChild(br);
            document.getElementById(parsedbody[i].device+"-"+parsedbody[i].os_version+"label").innerHTML = parsedbody[i].device+"-"+parsedbody[i].os_version
            // console.log(parsedbody[i].device+"-"+parsedbody[i].os_version);

          }


        }
    }
    else if (response.statusCode == 401) {
      credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

    }else {
      credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
    }
}

request(options, callback);
}
}

xcui_curl_text();
document.getElementById('xcui-refresh-device').addEventListener('click',(event) =>{
  console.log("here");
  document.getElementById('xcui-device-list').innerHTML=""
  ios_device_list();

});


document.getElementById('run_xcui').addEventListener('click',(event)=>{
  xcui_curl_text('dummy','run')
});

function running_xcui(app,test,device) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','xcuitest_messages',10)
  }
  else{
while (device.includes("\\\"")) {
  device = device.replace("\\\"","\"")
}

  var headers = {
      'Content-Type': 'application/json'
    };
    var dataString = '{"devices": ['+device+'], "app": "'+app+'", "deviceLogs" : true, "testSuite": "'+test+'"}';
console.log(dataString);
    var options = {
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/build',
      method: 'POST',
      headers: headers,
      body: dataString
    };

    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
          credentials_messages('success','Test Launched','xcuitest_messages',10);

      }
      else if (response.statusCode == 401) {
        credentials_messages('error','Error 401: Unauthorized','xcuitest_messages',10)

      }else {
        credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'xcuitest_messages',10)
      }
    }

    request(options, callback);
}
}
