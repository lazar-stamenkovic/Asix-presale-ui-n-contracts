import React, { useEffect, useContext, useState } from 'react';
import TokenContext from '../store/token-context';
import UserContext from '../store/user-context';
import Web3Context from '../store/web3-context';
import { FaBitcoin } from 'react-icons/fa';
import { AiFillInfoCircle } from 'react-icons/ai';
import AOS from 'aos';
import 'aos/dist/aos.css';

import MintForm from './general/MintForm';
import FetchingDataLoader from './general/FetchingDataLoader';
import PeriodsTable from './tables/PeriodsTable';

function MintToken() {
    const tokenCtx = useContext(TokenContext);
    const userCtx = useContext(UserContext);
    const web3Ctx = useContext(Web3Context);
    const [totalSold, setTotalSold] = useState(0);
    const [totalAvailable, setTotalAvailable] = useState(0);
    const [totalTokens, setTotalTokens] = useState(0);

    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    useEffect(() => {
        async function getOwnerDetails() {
            if (userCtx.appOwner) {
                userCtx.getAppOwnerDetails(userCtx.contract, userCtx.appOwner);
            }
        }
        getOwnerDetails();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenCtx.contract, userCtx.appOwner]);

    useEffect(() => {
        if (userCtx.usersList && tokenCtx.totalSupply) {
            const totalSold = userCtx.usersList.map((period) => period.balance).reduce((a, b) => a + b, 0);
            const totalSupply = parseFloat(tokenCtx.totalSupply) / 10 ** 18;
            setTotalSold(totalSold);
            setTotalTokens(totalSupply);
            setTotalAvailable(totalSupply - totalSold);
        }
    }, [userCtx.usersList, tokenCtx.totalSupply]);

    if (tokenCtx.tokenIsLoading) {
        return <FetchingDataLoader />;
    }

    return (
        <>
            <div className='row my-5 py-4'>
                <div className='col-lg-9 mx-auto text-center'>
                    {Boolean(userCtx.appOwner !== web3Ctx.account) && (
                        <div className='d-inline-block'>
                            <p
                                className='text-white badge bg-info text-sm mb-0 d-flex align-items-center px-2 mb-2 py-1 rounded fw-bold'
                                data-aos='fade-up'
                            >
                                <AiFillInfoCircle className='me-1' />
                                Visible only for demo
                            </p>
                        </div>
                    )}

                    <h1 className='token-title' data-aos='fade-up'>Create a Crypto Token Sale Period</h1>
                    <p className='token-intro-text lead' data-aos='fade-up' data-aos-delay='100'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-9 mx-auto'>
                    <div className='row'>
                        <div className='col-lg-4'>
                            <div className='card shadow-lg mb-4' data-aos='fade-up'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon red'>
                                            <FaBitcoin size='1.4rem' className='text-white' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>Total Sold</h6>
                                            <h6 className='h4 fw-normal mb-0'>{totalSold}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-4'>
                            <div className='card shadow-lg mb-4' data-aos='fade-up' data-aos-delay='150'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon green'>
                                            <FaBitcoin size='1.4rem' className='text-white' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>Total Available</h6>
                                            <h6 className='h4 fw-normal mb-0'>{totalAvailable}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-4'>
                            <div className='card shadow-lg mb-4' data-aos='fade-up' data-aos-delay='300'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon purple'>
                                            <FaBitcoin size='1.4rem' className='text-white' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>Total Tokens</h6>
                                            <h6 className='h4 fw-normal mb-0'>{totalTokens}</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-9 mx-auto'>
                    <MintForm />
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-9 mx-auto'>
                    <PeriodsTable />
                </div>
            </div>
        </>
    );
}

export default MintToken;
