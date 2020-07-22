const {shell} = require('electron')
const {ipcRenderer} = require('electron')
const { spawn } = require('child_process')
var selenium_runner;


const exec = require('child_process').exec;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout);
    });
};

// call the function

const runonbs = document.getElementById('run-on-bs')

runonbs.addEventListener('click', (event) => {
  var other = document.getElementById('other').value
    var other = other.substring(22,other.length-1)
other = "\""+other+"\""
  while (other.match(":")) {
    var other = other.replace(":","=")
  }
  while (other.match("\"")) {
    var other = other.replace("\"","\'")
  }
  var otherwithequal = other
  var otherwithequal = otherwithequal.trim()
  otherwithequal = otherwithequal.replace(/(\r\n|\n|\r)/gm,"");
  while (otherwithequal.match(",'")) {
    var otherwithequal = otherwithequal.replace(",'"," ")
  }
  while (otherwithequal.match("' =")) {
    var otherwithequal = otherwithequal.replace("' =","=")
  }
  otherwithequal = otherwithequal.substring(1,otherwithequal.length-2)

  const filepath=document.getElementById('myFile').files[0].path
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var parallel=document.getElementById('parallel').value

  var server=" https://"+username+":"+key+"@hub-cloud.browserstack.com/wd/hub"
  var caps="\""+otherwithequal+"\""
  // var caps="-c \"browserName=\'"+browser+"\' version=\'"+browser_version+"\' platform=\'"+os+"\' "+other+"\""
  var idecmd ="selenium-side-runner " + filepath + " -w "+parallel+" --server" + server + " -c " + caps
  // alert(idecmd)
  console.log("Here is the final command getting executed:  "+idecmd);


  // const reply = ipcRenderer.sendSync('execute', idecmd)
  // const message = `Execution: ${reply}`
  // console.log(idecmd);
  // alert(message)

  //alert('server:'+server + '::::::::::::'+'filepath:' +filepath)
  // selenium_runner = spawn(idecmd)
  selenium_runner = spawn("selenium-side-runner",[filepath,"-w",parallel,"--server",server,"-c",caps])
  selenium_runner.stdout.on('data',(data) => {
    logs = document.getElementById('selenium_runner_output').innerHTML;
    document.getElementById('selenium_runner_output').innerHTML = logs+"<br>"+data;
    console.log(`data: ${data}`);
    updateScroll();
    // if(data.includes("[SUCCESS] You can now access your local server(s) in our remote browser")){
    //   credentials_messages("success","Binary Started Visit http://localhost:45454 for Advance settings","local_messages",0);
    // }
    // else{
    //   console.log('not started running yet!!');
    // }
  });
  selenium_runner.stderr.on('data',(err) => {
    logs = document.getElementById('selenium_runner_output').innerHTML;
    document.getElementById('selenium_runner_output').innerHTML = logs+"<br>"+err;
    console.log(`error: ${err}`);
    updateScroll();
    // document.getElementById('selenium_runner_status').innerHTML = 'LocalTesting: Not Running';
    // credentials_messages("error","Error Starting Binary kindly refer the logs below","local_messages",15);


  });
})


console.log("Selenium_IDE_Runner here!!");

// console.log(new_string2);


function updateScroll(){
    var element = document.getElementById("selenium_runner_div");
    element.scrollTop = element.scrollHeight;
}


// 'curl -X POST "https://api-cloud.browserstack.com/app-automate/espresso/build" -d \ "{\"devices\": [\"'+device+'\"], \"app\": \"'+app_url+'\", \"deviceLogs\" : true, \"testSuite\": \"'+test_url+'\"}" -H "Content-Type: application/json" -u "'+username+':'+key+'"'
