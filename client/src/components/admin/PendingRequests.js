import React, { useContext, useEffect, useState, useMemo } from 'react';
import AOS from 'aos';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { useToasts } from 'react-toast-notifications';
import { Link } from 'react-router-dom';
import { HiArrowDown } from 'react-icons/hi';
import TokenContext from '../../store/token-context';
import UserContext from '../../store/user-context';
import Web3Context from '../../store/web3-context';

import MetaMaskLoader from '../general/MetaMaskLoader';

function PendingRequests() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const { addToast } = useToasts();
    const [itemsRendered, setItemsRendered] = useState(1);

    function approveTokenHandler(address) {
        tokenCtx.contract.methods
            .approveToken(address)
            .send({ from: web3Ctx.account })
            .once('sending', function (payload) {
                setMetaMaskOpened(true);
            })
            .on('transactionHash', (hash) => {
                setMetaMaskOpened(false);
                addToast(`Great! you have approved requested token`, {
                    appearance: 'success',
                });
            })
            .on('receipt', (receipt) => {
                tokenCtx.loadActivePeriod(userCtx.contract);
                tokenCtx.loadPendingTokens(userCtx.contract);
                tokenCtx.loadPurchasedTokens(tokenCtx.contract);
                userCtx.loadUserBalance(userCtx.contract, web3Ctx.account);
                userCtx.getUsersList(userCtx.contract, tokenCtx.contract);
                tokenCtx.loadActivity(userCtx.contract);
            })
            .on('error', (e) => {
                addToast('Something went wrong when pushing to the blockchain', {
                    appearance: 'error',
                });
                setMetaMaskOpened(false);
            });
    }

    const pendingTokens = useMemo(() => {
        if (tokenCtx.pendingTokens) {
            return tokenCtx.pendingTokens.filter((token) => token.amount !== '0');
        }
    }, [tokenCtx.pendingTokens]);

    function disapproveTokenHandler(address) {
        tokenCtx.contract.methods
            .disApproveToken(address)
            .send({ from: web3Ctx.account })
            .once('sending', function (payload) {
                setMetaMaskOpened(true);
            })
            .on('transactionHash', (hash) => {
                setMetaMaskOpened(false);
                addToast(`Great! you have diapproved requested token`, {
                    appearance: 'success',
                });
            })
            .on('receipt', (receipt) => {
                tokenCtx.loadActivePeriod(tokenCtx.contract);
                tokenCtx.loadPendingTokens(userCtx.contract);
                tokenCtx.loadPurchasedTokens(tokenCtx.contract);
                userCtx.loadUserBalance(userCtx.contract, web3Ctx.account);
                userCtx.getUsersList(userCtx.contract, tokenCtx.contract);
                tokenCtx.loadActivity(userCtx.contract);
            })
            .on('error', (e) => {
                addToast('Something went wrong when pushing to the blockchain', {
                    appearance: 'error',
                });
                setMetaMaskOpened(false);
            });
    }

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}

            <div className='card shadow-lg' data-aos='fade-up' data-aos-delay='100'>
                <div className='card-body p-lg-5'>
                    <h2 className='h4'>Pending Requests</h2>
                    <p className='text-muted text-sm mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    <ul className='list-unstyled mb-0'>
                        {pendingTokens &&
                            pendingTokens.slice(0, itemsRendered).map((token, index) => {
                                return (
                                    <li
                                        className='rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1 flex-wrap'
                                        key={index}
                                    >
                                        <Link to={`/users/${token.account}`}>
                                            <div style={{ width: '40px', height: '40px' }}>
                                                <Jazzicon address={token.account} />
                                            </div>
                                        </Link>
                                        <div className='mx-2'>
                                            <Link to={`/users/${token.account}`}>
                                                <span className='text-sm fw-bold text-primary d-none d-sm-inline-block mx-1'>
                                                    {userCtx.usersList &&
                                                        userCtx.usersList.filter(
                                                            (user) => user.account === token.account
                                                        )[0].fullName}
                                                </span>
                                            </Link>
                                            <span className='text-sm d-none d-sm-inline-block'>Requested </span>
                                            <span className='fw-bold text-primary mx-1'>
                                                {parseFloat(token.amount) / 10 ** 18}
                                            </span>
                                            <span className='text-sm'>Tokens</span>
                                        </div>
                                        <div className='ms-auto'>
                                            <button
                                                className='btn btn-info btn-sm m-1'
                                                onClick={() => approveTokenHandler(token.account)}
                                                disabled={userCtx.appOwner !== web3Ctx.account ? true : false}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className='btn btn-danger btn-sm m-1'
                                                onClick={() => disapproveTokenHandler(token.account)}
                                                disabled={userCtx.appOwner !== web3Ctx.account ? true : false}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </li>
                                );
                            })}
                    </ul>

                    {pendingTokens && pendingTokens.length > itemsRendered && (
                        <p className='pt-2 mb-0 text-sm'>
                            Expand to see
                            <span className='fw-bold text-primary mx-1'>{pendingTokens.length - itemsRendered}</span>
                            more...
                        </p>
                    )}
                    {pendingTokens && pendingTokens.length === 0 && (
                        <p className='mb-0 p-3 rounded-lg bg-gray-100'>There're no pending tokens</p>
                    )}
                    {pendingTokens && pendingTokens.length > itemsRendered && (
                        <button
                            type='button'
                            className='card-expand'
                            onClick={() => setItemsRendered(pendingTokens.length)}
                        >
                            <HiArrowDown />
                            <span className='ms-2'>Expand</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}

export default PendingRequests;
