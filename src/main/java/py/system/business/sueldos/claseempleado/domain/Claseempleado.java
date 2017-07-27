package py.system.business.sueldos.claseempleado.domain;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "claseempleado")
//@NamedQueries( { @NamedQuery(name = "claseempleadoFindAll", query = "select p from Claseempleado p "),  
//@NamedQuery(name = "claseempleadoFindById", query = "select p from Claseempleado p where p.idclaseempleado = :pidclaseempleado") })
public class Claseempleado implements Serializable {

	@Id
	@Column(name = "idclaseempleado")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "claseempleado_idclaseempleado_seq")
	@SequenceGenerator(name = "claseempleado_idclaseempleado_seq", sequenceName = "claseempleado_idclaseempleado_seq", allocationSize = 1)
	private Integer idclaseempleado;

	@Column(name = "descripcion")
	private String descripcion;

	public Integer getIdclaseempleado() {
		return idclaseempleado;
	}

	public void setIdclaseempleado(Integer idclaseempleado) {
		this.idclaseempleado = idclaseempleado;
	}

	public String getDescripcion() {
		return descripcion;
	}

	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

}
