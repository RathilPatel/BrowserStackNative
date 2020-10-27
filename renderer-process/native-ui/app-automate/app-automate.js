console.log("App-Automate Logs here!!");
var request = require("request");
var rp = require("request-promise");
var AdmZip = require("adm-zip");
var app_automate_get_logs = document.getElementById("app_automate_get_logs");
var app_automate_logs = document.getElementById("app_automate_logs");
var app_automate_get_build_logs = document.getElementById(
	"app_automate_get_build_logs"
);

async function DownloadSessionDataAsZip(urls, username, key) {
	var zip = AdmZip();
	for (var url in urls) {
		console.log(url, urls[url]);
		const res = await rp(urls[url], {
			auth: { user: username, pass: key },
		});
		zip.addFile(url, Buffer.alloc(res.length, res));
	}
	return zip.toBuffer();
}

function CreateTableFromSession(sessionDetails, username, key) {
	var json_session = sessionDetails.automation_session;
	var customers = new Array();
	var app_automate_session_id = sessionDetails.automation_session.hashed_id;

	for (x in json_session) {
		customers.push([x, json_session[x]]);
	}
	// console.log(customers);

	var table = document.createElement("TABLE");
	table.border = "1";
	table.style.tableLayout = "fixed";
	table.style.overflowWrap = "break-word";

	var initRow = table.insertRow(-1);
	initRow.insertCell(-1).textContent = "Download All";
	var downloadAll = document.createElement("button");
	downloadAll.onclick = async () => {
		var urls = {
			"logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/logs`,
			"video.mp4": sessionDetails.automation_session.video_url,
			"networkLogs.har": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/networklogs`,
			"console_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/consolelogs`,
			"selenium_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/seleniumlogs`,
			"appium_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/appiumlogs`,
		};
		downloadAll.textContent = "Downloading.....";
		downloadAll.disabled = true;
		var zipBuffer = await DownloadSessionDataAsZip(urls, username, key);
		download(zipBuffer, `${app_automate_session_id}.zip`);
		downloadAll.textContent = "Save";
		downloadAll.disabled = false;
	};
	downloadAll.textContent = "Save";
	initRow.insertCell(-1).append(downloadAll);
	//Get the count of columns.
	var columnCount = customers[0].length;

	for (var i = 0; i < customers.length; i++) {
		var row = table.insertRow(-1);
		for (var j = 0; j < columnCount; j++) {
			var cell = row.insertCell(-1);
			if (j == columnCount - 1) {
				// var string =
				if (customers[i][0].includes("url")) {
					console.log(customers[i][0]);
					var a = document.createElement("a");
					// var link = document.createTextNode("Open");
					// a.appendChild(link);
					a.setAttribute("href", customers[i][j]);
					a.setAttribute("target", "__blank");
					a.setAttribute("class", "external-link");
					a.setAttribute("download", "");
					a.textContent = customers[i][j];
					cell.append(a);
				} else if (customers[i][0].includes("logs")) {
					var a = document.createElement("button");
					// var link = document.createTextNode("Open");
					// a.appendChild(link);
					var link = `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/logs`;
					a.onclick = async () => {
						request(
							{ url: link },
							{
								auth: {
									user: username,
									pass: key,
								},
							}
						).on("data", (data) => {
							download(data.toString(), "logs.txt");
						});
					};
					a.textContent = "Download logs";
					cell.append(a);
				} else {
					cell.innerHTML = customers[i][j];
				}

				// cell.append(a);
			} else {
				cell.innerHTML = customers[i][j];
			}
		}
	}
	return table;
}

app_automate_get_logs.addEventListener("click", (event) => {
	var app_automate_session_id = document.getElementById(
		"app_automate_session_id"
	).value;
	var username = document.getElementById("username").value;
	var key = document.getElementById("accesskey").value;
	app_automate_logs.innerHTML = ``;
	console.log(app_automate_session_id);
	var url =
		"https://" +
		username +
		":" +
		key +
		"@api.browserstack.com/app-automate/sessions/" +
		app_automate_session_id +
		".json";
	console.log(url);
	var options = {
		url: url,
	};

	request(options, function (error, response, body) {
		console.log(response);
		if (response.statusCode == 200) {
			if (error) throw new Error(error);
			// console.log(body);
			// console.log(response);
			// console.log(error);
			var parsedbody = JSON.parse(body);
			console.log(parsedbody);

			var table = CreateTableFromSession(parsedbody, username, key);

			app_automate_logs.append(table);
		} else {
			app_automate_logs.textContent = `There was some error in getting logs for session ID ${app_automate_session_id}. Check if it is correct or try again later`;
		}
	});
});

app_automate_get_build_logs.addEventListener("click", (event) => {
	console.log("hit logs!!");
	var build_id = document.getElementById("app_automate_build_id").value;
	var username = document.getElementById("username").value;
	var key = document.getElementById("accesskey").value;
	app_automate_logs.innerHTML = ``;

	var fetchLink = `https://${username}:${key}@api.browserstack.com/app-automate/builds/${build_id}/sessions.json`;

	request({ url: fetchLink }, async (err, response, body) => {
		console.log(err, response, body);
		if (err) throw err;
		if (response.statusCode === 200) {
			var sessionArr = JSON.parse(body);

			var downloadAll = document.createElement("button");
			downloadAll.textContent = "Download All Session's Data";
			downloadAll.onclick = async () => {
				downloadAll.textContent = "Downloading.....";
				downloadAll.disabled = true;
				var zip = AdmZip();
				for (var sessionDetails of sessionArr) {
					var app_automate_session_id =
						sessionDetails.automation_session.hashed_id;
					var urls = {
						"logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/logs`,
						"video.mp4": sessionDetails.automation_session.video_url,
						"networkLogs.har": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/networklogs`,
						"console_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/consolelogs`,
						"selenium_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/seleniumlogs`,
						"appium_logs.txt": `https://api.browserstack.com/app-automate/sessions/${app_automate_session_id}/appiumlogs`,
					};
					var zipBuffer = await DownloadSessionDataAsZip(urls, username, key);
					zip.addFile(`${app_automate_session_id}.zip`, zipBuffer);
				}
				download(zip, `${build_id}.zip`);
				downloadAll.textContent = "Download All Session's Data";
				downloadAll.disabled = false;
			};

			app_automate_logs.append(downloadAll);

			sessionArr.forEach((sessionDetails) => {
				var table = CreateTableFromSession(sessionDetails, username, key);
				app_automate_logs.append(table);
				app_automate_logs.append(document.createElement("br"));
				app_automate_logs.append(document.createElement("hr"));
				app_automate_logs.append(document.createElement("br"));
			});
		} else {
			app_automate_logs.textContent = `Some error occured in fetching logs for build id: ${build_id}. Check the build id or try again later.`;
		}
	});
});
