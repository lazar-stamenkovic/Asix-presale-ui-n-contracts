import React, { useEffect, useContext } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import AOS from 'aos';
import TokenContext from '../store/token-context';
import UserContext from '../store/user-context';
import Web3Context from '../store/web3-context';
import PendingRequests from './admin/PendingRequests';
import WhiteList from './admin/WhiteList';
import FetchingDataLoader from './general/FetchingDataLoader';
import WhiteListedUsers from './admin/WhitlistedUsers';
import CancelPeriod from './admin/CancelPeriod';

function Admin() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const userCtx = useContext(UserContext);
    const web3Ctx = useContext(Web3Context);

    if (tokenCtx.tokenIsLoading) {
        return <FetchingDataLoader />;
    }

    return (
        userCtx.appOwner && (
            <>
                <div className='row my-5 pt-4'>
                    <div className='col-lg-9'>
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
                        <h1 data-aos='fade-up'>Admin Panel</h1>
                        <p className='text-muted lead' data-aos='fade-up' data-aos-delay='100'>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>

                <div className='row gy-4'>
                    <div className='col-lg-12'>
                        <PendingRequests />
                    </div>
                    <div className='col-lg-6'>
                        <WhiteList />
                    </div>
                    <div className='col-lg-6'>
                        <CancelPeriod />
                    </div>
                    <div className='col-lg-12'>
                        <WhiteListedUsers />
                    </div>
                </div>
            </>
        )
    );
}

export default Admin;
