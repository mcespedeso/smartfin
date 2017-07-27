var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

$(document).ready(function(){
	var obj = JSON.parse(sjcl.decrypt(encrypt, localStorage.usuario));
	$(".select2").select2({ placeholder: "Seleccione un usuario"});
	if($("#idperfil").val() == 1){		
		getUsuarios()
	}else{
		
		getUsuariosByEmpresa(obj.empresa.idempresa)
	}
    
 
});

function resetpass(){
	if($("#pwd").val() != '' && $("#selectUsuario").val() != null ){
		$("#pwd").css({'border':'1px solid #d2d6de'});

		$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
		$.ajax({
			type : "POST",
			url : context + "/private/user/reset/" + $("#selectUsuario").val()+"/"+$("#pwd").val(),	
		
			success : function(data) {
				$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
				console.log(data)
		
				if (data.estado == "ERROR") {
	
					alertify.errorAlert(jsonobject.error);
					//alertify.error('Error message');
				} else if (data.estado == 'OK') {	
					$("#selectUsuario").val("").trigger('change');
					alertify .alert("Proceso Correcto", "Password modificado correctamente", function(){
						
					});
					$("#pwd").val("")
					
				}
			},
			error : function(e) {
				console.log("ERROR: ", e);			
			},
			done : function(e) {
				console.log("DONE");
			}
		});
	}else{
		$("#pwd").css({'border':'1px solid red'});
	}
}


function getUsuarios(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/user/users",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
	
				$.each(jsonobject.datos, function(index, element) {
					
					var o = $("<option/>", {
						value : element.idusuario,
						text : element.username
					});
					$("#selectUsuario").append(o);
	
					$("#selectUsuario").select2().trigger('change');
						
					});		
			
			}
			$(document).ajaxStop($.unblockUI);
		},
		error : function(e) {
			console.log("ERROR: ", e);	
			$(document).ajaxStop($.unblockUI);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}

function getUsuariosByEmpresa(id){
	console.log(id)
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/user/userByEmpresa/" + id,		
		success : function(data) {
			
			if (data.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (data.estado == 'OK') {	
				
				$.each(data.datos, function(index, element) {
					
					var o = $("<option/>", {
						value : element.idusuario,
						text : element.username
					});
					$("#selectUsuario").append(o);
					
					
						
					});			
			}
			$(document).ajaxStop($.unblockUI);
		},
		error : function(e) {
			console.log("ERROR: ", e);		
			$(document).ajaxStop($.unblockUI);
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}