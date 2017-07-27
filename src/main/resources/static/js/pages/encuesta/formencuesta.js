var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var map;
var marker;
var geocoder = null;
$(document).ready(function(){
	localStorage.encuestado = "";
	localStorage.nivel = 0;
	empezar();
	$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
	/* $('#modalMapa').modal()
	 	setTimeout(initMap, 500)*/
	
	$("#form").steps({
        bodyTag: "fieldset",
        transitionEffect: "slideLeft",
        onInit: function(event, currentIndex) {
        	$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
            resizeJquerySteps();
        },
        onStepChanging: function (event, currentIndex, newIndex)
        {
        	resizeJquerySteps();
            // Always allow going backward even if the current step contains invalid fields!
            if (currentIndex > newIndex)
            {
                return true;
            }

            // Forbid suppressing "Warning" step if the user is to young
            if (newIndex === 3 && Number($("#age").val()) < 18)
            {
                return false;
            }

            var form = $(this);

            // Clean up if user went backward before
            if (currentIndex < newIndex)
            {
                // To remove error styles
                $(".body:eq(" + newIndex + ") label.error", form).remove();
                $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
            }

            // Disable validation on fields that are disabled or hidden.
            form.validate().settings.ignore = ":disabled,:hidden";
            var error =0;
            
            //validacion del step2
            if(currentIndex === 1){
            	/*var cantidad = parInt(siNuloCero($('#personas_viven_casa').val())) ;
            	$("#personas_ganan_casa").rules("add", {
            		max: cantidad
            	});*/
            	if($('#actividad_no_asalariada').val() == "Si"){
            		$("#venta_semanal").rules("add", {
            	        required: true,
            	        minlength: 5
            	    });
            		$("#costo_semanal").rules("add", {
            	        required: true,
            	        minlength: 5
            	    });
   
            	}else{
            		$('#venta_semanal').rules('remove');
            		$('#costo_semanal').rules('remove');
            	}
            }
           
            
            if(!form.valid()){
            	error++;
            }
            // Start validation; Prevent going forward if false
            return (error == 0);
        },
        onStepChanged: function (event, currentIndex, priorIndex)
        {
        	resizeJquerySteps();
            // Suppress (skip) "Warning" step if the user is old enough.
            if (currentIndex === 2 && Number($("#age").val()) >= 18)
            {
                $(this).steps("next");
            }

            // Suppress (skip) "Warning" step if the user is old enough and wants to the previous step.
            if (currentIndex === 2 && priorIndex === 3)
            {
                $(this).steps("previous");
            }
        },
        onFinishing: function (event, currentIndex)
        {
            var form = $(this);

            // Disable validation on fields that are disabled.
            // At this point it's recommended to do an overall check (mean ignoring only disabled fields)
            form.validate().settings.ignore = ":disabled";
            
            
            //validacion del step3
            if(currentIndex === 3){
       
            	if($('#recibe_dinero_exterior').val() == "Si"){
            		$("#monto_recibido_exterior").rules("add", {
            	        required: true,
            	        minlength: 5
            	    });
            		$("#frecuencia_remesa_exterior").rules("add", {
            	        required: true
            	    });
            	}else{
            		$('#monto_recibido_exterior').rules('remove');
            		$('#frecuencia_remesa_exterior').rules('remove');
            	}
            	
            	if($('#recibe_dinero_gobierno').val() == "Si"){
            		$("#monto_recibido_gobierno").rules("add", {
            	        required: true,
            	        minlength: 5
            	    });
            		$("#frecuencia_tcm_gobierno").rules("add", {
            	        required: true
            	    });
            	}else{
            		$('#monto_recibido_gobierno').rules('remove');
            		$('#frecuencia_tcm_gobierno').rules('remove');
            	}
            	
            	if($('#persona_discapacidad').val() == "Si"){
            		$("#tipo_discapacidad").rules("add", {
            	        required: true
            	    });
            		
            	}else{
            		$('#tipo_discapacidad').rules('remove');
          
            	}
            }

            // Start validation; Prevent form submission if false
            return form.valid();
        },
        onFinished: function (event, currentIndex)
        {
            var form = $(this);

            // Submit form input
            //form.submit();
           
            $('#modalMapa').modal()
       	 	setTimeout(initMap, 500);
        }
    }).validate({
                errorPlacement: function (error, element)
                {
                    element.before(error);
                },
                //reglas
                rules: {
                	salario_mensual : {
                		
                		minlength: 6
                	},
                	cedula : {
                		
                		minlength: 7
                	}
                	
                }
            });
	initElemnts()
	//step2
	$('#actividad_no_asalariada').on('change', function() {

		  if( this.value == "Si"){
			  $("#div_act_no_asa").show();
		  }else{
			  $("#div_act_no_asa").hide();
		  }
		})
	
	//step3
	$('#recibe_dinero_exterior').on('change', function() {

		  if( this.value == "Si"){
			  $("#div_exterior").show();
		  }else{
			  $("#div_exterior").hide();
		  }
		})	
		
	$('#recibe_dinero_gobierno').on('change', function() {

			  if( this.value == "Si"){
				  $("#div_gobierno").show();
			  }else{
				  $("#div_gobierno").hide();
			  }
			})	
	$('#persona_discapacidad').on('change', function() {

			  if( this.value == "Si"){
				  $("#div_discapacidad").show();
			  }else{
				  $("#div_discapacidad").hide();
			  }
			})
		
		
});

function empezar(){
	delete localStorage.iddtsocioeconomica;
	delete localStorage.respuestas;
	localStorage.nivel = 0;
	localStorage.encuestado = "";
	/*$('#box').hide();
	$('#cabecera').show();
	setTimeout(mostrar, 300)*/
}

function mostrar(){
	$('#ibox1').show();
	 resizeJquerySteps();
}

function initElemnts(){
	
	$('.numerico').priceFormat({
		prefix : '',
		centsSeparator : ',',
		thousandsSeparator : '.',
		centsLimit : 0,
	});
	//step2
	$("#div_act_no_asa").hide();
	
	//step3
	
	$("#div_exterior").hide();
	$("#div_gobierno").hide();
	$("#div_discapacidad").hide();

	
}
function numberWithCommas(x) {
	x.value = x.value.replace(/\./g, '')
	var n =x.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
	console.log(n)
    x.value = n;
}

function setTotal(element,n){
	var tot = 0;
	var value = element.value.replace(/\./g, '')
	if(value.trim().length > 0){
		
		var s = value.split("+")
		for (var i = 0; i < s.length; i++) {

			if(s[i] != " "){				
				if(validarNumero(s[i].trim())){
					tot = tot+ parseInt(s[i].trim())
				}else{
					//alert("Ingrese numeros")
				}
			}
		}
	}
	if(n == 1){
		$("#total").val(tot)
		$("#total").priceFormat({
			prefix : '',
			centsSeparator : ',',
			thousandsSeparator : '.',
			centsLimit : 0,
		});
	}else if(n==2){
		$("#totalv").val(tot)
		$("#totalv").priceFormat({
			prefix : '',
			centsSeparator : ',',
			thousandsSeparator : '.',
			centsLimit : 0,
		});
	}else if(n == 3){
		$("#totalc").val(tot)
		$("#totalc").priceFormat({
			prefix : '',
			centsSeparator : ',',
			thousandsSeparator : '.',
			centsLimit : 0,
		});
	}
	
}

function guardar(){
	$('#modalMapa').modal("toggle")
	var dtsocioenonomica = createSocioEconomica();

				blockScreen();
				$.ajax({
					type : "POST",
					url : context + "/private/semaforo/socioeconomica",
					data :{
						"dtsocioenonomica" : dtsocioenonomica
					},
					success : function(data) {
						console.log(data)
						data = JSON.stringify(data);
						var jsonobject = JSON.parse(data);
						
						if (jsonobject.estado == "ERROR") {
							$('#modal').modal("toggle")
							alertify.errorAlert(jsonobject.error);
		
						} else if (jsonobject.estado == 'OK') {	
							localStorage.iddtsocioeconomica = sjcl.encrypt(encrypt, String(jsonobject.datos));
							localStorage.encuestado = sjcl.encrypt(encrypt, $("#nombre_apellido").val());
							//$('#modal').modal("toggle")
							 localStorage.respuestas = "";
							window.location.href = context +'/indicadores'; 
							
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
			  
		
	
	
	/*alertify.confirm("Guardar y Continuar", "Responder los indicadores del semaforo",
			  function(){
			   //guardar socioeconomica
				blockScreen();
				$.ajax({
					type : "POST",
					url : context + "/private/semaforo/socioeconomica",
					data :{
						"dtsocioenonomica" : dtsocioenonomica
					},
					success : function(data) {
						console.log(data)
						data = JSON.stringify(data);
						var jsonobject = JSON.parse(data);
						
						if (jsonobject.estado == "ERROR") {
							$('#modal').modal("toggle")
							alertify.errorAlert(jsonobject.error);
		
						} else if (jsonobject.estado == 'OK') {	
							localStorage.iddtsocioeconomica =jsonobject.datos;
							
							//$('#modal').modal("toggle")
							window.location.href = context +'/indicadores'; 
							
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
				
				
				//window.location.href = '/indicadores'; //one level up
		
			  },
			  function(){
			    alertify.error('Cancelar');
			  });*/
	
}

function createSocioEconomica(){
	var obj = JSON.parse(sjcl.decrypt(encrypt, localStorage.usuario));
	
	//calculo de nivel
	//salario mensual
	console.log($("#salario_mensual").val().replace(/\./g, ''))
	var ingresos= parseInt($("#salario_mensual").val().replace(/\./g, ''));
	var egresos=0;

	//actividad no asalariada
	if($("#actividad_no_asalariada").val() == "Si"){
		ingresos = ingresos + parseInt($("#venta_semanal").val().replace(/\./g, ''));
		egresos = egresos + parseInt($("#costo_semanal").val().replace(/\./g, ''));
	}
	//salario otros miembros
	if($("#total").val() != ""){
		ingresos = ingresos + parseInt($("#total").val().replace(/\./g, ''));
	}

	//venta semanal otros miembros
	if($("#totalv").val() != ""){
		ingresos = ingresos + parseInt($("#totalv").val().replace(/\./g, ''));
	}
	//costo semanal otros miembros
	if($("#totalc").val() != ""){
		egresos = egresos + parseInt($("#totalc").val().replace(/\./g, ''));
	}
	//dinero del exterior
	if($("#recibe_dinero_exterior").val() == "Si"){
        ingresos += calcularMonto($("#frecuencia_remesa_exterior").val(), parseInt($("#monto_recibido_exterior").val().replace(/\./g, '')));

	}
	//dinero del gobierno
	if($("#recibe_dinero_gobierno").val() == "Si"){
        ingresos += calcularMonto($("#frecuencia_tcm_gobierno").val(), parseInt($("#monto_recibido_gobierno").val().replace(/\./g, '')));

	}
	//otros ingresos
	if($("#otros_ingresos").val() != ""){
		ingresos = ingresos + parseInt($("#otros_ingresos").val().replace(/\./g, ''));
	}
	//cantidad de personas
	var cantidad=parseInt($("#personas_viven_casa").val());
	
	
	return pojoDtsocioeconomica($("#cedula").val() + " - "+$("#nombre_apellido").val(), 
			obj.versionencuesta.idversion,
			obj.idusuario,
			JSON.stringify(json()), 
			marker.getPosition().lat()+","+marker.getPosition().lng(),
			calcularNiveles( ingresos,  egresos,  cantidad,  $("#zona").val()),
			localStorage.idioma)
	
}

function json(){
	
	var pojo = "{";
	//step1
	pojo += '"cedula":"' + $("#cedula").val()+'"'
	pojo += ',"nombre_apellido":"' + $("#nombre_apellido").val() +'"'
	pojo += ',"zona":"' + $("#zona").val()+'"'
	pojo += ',"actividad_secundaria":"' +  $("#actividad_secundaria option:selected").text()+'"'
	pojo += ',"actividad_principal":"' + $("#actividad_principal  option:selected").text() 	+'"'
	pojo += ',"numero_contacto":"' + $("#numero_contacto").val() 	+'"'
	pojo += ',"sexo":"' + $("#sexo").val() +'"'
	//step2
	pojo += ',"personas_viven_casa":"' + $("#personas_viven_casa").val()+'"'
	pojo += ',"personas_ganan_casa":"' + $("#personas_ganan_casa").val() +'"'
	pojo += ',"venta_semanal":"' + $("#venta_semanal").val()+'"'
	pojo += ',"salario_mensual":"' + $("#salario_mensual").val()+'"'
	pojo += ',"costo_semanal":"' + $("#costo_semanal").val() 	+'"'
	pojo += ',"personas_menores_casa":"' + $("#personas_menores_casa").val() 	+'"'
	pojo += ',"actividad_no_asalariada":"' + $("#actividad_no_asalariada").val() +'"'
	//step3
	pojo += ',"costo_semanal_otros":"' + $("#totalc").val()+'"'
	pojo += ',"venta_semanal_otros":"' + $("#totalv").val() +'"'
	pojo += ',"salario_total":"' + $("#total").val()+'"'
	//step4
	pojo += ',"frecuencia_remesa_exterior":"' + $("#frecuencia_remesa_exterior").val()+'"'
	pojo += ',"monto_recibido_exterior":"' + $("#monto_recibido_exterior").val() +'"'
	pojo += ',"situacion_vivienda":"' + $("#situacion_vivienda  option:selected").text()+'"'
	pojo += ',"nivel_max_educativo":"' + $("#nivel_max_educativo  option:selected").text()+'"'
	pojo += ',"monto_recibido_gobierno":"' + $("#monto_recibido_gobierno").val() 	+'"'
	pojo += ',"nivel_educativo":"' + $("#nivel_educativo  option:selected").text() 	+'"'
	pojo += ',"otros_ingresos":"' + $("#otros_ingresos").val() +'"'
	pojo += ',"frecuencia_tcm_gobierno":"' + $("#frecuencia_tcm_gobierno").val()+'"'
	pojo += ',"recibe_dinero_exterior":"' + $("#recibe_dinero_exterior").val() 	+'"'
	pojo += ',"recibe_dinero_gobierno":"' + $("#recibe_dinero_gobierno").val() 	+'"'
	pojo += ',"persona_discapacidad":"' + $("#persona_discapacidad").val() +'"'
	pojo += ',"tipo_discapacidad":"' + $("#tipo_discapacidad").val() +'"'
	
	pojo += "}";
	
	return pojo;
	
}

function resizeJquerySteps() {
    $('.wizard .content').animate({
       height: $('.body.current').outerHeight()
   }, 'slow');
}

function addMarker(location) {  
	  
	  if (marker == null){
	    marker = new google.maps.Marker({
	       position: location,
	       map: map
	    	}); 
	   } else {   
	    	marker.setPosition(location); 
	   }
	  map.panTo(location);
	  hablitar($("#mu_aceptar"))
	}

function initMap() {
	$("#direccion").focus()
	 geocoder = new google.maps.Geocoder();
        var uluru = {lat: -25.1795, lng: -57.58572};
         map = new google.maps.Map(document.getElementById('map1'), {
          zoom: 12,
          center: uluru
        });
         
        /* var input = document.getElementById('direccion')
         var autocomplete = new google.maps.places.Autocomplete(input);
         autocomplete.bindTo('bounds', map);*/
        
         
         map.addListener('click', function(event) {  
        	    addMarker(event.latLng);  
        	    
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

            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
            
            map.setCenter(pos);
   
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                                  'Error: The Geolocation service failed.' :
                                  'Error: Your browser doesn\'t support geolocation.');
          }
        
        
        
      }

//funcion que traduce la direccion en coordenadas
function codeAddress() {
     
    //obtengo la direccion del formulario
    var address = document.getElementById("direccion").value;
    //hago la llamada al geodecoder
    geocoder.geocode( { 'address': address}, function(results, status) {
    //si el estado de la llamado es OK
    if (status == google.maps.GeocoderStatus.OK) {
 
    	addMarker(results[0].geometry.location);
    	
        google.maps.event.addListener(marker, 'dragend', function(){
        	addMarker(marker.getPosition());
        });
        
  } else {
      //si no es OK devuelvo error
      alert("No podemos encontrar la direcci&oacute;n, error: " + status);
  }
});
}

function calcularNiveles( ingresos,  egresos,  cantidad,  zona) {

        var totalIngresosFamiliares = parseFloat(ingresos) - parseFloat(egresos);

        //CALCULO INGRESOS FAMILIARES
        var lineaPobrezaNacional = 0;
        var lineaPobrezaExtrema = 0;
        
        if (zona.trim() =="Metropolitana") {
            lineaPobrezaNacional = 643606;
            lineaPobrezaExtrema = 378520;
        } else if (zona.trim() == "Rural") {
            lineaPobrezaNacional = 446798;
            lineaPobrezaExtrema = 214690;
        } else if (zona.trim() == "Urbana") {
            lineaPobrezaNacional = 630525;
            lineaPobrezaExtrema = 235088;
        }

       var ingresosFamiliaresPercap = totalIngresosFamiliares / parseInt(cantidad);

        //CALCULO DE NIVELES
        var nivelPobreza = 0;
        if (ingresosFamiliaresPercap > lineaPobrezaNacional) {
            nivelPobreza = 3;
        } else if (ingresosFamiliaresPercap < lineaPobrezaExtrema) {
            nivelPobreza = 1;
        } else {
            nivelPobreza = 2;
        }
        console.log("El nivel es: " + nivelPobreza)
        localStorage.nivel = sjcl.encrypt(encrypt, String(nivelPobreza));
       
        return  nivelPobreza;

}


function calcularMonto( freceuncia,  valor){
        var monto = 0;
        freceuncia = freceuncia.toLowerCase().trim();

        switch (freceuncia){
            case "semanal":
                monto = valor *4;
                break;
            case "quincenal":
                monto = valor *2;
                break;
            case "mensual":
                monto = valor;
                break;
            case "semestral":
                monto = valor / 6;
                break;
            case "anual":
                monto = valor / 12;
                break;
            default:
                break;

        }

        return monto;

    }