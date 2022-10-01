import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { appSettings } from '../../helpers/settings';
import { Jazzicon } from '@ukstv/jazzicon-react';
import Web3Context from '../../store/web3-context';
import UserContext from '../../store/user-context';
import FetchingDataLoader from './FetchingDataLoader';
import { FaUnderline } from 'react-icons/fa';

function Navbar() {
    const web3Ctx = useContext(Web3Context);
    const userCtx = useContext(UserContext);
    
    if(web3Ctx.account) {
        var account = web3Ctx.account.slice(0, 6) + "..." + web3Ctx.account.slice(web3Ctx.account.length - 4, web3Ctx.account.length);
    }

    if(!userCtx){
        return <FetchingDataLoader />
    } else {
        if(userCtx.userInformation) {
            if(userCtx.userInformation.fullName === '') {
                var username = account;
                var role = "unRegistered";
            } else {
                var username = userCtx.userInformation.fullName;
                var role = "";
            }
        }
    }
    return (
        <header className='main-header mb-5'>
            <div className='container pt-3'>
                <nav className='navbar w-100 navbar-expand-lg navbar-light bg-white py-3 px-4 justify-content-between'>
                    <Link className='navbar-brand' to='/'>
                        <img src={appSettings.logo} alt='Cryptus' width='40' className='h-auto' />
                    </Link>

                    <ul className='navbar-nav mx-auto d-none d-lg-flex navbar-nav-custom'>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/'>
                                Home
                            </NavLink>
                        </li>
                        {Boolean(userCtx.appOwner === web3Ctx.account) && (
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/mint'>
                                    Mint Period
                                </NavLink>
                            </li>
                        )}
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/Presale'>
                                Presale
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/activity'>
                                Activity
                            </NavLink>
                        </li>
                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/my-info'>
                                My Info
                            </NavLink>
                        </li>
                        {Boolean(userCtx.appOwner === web3Ctx.account) && (
                            <li className='nav-item'>
                                <NavLink className='nav-link' to='/admin'>
                                    Admin Area
                                </NavLink>
                            </li>
                        )}

                        <li className='nav-item'>
                            <NavLink className='nav-link' to='/users'>
                                Users
                            </NavLink>
                        </li>
                    </ul>

                    <Link to='/my-info' className='user-dropdown d-flex dropend' aria-expanded='false'>
                        <div className='avatar avatar-md2'>
                            <div style={{ width: '40px', height: '40px' }}>
                                <Jazzicon address={web3Ctx.account ? web3Ctx.account : ''} />
                            </div>
                        </div>
                        <div className='text ms-3 d-none d-lg-block'>
                            <h6 className='user-dropdown-name'>
                                {/* {userCtx.userInformation && userCtx.userInformation.fullName === ''
                                    ? account
                                    : "Random User"} */}
                                {username}
                            </h6>
                            <p className='user-dropdown-status text-sm text-muted'>
                                {/* {userCtx.userInformation && userCtx.userInformation.role !== undefined
                                    ? userCtx.userInformation.role
                                    : 'Unregistered'} */}
                                {role}
                            </p>
                        </div>
                    </Link>
                    <button
                        className='navbar-toggler'
                        type='button'
                        data-bs-toggle='collapse'
                        data-bs-target='#navbarSupportedContent'
                        aria-controls='navbarSupportedContent'
                        aria-expanded='false'
                        aria-label='Toggle navigation'
                    >
                        <span className='navbar-toggler-icon'></span>
                    </button>
                </nav>

                <nav className='navbar d-lg-none navbar-expand-lg rounded navbar-light bg-white py-0 py-lg-3 h-auto'>
                    <div className='collapse navbar-collapse justify-content-lg-center' id='navbarSupportedContent'>
                        <ul className='navbar-nav mb-2 mb-lg-0'>
                            <li className='nav-item'>
                                <NavLink className='nav-link px-4' to='/'>
                                    Home
                                </NavLink>
                            </li>
                            {Boolean(userCtx.appOwner === web3Ctx.account) && (
                                <li className='nav-item'>
                                    <NavLink className='nav-link px-4' to='/mint'>
                                        Mint Period
                                    </NavLink>
                                </li>
                            )}
                            <li className='nav-item'>
                                <NavLink className='nav-link px-4' to='/Presale'>
                                    Presale
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link px-4' to='/activity'>
                                    Activity
                                </NavLink>
                            </li>
                            <li className='nav-item'>
                                <NavLink className='nav-link px-4' to='/my-info'>
                                    My Info
                                </NavLink>
                            </li>
                            {Boolean(userCtx.appOwner === web3Ctx.account) && (
                                <li className='nav-item'>
                                    <NavLink className='nav-link px-4' to='/admin'>
                                        Admin Area
                                    </NavLink>
                                </li>
                            )}
                            <li className='nav-item'>
                                <NavLink className='nav-link px-4' to='/users'>
                                    Users
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
