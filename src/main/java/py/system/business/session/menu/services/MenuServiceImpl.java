package py.system.business.session.menu.services;

import java.io.Serializable;
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

import py.system.business.session.clase.domain.Clase;
import py.system.business.session.menu.domain.Menu;


@Service
@Transactional
public class MenuServiceImpl implements MenuService {

	private static final Logger logger = Logger.getLogger(MenuServiceImpl.class.getName());

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@PersistenceContext
	private EntityManager em;

	@Override
	public List<Menu> getAll() {
		List<Menu> menuList = new ArrayList();

		try {
			// administrador
			String sql = " select a.*, b.descripcion as perfil ";
			sql += " from menu a ";
			sql += " join perfil b on b.idperfil = a.idperfil ";
			sql += " where a.tipo = 'M' ";
			sql += " and a.estado = true ";

			List<Map<String, Object>> lista = jdbcTemplate.queryForList(sql);
			for (Map<String, Object> row : lista) {
				Menu menu = new Menu();
				menu.setIdmenu((Integer) row.get("idmenu"));
				menu.setDescripcion((String) row.get("descripcion"));
				menu.setTipo((String) row.get("tipo"));
				menu.setEstado((Boolean) row.get("estado"));
//				menu.setIdperfil((Integer) row.get("idperfil"));
				menu.setOrden((Integer) row.get("orden"));
//				menu.setPerfil((String) row.get("perfil"));

				// findByMenuSuperior
				String sql_p = " select a.*, b.idclase, b.descripcion as nomclase, b.url as url ";
				sql_p += " from menu a ";
				sql_p += " join clase b  on b.idclase = a.idclase";
				sql_p += " where b.estado = true and a.estado and a.menuanterior = " + (Integer) row.get("idmenu");
				sql_p += " order by a.orden ";
				List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(sql_p);
				List<Menu> subMenulist = new ArrayList<Menu>();
				for (Map<String, Object> rowSub : listaSub) {
					if (rowSub.get("tipo").equals("P")) {
						Menu submenu = new Menu();
						submenu.setIdmenu((Integer) rowSub.get("idmenu"));
						submenu.setDescripcion((String) rowSub.get("descripcion"));
						submenu.setTipo((String) rowSub.get("tipo"));
						submenu.setEstado((Boolean) rowSub.get("estado"));
//						submenu.setIdperfil((Integer) row.get("idperfil"));
						submenu.setOrden((Integer) row.get("orden"));
						Clase clase = new Clase();
						clase.setIdclase((Integer) rowSub.get("idclase"));
						clase.setDescripcion((String) rowSub.get("descripcion"));
//						clase.setUrl((String) rowSub.get("url"));
//						submenu.setIdclase(clase.getIdclase());
						submenu.setClase(clase);
						subMenulist.add(submenu);
					}
				}
				if (!subMenulist.isEmpty()) {
					menu.setSubmenulist(subMenulist);
				}
				menuList.add(menu);

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return menuList;
	}

	@Override
	public Menu getMenuById(Integer id) {
		TypedQuery<Menu> query = em.createQuery("SELECT c FROM Menu c where c.idmenu = ?", Menu.class);
		query.setParameter(1, id);
		return query.getSingleResult();
	}

	@Override
	public List<Menu> getByPerfil(Integer idperfil) {
		List<Menu> menuList = new ArrayList();

		logger.info("Buscando el menu para el PERFIL : " + idperfil);
		try {
			// administrador
			String sql = " select * ";
			sql += " from menu ";
			sql += " where tipo = 'M' ";
			sql += " and estado = true ";
			sql += " and idperfil = ? order by orden ";
			List<Map<String, Object>> lista = jdbcTemplate.queryForList(sql, idperfil);
			for (Map<String, Object> row : lista) {
				Menu menu = new Menu();
				menu.setIdmenu((Integer) row.get("idmenu"));
				menu.setDescripcion((String) row.get("descripcion"));
				menu.setTipo((String) row.get("tipo"));
				menu.setEstado((Boolean) row.get("estado"));
				menu.setIdperfil((Integer) row.get("idperfil"));
				menu.setOrden((Integer) row.get("orden"));
				// findByMenuSuperior
				String sql_p = " select a.*, b.idclase, b.descripcion as nomclase, b.url as url ";
				sql_p += " from menu a ";
				sql_p += " join clase b  on b.idclase = a.idclase";
				sql_p += " where b.estado = true and a.estado and a.menuanterior = " + (Integer) row.get("idmenu");
				sql_p += " order by a.orden ";
				List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(sql_p);
				List<Menu> subMenulist = new ArrayList<Menu>();
				for (Map<String, Object> rowSub : listaSub) {
					if (rowSub.get("tipo").equals("P")) {
						Menu submenu = new Menu();
						submenu.setIdmenu((Integer) rowSub.get("idmenu"));
						submenu.setDescripcion((String) rowSub.get("descripcion"));
						submenu.setTipo((String) rowSub.get("tipo"));
						submenu.setEstado((Boolean) rowSub.get("estado"));
						submenu.setIdperfil((Integer) row.get("idperfil"));
						submenu.setOrden((Integer) row.get("orden"));
						Clase clase = new Clase();
						clase.setIdclase((Integer) rowSub.get("idclase"));
						clase.setDescripcion((String) rowSub.get("descripcion"));
						clase.setUrl((String) rowSub.get("url"));
						submenu.setClase(clase);
						subMenulist.add(submenu);
					}
				}
				if (!subMenulist.isEmpty()) {
					menu.setSubmenulist(subMenulist);
				}
				menuList.add(menu);
				logger.info("se seteo " + menuList.size() + " menus");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return menuList;

	}

	@Override
	public Menu add(Menu entity) {

		try {
			entity.setIdmenu(null);
			if (entity.getTipo().equals("M")) {
				entity.setIdclase(null);
				entity.setMenuanterior(null);
			}
			String sql = "INSERT INTO menu " + "( descripcion, estado, tipo, idperfil, idclase, menuanterior, orden) " + "VALUES (?, ?, ?, ?, ?, ? , ?)";

			jdbcTemplate.update(sql, new Object[] { entity.getDescripcion(), entity.getEstado(), entity.getTipo(), entity.getIdperfil(), entity.getIdclase(), entity.getMenuanterior(), entity.getOrden() });

			
		} catch (Exception ex) {
			logger.info("Error al insertar menu " + ex.getClass().getCanonicalName());
			throw ex;

		}
		return entity;
	}

	@Override
	public Menu update(Menu entity) {
		try {

			if (entity.getTipo().equals("M")) {
				entity.setIdclase(null);
				entity.setMenuanterior(null);
			}
			String sql = "update menu SET descripcion = '" + entity.getDescripcion() + "' ," + " estado = " + entity.getEstado() + ", tipo =  '" + entity.getTipo() + "', idperfil= " + entity.getIdperfil() + ", idclase = " + entity.getIdclase() + ", menuanterior= " + entity.getMenuanterior() + ", orden = " + entity.getOrden() + " where idmenu = " + entity.getIdmenu();

			jdbcTemplate.update(sql);

		} catch (Exception ex) {
			logger.info("Error al actualizar menu " + ex.getClass().getCanonicalName());
			throw ex;

		}
		return entity;
	}

	@Override
	public void delete(Menu entity) {
		// TODO Auto-generated method stub

	}

	@Override
	public Menu getById(Serializable key) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Menu> getAllByPerfil(Integer idperfil) {
		List<Menu> menuList = new ArrayList();

		logger.info("Buscando el menu para el PERFIL : " + idperfil);
		try {
			// administrador
			String sql = " select m.*, c.descripcion as clase ";
			sql += " from menu m ";
			sql += " left join clase c on m.idclase = c.idclase ";
			sql += " where m.idperfil = " + idperfil;
			List<Map<String, Object>> lista = jdbcTemplate.queryForList(sql);
			for (Map<String, Object> row : lista) {
				Menu menu = new Menu();
				menu.setIdmenu((Integer) row.get("idmenu"));
				menu.setDescripcion((String) row.get("descripcion"));
				menu.setTipo((String) row.get("tipo"));
				menu.setEstado((Boolean) row.get("estado"));
				menu.setIdperfil((Integer) row.get("idperfil"));
				menu.setOrden((Integer) row.get("orden"));
				menu.setIdclase((Integer) row.get("idclase"));
				Clase clase = new Clase();
				clase.setIdclase((Integer) row.get("idclase"));
				clase.setDescripcion((String) row.get("clase"));
				menu.setClase(clase);
				
				// findByMenuSuperior
				/*String sql_p = " select a.*, b.idclase, b.descripcion as nomclase, b.url as url ";
				sql_p += " from menu a ";
				sql_p += " join clase b  on b.idclase = a.idclase";
				sql_p += " where b.estado = true and a.estado and a.menuanterior = " + (Integer) row.get("idmenu");
				sql_p += " order by a.orden ";
				List<Map<String, Object>> listaSub = jdbcTemplate.queryForList(sql_p);
				List<Menu> subMenulist = new ArrayList<Menu>();
				for (Map<String, Object> rowSub : listaSub) {
					if (rowSub.get("tipo").equals("P")) {
						Menu submenu = new Menu();
						submenu.setIdmenu((Integer) rowSub.get("idmenu"));
						submenu.setDescripcion((String) rowSub.get("descripcion"));
						submenu.setTipo((String) rowSub.get("tipo"));
						submenu.setEstado((Boolean) rowSub.get("estado"));
						submenu.setIdperfil((Integer) row.get("idperfil"));
						submenu.setOrden((Integer) row.get("orden"));
						Clase clase = new Clase();
						clase.setIdclase((Integer) rowSub.get("idclase"));
						clase.setDescripcion((String) rowSub.get("descripcion"));
						clase.setUrl((String) rowSub.get("url"));
						submenu.setClase(clase);
						subMenulist.add(submenu);
					}
				}
				if (!subMenulist.isEmpty()) {
					menu.setSubmenulist(subMenulist);
				}*/
				menuList.add(menu);
				logger.info("se seteo " + menuList.size() + " menus");
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return menuList;
	}

	@Override
	public List<Menu> getMenuesWithoutPerfiles() throws Exception {
		List<Menu> menuList = new ArrayList();

		try {
			// administrador
			String sql = " select a.*, b.descripcion as perfil ";
			sql += " from menu a ";
			sql += " join perfil b on b.idperfil = a.idperfil ";
			sql += " where a.tipo = 'M' ";
			sql += " and a.estado = true ";

			List<Map<String, Object>> lista = jdbcTemplate.queryForList(sql);
			for (Map<String, Object> row : lista) {
				Menu menu = new Menu();
				menu.setIdmenu((Integer) row.get("idmenu"));
				menu.setDescripcion((String) row.get("descripcion"));
				menu.setTipo((String) row.get("tipo"));
				menu.setEstado((Boolean) row.get("estado"));
				menu.setIdperfil((Integer) row.get("idperfil"));
				menu.setOrden((Integer) row.get("orden"));
				menu.setPerfil((String) row.get("perfil"));

				menuList.add(menu);

			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
		return menuList;
	}

}
