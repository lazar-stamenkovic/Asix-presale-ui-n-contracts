import React, { useEffect, useContext } from 'react'
import UserContext from '../store/user-context'
import AOS from 'aos'

import FetchingDataLoader from './general/FetchingDataLoader'
import { Link } from 'react-router-dom'

function Home() {
    const userCtx = useContext(UserContext);

    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    if (userCtx.userIsLoading) {
        return <FetchingDataLoader />;
    }

    return (
        <>
        <div className='row my-5 gy-5 align-items-center'  data-aos='fade-up'>
            <div className='col-lg-3'></div>
            <div className='col-lg-6 text-center'>
                <img  className='img-fluid w-100 mb-5 main-logo-animation' src='/main-logo.png' alt='Illustration' />
            </div>
        </div>
        <div className='row my-5 align-items-center'  data-aos='fade-up'>
            <div className='col-lg-3'></div>
            <div className='col-lg-6'>
                <h1 data-aos='fade-up' className='text-xl token-title text-center'>
                    ASIXMUSIC Token
                </h1>
                <p className='token-intro-text lead text-center' data-aos='fade-up' data-aos-delay='100'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!
                </p>
                <div className="text-center">
                    <Link className='btn btn-primary py-2 mt-3' to='/presale'>
                        Go To PRESALE
                    </Link>
                </div>
            </div>
        </div>
        <div className="row my-5 gy-5 align-items-center"  data-aos='fade-up'>
            <div className="col-lg-4">
                <div className="introduce-clip-box text-center token-intro-text">
                    <p style={{fontSize:"20px"}}> Audio/Video Streaming </p>
                    <p> {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!"}</p>
                </div>
            </div>
            

            <div className="col-lg-4">
                <div className="introduce-clip-box text-center token-intro-text">
                    <p style={{fontSize:"20px"}}>parse NFT market </p>
                    <p> {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!"}</p>
                </div>
            </div>
            <div className="col-lg-4">
                <div className="introduce-clip-box text-center token-intro-text">
                    <p style={{fontSize:"20px"}}> Nusantaraverse </p>
                    <p> {"Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia, molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium optio, eaque rerum!"}</p>
                </div>
            </div>
        </div>
        </>
    );
}

export default Home;
