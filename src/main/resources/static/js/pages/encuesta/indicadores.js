var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var preguntas;
var preguntaActual = 0;
var idusuario ;
var total ;

$(document).ready(function(){
	
	
	//aux
	//localStorage.iddtsocioeconomica = 6000;
	// localStorage.preguntas = "";

	var obj = JSON.parse(sjcl.decrypt(encrypt, localStorage.usuario));
	idusuario = obj.idusuario;


	
	$('#minAside').hide();
	$('.slick_demo_2').slick({
		  infinite: false,
		  slidesToShow: 3,
		  slidesToScroll: 3,
		  dots: false,
		  arrows: false,
		  draggable: false,

		  responsive: [
			    {
			      breakpoint: 1024,
			      settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3,
			        infinite: false,
			        dots: true
			      }
			    },
			    {
			      breakpoint: 600,
			      settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3
			      }
			    },
			    {
			      breakpoint: 480,
			      settings: {
			        slidesToShow: 3,
			        slidesToScroll: 3
			      }
			    }
			    // You can unslick at a given breakpoint now by adding:
			    // settings: "unslick"
			    // instead of a settings object
			  ]
	  
		});

	if(localStorage.iddtsocioeconomica == null){
		swal({
			  title: "Atencion",
	          text: "Debe completar la encuesta socioeconomica",
	          confirmButtonText: "Completar",
			  confirmButtonColor: "#1ab394",
			  closeOnConfirm: false
			},
			function(){
				window.location.href = context +'/formencuesta'; 
			});

	}else{	
		if(localStorage.preguntas == ""){		
			console.log("Pregunta vacia: " + localStorage.preguntas)
			console.log("Respuestas antes " + localStorage.respuestas)
			getById()
		}else { 
			console.log("De memoria....")
			$('#ibox1').children('.ibox-content').toggleClass('sk-loading');
			cargarPreguntas(JSON.parse(localStorage.preguntas))
		}
	}
	
	
	
	
	
});

function updateProgress(valor) {  
	var percentage = (valor * 100) / total
	console.log(valor + " " + total)
    document.getElementById('progress').style.width = percentage+"%";
    document.getElementById('progress').innerHTML = valor+"/"+total
}

function siguiente(){
	
	window.location.hash = "titulo";
	if(preguntas[preguntaActual].selected){	
		if(sjcl.decrypt(encrypt, localStorage.nivel) > 0 && preguntas[preguntaActual].numero == 1){
			
			grabarPregunta(pojoDtpregunta(idusuario, $("#idsemaforo").val(), sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica) , preguntas[0].idpregunta, parseInt(sjcl.decrypt(encrypt, localStorage.nivel)) , 1, preguntas[0].iddtpregunta), preguntaActual)

			//siguiente
			$('.slick_demo_2').slick('slickNext');
			preguntaActual++
			setTitulo(preguntaActual)
			
		}else {
			if(preguntaActual == (preguntas.length -1)){
				//fin
				document.getElementById('btnsgte').innerHTML = "Finalizar"
				var myJsonString = JSON.stringify(preguntas);
				localStorage.respuestas = sjcl.encrypt(encrypt,myJsonString);
				//mensaje de finalizado
				swal({
					  title: "¡Encuesta Finalizada!",
					  text: "¡Gracias por completar su Semaforo!",
					  type: "success",
					  confirmButtonColor: "#1ab394",
					  confirmButtonText: "Ver Resultados",
					  allowOutsideClick: false,
					  closeOnCancel: true,
					  closeOnConfirm: false
					},
					function(){
						window.location.href = context +'/finencuesta'; 
					});
				
				
			}else{		
				//siguiente
				$('.slick_demo_2').slick('slickNext');
				preguntaActual++
				setTitulo(preguntaActual)
			}
		}
		var myJsonString = JSON.stringify(preguntas);
		localStorage.respuestas = sjcl.encrypt(encrypt,myJsonString);
		window.location.hash = "";

		hablitar($("#btnAdd"))
		updateProgress(preguntaActual+1) 

	}else{
		swal("Marque una opción para avanza")
	}
	
}

function anterior(){
	$('.slick_demo_2').slick('slickPrev');
	preguntaActual--
	setTitulo(preguntaActual)
	updateProgress(preguntaActual+1) 
	if(preguntaActual == 0){
		deshablitar($("#btnAdd"))
	}
}

function setTitulo(numero){
	document.getElementById('titulo').innerHTML = preguntas[numero].numero + "- "+preguntas[numero].descripcion

} 

function setOpcion(div, nro){

	if( sjcl.decrypt(encrypt, localStorage.nivel) != 0 && preguntaActual == 0 ){
			alert("No se puede cambiar la respuesta en este indicador")
	}else{
		
		$("#itemR"+preguntaActual).removeClass("border-square");
		$("#itemA"+preguntaActual).removeClass("border-square");
		$("#itemV"+preguntaActual).removeClass("border-square");
		
		$(div).addClass("border-square");
		
		
		preguntas[preguntaActual].selected = true;
		preguntas[preguntaActual].nroopcion = nro;
		
		console.log( "pregunta interna: " + JSON.stringify(preguntas[preguntaActual]))

		grabarPregunta(pojoDtpregunta(idusuario, $("#idsemaforo").val(), sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica) , preguntas[preguntaActual].idpregunta, nro, preguntas[preguntaActual].numero, preguntas[preguntaActual].iddtpregunta), preguntaActual)


	}

	
}

function grabarPregunta(dtpregunta, nro){
	//console.log("Dtpregunta: " + dtpregunta)
	var iddtpregunta= 0;
	$.ajax({
		type : "POST",
		url : context + "/private/semaforo/pregunta",
		data :{
			"dtpregunta" : dtpregunta
		},
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			
			if (jsonobject.estado == "ERROR") {
			//	$('#modal').modal("toggle")
			//	alertify.errorAlert(jsonobject.error);

			} else if (jsonobject.estado == 'OK') {	
				preguntas[nro].iddtpregunta =jsonobject.datos;
				
				//$('#modal').modal("toggle")
				//window.location.href = '/indicadores'; 
				
			}
			$(document).ajaxStop($.unblockUI);
			console.log("return: " + preguntas[nro].iddtpregunta)
			return iddtpregunta;
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


function getById(){
	//blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/question/semaforo/" + $("#idsemaforo").val(),		
		success : function(data) {

			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {
				alertify.errorAlert(jsonobject.Message);
			} else if (jsonobject.estado == 'OK') {	
				localStorage.preguntas = JSON.stringify(jsonobject.datos)
				total = jsonobject.datos.length
				preguntas = new Array()
				var perguntasGuardadas;
				if(localStorage.respuestas != ""){					
		
						perguntasGuardadas = JSON.parse(sjcl.decrypt(encrypt, localStorage.respuestas));	
				}
				var aux = 0;
				$.each(jsonobject.datos, function(index, element) {
					
					//vector de preguntas
				if(perguntasGuardadas != null){
					if(perguntasGuardadas[aux] != null){						
						preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, perguntasGuardadas[aux].selected ,perguntasGuardadas[aux].nroopcion,perguntasGuardadas[aux].iddtpregunta, sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica), perguntasGuardadas[aux].abreviatura)))
					}else{
						preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, false, 0 ,0, sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica),element.abreviatura)))
					}
				}else{					
					preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, false, 0 ,0 , sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica), element.abreviatura)))
					if(sjcl.decrypt(encrypt, localStorage.nivel) > 0 && element.nropregunta == 1){
						preguntas[0].selected = true
						preguntas[0].nroopcion = parseInt(sjcl.decrypt(encrypt, localStorage.nivel));
					}
				}
				
					
					// si existe el nivel, marca la primera pregunta	
					if(preguntas[aux].selected == true){
						switch (preguntas[aux].nroopcion) {
						case 1:
							
							//rojo
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
							        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
							        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
							        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
							        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
							//amarillo
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
					        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
					        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
					        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
					        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
							//verde
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
							        '<div class="ibox-content no-padding border-left-right back_verde"> '+
							        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
							        '</div><div class="ibox-content profile-content opcion back_verde" >'+
							        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
							
							break;
						case 2:
							
							//rojo
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
						        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
						        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
						        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
						        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
							//amarillo
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
					        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
					        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
					        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
					        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
							//verde
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
							        '<div class="ibox-content no-padding border-left-right back_verde"> '+
							        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
							        '</div><div class="ibox-content profile-content opcion back_verde" >'+
							        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
							
							break;
						case 3:
							
							//rojo
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
						        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
						        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
						        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
						        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
						//amarillo
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
				        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
							//verde
							$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
							        '<div class="ibox-content no-padding border-left-right back_verde"> '+
							        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
							        '</div><div class="ibox-content profile-content opcion back_verde" >'+
							        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
							break;
						

						default:
							break;
						}
							
					}else{
						//rojo
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
						        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
						        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
						        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
						        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
						//amarillo
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
				        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
						//verde
						$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
						        '<div class="ibox-content no-padding border-left-right back_verde"> '+
						        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
						        '</div><div class="ibox-content profile-content opcion back_verde" >'+
						        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
						
						
					}
					aux++;
					});			

			}
			//$(document).ajaxStop($.unblockUI);
			setTitulo(preguntaActual)
			updateProgress(1)
			
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


//cargar preguntas desde el localstore

function cargarPreguntas(datos){
	
	total = datos.length
	preguntas = new Array()
	var perguntasGuardadas;
	if(localStorage.respuestas != null){		
		if(localStorage.respuestas != ""){
			perguntasGuardadas = JSON.parse(sjcl.decrypt(encrypt, localStorage.respuestas));	
			
		}
	}
	var aux = 0;
	$.each(datos, function(index, element) {
		
		//vector de preguntas
		if(perguntasGuardadas != null){
			if(perguntasGuardadas[aux] != null){						
				preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, perguntasGuardadas[aux].selected ,perguntasGuardadas[aux].nroopcion,perguntasGuardadas[aux].iddtpregunta, sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica), perguntasGuardadas[aux].abreviatura)))
			}else{
				preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, false, 0 ,0, sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica),element.abreviatura)))
			}
		}else{					
			preguntas.push(JSON.parse(pojoPreguntaInterna(element.nropregunta, element.idpregunta, element.titulo, false, 0 ,0 , sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica), element.abreviatura)))
			if(sjcl.decrypt(encrypt, localStorage.nivel) > 0 && element.nropregunta == 1){
				preguntas[0].selected = true
				preguntas[0].nroopcion = parseInt(sjcl.decrypt(encrypt, localStorage.nivel));
			}
		}
	

	
		
		// si existe el nivel, marca la primera pregunta	
		if(preguntas[aux].selected == true){
			switch (preguntas[aux].nroopcion) {
			case 1:
				
				//rojo
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
				        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
				//amarillo
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
		        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
		        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
		        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
		        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
				//verde
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_verde"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_verde" >'+
				        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
				
				break;
			case 2:
				
				//rojo
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
			        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
			        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
			        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
			        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
				//amarillo
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
		        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
		        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
		        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
		        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
				//verde
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_verde"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_verde" >'+
				        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
				
				break;
			case 3:
				
				//rojo
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
			        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
			        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
			        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
			        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
			//amarillo
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
	        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
	        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
	        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
	        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
				//verde
				$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid border-square" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
				        '<div class="ibox-content no-padding border-left-right back_verde"> '+
				        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
				        '</div><div class="ibox-content profile-content opcion back_verde" >'+
				        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
				break;
			

			default:
				break;
			}
				
		}else{
			//rojo
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 1)" id="itemR'+index+'">'+                
			        '<div class="ibox-content no-padding border-left-right back_rojo"> '+
			        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[0].imagen+'" style="height: 300px"/>'+
			        '</div><div class="ibox-content profile-content opcion back_rojo" >'+
			        '<p class="opciontext text-white"> '+element.listOpciones[0].descripcion+'</p></div></div></div>');
			//amarillo
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 2)" id="itemA'+index+'">'+                
	        '<div class="ibox-content no-padding border-left-right back_amarillo"> '+
	        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[1].imagen+'" style="height: 300px"/>'+
	        '</div><div class="ibox-content profile-content opcion back_amarillo" >'+
	        '<p class="opciontext "> '+element.listOpciones[1].descripcion+'</p></div></div></div>');
			//verde
			$('.slick_demo_2').slick('slickAdd','<div><div class="ibox float-e-margins grid" onclick="setOpcion(this, 3)"id="itemV'+index+'">'+                
			        '<div class="ibox-content no-padding border-left-right back_verde"> '+
			        '<img alt="image" class="img-responsive center-block" src="'+context + "/public/opcion/image/" + element.listOpciones[2].imagen+'" style="height: 300px"/>'+
			        '</div><div class="ibox-content profile-content opcion back_verde" >'+
			        '<p class="opciontext text-white"> '+element.listOpciones[2].descripcion+'</p></div></div></div>');
			
			
		}
		aux++;
		});	
	$(document).ajaxStop($.unblockUI);
	setTitulo(preguntaActual)
	updateProgress(1)
	 $('#ibox1').children('.ibox-content').toggleClass('sk-loading');
}