package py.system.business.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.event.AuthenticationFailureBadCredentialsEvent;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;

@Component
public class AuthenticationEventListener {

	public AuthenticationEventListener() throws Exception {
		super();
	}

	@Autowired
	private LoginAttemptService loginAttemptService;

	@EventListener
	public void authenticationFailed(AuthenticationFailureBadCredentialsEvent event) {

		try {

			String username = (String) event.getAuthentication().getPrincipal();

			Authentication auth = event.getAuthentication();
			WebAuthenticationDetails details = (WebAuthenticationDetails) auth.getDetails();

			//getLoginUsuario(username, "attemp", details.getSessionId(), "", details.getRemoteAddress());

			System.out.println("fallo autenticacion");
			
			loginAttemptService.loginFailed(details.getRemoteAddress());

		} catch (Exception e) {
			try {
				throw e;
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}

	}

}