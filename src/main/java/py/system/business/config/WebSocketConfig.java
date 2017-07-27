package py.system.business.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
// import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;

/**
 * Habilitar y configurar Stomp sobre WebSocket.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

	/**
	 * Registro Stomp endpoints: la url para abrir la conexión de WebSocket.
	 */
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {

		// Registra el endpoint "/ws", habilitando el protocolo SockJS.
		// Se utiliza SockJS (tanto cliente como servidor) para permitir
		// opciones de mensajería si WebSocket no está disponible.
		registry.addEndpoint("/ws").withSockJS();
		return;
	}
	
	@Override
    public void configureClientOutboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(1);
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.taskExecutor().corePoolSize(1);
    }

//	 /**
//	 * Configurar el agente de mensajes.
//	 */
//	 @Override
//	 public void configureMessageBroker(MessageBrokerRegistry config) {
//	
//	 // Habilita un broker de mensajes basado en memoria simple para enviar
//	 // mensajes al
//	 // cliente en destinos prefijados con "/queue".
//	 // El intermediario de mensajes sencillos gestiona solicitudes de
//	 // suscripción de clientes registrados
//	 // en la base de datos, y transmite mensajes a clientes conectados con
//	 // destinos coincidentes.
//	 config.enableSimpleBroker("/queue");
//	
//	 return;
//	 }

} // class WebSocketConfig
