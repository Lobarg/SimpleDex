# SimpleDex
 SimpleDex Frontend

Este proyecto consiste en un intercambio descentralizado (DEX) basado en un contrato inteligente de SimpleDex, el cual permite a los usuarios agregar y retirar liquidez, intercambiar tokens (de tipo ERC20) entre dos tokens y consultar el precio de un token en base a las reservas del contrato.

Cambios realizados en el contrato inteligente:
Se realizaron los cambios solicitados por Cristian, mejorando el uso de GAS y memoria.
Además se cambio la logica para que maneje wei, no enteros en el contrato, si bien a efectos practicos, en la pagina web realizada se utilizan numeros con decimales (punto) para manejarlo mas comodamente.  Se diferencio tambien el evento Swap AxB de BxA a pedido de Cristian, si bien de esta forma se usa mas recursos. Se agrego una funcion para retornar las reservas en el contrato.

Frontend
El frontend es una aplicación web simple que permite a los usuarios interactuar con el contrato inteligente a través de su navegador. es HTML y Javascript (Vanilla).  Este frontend incluye las siguientes funcionalidades:

Se agrega ademas, la pagina web en Vercel que se conecta a todos los cambios en este github: https://simpledex-zeta.vercel.app/

Conexión a MetaMask: Los usuarios pueden conectar su billetera de MetaMask a la aplicación para interactuar con el contrato.
Interacción con el contrato: Desde el frontend, los usuarios pueden:
Ver las reservas actuales de los tokens A y B.
Consultar el precio de un token.
Agregar o retirar liquidez del contrato.
Realizar intercambios entre tokens.
Logs de transacciones: Los eventos generados por el contrato se muestran en el frontend para permitir un seguimiento de las acciones realizadas en el contrato.

Cómo funciona el frontend
Conectar MetaMask: El usuario debe tener MetaMask instalado en su navegador y conectado a la red adecuada (por ejemplo, la red Ethereum principal o una red de pruebas como Rinkeby).
Ver reservas y precios: Los usuarios pueden consultar las reservas de los tokens y los precios mediante las funciones proporcionadas en el contrato.
Interactuar con el contrato: Los usuarios pueden agregar o retirar liquidez e intercambiar tokens desde la interfaz, que llama a las funciones correspondientes en el contrato inteligente.
Instrucciones de uso
Clona este repositorio:

bash
Copiar código
git clone https://github.com/tu_usuario/simple-dex.git
cd simple-dex
Contratos: Para desplegar los contratos en la red Ethereum (por ejemplo, en la red de pruebas Rinkeby), debes compilar y desplegar los contratos con herramientas como Hardhat o Truffle.

Frontend: Para ejecutar el frontend, simplemente abre el archivo index.html en tu navegador o sube los archivos a una plataforma como GitHub Pages, Netlify o Vercel.

Interacción: Asegúrate de que tu billetera MetaMask esté conectada a la red correcta antes de intentar interactuar con el contrato. Si no eres el owner del contrato y no tienes tokens A y B no podras interactuar, salvo para las consultas. 

Requisitos
MetaMask instalado en tu navegador.
Conexión a una red Ethereum compatible (por ejemplo, Rinkeby para pruebas).
Una cuenta de Ethereum con fondos para pagar las tarifas de transacción si interactúas con la red principal.
Recursos adicionales
Documentación de ethers.js
Documentación de MetaMask
Documentación de Solidity
Contribuciones
Si tienes sugerencias o mejoras para este proyecto, por favor abre un issue o envía un pull request. ¡Las contribuciones son bienvenidas!
