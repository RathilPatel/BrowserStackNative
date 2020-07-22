console.log("Automate Logs here!!");
var request = require("request");
var automate_get_logs = document.getElementById('automate_get_logs');
var automate_logs = document.getElementById('automate_logs');

automate_get_logs.addEventListener('click',(event) =>{
  var automate_session_id = document.getElementById('automate_session_id').value;
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  console.log(automate_session_id);
  var url = 'https://'+username+':'+key+'@api.browserstack.com/automate/sessions/'+automate_session_id+'.json'
  console.log(url);
  var options = {
      url: url
  };


  request(options, function (error, response, body) {
    console.log(response);
    if(response.statusCode == 200){
      if (error) throw new Error(error);
      console.log(body);
      console.log(response);
      console.log(error);
      parsedbody = JSON.parse(body);
      // automate_logs.innerHTML=parsedbody.automation_session.build_name
      // var build_name = parsedbody.automation_session.build_name
      // var project_name = parsedbody.automation_session.project_name
      // var video_url = parsedbody.automation_session.video_url
      // var selenium_url = parsedbody.automation_session.selenium_logs_url
      // var network_url = parsedbody.automation_session.har_logs_url
      // var appium_logs = parsedbody.automation_session.appium_logs_url
      // var session_name;
      // if(parsedbody.automation_session.name == ""){
      //     session_name = parsedbody.automation_session.hashed_id;
      // }else {
      //   session_name = parsedbody.automation_session.name;
      // }
      var json_session = parsedbody.automation_session
      var customers = new Array();

      for (x in json_session){
        customers.push([x,json_session[x]])
        // var row = x+" : "+json_session[x]+"<br>";
        // document.getElementById("automate_logs").innerHTML += row;

      }

      var table = document.createElement("TABLE");
      table.border = "1";

      //Get the count of columns.
      var columnCount = customers[0].length;

      for (var i = 0; i < customers.length; i++) {
          row = table.insertRow(-1);
          for (var j = 0; j < columnCount; j++) {
              var cell = row.insertCell(-1);
               if (j == columnCount-1) {
                 // var string =
                 if(customers[i][0].includes("url")){
                   console.log(customers[i][0]);
                   var a = document.createElement('a');
                   // var link = document.createTextNode("Open");
                   // a.appendChild(link);
                   a.setAttribute('href',customers[i][j]);
                   a.setAttribute('_target',"blank");
                   a.setAttribute('class','external-link');
                   cell.appendChild(a);

                 }
                 else{
                   cell.innerHTML = customers[i][j];
                 }


                cell.appendChild(a);
              }
              else {
                cell.innerHTML = customers[i][j];
              }
          }
      }

      // var dvTable = document.getElementById("earlgrey_table");
      automate_logs.innerHTML = "";
      // automate_logs.appendChild(table);

      // var customers = new Array();
      // customers.push(["Name","App_Dir_URL","Delete","Copy URL"]);
      //   parsedbody = JSON.parse(body);
      //   console.log(parsedbody);
      //   for(var i= 0;i<parsedbody.length;i++){
      //     customers.push([parsedbody[i].app_dir_name,parsedbody[i].app_dir_id,parsedbody[i].app_dir_id,parsedbody[i].app_dir_id]);
      //
      //   }






      // var logs =  '<p> Project : '+project_name+'<br> Build : '+build_name+' <br>Session_Name : '+session_name+'<br> Video : <a href="'+video_url+'" target="_blank">Download<span class="u-visible-to-screen-reader">(opens in new window)</span></a> <br>  Console Logs : Download <br>  Network Logs : Download <br>   Selenium Logs : <a href="'+selenium_url+'">Download<span class="u-visible-to-screen-reader">(opens in new window)</span> <br>   </p>'
      // automate_logs.innerHTML = logs
      // autostatus.innerHTML=body;
      // document.getElementById('earlgrey-loader').setAttribute("hidden",true);
      // document.getElementById('earlgreystatus').removeAttribute("hidden");
      // credentials_messages('success','EarlGrey Test Uploaded','earlgrey_messages',10)

    }
    // else if (response.statusCode == 401) {
    //   credentials_messages('error','Error 401: Unauthorized','earlgrey_messages',10)
    //   document.getElementById('earlgrey-loader').setAttribute("hidden",true);
    //   document.getElementById('earlgreystatus').removeAttribute("hidden");
    //
    // }
    // else {
    //   credentials_messages('error','Error '+response.statusCode+': '+response.statusText,'earlgrey_messages',10)
    //   document.getElementById('earlgrey-loader').setAttribute("hidden",true);
    //   document.getElementById('earlgreystatus').removeAttribute("hidden");
    // }


  });


});
