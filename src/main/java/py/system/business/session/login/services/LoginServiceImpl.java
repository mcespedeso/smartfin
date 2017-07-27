package py.system.business.session.login.services;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import py.system.business.comun.empresa.domain.Empresa;
import py.system.business.comun.usuario.domain.Usuario;
import py.system.business.session.logindata.LoginData;
import py.system.business.session.perfil.domain.Perfil;



@Service
public class LoginServiceImpl implements LoginService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

//	@Autowired
//	private EmpresaService empresaService;
//
//	@Autowired
//	private PerfilService perfilService;


	private static List<Empresa> listEmpresa = new ArrayList<Empresa>();
	private static List<Perfil> listperfiles = new ArrayList<Perfil>();

	@Override
	public LoginData getLoginCache(HttpServletRequest request) {
		return (LoginData) request.getSession().getAttribute("logindata");
	}

	@Override
	public LoginData getLoginUsuario(String username, String string, String id, String ua) throws Exception {
		String sql = " select a.*, b.nombre as empresa, c.descripcion as version ";
		sql += " from usuario a  ";
		sql += " join empresa b on b.idempresa = a.idempresa ";
		sql += " where username = ? ";

		LoginData loginData = new LoginData();

		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, username);

		for (Map<String, Object> row : list) {
			Usuario usuarioData = new Usuario();
			usuarioData.setIdusuario((Integer) row.get("idusuario"));
//			usuarioData.setUsername((String) row.get("username"));
//			usuarioData.setActivated((Boolean) row.get("actived"));
//			usuarioData.setIdempleado((Integer) row.get("idempleado"));
//			usuarioData.setCodupdate((Integer) row.get("codupdate"));

			Empresa empresa = new Empresa();
//			empresa.setIdempresa((Integer) row.get("idempresa"));
			empresa.setDescripcion((String) row.get("empresa"));
			usuarioData.setEmpresa(empresa);


			loginData.setUsuario(usuarioData);
			loginData.setEmpresa(empresa);
		}
		return loginData;
	}

	@Override
	public void actualizarCache() throws Exception {
		// logger.info("User accessing to {} ", "actualizarCache");
		listEmpresa.clear();
		getAllEmpresas();
	}

	@Override
	public List<Empresa> getAllEmpresas() throws Exception {
		if (listEmpresa.size() <= 0) {
//			this.listEmpresa = empresaService.getEmpresas();
			// logger.info("Retrieve empresa {} ", this.listEmpresa.size());
		} else {
			// logger.info("ya existe en el cache empresa : " +
			// this.listEmpresa.size());
		}
		return this.listEmpresa;
	}


	@Override
	public List<Perfil> getAllPerfiles() throws Exception {
		if (listperfiles.size() <= 0) {
			//this.listperfiles = perfilService.getPerfiles();
			// logger.info("Retrieve perfiles {} ", this.listperfiles.size());
		} else {
			// logger.info("ya existe en el cache perfiles : " +
			// this.listperfiles.size());
		}
		return this.listperfiles;
	}

	@Override
	public Long getSecuenceFromName(String name) throws Exception {

		Connection conn = null;
		Long value = new Long(0);
		try {
			String seq = " select nextval('" + name + "') as seq ";
			List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(seq);

			for (Map<String, Object> rs : listaSub) {
				value = (Long) rs.get("seq");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		return value;

	}

	@Override
	public Long getLastSecuenceFromName(String name) throws Exception {
		Connection conn = null;
		Long value = new Long(0);
		try {
			String seq = " select last_value as seq from " + name;
			List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(seq);

			for (Map<String, Object> rs : listaSub) {
				value = (Long) rs.get("seq");
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			if (conn != null) {
				conn.close();
			}
		}
		return value;
	}

	@Override
	public String getHashPassword(String pass) {
		BCryptPasswordEncoder cryp = new BCryptPasswordEncoder();
		return cryp.encode(pass);
	}

	@Autowired
	@Qualifier("sessionRegistry")
	private SessionRegistry sessionRegistry;

	@Override
	public List<String> getUsersConnected(HttpServletRequest request) throws Exception {

		List<String> usersNamesList = new ArrayList<String>();

		try {
			
			List<Object> principals = sessionRegistry.getAllPrincipals();

			for (Object principal : principals) {
				if (principal instanceof User) {
					usersNamesList.add(((User) principal).getUsername());
					System.out.println("los usuarios conectados son " + ((User) principal).getUsername());
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return usersNamesList;

	}

	@Override
	public Boolean checkHashPassword(String pass, String pass2) throws Exception {
		BCryptPasswordEncoder cryp = new BCryptPasswordEncoder();
		
		if (cryp.matches(pass2,pass)) {
			return  true;
		} else {
			return  false;
		
		}
	}

}
