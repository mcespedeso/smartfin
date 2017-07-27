var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
$(document).ready(function() {
	
/*  $('.footable').footable({
	  "empty": "No hay datos",
	  

  });*/
  $(".select2").select2();


  var emp = $("#selectEmpresa");
  emp.on("select2:select", function (e) {
  	
	  reloadTable
  	if(emp.val() == 0){
  		
  	}else{
  		getByEmpresa(emp.val())    		
  	}
  	
 });

});


function getByEmpresa(id){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/plantrabajo/byEmpresa/" + id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				if(jsonobject.datos.length == 0){
					swal({
						  title: "No posee prioridades",
						  type: "info",
						  confirmButtonColor: "#1ab394",
						  confirmButtonText: "Aceptar",
						  closeOnCancel: true,
	
						});
				}else{
					
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

function reloadTable(){
	var rows = document.getElementById("tabla").rows;
	for (var i = rows.length-1; i > 0; i--) {
		rows[i].remove()
	}

	
}

function cancelar(){
	location.reload(true)
	
}
function clearForm() {
	$("#comentario").val("")
	$("#idplan").val(0)
	$("#fecha").val("")


}
