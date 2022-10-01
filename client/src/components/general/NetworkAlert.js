import React, { useEffect } from 'react';
import { appSettings } from '../../helpers/settings';
import AOS from 'aos';

function NetworkAlert() {
    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    return (
        <div className='fullscreen-loader intro-loader'>
            <div className='fullscreen-loader-inner'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-6 mx-auto text-center'>
                            <img src='/metamask.png' alt='Kovan Test Network' className='mb-4' width='80' />
                            <h1 className='h3 mb-1'>
                                <span className='text-orange orange text-backline'>Binance Test Network</span>
                            </h1>
                            <p className='text-muted fw-normal mb-4'>
                                Please switch active network on your MetaMask account to{' '}
                            </p>
                            <a
                                href='https://academy.binance.com/en/articles/connecting-metamask-to-binance-smart-chain'
                                target='_blank'
                                rel='noopener noreferrer'
                                className='btn btn-primary py-2'
                            >
                                How to switch network
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetworkAlert;
