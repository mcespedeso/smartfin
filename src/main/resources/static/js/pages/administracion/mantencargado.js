var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var table;
var edit = false;
var estado= true
$(document).ready(function(){
	
	 $('#datepicker').datepicker({    	
	        keyboardNavigation: false,
	        forceParse: false,
	        autoclose: true,
	        language: 'es',
	        	
	    });
	    
	    var currentDate = new Date();  
	    $("#fechadesde").datepicker("setDate",currentDate);
	    
     table = $('#tabla').DataTable({
    	 "language": { "url": context + "/js/plugins/dataTables/Spanish.json"},
    	pageLength: 10,
        responsive: true,
        dom: '<"html5buttons"B>lTfgitp',
        buttons: [
            { extend: 'copy'},
            {extend: 'csv'},
            {extend: 'excel', title: 'Usuarios'},
            {extend: 'pdf', title: 'Usuarios'},

            {extend: 'print',
             customize: function (win){
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                            .addClass('compact')
                            .css('font-size', 'inherit');
            }
            }
        ]

    });
    
    $('#tabla tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            deshablitar($("#btnEdit"))
            deshablitar($("#btnDelete"))
            hablitar($("#btnAdd"))
            edit = false;
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            hablitar($("#btnEdit"))
            hablitar($("#btnDelete"))
            deshablitar($("#btnAdd"))
            edit = true;
           // clearForm()
            insertForm(this);
            
        }
    } );
    
   
    
   $('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    
   $('#mu_checkEstado').on('ifUnchecked', function(event){
	  	  estado = false;
	  	});
	$('#mu_checkEstado').on('ifChecked', function(event){
	    	  estado = true;
	  });
    
    
    getUsuarios();

});

function modal() {	
	$('#modal').modal()
}

function reloadTable(){
	var table = $('#tabla').DataTable();
	table.clear().draw();
	 getUsuarios();
	
}



//obtener usuarios
function getUsuarios(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/contrato/encargado/all",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				var table = $('#tabla').DataTable();
				$.each(jsonobject.datos, function(index, element) {
					
					var estado = "";
					if(element.estado != null){						
						if(element.estado == true){
							estado = '<span class="label label-primary pull-center">Activo</span>'
						}else{
							estado ='<span class="label label-danger pull-center">Inactivo</span>'
						}
					}

					
					table.rows.add( [ {
							"0": element.idcontratoencargado,
							"1": element.nrodoc,
							"2": siNuloVacio(element.nombres),
							"3": siNuloVacio(element.apellidos),
							"4": siNuloVacio(element.telefono),
							"5": siNuloVacio(element.direccion),
							"6":  siNuloVacio(element.correo),
							"7":  siNuloVacio(element.idcontrato.empresa.descripcion),
							"8": estado,
							"9": siNuloCero(element.idcontrato.idcontrato),
							"10": siNuloCero(element.idcontrato.empresa.idempresa),
				
						}
						] ).draw();
						
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


function insertForm(fila) {
	
	document.getElementById('ms_idempresa').value = fila.cells[0].innerHTML;
	document.getElementById('ms_descripcion').value = fila.cells[1].innerHTML;
	document.getElementById('ms_nrocontrato').value = fila.cells[2].innerHTML;
	document.getElementById('ms_observaciones').value = fila.cells[5].innerHTML;
	document.getElementById('ms_idcontrato').value = fila.cells[7].innerHTML;
	//fechadesde
	if(fila.cells[3].innerHTML != ""){		
		var d = Date.parse(fila.cells[3].innerHTML);
		var date = new Date(d)
		$("#fechadesde").datepicker("setDate", fila.cells[3].innerHTML);
	}
	//fechadesde
	if(fila.cells[4].innerHTML != ""){		
		var d = Date.parse(fila.cells[4].innerHTML);
		var date = new Date(d)
		$("#fechahasta").datepicker("setDate", fila.cells[4].innerHTML);
	}

	if(fila.cells[6].innerText != ""){		
		if(fila.cells[6].innerText == "Activo"){
			$('#ms_checkEstado').iCheck('check'); 
		}else{
			$('#ms_checkEstado').iCheck('uncheck'); 
		}
	}

	deshablitar($("#btnAdd"))
	hablitar($("#btnEdit"))

}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('ms_idempresa').value = 0;
	document.getElementById('ms_idcontrato').value = 0;
	document.getElementById('ms_descripcion').value = "";
	document.getElementById('ms_nrocontrato').value = "";
	document.getElementById('ms_observaciones').value = "";
	var currentDate = new Date();  
    $("#fechadesde").datepicker("setDate",currentDate);
    $("#fechahasta").val("")
	
	$('#mu_checkEstado').iCheck('check'); 

	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	
	
	
}



function guardar(){

	if(validate() == 0){	
		var path = context + "/private/empresa"
		var semaforo =pojoEmpresa(document.getElementById('ms_idempresa').value, document.getElementById('ms_descripcion').value)
				console.log(semaforo)
		var contrato = pojoContrato($("#ms_idcontrato").val(), $("#ms_idempresa").val(), $("#fechadesde").val(), $("#fechahasta").val(), $("#ms_nrocontrato").val(),  $("#ms_observaciones").val(), estado)
		
		
		if(document.getElementById('ms_idempresa').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"empresa" : semaforo,
					"contrato" : contrato
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						$('#modal').modal("toggle")
						alertify.errorAlert(jsonobject.error);
	
					} else if (jsonobject.estado == 'OK') {	
						alertify .alert("Proceso Correcto", jsonobject.datos.descripcion + " insertado correctamente", function(){ 							
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
					"empresa" : semaforo,
					"contrato" : contrato
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
						alertify .alert("Proceso Correcto", jsonobject.datos.descripcion + " actualizado correctamente", function(){ 		
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
	if (!validarVacio($("#fechahasta").val())) {			
		$("#fechahasta").css({'border':'1px solid red'});
		error++;
		
	}else{
		 $("#fechahasta").css({'border':'1px solid #d2d6de'});
	 }
	
	console.log("error: " + error)
	return error;
}





