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
    
    var emp = $("#selectEmpresa");
    emp.on("select2:select", function (e) {
    	
    	var table = $('#tabla').DataTable();
    	table.clear().draw();
    	if(emp.val() == 0){
    		getUsuarios()
    	}else{
    		getUsuariosByEmpresa(emp.val())    		
    	}
    	
   });
    
    if($("#selectEmpresa").val() == 0){
    	getUsuarios();
    }else{
    	getUsuariosByEmpresa($("#selectEmpresa").val()) 
    }
   
});


function modal() {	
	
	if($("#mu_idususario").val() == 0){
		hablitar($("#pwd1"))
		hablitar($("#pwd2"))
	}else{
		deshablitar($("#pwd1"))
		deshablitar($("#pwd2"))
	}
	$('#modal').modal()
}

function reloadTable(){
	var table = $('#tabla').DataTable();
	table.clear().draw();
	
	if($("#selectEmpresa").val() == 0){
		getUsuarios()
	}else{
		getUsuariosByEmpresa($("#selectEmpresa").val())    		
	}

	
}



//obtener usuarios
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
				
				var table = $('#tabla').DataTable();
				console.log("Usuarios " + jsonobject.datos)
				$.each(jsonobject.datos, function(index, element) {
					
					var estado = "";
					
					if(element.activated == true){
						estado = '<span class="label label-primary pull-center">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-center">Activo</span>'
					}
					var perfil = "";
						if(element.perfilusuario != null){							
							for (var i = 0; i < element.perfilusuario.length; i++) {
								if(i == (element.perfilusuario.length - 1)){							
									perfil = perfil + element.perfilusuario[i].perfil.idperfil
								}else{
									perfil = perfil + element.perfilusuario[i].perfil.idperfil + ","
								}
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
		url : context + "/private/user/userByEmpresa/" + id,		
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
					
					if(element.activated == true){
						estado = '<span class="label label-primary pull-right">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-right">Activo</span>'
					}
					
					var perfil = "";
										
						for (var i = 0; i < element.perfilusuario.length; i++) {
							if(i == (element.perfilusuario.length - 1)){							
								perfil = perfil + element.perfilusuario[i].perfil.idperfil
							}else{
								perfil = perfil + element.perfilusuario[i].perfil.idperfil + ","
							}
						}				
					
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


function insertForm(fila) {
	
	document.getElementById('mu_idususario').value = fila.cells[0].innerHTML;
	document.getElementById('mu_username').value = fila.cells[1].innerHTML;
	$("#mu_selectEmpresa").val(fila.cells[5].innerHTML).trigger('chosen:updated');
	$("#mu_selectVersion").val(fila.cells[6].innerHTML).trigger('chosen:updated');
	
	
	if(fila.cells[4].innerText == "Activo"){
		$('#mu_checkEstado').iCheck('check'); 
	}else{
		$('#mu_checkEstado').iCheck('uncheck'); 
	}

	var idperfil = fila.cells[7].innerHTML.split(",") 
	console.log("perfiles " + idperfil)
	
	$('#mu_selectPerfil').val(idperfil).trigger('chosen:updated');
	
}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('mu_idususario').value = 0;
	document.getElementById('mu_username').value = "";
	$("#pwd1").val("")
	$("#pwd2").val("")
	$("#mu_selectEmpresa").val(1).trigger('chosen:updated');
	$("#mu_selectVersion").val(1).trigger('chosen:updated');
	
	$('#mu_checkEstado').iCheck('check'); 
	$('#mu_selectPerfil').val("").trigger('chosen:updated');
	
	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	
}



function guardar(){

	if(validate() == 0){	
		var path = context + "/private/user"
		var usuario =pojoUser(document.getElementById('mu_idususario').value, document.getElementById('mu_username').value, 
				estado, $("#mu_selectEmpresa").val(), $("#mu_selectVersion").val(), $('#mu_selectPerfil').val())
		if(document.getElementById('mu_idususario').value == 0){
			//insert
			$.ajax({
				type : "POST",
				url : path+"/insert",
				data :{
					"usuario" : usuario
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
						alertify .alert("Proceso Correcto", "Usuario " +jsonobject.datos.username + " insertado correctamente", function(){ 							
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
					"usuario" : usuario
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
						alertify .alert("Proceso Correcto", "Usuario " +jsonobject.datos.username + " actualizado correctamente", function(){ 		
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
	if (!validarVacio($("#mu_username").val())) {			
		$("#mu_username").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#mu_username").css({'border':'1px solid #d2d6de'});
		 
	 }
	//solo en los insert
	if($("#mu_idususario").val() == 0){
		if (!validarVacio($("#pwd1").val())) {			
			$("#pwd1").css({'border':'1px solid red'});
			error++;
			
		}else{
			$("#pwd1").css({'border':'1px solid #d2d6de'});
			if($("#pwd1").val() != $("#pwd2").val()){
				error++;
				$("#pwd1").css({'border':'1px solid red'});
				$("#pwd2").css({'border':'1px solid red'});
			}else{
				$("#pwd1").css({'border':'1px solid #d2d6de'});
				$("#pwd2").css({'border':'1px solid #d2d6de'});
			}
			
		}
		
		
	}
	if (!validarSelect($("#mu_selectEmpresa").val())) {			
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
		 
	 }
	console.log("error: " + error)
	return error;
}

function pojoUser(idusuario, username, activated, idempresa, idversion, idperfil){
	
	var perfiles = "";
	for (var i = 0; i < idperfil.length; i++) {
		
		
		if(i == (idperfil.length - 1)){
			perfiles+= '{"perfil":' + pojoPerfil(idperfil[i] , "")+ ","
			perfiles+= '"usuario":{"idusuario": '+ idusuario+'}}' 
		}else{
			perfiles+= '{"perfil":' + pojoPerfil(idperfil[i] , "")+ ","
			perfiles+= '"usuario":{"idusuario": '+ idusuario+'}}' + ","
	
		}
	}
	
	var pojo = "{";
	pojo += '"idusuario":' + idusuario 
	pojo += ',"username": "' +username + '"'
	pojo += ',"activated":' + activated 
	pojo += ',"empresa":' + pojoEmpresa(idempresa, "")
	pojo += ',"versionencuesta" :' + pojoVersionEncuesta(idversion , "")
	pojo += ',"perfilusuario" : ['+perfiles + ']'
	pojo += ',"password": "' +$("#pwd1").val() + '"'
	
	pojo += "}";	
	
	console.log(pojo)
	
	return pojo;

}

function pojoEmpresa(idempresa, descripcion){
	
	var pojo = "{";
	pojo += '"idempresa":' + idempresa
	pojo += ',"descripcion" : "' + descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}

function pojoVersionEncuesta(idversion, descripcion){
	
	var pojo = "{";
	pojo += '"idversion":' + idversion
	pojo += ',"descripcion":"' + descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}

function pojoPerfil(idperfil, descripcion){
	
	var pojo = "{";
	pojo += '"idperfil":' + idperfil
	pojo += ',"descripcion" :"'+ descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}


