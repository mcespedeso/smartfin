package py.system.business.session.perfil.services;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.servlet.http.HttpServletRequest;
import javax.sql.DataSource;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import py.system.business.comun.usuario.domain.Usuario;
import py.system.business.exceptions.CustomMessageException;
import py.system.business.session.login.services.LoginService;
import py.system.business.session.perfil.domain.Perfil;
import py.system.business.session.perfil.domain.Perfilusuario;

@Service
@Transactional
public class PerfilServiceImpl implements PerfilService {

	private static final Logger logger = LoggerFactory.getLogger(PerfilServiceImpl.class);

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DataSource datasource;

	@Autowired
	private LoginService loginService;

	@PersistenceContext
	private EntityManager em;

	@Override
	public List<Perfil> getPerfiles() {
		TypedQuery<Perfil> query = em.createQuery("SELECT c FROM Perfil c", Perfil.class);
		return query.getResultList();
	}

	@Override
	public Perfil getPerfilById(String id) {
		TypedQuery<Perfil> query = em.createQuery("SELECT c FROM Perfil c where c.idperfil = ?", Perfil.class);
		query.setParameter(1, Integer.parseInt(id));
		return query.getSingleResult();
	}

	@Override
	public List<Perfil> getAllPerfiles() throws Exception {
		List<Perfil> listperfiles = new ArrayList<Perfil>();
		String sql = " select * from perfil order by idperfil ";
		List<Map<String, Object>> ret = jdbcTemplate.queryForList(sql);
		for (Map<String, Object> rs : ret) {
			Perfil pe = new Perfil();
			pe.setIdperfil((Integer) rs.get("idperfil"));
			pe.setDescripcion((String) rs.get("descripcion"));
			listperfiles.add(pe);
		}
		logger.info("Retrieve perfiles {} ", listperfiles.size());

		return listperfiles;
	}

	@Override
	@Transactional
	public void AddPerfilUsuario(Perfilusuario perfilusuario) {
		try {

			String sql = "INSERT INTO perfilusuario " + "(idperfil, idusuario) VALUES (?, ?)";

			jdbcTemplate.update(sql, new Object[] { perfilusuario.getPerfil().getIdperfil(), perfilusuario.getUsuario().getIdusuario() });

		} catch (DuplicateKeyException e) {
			logger.info("Ya existe ese perfil para el usuario ");

		} catch (Exception ex) {
			logger.info("Error al perfilusuario " + ex.getClass().getCanonicalName());
			throw ex;

		}

	}

	@Override
	public Boolean ifAsigned(Perfilusuario perfilusuario) {
		boolean ban = false;

		try {
			String sql = "Select * from perfilusuario where idperfil = :idperfil and idusuario= :idusuario ";

			Map param = new HashMap();
			param.put("idperfil", perfilusuario.getPerfil().getIdperfil());
//			param.put("idusuario", perfilusuario.getUsuario().getIdempleado());

			List<Map<String, Object>> list = jdbcTemplate.queryForList(sql, param);

			for (Map<String, Object> rs : list) {
				ban = true;
			}

		} catch (Exception e) {
			logger.error("Error al ifAsigned " + e.getClass().getCanonicalName());
			throw e;
		}
		return ban;
	}

	@Override
	public void deletePerilByUser(Integer idusuario) {
		try {
			System.out.println("Eliminando perfiles del usuario : " + idusuario);

			String sql = "delete from perfilusuario WHERE idusuario = ?";

			jdbcTemplate.update(sql, new Object[] { idusuario });

		} catch (Exception e) {
			logger.error("Error al ifAsigned " + e.getClass().getCanonicalName());
			throw e;
		}

	}

	@Override
	public Perfil add(Perfil entity) {
		try {
			em.persist(entity);
			return entity;
		} catch (Exception ex) {
			logger.info("Error al agregar perfil " + ex.getClass().getCanonicalName());
			throw ex;

		}
	}


	@Override
	public Perfil getById(Serializable idpefil) {
		TypedQuery<Perfil> query = em.createQuery("SELECT c FROM Perfil c where c.idperfil = :idpefil", Perfil.class);
		query.setParameter("idpefil", idpefil);
		return query.getSingleResult();
	}

	@Override
	public List<Perfil> getAll() {
		TypedQuery<Perfil> query = em.createQuery("SELECT c FROM Perfil c", Perfil.class);
		return query.getResultList();
	}

	@Override
	public void validarPerfilUsuario(HttpServletRequest request, String url) throws Exception {

		boolean ban = false;
		Connection conn = datasource.getConnection();
		Integer idprograma = 0;

		Usuario usuario = loginService.getLoginCache(request).getUsuario();	

		String sql = "select idclase from clase where upper('/'||url) = upper(?) ";
		PreparedStatement ps = conn.prepareStatement(sql);
		ps.setString(1, url);
		ResultSet rs = ps.executeQuery();
		while (rs.next()) {
			idprograma = rs.getInt("idclase");
		}

		String sql3 = " select a.idusuario, b.username, a.idperfil, c.descripcion  ";
		sql3 += " from perfilusuario a ";
		sql3 += " join usuario b on b.idusuario = a.idusuario ";
		sql3 += " join perfil c on c.idperfil = a.idperfil ";
		sql3 += " where a.idusuario = ? and a.idperfil in (select idperfil from menu where idclase = ?) ";

		PreparedStatement ps3 = conn.prepareStatement(sql3);
		ps3.setInt(1, usuario.getIdusuario());
		ps3.setInt(2, idprograma);
		ResultSet rs3 = ps3.executeQuery();
		while (rs3.next()) {
			ban = true;
			break;
		}

		System.out.println("Empleado " + usuario.getIdusuario() + " ingresa al programa cod. " + idprograma + " ,validacion: " + ban);

		if (conn != null) {
			conn.close();
		}

		if (!ban) {
			throw new CustomMessageException("No tiene acceso a este perfil");
		}

	}

}
