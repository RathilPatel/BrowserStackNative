console.log("Hello local renderer");
var os = require('os');
const { spawn } = require('child_process')
const {shell} = require('electron')
const browserstack = require('browserstack-local')
const bs_local = new browserstack.Local();
const key = document.getElementById('accesskey').value
const startlocal = document.getElementById('start-local')
const stoplocal = document.getElementById('stop-local')
const http = require('http');
const fs = require('fs');
var local_process;
var url = 'http://localhost:45454'



startlocal.addEventListener('click', (event) => {
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  if(!username || !key){
    credentials_messages('error','Username/Accesskey not set on Credentials Page','local_messages',10)
  }
  else{
    if(document.getElementById('local_status').innerHTML == 'LocalTesting: Not Running'){
      hostOS = process.platform;
      is64bits = process.arch == 'x64';
      console.log(hostOS);
      console.log(is64bits);
      if(hostOS.match(/darwin|mac os/i)){
          local_process = spawn("./assets/local/BrowserStackLocal",['-k',key])
          local_process.stdout.on('data',(data) => {
            logs = document.getElementById('local_output').innerHTML;
            document.getElementById('local_output').innerHTML = logs+"<br>"+data;
            console.log(`data: ${data}`);
            updateScroll();
            if(data.includes("[SUCCESS] You can now access your local server(s) in our remote browser")){
              credentials_messages("success","Binary Started Visit http://localhost:45454 for Advance settings","local_messages",0);
            }
            else{
              console.log('not started running yet!!');
            }
          });
          local_process.stderr.on('data',(err) => {
            logs = document.getElementById('local_output').innerHTML;
            document.getElementById('local_output').innerHTML = logs+"<br>"+err;
            console.log(`error: ${err}`);
            updateScroll();
            document.getElementById('local_status').innerHTML = 'LocalTesting: Not Running';
            credentials_messages("error","Error Starting Binary kindly refer the logs below","local_messages",15);


          });

          console.log("Process Id for local: "+local_process.pid);
          document.getElementById('local_status').innerHTML = 'LocalTesting: Running';
          credentials_messages("success","Starting Binary......","local_messages",0);
      }
      else if(hostOS.match(/mswin|msys|mingw|cygwin|bccwin|wince|emc|win32/i)) {
        console.log("Windows");
        local_process = spawn("./assets/local/BrowserStackLocal.exe",['--key',key])
        local_process.stdout.on('data',(data) => {
          logs = document.getElementById('local_output').innerHTML;
          document.getElementById('local_output').innerHTML = logs+"<br>"+data;
          console.log(`data: ${data}`);
          updateScroll();
          if(data.includes("[SUCCESS] You can now access your local server(s) in our remote browser")){
            credentials_messages("success","Binary Started Visit http://localhost:45454 for Advance settings","local_messages",0);
          }
          else{
            console.log('not started running yet!!');
          }
        });
        local_process.stderr.on('data',(err) => {
          logs = document.getElementById('local_output').innerHTML;
          document.getElementById('local_output').innerHTML = logs+"<br>"+err;
          console.log(`error: ${err}`);
          updateScroll();
          document.getElementById('local_status').innerHTML = 'LocalTesting: Not Running';
          credentials_messages("error","Error Starting Binary kindly refer the logs below","local_messages",15);


        });

        console.log("Process Id for local: "+local_process.pid);
        document.getElementById('local_status').innerHTML = 'LocalTesting: Running';
        credentials_messages("success","Starting Binary......","local_messages",0);
      }
      else {
        credentials_messages("error","Only works on Windows and MAC","local_messages",5);

          console.log("Error: Only mac and windows supported right now");
      }
    }
  }
});

stoplocal.addEventListener('click', (event) => {
  if(document.getElementById('local_status').innerHTML != 'LocalTesting: Not Running'){
    stop_local = spawn("kill",[local_process.pid])
    stop_local.stdout.on('data',(data)=>{
      console.log(`data: ${data}`);
    });
    stop_local.stderr.on('data',(err) => {
      console.log(`error: ${err}`);
    });
    document.getElementById('local_status').innerHTML = 'LocalTesting: Not Running';
    credentials_messages("success","Binary Stopped","local_messages",5);


}
else {
  credentials_messages("info","Binary not Running","local_messages",5);

}


});


function updateScroll(){
    var element = document.getElementById("local_div");
    element.scrollTop = element.scrollHeight;
}

function openlink(){
  console.log("test LOCAL");
  shell.openExternal(url);
}
