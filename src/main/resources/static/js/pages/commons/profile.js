var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var obj;
var dzClosure1;
$.getScript(context + '/js/plugins/dropzone/dropzone.min.js',function(){
	  // instantiate the uploader
	Dropzone.autoDiscover = false;
	//imagen 1
	  $('#dropzone').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/empresaperfi/image/upload',
		  dictDefaultMessage: 'Click para cambiar la Imagen',
		  autoProcessQueue: false,
		  uploadMultiple: false,
		  parallelUploads: 5,
		  maxFiles: 1,
		  maxFilesize: 3,
		  acceptedFiles: 'image/*',
		  dictMaxFilesExceeded: "Solo puedes subir una imagen",
		  dictResponseError: 'Server not Configured',
		  dictFileTooBig:"El archivo es muy grande ({{filesize}}MiB). Tamano max: {{maxFilesize}}MiB.",

		  init: function() {
			  dzClosure1 = this;
		    this.on('success', function( file, resp ){
		      console.log( resp );
		      console.log( file.status );
		      if(file.status == "success"){
		    	 console.log("exito")
		    	 getPerfilByID(obj.empresa.idempresa)
		      }else{
		    	  
		    	  alertify.errorAlert("Error al subir las imagenes, intentelo nuevamente");
		      }
		      
		    });
		    this.on('thumbnail', function(file) {
		      if ( file.width < 250 || file.height < 250 ) {
		        file.rejectDimensions();
		      }
		      else {
		        file.acceptDimensions();
		      }
		    });
		    this.on('sending', function (data, xhr, formData) {
		    	formData.append("idempresa", obj.empresa.idempresa);
            

        });
		    this.on("maxfilesexceeded", function(file) {
              alert("Solo puedes subir una imagen");
              dzClosure1.removeFile(file);
          });
		    this.on("error", function(file,response) {
		    	   console.log(response);
		    	   alert("Error")

		    	});
		    this.on("addedfile", function (file) {
            // Create the remove button
            var removeButton = Dropzone.createElement("<button class='btn btn-w-m btn-danger'>Borrar Archivo</button>");              // Listen to the click event
            removeButton.addEventListener("click", function (e) {
                // Make sure the button click doesn't submit the form:
                e.preventDefault();
                e.stopPropagation();
                dzClosure1.removeFile(file);
            });
            file.previewElement.appendChild(removeButton);
        });
		  },
		  accept: function(file, done) {
			  
			  if (file.size == 0) {
				  alert("Debes subir las imagenes")
			      done("Empty files will not be uploaded.");
			    }else{
		
			    	file.acceptDimensions = done;
			    	file.rejectDimensions = function() {
			    		done('La imagen debe tener al menos 320 px x 320 px')
			    	};
			    }
		    
		  }
	  });
	  
});

$(document).ready(function(){
	 window.setTimeout(varURL(), 200);
	obj = JSON.parse(sjcl.decrypt(encrypt, localStorage.usuario));

});

function editar(){
	insertForm()
	$('#modalProfile').modal()
	/*pojoPerfilempresa(obj.empresa.idempresa, $("#empresa").text(), 
				$("#m_descripcion").val().trim(), $("#m_rubro").val(), $("#m_direccion").val(), 
				$("#m_email").val(), $("#m_celular").val(),
				$("#m_telefono").val(),$("#m_facebook").val(), obj.idusuario)*/
	//dzClosure1.processQueue(); 
}

function guardar(){
	if(validate()==0){
		enviar(pojoPerfilempresa(obj.empresa.idempresa, $("#empresa").text(), $("#m_descripcion").val().trim(), 
				$("#m_rubro").val(), $("#m_direccion").val(),  $("#m_email").val(), 
				$("#m_celular").val(), $("#m_telefono").val(),$("#m_facebook").val(), obj.idusuario , $("#m_imagen").val()))
		update()
	}
	
}

function enviar(perfilempresa){
	blockScreen();
	$.ajax({
		type : "POST",
		url : context + "/private/empresaperfil/update",
		data :{
			"empresaperfil" : perfilempresa,
		},
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			
			if (jsonobject.estado == "ERROR") {
				$(document).ajaxStop($.unblockUI);
				$('#modalProfile').modal("toggle")
				swal("Error", jsonobject.error, "error");
				//alertify.error('Error message');
			} else if (jsonobject.estado == 'OK') {	
				dzClosure1.processQueue();		
				swal("Buen trabajo!", "Perfil Actualizado!", "success")
				update()
				
				$('#modalProfile').modal("toggle")
				$(document).ajaxStop($.unblockUI);

			}
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

function getPerfilByID(id){
	
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/empresaperfil/"+id,		
		success : function(data) {
			
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			console.log(jsonobject)
			if (jsonobject.estado == 'ERROR') {

			} else if (jsonobject.estado == 'OK') {	
				

			
					
					$("#rubro").text(jsonobject.datos.rubro)
					$("#direccion").text(siNuloSinInfo(jsonobject.datos.direccion))
					$("#telefono").text(jsonobject.datos.telefono)
					$("#facebook").attr("href", jsonobject.datos.facebook)
					$("#celular").text(jsonobject.datos.celular)
					$("#email").text(jsonobject.datos.email)
					$("#descripcion").text(jsonobject.datos.descripcion)
					$("#empresa").text(jsonobject.datos.nombre)
					if(jsonobject.datos.imagen != null){						
						$("#m_imagen").val(jsonobject.datos.imagen)
						$("#imagen").attr("src",context+ "/public/image/empresa/"+jsonobject.datos.imagen);
					}
					
					if(jsonobject.datos.idempresa == obj.empresa.idempresa){
						if($("#perfil").val() == 1 || $("#perfil").val() == 2 ){							
							$("#editar").show()
						}
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

function insertForm(){
	$("#m_titulo").text($("#m_titulo").text() + " - " + $("#empresa").text())
	$("#m_rubro").val($("#rubro").text())
	$("#m_direccion").val($("#direccion").text())
	$("#m_telefono").val($("#telefono").text())
	$("#m_facebook").val($("#facebook").attr("href"))
	$("#m_celular").val($("#celular").text())
	$("#m_email").val($("#email").text())
	$("#m_descripcion").val($("#descripcion").text())
	
}

function update(){
	$("#rubro").text($("#m_rubro").val())
	$("#direccion").text($("#m_direccion").val())
	$("#telefono").text($("#m_telefono").val())
	$("#facebook").attr("href", $("#m_facebook").val())
	$("#celular").text($("#m_celular").val())
	$("#email").text($("#m_email").val())
	$("#descripcion").text($("#m_descripcion").val())
}

function validate(){
	
	var error = 0;
	if (!validarVacio($("#m_rubro").val())) {			
		$("#m_rubro").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_rubro").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_direccion").val())) {			
		$("#m_direccion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_direccion").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_telefono").val())) {			
		$("#m_telefono").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_telefono").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_facebook").val())) {			
		$("#m_facebook").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_facebook").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_descripcion").val())) {			
		$("#m_descripcion").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_descripcion").css({'border':'1px solid #d2d6de'});
		 
	 }
	return error;
}


function varURL() {
	var tmpURL = window.location.href;
	tmpURL = tmpURL.split('?')
	var id = tmpURL[1]
	if (id != null) {
		getPerfilByID(id)

	}
}