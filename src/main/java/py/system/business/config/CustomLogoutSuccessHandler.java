package py.system.business.config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Component;

import nl.bitwalker.useragentutils.UserAgent;

@Component("myLogoutSuccessHandler")
public class CustomLogoutSuccessHandler implements LogoutHandler {

	public CustomLogoutSuccessHandler() throws Exception {
		super();
	}

	@Override
	public void logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
		HttpSession session = request.getSession();
		try {
			if (session != null) {

				Authentication auth = SecurityContextHolder.getContext().getAuthentication();

				UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));

				String ua = "";

				ua += userAgent.toString() + ";";
				ua += userAgent.getBrowser().getName() + ";";
				ua += userAgent.getBrowserVersion().getVersion() + ";";
				ua += userAgent.getOperatingSystem().getDeviceType().getName() + ";";
				ua += userAgent.getOperatingSystem().getName();

				//getLoginUsuario(auth.getName(), "out", request.getSession().getId(), ua, request.getRemoteAddr().toString());

				System.out.println("se deslogueo correctamente");
				
				session.removeAttribute("login");
				
			}

		} catch (Exception e) {
			try {
				throw e;
			} catch (Exception e1) {
				e1.printStackTrace();
			}
		}

	}
}