**README de Kiosko Marke**

Este proyecto realizado en Angular 14 utiliza json-server junto con db.json para el manejo de la API y la base de datos. La base de datos contiene dos conjuntos principales de datos: login y products.

**Credenciales de Inicio de Sesión**
Para acceder a la aplicación, puedes iniciar sesión utilizando cualquiera de los siguientes conjuntos de credenciales:

**Administrador:**
Usuario: admin
Contraseña: 12345

**Desarrollador:**
Usuario: dev
Contraseña: 12345

**Servicio de API**
Puedes ejecutar el servicio de API localmente utilizando el siguiente comando:

Copy code
**json-server .\db.json**
Alternativamente, puedes acceder a la versión de producción de la aplicación en **https://kioskoo-market-green.vercel.app/** .

**Características**

- Los usuarios pueden crear productos con los siguientes atributos: nombre, precio, descripción, cantidad y una imagen.
- Se utilizan formularios reactivos implementados mediante modales tanto para crear como para actualizar productos.
- Las sesiones de usuario persisten mientras el navegador permanezca abierto. Si se cierra el navegador, el token de sesión se elimina.
- Las tarjetas de productos ofrecen dos opciones al pasar el mouse sobre ellas: actualizar o eliminar el producto.
- Una vez que un producto se agrega al carrito de compras, no se puede editar en la página de inicio. Solo se puede editar la cantidad dentro del carrito.
- Al completar una compra, se genera un PDF de la factura correspondiente.

  ![view3](https://github.com/LeonardoRG7/Kiosk-Market/assets/100187473/30ab7f58-8093-454e-92de-983a11d21900)

![view2](https://github.com/LeonardoRG7/Kiosk-Market/assets/100187473/d25a31e2-9009-41c9-aa3a-d6417a661b46)

![view1](https://github.com/LeonardoRG7/Kiosk-Market/assets/100187473/84e6544f-2110-4343-8f51-d291db45f9f0)



**Autor**
Este código fue escrito con amor por: Leonardo Riascos Guerrero

¡No dudes en contactarme si tienes alguna pregunta o necesitas ayuda adicional!
