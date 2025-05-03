# URL-Shortener Backend

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)

## Descripción del Proyecto

Este es el backend para un servicio de acortamiento de URLs. Permite a los usuarios ingresar una URL larga y obtener
a cambio una URL más corta y facil de compartir. Al acceder a la URL corta, el usuario será redirigido a la URL original

Este backend está construido utilziando Node.js con el framework Express.js y utiliza MongoDB como su base de datos
para almacenar las URLs originales y sus versiones acortadas.

## Tecnologías Utilizadas

Este proyecto utiliza las siguientes tecnologías y dependencias:

* **Node.js:** Entorno de ejecución para JavaScript en el servidor.
* **Express.js:** Framework web minimalista y flexible para Node.js.
* **MongoDB:** Base de datos NoSQL orientada a documentos.
* **Mongoose:** Librería de modelado de objetos MongoDB para Node.js.
* **cors:** Middleware para habilitar el Intercambio de Recursos de Origen Cruzado (CORS).
* **dotenv:** Carga variables de entorno desde un archivo `.env`.
* **envalid:** Valida y analiza variables de entorno.
* **morgan:** Middleware de registro de solicitudes HTTP.
* **nanoid:** Generador de IDs únicos, pequeños y seguros para las URLs acortadas.
* **redis:** Cliente para Redis (usado potencialmente para caching o almacenamiento temporal)
* **uuid:** Librería para generar IDs únicos (utilizado potencialmente para rastreo de peticiones)
* **valid-url:** Validador de URLs.
* **winston:** Librería de logging flexible con soporte para múltiples transportes.
* **zod:** Librería de validación de esquemas en TypeScript/JavaScript.
* **cross-env:** Ejecuta comandos de scripts de Node.js de forma cruzada entre plataformas.
* **jest:** Framework de testing de JavaScript.

## Instalación

Sigue estos pasos para configurar el proyecto localmente:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/danilokosam/url-shortener.git
    cd backend
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Crea un archivo `.env.development` (y `.env.production`, `.env.test` según tus necesidades) en la raíz del proyecto y define las siguientes variables (ejemplo):

    ```env
    NODE_ENV=development
    PORT=8080
    MONGODB_URI=mongodb://localhost:27017/url_shortener_dev
    ```

    Asegúrate de configurar la URI de MongoDB para tu entorno de desarrollo.

4.  **Ejecuta el backend en modo desarrollo:**
    ```bash
    npm run dev
    ```

    Esto iniciará el servidor backend y estará atento a los cambios en los archivos.

## Uso

Una vez que el backend esté en funcionamiento, podrás interactuar con su API para:

* **Acortar una URL:** Envía una petición `POST` a un endpoint específico (por ejemplo, `/api/shorten`) con la URL larga que deseas acortar en el cuerpo de la petición (probablemente en formato JSON). La API devolverá una URL corta única.
* **Redirigir a la URL original:** Al acceder a la URL corta generada (por ejemplo, `http://localhost:8080/abc123`), el backend buscará la URL original correspondiente en la base de datos y realizará una redirección HTTP a esa URL.

## Pruebas

Para ejecutar las pruebas unitarias y de integración:

```bash
npm run test