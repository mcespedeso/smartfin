package py.system.business.comun.sucursal.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import py.system.business.comun.empresa.domain.Empresa;

@Entity
@Table(name = "sucursal")
//@NamedQueries( { @NamedQuery(name = "sucursalFindByEmpresa", query = "select p from Sucursal p where p.empresa.codempresa = :pempresa"),
//				 @NamedQuery(name = "sucursalfindAll", query = "select p from Sucursal p order by p.idsucursal")})

public class Sucursal implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "idsucursal")
	private Integer idsucursal;
	
	@Column(name = "nombre")
	private String nombre;
	
	@Column(name = "codigo")
	private String codigo;
	
	@Column(name = "direccion")
	private String direccion;
	
	@Column(name = "telefono1")
	private String telefono1;
	
	@Column(name = "ciudad")
	private String ciudad;

	@Column(name = "pais")
	private String pais;
	
	@Column(name = "matriz")
	private Boolean matriz;
	
	@ManyToOne(targetEntity = Empresa.class)
	@JoinColumn(name = "idempresa")
	private Empresa empresa;

	public Empresa getEmpresa() {
		return empresa;
	}

	public void setEmpresa(Empresa empresa) {
		this.empresa = empresa;
	}

	public Integer getIdsucursal() {
		return idsucursal;
	}

	public void setIdsucursal(Integer idsucursal) {
		this.idsucursal = idsucursal;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public static long getSerialVersionUID() {
		return serialVersionUID;
	}

	public String getCodigo() {
		return codigo;
	}

	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getTelefono1() {
		return telefono1;
	}

	public void setTelefono1(String telefono1) {
		this.telefono1 = telefono1;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getPais() {
		return pais;
	}

	public void setPais(String pais) {
		this.pais = pais;
	}

	public Boolean getMatriz() {
		return matriz;
	}

	public void setMatriz(Boolean matriz) {
		this.matriz = matriz;
	}

}
