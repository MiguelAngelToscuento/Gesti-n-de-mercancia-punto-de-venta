package com.sistema.ventas.service;

import com.sistema.ventas.model.ProductoModel;
import com.sistema.ventas.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    public List<ProductoModel> listarTodos() {
        return productoRepository.findAll();
    }

    public ProductoModel guardar(ProductoModel producto) {
        return productoRepository.save(producto);
    }

    public ProductoModel buscarPorId(Integer id) {
        return productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("El producto no existe."));
    }

    // Nuevo método de borrado lógico
    public void cambiarEstado(Integer id) {
        ProductoModel producto = buscarPorId(id);
        producto.setActivo(!producto.getActivo());
        productoRepository.save(producto);
    }

    public void restarStock(Integer id, Double cantidadAVender) {
        ProductoModel producto = buscarPorId(id);
        if (producto.getStock() < cantidadAVender) {
            throw new RuntimeException("No hay suficiente stock para: " + producto.getNombre() + ". Disponibles: " + producto.getStock());
        }
        producto.setStock(producto.getStock() - cantidadAVender);
        productoRepository.save(producto);
    }
}