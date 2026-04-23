package com.sistema.ventas.repository;

import com.sistema.ventas.model.DetalleVentaModel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DetalleVentaRepository extends JpaRepository<DetalleVentaModel, Integer> {
    // las clases repository dan los siguientes métodos:
    /*
     * save(entidad) para crear y actualizar
     * findAll() para listar todas las cosas
     * findById(id) para buscar solo uno
     * deleteById(id) para eliminar
     *  se pueden agregar metodos especificos como:
     * findByCategoria(String cat) si se quiere filtrar productos
     * */
}
