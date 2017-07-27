package py.system.business.session.clase.domain;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name = "clase")
//@NamedQueries( { @NamedQuery(name = "clasefindAll", query = "select p from Clase p "), 
//@NamedQuery(name = "clasefindByEstado", query = "select p from Clase p where p.estado = :pestado"),
//@NamedQuery(name = "clasefindByPrimaryKey", query = "select p from Clase p where p.idclase = :pidclase")})
			     
public class Clase implements Serializable {

	@Id
	@Column(name = "idclase")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="clase_idclase_seq")
    @SequenceGenerator(name = "clase_idclase_seq", sequenceName = "clase_idclase_seq", allocationSize=1)
	private Integer idclase;

	@Column(name = "descripcion")
	private String descripcion;

	@Column(name = "clase")
	private String clase;

	@Column(name = "estado")
	private Boolean estado;
	
	@Column(name = "url")
	private String url;

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Integer getIdclase() {
		return idclase;
	}

	public void setIdclase(Integer idclase) {
		this.idclase = idclase;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	public String getClase() {
		return clase;
	}

	public void setClase(String clase) {
		this.clase = clase;
	}

	public Boolean getEstado() {
		return estado;
	}

	public void setEstado(Boolean estado) {
		this.estado = estado;
	}
}
