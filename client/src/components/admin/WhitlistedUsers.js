import React, { useEffect, useContext, useState, useMemo } from 'react';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { useToasts } from 'react-toast-notifications';
import { HiArrowDown } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import TokenContext from '../../store/token-context';
import UserContext from '../../store/user-context';
import Web3Context from '../../store/web3-context';
import AOS from 'aos';

import MetaMaskLoader from '../general/MetaMaskLoader';

function WhiteListedUsers() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    const [metaMaskOpened, setMetaMaskOpened] = useState(false);
    const [itemsRendered, setItemsRendered] = useState(1);
    const { addToast } = useToasts();

    const whiteList = useMemo(() => {
        if (userCtx.whiteList && userCtx.usersList) {
            return userCtx.whiteList
                .filter((el) => el.address !== '0x0000000000000000000000000000000000000000')
                .map((user) => {
                    return {
                        account: user.address,
                        name: userCtx.usersList.filter((el) => el.account === user.address).map((el) => el.fullName)[0],
                    };
                });
        }
    }, [userCtx.whiteList, userCtx.usersList]);

    function removeFromWhiteListHandler(address, name) {
        tokenCtx.contract.methods
            .removeFromWhitelist(address)
            .send({ from: web3Ctx.account })
            .once('sending', function (payload) {
                setMetaMaskOpened(true);
            })
            .on('transactionHash', (hash) => {
                setMetaMaskOpened(false);
                addToast(`Great! you have a deleted ${name} from whitelist`, {
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

    return (
        <>
            {metaMaskOpened ? <MetaMaskLoader /> : null}
            <div className='card shadow-lg' data-aos='fade-up' data-aos-delay='300'>
                <div className='card-body p-lg-5'>
                    <h2 className='h4'>Whitelisted Users</h2>
                    <p className='text-muted text-sm mb-4'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>

                    {whiteList
                        ? whiteList.slice(0, itemsRendered).map((el, index) => {
                              return (
                                  <div
                                      className='rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1'
                                      key={index}
                                  >
                                      <Link to={`/users/${el.account}`}>
                                          <div style={{ width: '40px', height: '40px' }}>
                                              <Jazzicon address={el.account} />
                                          </div>
                                      </Link>
                                      <Link to={`/users/${el.account}`} className='text-reset'>
                                          <p className='mx-3 mb-0 fw-bold text-primary'>{el.name}</p>
                                      </Link>
                                      <div className='ms-auto'>
                                          <button
                                              className='btn btn-danger btn-sm m-1'
                                              onClick={() => removeFromWhiteListHandler(el.account, el.name)}
                                              disabled={userCtx.appOwner !== web3Ctx.account ? true : false}
                                          >
                                              Remove
                                          </button>
                                      </div>
                                  </div>
                              );
                          })
                        : null}

                    {whiteList && whiteList.length > itemsRendered && (
                        <p className='pt-2 mb-0 text-sm'>
                            Expand to see
                            <span className='fw-bold text-primary mx-1'>{whiteList.length - itemsRendered}</span>
                            more...
                        </p>
                    )}
                    {!whiteList ||
                        (whiteList.length === 0 && (
                            <div className='rounded-lg bg-gray-100 d-flex align-items-center p-3 my-1'>
                                There're no WhiteListed users
                            </div>
                        ))}

                    {whiteList && whiteList.length > itemsRendered && (
                        <button
                            type='button'
                            className='card-expand'
                            onClick={() => setItemsRendered(whiteList.length)}
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

export default WhiteListedUsers;
