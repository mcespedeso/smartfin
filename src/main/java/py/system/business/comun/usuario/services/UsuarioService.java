package py.system.business.comun.usuario.services;

import java.io.Serializable;
import java.util.List;

import py.system.business.comun.usuario.domain.Usuario;
import py.system.business.session.logindata.LoginData;

public interface UsuarioService {

	public List<Usuario> getUsuarios();

	public List<Usuario> getUsuariosByEmpresa(Integer idempresa);

	public Usuario getUsuarioById(Integer id);

	public Usuario getUsuarioByUsername(String username);
	
	public LoginData getLoginUsuario(String username) throws Exception;
	
	public Usuario updateUsuario(Usuario usuario) throws Exception;
	
	public Usuario addUsuario(Usuario usuario) throws Exception;
	
	public void changePassword(Integer idusuario, String password) throws Exception;
	
	public Boolean checkPassword(Integer idusuario, String password) throws Exception;

	public Usuario add(Usuario entity);
	
	public Usuario update(Usuario entity);
	
	public void delete(Usuario entity);
	
	public Usuario getById(Serializable key);
	
	public List<Usuario> getAll();
	
}