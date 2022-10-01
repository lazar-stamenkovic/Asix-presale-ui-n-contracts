import React, { useEffect, useContext, useState, useMemo } from 'react';
import AOS from 'aos';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { MdVerified } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import TokenContext from '../store/token-context';
import Web3Context from '../store/web3-context';
import UserContext from '../store/user-context';
import FetchingDataLoader from './general/FetchingDataLoader';

const filterOptions = [
    { value: 'alphabetically', label: 'Alphabetically' },
    { value: 'topBuyers', label: 'Top Buyers' },
    { value: 'whiteListed', label: 'WhiteList Only' },
];

function Admin() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    const tokenCtx = useContext(TokenContext);
    const userCtx = useContext(UserContext);
    const web3Ctx = useContext(Web3Context);
    const [usersList, setUsersList] = useState(null);
    const [selectedValue, setSelectedValue] = useState({ value: 'alphabetically', label: 'Alphabetically' });

    useEffect(() => {
        if (userCtx.usersList) {
            setUsersList(userCtx.usersList);
        }
    }, [userCtx.usersList]);

    const sortedList = useMemo(() => {
        if (userCtx.usersList) {
            if (selectedValue.value === 'alphabetically') {
                return userCtx.usersList.sort((a, b) => {
                    if (a.fullName.toLowerCase().trim() < b.fullName.toLowerCase().trim()) {
                        return -1;
                    }
                    if (a.fullName.toLowerCase().trim() > b.fullName.toLowerCase().trim()) {
                        return 1;
                    }
                    return 0;
                });
            } else if (selectedValue.value === 'topBuyers') {
                return userCtx.usersList.sort((a, b) => b.balance - a.balance);
            } else if (selectedValue.value === 'whiteListed') {
                return userCtx.usersList.filter((user) => userCtx.whiteList.some((el) => el.address === user.account));
            } else {
                return usersList;
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userCtx.usersList, selectedValue.value, userCtx.whiteList]);

    if (tokenCtx.tokenIsLoading) {
        return <FetchingDataLoader />;
    }

    // if (!userCtx.usersList) {
    //     return (
    //         <div className='row my-5 pt-4'>
    //             <div className='col-lg-9 mx-auto text-center'>
    //                 <h1 data-aos='fade-up'>There's not registered users</h1>
    //                 <p className='text-muted lead' data-aos='fade-up' data-aos-delay='100'>
    //                     Lorem ipsum dolor sit amet consectetur adipisicing elit.
    //                 </p>
    //                 <Link to='/' className='py-2 btn btn-primary'>
    //                     Return Home
    //                 </Link>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className='row my-5 pt-4'>
                <div className='col-lg-9'>
                    <h1 className="token-title" data-aos='fade-up'>Rigestered Users</h1>
                    <p className='token-intro-text lead' data-aos='fade-up' data-aos-delay='100'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                    <div className='row z-index-100'>
                        <div className='col-xl-3 col-lg-5 col-md-6' data-aos='fade-up' data-aos-delay='200'>
                            <Select
                                options={filterOptions}
                                className='mb-3 border-0 shadow-sm'
                                classNamePrefix='select'
                                value={selectedValue}
                                onChange={setSelectedValue}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className='row gy-4'>
                {sortedList
                    ? sortedList.map((user, index) => {
                          return (
                              <div className='col-xl-3 col-lg-6 col-md-6' key={index}>
                                  <Link to={`/users/${user.account}`}>
                                      <div data-aos='fade-up' data-aos-delay={index * 100}>
                                          <div className='card mb-0 card-hover-animated'>
                                              <div className='card-body position-relative'>
                                                  <div className='d-flex align-items-center'>
                                                      <div
                                                          className='flex-shrink-0'
                                                          style={{ width: '50px', height: '50px' }}
                                                      >
                                                          <Jazzicon address={user.account} />
                                                      </div>
                                                      <div className='ms-3'>
                                                          <h6 className='d-flex align-items-center mb-0'>
                                                              {user.fullName}
                                                              {userCtx.whiteList &&
                                                                  userCtx.whiteList.some(
                                                                      (el) => el.address === user.account
                                                                  ) && (
                                                                      <MdVerified
                                                                          className='text-success ms-2'
                                                                          size='1.2rem'
                                                                          data-bs-toggle='tooltip'
                                                                          data-bs-placement='left'
                                                                          title='WhiteListed'
                                                                      />
                                                                  )}

                                                              {user.account === userCtx.appOwner && (
                                                                  <MdVerified
                                                                      className='text-info ms-2'
                                                                      size='1rem'
                                                                      data-bs-toggle='tooltip'
                                                                      data-bs-placement='left'
                                                                      title='WhiteListed'
                                                                  />
                                                              )}
                                                          </h6>
                                                          <p className='text-sm text-muted mb-0'>
                                                              <span className='text-primary fw-bold me-1'>
                                                                  {user.balance > 0 ? user.balance : 0}
                                                              </span>
                                                              tokens
                                                          </p>
                                                      </div>
                                                  </div>

                                                  {user.account === web3Ctx.account && (
                                                      <div className='badge m-2 bg-info position-absolute top-0 end-0'>
                                                          You
                                                      </div>
                                                  )}
                                              </div>
                                          </div>
                                      </div>
                                  </Link>
                              </div>
                          );
                      })
                    : null}
            </div>

            {sortedList && sortedList.length === 0 && (
                <span className='lead'>There're no users that matched this record</span>
            )}
        </>
    );
}

export default Admin;
