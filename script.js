let provider;
let signer;
let userAddress;
let contract;
const contractAddress = "0xCCC6E96acEb4b652962BC26a3dd2bA4CB0b89007";  // Asegúrate de reemplazar con la dirección correcta de tu contrato
const abi = [
  {
    "inputs": [{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],
    "stateMutability":"nonpayable",
    "type":"constructor"
  },
  {
    "anonymous":false,
    "inputs":[{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],
    "name":"LiquidityAdded",
    "type":"event"
  },
  {
    "anonymous":false,
    "inputs":[{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],
    "name":"LiquidityRemoved",
    "type":"event"
  },
  {
    "anonymous":false,
    "inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":false,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],
    "name":"TokensSwapped",
    "type":"event"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],
    "name":"addLiquidity",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"address","name":"_token","type":"address"}],
    "name":"getPrice",
    "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getReserves",
    "outputs":[{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"owner",
    "outputs":[{"internalType":"address","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],
    "name":"removeLiquidity",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],
    "name":"swapAforB",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],
    "name":"swapBforA",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"tokenA",
    "outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"tokenB",
    "outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],
    "stateMutability":"view",
    "type":"function"
  }
];

// Función para conectar con MetaMask
async function connectWallet() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      console.log("MetaMask está instalado");

      // Crear el proveedor de ethers.js a partir de MetaMask
      provider = new ethers.providers.Web3Provider(window.ethereum);

      // Solicitar cuentas a MetaMask
      const accounts = await provider.send("eth_requestAccounts", []);

      if (accounts.length === 0) {
        alert("No se pudo obtener ninguna cuenta desde MetaMask.");
        return;
      }

      // Obtener el primer signer (la cuenta de MetaMask)
      signer = provider.getSigner();
      userAddress = await signer.getAddress();

      // Crear el contrato interactuable
      contract = new ethers.Contract(contractAddress, abi, signer);

      console.log("Conexión establecida con MetaMask. Dirección de usuario:", userAddress);

      // Mostrar la sección del contrato después de conectar
      document.getElementById('contractDetailsSection').style.display = 'block';

      // Actualizar la información del contrato
      updateContractInfo();
    } else {
      console.error("MetaMask no está instalado. Por favor, instálalo.");
      alert('Por favor, instale MetaMask para interactuar con el contrato.');
    }
  } catch (error) {
    console.error("Error al conectar MetaMask:", error);
    alert('Hubo un problema al conectar con MetaMask: ' + error.message);
  }
}

// Función para obtener la información de las reservas
async function getReserves() {
  try {
    const reserves = await contract.getReserves();
    document.getElementById('reserveA').textContent = reserves[0].toString();
    document.getElementById('reserveB').textContent = reserves[1].toString();
  } catch (error) {
    console.error("Error al obtener reservas:", error);
    alert("No se pudo obtener la información de reservas.");
  }
}

// Función para obtener el precio de un token
async function getPrice(tokenAddress) {
  try {
    const price = await contract.getPrice(tokenAddress);
    document.getElementById('tokenPrice').textContent = price.toString();
  } catch (error) {
    console.error("Error al obtener el precio:", error);
    alert("No se pudo obtener el precio del token.");
  }
}

// Función para agregar liquidez
async function addLiquidity() {
  const amountA = document.getElementById('amountA').value;
  const amountB = document.getElementById('amountB').value;

  try {
    const tx = await contract.addLiquidity(amountA, amountB);
    console.log("Transacción enviada:", tx);
    alert("Liquidez añadida con éxito!");
  } catch (error) {
    console.error("Error al añadir liquidez:", error);
    alert("No se pudo añadir liquidez.");
  }
}

// Función para actualizar la información del contrato
async function updateContractInfo() {
  await getReserves();
}
