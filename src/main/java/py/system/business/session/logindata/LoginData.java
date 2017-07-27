package py.system.business.session.logindata;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.List;

import py.system.business.comun.empresa.domain.Empresa;
import py.system.business.comun.sucursal.domain.Sucursal;
import py.system.business.comun.usuario.domain.Usuario;
import py.system.business.session.menu.domain.Menu;
import py.system.business.session.perfil.domain.Perfil;
import py.system.business.tesoreria.caja.domain.Caja;
import py.system.business.tesoreria.moneda.domain.Moneda;

public class LoginData implements Serializable {

	private Date fecha;
	private Timestamp fechahora;
	private Perfil perfil;
	private Usuario usuario;
	private Empresa empresa;
	private Sucursal sucursal;
	private Moneda moneda;
	private Caja caja;
	private List<Perfil> perfiles;
	
	private List<Menu> menues;
	
	private Perfil perfilactual;
	

	public List<Perfil> getPerfiles() {
		return perfiles;
	}

	public void setPerfiles(List<Perfil> perfiles) {
		this.perfiles = perfiles;
	}

	public List<Menu> getMenues() {
		return menues;
	}

	public void setMenues(List<Menu> menues) {
		this.menues = menues;
	}

	public Perfil getPerfilactual() {
		return perfilactual;
	}

	public void setPerfilactual(Perfil perfilactual) {
		this.perfilactual = perfilactual;
	}

	public Double getRedondeo(Double valor) {
		BigDecimal bd = new BigDecimal(valor);
		bd = bd.setScale(0, BigDecimal.ROUND_HALF_UP);
		return bd.doubleValue();
	}
	
	/**
	 * @return
	 */
	public Date getFecha() {
		return fecha;
	}

	/**
	 * @param date
	 */
	public void setFecha(Date date) {
		fecha = date;
	}

	/**
	 * @return
	 */
	public Usuario getUsuario() {
		return usuario;
	}

	/**
	 * @param data
	 */
	public void setUsuario(Usuario data) {
		usuario = data;
	}

	public Perfil getPerfil() {
		return perfil;
	}

	public void setPerfil(Perfil perfil) {
		this.perfil = perfil;
	}

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}

	public Sucursal getSucursal() {
		return sucursal;
	}

	public void setSucursal(Sucursal sucursal) {
		this.sucursal = sucursal;
	}

	public Moneda getMoneda() {
		return moneda;
	}

	public void setMoneda(Moneda moneda) {
		this.moneda = moneda;
	}

	public Timestamp getFechahora() {
		return fechahora;
	}

	public void setFechahora(Timestamp fechahora) {
		this.fechahora = fechahora;
	}

	public Caja getCaja() {
		return caja;
	}

	public void setCaja(Caja caja) {
		this.caja = caja;
	}
}