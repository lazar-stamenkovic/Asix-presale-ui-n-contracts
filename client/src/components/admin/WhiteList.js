import React, { useEffect, useState, useContext } from 'react';
import { AiFillInfoCircle } from 'react-icons/ai';
import AOS from 'aos';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { useToasts } from 'react-toast-notifications';
import Select from 'react-select';
import TokenContext from '../../store/token-context';
import UserContext from '../../store/user-context';
import Web3Context from '../../store/web3-context';

import MetaMaskLoader from '../general/MetaMaskLoader';

function WhiteList() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const { addToast } = useToasts();
    const [usersList, setUsersList] = useState(null);
    const [choosedAddress, setChoosedAddress] = useState('');

    const ListItem = ({ address, name }) => {
        return (
            <div className='d-flex align-items-center'>
                <div style={{ minWidth: '25px', width: '25px', height: '25px', flexShrink: '0' }}>
                    <Jazzicon address={address} className='w-100 h-100' />
                </div>
                <div className='ms-2 flex-grow-0'>{name}</div>
            </div>
        );
    };

    useEffect(() => {
        if (userCtx.usersList && !userCtx.whiteList) {
            const appUsersList = userCtx.usersList
                .filter((user) => user.account !== userCtx.appOwner)
                .map((user) => {
                    return {
                        value: user.account,
                        label: <ListItem address={user.account} name={user.fullName} />,
                    };
                });
            setUsersList(appUsersList);
        } else if (userCtx.usersList && userCtx.whiteList) {
            const appUsersList = userCtx.usersList
                .filter((user) => user.account !== userCtx.appOwner)
                .filter((user) => !userCtx.whiteList.map((el) => el.address).includes(user.account))
                .map((user) => {
                    return {
                        value: user.account,
                        label: <ListItem address={user.account} name={user.fullName} />,
                    };
                });
            setUsersList(appUsersList);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, userCtx.whiteList]);

    function addToWhiteListHandler(e) {
        e.preventDefault();
        if (choosedAddress !== '' && usersList.indexOf(choosedAddress) !== -1) {
            tokenCtx.contract.methods
                .addToWhitelist(choosedAddress.value)
                .send({ from: web3Ctx.account })
                .once('sending', function (payload) {
                    setMetaMaskOpened(true);
                })
                .on('transactionHash', (hash) => {
                    setChoosedAddress('');
                    setMetaMaskOpened(false);
                    addToast(`Great! you have a new user to whitelist`, {
                        appearance: 'success',
                    });
                })
                .on('receipt', (receipt) => {
                    userCtx.loadWhiteList(userCtx.contract);
                    tokenCtx.loadActivity(userCtx.contract);
                })
                .on('error', (e) => {
                    addToast('Something went wrong when pushing to the blockchain', {
                        appearance: 'error',
                    });
                    setMetaMaskOpened(false);
                });
        }
    }

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}
            <div className='card shadow-lg' data-aos='fade-up' data-aos-delay='300'>
                <div className='card-body p-lg-5'>
                    <h2 className='h4'>Add to WhiteList</h2>
                    <p className='text-muted text-sm mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    <h6 className='mb-3'>Choose from exisiting users</h6>
                    <form onSubmit={addToWhiteListHandler}>
                        {usersList && (
                            <>
                                <Select
                                    searchable
                                    options={usersList}
                                    className='mb-3'
                                    classNamePrefix='select'
                                    value={choosedAddress}
                                    onChange={setChoosedAddress}
                                    noOptionsMessage={() => 'No users available'}
                                />
                                {choosedAddress !== '' ? (
                                    <p className='small bg-gray-200 text-gray-700 rounded px-3 py-1 mb-3'>
                                        {choosedAddress.value}
                                    </p>
                                ) : null}
                                <button
                                    className='btn btn-primary w-100'
                                    type='submit'
                                    disabled={userCtx.appOwner !== web3Ctx.account ? true : false}
                                >
                                    Add User
                                </button>

                                {/* DEMO ============================ */}
                                {Boolean(userCtx.appOwner !== web3Ctx.account) && (
                                    <p className='text-muted text-sm mb-0 mt-2 d-flex align-items-center justify-content-center'>
                                        <AiFillInfoCircle className='me-1' /> only owner can add to whitelist
                                    </p>
                                )}
                            </>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}

export default WhiteList;
