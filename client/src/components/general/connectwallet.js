import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';

function ConnectWallet() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    return (
        <>
            <div className='row my-5 gy-5 text-center'>
                <div className='col-lg-8 mx-auto'>
                    <img src='/ils_09.svg' alt='Illustration' className='img-fluid w-100 mb-5' data-aos='fade-up' />

                    <h1 data-aos='fade-up' data-aos-delay='100' className='text-xl token-title'>
                        Fetching your data
                    </h1>
                    <p className='token-intro-text lead' data-aos='fade-up' data-aos-delay='200'>
                    Make sure MetaMask is connected
                    </p>
                    <Link className='btn btn-primary py-2' to='/presale'>
                        Return Presale
                    </Link>
                </div>
            </div>
        </>
    );
}

export default ConnectWallet;
