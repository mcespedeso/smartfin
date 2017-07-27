var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

//var count=0;
//var myVar = setInterval(myTimer, 1000);
//
//function myTimer() {
//    count++;
//    document.getElementById("notifications").innerHTML = count;
//}

var table;
var edit = false;
$(document).ready(function(){
     table = $('#tabla').DataTable({
    	 "language": { "url": context + "/js/plugins/dataTables/Spanish.json"},
    	pageLength: 10,
        responsive: true,
        dom: '<"html5buttons"B>',
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
    
    $(".select2").select2();
    
    $('.chosen-select').chosen({
    	width: "100%",
    	inherit_select_classes: true
    });
   
    $('#datepicker').datepicker({    	
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es',
       
    });
    
    $('#mapa').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });
    
    var currentDate = new Date();  
    $("#fechadesde").datepicker("setDate",currentDate);
    $("#fechahasta").datepicker("setDate",currentDate);
    
    //usuarios por empresa
    var emp = $("#selectEmpresa");
    getUsuariosByEmpresa(emp.val())   
    getVersionesByEmpresa(emp.val())   
    emp.on("select2:select", function (e) {
    	
    	var table = $('#tabla').DataTable();
    	table.clear().draw();
    	if(emp.val() == 0){
    		
    	}else{
    		getUsuariosByEmpresa(emp.val())    		
    		getVersionesByEmpresa(emp.val()) 
    	}
    	
   });

});


function getUsuariosByEmpresa(id){
	blockScreen();
	$('#selectUsuario').empty();
	$.ajax({
		type : "GET",
		url : context + "/private/user/userByEmpresa/" + id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
			
			} else if (jsonobject.estado == 'OK') {	
				
				var o = $("<option/>", {
					value : "todos",
					text :"Todos"
				});
				$("#selectUsuario").append(o);
				$.each(jsonobject.datos, function(index, element) {
					var o = $("<option/>", {
						value : element.idusuario,
						text : element.username
					});
					$("#selectUsuario").append(o);
					
				
				});
				
				$("#selectUsuario").trigger('change');

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

//versiones por empresa
function getVersionesByEmpresa(id){
	blockScreen();
	$('#selectVersion').empty();
	$.ajax({
		type : "GET",
		url : context + "/private/version/business/" + id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
			
			} else if (jsonobject.estado == 'OK') {	
				$.each(jsonobject.datos, function(index, element) {
					var o = $("<option/>", {
						value : element.idversion,
						text : element.descripcion
					});
					$("#selectVersion").append(o);
				});
				$("#selectVersion").trigger('change');
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


function generar(){
  var error = validate()
  var url_inf = "";
  if(error == 0){
//    if( $('#mapa').is(":checked")){
//    	 url_inf = '/private/semaforo/reporte-encuesta-mapavida';
//    }else{
       url_inf = '/private/semaforo/informe';
//    }
    getReporte(url_inf)
  }
}

//obtener resultado
function getReporte(url_inf){
	var fechadesde = document.getElementById('fechadesde').value
	var fechahasta = document.getElementById('fechahasta').value
	var empresa = $("#selectEmpresa").val();
	var usuario = $("#selectUsuario").val();
	var version = $("#selectVersion").val();
	var mapa = "false";
	if( $('#mapa').is(":checked")){
		mapa = true;
	}
	
	blockScreen();
	
	//SemaforoController
	
	$.ajax({
		type : "GET",
		url : context + url_inf,
		data :{
			"empresa" : empresa,
			"fechadesde" : fechadesde,
			"fechahasta" : fechahasta,
			"version" : version,
			"usuario" : usuario,
			"mapa" : mapa,
		},
		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify .alert("Atención", jsonobject.error, function(){});
			} else if (jsonobject.estado == 'OK') {	
				alertify .alert("Informe creado", "Ok para descargar el archivo CSV", function(){
					var filename = jsonobject.datos;
					var url = context + "/private/report/downloadFile?filename="+filename;
					location.href=url;
					setTimeout('location.reload()', 1000);
				});
			}
			$(document).ajaxStop($.unblockUI);
		},
		error : function(e) {
			
			console.log('el error es: ' + jsonobject.error );
			
			alertify .alert("Error", jsonobject.error, function(){});
			
			$(document).ajaxStop($.unblockUI);
			
		},
		done : function(e) {
			console.log("DONE");
		}
	});
}



function reloadTable(){
	var table = $('#tabla').DataTable();
	table.clear().draw();
	 $("#selectEmpresa").val(1).trigger('chosen:updated');
}

function clearForm() {
	
	table.$('tr.selected').removeClass('selected');
	document.getElementById('mu_idususario').value = 0;
	document.getElementById('mu_username').value = "";
	$("#mu_selectEmpresa").val(1).trigger('chosen:updated');
	$("#mu_selectVersion").val(1).trigger('chosen:updated');
	
	$('#mu_checkEstado').iCheck('check'); 
	$('#mu_selectPerfil').val("").trigger('chosen:updated');
	
	deshablitar($("#btnEdit"))
	hablitar($("#btnAdd"))
	
}

function cerrar(){
	clearForm()
}

function validate(){
	
	var error = 0;
	if (!validarVacio($("#fechadesde").val())) {			
		$("#fechadesde").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#fechadesde").css({'border':'1px solid #d2d6de'});
		 
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





