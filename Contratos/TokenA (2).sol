// SPDX-License-Identifier: MIT
// Compatible con OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

// Importación de contratos de OpenZeppelin: ERC20, ERC20Permit y Ownable
import {ERC20} from "@openzeppelin/contracts@5.1.0/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts@5.1.0/token/ERC20/extensions/ERC20Permit.sol";
import {Ownable} from "@openzeppelin/contracts@5.1.0/access/Ownable.sol";

/**
 * @title TokenA
 * @dev Contrato de un token ERC20 con funcionalidades de 'permit' para transacciones off-chain,
 * y un propietario que tiene la capacidad de acuñar nuevos tokens.
 * 
 * @author Adriana Cruz
 */
contract TokenA is ERC20, Ownable, ERC20Permit {

    // Definición de la cantidad inicial de tokens que el propietario (msg.sender) recibirá al desplegar el contrato.
    uint256 public constant INITIAL_SUPPLY = 10000 * 10**18; // 10,000 tokens con 18 decimales

    /**
     * @dev Constructor que inicializa el contrato con el nombre y símbolo del token,
     * así como establece al desplegador (msg.sender) como propietario del contrato.
     * También acuña la cantidad de tokens definida en 'INITIAL_SUPPLY' para el propietario.
     */
    constructor()
        // Inicializa el nombre y símbolo del token ERC20
        ERC20("TokenA", "TKA")
        // Establece al desplegador como propietario del contrato
        Ownable(msg.sender)
        // Inicializa el contrato ERC20Permit, permitiendo el uso de firmas off-chain
        ERC20Permit("TokenA")
    {
        // Acuña los tokens para el propietario (msg.sender) al momento del despliegue
        // El total de tokens acuñados es 'INITIAL_SUPPLY'
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    /**
     * @dev Función que permite al propietario acuñar nuevos tokens.
     * Solo el propietario del contrato puede ejecutar esta función.
     * 
     * @param to Dirección a la que se enviarán los tokens acuñados.
     * @param amount Cantidad de tokens a acuñar.
     */
    function mint(address to, uint256 amount) public onlyOwner {
        // Acuña la cantidad de tokens especificada y la transfiere a la dirección 'to'
        _mint(to, amount);
    }
    /**
 * @dev Extensión de `approve` que permite al usuario aprobar cantidades en enteros,
 * multiplicando automáticamente por 10^18 para incluir los decimales.
 *
 * @param spender Dirección que recibirá la asignación de tokens.
 * @param amount Cantidad de tokens en enteros (sin considerar decimales).
 */
function approveWithScaling(address spender, uint256 amount) public onlyOwner returns (bool) {
    uint256 scaledAmount = amount * 10**18; // Convierte el valor a la escala del token
    return approve(spender, scaledAmount);
}
}
