var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

$(document).ready(function(){
	getPerfiles()

});


function getPerfiles(){
	
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/empresaperfil/all",		
		success : function(data) {
			
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			console.log(jsonobject)
			if (jsonobject.estado == 'ERROR') {

			} else if (jsonobject.estado == 'OK') {	
				
				$.each(jsonobject.datos, function(index, element) {
					var content = "";
					content+= '<div class="col-lg-3"><div class="contact-box center-version"  style="min-height: 336px;"><a href="profile?'+element.idempresa+'">'
						
						if(element.imagen != null){						
							content+= '<img alt="image" class="img-circle" src="'+context+'/public/image/empresa/'+element.imagen+'"/>'
						}else{
							content+= '<img alt="image" class="img-circle" src="'+context+'/img/semaforo/noimage.png"/>'
						}

					
					content+= '<h3 class="m-b-xs"><strong>'+siNuloVacio(element.nombre)+'</strong></h3>'
					content+= '<div class="font-bold">'+siNuloSinInfo(element.rubro)+'</div>'
					content+= '<address class="m-t-md">'
					content+= '<i class="fa fa-map-marker"></i> '+siNuloSinInfo(element.direccion)+'<br/>'
					content+=  siNuloSinInfo(element.email)+'<br/>'
					content+=  siNuloSinInfo(element.telefono)+' </address></a>'
					content+= '<div class="contact-box-footer"><a href="'+siNuloLink(element.facebook)+'" target="_blank" class="btn btn-block btn-social btn-facebook">'
					content+= '<button type="button" class="btn btn-success btn-sm btn-block"><i class="fa fa-facebook"></i> Facebook</button></a></div></div></div>'
						
						
					$("#fila").append(content);
						
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