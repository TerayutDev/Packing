"use strict";
/*const { connect } = require("node:http2");*/
var connection = new signalR.HubConnectionBuilder()
	////.withUrl("http://10.224.29.180/whocr/Hubdata")
	.withUrl("/Hubdata")
	.configureLogging(signalR.LogLevel.Information)
	.build();
console.log("Hub builded success")

connection.onclose(async () => {
	await start();
});

function startConnection() {
	console.log('connecting...');
	connection.start()
		.then(() => console.log('connected!'))
		.catch(reconnect);
}
function reconnect() {
	console.log('reconnecting...');
	setTimeout(startConnection, 5000);
}

async function start() {
	try {
		await connection.start();
		console.log("SignalR Connected.");
	} catch (err) {
		console.log(err);
		setTimeout(start, 5000);
	}
};

$(function () {
	connection.start().then(function () {
		console.log('Connected to Hubdata');
		InvokeScale();
	}).catch(function (err) {
		return console.error(err.toString());
	});
});

function InvokeScale() {
	console.log("InvokeScale");
	connection.invoke("SendScaleStatus").catch(function (err) {
		return console.log(err.toString())
	});
}

connection.on("ReceiveScaleStatus", function (data) {
	console.log(data);
	for (var i = 0; i < data.length; i++)
	{ 
		if (data[i].status == "ว่าง") { data[i].weight = ""; }
		if (data[i].wbno == "1")
		{ 
			$('#wb1_status').html(data[i].status);
			$('#wb1_truck').html(data[i].license);
			$('#wb1_weight').html(data[i].weight);
			$('#wb1_lastupdate').html(data[i].lastupdate);
		}
		else
		{
			$('#wb2_status').html(data[i].status);
			$('#wb2_truck').html(data[i].license);
			$('#wb2_weight').html(data[i].weight);
			$('#wb2_lastupdate').html(data[i].lastupdate);
		}
	}
});



