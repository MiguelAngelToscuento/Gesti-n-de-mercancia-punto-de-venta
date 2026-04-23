package com.sistema.ventas.controller;

import com.sistema.ventas.model.VentaModel;
import com.sistema.ventas.service.VentaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/negocio/ventas")
public class VentaController {

    @Autowired
    private VentaService ventaService;

    // registrar una venta nueva
    @PostMapping
    public VentaModel realizarVenta(@RequestBody VentaModel venta){
        // se recibe un json, el service hara el calculo y resta de stock
        return ventaService.registrarVenta(venta);
    }

    //ver historial de ventas
    @GetMapping
    public List<VentaModel> historial(){
        return ventaService.obtenerVentasDelDia();
    }
}
