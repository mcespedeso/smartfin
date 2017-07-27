var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var table;
var edit = false;
var estado= true
$(document).ready(function(){
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
    
    $(".select2").select2();
    $('.chosen-select').chosen({
    	width: "100%",
    	inherit_select_classes: true
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
		url : context + "/private/version/all",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				var table = $('#tabla').DataTable();
				console.log("Usuarios " + jsonobject.datos)
				$.each(jsonobject.datos, function(index, element) {
					
					var estado = "";
					if(element.estado == true){
						estado = '<span class="label label-primary pull-center">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-center">Inactivo</span>'
					}

					
					table.rows.add( [ {
							"0": element.idversion,
							"1": element.descripcion,
							"2": element.semaforo.descripcion,	
							"3": element.socioeconomica.descripcion,	
							"4": estado,
							"5": element.semaforo.idsemaforo,	
							"6": element.socioeconomica.idsocioeconomica,	
							"7": element.codupdate,
				
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
	
	document.getElementById('mv_idversion').value = fila.cells[0].innerHTML;
	document.getElementById('mv_descripcion').value = fila.cells[1].innerHTML;
	document.getElementById('mv_update').value = parseInt(fila.cells[7].innerHTML) + 1;

	$("#mv_selectSemaforo").val(fila.cells[5].innerHTML).trigger('chosen:updated');
	$("#mv_selectSocioeconomica").val(fila.cells[6].innerHTML).trigger('chosen:updated');

	if(fila.cells[4].innerText == "Activo"){
		$('#mu_checkEstado').iCheck('check'); 
	}else{
		$('#mu_checkEstado').iCheck('uncheck'); 
	}

	deshablitar($("#btnAdd"))
	hablitar($("#btnEdit"))

	
}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('mv_idversion').value = 0;
	document.getElementById('mv_descripcion').value = "";
	document.getElementById('mv_update').value = 1;
	
	$("#mv_selectSemaforo").val(1).trigger('chosen:updated');
	$("#mv_selectSocioeconomica").val(1).trigger('chosen:updated');
	
	
	
	$('#mu_checkEstado').iCheck('check'); 

	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	
}



function guardar(){
	

	if(validate() == 0){	
		var path = context + "/private/version"
		var semaforo =pojoVersionEncuesta(document.getElementById('mv_idversion').value, document.getElementById('mv_descripcion').value, 
				$("#mv_selectSemaforo").val(), $("#mv_selectSocioeconomica").val(), estado, document.getElementById('mv_update').value)
					
		console.log(semaforo)
				
		if(document.getElementById('mv_idversion').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"version" : semaforo
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						$('#modal').modal("toggle")
						alertify.errorAlert(jsonobject.error);
	
					} else if (jsonobject.estado == 'OK') {	
						alertify .alert("Proceso Correcto", "Socioeconomica " +jsonobject.datos.descripcion + " insertado correctamente", function(){ 							
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
					"version" : semaforo
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
						alertify .alert("Proceso Correcto", "Socioeconomica " +jsonobject.datos.descripcion + " actualizado correctamente", function(){ 		
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
	if (!validarVacio($("#mv_descripcion").val())) {			
		$("#mv_descripcion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#mv_descripcion").css({'border':'1px solid #d2d6de'});
	 }
	
	console.log("error: " + error)
	return error;
}





