var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var dzClosure1;
var id=0;
var cont = 0;
var ban = false;
var idpregunta = 0;
$.getScript(context + '/js/plugins/dropzone/dropzone.min.js',function(){
	  // instantiate the uploader
	Dropzone.autoDiscover = false;
	//imagen 1
	  $('#dropzone').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/actividad/image',
		  dictDefaultMessage: 'Click para subir las Imagenes',
		  autoProcessQueue: false,
		  uploadMultiple: true,
		  parallelUploads: 5,
		  maxFiles: 5,
		  maxFilesize: 10,
		  acceptedFiles: 'image/*',
		  dictMaxFilesExceeded: "Puedes subir hasta 5 imagenes",
		  dictResponseError: 'Server not Configured',
		  dictFileTooBig:"El archivo es muy grande ({{filesize}}MiB). Tamano max: {{maxFilesize}}MiB.",

		  init: function() {
			  dzClosure1 = this;
		    this.on('success', function( file, resp ){

		      if(file.status == "success"){
	
		    	  swal({
		    		  title: "Proceso Correcto!",
		    		  text: "La actividad fue enviado para revision, Gracias :) ",
		    		  type: "success",
		    		  confirmButtonColor: "#1ab394",
		    		  confirmButtonText: "Aceptar",
		    		  allowOutsideClick: false,
		    		  closeOnConfirm: false
		    		},
		    		
		    		function(){
		    			window.location.href = context + "/actividad"
		    		});
		   
		      }else{
		    	  
		    	  alertify.errorAlert("Error al subir las imagenes, intentelo nuevamente");
		      }
		      
		    });
		    this.on('thumbnail', function(file) {
		      if ( file.width < 320 || file.height < 320 ) {
		        file.rejectDimensions();
		      }
		      else {
		        file.acceptDimensions();
		      }
		    });
		    this.on('sending', function (data, xhr, formData) {
		    	formData.append("idactividad", id);


        });
		    this.on("maxfilesexceeded", function(file) {
              alert("Puedes subir hasta 5 imagenes");
              dzClosure1.removeFile(file);
              ban = false;
	    	   deshablitar($("#btnEnviar"))
          });
		    this.on("error", function(file,response) {

		    	swal("Erro","Verifique le tamano de la imagen y vuelva a intentar" , "error")
		    	   ban = false;
		    	   deshablitar($("#btnEnviar"))

		    	});
		    this.on("addedfile", function (file) {
            // Create the remove button
            var removeButton = Dropzone.createElement("<button class='btn btn-w-m btn-danger'>Borrar Archivo</button>");              // Listen to the click event
            removeButton.addEventListener("click", function (e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();
                dzClosure1.removeFile(file);
                ban = false;
				deshablitar($("#btnEnviar"))
            });
            file.previewElement.appendChild(removeButton);
        });
		  },
		  accept: function(file, done) {
			  cont++;
			  console.log(cont)
			  if (file.size == 0) {
				  alert("Debes subir las imagenes")
			      done("Empty files will not be uploaded.");
				  ban = false;
				  deshablitar($("#btnEnviar"))
			    }else{
			    	ban =true;
			    	hablitar($("#btnEnviar"))
			    	file.acceptDimensions = done;
			    	file.rejectDimensions = function() {
			    		done('La imagen debe tener al menos 320 px x 320 px')
			    	};
			    }
		    
		  }
	  });
	  
});

$(document).ready(function() {
	
	$('#fecha').datepicker({    	
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es',
        	
    });
	 
	 window.setTimeout(varURL(), 200);
	 $(".select2").select2();
});

function enviar(){
	if(validate() == 0){	
		$.ajax({
			type : "POST",
			url : context+"/private/actividad/insert",
			data :{
				"actividad" : pojoActividad(0, $("#idcalendario").val(), $("#nombre").val(), $("#aliados").val() ,
    					$("#cantidad").val(), $("#pasos").val(), $("#obs").val(), $("#selectPreguntas").val(), $("#fecha").val())
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
					id = jsonobject.datos.idactividad
					dzClosure1.processQueue();

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
		$('#tabs a[href="#tab-1"]').tab('show');
		$("#tab1").addClass("active")
		$("#tab4").removeClass("active")
	}
}

function nextTab(){

	if(validate() == 0){
	$('#tabs a[href="#tab-4"]').tab('show');
		$("#tab4").addClass("active")
		$("#tab1").removeClass("active")
		window.location.hash = "tab4";
		window.location.hash = "";
		
	}else{
		
		
	}
	
}	

function getByID(id){
	
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/calendario/"+id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				swal(jsonobject.error, "", "error");
			} else if (jsonobject.estado == 'OK') {	
				
					
					$("#idcalendario").val(jsonobject.datos.idcalendario)
					$("#empresa").val(siNuloSinInfo(jsonobject.datos.empresa.descripcion))
					$("#fecha").val(formatFecha(jsonobject.datos.fechadesde))
					$("#selectPreguntas").val(jsonobject.datos.plantrabajo.pregunta.idpregunta)
					deshablitar($("#empresa"))
					deshablitar($("#fecha"))
					deshablitar($("#selectPreguntas"))
					
						
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

function varURL() {
	var tmpURL = window.location.href;
	tmpURL = tmpURL.split('?')
	var id = tmpURL[1]
	if (id != null) {
		getByID(id)

	}
}


//////////////////////


function cancelar(){
	location.reload(true)
	
}




function validate(){
	
	var error = 0;
	if (!validarVacio($("#nombre").val())) {			
		$("#nombre").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#nombre").css({'border':'1px solid #d2d6de'});
	 }
	if (!validarVacio($("#empresa").val())) {			
		$("#empresa").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#empresa").css({'border':'1px solid #d2d6de'});
	 }
	
	if (!validarVacio($("#fecha").val())) {			
		$("#fecha").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#fecha").css({'border':'1px solid #d2d6de'});
	 }

	if (!validarVacio($("#aliados").val())) {			
		$("#aliados").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#aliados").css({'border':'1px solid #d2d6de'});
	 }
	if (!validarVacio($("#cantidad").val())) {			
		$("#cantidad").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#cantidad").css({'border':'1px solid #d2d6de'});
	 }

	if (!validarVacio($('#pasos').val())) {			
		$("#pasos").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#pasos").css({'border':'1px solid #d2d6de'});
	 }
	console.log("error: " + error)
	return error;
}