
function pojoUsuario(idusuario, username, activated, idempresa, idversion, idperfil){
	
	var perfiles = "";
	for (var i = 0; i < idperfil.length; i++) {
		
		
		if(i == (idperfil.length - 1)){
			perfiles+= '{"perfil":' + pojoPerfil(idperfil[i] , "")+ ","
			perfiles+= '"usuario":{"idusuario": '+ idusuario+'}}' 
		}else{
			perfiles+= '{"perfil":' + pojoPerfil(idperfil[i] , "")+ ","
			perfiles+= '"usuario":{"idusuario": '+ idusuario+'}}' + ","
	
		}
	}
	
	var pojo = "{";
	pojo += '"idusuario":' + idusuario 
	pojo += ',"username": "' +username + '"'
	pojo += ',"activated":' + activated 
	pojo += ',"empresa":' + pojoEmpresa(idempresa, "")
	pojo += ',"versionencuesta" :' + pojoVersionEncuesta2(idversion , "")
	pojo += ',"perfilusuario" : ['+perfiles + ']'
		
	pojo += "}";	
	
	//console.log(pojo)
	
	return pojo;

}

function pojoUsuario2(idusuario, username, idempresa, idversion){
	
	var pojo = "{";
	pojo += '"idusuario":' + idusuario 
	pojo += ',"username": "' +username + '"'
	pojo += ',"empresa":' + pojoEmpresa(idempresa, "")
	pojo += ',"versionencuesta" :' + pojoVersionEncuesta2(idversion , "")	
	pojo += "}";	
	
	//console.log(pojo)
	
	return pojo;

}

function pojoEmpresa(idempresa, descripcion){
	
	var pojo = "{";
	pojo += '"idempresa":' + idempresa
	pojo += ',"descripcion" : "' + descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}

function pojoVersionEncuesta2(idversion, descripcion){
	
	var pojo = "{";
	pojo += '"idversion":' + idversion
	pojo += ',"descripcion":"' + descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}

function pojoVersionEncuesta(idversion, descripcion, idsemaforo, idsocioe, estado, codupdate){
	
	var pojo = "{";
	pojo += '"idversion":' + idversion
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"semaforo":' + pojoSemaforo(idsemaforo, "", 1, true)
	pojo += ',"socioeconomica":' + pojoSocioeconomica(idsocioe, "", "", true)
	pojo += ',"codupdate":' + codupdate	
	pojo += ',"estado":' + estado 	
	pojo += "}";
	
	return pojo;
}

function pojoPerfil(idperfil, descripcion){
	
	var pojo = "{";
	pojo += '"idperfil":' + idperfil
	pojo += ',"descripcion" :"'+ descripcion +'"'
		
	pojo += "}";
	
	return pojo;
}

function pojoPerfil(idperfil, descripcion, estado){
	
	var pojo = "{";
	pojo += '"idperfil":' + idperfil
	pojo += ',"descripcion" :"'+ descripcion +'"'
	pojo += ',"estado":' + estado 		
	pojo += "}";
	
	return pojo;
}

function pojoSemaforo(idsemaforo, descripcion , update, estado){
	
	var pojo = "{";
	pojo += '"idsemaforo":' + idsemaforo
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"codupdate":' + update
	pojo += ',"estado":' + estado 	
	pojo += "}";
	
	return pojo;
}

function pojoSocioeconomica(idsocioeconomica, descripcion , formula, estado){
	
	var pojo = "{";
	pojo += '"idsocioeconomica":' + idsocioeconomica
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"formula":"' + formula+'"'
	pojo += ',"estado":' + estado 	
	pojo += "}";
	
	return pojo;
}

function pojoPregunta(idpregunta, titulo, idsemaforo, nropregunta, estado, update, abreviatura){
	
	var pojo = "{";
	pojo += '"idpregunta":' + idpregunta
	pojo += ',"titulo" : "' + titulo +'"'
	pojo += ',"semaforo":' + pojoSemaforo(idsemaforo, "", 1, true) 	
	pojo += ',"nropregunta":' + nropregunta 
	pojo += ',"estado":' + estado 		
	pojo += ',"codupdate":' + update 
	pojo += ',"abreviatura" : "' + abreviatura +'"'
	pojo += "}";
	
	return pojo;
}


function pojoOpcion(idopcion, descripcion , idpregunta, nroopcion, imagen){
	
	var pojo = "{";
	pojo += '"idopcion":' + idopcion
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"imagen":"' + imagen +'"'
	pojo += ',"pregunta":' + pojoPregunta(idpregunta, "", 0, 0, true, 1)
	pojo += ',"nroopcion":' + nroopcion 	
	pojo += "}";
	
	return pojo;
}

function pojoClase(idclase, descripcion , url, estado){
	
	var pojo = "{";
	pojo += '"idclase":' + idclase
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"url":"' + url+'"'
	pojo += ',"estado":' + estado 	
	pojo += "}";
	
	return pojo;
}

function pojoMenu(idmenu, descripcion , tipo, orden, idclase, menuanterior, idperfil, estado){
	
	var pojo = "{";
	pojo += '"idmenu":' + idmenu
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"tipo":"' + tipo +'"'
	pojo += ',"orden":' + orden
	pojo += ',"idclase":' + idclase
	pojo += ',"menuanterior":' + menuanterior
	pojo += ',"idperfil":' + idperfil
	pojo += ',"estado":' + estado 	
	pojo += "}";
	
	return pojo;
}


function pojoPreguntaInterna(numero, idpregunta, descripcion, selected, nroopcion, iddtpregunta, idsocioeconomica, abreviatura ){
	
	var pojo = "{";
	pojo += '"numero":' + numero
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"idpregunta":' + idpregunta
	pojo += ',"selected":' + selected 	
	pojo += ',"nroopcion":' + nroopcion 
	pojo += ',"iddtpregunta":' + iddtpregunta 
	pojo += ',"idsocioeconomica":' + idsocioeconomica 	
	pojo += ',"abreviatura":"' + abreviatura +'"'
	pojo += "}";
	
	//console.log(pojo)
	return pojo;
}


function pojoDtsocioeconomica(descripcion, idversion, usuario, json, coordenadas, nivel, idioma){
	
	var pojo = "{";
	pojo += '"descripcion":"' + descripcion +'"'
	pojo += ',"idversion":' + idversion
	pojo += ',"usuario":' + usuario
	pojo += ',"value":' + json 
	pojo += ',"coordenadas":"' + coordenadas +'"'
	pojo += ',"nivel":' + nivel 	
	pojo += ',"idioma":"' + idioma +'"'
	pojo += "}";
	
	return pojo;
}

function pojoDtpregunta(idusuario, idsemaforo, idsocioeconomica, idpregunta, nroopcion, nropregunta, iddtpregunta){
	
	var pojo = "{";
	pojo += '"iddtpregunta":' + iddtpregunta 
	pojo += ',"idusuario":' + idusuario 
	pojo += ',"idsemaforo":' + idsemaforo
	pojo += ',"idsocioeconomica":' + idsocioeconomica
	pojo += ',"idpregunta":' + idpregunta 
	pojo += ',"nroopcion":' + nroopcion
	pojo += ',"sincronizado": true'
	pojo += ',"nropregunta":' +nropregunta
	pojo += "}";
	
	
	//console.log(pojo)
	return pojo;
}

function pojoMapavida(idmapavida, question1, question2, fecha, idsocioeconomica, idpregunta, nroopcion ){
	
	var pojo = "{";
	pojo += '"idmapavida":' + idmapavida
	pojo += ',"question1":"' + question1 +'"'
	pojo += ',"question2":"' + question2 +'"'
	pojo += ',"fecha":"' + fecha +'"'
	pojo += ',"sincronizado":' + true
	pojo += ',"migrado":' + false 	
	pojo += ',"logro":' + false 
	pojo += ',"idsocioeconomica":' + idsocioeconomica 
	pojo += ',"idpregunta":' + idpregunta 	
	pojo += ',"nroopcion":' + nroopcion 	
	pojo += "}";
	
	//console.log(pojo)
	return pojo;
}


function pojoPerfilempresa(idempresa, nombre, descripcion, rubro, direccion, email, celular,
		telefono,facebook , idusuario, imagen){
	
	var pojo = "{";
	pojo += '"idempresa":' + idempresa
	pojo += ',"nombre":"' + nombre +'"'
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"rubro":"' + rubro +'"'
	pojo += ',"estado":' + true 
	pojo += ',"direccion":"' + direccion +'"'
	pojo += ',"email":"' + email +'"'
	pojo += ',"celular":"' + celular +'"'
	pojo += ',"telefono":"' + telefono +'"'
	pojo += ',"facebook":"' + facebook +'"'
	pojo += ',"idusuario":' + idusuario
	pojo += ',"imagen":"' + imagen +'"'
	pojo += "}";
	
	//console.log(pojo)
	return pojo;
}

function pojoPlantrabajo(idplantrabajo, idpregunta , comentario, fechalimite, estado){
	
	var pojo = "{";
	pojo += '"idplantrabajo":' + idplantrabajo
	pojo += ',"comentario":"' + comentario +'"'
	pojo += ',"pregunta":' + pojoPregunta(idpregunta, "", 0, 0, true, 1)
	pojo += ',"fechalimite":"' + fechalimite+'"' 
	pojo += ',"estado": ' + estado
	pojo += "}";
	
	return pojo;
}

function pojoCalendario(idcalendario, idplantrabajo, descripcion , fechadesde, fechahasta, idestado, ispublic){
	
	var pojo = "{";
	pojo += '"idcalendario":' + idcalendario
	pojo += ',"plantrabajo":' + pojoPlantrabajo(idplantrabajo, 0, "", "01/01/2000", true)
	pojo += ',"descripcion":"' + descripcion +'"'
	pojo += ',"fechadesde":"' + fechadesde+'"' 
	pojo += ',"fechahasta":"' + fechahasta+'"' 
	pojo += ',"ispublic": ' + ispublic
	pojo += ',"estados": {"idestado": ' + idestado+"}"
	pojo += "}";
	
	return pojo;
}

function pojoActividad(idactividad, idcalendario, descripcion, aliados , cantidad, pasos, obs, idpregunta, fechaactividad){
	
	var pojo = "{";
	pojo += '"idactividad":' + idactividad
	pojo += ',"descripcion":"' + descripcion+'"'
	pojo += ',"calendario":' + pojoCalendario(idcalendario, 0, "", "01/01/2000", "01/01/2000", 0)
	pojo += ',"aliados":"' + aliados +'"'
	pojo += ',"pasos":"' + pasos.replace(/\n/g, "<br/>")+'"' 
	pojo += ',"cantidad":"' + cantidad+'"' 
	pojo += ',"obs":"' + obs+'"' 
	pojo += ',"fechaactividad":"' + fechaactividad+'"' 
	pojo += ',"rating": 0'
	pojo += ',"pregunta":' +pojoPregunta(idpregunta, "", 0, 0, true, 0, "")
	pojo += "}";

	
	console.log(pojo)
	return pojo;
}

function pojoActividad2(idactividad, idcalendario, descripcion, aliados , cantidad, pasos, obs, idpregunta, fechaactividad, idempresa){
	
	var pojo = "{";
	pojo += '"idactividad":' + idactividad
	pojo += ',"descripcion":"' + descripcion+'"'
	pojo += ',"calendario":' + pojoCalendario(idcalendario, 0, "", "01/01/2000", "01/01/2000", 0)
	pojo += ',"aliados":"' + aliados +'"'
	pojo += ',"pasos":"' + pasos.replace(/\n/g, "<br/>")+'"' 
	pojo += ',"cantidad":"' + cantidad+'"' 
	pojo += ',"obs":"' + obs+'"' 
	pojo += ',"fechaactividad":"' + fechaactividad+'"' 
	pojo += ',"rating": 0'
	pojo += ',"pregunta":' +pojoPregunta(idpregunta, "", 0, 0, true, 0, "")
	pojo += ',"empresa":' +pojoEmpresa(idempresa, "")
	pojo += "}";

	
	console.log(pojo)
	return pojo;
}


function pojoContrato(idcontrato, idempresa, fechadesde, fechahasta, nrocontrato, observaciones, estado){
	var pojo = "{";
	pojo += '"idcontrato":' + idcontrato
	pojo += ',"empresa":' +pojoEmpresa(idempresa, "")
	//pojo += ',"idempresa":' + idempresa
	pojo += ',"nrocontrato":"' + nrocontrato +'"'
	pojo += ',"observaciones":"' + observaciones +'"'
	pojo += ',"fechadesde":"' + fechadesde+'"' 
	pojo += ',"fechahasta":"' + fechahasta+'"' 
	pojo += ',"estado": ' + estado
	pojo += "}";
	
	return pojo;
}
