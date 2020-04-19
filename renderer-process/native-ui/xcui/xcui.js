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



function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// --------------- Upload Zip File --------------------//

upload.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
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
    if (error) throw new Error(error);
    console.log(body);
    autostatus.innerHTML=body;
    document.getElementById('xcui-loader').setAttribute("hidden",true);
    document.getElementById('xcuistatus').removeAttribute("hidden");

  });
});

// --------------- Get Recent Upload on xcui  --------------------//

function load_apps() {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var options = {
    method: 'GET',
    url: 'https://'+username+':'+key+'@api-cloud.browserstack.com/app-automate/xcuitest/test-suites',
  };

  request(options, function (error, response, body) {
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

           var dvTable = document.getElementById("xcui_table");
           dvTable.innerHTML = "";
           dvTable.appendChild(table);


  });

}




// --------------- Delete xcui dir --------------------//
function deleteapp(element) {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
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

}
request(options, callback);
load_apps();
}

// --------------- Copy dir id --------------------//

function copyappid(elementid) {
  console.log(elementid);
  clipboard.writeText(elementid);
}

// --------------- Change Accordion height --------------------//

// function accordionHeight() {
//   var acc = document.getElementsByClassName("accordion");
// acc[0].classList.toggle("active");
//   var panel = acc[0].nextElementSibling;
//   panel.style.maxHeight = panel.scrollHeight + "px";
//
//   acc[0].classList.toggle("active");
// }

// --------------- Accordion Setup and Control --------------------//
// var acc = document.getElementsByClassName("accordion");
// var i;
// for (i = 0; i < acc.length; i++) {
//
//   acc[i].classList.toggle("active");
//   var panel = acc[i].nextElementSibling;
//   if (panel.style.maxHeight) {
//     panel.style.maxHeight = null;
//   } else {
//     panel.style.maxHeight = panel.scrollHeight + "px";
//   }
//
//   acc[i].addEventListener("click", function() {
//     this.classList.toggle("active");
//     var panel = this.nextElementSibling;
//     if (panel.style.maxHeight) {
//       panel.style.maxHeight = null;
//     } else {
//       panel.style.maxHeight = panel.scrollHeight + "px";
//     }
//   });
// }
