// Verificación de Ethers.js
if (typeof ethers === 'undefined') {
    console.error('Ethers.js no está cargado correctamente');
    alert('Error: La biblioteca Ethers.js no se ha cargado. Por favor, recargue la página.');
  }
  
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
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256"}
      ],
      "name": "LiquidityAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256"}
      ],
      "name": "LiquidityRemoved",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
        {"indexed": false, "internalType": "address", "name": "tokenIn", "type": "address"},
        {"indexed": false, "internalType": "address", "name": "tokenOut", "type": "address"},
        {"indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256"},
        {"indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256"}
      ],
      "name": "TokensSwapped",
      "type": "event"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "amountA", "type": "uint256"},{"internalType": "uint256", "name": "amountB", "type": "uint256"}],
      "name": "addLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "address", "name": "_token", "type": "address"}],
      "name": "getPrice",
      "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getReserves",
      "outputs": [
        {"internalType": "uint256", "name": "reserveA", "type": "uint256"},
        {"internalType": "uint256", "name": "reserveB", "type": "uint256"}
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [{"internalType": "address", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "amountA", "type": "uint256"},{"internalType": "uint256", "name": "amountB", "type": "uint256"}],
      "name": "removeLiquidity",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "amountAIn", "type": "uint256"}],
      "name": "swapAforB",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{"internalType": "uint256", "name": "amountBIn", "type": "uint256"}],
      "name": "swapBforA",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenA",
      "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "tokenB",
      "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  
  // Función para conectar con MetaMask
  async function connectWallet() {
    try {
      // Verificación de Ethereum
      if (typeof window.ethereum === 'undefined') {
        console.error("MetaMask no está instalado");
        alert('Por favor, instale MetaMask para continuar');
        return;
      }
  
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
      document.getElementById('walletAddress').textContent = userAddress;
  
      // Actualizar la información del contrato
      await updateContractInfo();
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
      
      // Obtener precios de los tokens
      const tokenAAddress = await contract.tokenA();
      const tokenBAddress = await contract.tokenB();
      
      const priceA = await contract.getPrice(tokenAAddress);
      const priceB = await contract.getPrice(tokenBAddress);
      
      document.getElementById('priceA').textContent = `Precio Token A: ${priceA.toString()}`;
      document.getElementById('priceB').textContent = `Precio Token B: ${priceB.toString()}`;
      
      // Obtener dirección del owner
      const ownerAddress = await contract.owner();
      document.getElementById('owner').textContent = ownerAddress;
    } catch (error) {
      console.error("Error al obtener reservas o precios:", error);
      alert("No se pudo obtener la información del contrato.");
    }
  }
  
  // Listeners de eventos de MetaMask
  if (typeof window.ethereum !== 'undefined') {
    window.ethereum.on('accountsChanged', async (accounts) => {
      if (accounts.length > 0) {
        await connectWallet();
      } else {
        alert('Wallet desconectada');
        document.getElementById('contractDetailsSection').style.display = 'none';
        document.getElementById('walletAddress').textContent = 'No conectado';
      }
    });
  
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
  }
  