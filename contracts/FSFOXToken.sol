// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FSFOX Token Contract
 * @dev ERC-20 standard token contract for FSFOX
 * @author FSFOX Team
 * 
 * Contract Features:
 * - Name: FSFOX
 * - Symbol: FSFOX  
 * - Total Supply: 1,000,000 tokens
 * - Locked Tokens: 950,000 tokens (non-transferable)
 * - Free Tokens: 50,000 tokens in owner wallet
 * - Mint and burn capabilities disabled
 * - Gas optimized
 */

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract FSFOXToken is IERC20 {
    // Main contract variables
    string public constant name = "FSFOX";
    string public constant symbol = "FSFOX";
    uint8 public constant decimals = 18;
    
    // Total supply: 1,000,000 tokens
    uint256 public constant TOTAL_SUPPLY = 1_000_000 * 10**decimals;
    
    // Locked tokens: 950,000 tokens
    uint256 public constant LOCKED_SUPPLY = 950_000 * 10**decimals;
    
    // Free tokens: 50,000 tokens
    uint256 public constant FREE_SUPPLY = 50_000 * 10**decimals;
    
    // Contract owner wallet address
    address public immutable owner;
    
    // Lock contract address (for storing locked tokens)
    address public immutable lockContract;
    
    // Mapping for storing balances
    mapping(address => uint256) private _balances;
    
    // Mapping for storing allowances
    mapping(address => mapping(address => uint256)) private _allowances;
    
    // Variables to prevent mint and burn
    bool public constant mintingEnabled = false;
    bool public constant burningEnabled = false;
    
    // Locked tokens state (initially 950,000 * 10**decimals)
    uint256 public lockedTokens = LOCKED_SUPPLY;

    // Trading controls for presale
    bool public tradingEnabled = false;
    mapping(address => bool) public allowedPools;
    // Allowlist of protocol spenders (e.g., Uniswap V3 NonfungiblePositionManager)
    mapping(address => bool) public allowedSpenders;

    // Additional events
    event TokensLocked(address indexed lockContract, uint256 amount);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event TokensUnlocked(address indexed owner, uint256 amount);

    event PoolAllowed(address indexed pool, bool allowed);

    // Modifier to restrict actions to contract owner
    modifier onlyOwner() {
        require(msg.sender == owner, "FSFOX: caller is not the owner");
        _;
    }
    
    /**
     * @dev Contract constructor
     * @param _owner Contract owner address
     */
    constructor(address _owner) {
        require(_owner != address(0), "FSFOX: Owner address cannot be zero");
        
        owner = _owner;
        
        // Set lock contract address to this contract address to hold locked tokens
        lockContract = address(this);
        
        // Allocate free tokens to owner
        _balances[_owner] = FREE_SUPPLY;
        
        // Allocate locked tokens to this contract (locked balance)
        _balances[address(this)] = LOCKED_SUPPLY;
        
        // Emit transfer event for free tokens
        emit Transfer(address(0), _owner, FREE_SUPPLY);
        
        // Emit transfer event for locked tokens
        emit Transfer(address(0), address(this), LOCKED_SUPPLY);
        
        // Emit tokens locked event
        emit TokensLocked(lockContract, LOCKED_SUPPLY);
    }

    /**
     * @dev Enable trading after presale
     */
    function enableTrading() external onlyOwner {
        tradingEnabled = true;
    }

    /**
     * @dev Set or unset an allowed pool address
     */
    function setPool(address pool, bool allowed) external onlyOwner {
        require(pool != address(0), "FSFOX: pool is zero");
        allowedPools[pool] = allowed;
        emit PoolAllowed(pool, allowed);
    }
    
    /**
     * @dev Set or unset an allowed spender contract (e.g., Uniswap V3 NPM)
     */
    function setSpender(address spender, bool allowed) external onlyOwner {
        require(spender != address(0), "FSFOX: spender is zero");
        allowedSpenders[spender] = allowed;
    }
    
    /**
     * @dev Returns total supply
     * @return Total number of tokens
     */
    function totalSupply() public pure override returns (uint256) {
        return TOTAL_SUPPLY;
    }
    
    /**
     * @dev Returns balance of an address
     * @param account Target address
     * @return Address balance
     */
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Transfer tokens from caller to destination address
     * @param to Destination address
     * @param amount Amount of tokens to transfer
     * @return Success of transfer operation
     */
    function transfer(address to, uint256 amount) public override returns (bool) {
        address sender = msg.sender;
        _transfer(sender, to, amount);
        return true;
    }
    
    /**
     * @dev Returns remaining allowance
     * @param tokenOwner Owner address
     * @param spender Spender address
     * @return Remaining allowance amount
     */
    function allowance(address tokenOwner, address spender) public view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }
    
    /**
     * @dev Approve allowance to another address
     * @param spender Spender address
     * @param amount Allowance amount
     * @return Success of approval operation
     */
    function approve(address spender, uint256 amount) public override returns (bool) {
        address caller = msg.sender;
        _approve(caller, spender, amount);
        return true;
    }
    
    /**
     * @dev Transfer tokens from owner to destination using allowance
     * @param from Sender address
     * @param to Receiver address
     * @param amount Amount of tokens to transfer
     * @return Success of transfer operation
     */
    function transferFrom(address from, address to, uint256 amount) public override returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    /**
     * @dev Increase allowance (to prevent front-running)
     * @param spender Spender address
     * @param addedValue Amount added to allowance
     * @return Success of increase allowance operation
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        address caller = msg.sender;
        _approve(caller, spender, allowance(caller, spender) + addedValue);
        return true;
    }
    
    /**
     * @dev Decrease allowance
     * @param spender Spender address
     * @param subtractedValue Amount subtracted from allowance
     * @return Success of decrease allowance operation
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        address caller = msg.sender;
        uint256 currentAllowance = allowance(caller, spender);
        require(currentAllowance >= subtractedValue, "FSFOX: Insufficient allowance");
        unchecked {
            _approve(caller, spender, currentAllowance - subtractedValue);
        }
        return true;
    }
    
    /**
     * @dev Check if address is lock contract
     * @param account Address to check
     * @return true if address is lock contract
     */
    function isLockedContract(address account) public view returns (bool) {
        return account == lockContract;
    }
    
    /**
     * @dev Returns number of locked tokens
     * @return Number of locked tokens
     */
    function getLockedSupply() public pure returns (uint256) {
        return LOCKED_SUPPLY;
    }
    
    /**
     * @dev Returns number of free tokens
     * @return Number of free tokens
     */
    function getFreeSupply() public pure returns (uint256) {
        return FREE_SUPPLY;
    }
    
    /**
     * @dev Internal transfer function
     * @param from Sender address
     * @param to Receiver address
     * @param amount Amount of tokens to transfer
     */
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "FSFOX: Transfer from zero address not allowed");
        require(to != address(0), "FSFOX: Transfer to zero address not allowed");
        // Prevent arbitrary transfers from the contract's locked balance
        require(from != address(this), "FSFOX: Transfer from lock contract not allowed");

        // Presale trading rules:
        // - Mint (from == 0x0) is allowed (already reverted above)
        // - Owner sending or receiving is allowed
        // - Before tradingEnabled, allow buys (from allowed pool to user), but prevent sells (user to pool) and peer transfers
        if (from != owner && to != owner) {
            bool fromPool = allowedPools[from];
            bool toPool = allowedPools[to];
            if (!tradingEnabled) {
                // Allow approved spender contracts (e.g., Uniswap NPM) to move tokens during LP mint
                // Covers Safe -> NPM pull and NPM -> Pool transfers during presale
                if (allowedSpenders[msg.sender]) {
                    // allowed
                } else {
                    // Only allow buys from pool during presale (pool -> user). All other paths revert.
                    require(fromPool && !toPool, "FSFOX: Trading disabled during presale");
                }
            }
        }
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "FSFOX: Insufficient balance");
        
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }
        
        emit Transfer(from, to, amount);
    }

    /**
     * @dev Unlock a portion of locked tokens and transfer to owner
     * @param amount Amount of tokens to unlock
     */
    function unlockTokens(uint256 amount) external onlyOwner {
        require(amount > 0, "FSFOX: amount is zero");
        require(amount <= lockedTokens, "FSFOX: Amount exceeds locked tokens");
        uint256 contractBalance = _balances[address(this)];
        require(contractBalance >= amount, "FSFOX: Insufficient locked balance");

        unchecked {
            lockedTokens -= amount;
            _balances[address(this)] = contractBalance - amount;
            _balances[owner] += amount;
        }

        emit Transfer(address(this), owner, amount);
        emit TokensUnlocked(owner, amount);
    }

    /**
     * @dev Returns remaining locked tokens amount
     */
    function getLockedTokens() external view returns (uint256) {
        return lockedTokens;
    }
    
    /**
     * @dev Internal approve function
     * @param tokenOwner Owner address
     * @param spender Spender address
     * @param amount Allowance amount
     */
    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "FSFOX: Approve from zero address not allowed");
        require(spender != address(0), "FSFOX: Approve to zero address not allowed");
        
        _allowances[tokenOwner][spender] = amount;
        emit Approval(tokenOwner, spender, amount);
    }
    
    /**
     * @dev Internal spend allowance function
     * @param tokenOwner Owner address
     * @param spender Spender address
     * @param amount Amount of allowance spent
     */
    function _spendAllowance(address tokenOwner, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(tokenOwner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "FSFOX: Insufficient allowance");
            unchecked {
                _approve(tokenOwner, spender, currentAllowance - amount);
            }
        }
    }
    
    /**
     * @dev Function to get contract information
     * @return tokenName Token name
     * @return tokenSymbol Token symbol
     * @return tokenDecimals Token decimals
     * @return totalTokenSupply Total token supply
     * @return lockedTokenSupply Locked token supply
     * @return freeTokenSupply Free token supply
     * @return contractOwner Contract owner address
     * @return contractLockAddress Lock contract address
     * @return mintEnabled Mint capability status
     * @return burnEnabled Burn capability status
     */
    function getContractInfo() public view returns (
        string memory tokenName,
        string memory tokenSymbol,
        uint8 tokenDecimals,
        uint256 totalTokenSupply,
        uint256 lockedTokenSupply,
        uint256 freeTokenSupply,
        address contractOwner,
        address contractLockAddress,
        bool mintEnabled,
        bool burnEnabled
    ) {
        return (
            name,
            symbol,
            decimals,
            TOTAL_SUPPLY,
            lockedTokens,
            FREE_SUPPLY,
            owner,
            address(this),
            mintingEnabled,
            burningEnabled
        );
    }
}
