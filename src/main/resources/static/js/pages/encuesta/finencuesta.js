var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));
var check = '<i class="fa fa-check fa-2x" style="color:green; position: absolute;"></i>&nbsp'
var contador =0;	
var numerop=0;
var arraymap = [];
$(document).ready(function(){
	//console.log(localStorage.respuestas)
	
	$('.datepicker').datepicker({    	
        keyboardNavigation: false,
        forceParse: false,
        autoclose: true,
        language: 'es',
       
    });
	 var currentDate = new Date();  
	    $("#m_fecha").datepicker("setDate",currentDate);
	
	if(sjcl.decrypt(encrypt, localStorage.respuestas) != null){		
		if(sjcl.decrypt(encrypt, localStorage.respuestas) != ""){
			poblarTabla()		
			$("#encuestado").text("Encuestado: "+sjcl.decrypt(encrypt, localStorage.encuestado))
		}else{
			
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
		}
	}else{
		
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
	}
	
	
	
});

function volver(){
	
	delete localStorage.iddtsocioeconomica;
	delete localStorage.nivel;
	delete localStorage.respuestas;
	window.location.replace(context +"/home");
}

function imprimir(){
	
	$('#print').printThis({
		 importCSS: true,
		 importStyle: true, 
		loadCSS: [context + "/css/bootstrap.min.css", context + "/font-awesome/css/font-awesome.css",
			context + "/css/myStyle.css", context + "/img/semaforo/LOGO FP_400.png"],
		pageTitle: "Resultado del Semaforo", 
		header: null,           
	    footer: null, 
	    base: true ,  
	});
}

function setCorreo(){
	document.getElementById("email").value = ""
	$('#correo').modal()
}



function poblarTabla(){
	var registros = JSON.parse(sjcl.decrypt(encrypt, localStorage.respuestas));
	
	var rowLength = registros.length / 5;
	

	
	if (rowLength % 1) {
		rowLength = rowLength - (rowLength % 1);
		rowLength = rowLength + 1;
	}

	var table = document.getElementById("table");
	var c = 0;
	var content
		for(i=0; i<rowLength; i++){
		    content += '<tr>';
		    for (var j = 0; j < 5; j++) {
		    	if((c+j) < registros.length){
		    		
		    		
		    		//colores
		    		var rojo = '<button type="button" class="btn back_rojo m-r-sm"  style="width: 40px;" onclick="mapavida('+registros[c+j].idpregunta+',\''+registros[c+j].descripcion+'\', 1,'+registros[c+j].numero+','+registros[c+j].idpregunta+', '+i+', '+j+')">'+registros[c+j].numero+'</button>'
		    		var amarillo = '<button type="button" class="btn back_amarillo m-r-sm" style="width: 40px;" onclick="mapavida('+registros[c+j].idpregunta+',\''+registros[c+j].descripcion+'\', 2,'+registros[c+j].numero+','+registros[c+j].idpregunta+', '+i+', '+j+')">'+registros[c+j].numero+'</button>'
		    		var verde = '<button type="button" class="btn back_verde m-r-sm text-center" style="width: 40px;" onclick="mapavida('+registros[c+j].idpregunta+',\''+registros[c+j].descripcion+'\',3,'+registros[c+j].numero+','+registros[c+j].idpregunta+', '+i+', '+j+')"> '+
		    		registros[c+j].numero+'</button> '
		    		
		    		switch (registros[c+j].nroopcion) {
		    		case 1:
		    			content +='<td>' + rojo + '&nbsp;<span class="text-center">' +siNuloTitulo(registros[c+j]) + '</span></td>';
		    			break;
		    		case 2:
		    			content +='<td>' + amarillo + '&nbsp;<span class="text-center">' +siNuloTitulo(registros[c+j]) + '</span></td>';
		    			break;
		    		case 3:
		    			content +='<td>' + verde +'&nbsp;<span class="text-center">' +siNuloTitulo(registros[c+j]) + '</span></td>';
		    			break;
		    			
		    		default:
		    			break;
		    		}
		    		//c++;
		    	}
		    	}
		    
		    content +='</tr>';
		    c= c+5;
		}

		$('#table').append(content);
		$('#table').addClass("table");
		$('#table').addClass("table-bordered");
		
		
	
}

function addCheck(fila, columna){
	$('#prioridades').show()
	var registros = JSON.parse(sjcl.decrypt(encrypt, localStorage.respuestas));
	/*var table = document.getElementById("table");
	table.rows[fila].cells[columna].innerHTML = table.rows[fila].cells[columna].innerHTML + check */
	//rellenando la tabla de prioridades
	var content = '';
	content += '<tr>';
	content +='<td class="text-center">'+contador+'</td>';
	
	if(registros[numerop-1].nroopcion == 1){
		content +='<td> <span class="label back_rojo">' +registros[numerop-1].numero + '</span> &nbsp;' +siNuloTitulo(registros[numerop-1]) + '</td>';
	}else{
		content +='<td> <span class="label back_amarillo">' +registros[numerop-1].numero + '</span> &nbsp;' +siNuloTitulo(registros[numerop-1]) + '</td>';
	}
	content +='<td class="text-center">'+$("#m_q1").val()+'</td>';
	content +='<td class="text-center">'+$("#m_q2").val()+'</td>';
	content +='<td class="text-center">'+$("#m_fecha").val()+'</td>';
	content +='</tr>';
	$('#tablePrioridades').append(content);
	cerrar()
}

function mapavida(idpregunta, descripcion, nroopcion, nropregunta, iddtpregunta, i, j){
	console.log(nropregunta)

	var ban = true;
	for(i=0; i<arraymap.length; i++){
		console.log("numero " + nropregunta+  " en el array: "+ arraymap[i])
		if(arraymap[i] == nropregunta){
			ban = false;
		}
	}
	
	if(ban){
		
		if(nroopcion == 3){
			
		}else{
			numerop = nropregunta;
			document.getElementById('m_indicador1').innerHTML =nropregunta + " - "+descripcion;
			document.getElementById('m_iddtpregunta').value= iddtpregunta;
			document.getElementById('m_nroopcion').value= nroopcion;
			document.getElementById('m_fila').value= i;
			document.getElementById('m_columna').value= j;
			
			$('#modal').modal()
		}
	}
	
	//$('#modal').modal("toggle")
	
}

function cerrar() {
	
	document.getElementById('m_indicador1').innerHTML= '';
	document.getElementById('m_q1').value= '';
	document.getElementById('m_iddtpregunta').value= 0;
	document.getElementById('m_nroopcion').value= 0;
	document.getElementById('m_q2').value= '';
	document.getElementById('m_fecha').value= '';
	document.getElementById('m_fila').value= '';
	document.getElementById('m_columna').value= '';
	
}

function aceptar() {
	if(validate() == 0){
		$('#modal').modal("toggle")
		//guardar mapa de vida
		grabarMapavida(pojoMapavida(0, $("#m_q1").val(), $("#m_q2").val(), $("#m_fecha").val(), sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica), $("#m_iddtpregunta").val(), $("#m_nroopcion").val() ), $("#m_fila").val(), $("#m_columna").val())
		
		
	}
	
}

function grabarMapavida(mapavida, fila, columna){
	
	$.ajax({
		type : "POST",
		url : context + "/private/semaforo/mapavida",
		data :{
			"mapavida" : mapavida
		},
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			
			if (jsonobject.estado == "ERROR") {

			alertify.errorAlert(jsonobject.error);

			} else if (jsonobject.estado == 'OK') {	
				  alertify.success('Mapa de Vida agregado');
				  contador++;
				  addCheck(fila, columna)
				  arraymap.push(numerop)
				
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

function enviar(){
	console.log(validate2())
	if(validate2() == 0){	
		enviarCorreo($("#email").val() , sjcl.decrypt(encrypt, localStorage.iddtsocioeconomica))
		
	}
}

function enviarCorreo(email, iddtsocioeconomica ){
	
	$('#correo').modal("toggle")

	$.ajax({
		type : "POST",
		url : context + "/private/semaforo/sendresultmail",
		data :{
			"correo" : email,
			"iddtsocioeconomica" : iddtsocioeconomica
		},
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			
			if (jsonobject.estado == "ERROR") {
				alertify.errorAlert(jsonobject.error);
			} else if (jsonobject.estado == 'OK') {	
//				$('#correo').modal("toggle")
				alertify.success('Correo enviado!');
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

function siNuloTitulo(elemento){
	var s= elemento.abreviatura;
	if(elemento.abreviatura == "undefined"){
		s = elemento.descripcion.slice(0, 20) + ".."		
	}
		return s;	
}

function validate(){
	
	var error = 0;
	if (!validarVacio($("#m_q1").val())) {			
		$("#m_q1").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_q1").css({'border':'1px solid #d2d6de'});
	 }
	
	if (!validarVacio($("#m_q2").val())) {			
		$("#m_q2").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_q2").css({'border':'1px solid #d2d6de'});
	 }
	if (!validarVacio($("#m_fecha").val())) {			
		$("#m_fecha").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#m_fecha").css({'border':'1px solid #d2d6de'});
	 }
	
	console.log("error: " + error)
	return error;
}

function validate2(){
	var error = 0;
	if (!validateEmail($("#email").val())) {			
		$("#email").css({'border':'1px solid red'});
		error++;
		
	}else{
		  $("#email").css({'border':'1px solid #d2d6de'});
	 }
	return error;
}


