import React from 'react';

function Footer() {
    return (
        <footer className='main-footer'>
            <div className='container py-3 mt-4'>
                <p className='text-muted mb-0 text-center text-sm'>
                    Created by{' '}
                    <a href='https://ionichub.co' className='text-primary'>
                        Ionichub
                    </a>{' '}
                    2022. &copy; All rights reserved
                </p>
            </div>
        </footer>
    );
}

export default Footer;
