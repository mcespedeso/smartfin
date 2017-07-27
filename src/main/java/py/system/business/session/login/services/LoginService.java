package py.system.business.session.login.services;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import py.system.business.comun.empresa.domain.Empresa;
import py.system.business.session.logindata.LoginData;
import py.system.business.session.perfil.domain.Perfil;


public interface LoginService {

	public LoginData getLoginCache(HttpServletRequest request) throws Exception;

	public LoginData getLoginUsuario(String username, String string, String id, String ua) throws Exception;
	
	public void actualizarCache() throws Exception;
	
	public List<Empresa> getAllEmpresas() throws Exception;
	
	public List<Perfil> getAllPerfiles() throws Exception;
	
	public Long getSecuenceFromName(String name) throws Exception;
	
	public Long getLastSecuenceFromName(String name) throws Exception;
	
	public String getHashPassword(String pass) throws Exception;
	
	public Boolean checkHashPassword(String pass, String pass2) throws Exception;

	public List<String> getUsersConnected(HttpServletRequest request) throws Exception;
	
}
