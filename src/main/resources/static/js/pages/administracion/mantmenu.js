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
    
    getUsuariosByEmpresa($("#selectEmpresa").val()) 
    
    $('#mu_checkEstado').on('ifUnchecked', function(event){
  	  estado = false;
  	});
    $('#mu_checkEstado').on('ifChecked', function(event){
    	  estado = true;
    	});
    
    var emp = $("#selectEmpresa");
    emp.on("select2:select", function (e) {
    	
    	var table = $('#tabla').DataTable();
    	table.clear().draw();
    
    	getUsuariosByEmpresa(emp.val())    		
    
    	
   });
    $("#mu_selectMenuA").attr("disabled", true)	
	 deshablitar($("#mu_selectPrograma"))
    $('#selectTipo').on('change', function() {

    	  if(this.value == "M"){
    		  $("#mu_selectMenuA").attr("disabled", true).trigger('chosen:updated');
    		  $("#mu_selectPrograma").attr("disabled", true).trigger('chosen:updated');
   
    	  }else{
    		  $("#mu_selectMenuA").attr("disabled", false).trigger('chosen:updated');
    		  $("#mu_selectPrograma").attr("disabled", false).trigger('chosen:updated');
    	
    	  }
    	})
});


function modal() {	
	$('#modal').modal()
}

function reloadTable(){
	var table = $('#tabla').DataTable();
	table.clear().draw();
	getUsuariosByEmpresa($("#selectEmpresa").val()) 
	
}



//obtener usuarios
function getUsuarios(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/menu/all",		
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
					
					if(element.activated == true){
						estado = '<span class="label label-primary pull-center">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-center">Desactivo</span>'
					}
					var perfil = "";
			
						for (var i = 0; i < element.perfilusuario.length; i++) {
							if(i == (element.perfilusuario.length - 1)){							
								perfil = perfil + element.perfilusuario[i].perfil.idperfil
							}else{
								perfil = perfil + element.perfilusuario[i].perfil.idperfil + ","
							}
						}
					
					console.log(perfil)
					
					table.rows.add( [ {
							"0": element.idusuario,
							"1": element.username,
							"2": element.empresa.descripcion,	
							"3": element.versionencuesta.descripcion,
							"4": estado,
							"5": element.empresa.idempresa,
							"6": element.versionencuesta.idversion,
							"7": perfil
				
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


//obtener usuarios
function getUsuariosByEmpresa(id){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/menu/menuByPerfil/" + id,		
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
					
					if(element.estado == true){
						estado = '<span class="label label-primary pull-right">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-right">Desactivo</span>'
					}
					
					var tipo = "";
					
					if(element.tipo == "M"){
						tipo = 'Menu'
					}else{
						tipo ='Programa'
					}


					table.rows.add( [ {
							"0": element.idmenu,
							"1": element.descripcion,
							"2": tipo,	
							"3": element.orden,
							"4": estado,
							"5": element.menuanterior,
							"6": element.idclase,
							"7": element.idperfil
				
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
	
	document.getElementById('mu_idmenu').value = fila.cells[0].innerHTML;
	document.getElementById('mu_descripcion').value = fila.cells[1].innerHTML;
	var tipo = fila.cells[2].innerHTML.split("")
	$("#selectTipo").val(tipo[0])
	document.getElementById('mu_orden').value = fila.cells[3].innerHTML;
	
	if(fila.cells[4].innerText == "Activo"){
		$('#mu_checkEstado').iCheck('check'); 
	}else{
		$('#mu_checkEstado').iCheck('uncheck'); 
	}
	
	if(fila.cells[5].innerHTML != ""){		
		$("#mu_selectMenuA").val(fila.cells[5].innerHTML).trigger('chosen:updated');
	}
	if(fila.cells[6].innerHTML != ""){		
		$("#mu_selectPrograma").val(fila.cells[6].innerHTML).trigger('chosen:updated');
	}
	if(fila.cells[7].innerHTML != ""){		
		$("#mu_selectPerfil").val(fila.cells[7].innerHTML).trigger('chosen:updated');
	}

	if(tipo[0]== "M"){
		  $("#mu_selectMenuA").attr("disabled", true).trigger('chosen:updated');
		  $("#mu_selectPrograma").attr("disabled", true).trigger('chosen:updated');

	  }else{
		  $("#mu_selectMenuA").attr("disabled", false).trigger('chosen:updated');
		  $("#mu_selectPrograma").attr("disabled", false).trigger('chosen:updated');
	
	  }
}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('mu_idmenu').value = 0;
	document.getElementById('mu_descripcion').value = "";
	document.getElementById('mu_orden').value = 1;
	$("#selectTipo").val("M")
	$("#mu_selectMenuA").val(1).trigger('chosen:updated');
	$("#mu_selectPerfil").val(1).trigger('chosen:updated');
	$("#mu_selectPrograma").val(1).trigger('chosen:updated');
	
	$('#mu_checkEstado').iCheck('check'); 

	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	$("#mu_descripcion").css({'border':'1px solid #d2d6de'});
	
}



function guardar(){

	if(validate() == 0){	
		var path = context + "/private/menu"
		var pojo =pojoMenu(document.getElementById('mu_idmenu').value, document.getElementById('mu_descripcion').value, 
				 $("#selectTipo").val(), $("#mu_orden").val(), $('#mu_selectPrograma').val(), $('#mu_selectMenuA').val(),
				$('#mu_selectPerfil').val(), estado)
				
			console.log(pojo)	
		if(document.getElementById('mu_idmenu').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"menu" : pojo
				},
				success : function(data) {
					console.log(data)
					data = JSON.stringify(data);
					var jsonobject = JSON.parse(data);
					
					if (jsonobject.estado == "ERROR") {
						$('#modal').modal("toggle")
						alertify.errorAlert(jsonobject.error);
						//alertify.error('Error message');
					} else if (jsonobject.estado == 'OK') {	
						alertify .alert("Proceso Correcto", "Menu insertado correctamente", function(){ 							
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
					"menu" : pojo
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
						alertify .alert("Proceso Correcto", "Menu actualizado correctamente", function(){ 		
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
	if (!validarVacio($("#mu_descripcion").val())) {			
		$("#mu_descripcion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#mu_descripcion").css({'border':'1px solid #d2d6de'});
		 
	 }
	
	if( $("#mu_descripcion").val() == "P"){
		var error2 =0;
		if (!validarSelect($("#mu_selectMenuA").val())) {			
			$("#mu_selectMenuA").addClass('error');
			error2++;
			
		}else{
			  $("#mu_selectMenuA").css({'border':'1px solid #d2d6de'});
			 
		 }
		if (!validarSelect($("#mu_selectPrograma").val())) {			
			$("#mu_selectPrograma").addClass('error');
			error2++;
			
		}else{
			  $("#mu_selectPrograma").css({'border':'1px solid #d2d6de'});
			 
		 }
		if(error2 != 0){
			alertify.warning('Seleccione todas las opciones');
		}
		
		error = error + error2;
	}
	/*if (!validarSelect($("#mu_selectEmpresa").val())) {			
		$("#mu_selectEmpresa").addClass('error');
		error++;
		
	}else{
		  $("#mu_selectEmpresa").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarSelect($("#mu_selectVersion").val())) {			
		$("#mu_selectVersion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#mu_selectVersion").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarSelect($("#mu_selectPerfil").val())) {			
		$(".required").show();
		error++;
		
	}else{
		  $(".required").hide();
		 
	 }*/
	console.log("error: " + error)
	return error;
}







