package py.system.business.comun.usuario.services;

import java.io.Serializable;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import py.system.business.comun.usuario.domain.Usuario;
import py.system.business.session.login.services.LoginService;
import py.system.business.session.logindata.LoginData;
import py.system.business.session.menu.domain.Menu;
import py.system.business.session.menu.services.MenuService;
import py.system.business.session.perfil.domain.Perfil;
import py.system.business.session.perfil.domain.Perfilusuario;
import py.system.business.session.perfil.services.PerfilService;

@Service
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@PersistenceContext
	private EntityManager em;
	
	@Autowired
	private PerfilService perfilService;
	
	@Autowired
	private MenuService menuService;
	
	@Autowired
	private LoginService loginService;
	
	private static final Logger logger = Logger.getLogger(UsuarioServiceImpl.class.getName());
	
	
	public Long getSecuenceFromName(String name) throws Exception {
		Connection conn = null;
		Long value = new Long(0);
		try {
			String seq = " select nextval('" + name + "') as seq ";
			List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(seq);
			
		for (Map<String, Object> rs : listaSub) {
				value = (Long)rs.get("seq");
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
	public List<Usuario> getUsuarios() {
		
		List<Usuario> ret = new ArrayList<>();
		
		String sql = " select a.idusuario, a.username, a.activated, a.idempleado, a.codupdate, ";
		sql += " a.idversionencuesta, c.descripcion as versionencuesta, ";
		sql += " a.idempresa, b.descripcion as empresa ";
		sql += " from usuario a ";
		sql += " join empresa b on b.idempresa = a.idempresa ";
		sql += " join versionencuesta c on c.idversion = a.idversionencuesta ";
		sql += " where activated = true ";
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		
		for (Map<String, Object> rs : list) {
			Usuario usuario = new Usuario();
			usuario.setIdusuario((Integer)rs.get("idusuario"));
//			usuario.setUsername((String)rs.get("username"));
//			usuario.setActivated((Boolean)rs.get("activated"));
//			usuario.setIdempleado((Integer) rs.get("idempleado"));
//			usuario.setCodupdate((Integer)rs.get("codupdate"));
			
//			Empresa empresa = new Empresa();
//			empresa.setIdempresa((Integer)rs.get("idempresa"));
//			empresa.setDescripcion((String)rs.get("empresa"));
//			usuario.setEmpresa(empresa);
			
			//for
			String sql_pu = " select a.idperfil, a.idusuario, ";
			sql_pu += " b.descripcion as perfil ";
			sql_pu += " from perfilusuario a ";
			sql_pu += " join perfil b on b.idperfil = a.idperfil ";
			sql_pu += " where a.idusuario = ? ";
			List<Perfilusuario> puList = new ArrayList<>();
			List<Map<String, Object>> lPerfilUsuario = jdbcTemplate.queryForList(sql_pu, rs.get("idusuario"));
			for (Map<String, Object> rs1 : lPerfilUsuario) {
				Perfilusuario pu = new Perfilusuario();
				Perfil pe = new Perfil();
				pe.setIdperfil((Integer)rs1.get("idperfil"));
				pe.setDescripcion((String)rs1.get("perfil"));
				pu.setPerfil(pe);
				puList.add(pu);
			}
			
			if (!puList.isEmpty()) {
				usuario.setPerfilusuario(puList);
			}else{
				usuario.setPerfilusuario(null);
			}
			
			ret.add(usuario);
			
		}
		
		return ret;
	}

	@Override
	public Usuario getUsuarioById(Integer idusuario) {
		TypedQuery<Usuario> query = em.createQuery("SELECT c FROM Usuario c where c.idusuario = :idusuario", Usuario.class);
		query.setParameter("idusuario", idusuario);
		return query.getSingleResult();
	}

	@Override
	public Usuario getUsuarioByUsername(String username) {
		TypedQuery<Usuario> query = em.createQuery("SELECT c FROM Usuario c where c.username = :username", Usuario.class);
		query.setParameter("username", username.trim());
		return query.getSingleResult();
	}

	@Override
	public List<Usuario> getUsuariosByEmpresa(Integer idempresa) {
		
		List<Usuario> ret = new ArrayList<>();
		
		String sql = " select a.idusuario, a.usuario, a.activo ";
		sql += " a.idempresa, b.descripcion as empresa ";
		sql += " from usuario a ";
		sql += " join empresa b on b.idempresa = a.idempresa ";
		sql += " where activo = true";
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql);
		
		for (Map<String, Object> rs : list) {
			Usuario usuario = new Usuario();
			usuario.setIdusuario((Integer)rs.get("idusuario"));
			usuario.setUsuario((String)rs.get("username"));
//			usuario.setActivated((Boolean)rs.get("activated"));
//			usuario.setIdempleado((Integer) rs.get("idempleado"));
//			usuario.setCodupdate((Integer)rs.get("codupdate"));
			
//			Empresa empresa = new Empresa();
//			empresa.setIdempresa((Integer)rs.get("idempresa"));
//			empresa.setDescripcion((String)rs.get("empresa"));
//			usuario.setEmpresa(empresa);
			
			//for
			String sql_pu = " select a.idperfil, a.idusuario, ";
			sql_pu += " b.descripcion as perfil ";
			sql_pu += " from perfilusuario a ";
			sql_pu += " join perfil b on b.idperfil = a.idperfil ";
			sql_pu += " where a.idusuario = ? ";
			List<Perfilusuario> puList = new ArrayList<>();
			List<Map<String, Object>> lPerfilUsuario = jdbcTemplate.queryForList(sql_pu, rs.get("idusuario"));
			for (Map<String, Object> rs1 : lPerfilUsuario) {
				Perfilusuario pu = new Perfilusuario();
				//Usuario usuario_p = new Usuario();
				//usuario_p.setIdusuario((Integer)rs1.get("idusuario"));
				//pu.setUsuario(usuario_p);
				Perfil pe = new Perfil();
				pe.setIdperfil((Integer)rs1.get("idperfil"));
				pe.setDescripcion((String)rs1.get("perfil"));
				pu.setPerfil(pe);
				puList.add(pu);
			}
			
			if (!puList.isEmpty()) {
				usuario.setPerfilusuario(puList);
			}else{
				usuario.setPerfilusuario(null);
			}
			
			ret.add(usuario);
			
		}
		
		return ret;
		
	}

	@Override
	public LoginData getLoginUsuario(String username) throws Exception {
		
		String sql = "select a.*, b.descripcion as empresa ";
		sql += " from usuario a  ";
		sql += " left join empresa b on b.idempresa = a.idempresa  ";
		sql += " where usuario = ? ";
		
		LoginData loginData = new LoginData();
		
		List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, username);
		
		for (Map<String, Object> row : list) {
			Usuario usuarioData = new Usuario();
			usuarioData.setIdusuario((Integer) row.get("idusuario"));
			usuarioData.setUsuario((String) row.get("usuario"));
//			usuarioData.setActivated((Boolean) row.get("activated"));
//			usuarioData.setIdempleado((Integer) row.get("idempleado"));
//			usuarioData.setCodupdate((Integer) row.get("codupdate"));

//			Empresa empresa = new Empresa();
//			empresa.setIdempresa((Integer) row.get("idempresa"));
//			empresa.setDescripcion((String) row.get("empresa"));
//			usuarioData.setEmpresa(empresa);
			
//			loginData.setEmpresa(empresa);
			
			//for
			String sql_pu = " select a.idperfil, a.idusuario, ";
			sql_pu += " b.descripcion as perfil ";
			sql_pu += " from perfil_usuario a ";
			sql_pu += " join perfil b on b.idperfil = a.idperfil ";
			sql_pu += " where a.idusuario = ? ";
			List<Perfilusuario> puList = new ArrayList<>();
			List<Perfil> perfilList = new ArrayList<>();
			List<Map<String, Object>> lPerfilUsuario = jdbcTemplate.queryForList(sql_pu, usuarioData.getIdusuario());
			for (Map<String, Object> rs1 : lPerfilUsuario) {
				Perfilusuario pu = new Perfilusuario();
				//Usuario usuario_p = new Usuario();
				//usuario_p.setIdusuario((Integer)rs1.get("idusuario"));
				//pu.setUsuario(usuario_p);
				Perfil pe = new Perfil();
				pe.setIdperfil((Integer)rs1.get("idperfil"));
				pe.setDescripcion((String)rs1.get("perfil"));
				pu.setPerfil(pe);
				perfilList.add(pe);
				puList.add(pu);
			}
			
			if (!puList.isEmpty()) {
				logger.info("setenado perfil al usuario");
				usuarioData.setPerfilusuario(puList);
			}else{
				usuarioData.setPerfilusuario(null);
			}
			loginData.setUsuario(usuarioData);
			loginData.setPerfiles(perfilList);
			
			//menu por usuario
			for (Perfilusuario p1 : puList) {
				logger.info("setenado menu al usuario");
				loginData.setPerfilactual(p1.getPerfil());
				List<Menu> listMenues = menuService.getByPerfil(p1.getPerfil().getIdperfil());
				loginData.setMenues(listMenues);
				break;
			}
		}
		return loginData;
		
	}
	
	

	@Override
	public Usuario add(Usuario entity) {
		try {
            em.persist(entity);
            return entity;
        } catch (Exception ex) {
        	logger.info("Error al agregar usuario " + ex.getClass().getCanonicalName());
        	throw ex;
        }
	}

	@Override
	public Usuario update(Usuario entity) {
		try {
            em.merge(entity);
            return entity;
        } catch (Exception e) {
        	logger.info("Error al eliminar usuario " + e.getClass().getCanonicalName());
        	throw e;
        }
	}

	@Override
	public void delete(Usuario entity) {
		try {
	          
	       if (!em.contains(entity)) {
	         entity = em.merge(entity);
	       }
	         em.remove(entity);
	   } catch (Exception e) {
	       logger.info("Error al eliminar usuario " + e.getClass().getCanonicalName());      
	    }
		
	}

	@Override
	public Usuario getById(Serializable key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Usuario> getAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Usuario addUsuario(Usuario u) throws Exception{
		
		try{
			
//			u.setPassmd5(MD5Generator.MD5(u.getClave()));
//			u.setPassword(loginService.getHashPassword(u.getClave()));
//
//			Long idusuario = getSecuenceFromName("usuarios_idusuario_seq");
//			
//			System.out.println("Idusuario: " + idusuario);
//			
//			if(idusuario.intValue() != 0){
//				
//				//define sql String
//				String sqlInsert = " insert into usuario (idusuario, username, password, idversionencuesta, activated, " ;
//				sqlInsert += "idempresa, passmd5 ) ";
//				sqlInsert += " values (?,?,?,?,?,?,?) ";
//				
//				Object[] params = new Object[] {idusuario.intValue(), u.getUsername(), u.getPassword(), u.getVersionencuesta().getIdversion(),
//						u.getActivated(), u.getEmpresa().getIdempresa(), u.getPassmd5()};
//				
//				//define types for sql insert
//				int[] types = new int[] {Types.INTEGER, Types.VARCHAR, Types.VARCHAR, Types.INTEGER, Types.BOOLEAN ,
//						Types.INTEGER, Types.VARCHAR};
//				//insert values to jdbcTemplate
//				jdbcTemplate.update(sqlInsert, params, types);
//				
//				
//				//agregar pefil usuario
//				for (Perfilusuario perfil : u.getPerfilusuario()) {		
//					String sqlInsert2 = " insert into perfilusuario (idusuario, idperfil ) ";
//					sqlInsert2 += " values (?,?) ";
//					
//					Object[] params2 = new Object[] {idusuario.intValue(), perfil.getPerfil().getIdperfil()};
//					
//					//define types for sql insert
//					int[] types2 = new int[] {Types.INTEGER, Types.INTEGER};
//					//insert values to jdbcTemplate
//					jdbcTemplate.update(sqlInsert2, params2, types2);
//				}
//				
//				String sqlInsert3 = " insert into user_authority  ";
//				sqlInsert3 += " values (?,?) ";
//				
//				Object[] params3 = new Object[] {idusuario.intValue(), "ROLE_USER"};
//				
//				//define types for sql insert
//				int[] types3 = new int[] {Types.INTEGER, Types.VARCHAR};
//				//insert values to jdbcTemplate
//				jdbcTemplate.update(sqlInsert3, params3, types3);
//				
//			}
			
			
		}catch (Exception e) {
			throw e;
		}
		
		return u;
	}

	@Override
	public Usuario updateUsuario(Usuario u) throws Exception{
		Usuario u2 = getUsuarioById(u.getIdusuario());
//		u2.setUsername(u.getUsername());
//		u2.setEmpresa(u.getEmpresa());
//		u2.setVersionencuesta(u.getVersionencuesta());
//		u2.setCodupdate(u2.getCodupdate()+1);
//		u2.setActivated(u.getActivated());
//		u2.setPerfilusuario(u.getPerfilusuario());
//		u2 = update(u2);
//		perfilService.deletePerilByUser(u2.getIdusuario());
//		//agregar pefil usuario
//		for (Perfilusuario perfil : u.getPerfilusuario()) {		
//			String sqlInsert2 = " insert into perfilusuario (idusuario, idperfil ) ";
//			sqlInsert2 += " values (?,?) ";
//			Object[] params2 = new Object[] {u2.getIdusuario(), perfil.getPerfil().getIdperfil()};
//			//define types for sql insert
//			int[] types2 = new int[] {Types.INTEGER, Types.INTEGER};
//			//insert values to jdbcTemplate
//			jdbcTemplate.update(sqlInsert2, params2, types2);
//		}
		return u2;
	}

	@Override
	public void changePassword(Integer idusuario, String password) throws Exception {
		try{
			Usuario u = getUsuarioById(idusuario);
			
//			u.setPassmd5(MD5Generator.MD5(password));
//			u.setPassword(loginService.getHashPassword(password));
			
			update(u);
//			System.out.println("usuario " + u.getUsername() + " actualizado");
			
		}catch (Exception e) {
			e.printStackTrace();
			throw e;
			
		}
	
		
	}

	@Override
	public Boolean checkPassword(Integer idusuario, String password) throws Exception {
		Boolean ban = false;
		try{
			Usuario u = getUsuarioById(idusuario);
//			ban = loginService.checkHashPassword(u.getPassword() ,password);
			
		}catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return ban;
	}
}