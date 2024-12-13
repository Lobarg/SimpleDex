const contractAddress = '0xCCC6E96acEb4b652962BC26a3dd2bA4CB0b89007';
const abi = [
    {"inputs":[{"internalType":"address","name":"_tokenA","type":"address"},{"internalType":"address","name":"_tokenB","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityAdded","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amountA","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"LiquidityRemoved","type":"event"},
    {"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"address","name":"tokenIn","type":"address"},{"indexed":false,"internalType":"address","name":"tokenOut","type":"address"},{"indexed":false,"internalType":"uint256","name":"amountIn","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amountOut","type":"uint256"}],"name":"TokensSwapped","type":"event"},
    {"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"addLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"address","name":"_token","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountA","type":"uint256"},{"internalType":"uint256","name":"amountB","type":"uint256"}],"name":"removeLiquidity","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountAIn","type":"uint256"}],"name":"swapAforB","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[{"internalType":"uint256","name":"amountBIn","type":"uint256"}],"name":"swapBforA","outputs":[],"stateMutability":"nonpayable","type":"function"},
    {"inputs":[],"name":"tokenA","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},
    {"inputs":[],"name":"tokenB","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"}
];

let provider, signer, contract, userAddress, tokenAAddress, tokenBAddress;

document.getElementById('connectButton').addEventListener('click', connectWallet);

async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('MetaMask no está instalado');
        return;
    }

    try {
        // Cambiar a la red Sepolia si no está conectado
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
        });

        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        signer = provider.getSigner();
        userAddress = await signer.getAddress();

        document.getElementById('walletAddress').textContent = userAddress;
        document.getElementById('contractInterface').style.display = 'block';

        contract = new ethers.Contract(contractAddress, abi, signer);

        // Obtener direcciones de tokens
        tokenAAddress = await contract.tokenA();
        tokenBAddress = await contract.tokenB();

        console.log('Token A Address:', tokenAAddress);
        console.log('Token B Address:', tokenBAddress);

        await updateContractInfo();
        setupEventListeners();
    } catch (error) {
        console.error("Error connecting wallet:", error);
        alert('Error conectando la wallet: ' + error.message);
    }
}

function setupEventListeners() {
    document.getElementById('addLiquidityBtn').addEventListener('click', addLiquidity);
    document.getElementById('removeLiquidityBtn').addEventListener('click', removeLiquidity);
    document.getElementById('swapAforBBtn').addEventListener('click', swapAforB);
    document.getElementById('swapBforABtn').addEventListener('click', swapBforA);
    document.getElementById('updatePricesBtn').addEventListener('click', updateContractInfo);
    document.getElementById('updateReservesBtn').addEventListener('click', updateContractInfo);
    document.getElementById('fetchEventsBtn').addEventListener('click', searchEvents);
}

async function updateContractInfo() {
    try {
        if (!contract) {
            throw new Error('Contrato no inicializado');
        }

        // Verificar que tengamos las direcciones de los tokens
        if (!tokenAAddress || !tokenBAddress) {
            tokenAAddress = await contract.tokenA();
            tokenBAddress = await contract.tokenB();
        }

        const [priceA, priceB, reserves] = await Promise.all([
            contract.getPrice(tokenAAddress),
            contract.getPrice(tokenBAddress),
            contract.getReserves()
        ]);

        document.getElementById('priceA').textContent = `Precio Token A: ${ethers.utils.formatUnits(priceA, 18)}`;
        document.getElementById('priceB').textContent = `Precio Token B: ${ethers.utils.formatUnits(priceB, 18)}`;
        document.getElementById('reserveA').textContent = `Reserva Token A: ${ethers.utils.formatUnits(reserves[0], 18)}`;
        document.getElementById('reserveB').textContent = `Reserva Token B: ${ethers.utils.formatUnits(reserves[1], 18)}`;
    } catch (error) {
        console.error("Error detallado al actualizar información:", error);
        alert(`Error actualizando información: ${error.message}\n\nDetalles completos en la consola.`);
    }
}

async function addLiquidity() {
    const amountA = document.getElementById('addLiquidityAmountA').value;
    const amountB = document.getElementById('addLiquidityAmountB').value;

    try {
        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);
        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);

        const tx = await contract.addLiquidity(parsedAmountA, parsedAmountB);
        await tx.wait();
        await updateContractInfo();
        alert('Liquidez agregada exitosamente');
    } catch (error) {
        console.error("Error adding liquidity:", error);
        alert('Error agregando liquidez: ' + error.message);
    }
}

async function removeLiquidity() {
    const amountA = document.getElementById('removeLiquidityAmountA').value;
    const amountB = document.getElementById('removeLiquidityAmountB').value;

    try {
        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);
        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);

        const tx = await contract.removeLiquidity(parsedAmountA, parsedAmountB);
        await tx.wait();
        await updateContractInfo();
        alert('Liquidez retirada exitosamente');
    } catch (error) {
        console.error("Error removing liquidity:", error);
        alert('Error retirando liquidez: ' + error.message);
    }
}

async function swapAforB() {
    const amountA = document.getElementById('swapAmountA').value;

    try {
        const parsedAmountA = ethers.utils.parseUnits(amountA, 18);

        const tx = await contract.swapAforB(parsedAmountA);
        await tx.wait();
        await updateContractInfo();
        alert('Swap A por B exitoso');
    } catch (error) {
        console.error("Error swapping A for B:", error);
        alert('Error en swap A por B: ' + error.message);
    }
}

async function swapBforA() {
    const amountB = document.getElementById('swapAmountB').value;

    try {
        const parsedAmountB = ethers.utils.parseUnits(amountB, 18);

        const tx = await contract.swapBforA(parsedAmountB);
        await tx.wait();
        await updateContractInfo();
        alert('Swap B por A exitoso');
    } catch (error) {
        console.error("Error swapping B for A:", error);
        alert('Error en swap B por A: ' + error.message);
    }
}

async function searchEvents() {
    try {
        const filter = contract.filters.TokensSwapped();
        const events = await contract.queryFilter(filter, -1000);

        const eventResults = document.getElementById('eventResults');
        eventResults.innerHTML = events.map(event => `
            <div class="event-item">
                <p>Usuario: ${event.args.user}</p>
                <p>Token In: ${event.args.tokenIn}</p>
                <p>Token Out: ${event.args.tokenOut}</p>
                <p>Monto In: ${ethers.utils.formatUnits(event.args.amountIn, 18)}</p>
                <p>Monto Out: ${ethers.utils.formatUnits(event.args.amountOut, 18)}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error("Error fetching events:", error);
        alert('Error cargando eventos: ' + error.message);
    }
}