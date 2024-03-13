"use strict";
/*const { connect } = require("node:http2");*/
var connection = new signalR.HubConnectionBuilder()
	//.withUrl("http://10.224.29.180/whocr/Hubdata")
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
		InvokeDashBoard();
		InvokeScale();
		InvokeReprint();
		InvokeUpdate();
	}).catch(function (err) {
		return console.error(err.toString());
	});
});

function InvokeDashBoard() {
	console.log("InvokeDashBoard");
	connection.invoke("SendDashBoard").catch(function (err) {
		return console.log(err.toString())
	});
}
function InvokeScale() {
	console.log("InvokeScale");
	connection.invoke("SendScaleStatus").catch(function (err) {
		return console.log(err.toString())
	});
}
function InvokeReprint() {
	console.log("InvokeReprint");
	connection.invoke("SendReprint").catch(function (err) {
		return console.log(err.toString())
	});
}
function InvokeUpdate() {
	console.log("InvokeUpdate");
	connection.invoke("SendUpdateHistory").catch(function (err) {
		return console.log(err.toString())
	});
}


connection.on("ReceivedDashBoardData", function (data) {
	console.log(data);
	var li_diff = parseInt(data.li) - parseInt(data.li_yesterday);
	var lo_diff = parseInt(data.lo) - parseInt(data.lo_yesterday);
	var pw_diff = (parseInt(data.product_weight) - parseInt(data.product_weight_yesterday));
	var tw_diff = (parseInt(data.total_weight) - parseInt(data.total_weight_yesterday));
	var sumli = (Math.round((data.sumli / 1000) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
	var wi_yearly = (Math.round((data.wi_yearly) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
	var wo_yearly = (Math.round((data.wo_yearly) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
	var pweight_yearly = (Math.round((data.pweight_yearly) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 });
	var truck_yearly = (Math.round((data.truck_yearly) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 0 });

	$('#lix').text('ไม่เปลี่ยนแปลง กำลังรับสินค้า\n\r' + parseInt(data.li - data.lo).toString() + ' คัน');
	$('#lox').text('ไม่เปลี่ยนแปลง');
	$('#productx').text('ไม่เปลี่ยนแปลง');
	$('#totalx').text('ไม่เปลี่ยนแปลง');
	$('#li').html(data.li + " คัน/" + sumli.toString() + " ตัน");
	if (li_diff > 0) {
		$('#lix').text('เพิ่มขึ้น ' + li_diff.toString() + ' คัน\n\rกำลังรับสินค้า ' + parseInt(data.li - data.lo).toString() + ' คัน');
	} else if (li_diff < 0) {
		$('#lix').text('ลดลง ' + Math.abs(li_diff).toString() + ' คัน\n\rกำลังรับสินค้า ' + parseInt(data.li - data.lo).toString() + ' คัน');
	}
	$('#lo').html(data.lo + " คัน");
	if (lo_diff > 0) {
		$('#lox').text('เพิ่มขึ้น ' + lo_diff.toString() + ' คัน');
	} else if (lo_diff < 0) {
		$('#lox').text('ลดลง ' + Math.abs(lo_diff).toString() + ' คัน');
	}
	var pton = (Math.round((data.product_weight / 1000) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })
	pw_diff = (Math.round((pw_diff / 1000) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })
	$('#product').html(pton + " ตัน");
	if (pw_diff > 0) {
		$('#productx').text('เพิ่มขึ้น ' + Math.abs(pw_diff).toString() + ' ตัน');
	} else if (pw_diff < 0) {
		$('#productx').text('ลดลง ' + Math.abs(pw_diff).toString() + ' ตัน');
	}
	var tton = (Math.round((data.total_weight / 1000) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })
	tw_diff = (Math.round((tw_diff / 1000) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })
	$('#total').html(tton + " ตัน");
	if (tw_diff > 0) {
		$('#totalx').text('เพิ่มขึ้น ' + Math.abs(tw_diff).toString() + ' ตัน');
	} else if (tw_diff < 0) {
		$('#totalx').text('ลดลง ' + Math.abs(tw_diff).toString() + ' ตัน');
	}

	$('#wi_yearly').text(wi_yearly.toString() + ' ตัน');
	$('#wo_yearly').text(wo_yearly.toString() + ' ตัน');
	$('#pweight_yearly').text(pweight_yearly.toString() + ' ตัน');
	$('#truck_yearly').text(truck_yearly.toString() + ' คัน');
	//console.log("**************************");
	//console.log(tw_diff);
	//console.log(Math.abs(tw_diff).toString());
	//console.log("**************************");
	chartdata(data.customer, data.sumcustomer, data.truck,data.sumtrucktype,data.product,data.sumproduct,data.daily,data.sumdaily,data.color);

});
connection.on("ReceiveScaleStatus", function (data) {
	console.log("wb info")
	console.log(data);
	for (var i = 0; i < data.length; i++) {
		if (data[i].status == "ว่าง") { data[i].weight = ""; }
		if (data[i].wbno == "1") {
			$('#wb1_status').html(data[i].status);
			$('#wb1_truck').html(data[i].license);
			$('#wb1_weight').html(data[i].weight);
			$('#wb1_lastupdated').html(data[i].lastupdate);
		}
		else {
			$('#wb2_status').html(data[i].status);
			$('#wb2_truck').html(data[i].license);
			$('#wb2_weight').html(data[i].weight);
			$('#wb2_lastupdated').html(data[i].lastupdate);
		}
	}
});

connection.on("ReceiveReprint", function (data) {
	console.log("Reprint...")
	console.log(data);
	$('#reprint').html(data.reprint_count);
});
connection.on("ReceiveUpdate", function (data) {
	console.log("Update...")
	console.log(data);
	for (var i = 0; i < data.length; i++) {
		if (data[i].doctype.indexOf("ยกเลิก") >= 0) {
			$('#cancel').html(data[i].doc_count);
		} else {
			$('#update').html(data[i].doc_count);
		}
	}


});





