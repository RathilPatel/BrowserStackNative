console.log("Hello local renderer");
const {shell} = require('electron')
const { exec } = require("child_process");
const browserstack = require('browserstack-local')
const bs_local = new browserstack.Local();
const key = document.getElementById('accesskey').value
const startlocal = document.getElementById('start-local')

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

    console.log('twat');
    console.log(key);
    console.log(bs_local.isRunning());
    if (!bs_local.isRunning()) {
       var args = '{"key": "'+key+'"}';
       bs_local_args = JSON.parse(args);
       console.log(bs_local_args);
       console.log(bs_local.isRunning());
       bs_local.start(bs_local_args, function() {
         if (bs_local.isRunning()) {
           console.log("Started BrowserStackLocal");
           document.getElementById('local_status').innerHTML = "LocalTesting: Running";
         }
         else {
           console.log("Issue starting Binary from Code!!");
         }
         console.log(bs_local.isRunning());

      });
    }
    else{
      console.log('Binary Already Running!!');
    }
});


const stoplocal = document.getElementById('stop-local')

stoplocal.addEventListener('click', (event) => {
  console.log(bs_local.isRunning());
  if (bs_local.isRunning()) {
      // stop the Local instance
      bs_local.stop(function() {
        console.log("Stopped BrowserStackLocal");
        document.getElementById('local_status').innerHTML = "LocalTesting: Not Running";

        // document.getElementsById('stop-local').setAttribute("disabled");
        // document.getElementsById('start-local').removeAttribute("disabled");

      });
  }
  else{
    console.log('Binary not Running!!');
    document.getElementById('local_status').innerHTML = "LocalTesting: Not Running";
  }
});
