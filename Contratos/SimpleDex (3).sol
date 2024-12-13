// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title SimpleDex
 * @dev A simple decentralized exchange for swapping between two tokens (tokenA and tokenB).
 */
contract SimpleDex {
    IERC20 public tokenA;
    IERC20 public tokenB;
    address public owner;

    /**
     * @dev Constructor initializes the contract with two tokens and sets the deployer as the owner.
     * @param _tokenA Address of the first token.
     * @param _tokenB Address of the second token.
     */
    constructor(address _tokenA, address _tokenB) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token address");
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
        owner = msg.sender;
    }

    /**
     * @dev Ensures that only the owner can call certain functions.
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    /**
     * @dev Event emitted when liquidity is added.
     */
    event LiquidityAdded(uint256 amountA, uint256 amountB);

    /**
     * @dev Event emitted when liquidity is removed.
     */
    event LiquidityRemoved(uint256 amountA, uint256 amountB);

    /**
     * @dev Event emitted when tokens are swapped.
     */
    event TokensSwapped(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);

    /**
     * @dev Allows the owner to add liquidity to the pool.
     * @param amountA Amount of tokenA to add.
     * @param amountB Amount of tokenB to add.
     */
    function addLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");
        
        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        emit LiquidityAdded(amountA, amountB);
    }

    /**
     * @dev Allows the owner to remove liquidity from the pool.
     * @param amountA Amount of tokenA to remove.
     * @param amountB Amount of tokenB to remove.
     */
    function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner {
        require(amountA > 0 && amountB > 0, "Amounts must be greater than zero");
        
        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(amountA, amountB);
    }

    /**
     * @dev Swaps a specified amount of tokenA for tokenB.
     * @param amountAIn Amount of tokenA to swap.
     */
    function swapAforB(uint256 amountAIn) external {
        require(amountAIn > 0, "Amount must be greater than zero");

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        uint256 amountBOut = (reserveB * amountAIn) / (reserveA + amountAIn);
        require(amountBOut > 0, "Invalid output amount");

        tokenA.transferFrom(msg.sender, address(this), amountAIn);
        tokenB.transfer(msg.sender, amountBOut);

        emit TokensSwapped(msg.sender, address(tokenA), address(tokenB), amountAIn, amountBOut);
    }

    /**
     * @dev Swaps a specified amount of tokenB for tokenA.
     * @param amountBIn Amount of tokenB to swap.
     */
    function swapBforA(uint256 amountBIn) external {
        require(amountBIn > 0, "Amount must be greater than zero");

        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));
        require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");

        uint256 amountAOut = (reserveA * amountBIn) / (reserveB + amountBIn);
        require(amountAOut > 0, "Invalid output amount");

        tokenB.transferFrom(msg.sender, address(this), amountBIn);
        tokenA.transfer(msg.sender, amountAOut);

        emit TokensSwapped(msg.sender, address(tokenB), address(tokenA), amountBIn, amountAOut);
    }

    /**
     * @dev Returns the price of the given token in terms of the other token.
     * The token reserves are used to calculate the price.
     * @return The price as a uint256.
     */
    function getPrice(address _token) external view returns (uint256) {
        uint256 reserveA = tokenA.balanceOf(address(this));
        uint256 reserveB = tokenB.balanceOf(address(this));

        if (_token == address(tokenA)) {
            return (reserveB * 1e18) / reserveA; // Price of 1 tokenA in terms of tokenB
        } else {
            return (reserveA * 1e18) / reserveB; // Price of 1 tokenB in terms of tokenA
        }
    }

    /**
     * @dev Returns the current reserves of tokenA and tokenB in the contract.
     * @return reserveA The reserve of tokenA.
     * @return reserveB The reserve of tokenB.
     */
    function getReserves() external view returns (uint256 reserveA, uint256 reserveB) {
        reserveA = tokenA.balanceOf(address(this));
        reserveB = tokenB.balanceOf(address(this));
    }
}
