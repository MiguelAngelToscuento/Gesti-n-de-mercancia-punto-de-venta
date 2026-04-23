# Gestion-de-mercancia-punto-de-venta
Aplicación web diseñada para la gestion integral de inventario y ventas, ideal para pequeños negocios.
Permite controlar el stock, registro de prouctos y seguimiento de transacciones en tiempo real.

Caracteristicas
* Gestión de inventario: CRUD (Crear, leer, actualizar) no incluye eliminar, en su caso incluye inactividad de productos
* Control de stock: Actualización automática de productos tras cada venta
* Módulo de ventas: Registro de transacciones (por el momento solo total de la venta, no incluye detalle de artículos)
* Interfaz responsiva: Diseño limpio e interactivo usando HTML5, CSS3 y JavaScript

Requisitos previos
- Java: JDK 23 o superior
- Base de datos: MySQL 8.0 o superior
- IDE: Intellij IDEA, VS code o Eclipse
- Gestor de Dependencias: Maven (Incluido en el proyecto)

Instalacion y configuracion
- Clonar el repositorio
  - git clone https://github.com/MiguelAngelToscuento/Gesti-n-de-mercancia-punto-de-venta.git
Configuracion de la base de datos
- Ejecutar en tu gestor de base de datos el archivo database.sql que se encuntra dentro de la carpeta: database de este proyecto 
Configuracion de credenciales

spring.datasource.url=jdbc:mysql://localhost:3306/negocio
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect

Ejecutar la aplicacion
- ./mvnw spring-boot:run
Accede a http://localhost:8080

Tecnologías utilizadas
- Backend: Java 23, Spring Boot, Spring Data JPA.
- Frontend: HTML5, CSS3, JavaScript (Vanilla).
- Base de datos: MySQL.
