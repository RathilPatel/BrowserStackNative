const {shell} = require('electron')
const {ipcRenderer} = require('electron')

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
  var otherwithequal = other
  var otherwithequal = otherwithequal.trim()
  otherwithequal = otherwithequal.replace(/(\r\n|\n|\r)/gm,"");
  console.log(otherwithequal);
  while (otherwithequal.match(",'")) {
    var otherwithequal = otherwithequal.replace(",'"," ")
  }
  while (otherwithequal.match("' =")) {
    var otherwithequal = otherwithequal.replace("' =","=")
  }
  console.log(otherwithequal);

  const filepath=document.getElementById('myFile').files[0].path
  var username=document.getElementById('username').value
  var key=document.getElementById('accesskey').value
  var parallel=document.getElementById('parallel').value

  var server="--server https://"+username+":"+key+"@hub-cloud.browserstack.com/wd/hub"
  var caps="-c "+otherwithequal
  // var caps="-c \"browserName=\'"+browser+"\' version=\'"+browser_version+"\' platform=\'"+os+"\' "+other+"\""
  var idecmd ="selenium-side-runner " + filepath + " -w "+parallel+" " + server + " " + caps
  // alert(idecmd)
  const reply = ipcRenderer.sendSync('execute', idecmd)
  const message = `Execution: ${reply}`
  console.log(idecmd);
  alert(message)

  //alert('server:'+server + '::::::::::::'+'filepath:' +filepath)
})


console.log("test");

// console.log(new_string2);





// 'curl -X POST "https://api-cloud.browserstack.com/app-automate/espresso/build" -d \ "{\"devices\": [\"'+device+'\"], \"app\": \"'+app_url+'\", \"deviceLogs\" : true, \"testSuite\": \"'+test_url+'\"}" -H "Content-Type: application/json" -u "'+username+':'+key+'"'
