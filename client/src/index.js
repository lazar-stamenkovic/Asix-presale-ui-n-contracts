import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Web3Provider from './store/Web3Provider';
import TokenProvider from './store/TokenProvider';
import UserProvider from './store/UserProvider';
import { ToastProvider } from 'react-toast-notifications';

ReactDOM.render(
    <React.StrictMode>
        <Web3Provider>
            <TokenProvider>
                <UserProvider>
                    <ToastProvider autoDismiss autoDismissTimeout={6000} placement='top-center'>
                        <App />
                    </ToastProvider>
                </UserProvider>
            </TokenProvider>
        </Web3Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
