// Load ethers.js
const script = document.createElement('script');
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/ethers/5.7.2/ethers.umd.min.js';
script.type = 'text/javascript';
document.head.appendChild(script);

// Blockchain Configuration
const dexAddress = "0x569732cb9c74ec1b5ec3d5986c6030b889b2ab01";
const tokenAAddress = "0x5e4274E5671C10261Ad9457e6258b92119d434ca";
const tokenBAddress = "0xc78232Ad4157Eb71f602b05A275Feae3E771CfBa";

const dexAbi = [
    {"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityAdded","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"provider","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"inputAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outputAmount","type":"uint256"}],"name":"TokenSwappedAforB","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"inputAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"outputAmount","type":"uint256"}],"name":"TokenSwappedBforA","type":"event"},
    {"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],"name":"swapAforB","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],"name":"swapBforA","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getReserve","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}
];

const erc20Abi = [
    {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
];

let provider, signer, dexContract, tokenAContract, tokenBContract;

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Por favor instala MetaMask');
            return;
        }

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        const address = await signer.getAddress();

        dexContract = new ethers.Contract(dexAddress, dexAbi, signer);
        tokenAContract = new ethers.Contract(tokenAAddress, erc20Abi, signer);
        tokenBContract = new ethers.Contract(tokenBAddress, erc20Abi, signer);

        document.getElementById('connectWalletBtn').textContent = `Conectado: ${address.slice(0,6)}...${address.slice(-4)}`;
        await updatePricesAndReserves();
    } catch (error) {
        console.error("Error de conexión:", error);
        alert(`Error: ${error.message}`);
    }
}

async function addLiquidity() {
    if (!checkWalletConnection()) return;

    try {
        const amountA = document.getElementById('amountA').value;
        const amountB = document.getElementById('amountB').value;
        
        if (!amountA || !amountB) {
            alert('Ingresa ambas cantidades');
            return;
        }

        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);
        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);

        // Primero aprobar las transferencias
        const approvalA = await tokenAContract.approve(dexAddress, parsedAmountA);
        await approvalA.wait();
        
        const approvalB = await tokenBContract.approve(dexAddress, parsedAmountB);
        await approvalB.wait();

        // Luego agregar liquidez
        const tx = await dexContract.addLiquidity(parsedAmountA, parsedAmountB);
        await tx.wait();

        alert('Liquidez agregada exitosamente');
        await updatePricesAndReserves();
    } catch (error) {
        console.error("Error al agregar liquidez:", error);
        alert(`Error: ${error.message}`);
    }
}

async function removeLiquidity() {
    if (!checkWalletConnection()) return;

    try {
        const amountA = document.getElementById('amountARemove').value;
        const amountB = document.getElementById('amountBRemove').value;
        
        if (!amountA || !amountB) {
            alert('Ingresa ambas cantidades');
            return;
        }

        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);
        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);

        const tx = await dexContract.removeLiquidity(parsedAmountA, parsedAmountB);
        await tx.wait();

        alert('Liquidez retirada exitosamente');
        await updatePricesAndReserves();
    } catch (error) {
        console.error("Error al retirar liquidez:", error);
        alert(`Error: ${error.message}`);
    }
}

async function swapAforB() {
    if (!checkWalletConnection()) return;

    try {
        const amountA = document.getElementById('amountASwap').value;
        if (!amountA) {
            alert('Ingresa la cantidad a intercambiar');
            return;
        }

        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);
        
        // Aprobar primero
        const approval = await tokenAContract.approve(dexAddress, parsedAmountA);
        await approval.wait();

        const tx = await dexContract.swapAforB(parsedAmountA);
        await tx.wait();

        alert('Swap A por B realizado exitosamente');
        await updatePricesAndReserves();
    } catch (error) {
        console.error("Error en swap A por B:", error);
        alert(`Error: ${error.message}`);
    }
}

async function swapBforA() {
    if (!checkWalletConnection()) return;

    try {
        const amountB = document.getElementById('amountBSwap').value;
        if (!amountB) {
            alert('Ingresa la cantidad a intercambiar');
            return;
        }

        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);
        
        // Aprobar primero
        const approval = await tokenBContract.approve(dexAddress, parsedAmountB);
        await approval.wait();

        const tx = await dexContract.swapBforA(parsedAmountB);
        await tx.wait();

        alert('Swap B por A realizado exitosamente');
        await updatePricesAndReserves();
    } catch (error) {
        console.error("Error en swap B por A:", error);
        alert(`Error: ${error.message}`);
    }
}

function checkWalletConnection() {
    if (!provider) {
        alert('Por favor conecta tu billetera primero');
        return false;
    }
    return true;
}

async function updatePricesAndReserves() {
    if (!checkWalletConnection()) return;
    
    try {
        // Obtener reservas
        const [reserveA, reserveB] = await dexContract.getReserve();

        // Mostrar reservas
        document.getElementById('reserveA').textContent = `Reserva Token A: ${ethers.utils.formatUnits(reserveA, 18)}`;
        document.getElementById('reserveB').textContent = `Reserva Token B: ${ethers.utils.formatUnits(reserveB, 18)}`;

        // Solo calcular precios si hay liquidez
        if (reserveA.gt(0) && reserveB.gt(0)) {
            const priceA = await dexContract.getPrice(tokenAAddress);
            const priceB = await dexContract.getPrice(tokenBAddress);
            document.getElementById('priceA').textContent = `Precio Token A: ${ethers.utils.formatUnits(priceA, 18)} Token B`;
            document.getElementById('priceB').textContent = `Precio Token B: ${ethers.utils.formatUnits(priceB, 18)} Token A`;
        } else {
            document.getElementById('priceA').textContent = 'Precio Token A: No disponible (sin liquidez)';
            document.getElementById('priceB').textContent = 'Precio Token B: No disponible (sin liquidez)';
        }
    } catch (error) {
        console.error("Error al actualizar datos:", error);
    }
}

script.onload = () => {
    document.getElementById('connectWalletBtn').addEventListener('click', connectWallet);
    document.getElementById('addLiquidityBtn').addEventListener('click', addLiquidity);
    document.getElementById('removeLiquidityBtn').addEventListener('click', removeLiquidity);
    document.getElementById('swapAforBBtn').addEventListener('click', swapAforB);
    document.getElementById('swapBforABtn').addEventListener('click', swapBforA);
    document.getElementById('getReservesBtn').addEventListener('click', updatePricesAndReserves);
};