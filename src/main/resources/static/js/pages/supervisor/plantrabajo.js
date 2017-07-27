var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
$(document).ready(function() {
	
/*  $('.footable').footable({
	  "empty": "No hay datos",
	  

  });*/
  $(".select2").select2();
  
  $('#datepicker').datepicker({    	
      keyboardNavigation: false,
      forceParse: false,
      autoclose: true,
      language: 'es',
      	
  });
  
  getAll()



});

function reloadTable(){
	var rows = document.getElementById("tabla").rows;
	for (var i = rows.length-1; i > 0; i--) {
		rows[i].remove()
	}

	getAll();
	
}

function cancelar(){
	/*console.log($("#selectPreguntas").select2())
	$("#selectPreguntas").index(0)
	clearForm()
	reloadTable()*/
	location.reload(true)
	
}
function clearForm() {
	$("#comentario").val("")
	$("#idplan").val(0)
	$("#fecha").val("")


}

function guardar(){
	if(validate() == 0){	
		var path = context + "/private/plantrabajo"
		var semaforo =pojoPlantrabajo($("#idplan").val(), $("#selectPreguntas").val() , $("#comentario").val(), $("#fecha").val(), true)
		
		if(document.getElementById('idplan').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"plantrabajo" : semaforo
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
							}).then(function () {
								 cancelar()
							});
	
					} else if (jsonobject.estado == 'OK') {	
						/*alertify .alert("Proceso Correcto", "Semaforo " +jsonobject.datos.descripcion + " insertado correctamente", function(){ 							
						});*/
						swal({
							  title: "Proceso Correcto!",
							  type: "success",
							  confirmButtonColor: "#1ab394",
							  confirmButtonText: "Aceptar",
							  allowOutsideClick: false,
							  closeOnCancel: true,
		
							});
						
						clearForm();
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
					"plantrabajo" : semaforo
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						
						swal({
							  title: "Ha ocurrido un error!",
							  type: "error",
							  confirmButtonColor: "#1ab394",
							  confirmButtonText: "OK",
							  allowOutsideClick: false,
							  closeOnCancel: true
						});
						
					} else if (jsonobject.estado == 'OK') {	
						swal({
							  title: "Proceso Correcto!",
							  type: "success",
							  confirmButtonColor: "#1ab394",
							  confirmButtonText: "Aceptar",
							  allowOutsideClick: false,
							  closeOnCancel: true
							});
						clearForm();
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

function borrar(index, estado){

	var table = document.getElementById("tabla");

	console.log(table.rows[index+1].cells[6].innerHTML)
	
	swal({
		  title: "Estas seguro?",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#1ab394",
		  confirmButtonText: "Si, Eliminar!",
		  cancelButtonText: "Cancelar",
		  closeOnConfirm: false,
		  closeOnCancel: false
		},
		function(isConfirm){
		  if (isConfirm) {
			  var semaforo =pojoPlantrabajo(table.rows[index+1].cells[6].innerHTML, table.rows[index+1].cells[7].innerHTML ,
					  table.rows[index+1].cells[2].innerHTML, table.rows[index+1].cells[3].innerHTML, estado)
					  
					  
			  $.ajax({
					type : "POST",
					url :context +  "/private/plantrabajo/update",
					data :{
						"plantrabajo" : semaforo
					},
					success : function(data) {
						console.log(data)
						data = JSON.stringify(data);
						var jsonobject = JSON.parse(data);
						
						if (jsonobject.estado == "ERROR") {
							
							swal("Ha ocurrido un error!", "", "error");
							
						} else if (jsonobject.estado == 'OK') {	
							 swal("Eliminado!", "", "success");
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
			  
		   
		  } else {
		    swal("Cancelado", "", "error");
		  }
		});
}

function editar(index){
	var table = document.getElementById("tabla");
	console.log(table.rows[index+1].cells[4].childNodes[0].innerHTML)
	if(table.rows[index+1].cells[4].childNodes[0].innerHTML == 'En Curso'){
		
		$("#comentario").val(table.rows[index+1].cells[2].innerHTML)
		$("#idplan").val(table.rows[index+1].cells[6].innerHTML)
		$("#fecha").val(table.rows[index+1].cells[3].innerHTML)
		$("#selectPreguntas").val(table.rows[index+1].cells[7].innerHTML).trigger('change');
		
		
	}else{
		alert("No puedes editar")
	}
}

function reportar(index){

	var table = document.getElementById("tabla");

	console.log(table.rows[index+1].cells[6].innerHTML)
}

function getAll(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/plantrabajo/byEmpresa",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				var table = $('#tabla');
				$.each(jsonobject.datos, function(index, element) {
					var newRow = '<tr>'
						newRow += "<td>"+(index+1)+"</td>"
						newRow += "<td>"+element.pregunta.nropregunta+" - "+element.pregunta.abreviatura+"</td>"
						newRow += "<td>"+element.comentario+"</td>"
						newRow += "<td >"+formatFecha(element.fechalimite)+"</td>"
	
					if(element.estado == true){
						newRow += '<td><span class="label label-info">En Curso</span></td>'
					}else{
						newRow +='<td><span class="label label-success">Reportado</span></td>'
					}
					newRow +='<td class="text-right"><button class="btn btn-danger btn-rounded" type="button" onclick="borrar('+index+', false)"><i class="fa fa-times"></i> Borrar</button>'+
                        '<button class="btn btn-info btn-rounded" type="button" onclick="editar('+index+')"><i class="fa fa-edit"></i> Editar</button>'+
                        '</td>'
                    newRow +='<td>'+element.idplantrabajo+'</td>'
                    newRow +='<td>'+element.pregunta.idpregunta+'</td>'
					newRow += '</tr>'
						//table.rows.load(rows)
					$('#tabla tbody').append(newRow);
		
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


function validate(){
	
	var error = 0;
	if (!validarVacio($("#comentario").val())) {			
		$("#comentario").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#comentario").css({'border':'1px solid #d2d6de'});
	 }
	if (!validarVacio($("#fecha").val())) {			
		$("#fecha").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#fecha").css({'border':'1px solid #d2d6de'});
	 }
	
	console.log("error: " + error)
	return error;
}