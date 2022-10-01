# Token Address and Verified Code

https://testnet.bscscan.com/address/0x4c4358DA60Ca1deb81614Ffa128bF722d1fa27bD#code

# Presale Address and Verified Code

https://testnet.bscscan.com/address/0x228c22518f4f9b106f1c53399eb563ec30d161f1#code

.env requires API_key for verifying as well as MNEMONIC for deploying

cd client
npm install or yarn
npm start or yarn start

Only contract deployer can view admin panel and create a new presale round!

client/src/App.js

              <Route
                path="/mint"
                element={
                  Boolean(userCtx.appOwner === web3Ctx.account) ? (
                    <MintPeriod />
                  ) : (
                    <NotFound />
                  )
                }
              />

              <Route
                path="/admin"
                element={
                  Boolean(userCtx.appOwner === web3Ctx.account) ? (
                    <Admin />
                  ) : (
                    <NotFound />
                  )
                }
              />

change ---< NotFound / >---- to the same as the option to it's left to display AppOwner areas during local usage
you will not be able to interact with the contracts like the admin would so I advise just redeploying!

# To Deploy

Ensure you have truffle installed globally

truffle migrate --network testnet --reset

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

The addresses in the constructor will need to be changed but for now they are just spam for demo usage
