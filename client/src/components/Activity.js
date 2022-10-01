import React, { useEffect, useContext } from 'react';
import TokenContext from '../store/token-context';
import AOS from 'aos';

import FetchingDataLoader from './general/FetchingDataLoader.js';
import ActivityTable from './tables/ActivityTable.js';
import PeriodsTable from './tables/PeriodsTable';

function Activity() {
    const tokenCtx = useContext(TokenContext);

    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    if (tokenCtx.tokenIsLoading) {
        return <FetchingDataLoader />;
    }

    return (
        <>
            <div className='row my-5 pt-4'>
                <div className='col-lg-9mx-auto text-center'>
                    <h1 className="token-title" data-aos='fade-up'>Transactions Activity</h1>
                    <p className='token-intro-text lead' data-aos='fade-up' data-aos-delay='100'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
            </div>

            <div className='row'>
                <div className='col-lg-12'>
                    <ActivityTable />
                    <PeriodsTable />
                </div>
            </div>
        </>
    );
}

export default Activity;
