import React, { useEffect, useContext, useState } from 'react';
import { useToasts } from 'react-toast-notifications';
import { ImClock2 } from 'react-icons/im';
import { FaEthereum } from 'react-icons/fa';
import { AiFillInfoCircle } from 'react-icons/ai';
import { formatDate, toEther } from '../../helpers/utils';
import TokenContext from '../../store/token-context';
import UserContext from '../../store/user-context';
import Web3Context from '../../store/web3-context';
import AOS from 'aos';

import MetaMaskLoader from '../general/MetaMaskLoader';

function CancelPeriod() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    const [activePeriod, setActivePeriod] = useState(null);
    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const { addToast } = useToasts();

    function deactivatePeriodHandler() {
        tokenCtx.contract.methods
            .deactivatePeriod()
            .send({ from: web3Ctx.account })
            .once('sending', () => {
                setMetaMaskOpened(true);
            })
            .on('transactionHash', (hash) => {
                setMetaMaskOpened(false);
                addToast(`Great! you have successfully minted your tokens`, {
                    appearance: 'success',
                });
            })
            .on('receipt', (receipt) => {
                tokenCtx.loadTotalSupply(tokenCtx.contract);
                tokenCtx.loadActivePeriod(tokenCtx.contract);
                tokenCtx.loadPeriods(tokenCtx.contract);
                tokenCtx.loadActivity(userCtx.contract);
                tokenCtx.loadMinimumTokens(tokenCtx.contract);
                tokenCtx.loadTokenPrice(tokenCtx.contract);
            })
            .on('error', (e) => {
                addToast(`Something went wrong while minting tokens`, {
                    appearance: 'error',
                });
                setMetaMaskOpened(false);
            });
    }

    useEffect(() => {
        if (tokenCtx.activePeriod) {
            setActivePeriod(tokenCtx.activePeriod);
        }
    }, [tokenCtx.activePeriod]);

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}
            <div className='card shadow-lg' data-aos='fade-up' data-aos-delay='300'>
                <div className='card-body p-lg-5'>
                    <h2 className='h4'>Deactivate Active Period</h2>
                    <p className='text-muted text-sm mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    {activePeriod && activePeriod.status ? (
                        <>
                            <ul className='list-unstyled mb-3'>
                                <li className='rounded-lg bg-gray-100 d-flex align-items-center py-2 px-3 my-2 flex-wrap fw-bold text-primary text-sm'>
                                    <ImClock2 />
                                    <span className='fw-normal mx-2 text-gray-700'>Ends at</span>
                                    {formatDate(parseFloat(activePeriod.endTime))}
                                </li>
                                <li className='rounded-lg bg-gray-100 d-flex align-items-center py-2 px-3 my-2 flex-wrap fw-bold text-primary text-sm'>
                                    <FaEthereum size='1.2rem' />
                                    <span className='fw-normal mx-2 text-gray-700'>Remaining tokens</span>
                                    {toEther(activePeriod.remainingTokens)}
                                </li>
                            </ul>
                            <button
                                className='btn btn-danger w-100'
                                type='button'
                                disabled={Boolean(userCtx.appOwner !== web3Ctx.account)}
                                onClick={deactivatePeriodHandler}
                            >
                                Cancel Period
                            </button>
                            {/* DEMO ============================ */}
                            {Boolean(userCtx.appOwner !== web3Ctx.account) && (
                                <p className='text-muted text-sm mb-0 mt-2 d-flex align-items-center justify-content-center'>
                                    <AiFillInfoCircle className='me-1' /> only owner can deactivate periods
                                </p>
                            )}
                        </>
                    ) : (
                        <p className='mb-0 p-3 rounded-lg bg-gray-100'>There're no active period</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CancelPeriod;
