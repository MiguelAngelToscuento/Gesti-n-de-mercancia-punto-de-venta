package com.sistema.ventas.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "detalle_ventas")
public class DetalleVentaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id_detalle;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name="id_venta")
    private VentaModel venta;

    @ManyToOne
    @JoinColumn(name = "id_producto")
    private ProductoModel producto;

    private Double cantidad;
    private Double precio_unitario;
    private Double subtotal;

    public DetalleVentaModel(){}

    public Integer getId_detalle() { return id_detalle; }
    public void setId_detalle(Integer id_detalle) { this.id_detalle = id_detalle; }
    public VentaModel getVenta() { return venta; }
    public void setVenta(VentaModel venta) { this.venta = venta; }
    public ProductoModel getProducto() { return producto; }
    public void setProducto(ProductoModel producto) { this.producto = producto; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public Double getPrecio_unitario() { return precio_unitario; }
    public void setPrecio_unitario(Double precio_unitario) { this.precio_unitario = precio_unitario; }
    public Double getSubtotal() { return subtotal; }
    public void setSubtotal(Double subtotal) { this.subtotal = subtotal; }
}