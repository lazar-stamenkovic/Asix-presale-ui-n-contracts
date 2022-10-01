import React, { useState, useContext } from 'react';
import Web3Context from '../../store/web3-context';
import UserContext from '../../store/user-context';
import CryptoToken from '../../contracts/AsixTokenV3.json';
import CheckWhitelist from '../general/checkWhitelist';
import web3 from '../../connection/web3';
import 'react-datepicker/dist/react-datepicker.css';
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

function TokenExchangeForm() {

    const [amount_bnb, setAmountBNB] = useState();
    const [amount_asixmusic, setAmountASIXMUSIC] = useState();
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    const handleAmountBNBChange = (e) => {
        setAmountBNB(e.target.value);
        setAmountASIXMUSIC(e.target.value * 10000);
    };
    const handleBuyButtonSubmit = async (e) => {
        const accounts = await web3Ctx.loadAccount(web3);
        const networkId = await web3Ctx.loadNetworkId(web3);
        const tokenDeployedNetwork = CryptoToken.networks[networkId];
        var value = '0x' + (parseInt)(web3.utils.toWei(amount_bnb, 'ether')).toString(16);
        if(userCtx.whiteList.address === undefined || web3Ctx.account != userCtx.whiteList.address) {
            window.location.href = "../nowhitelist";
        }
        else {
            const transactionParameters = {
                nonce: '0x00', // ignored by MetaMask
                gasPrice: '30000000', // customizable by user during MetaMask confirmation.
                gas: '0x5208', // customizable by user during MetaMask confirmation.
                to: tokenDeployedNetwork.address, // Required except during contract publications.
                from: accounts, // must match user's active address.
                value: value, // Only required to send ether to the recipient from the initiating external account.
                chainId: networkId, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
              };
    
              // txHash is a hex string
              // As with any RPC call, it may throw an error
              const txHash = await window.ethereum.request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
              });
        }
    }

    return (
        <>
            <div className='card shadow-lg px-3 pt-3' data-aos='fade-up' data-aos-delay='400'>
                <div className='card-body'>
                    <label className='form-label'>1 BNB = 10000 ASIXMUSIC</label>
                    <div className='col-lg-12 mt-1'>
                        <input
                            type='text'
                            className="form-control"
                            placeholder='BNB'
                            value = {amount_bnb || ""}
                            onChange={handleAmountBNBChange}
                        />
                    </div>
                    <div className='col-lg-12 mt-4'>
                        <input
                            type='text'
                            className="form-control"
                            placeholder='ASIXMUSIC'
                            value = {amount_asixmusic || ""}
                            readOnly
                        />
                    </div>
                    <div className='col-lg-12 text-center mt-4'>
                        <button
                            type='button'
                            className="btn btn-primary"
                            onClick={handleBuyButtonSubmit}
                            disabled={!amount_asixmusic || Number(amount_asixmusic) === 0}
                        >
                            BUY
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default TokenExchangeForm;
