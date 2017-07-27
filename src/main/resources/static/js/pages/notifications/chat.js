var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var chat_room = "/private/chat/room";

$(document).ready(function() {
	$("#mensaje_a_enviar").focus();
	conectarSocket();
});

//conetctar al canal /chat/room y recibir mensajes
function conectarSocket() {
	var socket = new SockJS(context + '/ws');
	var stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		stompClient.subscribe('/queue/notify', function(notification) {
			console.log('el user es: ' + JSON.parse(notification.body).user);
			recibir_mensaje(JSON.parse(notification.body).message, JSON.parse(notification.body).user);
		});
	});
	return;
}

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
}  

function recibir_mensaje(message, user) {
	var date = formatAMPM(new Date());
	var me = {};
	me.avatar = context+"/img/User-48-blank.png";
	var user_name = $('#user_name').val();
	var quotes = new Array("aliceblue", "azure", "gainsboro", "lightblue", "thistle"),
	randno = quotes[Math.floor( Math.random() * quotes.length )];
	control = '';
	if (user_name == user) {
		control +=  '<div class="chat-message right">';
	}else{
		control +=  '<div class="chat-message left">';
	}
	 control += '<img class="message-avatar" src="img/User-48-blank.png" alt="" />' +
                '<div class="message" style="background-color: '+randno+'" >' +
	            '<a class="message-author" href="#"> '+user+' </a>' +
	 		    '<span class="message-date">  '+date+' </span>' +
	 		    '<span class="message-content">'+
	 		    message+
	 		    '</span>'+
	 		    '</div>';
	 $("#helloo").append(control);
	var $textarea = $('#discussion');
    $textarea.scrollTop($textarea[0].scrollHeight);
	return;
}

//enviar mensaje con enter
$('#mensaje_a_enviar').keydown(function (e){
    if(e.keyCode == 13){
    	var ms = $('#mensaje_a_enviar').val();    	
   	 $.ajax({
            url: context+"/private/chat/sendmessage",
            type: "POST",
            data: { message: ms, user : "none"}
          });
   	 $('#mensaje_a_enviar').val("");
   	 $("#mensaje_a_enviar").focus();
    }
})

//enviar mensaje con click buttom
$("#enviar_mensaje").click(function(){
	var ms = $('#mensaje_a_enviar').val();
	 $.ajax({
         url: context+"/private/chat/sendmessage",
         type: "POST",
         data: { message: ms, user : "none"}
       });
	 $('#mensaje_a_enviar').val("");
	 $("#mensaje_a_enviar").focus();
}); 

$("#sendMessage").click(function() {
	$("#textMessage").val("");
	$("#textMessage").focus();
});
