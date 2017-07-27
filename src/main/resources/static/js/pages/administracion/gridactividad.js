var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var table;
var edit = false;
var estado= true
$(document).ready(function(){
	getAll()
	//cortar()
	 $('.rat').rating({displayOnly: true, step: 0.5});
	 $(".select2").select2();

	 var emp = $("#selectEmpresa");
	    emp.on("select2:select", function (e) {
	    	
	    	$(".grid").remove()
	    	filtro()
	    	
	   });
	    var p = $("#selectPreguntas");
	    p.on("select2:select", function (e) {
	    	
	    	$(".grid").remove()
	    	filtro()
	    	
	   });

});

function filtro(){
	var idempresa = $("#selectEmpresa").val();
	var idpregunta = $("#selectPreguntas").val();
	
	var obj = JSON.parse( localStorage.banco);
	console.log(obj)
	console.log(idpregunta)
	$.each(obj, function(index, element) {
		
		if(idempresa == 0 && idpregunta == 0){	
			addCard(element);
		}else{
			
			if(idempresa != 0 && idpregunta != 0){
				console.log("filtra por empresa y pregunta: " + idempresa + " " + idpregunta)
				if(element.empresa.idempresa == idempresa  && element.pregunta.idpregunta == idpregunta){
					addCard(element);
				}
				
			}else{
				if(idempresa != 0){
					console.log("filtra solo por empresa : " + idempresa + " " + idpregunta)
					if(element.empresa.idempresa == idempresa){
						if(idpregunta == 0){
							addCard(element)
						}else {
							if(element.pregunta.idpregunta == idpregunta){
								addCard(element);
							}
						}
					}
				}else{
					console.log("filtra solo por pregunta : " + idempresa + " " + idpregunta)
					if(element.pregunta.idpregunta == idpregunta){
						if(idpregunta == 0){
							addCard(element)
						}else {
							if(element.pregunta.idpregunta == idpregunta){
								addCard(element);
							}
						}
					}
					
				}
				
			}
			
		}
		
	});
	$('.rat').rating({displayOnly: true, step: 0.5});
	
}

function addCard(element){
	var content = '<div class="col-md-3 grid" ><div class="ibox"><div class="ibox-content product-box"><div class="">'
		
		if(element.listImages != null){
			content +='<img alt="image" class="img-responsive center-block"  src="'+context+'/public/image/actividad/'+element.empresa.idempresa+'/'+element.listImages[0].imagen+'" style="height: 200px"/>'
			
		}else{
			content += '<img alt="image" class="img-responsive center-block" src="img/semaforo/noimage.png" style="height: 200px"/>'
		}
	
	content += '</div> <div class="product-desc" style="height: 153px;"><span class="product-price" id="Empresa">'+element.empresa.descripcion+'</span>'
	
	content += '<small class="text-muted" id="Indicador">'+element.pregunta.titulo+'</small>'
	content +=' <a href="#" class="product-name" id="descripcion">'+element.descripcion+'</a><div class="small m-t-xs" id="pasos"></div>'
	content += '<input  name="input-3" value="'+element.rating+'" class="rating rat" data-size="xs"/><div class="m-t text-righ">'
	content += '<a th:href="detalleactividad?'+element.idactividad+'" class="btn btn-xs btn-outline btn-primary">Ver Mas <i class="fa fa-long-arrow-right"></i></a>'
	
	content += '</div> </div> </div> </div> </div>'
		
		$("#fila").append(content);
}

//obtener usuarios
function getAll(){
	
	if(localStorage.banco  == null){
		
		blockScreen();
		$.ajax({
			type : "GET",
			url : context + "/private/actividad/aprobados",		
			success : function(data) {
				console.log(data)
				data = JSON.stringify(data);
				var jsonobject = JSON.parse(data);
				if (jsonobject.estado == 'ERROR') {
					alertify.errorAlert(jsonobject.Message);
				} else if (jsonobject.estado == 'OK') {	
					localStorage.banco = JSON.stringify(jsonobject.datos)
					
					
					
					
					
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
	}else{
		
		
		
	}
	
}





