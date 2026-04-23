package com.sistema.ventas.controller;

import com.sistema.ventas.model.ProductoModel;
import com.sistema.ventas.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/negocio/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<ProductoModel> listar() {
        return productoService.listarTodos();
    }

    @GetMapping("/{id}")
    public ProductoModel obtenerPorId(@PathVariable Integer id) {
        return productoService.buscarPorId(id);
    }

    @PostMapping
    public ProductoModel crear(@RequestBody ProductoModel producto) {
        return productoService.guardar(producto);
    }

    @PutMapping("/{id}")
    public ProductoModel actualizar(@PathVariable Integer id, @RequestBody ProductoModel producto) {
        producto.setId_producto(id);
        return productoService.guardar(producto);
    }

    // activar o desactivar productos
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id) {
        try {
            productoService.cambiarEstado(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al cambiar el estado del producto.");
        }
    }
}