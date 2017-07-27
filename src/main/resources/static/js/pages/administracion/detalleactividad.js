var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var table;
var edit = false;
var estado= true
var idactividad = 0;
$(document).ready(function(){
    
	$('.product-images').slick({
        dots: true
    });
	window.setTimeout(varURL(), 200);
	
	$('#input-1').on('rating.change', function(event, value, caption) {
	    console.log(value);
	    valorar(value)
	});


});


function varURL() {
	var tmpURL = window.location.href;
	tmpURL = tmpURL.split('?')
	var id = tmpURL[1]
	if (id != null) {
		getByID(id)

	}else{
		$('.product-images').slick('slickAdd','<div><img alt="image" class="img-responsive" id="imagen" src="img/semaforo/noimage.png"/> </div>')
	}
}

function valorar(value ){
	console.log(idactividad)
	if(idactividad != 0){
		
		$.ajax({
			type : "POST",
			url : context+"/private/actividad/rating",
			data :{
				"idactividad" :idactividad,
				"rating" : value
			},
			success : function(data) {
				console.log(data)
				data = JSON.stringify(data);
				var jsonobject = JSON.parse(data);
				
				if (jsonobject.estado == "ERROR") {
					swal({
						title: "Ha ocurrido un error!",
						type: "error",
						confirmButtonText: "OK",
						allowOutsideClick: false,
						closeOnCancel: true,
					});
					
				} else if (jsonobject.estado == 'OK') {	
					document.getElementById('rat').innerHTML =jsonobject.datos
					
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
		swal({
			title: "No hay informacion de esta actividad",
			type: "info",
			confirmButtonText: "OK",
			allowOutsideClick: false,
			closeOnCancel: true,
		});
	}
	
}


//obtener usuarios
function getByID(id){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/actividad/"+id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				if(jsonobject.datos.empresa != null){
					
					document.getElementById('descripcion').innerHTML = jsonobject.datos.descripcion
					document.getElementById('empresa').innerHTML = 	jsonobject.datos.empresa.descripcion
					document.getElementById('indicador').innerHTML = 	jsonobject.datos.pregunta.titulo
					document.getElementById('pasos').innerHTML = 	jsonobject.datos.pasos
					document.getElementById('aliados').innerHTML = 	jsonobject.datos.aliados
					document.getElementById('cantidad').innerHTML = 	jsonobject.datos.cantidad
					if(jsonobject.datos.obs != null)
						document.getElementById('obs').innerHTML = 	jsonobject.datos.obs;
					if(jsonobject.datos.listImages != null ){
						$.each(jsonobject.datos.listImages, function(index, element) {						
							$('.product-images').slick('slickAdd','<div><img alt="image" class="img-responsive" id="imagen" src="'
									+context+'/public/image/actividad/'+jsonobject.datos.empresa.idempresa+'/'+element.imagen+'"/> </div>')
						});
					}else{
						$('.product-images').slick('slickAdd','<div><img alt="image" class="img-responsive" id="imagen" src="img/semaforo/noimage.png"/> </div>')
					}
					$("#profile").attr("href", context+ "/profile?"+jsonobject.datos.empresa.idempresa)
					document.getElementById('rat').innerHTML =jsonobject.datos.rating
					$('#input-1').rating('update', jsonobject.datos.miRating);
					idactividad= jsonobject.datos.idactividad
				}
				
				
						
						
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


function insertForm(fila) {
	
	document.getElementById('ms_idsemaforo').value = fila.cells[0].innerHTML;
	document.getElementById('ms_descripcion').value = fila.cells[1].innerHTML;
	document.getElementById('ms_update').value = parseInt(fila.cells[2].innerHTML) + 1;

	if(fila.cells[3].innerText == "Activo"){
		$('#ms_checkEstado').iCheck('check'); 
	}else{
		$('#ms_checkEstado').iCheck('uncheck'); 
	}

	deshablitar($("#btnAdd"))
	hablitar($("#btnEdit"))

}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('ms_idsemaforo').value = 0;
	document.getElementById('ms_descripcion').value = "";
	document.getElementById('ms_update').value = 1;
	
	$('#mu_checkEstado').iCheck('check'); 

	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	
}



function guardar(){

	if(validate() == 0){	
		var path = context + "/private/semaforo"
		var semaforo =pojoSemaforo(document.getElementById('ms_idsemaforo').value, document.getElementById('ms_descripcion').value,document.getElementById('ms_update').value,  estado)
				console.log(semaforo)
		if(document.getElementById('ms_idsemaforo').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"semaforo" : semaforo
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						$('#modal').modal("toggle")
						alertify.errorAlert(jsonobject.error);
	
					} else if (jsonobject.estado == 'OK') {	
						alertify .alert("Proceso Correcto", "Semaforo " +jsonobject.datos.descripcion + " insertado correctamente", function(){ 							
						});
						
						clearForm();
						$('#modal').modal("toggle")
						reloadTable()
						
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
			//update
			$.ajax({
				type : "POST",
				url : path+"/update",
				data :{
					"semaforo" : semaforo
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						$('#modal').modal("toggle")
						alertify.errorAlert(jsonobject.error);
						alertify.error('Error message');
					} else if (jsonobject.estado == 'OK') {	
						alertify .alert("Proceso Correcto", "Semaforo " +jsonobject.datos.descripcion + " actualizado correctamente", function(){ 		
						});
						clearForm();
						$('#modal').modal("toggle")
						reloadTable()
						
						
					}
				},
				error : function(e) {
					console.log("ERROR: ", e);			
				},
				done : function(e) {
					console.log("DONE");
				}
			});
			
		}
		
	  
	}
	
}

function cerrar(){
	clearForm()
}


function validate(){
	
	var error = 0;
	if (!validarVacio($("#ms_descripcion").val())) {			
		$("#ms_descripcion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#ms_descripcion").css({'border':'1px solid #d2d6de'});
	 }
	
	console.log("error: " + error)
	return error;
}





