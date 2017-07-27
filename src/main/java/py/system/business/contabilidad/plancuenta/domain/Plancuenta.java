package py.system.business.contabilidad.plancuenta.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import py.system.business.comun.empresa.domain.Empresa;
import py.system.business.comun.sucursal.domain.Sucursal;

@Entity
@Table(name = "plancuenta")
//@NamedQueries( { @NamedQuery(name = "plancuentafindAll", query = "select p from Plancuenta p order by p.rubro "), 
//@NamedQuery(name = "plancuentafindByEstado", query = "select p from Plancuenta p where p.activo = :pactivo order by p.rubro"),
//@NamedQuery(name = "plancuentafindByEstadoAsentable", query = "select p from Plancuenta p where p.activo = :pactivo AND p.asentable = :pasentable order by p.rubro"), 
//@NamedQuery(name = "plancuentafindById", query = "select p from Plancuenta p where p.idplancuenta = :pidplancuenta"),
//@NamedQuery(name = "plancuentafindByRubro", query = "select p from Plancuenta p where p.rubro = :prubro ") })
public class Plancuenta implements Serializable {
	
	public Plancuenta() {
		
	}

	@Id
	@Column(name = "idplancuenta")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "plancuenta_idplancuenta_seq")
	@SequenceGenerator(name = "plancuenta_idplancuenta_seq", sequenceName = "plancuenta_idplancuenta_seq", allocationSize = 1)
	private Integer idplancuenta;

	@Column(name = "descripcion")
	private String descripcion;
	
	@Column(name = "caja")
	private Boolean caja;

	@Column(name = "rubro")
	private String rubro;

	@Column(name = "asentable")
	private Boolean asentable;

	@Column(name = "nivel", columnDefinition="int2", nullable=false)
	private Integer nivel;

	@Column(name = "activo", nullable=false)
	private Boolean activo;

	@Column(name = "tipo", nullable=false)
	private String tipo;

	@ManyToOne(targetEntity = Empresa.class)
	@JoinColumn(name = "idempresa", nullable=false)
	Empresa empresa;

	@ManyToOne(targetEntity = Sucursal.class)
	@JoinColumn(name = "idsucursal",nullable=false)
	Sucursal sucursal;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "idplancuentasuperior")
	Plancuenta plancuentasuperior;

	public Integer getIdplancuenta() {
		return idplancuenta;
	}

	public void setIdplancuenta(Integer idplancuenta) {
		this.idplancuenta = idplancuenta;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getRubro() {
		return rubro;
	}

	public void setRubro(String rubro) {
		this.rubro = rubro;
	}

	public Boolean getAsentable() {
		return asentable;
	}

	public void setAsentable(Boolean asentable) {
		this.asentable = asentable;
	}

	public Integer getNivel() {
		return nivel;
	}

	public void setNivel(Integer nivel) {
		this.nivel = nivel;
	}

	public Boolean getActivo() {
		return activo;
	}

	public void setActivo(Boolean activo) {
		this.activo = activo;
	}

	public String getTipo() {
		return tipo;
	}

	public void setTipo(String tipo) {
		this.tipo = tipo;
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

	public Plancuenta getPlancuentasuperior() {
		return plancuentasuperior;
	}

	public void setPlancuentasuperior(Plancuenta plancuentasuperior) {
		this.plancuentasuperior = plancuentasuperior;
	}

	public Boolean getCaja() {
		return caja;
	}

	public void setCaja(Boolean caja) {
		this.caja = caja;
	}

}
