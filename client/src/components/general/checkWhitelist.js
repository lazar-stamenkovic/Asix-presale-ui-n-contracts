import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';

function CheckWhitelist() {
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
                        Sorry, You aren't whitelist member.
                    </h1>
                    <p className='token-intro-text lead' data-aos='fade-up' data-aos-delay='200'>
                        only owner can add to whitelist
                    </p>
                    <Link className='btn btn-primary py-2' to='/'>
                        Return Home
                    </Link>
                </div>
            </div>
        </>
    );
}

export default CheckWhitelist;
