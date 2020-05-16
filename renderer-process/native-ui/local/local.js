console.log("Hello local renderer");
var os = require('os');
const {shell} = require('electron')
const { exec } = require("child_process");
const browserstack = require('browserstack-local')
const bs_local = new browserstack.Local();
const key = document.getElementById('accesskey').value
const startlocal = document.getElementById('start-local')
const stoplocal = document.getElementById('stop-local')
const http = require('http');
const fs = require('fs');
var local_process;


// exec("./assets/BrowserStackLocal", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });

startlocal.addEventListener('click', (event) => {

    // console.log('twat');
    // console.log(key);
    // console.log(bs_local.isRunning());
    // if (!bs_local.isRunning()) {
    //    var args = '{"key": "'+key+'"}';
    //    bs_local_args = JSON.parse(args);
    //    console.log(bs_local_args);
    //    console.log(bs_local.isRunning());
    //    bs_local.start(bs_local_args, function() {
    //      if (bs_local.isRunning()) {
    //        console.log("Started BrowserStackLocal");
    //        document.getElementById('local_status').innerHTML = "LocalTesting: Running";
    //      }
    //      else {
    //        console.log("Issue starting Binary from Code!!");
    //      }
    //      console.log(bs_local.isRunning());
    //
    //   });
    // }
    // else{
    //   console.log('Binary Already Running!!');
    // }

  hostOS = process.platform;
  is64bits = process.arch == 'x64';
  console.log(hostOS);
  console.log(is64bits);
if(hostOS.match(/darwin|mac os/i)){

local_process = exec("./assets/local/BrowserStackLocal -k "+key, (error, stdout, stderr) => {
if (error) {
  console.log(`error: ${error.message}`);
  return;
}
if (stderr) {
  console.log(`stderr: ${stderr}`);
  return;
}
console.log(`stdout: ${stdout}`);

});

console.log("Process Id for local: "+local_process.pid);

}
else if(hostOS.match(/mswin|msys|mingw|cygwin|bccwin|wince|emc|win32/i)) {

  console.log("Windows");
} else {
 console.log("Error: Only mac and windows supported right now");
}





});



stoplocal.addEventListener('click', (event) => {
    exec("kill "+local_process.pid , (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);

  });

  // console.log(bs_local.isRunning());
  // if (bs_local.isRunning()) {
  //     // stop the Local instance
  //     bs_local.stop(function() {
  //       console.log("Stopped BrowserStackLocal");
  //       document.getElementById('local_status').innerHTML = "LocalTesting: Not Running";
  //
  //       // document.getElementsById('stop-local').setAttribute("disabled");
  //       // document.getElementsById('start-local').removeAttribute("disabled");
  //
  //     });
  // }
  // else{
  //   console.log('Binary not Running!!');
  //   document.getElementById('local_status').innerHTML = "LocalTesting: Not Running";
  // }
});
