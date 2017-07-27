var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var estado= 1
var usuario;
$(document).ready(function(){
	usuario = JSON.parse(sjcl.decrypt(encrypt, localStorage.usuario));
	console.log(usuario)
	$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
	if($("#selectPlan").val() == null){
		swal({
			  title: "No tienes prioridades definidas",
	          text: "Favor, complete sus prioridades..",
	          confirmButtonText: "Completar",
			  confirmButtonColor: "#1ab394",
			  closeOnConfirm: false
			},
			function(){
				window.location.href = context +'/plantrabajo'; 
			});
	}else{	    	
	    	getAll()
	    	$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
	}
	
	$('.i-checks').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green',
    });
    
    $(".select2").select2();
    

    $('#datepicker').datepicker({    	
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es',
        	
    });
    var currentDate = new Date();  
    $("#fechadesde").datepicker("setDate",currentDate);
    $("#fechahasta").datepicker("setDate",currentDate);
    
    
    $('#ms_checkEstado').on('ifUnchecked', function(event){
    	$("#labelEstado").text(" PREPARADO")
    	  estado = 1;
    	});
      $('#ms_checkEstado').on('ifChecked', function(event){
      	  estado = 4;
      	$("#labelEstado").text("  TERMINADO")
      	});
    
    /* initialize the calendar
    -----------------------------------------------------------------*/
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
    	header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventClick: function(calEvent, jsEvent, view) {

        	editar(calEvent)
        	hablitar($("#btnBorrar"))
        	

        }
       
        
    });
	
});

function editar(evento){
	console.log(evento)
	document.getElementById('idcalendario').value = evento.id;
	document.getElementById('descripcion').value = evento.title;
	$("#selectPlan").val()
	
	//fechadesde
	var d = Date.parse(evento.start);
	var date = new Date(d)
	date.setDate(date.getDate() + 1); 
	
	
	$("#fechadesde").datepicker("setDate", date);
	if(evento.end != null){	
		//fechahasta
		var d2 = Date.parse(evento.end);
		var date2 = new Date(d2)
		date2.setDate(date2.getDate() + 1); 
		$("#fechahasta").datepicker("setDate", date2);
	}else{
		$("#fechahasta").datepicker("setDate", date);
	}
	
	if(evento.textColor == "1"){
		$('#ms_checkEstado').iCheck('uncheck'); 
		$("#labelEstado").text(" PREPARADO")
		estado = 1;
	}else{
		$('#ms_checkEstado').iCheck('check'); 
		estado = 4;
		$("#labelEstado").text("  TERMINADO")
	}
	if(evento.textColor == "5"){
		//swal("Mensaje", "Ya reportaste este evento")
		deshablitar($("#btnGuardar"))

	}else{
		hablitar($("#btnReportar"))
		hablitar($("#btnGuardar"))
		
		
	}
	
	
	//$('#ms_checkEstado').iCheck('uncheck'); 
	
}

function borrar(){
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
			  guardar(true)	  
		  } else {
		    swal("Cancelado", "", "error");
		  }
		});
}

function guardar(ban){
	if(validate() == 0){
		var accion = ""
		if(ban){
			estado = 3;
			accion = " borrado satisafactoriamente"
		}
		var pojo = pojoCalendario($("#idcalendario").val(), $("#selectPlan").val(), $("#descripcion").val() ,
				$("#fechadesde").val(), $("#fechahasta").val(), estado, false)
		var path = context + "/private/calendario"
		if(document.getElementById('idcalendario').value == 0){
			accion = " insertado satisafactoriamente"
					//insert
			$.ajax({
						type : "POST",
						url : path+"/insert",
						data :{
							"calendario" : pojo
						},
						success : function(data) {
							console.log(data)
							data = JSON.stringify(data);
							var jsonobject = JSON.parse(data);
							
							if (jsonobject.estado == "ERROR") {
								$('#modal').modal("toggle")
								alertify.errorAlert(jsonobject.error);
			
							} else if (jsonobject.estado == 'OK') {	
								
								swal({
									  title: "Proceso Correcto!",
									  text: "Evento " +jsonobject.datos.descripcion + accion,
									  type: "success",
									  confirmButtonColor: "#1ab394",
									  confirmButtonText: "Aceptar",
									  allowOutsideClick: false,
									  closeOnCancel: true,
				
									});
								$('#calendar').fullCalendar( 'removeEvents' );
								getAll()
								clearForm();

								
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
							"calendario" : pojo
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
							
								swal({
									  title: "Proceso Correcto!",
									  text: "Evento " +jsonobject.datos.descripcion + accion,
									  type: "success",
									  confirmButtonColor: "#1ab394",
									  confirmButtonText: "Aceptar",
									  allowOutsideClick: false,
									  closeOnCancel: true,
				
									});
								$('#calendar').fullCalendar( 'removeEvents' );
								getAll()
								clearForm();
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

function cancelar(){
	clearForm()
	hablitar($("#btnGuardar"))
}

function reportar(){
	window.location.href = context + "/actividad?"+document.getElementById('idcalendario').value
}

function clearForm() {
	
	document.getElementById('idcalendario').value = 0;
	document.getElementById('descripcion').value = "";
	document.getElementById('fechahasta').value = "";
	
	 var currentDate = new Date();  
	 $("#fechadesde").datepicker("setDate",currentDate);
	
	$('#ms_checkEstado').iCheck('uncheck'); 

	deshablitar($("#btnBorrar"))
	deshablitar($("#btnReportar"))
	
	
}

function getAll(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/calendario/byEmpresa",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				var myCalendar = $('#calendar'); 
				myCalendar.fullCalendar();
			    
				myCalendar.fullCalendar( 'refresh' )
				$.each(jsonobject.datos, function(index, element) {
						
		                var myEvent = {
		                		  id: element.idcalendario,
		                		  title: element.descripcion,
		                		  allDay: true,
		                		  start: Date.parse(element.fechadesde),
		                		  /*url: 'http://google.com/',*/
		                		};
		                
		                if(element.fechahasta != element.fechadesde ){
		                	myEvent.end = Date.parse(element.fechahasta)
		                }
		                if(element.estados.idestado == 1){
		                	myEvent.color = "#f8ac59"
		                		myEvent.textColor = "1"
		                }else if(element.estados.idestado == 4){
		                	myEvent.color = "#1ab394"
		                	myEvent.textColor = "4"
		                }else if(element.estados.idestado == 5){
		                	myEvent.color = "#1c84c6"
			                	myEvent.textColor = "5"
			            }
		                myCalendar.fullCalendar( 'renderEvent', myEvent );
	
						
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
	if (!validarVacio($("#descripcion").val())) {			
		$("#descripcion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#descripcion").css({'border':'1px solid #d2d6de'});
	 }
	
	if (!validarVacio($("#fechahasta").val())) {			
		var currentDate = new Date();  
	    $("#fechahasta").val($("#fechadesde").val());
		
	}else{
		 
	 }
	
	console.log("error: " + error)
	return error;
}