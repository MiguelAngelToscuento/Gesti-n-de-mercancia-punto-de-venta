package com.sistema.ventas.service;

import com.sistema.ventas.model.DetalleVentaModel;
import com.sistema.ventas.model.ProductoModel;
import com.sistema.ventas.model.VentaModel;
import com.sistema.ventas.repository.VentaRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class VentaService {

    @Autowired
    private VentaRepository ventaRepository;

    @Autowired
    private ProductoService productoService;

    @Transactional
    public VentaModel registrarVenta(VentaModel venta) {
        double totalVenta = 0;

        // asignar la fecha y hora
        venta.setFecha_hora(LocalDateTime.now());

        // procesar detalles
        for (DetalleVentaModel detalle : venta.getDetalles()) {
            ProductoModel producto = productoService.buscarPorId(Math.toIntExact(detalle.getProducto().getId_producto()));

            // se resta el stock
            productoService.restarStock(Math.toIntExact(producto.getId_producto()), detalle.getCantidad());
            detalle.setPrecio_unitario(producto.getPrecio_venta());

            double subtotal = producto.getPrecio_venta() * detalle.getCantidad();
            detalle.setSubtotal(subtotal);
            detalle.setVenta(venta);

            totalVenta += subtotal;
        }

        // asignar el total final
        venta.setTotal(totalVenta);

        return ventaRepository.save(venta);
    }
    public List<VentaModel> obtenerVentasDelDia() {
        return ventaRepository.findAll();
    }
}