$(document).ready(function() {

	Dance(window.outerWidth/5, $('#navbar').height()/1.5);

			if (connection()) {

				$("#offline").hide();

				$("#online").show();

				start();

			}

});


function Dance(width, height) {
	var dx = Math.round(Math.random() * width - width/2);
	var dy = Math.round(Math.random() * height - height/2);
	var red = Math.round(Math.random() * 256);
	var green = Math.round(Math.random() * 256);
	var blue = Math.round(Math.random() * 256);
	$('#title').animate({top:dy, left:dx, color:"rgb("+red+","+green+","+blue+")"}, 100, function(){
		Dance(width, height);
	});
}








function start() {

	$("#join").click(function() {formy("join");});

	$("#create").click(function() {formy("create");});

	$("#leave").click(function() {location.reload();})

	var chatHeight = ($(document).height() - 330);

	$("#chatBox").css({"height":chatHeight+'px'});

	function formy(action) {

		var username = $("#username").val();

		var room = $("#room").val();

		if (action == "join") {

			join(username, room);

		} else if (action == "create") {

			create(username);

		}



	}

	socket = io();





	function create(username) {

		$("#chatButton").show();

		$("#lobby").hide();

		$("#game").show();

		var room = "";

		$('<li />', {text : username, id : username, appendTo : $('#playerList')});

		socket.emit('create', {username: username});

		socket.on('roomShow', function(data) {
			console.log('roomShow');

			room = data.room;

		  $("#roomSpan").text(data.room);



		});

		var players = [];
		players.push(username);

		socket.on('player', function(data){
			console.log('player');

		  socket.emit('sendPlayers', {socket: data.socket, players: players});
			console.log(players);

		  $('<li />', {text : data.username, id : data.username, appendTo : $('#playerList')});

		//  var playerLi = $('#playerList').append($('<li>')).text(data.username).attr('id', data.username);

		  players.push(data.username);
			console.log(players);


		  });

		mainScript(username, room);

	}



	function join(username, room) {

		$("#chatButton").show();

		$("#lobby").hide();

		$("#game").show();

		///$('<li />', {text : username, id : username, appendTo : $('#playerList')});

		socket.emit('join', {room: "", username: username});

		socket.on('roomShow', function(data) {
			console.log('roomShow');
			room = data.room;

		  $("#roomSpan").text(data.room);

		});

		socket.on('playerList', function(data) {
			console.log('playerList');

		  data.players.forEach(function(player) {

		    $('<li />', {text : player, id : player, appendTo : $('#playerList')});

		//      var playerLi = $('#playerList').append($('<li>')).text(player).attr('id', player);

		  });

		});

		socket.on('player', function(data){
			console.log('player');
		  $('<li />', {text : data.username, id : data.username, appendTo : $('#playerList')});
			//var playerLi = $('#playerList').append($('<li>')).text(data.username).attr('id', data.username);

		  });

		mainScript(username, room);

	}

	function mainScript(username, room) {

		function sendChat() {

			var message = $('#messageBox').val();

			$('#messageBox').val("");

			socket.emit('sendMessage', {room: room, username: username, message: message});

			$('<li />', {text : username+': '+message, class : 'message', appendTo : $('#chatBox')});

			//$('#chatBox').append($('<li>').text(username+": "+message));

			return false;

		}

		window.sendChat = sendChat;

		socket.on('chatMessage', function(data) {
			console.log('chatMessage');

			$('<li />', {text : data.username+': '+data.message, class : 'message', appendTo : $('#chatBox')});

			//$('#chatBox').append($('<li>').text(data.username+": "+data.message));

		  });

		socket.on('playerDisconnect', function(data) {
			console.log('playerDisconnect');

			$('#'+data.username).remove();

			var playerId = players.indexOf(data.username);

			players.splice(playerId);

		  });

	}





}
