var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var dzClosure1;
var id=0;
var cont = 0;
var ban = false;
var idpregunta = 0;
var idempresa= 0;
var listaImagen= [{key:"key", value:"value"}];
$.getScript(context + '/js/plugins/dropzone/dropzone.min.js',function(){
	  // instantiate the uploader
	Dropzone.autoDiscover = false;
	//imagen 1
	  $('#dropzone').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/actividad/image',
		  dictDefaultMessage: 'Click para cambiar las Imagenes',
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
					  title: "Reporte Aprobado",
					  type: "success",
					  confirmButtonColor: "#1ab394",
					  confirmButtonText: "Volver",
					  allowOutsideClick: false,
					  closeOnCancel: true,
					  closeOnConfirm: false
					},
					function(){
						window.location.href = context +'/listactividad'; 
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
	 
	 $('.i-checks').iCheck({
	        checkboxClass: 'icheckbox_square-green',
	        radioClass: 'iradio_square-green',
	    });
	 
	
});

function activarImagen(idimagen, element){
	console.log("hola " + JSON.stringify(listaImagen))
	
	
}
function eliminar(){
	$.ajax({
		type : "POST",
		url : context + "/private/actividad/delete/"+$("#idcalendario").val(),

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
					  title: "Reporte Cancelado",
					  text: jsonobject.datos,
					  type: "success",
					  confirmButtonColor: "#1ab394",
					  confirmButtonText: "Volver",
					  allowOutsideClick: false,
					  closeOnCancel: true,
					  closeOnConfirm: false
					},
					function(){
						window.location.href = context +'/listactividad'; 
					});
				
				
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

function enviar(){
	if(validate() == 0){	
		$.ajax({
			type : "POST",
			url : context+"/private/actividad/aprobar",
			data :{
				"actividad" : pojoActividad2( $("#idcalendario").val(), 0, $("#nombre").val(), $("#aliados").val() ,
    					$("#cantidad").val(), $("#pasos").val(), $("#obs").val(), $("#selectPreguntas").val(),  $("#fecha").val(), idempresa)
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
					if(ban){						
						dzClosure1.processQueue();
					}else{
						swal({
							  title: "Reporte Aprobado",
							  type: "success",
							  confirmButtonColor: "#1ab394",
							  confirmButtonText: "Volver",
							  allowOutsideClick: false,
							  closeOnCancel: true,
							  closeOnConfirm: false
							},
							function(){
								window.location.href = context +'/listactividad'; 
							});
					}

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
		url : context + "/private/actividad/"+id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				swal(jsonobject.error, "", "error");
			} else if (jsonobject.estado == 'OK') {	
				
					$("#nombre").val(jsonobject.datos.descripcion)
					$("#cantidad").val(jsonobject.datos.cantidad)
					$("#pasos").val(jsonobject.datos.pasos)
					$("#idcalendario").val(jsonobject.datos.idactividad)
					$("#empresa").val(siNuloSinInfo(jsonobject.datos.empresa.descripcion))
					idempresa = jsonobject.datos.empresa.idempresa
					$("#fecha").val(formatFecha(jsonobject.datos.fechaactividad))
					$("#selectPreguntas").val(jsonobject.datos.pregunta.idpregunta).trigger("change")
					$("#aliados").val(jsonobject.datos.aliados)
					$("#obs").val(jsonobject.datos.obs)
					listaImagen = jsonobject.datos.listImages;
					if(jsonobject.datos.listImages != null){
						var content;
						$.each(jsonobject.datos.listImages, function(index, element) {	
	
							 content = '<div class="col-md-3"><div class="lightBoxGallery" ><a href="" title="Image from Unsplash" data-gallery="" id="a1">'+
	                       '<img src="'+context+'/public/image/actividad/'+jsonobject.datos.empresa.idempresa+'/'+element.imagen+'" style="height: 150px; "/></a><div id="blueimp-gallery" class="blueimp-gallery">'+
	                       '<div class="slides"></div><h3 class="title"></h3><a class="prev">‹</a><a class="next">›</a><a class="close">×</a><a class="play-pause"></a><ol class="indicator"></ol></div></div> <label id="labelEstado"> <input type="checkbox" id="'+element.idactividadimagen+'"  class="i-checks" checked="checked"/> &nbsp;ACTIVO</label></div>'
	        
	                       $("#imagenes").append(content)
						});	
						   $('.i-checks').iCheck({
	                   	        checkboxClass: 'icheckbox_square-green',
	                   	        radioClass: 'iradio_square-green',
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