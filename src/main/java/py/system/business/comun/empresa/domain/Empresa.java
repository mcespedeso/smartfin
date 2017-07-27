package py.system.business.comun.empresa.domain;

import java.io.Serializable;
import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import py.system.business.contabilidad.plancuenta.domain.Plancuenta;
import py.system.business.tesoreria.moneda.domain.Moneda;
import py.system.business.tesoreria.tipoimpuesto.domain.Tipoimpuesto;

@Entity
@Table(name = "empresa")
//@NamedQueries( { @NamedQuery(name = "empresafindAll", query = "select p from Empresa p ") })
public class Empresa implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "idempresa")
	private Integer codempresa;

	@Column(name = "descripcion")
	private String descripcion;
	
	@Column(name = "ruc")
	private String ruc;
	
	@Column(name = "timbrado")
	private Integer timbrado;

	@Column(name = "nombre")
	private String nombre;

	@Column(name = "codigo")
	private String codigo;

	@Column(name = "direccion")
	private String direccion;

	@Column(name = "telefono1")
	private String telefono1;

	@Column(name = "telefono2")
	private String telefono2;

	@Column(name = "sitioweb")
	private String sitioweb;

	@Column(name = "email")
	private String email;

	@Column(name = "contador")
	private String contador;

	@Column(name = "ruccontador")
	private String ruccontador;

	@Column(name = "representante")
	private String representante;

	@Column(name = "diazvalidezcotizacion")
	private Integer diazvalidezcotizacion;

	@Column(name = "ejercicio")
	private Integer ejercicio;

	@Column(name = "ultcierre")
	private Date ultcierre;

	@Column(name = "fechaasientodesde")
	private Date fechaasientodesde;

	@Column(name = "fechaasientohasta")
	private Date fechaasientohasta;

	@Column(name = "fechadesde")
	private Date fechadesde;

	@Column(name = "fechahasta")
	private Date fechahasta;

	@Column(name = "col1")
	private String col1;

	@Column(name = "col2")
	private String col2;

	@Column(name = "col3")
	private String col3;

	@Column(name = "col4")
	private String col4;

	@Column(name = "col5")
	private String col5;

	@Column(name = "col6")
	private String col6;

	@Column(name = "col7")
	private String col7;

	@Column(name = "col8")
	private String col8;

	@Column(name = "col9")
	private String col9;

	@Column(name = "cuentaingreso")
	private String cuentaingreso;

	@Column(name = "cuentaegreso")
	private String cuentaegreso;

	@Column(name = "sistema")
	private String sistema;
	
	@Column(name = "nropatronalips")
	private String nropatronalips;
	
	@Column(name = "nropatronalmjt")
	private String nropatronalmjt;

	@Column(name = "tasachequetercero", columnDefinition = "numeric")
	private Double tasachequetercero;

	@Column(name = "tasamora", columnDefinition = "numeric")	
	private Double tasamora;
	
	@Column(name = "factprimero")
	private Boolean factprimero;
	
	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "idplancuentaingreso")
	Plancuenta plancuentaingreso;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "idplancuentaegreso")
	Plancuenta plancuentaegreso;
	
	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "idplancuentacliente")
	Plancuenta plancuentacliente;

	@ManyToOne(targetEntity = Moneda.class)
	@JoinColumn(name = "codmonedalocal")
	Moneda monedalocal;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "ivacompra10")
	Plancuenta ivacompra10;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "ivacompra5")
	Plancuenta ivacompra5;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "gananciavaluacion")
	Plancuenta gananciavaluacion;

	@ManyToOne(targetEntity = Plancuenta.class)
	@JoinColumn(name = "perdidavaluacion")
	Plancuenta perdidavaluacion;
	
	@ManyToOne(targetEntity = Tipoimpuesto.class)
	@JoinColumn(name = "idtipoimpuesto")
	Tipoimpuesto tipoimpuesto;	

	public Tipoimpuesto getTipoimpuesto() {
		return tipoimpuesto;
	}

	public void setTipoimpuesto(Tipoimpuesto tipoimpuesto) {
		this.tipoimpuesto = tipoimpuesto;
	}

	public Plancuenta getGananciavaluacion() {
		return gananciavaluacion;
	}

	public void setGananciavaluacion(Plancuenta gananciavaluacion) {
		this.gananciavaluacion = gananciavaluacion;
	}

	public Plancuenta getPerdidavaluacion() {
		return perdidavaluacion;
	}

	public void setPerdidavaluacion(Plancuenta perdidavaluacion) {
		this.perdidavaluacion = perdidavaluacion;
	}

	public Integer getCodempresa() {
		return codempresa;
	}

	public void setCodempresa(Integer codempresa) {
		this.codempresa = codempresa;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
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

	public String getTelefono2() {
		return telefono2;
	}

	public void setTelefono2(String telefono2) {
		this.telefono2 = telefono2;
	}

	public String getSitioweb() {
		return sitioweb;
	}

	public void setSitioweb(String sitioweb) {
		this.sitioweb = sitioweb;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public static long getSerialVersionUID() {
		return serialVersionUID;
	}

	public Moneda getMonedalocal() {
		return monedalocal;
	}

	public void setMonedalocal(Moneda monedalocal) {
		this.monedalocal = monedalocal;
	}

	public Integer getDiazvalidezcotizacion() {
		return diazvalidezcotizacion;
	}

	public void setDiazvalidezcotizacion(Integer diazvalidezcotizacion) {
		this.diazvalidezcotizacion = diazvalidezcotizacion;
	}

	public Plancuenta getIvacompra10() {
		return ivacompra10;
	}

	public void setIvacompra10(Plancuenta ivacompra10) {
		this.ivacompra10 = ivacompra10;
	}

	public Plancuenta getIvacompra5() {
		return ivacompra5;
	}

	public void setIvacompra5(Plancuenta ivacompra5) {
		this.ivacompra5 = ivacompra5;
	}

	public Integer getEjercicio() {
		return ejercicio;
	}

	public void setEjercicio(Integer ejercicio) {
		this.ejercicio = ejercicio;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public Date getUltcierre() {
		return ultcierre;
	}

	public void setUltcierre(Date ultcierre) {
		this.ultcierre = ultcierre;
	}

	public Date getFechadesde() {
		return fechadesde;
	}

	public void setFechadesde(Date fechadesde) {
		this.fechadesde = fechadesde;
	}

	public Date getFechahasta() {
		return fechahasta;
	}

	public void setFechahasta(Date fechahasta) {
		this.fechahasta = fechahasta;
	}

	public String getRuc() {
		return ruc;
	}

	public void setRuc(String ruc) {
		this.ruc = ruc;
	}

	public String getCol1() {
		return col1;
	}

	public void setCol1(String col1) {
		this.col1 = col1;
	}

	public String getCol2() {
		return col2;
	}

	public void setCol2(String col2) {
		this.col2 = col2;
	}

	public String getCol3() {
		return col3;
	}

	public void setCol3(String col3) {
		this.col3 = col3;
	}

	public String getCol4() {
		return col4;
	}

	public void setCol4(String col4) {
		this.col4 = col4;
	}

	public String getCol5() {
		return col5;
	}

	public void setCol5(String col5) {
		this.col5 = col5;
	}

	public String getCol6() {
		return col6;
	}

	public void setCol6(String col6) {
		this.col6 = col6;
	}

	public String getCol7() {
		return col7;
	}

	public void setCol7(String col7) {
		this.col7 = col7;
	}

	public String getCol8() {
		return col8;
	}

	public void setCol8(String col8) {
		this.col8 = col8;
	}

	public String getCol9() {
		return col9;
	}

	public void setCol9(String col9) {
		this.col9 = col9;
	}

	public Plancuenta getPlancuentaingreso() {
		return plancuentaingreso;
	}

	public void setPlancuentaingreso(Plancuenta plancuentaingreso) {
		this.plancuentaingreso = plancuentaingreso;
	}

	public Plancuenta getPlancuentaegreso() {
		return plancuentaegreso;
	}

	public void setPlancuentaegreso(Plancuenta plancuentaegreso) {
		this.plancuentaegreso = plancuentaegreso;
	}

	public String getCuentaingreso() {
		return cuentaingreso;
	}

	public void setCuentaingreso(String cuentaingreso) {
		this.cuentaingreso = cuentaingreso;
	}

	public String getCuentaegreso() {
		return cuentaegreso;
	}

	public void setCuentaegreso(String cuentaegreso) {
		this.cuentaegreso = cuentaegreso;
	}

	public String getContador() {
		return contador;
	}

	public void setContador(String contador) {
		this.contador = contador;
	}

	public String getRuccontador() {
		return ruccontador;
	}

	public void setRuccontador(String ruccontador) {
		this.ruccontador = ruccontador;
	}

	public String getRepresentante() {
		return representante;
	}

	public void setRepresentante(String representante) {
		this.representante = representante;
	}

	public String getSistema() {
		return sistema;
	}

	public void setSistema(String sistema) {
		this.sistema = sistema;
	}

	public Double getTasachequetercero() {
		return tasachequetercero;
	}

	public void setTasachequetercero(Double tasachequetercero) {
		this.tasachequetercero = tasachequetercero;
	}

	public Date getFechaasientodesde() {
		return fechaasientodesde;
	}

	public void setFechaasientodesde(Date fechaasientodesde) {
		this.fechaasientodesde = fechaasientodesde;
	}

	public Date getFechaasientohasta() {
		return fechaasientohasta;
	}

	public void setFechaasientohasta(Date fechaasientohasta) {
		this.fechaasientohasta = fechaasientohasta;
	}

	public String getNropatronalips() {
		return nropatronalips;
	}

	public void setNropatronalips(String nropatronalips) {
		this.nropatronalips = nropatronalips;
	}

	public String getNropatronalmjt() {
		return nropatronalmjt;
	}

	public void setNropatronalmjt(String nropatronalmjt) {
		this.nropatronalmjt = nropatronalmjt;
	}

	public Integer getTimbrado() {
		return timbrado;
	}

	public void setTimbrado(Integer timbrado) {
		this.timbrado = timbrado;
	}

	public Plancuenta getPlancuentacliente() {
		return plancuentacliente;
	}

	public void setPlancuentacliente(Plancuenta plancuentacliente) {
		this.plancuentacliente = plancuentacliente;
	}

	public Double getTasamora() {
		return tasamora;
	}

	public void setTasamora(Double tasamora) {
		this.tasamora = tasamora;
	}

	public Boolean getFactprimero() {
		return factprimero;
	}

	public void setFactprimero(Boolean factprimero) {
		this.factprimero = factprimero;
	}

}
