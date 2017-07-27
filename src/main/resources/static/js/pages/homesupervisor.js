var context = window.location.pathname.substring(0, window.location.pathname.indexOf("/", 2));

$(document).ready(function(){
	
	
	var tour = new Tour({
        steps: [{

                element: "#div1",
                title: "Title of my step",
                content: "Introduce new users to your product by walking them through it step by step.",
                placement: "top",
                backdrop: true,
                backdropContainer: '#wrapper',
                onShown: function (tour){
                    $('body').addClass('tour-open')
                },
                onHidden: function (tour){
                    $('body').removeClass('tour-close')
                }
            },
            {
                element: "#div2",
                title: "Title of my step",
                content: "Content of my step",
                placement: "top",
                backdrop: true,
                backdropContainer: '#wrapper',
                onShown: function (tour){
                    $('body').addClass('tour-open')
                },
                onHidden: function (tour){
                    $('body').removeClass('tour-close')
                }
            },
            {
                element: "#div3",
                title: "Title of my step",
                content: "Introduce new users to your product by walking them through it step by step.",
                placement: "top",
                backdrop: true,
                backdropContainer: '#wrapper',
                onShown: function (tour){
                    $('body').addClass('tour-open')
                },
                onHidden: function (tour){
                    $('body').removeClass('tour-close')
                }
            },
            {
                element: "#div4",
                title: "Title of my step",
                content: "Introduce new users to your product by walking them through it step by step.",
                placement: "top",
                backdrop: true,
                backdropContainer: '#wrapper',
                onShown: function (tour){
                    $('body').addClass('tour-open')
                },
                onHidden: function (tour){
                    $('body').removeClass('tour-close')
                }
            }
        ]});

    // Initialize the tour
    tour.init();

    $('.startTour').click(function(){
        tour.restart();

        // Start the tour
        // tour.start();
    })
	
	/////
	
	
	localStorage.usuario = sjcl.encrypt(encrypt,pojoUsuario2($("#idusuario").val(), $("#username").val(), $("#idempresa").val(), $("#idversion").val()));
	localStorage.idioma =$("#idioma").val();
	
	getNiveles()
	getAllEventos()
	getIndicadores()
	getEncuestados();
	getPublicEventos()
	
	
	
    
    /* initialize the calendar
    -----------------------------------------------------------------*/
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
    	header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        eventClick: function(calEvent, jsEvent, view) {

        	//editar(calEvent)
        	$("#modalBody").text("")
        	$("#modalTitle").text(calEvent.title)
        	var body = '<h4>'
        	body+= "<strong>Empresa: </strong>"+calEvent.id
        	body+= '</h4>'
        	body+= '<br/>'	
        	if(calEvent.textColor == 1){
        		estado = "Pendiente"
        	}else if(calEvent.textColor == 5){
        		estado = "Reportado"
        	}else if(calEvent.textColor == 4){
        		estado = "Terminado"
        	}
        	body+= "<strong>Estado: </strong>"+estado
        		
        	$("#modalBody").append(body)
        	$("#myModal6").modal()
        	
        	
        	

        }
       
    });
	
});

//cantidad encuestados
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
					                label: "Pobreza Extrema",
					                backgroundColor: 'rgba(255, 0, 0, 0.8)',
					                borderColor: "rgb(255, 0, 0)",
					                data: data1
					            },
					            {
					                label: "Pobreza",
					                backgroundColor: 'rgba(255, 255, 0, 0.7)',
					                borderColor: "rgb(255, 255, 0)",
					                data: data2
					            },
					            {
					                label: "No Pobreza",
					                backgroundColor: 'rgba(0, 128, 0, 0.7)',
					                borderColor: "rgb(0, 128, 0)",
					                data: data3
					            }
					        ]
					    };

					    var barOptions = {
					        responsive: true,
					        scales: {
			                    xAxes: [{
			                            ticks: {
			                                beginAtZero: true,
			                                fontFamily: "'Open Sans Bold', sans-serif",
			                                fontSize: 12
			                            },
			                            scaleLabel: {
			                                display: false
			                            },
			                            gridLines: {
			                            },
			                            stacked: true
			                        }],
			                    yAxes: [{
			                            barThickness: 20,
			                            gridLines: {
			                                display: false,
			                                color: "#fff",
			                                zeroLineColor: "#fff",
			                                zeroLineWidth: 0
			                            },
			                            ticks: {
			                                fontFamily: "'Open Sans Bold', sans-serif",
			                                fontSize: 14
			                            },
			                            stacked: true
			                        }]
			                },
					        legend: {
					            labels: {
					                // This more specific font property overrides the global property
					                fontSize : 16
					            }
					        }
					    };
				
					    if(jsonobject.datos.length > 0){
					    	$(".sindatos").text("")
					    	var ctx2 = document.getElementById("barChart").getContext("2d");
					    	new Chart(ctx2, {type: 'horizontalBar', data: barData, options:barOptions});
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
		                		  id: element.empresa.descripcion,
		                		  title: element.descripcion,
		                		  allDay: true,
		                		  start: Date.parse(element.fechadesde),
		                		  /*url: 'http://google.com/',*/
		                		};
		                
		                if(element.fechahasta != element.fechadesde ){
		                	myEvent.end = Date.parse(element.fechahasta)
		                }
		                if(element.estados.idestado == 1){
		                	myEvent.color = "#f8ac59"
		                		myEvent.textColor = "1"
		                }else if(element.estados.idestado == 4){
		                	myEvent.color = "#1ab394"
		                	myEvent.textColor = "4"
		                }else if(element.estados.idestado == 5){
		                	myEvent.color = "#1c84c6"
			                	myEvent.textColor = "5"
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

//eventos del calendario
function getPublicEventos(){
	blockScreen();
	$.ajax({
		type : "GET",
		url : context + "/private/calendario/public",		
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
		                		  id: element.empresa.descripcion,
		                		  title: element.descripcion,
		                		  allDay: true,
		                		  start: Date.parse(element.fechadesde),
		                		  /*url: 'http://google.com/',*/
		                		};
		                
		                if(element.fechahasta != element.fechadesde ){
		                	myEvent.end = Date.parse(element.fechahasta)
		                }
		                if(element.estados.idestado == 1){
		                	myEvent.color = "#f8ac59"
		                		myEvent.textColor = "1"
		                }else if(element.estados.idestado == 4){
		                	myEvent.color = "#1ab394"
		                	myEvent.textColor = "4"
		                }else if(element.estados.idestado == 5){
		                	myEvent.color = "#1c84c6"
			                	myEvent.textColor = "5"
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

				$.each(jsonobject.datos, function(index, element) {
					switch (element.nivel) {
					case 1:
						r= element.total
						break;
					case 2:
						a= element.total
						break;
					case 3:
						v= element.total
						break;

					default:
						break;
					}

						
				});		
				if(jsonobject.datos.length > 0){
					
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
							height: 330
						}
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
}