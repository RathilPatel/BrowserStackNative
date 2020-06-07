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



function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// call the function

upload.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','applive_messages',10)
  }
  else if (!document.getElementById('applivefile').files[0]) {
    credentials_messages('error','Select a app','applive_messages',10)

  }
  else {
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
      // if (error) throw new Error(error);
      if(response.statusCode == 200){
        console.log(body);
        autostatus.innerHTML=body;
        document.getElementById('live-loader').setAttribute("hidden",true);
        document.getElementById('applivestatus').removeAttribute("hidden");
        credentials_messages('success','App Uploaded','applive_messages',5)

      }
      else if (response.statusCode == 401) {
        credentials_messages('error','Error 401: Unauthorized','applive_messages',10)
        document.getElementById('live-loader').setAttribute("hidden",true);
        document.getElementById('applivestatus').removeAttribute("hidden");

      }else {
        credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'applive_messages',10)
        document.getElementById('live-loader').setAttribute("hidden",true);
        document.getElementById('applivestatus').removeAttribute("hidden");
      }


    });
  }

});

function load_apps() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','applive_messages',10)
  }
  else {
    var options = {
      method: 'GET',
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-live/recent_apps',
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if(response.statusCode == 200){
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
                         if (j == columnCount-1) {
                           var button = document.createElement('button');
                           button.setAttribute('class', 'delete_button');
                           button.setAttribute('value', 'Delete');
                           button.setAttribute('name','delete_button');
                           button.setAttribute('id', customers[i][j]);
                           button.addEventListener('click',function(){
                             deleteapp(this.id);
                           });
                           button.onclick =  deleteapp;
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
        credentials_messages('error','Error 401: Unauthorized','applive_messages',10)

      }else {
        credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'applive_messages',10)
      }


     ///////////////////////////////////////////////////

    });

  }

}

function deleteapp(element) {
  // if(confirm("Are you sure you want to delete the app?")){
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','espresso_messages',10)
  }
  else {
    console.log(element);
    var options = {
      url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-live/app/delete/'+element,
      method: 'DELETE'
  };

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(body);
          credentials_messages('Sucess','App Deleted','applive_messages',10)

          load_apps();
      }
      else if (response.statusCode == 401) {
        credentials_messages('error','Error 401: Unauthorized','applive_messages',10)

      }else {
        credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'applive_messages',10)
      }
  }
  request(options, callback);
  }
// }
}
function copyappid(elementid) {
  console.log(elementid);
  clipboard.writeText(elementid);
  credentials_messages('info','Copied','applive_messages',3);
}
