$(document).ready(function(){

	// alert(123);

});

var clientWS = null;
var username = null;

function main()
{
	username = $("#username").val();

	if(!username)
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
			content: username
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
		else if(message.action == "message")
		{
			var c = "alert-secondary";

			if(username == message.username)
				c = "alert-info";

			$("#message-box").append("<div class='alert " + c + "'><p class='m-0'><b>" + message.username + ": </b>" + message.content + "</p><div>");
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