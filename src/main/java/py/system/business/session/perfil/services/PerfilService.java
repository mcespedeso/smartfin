package py.system.business.session.perfil.services;

import java.io.Serializable;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import py.system.business.session.perfil.domain.Perfil;
import py.system.business.session.perfil.domain.Perfilusuario;

public interface PerfilService {

	public Perfil getById(Serializable idpefil);
	
	public List<Perfil> getAll();
	
	public Perfil add(Perfil entity);
	
	public List<Perfil> getPerfiles() throws Exception;

	public Perfil getPerfilById(String id) throws Exception;

	public List<Perfil> getAllPerfiles() throws Exception;
	
	public void AddPerfilUsuario(Perfilusuario perfilusuario) throws Exception;
	
	public Boolean ifAsigned(Perfilusuario perfilusuario) throws Exception;
	
	public void deletePerilByUser(Integer idusuario) throws Exception;
	
	public void validarPerfilUsuario(HttpServletRequest request, String url) throws Exception;

}
