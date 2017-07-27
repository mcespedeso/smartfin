var map;
var markers = [];
$(document).ready(function(){
	
	setTimeout(initMap, 500);
	
	$('#rojo').iCheck({
        checkboxClass: 'icheckbox_square-red'
    });
	$('#verde').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });
	
	$('#amarillo').iCheck({
        checkboxClass: 'icheckbox_square-yellow'
    });
	
	$('#check_cedula').iCheck({
        checkboxClass: 'icheckbox_square-green'
    });
	
	
	$('#check_cedula').on('ifChecked', function(event){
		  $("#cedula").attr("disabled", false)
	});
	$('#check_cedula').on('ifUnchecked', function(event){
		  $("#cedula").attr("disabled", true)
	});
	
$(".select2").select2();
   
   
    $('#datepicker').datepicker({    	
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es',
        	
    });
    
    var currentDate = new Date();  
    $("#fechahasta").datepicker("setDate",currentDate);
    $("#fechadesde").datepicker("setDate",currentDate);
    
    //usuarios por empresa
    var emp = $("#selectEmpresa");
    getUsuariosByEmpresa(emp.val())   
    getVersionesByEmpresa(emp.val())   
    emp.on("select2:select", function (e) {

    	if(emp.val() == 0){
    		
    	}else{
    		getUsuariosByEmpresa(emp.val())    		
    		getVersionesByEmpresa(emp.val()) 
    	}
    	
   });
    
    
    var ver = $("#selectVersion");   
    ver.on("select2:select", function (e) {

    	if(emp.val() == null){
    		
    	}else{
    		getPreguntasByVersion(ver.val())
    	}
    	
   });
    
   /* alertify .alert("Modulo en Contruccion", "Seguimos en proceso de desarrollo, en breve estara listo :)", function(){ 							
	});*/
    
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
	//prueba
	blockScreen();
	$('#selectVersion').empty();
	$('#selectPreguntas').empty();
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
				if($("#selectVersion").val() != null){
					getPreguntasByVersion($("#selectVersion").val() )
				}else{
					var o = $("<option/>", {
						value : null,
						text : "No se encontro versiones"
					});
					$("#selectVersion").append(o).trigger('change');
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

function generar(){

	var error = validate()
	if(error == 0){	
		getReporte()
	}
}


//preguntas por version
function getPreguntasByVersion(id){
	blockScreen();
	$('#selectPreguntas').empty();
	$.ajax({
		type : "GET",
		url : context + "/private/question/version/" + id,		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
			
			} else if (jsonobject.estado == 'OK') {	
				
				
				$.each(jsonobject.datos, function(index, element) {
					var o = $("<option/>", {
						value : element.idpregunta,
						text : element.titulo
					});
					$("#selectPreguntas").append(o);
					
				
				});
				
				$("#selectPreguntas").trigger('change');

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

function getReporte(){
	deleteMarkers()
	var fechadesde = document.getElementById('fechadesde').value
	var fechahasta = document.getElementById('fechahasta').value
	var empresa = $("#selectEmpresa").val();
	var usuario = $("#selectUsuario").val();
	var version = $("#selectVersion").val();
	var idpregunta = $("#selectPreguntas").val()
	
	
	blockScreen();
	
	
	$.ajax({
		type : "GET",
		url : context + "/private/semaforo/informeencuestamapa",
		data :{
			"empresa" : empresa,
			"fechadesde" : fechadesde,
			"fechahasta" : fechahasta,
			"version" : version,
			"usuario" : usuario,
			"idpregunta" : idpregunta, 
			"rojo" : $('#rojo').is(":checked"),
			"amarillo": $('#amarillo').is(":checked"),
			"verde": $('#verde').is(":checked"), 
			"checkcedula" : $('#check_cedula').is(":checked"), 
			"cedula" : $('#cedula').val()
		},
		
		success : function(data) {
			console.log(data);
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
			
			} else if (jsonobject.estado == 'OK') {	
				
				$.each(jsonobject.datos, function(index, element) {
					var s = element.coordenadas.split(",")
					console.log("marcador " + s[0] + " - " + s[1])
					addMarker({lat: parseFloat(s[0]), lng: parseFloat(s[1])}, element.titulo, element.imagen,
							element.nroopcion, element.cedula, element.nombre_apellido, element.empresa)
				
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
	
	if( $('#check_cedula').is(":checked")){
		if (!validarVacio($("#cedula").val())) {			
			$("#cedula").css({'border':'1px solid red'});
			error++;
		}else{
			  $("#cedula").css({'border':'1px solid #d2d6de'});
		}
	}else{
		 $("#cedula").css({'border':'1px solid #d2d6de'});
	}
	
	console.log("error: " + error)
	return error;
}

function addMarker(location, titulo, imagen,nroopcion, cedula, nombre_apellido, empresa) {  
	
	 var icon = {
	           path: fontawesome.markers.MAP_MARKER,
	           scale: 0.5,
	           strokeColor: 'black',
	           strokeOpacity: 1,
	           fillColor: 'green',
	           fillOpacity: 1,
	       };
	 
	 if(nroopcion == 2){
		 icon.fillColor = 'yellow'
	 }else if(nroopcion == 1){
		 icon.fillColor = 'red'
	 }
	
	 var contentString = '<div class="col-sm-12" >'+
     '<div id="bodyContent" >'+
     '<img alt="image" class="center-block img-responsive" style="max-height: 150px;" src="'+context+'/public/opcion/image/'+imagen+'"/>'+
     '<h5">'+titulo+'</h5>'+
     '<hr/>'+
      '<strong>Nombre: </strong>'+nombre_apellido+'<br/>'+
      '<strong>Cedula: </strong>'+cedula+'<br/>'+
      '<strong>Empresa: </strong> '+ empresa +
     '</div>'+
     '</div>'
     
     var infowindow = new google.maps.InfoWindow({
    	    content: contentString
    	  });
	 
	var marker;
	
	  if (marker == null){
	    marker = new google.maps.Marker({
	       position: location,
	       animation: google.maps.Animation.DROP,
	       icon: icon,
	       map: map
	    	}); 
	    
	    marker.addListener('mouseover', function() {
	        infowindow.open(map, marker);
	        
	      })
	      
	      marker.addListener('mouseout', function() {
	        infowindow.close();
	      })
	      
	   } 
	  
	  markers.push(marker);

	}

function deleteMarkers() {
	for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    markers = [];
  }

function initMap() {
    var uluru = {lat: -25.1795, lng: -57.58572};
     map = new google.maps.Map(document.getElementById('map1'), {
      zoom:8,
      center: uluru
    });
    
     
    /*var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });*/
    
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

       // infoWindow.setPosition(pos);
        //infoWindow.setContent('Location found.');
        
        map.setCenter(pos);

      }, function() {
       //handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
      // Browser doesn't support Geolocation
      //handleLocationError(false, infoWindow, map.getCenter());
    }
  
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
    
    
    
  }