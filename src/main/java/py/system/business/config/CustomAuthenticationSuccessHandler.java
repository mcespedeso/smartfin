package py.system.business.config;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.RedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import nl.bitwalker.useragentutils.UserAgent;
import py.system.business.comun.usuario.services.UsuarioService;
import py.system.business.session.logindata.LoginData;

@Component("customAuthenticationSuccessHandler")
public class CustomAuthenticationSuccessHandler implements AuthenticationSuccessHandler {

	public CustomAuthenticationSuccessHandler() throws Exception {
		super();
	}

	@Autowired
	ActiveUserStore activeUserStore;
	
	@Autowired
	LoginAttemptService loginAttemptService;
	
	@Autowired
	UsuarioService usuarioService;

	private RedirectStrategy redirectStrategy = new DefaultRedirectStrategy();

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
		try {
			
			HttpSession session = request.getSession(false);
			
			if (session != null) {
				
				LoggedUser user = new LoggedUser(authentication.getName(), activeUserStore);

				UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));

				String ua = "";
				
				ua += userAgent.toString() + ";";
				ua +=userAgent.getBrowser().getName()+ ";";
				ua +=userAgent.getBrowserVersion().getVersion()+ ";";
				ua +=userAgent.getOperatingSystem().getDeviceType().getName()+ ";";
				ua +=userAgent.getOperatingSystem().getName();
				
				LoginData loginData = usuarioService.getLoginUsuario(user.getUsername());
				session.setAttribute("logindata", loginData );
				
				
				
				boolean b = loginAttemptService.isBlocked(request.getRemoteAddr().toString());
				
				if (b) {
					System.out.println("la ip nro. " + request.getRemoteAddr().toString() + " esta bloqueada");
					
					request.getSession().setAttribute("message", "error bloqueado");
					
					redirectStrategy.sendRedirect(request, response, "/403");
				}else {
					
					System.out.println("logueado correctamente");
					
					redirectStrategy.sendRedirect(request, response, "/home");
				}


			}
		} catch (Exception e) {
			e.printStackTrace();
			try {
				throw e;
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}
	}

}