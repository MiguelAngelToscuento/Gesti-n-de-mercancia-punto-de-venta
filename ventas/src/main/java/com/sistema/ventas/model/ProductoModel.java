package com.sistema.ventas.model;

import jakarta.persistence.*;

@Entity
@Table(name = "producto")
public class ProductoModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_producto")
    private Integer id_producto;

    private String nombre;
    private String descripcion;
    private Double precio_venta;
    private Double stock;
    private String categoria;

    @Column(columnDefinition = "boolean default true")
    private Boolean activo = true;

    public ProductoModel(){}

    // Getters y Setters
    public Integer getId_producto() { return id_producto; }
    public void setId_producto(Integer id_producto) { this.id_producto = id_producto; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecio_venta() { return precio_venta; }
    public void setPrecio_venta(Double precio_venta) { this.precio_venta = precio_venta; }
    public Double getStock() { return stock; }
    public void setStock(Double stock) { this.stock = stock; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Boolean getActivo() { return activo != null ? activo : true; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}