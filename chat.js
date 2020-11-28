$(document).ready(function(){

	// alert(123);

});

var clientWS = null;

function main()
{
	var u = $("#username").val();

	if(!u)
	{
		swal("Username", "Insert a username!", "warning");
		return;
	}

	$("#login").hide();
	$("#chatroom").show();

	clientWS = new WebSocket("ws://localhost:8080/chat");

	clientWS.onopen = function (event) {
		swal("Connected", "Connected successfully!", "success");

		clientWS.send(JSON.stringify({
			action: "login",
			content: u
		}));
	};

	clientWS.onerror = function (event) {
		swal("Error", "Something happens!", "error");		
	};

	clientWS.onclose = function (event) {
		swal("Closed", "Your connection was closed!", "info");

		$("#login").show();
		$("#chatroom").hide();
	};

	clientWS.onmessage = function (event) {
		console.log(event);

		var message = JSON.parse(event.data);

		if(message.action == "login")
		{
			$("#message-box").append("<p>" + message.content + " connected.</p>");
		}
	};

}

function sendMessage()
{
	var msg = $("#message").val();

	if(!msg)
	{
		return;
	}

	clientWS.send(JSON.stringify({
		action: "message",
		content: msg
	}));

	$("#message").val("");
}