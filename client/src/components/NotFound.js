import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';

function NotFound() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    return (
        <>
            <div className='row my-5 gy-5 text-center'>
                <div className='col-lg-8 mx-auto'>
                    <img src='/ils_09.svg' alt='Illustration' className='img-fluid w-100 mb-5' data-aos='fade-up' />

                    <h1 data-aos='fade-up' data-aos-delay='100' className='text-xl'>
                        Sorry, The Page Can’t be Found.
                    </h1>
                    <p className='text-muted lead' data-aos='fade-up' data-aos-delay='200'>
                        You didn't breake the internet, but we can't find what you are looking for.
                    </p>
                    <Link className='btn btn-primary py-2' to='/'>
                        Return Home
                    </Link>
                </div>
            </div>
        </>
    );
}

export default NotFound;
