package py.system.business.session.login.controller;

import java.security.Principal;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import py.system.business.session.login.services.LoginService;
import py.system.business.session.logindata.LoginData;

@Controller
public class LoginController {

	private static final Logger logger = LoggerFactory.getLogger(LoginController.class);

	@Autowired
	LoginService loginService;

	private static final String V_LOGIN = "/login";

	private static final String V_HOME = "/home";

	private static final String V_PASSWORD = "/password";

	private static final String V_INDEX_HOME = "/";

	// @Autowired
	// ActiveUserStore activeUserStore;

	public LoginController() throws Exception {
		super();
	}

	// @RequestMapping(value = "/users-connected", method = RequestMethod.GET)
	// public @ResponseBody List<String> pageUsersConnected(Model model) {
	// return activeUserStore.getUsers();
	// }

	@RequestMapping(value = V_LOGIN, method = RequestMethod.GET)
	public String pageLogin(Model model) {
		logger.info(V_LOGIN);
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth.getName().equals("anonymousUser")) {
			return "/login/login";
		} else {
			return "/home";
		}
	}

	@RequestMapping(value = V_PASSWORD, method = RequestMethod.GET)
	public String pwd(Model model, HttpServletRequest request) {
		logger.info(V_PASSWORD);
		return "/forgotpassword";
	}

	@RequestMapping(value = V_INDEX_HOME, method = RequestMethod.GET)
	public String indexHome(Model model, HttpServletRequest request) {

		String ret = "";

		try {

			logger.info(V_INDEX_HOME);

			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			if (auth.getName().equals("anonymousUser")) {
				ret = "/login/login";
			} else {
				model.addAttribute("menues", loginService.getLoginCache(request).getMenues());
				model.addAttribute("login", loginService.getLoginCache(request));
				ret = "/home";
			}

		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/error/500";
		}

		return ret;

	}

	@RequestMapping(value = V_HOME, method = RequestMethod.GET)
	public String home(Model model, HttpServletRequest request) {

		String ret = "";
		try {

			LoginData login = loginService.getLoginCache(request);
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();

			if (auth.getName().equals("anonymousUser")) {
				ret = "/login/login";
			} else {
				model.addAttribute("login", login);
				ret = "/home";
			}

		} catch (Exception e) {
			e.printStackTrace();
			return "redirect:/error/500";
		}
		return ret;

	}

	@RequestMapping(value = "/404", method = RequestMethod.GET)
	public String page404(Model model, Principal principal) {
		return "error/404";
	}

	@RequestMapping(value = "/403", method = RequestMethod.GET)
	public String page403(Model model) {
		return "error/403";
	}

	@RequestMapping(value = "/500", method = RequestMethod.GET)
	public String page500(Model model) {
		return "error/500";
	}

}