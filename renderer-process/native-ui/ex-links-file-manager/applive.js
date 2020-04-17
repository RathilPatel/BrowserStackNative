const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const { clipboard } = require('electron')
var fs = require("fs");
var request = require("request");
const exec = require('child_process').exec;
const autostatus = document.getElementById('applivestatus');
var button = document.getElementById('getapplive');
button.onclick = load_apps;
const upload = document.getElementById('uploadapplive')
var username=document.getElementById('username').value
var key=document.getElementById('accesskey').value


function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// call the function

upload.addEventListener('click', (event) => {
  const filepath=document.getElementById('applivefile').files[0].path
  document.getElementById('live-loader').removeAttribute("hidden");
  document.getElementById('applivestatus').setAttribute("hidden","true");
  var options = {
    method: 'POST',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-live/upload',
    formData: {
      file: fs.createReadStream(filepath)
    }
  };


  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
    autostatus.innerHTML=body;
    document.getElementById('live-loader').setAttribute("hidden",true);
    document.getElementById('applivestatus').removeAttribute("hidden");

  });
});

function load_apps() {
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-live/recent_apps',
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);

  var customers = new Array();
  customers.push(["Name","App_URL","App_Version","Delete"]);
    parsedbody = JSON.parse(body);
    for(var i= 0;i<parsedbody.length;i++){
      customers.push([parsedbody[i].app_name,parsedbody[i].app_url,parsedbody[i].app_version,parsedbody[i].app_id]);

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
                     button.onclick =  deleteapp;
                     cell.appendChild(button);
                   }else if (j == columnCount-1) {
                     var button = document.createElement('input');
                     button.setAttribute('type','button');
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

           var dvTable = document.getElementById("applive_table");
           dvTable.innerHTML = "";
           dvTable.appendChild(table);

   ///////////////////////////////////////////////////

  });
}

function deleteapp(element) {
  console.log(element);
  var options = {
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-live/app/delete/'+element,
    method: 'DELETE'
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body);
        load_apps();
    }
}
request(options, callback);
}
function copyappid(elementid) {
  console.log(elementid);
  clipboard.writeText(elementid);
}
