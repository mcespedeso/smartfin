var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

var table;
var edit = false;
var estado= true
var imagenes = [0,0,0];
var dzClosure1;
var dzClosure2;
var dzClosure3;
var numero = 0;

$.getScript(context + '/js/plugins/dropzone/dropzone.min.js',function(){
	  // instantiate the uploader
	Dropzone.autoDiscover = false;
	//imagen 1
	  $('#dropzone1').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/semaforo/image/upload',
		  dictDefaultMessage: 'Click para subir la Imagen',
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
		    	  if(imagenes[1] == 1){ 		    		  
		    		  console.log("Enviando imagen 2....")
		    		  dzClosure2.processQueue();  
		    	  }
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
		    	formData.append("nroopcion", 1);
	            formData.append("idopcion",$('#m_idopcion1').val())
	            formData.append("idpregunta", $('#m_idpregunta').val());
	            formData.append("idsemaforo", $("#m_selectSemaforo").val());
	            formData.append("nropregunta", $('#m_numero').val());
              

          });
		    this.on("maxfilesexceeded", function(file) {
                alert("Solo puedes subir una imagen");
                dzClosure1.removeFile(file);
            });
		    this.on("error", function(file,response) {
		    	   console.log(response);
		    	   alert("Error")
		    	   imagenes[0] = 0;
		    	});
		    this.on("addedfile", function (file) {
              // Create the remove button
              var removeButton = Dropzone.createElement("<button class='btn btn-w-m btn-danger'>Borrar Archivo</button>");              // Listen to the click event
              removeButton.addEventListener("click", function (e) {
                  // Make sure the button click doesn't submit the form:
                  e.preventDefault();
                  e.stopPropagation();
                  dzClosure1.removeFile(file);
                  imagenes[0] = 0;
              });
              file.previewElement.appendChild(removeButton);
          });
		  },
		  accept: function(file, done) {
			  
			  if (file.size == 0) {
				  alert("Debes subir las imagenes")
			      done("Empty files will not be uploaded.");
			    }else{
			    	imagenes[0] = 1;
			    	file.acceptDimensions = done;
			    	file.rejectDimensions = function() {
			    		done('La imagen debe tener al menos 320 px x 320 px')
			    	};
			    }
		    
		  }
	  });
	  //imagen 2
	  $('#dropzone2').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/semaforo/image/upload',
		  dictDefaultMessage: 'Click para subir la Imagen',
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
			  dzClosure2 = this;
		    this.on('success', function( file, resp ){
		      console.log( resp );
		      console.log( file.status );
		      if(file.status == "success"){
		    	  console.log("Enviando imagen 3....")
		    	  if(imagenes[2] == 1){ 
		    		  dzClosure3.processQueue();  
		    	  }
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

              formData.append("nroopcion", 2);
              formData.append("idopcion",$('#m_idopcion2').val())
              formData.append("idpregunta", $('#m_idpregunta').val());
              formData.append("idsemaforo", $("#m_selectSemaforo").val());
              formData.append("nropregunta", $('#m_numero').val());
              

          });
		    this.on("maxfilesexceeded", function(file) {
                alert("Solo puedes subir una imagen");
                dzClosure2.removeFile(file);
            });
		    this.on("error", function(file,response) {
		    	   alert("Error")
		    	   imagenes[1] = 0;
		    	});
		    this.on("addedfile", function (file) {
              // Create the remove button
              var removeButton = Dropzone.createElement("<button class='btn btn-w-m btn-danger'>Borrar Archivo</button>");              // Listen to the click event
              removeButton.addEventListener("click", function (e) {
                  // Make sure the button click doesn't submit the form:
                  e.preventDefault();
                  e.stopPropagation();
                  dzClosure2.removeFile(file);
                  imagenes[1] = 0;
              });
              file.previewElement.appendChild(removeButton);
          });
		  },
		  accept: function(file, done) {
			  
			  if (file.size == 0) {
				  alert("Debes subir las imagenes")
			      done("Empty files will not be uploaded.");
			    }else{
			    	imagenes[1] = 1;
			    	file.acceptDimensions = done;
			    	file.rejectDimensions = function() {
			    		done('La imagen debe tener al menos 320 px x 320 px')
			    	};
			    }
		    
		  }
	  });
	  //imagen 3
	  $('#dropzone3').dropzone({ 
		  paramName: 'file',
		  url: context + '/private/semaforo/image/upload',
		  dictDefaultMessage: 'Click para subir la Imagen',
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
			  dzClosure3 = this;
			  
		    this.on('success', function( file, resp ){
		      console.log( file.status );
		      if(file.status == "success"){
		    	  if(edit == false){		    		  
		    		  alertify .alert("Proceso Correcto", "Pregunta  insertado correctamente", function(){ 							
		    		  });
		    		  
		    		  clearForm();
		    		  $('#modal').modal("toggle")
		    		  reloadTable()
		    	  }
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
		    	formData.append("nroopcion", 3);
	            formData.append("idopcion",$('#m_idopcion3').val())
	            formData.append("idpregunta", $('#m_idpregunta').val());
	            formData.append("idsemaforo", $("#m_selectSemaforo").val());
	            formData.append("nropregunta", $('#m_numero').val());
              

          });
		    this.on("maxfilesexceeded", function(file) {
                alert("Solo puedes subir una imagen");
                dzClosure3.removeFile(file);
            });
		    this.on("error", function(file,response) {
		    	   alert("Error")
		    	   imagenes[2] = 0;
		    	});
		    this.on("addedfile", function (file) {
              // Create the remove button
              var removeButton = Dropzone.createElement("<button class='btn btn-w-m btn-danger'>Borrar Archivo</button>");              // Listen to the click event
              removeButton.addEventListener("click", function (e) {
                  // Make sure the button click doesn't submit the form:
                  e.preventDefault();
                  e.stopPropagation();
                  dzClosure3.removeFile(file);
                  imagenes[2] = 0;
              });
              file.previewElement.appendChild(removeButton);
          });
		  },
		  accept: function(file, done) {
			  
			  if (file.size == 0) {
				  alert("Debes subir las imagenes")
			      done("Empty files will not be uploaded.");
			    }else{
			    	imagenes[2] = 1;
			    	file.acceptDimensions = done;
			    	file.rejectDimensions = function() {
			    		done('La imagen debe tener al menos 320 px x 320 px')
			    	};
			    }
		    
		  }
	  });
});
	
$(document).ready(function(){
	//dzClosure3.removeAllFiles( true );
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
     
     $('#mu_aceptar').click(function(){

		  if(validate() == 0){
			  if($('#m_idpregunta').val() == 0){
				  
				  if(imagenes[0] == 1 && imagenes[1] == 1 && imagenes[2] == 1 ){
					  blockScreen();
					  guardar()		
					  
					  
				  }else{
					  alert("suba todas las imagenes")
				  }
				  
			  }else{
				  blockScreen();
				  guardar()	
			  }

		  }else{
			
		  }
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
    
    getById($("#selectSemaforo").val());
    
    $('#mu_checkEstado').on('ifUnchecked', function(event){
  	  estado = false;
  	});
    $('#mu_checkEstado').on('ifChecked', function(event){
    	  estado = true;
    	});
    
    var emp = $("#selectSemaforo");
    emp.on("select2:select", function (e) {
    	var table = $('#tabla').DataTable();
    	table.clear().draw();
    	if(emp.val() == 0){
    		getAll()
    	}else{
    		getById(emp.val())    		
    	}
    	
    	$("#m_selectSemaforo").val(emp.val()).trigger('chosen:updated');
    	
   });
    

    
 
});



//enviar imagenes
function enviarImagenes(){
	console.log("Enviando imagen 1....")
	dzClosure1.processQueue();  
	/*dzClosure2.processQueue();  
	dzClosure3.processQueue();*/  
}

function msgExito(){
	if(imagenes[0] == 1 && imagenes[1] == 1 && imagenes[2] == 1 ){
		alertify .alert("Proceso Correcto", "Pregunta  insertado correctamente", function(){ 							
		});
		
		clearForm();
		$('#modal').modal("toggle")
		reloadTable()
	}
}

function modal() {		
	$('#modal').modal()
}

function reloadTable(){
	var table = $('#tabla').DataTable();
	table.clear().draw();
	  getById($("#selectSemaforo").val());
}


//obtener usuarios
function getById(id){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/question/semaforo/" + id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				
				var table = $('#tabla').DataTable();
				document.getElementById('m_numero').value = jsonobject.datos.length + 1
				numero = jsonobject.datos.length + 1
				$.each(jsonobject.datos, function(index, element) {
					
					var estado = "";
					
					if(element.estado == true){
						estado = '<span class="label label-primary pull-right">Activo</span>'
					}else{
						estado ='<span class="label label-danger pull-right">Inactivo</span>'
					}
									
					
					table.rows.add( [ {
							"0": element.nropregunta,
							"1": element.semaforo.descripcion,	
							"2": element.titulo,
							"3": estado,
							"4": element.idpregunta,
							"5": element.semaforo.idsemaforo,
							"6": element.codupdate,
							"7": JSON.stringify(element.listOpciones),
							"8": siNuloVacio(element.abreviatura)
				
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
	$("#m_selectSemaforo").val(fila.cells[5].innerHTML).trigger('chosen:updated');
	document.getElementById('m_idpregunta').value = fila.cells[4].innerHTML;
	document.getElementById('m_numero').value = fila.cells[0].innerHTML;
	document.getElementById('m_pregunta').value = fila.cells[2].innerHTML;
	document.getElementById('mv_update').value = parseInt(fila.cells[6].innerHTML) + 1;
	$("#m_abreviatura").val(fila.cells[8].innerHTML)
	
	var obj = JSON.parse(fila.cells[7].innerHTML);
	//opcion1
	document.getElementById('m_idopcion1').value = obj[0].idopcion;
	document.getElementById('m_opcion1').value = obj[0].descripcion;
	document.getElementById('m_imagen1').value = obj[0].imagen;
	document.getElementById("a1").href= context + "/public/opcion/image/" + obj[0].imagen; 
	document.getElementById('imagen1').src = context + "/public/opcion/image/" + obj[0].imagen; 
	//opcion2
	document.getElementById('m_idopcion2').value = obj[1].idopcion;
	document.getElementById('m_opcion2').value = obj[1].descripcion;
	document.getElementById('m_imagen2').value = obj[1].imagen;
	document.getElementById("a2").href= context + "/public/opcion/image/" + obj[1].imagen; 
	document.getElementById('imagen2').src = context + "/public/opcion/image/" + obj[1].imagen; 
	//opcion2
	document.getElementById('m_idopcion3').value = obj[2].idopcion;
	document.getElementById('m_opcion3').value = obj[2].descripcion;
	document.getElementById('m_imagen3').value = obj[2].imagen;
	document.getElementById("a3").href= context + "/public/opcion/image/" + obj[2].imagen; 
	document.getElementById('imagen3').src = context + "/public/opcion/image/" + obj[2].imagen; 
	
	
	
	if(fila.cells[3].innerText == "Activo"){
		$('#mu_checkEstado').iCheck('check'); 
	}else{
		$('#mu_checkEstado').iCheck('uncheck'); 
	}
	
	deshablitar($("#selectSemaforo"));
	
	//
}

function cancelar(){
	reloadTable()
	clearForm()
}

function clearForm() {
	console.log("clean")
	table.$('tr.selected').removeClass('selected');
	document.getElementById('m_idpregunta').value = 0;
	document.getElementById('m_numero').value = numero;
	document.getElementById('m_pregunta').value = "";
	//opcion1
	document.getElementById('m_idopcion1').value = 0;
	document.getElementById('m_opcion1').value = "";
	document.getElementById('m_imagen1').value = "";
	//opcion2
	document.getElementById('m_idopcion2').value = 0;
	document.getElementById('m_opcion2').value = "";
	document.getElementById('m_imagen2').value = "";
	//opcion3
	document.getElementById('m_idopcion3').value = 0;
	document.getElementById('m_opcion3').value = "";
	document.getElementById('mv_update').value = 1;
	document.getElementById('m_imagen3').value = "";
	$("#m_abreviatura").val("")

	$('#mu_checkEstado').iCheck('check'); 
	dzClosure1.removeAllFiles( true );
	dzClosure2.removeAllFiles( true );
	dzClosure3.removeAllFiles( true );
	
	document.getElementById("a1").href= ""
	document.getElementById('imagen1').src = ""
	document.getElementById("a2").href= ""
	document.getElementById('imagen2').src = ""
	document.getElementById("a3").href= ""
	document.getElementById('imagen3').src = ""	
	
	deshablitar($("#btnEdit"));
	hablitar($("#btnAdd"));
	
	hablitar($("#selectSemaforo"));
	

	
}


function guardar(){
	if(validate() == 0){	
		
		var path = context + "/private/question";
		
		var usuario =pojoPregunta(document.getElementById('m_idpregunta').value, document.getElementById('m_pregunta').value,  $("#m_selectSemaforo").val(),
				 $("#m_numero").val(), estado ,$("#mv_update").val(), $("#m_abreviatura").val());

		
		var opciones = '['+
							pojoOpcion($('#m_idopcion1').val(), $('#m_opcion1').val(), $('#m_idpregunta').val(), 1, $("#m_imagen1").val() )+
						","+pojoOpcion($('#m_idopcion2').val(), $('#m_opcion2').val(), $('#m_idpregunta').val(), 2, $("#m_imagen2").val() )+
						','+pojoOpcion($('#m_idopcion3').val(), $('#m_opcion3').val(), $('#m_idpregunta').val(), 3, $("#m_imagen3").val()) + 
						']';
			//insert

		console.log('enviando ajax ' + usuario + " " + opciones);
			$.ajax({
				type : "POST",
				url : path,
				data :{
					"pregunta" : usuario,
					"opciones" : opciones
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
						if(document.getElementById('m_idpregunta').value == 0){							
							document.getElementById('m_idpregunta').value = jsonobject.datos
							enviarImagenes();							
						}else{
							console.log("edicion")
								if(imagenes[0] == 1){
									dzClosure1.processQueue(); 
								}
								if(imagenes[1] == 1){
									dzClosure2.processQueue(); 
								}
								if(imagenes[2] == 1){
									dzClosure3.processQueue(); 
								}
								$('#modal').modal("toggle")
								alertify .alert("Proceso Correcto", "Pregunta  insertado correctamente", function(){ 	
									reloadTable()
								});
								
								/*clearForm();
								$('#modal').modal("toggle")
								reloadTable()*/
						}
					
						$(document).ajaxStop($.unblockUI);

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

function cerrar(){
	clearForm()
}



function validate(){
	
	var error = 0;
	if (!validarVacio($("#m_numero").val())) {			
		$("#m_numero").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_numero").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_pregunta").val())) {			
		$("#m_pregunta").addClass('error');
		error++;
		
	}else{
		  $("#m_pregunta").css({'border':'1px solid #d2d6de'});
		 
	 }

	if (!validarVacio($("#m_abreviatura").val())) {			
		$("#m_abreviatura").addClass('error');
		error++;
		
	}else{
		  $("#m_abreviatura").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_opcion1").val())) {			
		$("#m_opcion1").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_opcion1").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_opcion2").val())) {			
		$("#m_opcion2").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_opcion2").css({'border':'1px solid #d2d6de'});
		 
	 }
	if (!validarVacio($("#m_opcion3").val())) {			
		$("#m_opcion3").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_opcion3").css({'border':'1px solid #d2d6de'});
		 
	 }
	return error;
}





