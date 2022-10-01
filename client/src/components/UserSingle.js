import React, { useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Jazzicon } from '@ukstv/jazzicon-react';
import TokenContext from '../store/token-context';
import UserContext from '../store/user-context';
import Web3Context from '../store/web3-context';
import { FaBitcoin } from 'react-icons/fa';
import { MdVerified } from 'react-icons/md';
import { useToasts } from 'react-toast-notifications';
import { toEther } from '../helpers/utils';
import AOS from 'aos';
import FetchingDataLoader from './general/FetchingDataLoader';
import UserActivityTable from './tables/UserActivityTable';

function UserSingle() {
    const { address } = useParams();
    const userCtx = useContext(UserContext);
    const tokenCtx = useContext(TokenContext);
    const web3Ctx = useContext(Web3Context);
    const [usersList, setUsersList] = useState(null);
    const [purchasedToken, setPurchasedToken] = useState(0);
    const [pendingTokens, setPendingTokens] = useState(0);
    const [totalShare, setTotalShare] = useState(0);
    const { addToast } = useToasts();

    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    useEffect(() => {
        if (userCtx.usersList) {
            const userInfo = userCtx.usersList.filter((user) => user.account === address)[0];
            setUsersList(userInfo);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, userCtx.whiteList]);

    useEffect(() => {
        if (userCtx.usersList) {
            setPurchasedToken(userCtx.usersList.filter((user) => user.account === address)[0].balance);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList]);

    useEffect(() => {
        if (tokenCtx.totalSupply && userCtx.userBalance && userCtx.usersList) {
            const totalAmounts = toEther(tokenCtx.totalSupply);
            const userTokens = parseFloat(userCtx.usersList.filter((user) => user.account === address)[0].balance);
            setTotalShare(((userTokens / totalAmounts) * 100).toFixed(3));
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenCtx.totalSupply, userCtx.usersList, userCtx.userBalance]);

    useEffect(() => {
        if (tokenCtx.pendingTokens) {
            setPendingTokens(
                tokenCtx.pendingTokens.filter((token) => token.account === web3Ctx.account).map((token) => token.amount)
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenCtx.pendingTokens]);

    function copyText(e) {
        e.target.classList.add('bounced');
        setTimeout(() => {
            e.target.classList.remove('bounced');
        }, 500);
        navigator.clipboard.writeText(e.target.textContent);
        addToast(`Copied`, { appearance: 'success' });
    }

    if (userCtx.userIsLoading && !userCtx.usersList) {
        return <FetchingDataLoader />;
    }

    return (
        <>
            <div className='row my-5 pt-4'>
                <div className='col-lg-9 mx-auto'>
                    {usersList && (
                        <div className='text-center'>
                            <div className='d-flex align-items-center justify-content-center text-start'>
                                <div
                                    className='flex-shrink-0'
                                    style={{ width: '50px', height: '50px' }}
                                    data-aos='fade-right'
                                    data-aos-delay='50'
                                >
                                    <Jazzicon address={usersList && usersList.account} />
                                </div>
                                <div className='ms-3'>
                                    {usersList.role && (
                                        <span
                                            className='badge bg-info ms-auto'
                                            data-aos='fade-left'
                                            data-aos-delay='100'
                                        >
                                            {usersList.role}
                                        </span>
                                    )}
                                    <h1
                                        className='mb-0 d-flex align-items-center'
                                        data-aos='fade-left'
                                        data-aos-delay='150'
                                    >
                                        {usersList.fullName}
                                        {userCtx.whiteList &&
                                            userCtx.whiteList.some((user) => user.address === usersList.account) && (
                                                <MdVerified
                                                    className='text-success ms-2'
                                                    size='1.2rem'
                                                    data-bs-toggle='tooltip'
                                                    data-bs-placement='left'
                                                    title='WhiteListed'
                                                />
                                            )}
                                        {usersList.account === userCtx.appOwner && (
                                            <MdVerified
                                                className='text-info ms-2'
                                                size='1.2rem'
                                                data-bs-toggle='tooltip'
                                                data-bs-placement='left'
                                                title='WhiteListed'
                                            />
                                        )}
                                    </h1>
                                    {usersList.email && (
                                        <p className='text-muted mb-0' data-aos='fade-left' data-aos-delay='200'>
                                            {usersList.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div
                                className='mt-3 rounded-lg bg-gray-200 py-2 px-4 d-inline-block mx-auto copyable border-0 shadow-0'
                                data-aos='fade-up'
                                data-aos-delay='250'
                                onClick={copyText}
                            >
                                {usersList.account}
                            </div>

                            {usersList.about && (
                                <div className='row' data-aos='fade-up' data-aos-delay='300'>
                                    <div className='col-lg-9 mx-auto'>
                                        <p className='text-muted mt-3'>{usersList.about}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className='row g-4 mt-4'>
                        <div className='col-lg-4' data-aos='fade-up' data-aos-delay='200'>
                            <div className='card mb-0 card-hover-animated'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon solid-turquoise'>
                                            <FaBitcoin size='1.4rem' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>Purchased tokens</h6>
                                            <h6 className='h4 fw-normal mb-0'>
                                                {purchasedToken && purchasedToken > 0 ? purchasedToken : 0}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4' data-aos='fade-up' data-aos-delay='200'>
                            <div className='card mb-0 card-hover-animated'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon solid-cyan'>
                                            <FaBitcoin size='1.4rem' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>pending tokens</h6>
                                            <h6 className='h4 fw-normal mb-0'>
                                                {pendingTokens > 0 ? parseFloat(pendingTokens) / 10 ** 18 : 0}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4' data-aos='fade-up' data-aos-delay='400'>
                            <div className='card mb-0 card-hover-animated'>
                                <div className='card-body'>
                                    <div className='d-flex'>
                                        <div className='stats-icon solid-orange'>
                                            <FaBitcoin size='1.4rem' />
                                        </div>
                                        <div className='ms-3'>
                                            <h6 className='text-muted mb-0'>Total share</h6>
                                            <h6 className='h4 fw-normal mb-0'>
                                                {totalShare > 0 ? totalShare + '%' : '0%'}
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-lg-12' data-aos='fade-up' data-aos-delay='500'>
                            <UserActivityTable />
                            <div className='text-center'>
                                <Link to='/users' className='btn btn-primary py-2'>
                                    Back to Users List
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserSingle;
