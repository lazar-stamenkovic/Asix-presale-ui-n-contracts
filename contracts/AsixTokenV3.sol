// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./AsixV3Presale.sol";

contract AsixTokenV3 is ERC20, Ownable{
	   using SafeMath for uint256;

    uint256 public id;
    uint256 pendingCount;
    uint256 _decimals = 10**decimals();
    uint256 public price;
    uint256 public totalPurchased;
    uint256 public hardcap;
    bool public activePeriod;
    AsixV3Presale tokensale;
    mapping(address => uint256) public contributers;
    mapping(address => uint256) funds;
    mapping(uint256 => Period) public periods;
    mapping(address => mapping(uint256 => bool)) public userDetails; // userDetails[_who][purchasedAmount] = true (if has reached limit)

    Purchased[] purchasedTokens;

    /* ========= Structs ======== */ 
    struct Period{
      uint256 startTime;
      uint256 endTime;
      uint256 price;
      uint256 amount;
      uint256 remaining;
      uint256 hardcap;
      bool active;
    }

    struct Purchased{
        address _address;
        uint256 _amount;
        uint256 _price;
        uint256 _time;
    }

    /* ========= Modifiers ======== */ 
    modifier isActive() {
        require(activePeriod , "No active period");
        _;
    }
    modifier isValidate(uint256 _amount, uint256 _num) {
        _amount = _amount.mul(_decimals.div(10**_num));
        require(_amount >= getMinimumTokens() && _value(_amount) != 0, "The amount of tokens must be greater than minimum tokens");
        // require(_value(_amount) == msg.value, "Entered value dosn't equal to tokens price");
        require(_amount <= periods[id].remaining, "No available tokens in active period");
        require(msg.sender != address(0),"Unknown address");
        _;
    }

    modifier onlyOwnToken(address _spender){
        require(msg.sender == owner() || msg.sender == _spender, "Permission denied for this address");
        _;
    }

    modifier onlyWhitelist(){
        require(tokensale.checkWhitelist(msg.sender) || msg.sender == owner(), "Permission denied for this address");
        _;
    }

    /* ========= Events ======== */ 
    event MintTokens(uint256 startTime, uint256 endTime, uint256 amount, uint256 price);

    constructor(string memory _name, string memory _symbol, address _tokensale) ERC20(_name, _symbol) {
        tokensale = AsixV3Presale(_tokensale);
        _mint(address(this), 10e13 * _decimals);
        address marketing = 0xbAd1A9503A1FbE4e3B6DA8C32Ef50709446Ff945;
        address staking = 0xbAd1A9503A1FbE4e3B6DA8C32Ef50709446Ff945;
        address team = 0xbAd1A9503A1FbE4e3B6DA8C32Ef50709446Ff945;
        address protocol = 0xbAd1A9503A1FbE4e3B6DA8C32Ef50709446Ff945;
        _transfer(address(this), marketing, 13e12 * _decimals); // 13 trillion
        _transfer(address(this), staking, 5e12 * _decimals); // 5 trillion
        _transfer(address(this), team, 18e12 * _decimals); // 18 trillion
        _transfer(address(this), protocol, 24e12 * _decimals); // 24 trillion
        // this address holds all other tokens (40 Trillion)
    }

    /*====================================================================================
                                        Minting Method
    ====================================================================================*/
    function mintTokens(uint256 _startTime, uint256 _endTime, uint256 _amount, uint256 _price, uint _hardcap) public onlyWhitelist returns(bool){
        _amount *= _decimals;
        _preValidateMint(_startTime, _endTime, _amount, _hardcap);
        _initialMint(_startTime, _endTime, _amount, _price, _hardcap);

        tokensale.addActivity(msg.sender, _amount, price, block.timestamp, id, "Mint");
        emit MintTokens(_startTime, _endTime, price, _amount);
        return true;
    }

    /*====================================================================================
                                            Token Methods
    ====================================================================================*/ 
	function requestToken(uint256 _amount, uint256 _num) payable public isActive isValidate(_amount, _num){
        _amount = _amount.mul(_decimals.div(10**_num));
        totalPurchased += _amount;
        contributers[msg.sender] += _amount;
        funds[msg.sender] += msg.value;
        periods[id].remaining = periods[id].remaining - _amount;
        updatePending(msg.sender, _amount);
        tokensale.addActivity(msg.sender, _amount, price, block.timestamp, id, "Request tokens");
        pendingCount++;
    }

    function approveToken(address _spender) public onlyOwner returns(bool){
        require(contributers[_spender] > 0, "This address doesn't have any pending tokens");
        _transfer(address(this), _spender, contributers[_spender]);

        payable(owner()).transfer(funds[_spender]);
        deletePending(_spender);

        purchasedTokens.push(Purchased(_spender, contributers[_spender], price, block.timestamp));
        tokensale.addActivity(_spender, contributers[_spender], price, block.timestamp, id, "Approved");
        contributers[_spender] = funds[_spender] = 0;
        pendingCount--;
        return true;
    }

    function disApproveToken(address _spender) public onlyOwnToken(_spender) returns(bool){
        require(contributers[_spender] > 0, "This address doesn't have any pending tokens");
        payable(_spender).transfer(funds[_spender]);
        periods[id].remaining = periods[id].remaining + contributers[_spender];
        totalPurchased -= contributers[_spender];
        deletePending(_spender);
        tokensale.addActivity(_spender, contributers[_spender], price, block.timestamp, id, "Dis approved!");
        contributers[_spender] = funds[_spender] = 0;
        pendingCount--;
        return true;
    }

    function getPurchasedTokens(address _address) public view returns(Purchased[] memory){
        uint256 _length = purchasedTokens.length;
        Purchased[] memory _purchasedTokens = new Purchased[](_length); 
        for(uint256 i = 0; i < _length; i++){
            if(purchasedTokens[i]._address == _address){
            _purchasedTokens[i] = purchasedTokens[i];
            }
        }
        return _purchasedTokens;
    }

    function getMinimumTokens() public view returns(uint256){
        if ( _decimals > price) return  _decimals.div(price);
        return 1;
    }

    /*====================================================================================
                                    Period Methods
    ====================================================================================*/
    function getPeriods() public view returns(Period[] memory){
        Period[] memory _periods = new Period[](id);
        for(uint256 i = 0; i < id; i++){
            _periods[i] = periods[i + 1];
        }
        return _periods;
    }

    function getActivePeriod() public view returns(Period memory){
        Period memory _period = periods[id];
        return _period;
    }

    function deactivatePeriod() public onlyOwner returns(bool){
        if(pendingCount > 0) return false;
        periods[id].active = false;
        activePeriod = false;
        return true;
    }

    /*====================================================================================
                                User Methods
    ====================================================================================*/ 
    function addUser(address _address, string memory _name) public returns(bool){
        tokensale.addUser(_address, _name);
        return true;
    }

    function addToWhitelist(address _address) public onlyOwner returns(bool){
        require(!tokensale.checkWhitelist(_address), "This address already exist");
        require(_address != address(0), "Unknown address");
        tokensale.addToWhitelist(_address);
        tokensale.addActivity(_address, 0, 0, block.timestamp, id, "Added to whitelist");
        return true;
    }
    
    function removeFromWhitelist(address _address) public returns(bool){
        if (tokensale.removeFromWhitelist(_address)) {
            tokensale.addActivity(_address, 0, 0, block.timestamp, id, "Removed from whitelist");
            return true;
        } 
        return false;
    }

    /*====================================================================================
                                        Internal Methods
    ====================================================================================*/ 
    function deletePending(address _spender) internal returns(bool){
         return tokensale.deletePending(_spender);
    }

    function updatePending(address _spender, uint256 _amount) internal returns(bool){
        return tokensale.updatePending(_spender, _amount);
    }

    function _preValidateMint(uint256 _startTime, uint256 _endTime, uint256 _amount, uint256 _hardcap) internal view{
        require( _startTime < _endTime && _endTime > block.timestamp, "Undefined time");
        require(_amount <= totalSupply() && _amount > 0 , "The amount of tokens must be greater than 0 and less than total supply");
        require(_amount <= (totalSupply().sub(totalPurchased)), "No available tokens for this amount");
        require( pendingCount == 0, "There are token requests pending");
        require(_hardcap >= hardcap, "require a hardcap figure more than or greater to the last");
    }

    function _initialMint(uint256 _startTime, uint256 _endTime, uint256 _amount, uint256 _price, uint _hardcap) internal returns(bool){
        if(id > 0) periods[id].active = false;
        price = _price;
        hardcap = _hardcap;
        id++;
        periods[id] = Period(_startTime, _endTime, _price, _amount, _amount, _hardcap, true);
        return activePeriod = true;
    }

    function _value(uint256 _amount) internal view returns(uint256){
        if ( _decimals > price) {
            return  _amount.div(_decimals.div(price));
        }
        return price.div(_decimals) * _amount;
    }

    /*====================================================================================
	   Fallback: reverts if Ether is sent to this smart-contract by mistake
    ====================================================================================*/ 
    fallback () external {revert();}
}