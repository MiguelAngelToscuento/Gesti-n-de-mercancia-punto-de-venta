// La URL dinámica se adapta a Localhost o Cloudflare automáticamente
const API_URL = window.location.origin + "/negocio";
let carrito = [];
let productosCache = [];
let totalVentaActual = 0;

// notificaciones
function mostrarNotificacion(mensaje, tipo = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    toast.innerHTML = mensaje;
    container.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// navegacion
function mostrarSeccion(id) {
    const seccion = document.getElementById(`sec-${id}`);
    if (seccion) {
        document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
        seccion.style.display = 'block';
        if (id === 'productos') cargarProductos();
        if (id === 'ventas') cargarProductosVenta();
        if (id === 'historial') cargarHistorial();
    }
}

// gestion de los productos
async function cargarProductos() {
    const res = await fetch(`${API_URL}/productos`);
    const productos = await res.json();
    const tbody = document.querySelector("#tabla-productos tbody");

    tbody.innerHTML = productos.map(p => {
        const estaActivo = p.activo !== false;
        const badgeHTML = estaActivo
            ? `<span class="badge badge-active">Activo</span>`
            : `<span class="badge badge-inactive">Inactivo</span>`;
        const textoBoton = estaActivo ? "Desactivar" : "Activar";
        const claseBoton = estaActivo ? "btn-danger" : "btn-success";

        return `
        <tr style="opacity: ${estaActivo ? '1' : '0.6'};">
            <td>${p.id_producto}</td>
            <td><strong>${p.nombre}</strong><br>${badgeHTML}</td>
            <td>${p.descripcion || '-'}</td>
            <td>$${p.precio_venta.toFixed(2)}</td>
            <td>${p.stock}</td>
            <td class="action-buttons">
                <button type="button" class="btn btn-warning" onclick="prepararEdicion(${p.id_producto})">Editar</button>
                <button type="button" class="btn ${claseBoton}" onclick="cambiarEstadoProducto(${p.id_producto})">${textoBoton}</button>
            </td>
        </tr>`;
    }).join('');
}

function filtrarInventario() {
    const texto = document.getElementById('busqueda-inventario').value.toLowerCase();
    document.querySelectorAll("#tabla-productos tbody tr").forEach(f => {
        f.style.display = f.cells[1].textContent.toLowerCase().includes(texto) ? "" : "none";
    });
}

// productos que sean menos de 4
let viendoFaltantes = false;
function verFaltantes() {
    viendoFaltantes = !viendoFaltantes;
    const tbody = document.querySelector("#tabla-productos tbody");
    const filas = tbody.querySelectorAll("tr");
    const panelResumen = document.getElementById("panel-resumen-faltantes");

    let listaGranel = [];
    let contadorPiezas = 0;

    filas.forEach(fila => {
        const nombre = fila.cells[1].innerText;
        const descripcion = fila.cells[2].innerText.toLowerCase();
        const stock = parseFloat(fila.cells[4].textContent);

        const esFaltante = stock < 4;
        const esGranel = nombre.toLowerCase().includes("granel") || descripcion.includes("granel");

        if (viendoFaltantes) {
            if (esFaltante) {
                fila.style.display = "";
                if (esGranel) listaGranel.push({ nombre, stock });
                else contadorPiezas++;
            } else {
                fila.style.display = "none";
            }
        } else {
            fila.style.display = "";
        }
    });

    if (viendoFaltantes) {
        let contenidoHTML = `<h4 style="margin-bottom: 10px;">📋 Reporte de Pedido Semanal</h4>`;
        if (listaGranel.length > 0) {
            contenidoHTML += `<strong>📍 PRODUCTOS A GRANEL:</strong><ul>`;
            listaGranel.forEach(p => contenidoHTML += `<li>${p.nombre}: <span style="color:red;">Quedan ${p.stock}</span></li>`);
            contenidoHTML += `</ul>`;
        }
        contenidoHTML += `<strong>📦 OTROS FALTANTES:</strong> Se encontraron ${contadorPiezas} productos con stock menor a 4.`;
        panelResumen.innerHTML = contenidoHTML;
        panelResumen.style.display = "block";
    } else {
        panelResumen.style.display = "none";
    }

    const btn = document.querySelector(".btn-warning");
    if(btn) btn.innerText = viendoFaltantes ? "🔄 Ver Todo" : "📝 Ver Faltantes";
    mostrarNotificacion(viendoFaltantes ? "Mostrando productos bajos." : "Inventario completo.");
}

async function prepararEdicion(id) {
    const res = await fetch(`${API_URL}/productos/${id}`);
    const p = await res.json();
    document.getElementById('prod-id').value = p.id_producto;
    document.getElementById('prod-nombre').value = p.nombre;
    document.getElementById('prod-descripcion').value = p.descripcion || "";
    document.getElementById('prod-categoria').value = p.categoria || "";
    document.getElementById('prod-precio').value = p.precio_venta;
    document.getElementById('prod-stock').value = p.stock;
    document.getElementById('btn-form-producto').innerText = "Actualizar Cambios";
    document.getElementById('btn-cancelar-edicion').style.display = "inline-block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function limpiarFormulario() {
    document.getElementById('form-producto').reset();
    document.getElementById('prod-id').value = "";
    document.getElementById('btn-form-producto').innerText = "Guardar Producto";
    document.getElementById('btn-cancelar-edicion').style.display = "none";
}

document.getElementById('form-producto').onsubmit = async (e) => {
    e.preventDefault();
    try {
        const idRaw = document.getElementById('prod-id').value;
        const esEdicion = idRaw !== "" && idRaw !== "undefined" && idRaw !== null;
        const producto = {
            nombre: document.getElementById('prod-nombre').value,
            descripcion: document.getElementById('prod-descripcion').value,
            categoria: document.getElementById('prod-categoria').value,
            precio_venta: parseFloat(document.getElementById('prod-precio').value),
            stock: parseFloat(document.getElementById('prod-stock').value)
        };
        const url = esEdicion ? `${API_URL}/productos/${idRaw}` : `${API_URL}/productos`;
        const metodo = esEdicion ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method: metodo,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(producto)
        });
        if (res.ok) {
            mostrarNotificacion(esEdicion ? "✅ Actualizado" : "✅ Registrado");
            limpiarFormulario();
            cargarProductos();
        }
    } catch (error) {
        console.error(error);
        mostrarNotificacion("❌ Error al guardar.", "error");
    }
};

async function cambiarEstadoProducto(id) {
    const res = await fetch(`${API_URL}/productos/${id}/estado`, { method: 'PUT' });
    if (res.ok) {
        cargarProductos();
        cargarProductosVenta();
    }
}

// punto de venta
async function cargarProductosVenta() {
    const res = await fetch(`${API_URL}/productos`);
    const todos = await res.json();
    productosCache = todos.filter(p => p.activo !== false);
    renderizarProductosVenta(productosCache);
}

function renderizarProductosVenta(lista) {
    const container = document.getElementById("lista-seleccion");
    container.innerHTML = lista.map(p => {
        const agotado = p.stock <= 0;
        const controlCantidad = agotado
            ? `<button class="btn btn-secondary" disabled>Agotado</button>`
            : `<div style="display: flex; gap: 5px; align-items: center;">
                 <input type="number" id="cant-${p.id_producto}" value="1" step="0.01" style="width: 70px; padding: 8px; text-align: center;">
                 <button class="btn btn-success" onclick="agregarAlCarrito(${p.id_producto}, '${p.nombre}', ${p.precio_venta}, ${p.stock})">Añadir</button>
               </div>`;
        return `<div class="producto-item"><div><strong>${p.nombre}</strong><br><small>$${p.precio_venta.toFixed(2)} | Stock: ${p.stock}</small></div>${controlCantidad}</div>`;
    }).join('');
}

function filtrarProductos() {
    const busqueda = document.getElementById('input-busqueda').value.toLowerCase();
    renderizarProductosVenta(productosCache.filter(p => p.nombre.toLowerCase().includes(busqueda)));
}

function agregarAlCarrito(id, nombre, precio, stockDisponible) {
    const cantidadInput = parseFloat(document.getElementById(`cant-${id}`).value);
    if (isNaN(cantidadInput) || cantidadInput <= 0) return;
    const item = carrito.find(i => i.id_producto === id);
    const cantidadActual = item ? item.cantidad : 0;
    if ((cantidadActual + cantidadInput) > stockDisponible) {
        mostrarNotificacion(`⚠️ Solo hay ${stockDisponible} disponibles.`, "warning");
        return;
    }
    if (item) item.cantidad += cantidadInput;
    else carrito.push({ id_producto: id, nombre, precio, cantidad: cantidadInput });
    renderizarCarrito();
}

function restarDelCarrito(id) {
    const item = carrito.find(i => i.id_producto === id);
    if (item) {
        if (item.cantidad > 1) item.cantidad -= 1;
        else carrito = carrito.filter(i => i.id_producto !== id);
        renderizarCarrito();
    }
}

function eliminarDelCarrito(id) {
    carrito = carrito.filter(i => i.id_producto !== id);
    renderizarCarrito();
}

function renderizarCarrito() {
    totalVentaActual = 0;
    document.getElementById("lista-carrito").innerHTML = carrito.map(i => {
        const subtotal = i.precio * i.cantidad;
        totalVentaActual += subtotal;

        return `
        <li style="display:flex; justify-content:space-between; align-items: center; border-bottom: 1px solid var(--border);">
            <div style="flex: 1;">
                <span style="font-size: 19px; font-weight: 700;">${i.nombre}</span><br>
                <span class="cart-item-qty">${i.cantidad} x $${i.precio.toFixed(2)}</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button onclick="restarDelCarrito(${i.id_producto})" class="btn btn-cart-control" style="background: #e2e8f0; color: #1e293b;">-</button>
                <button onclick="eliminarDelCarrito(${i.id_producto})" class="btn btn-danger btn-cart-control">🗑️</button>
                <span class="cart-item-subtotal">$${subtotal.toFixed(2)}</span>
            </div>
        </li>`;
    }).join('');

    document.getElementById("total-venta").innerText = `Total: $${totalVentaActual.toFixed(2)}`;
    calcularCambio();
}

function calcularCambio() {
    const pago = parseFloat(document.getElementById('pago-cliente').value) || 0;
    const cambio = pago - totalVentaActual;
    const el = document.getElementById('cambio-venta');
    el.innerText = `Cambio: $${(pago >= totalVentaActual ? cambio : 0).toFixed(2)}`;
    el.style.color = pago >= totalVentaActual ? "#22c55e" : "#ef4444";
}

async function confirmarVenta() {
    if (carrito.length === 0) return;
    const venta = { detalles: carrito.map(i => ({ producto: { id_producto: i.id_producto }, cantidad: i.cantidad })) };
    const res = await fetch(`${API_URL}/ventas`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(venta)
    });
    if (res.ok) {
        mostrarNotificacion("🛒 Venta realizada!");
        carrito = [];
        renderizarCarrito();
        cargarProductosVenta();
    }
}

// historial
async function cargarHistorial() {
    const res = await fetch(`${API_URL}/ventas`);
    const ventas = await res.json();
    let suma = 0;
    document.querySelector("#tabla-ventas tbody").innerHTML = ventas.map(v => {
        suma += v.total;
        return `<tr><td>#${v.id_venta}</td><td>${new Date(v.fecha_hora).toLocaleString()}</td><td>$${v.total.toFixed(2)}</td></tr>`;
    }).join('');
    document.getElementById("suma-total").innerText = `$${suma.toFixed(2)}`;
}

mostrarSeccion('productos');