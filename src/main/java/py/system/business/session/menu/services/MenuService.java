package py.system.business.session.menu.services;

import java.io.Serializable;
import java.util.List;

import py.system.business.session.menu.domain.Menu;

public interface MenuService  {
	
	List<Menu> getAll();
	
	Menu update(Menu entity);
	
	void delete(Menu entity);
	
	Menu getById(Serializable key);

	Menu add(Menu entity);
	
	Menu getMenuById(Integer id);

	List<Menu> getByPerfil(Integer idperfil);

	List<Menu> getAllByPerfil(Integer idperfil);

	List<Menu> getMenuesWithoutPerfiles() throws Exception;
	
}
