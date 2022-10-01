import React, { useEffect } from 'react';
import AOS from 'aos';

function MetaMaskLoader() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    return (
        <div className='fullscreen-loader' data-aos='zoom-in-up' data-aos-duration='100'>
            <div className='fullscreen-loader-inner'>
                <div className='container'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <img src='metamask.png' alt='MetaMask' width='80' className='flex-shrink-0' />
                        <div className='ms-3'>
                            <h5 className='mb-1'>Continue on MetaMask</h5>
                            <p className='text-muted mb-2'>Loading...</p>
                            <div className='cloud m-0'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MetaMaskLoader;
