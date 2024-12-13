# SimpleDex
 SimpleDex Frontend

Este proyecto consiste en un intercambio descentralizado (DEX) basado en un contrato inteligente de SimpleDex, el cual permite a los usuarios agregar y retirar liquidez, intercambiar tokens (de tipo ERC20) entre dos tokens y consultar el precio de un token en base a las reservas del contrato.

Cambios realizados en el contrato inteligente:

Lógica de Swap: Se implementaron funciones para intercambiar dos tokens entre sí (swapAforB, swapBforA), basadas en las reservas actuales de los tokens en el contrato.
Agregar y retirar liquidez: Se crearon las funciones addLiquidity y removeLiquidity para permitir que los usuarios agreguen o retiren liquidez al contrato, manteniendo el equilibrio entre los tokens A y B.
Consulta de reservas: Se implementó una función getReserves para consultar las reservas actuales de los tokens A y B en el contrato.
Eventos de intercambio: Se agregaron eventos para registrar y seguir los intercambios de tokens y las adiciones/remociones de liquidez.
Funcionalidades del contrato inteligente
Swap entre tokens: Los usuarios pueden intercambiar el Token A por el Token B y viceversa. Esto se maneja con las funciones swapAforB y swapBforA.
Agregación de liquidez: Los usuarios pueden agregar liquidez en forma de tokens A y B con la función addLiquidity.
Retiro de liquidez: Los usuarios pueden retirar liquidez con la función removeLiquidity.
Consulta de precios y reservas: El contrato permite consultar el precio de un token a través de la función getPrice y las reservas actuales de los tokens mediante getReserves.
Frontend
El frontend es una aplicación web simple que permite a los usuarios interactuar con el contrato inteligente a través de su navegador. Este frontend incluye las siguientes funcionalidades:

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

Interacción: Asegúrate de que tu billetera MetaMask esté conectada a la red correcta antes de intentar interactuar con el contrato.

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