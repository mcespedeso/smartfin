var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

$(document).ready(function(){
	
	localStorage.usuario = sjcl.encrypt(encrypt,pojoUsuario2($("#idusuario").val(), $("#username").val(), $("#idempresa").val(), $("#idversion").val()));
	localStorage.idioma =$("#idioma").val();
	getEncuestados()
	
});

function getEncuestados(){

	$.ajax({
		type : "GET",
		url : context + "/private/dashboard-encuestados",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {

			} else if (jsonobject.estado == 'OK') {	
				
				document.getElementById('homeCantidad').innerHTML = jsonobject.datos

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

//indicadores
function getIndicadores(){

	$.ajax({
		type : "GET",
		url : context + "/private/dashboard-indicadores",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {

			} else if (jsonobject.estado == 'OK') {	
				var r =0;
				var a =0;
				var v = 0;

				console.log("Usuarios " + jsonobject.datos)
				var labels = [];
				var data1 = [];
				var data2 = [];
				var data3 = [];
				
				$.each(jsonobject.datos, function(index, element) {
					labels.push(element.titulo)
					data1.push(element.opcion1)
					data2.push(element.opcion2)
					data3.push(element.opcion3)
						
				});		

				//linear chart
				 var barData = {
					        labels: labels,
					        datasets: [
					            {
					                label: "Rojo",
					                backgroundColor: 'rgba(255, 0, 0, 0.8)',
					                borderColor: "rgb(255, 0, 0)",
					                data: data1
					            },
					            {
					                label: "Amarillo",
					                backgroundColor: 'rgba(255, 255, 0, 0.7)',
					                borderColor: "rgb(255, 255, 0)",
					                data: data2
					            },
					            {
					                label: "Verde",
					                backgroundColor: 'rgba(0, 128, 0, 0.7)',
					                borderColor: "rgb(0, 128, 0)",
					                data: data3
					            }
					        ]
					    };

					    var barOptions = {
					        responsive: true,
					        legend: {
					            labels: {
					                // This more specific font property overrides the global property
					                fontSize : 16
					            }
					        }
					    };
				
				var ctx2 = document.getElementById("barChart").getContext("2d");
			    new Chart(ctx2, {type: 'horizontalBar', data: barData, options:barOptions});
				
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

//eventos del calendario
function getAllEventos(){
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
		                	myEvent.color = "#23c6c8"
		                		myEvent.textColor = "1"
		                }else if(element.estados.idestado == 4){
		                	myEvent.color = "#449d44"
		                	myEvent.textColor = "4"
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


function getNiveles(){

	$.ajax({
		type : "GET",
		url : context + "/private/dashboard-nivel",		
		success : function(data) {
			console.log(data)
			data = JSON.stringify(data);
			var jsonobject = JSON.parse(data);
			if (jsonobject.estado == 'ERROR') {

			} else if (jsonobject.estado == 'OK') {	
				var r =0;
				var a =0;
				var v = 0;

				console.log("Usuarios " + jsonobject.datos)
				$.each(jsonobject.datos, function(index, element) {
					switch (element.nivel) {
					case 1:
						r= element.total
						break;
					case 2:
						a= element.total
						break;
					case 3:
						a= element.total
						break;

					default:
						break;
					}

						
				});		
				//home supervisor
				c3.generate({
			        bindto: '#pie',
			        data:{
			            columns: [
			                ['Nivel_Rojo', r],
			                ['Nivel_Amarillo', a],
			                ['Nivel_Verde', v]
			            ],
			            colors:{
			            	Nivel_Rojo: 'rgba(255, 0, 0, 0.8)',
			            	Nivel_Amarillo: 'rgba(255, 255, 0, 0.7)',
			            	Nivel_Verde: 'rgba(0, 128, 0, 0.7)'
			            },
			            names: {
			            	Nivel_Rojo: 'Nivel Rojo: ' + r,
			            	Nivel_Amarillo: 'Nivel Amarillo: '+a,
			            	Nivel_Verde: 'Nivel Verde: ' + v
			              },
			            type : 'pie'
			        },
			        size: {
			        	height: 250
			        	}
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