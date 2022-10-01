import React from 'react';

function FetchingDataLoader() {
    return (
        <div className='fullscreen-loader'>
            <div className='fullscreen-loader-inner'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-4'>
                            <img  className='img-fluid w-100 mb-5 fetching-logo-animation' src='/main-logo.png' alt='Illustration' />
                        </div>
                        <div className='col-lg-4 mt-5'>
                            <div className='d-flex align-items-center justify-content-center mt-5'>
                                <span className='loader'>
                                    <span className='loader-inner'></span>
                                </span>
                                <div className='ms-3'>
                                    <h5 className='token-title mb-1'>Fetching your data</h5>
                                    <p className='token-intro-text mb-2'>Make sure MetaMask is connected</p>
                                    <div className='cloud m-0'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FetchingDataLoader;
