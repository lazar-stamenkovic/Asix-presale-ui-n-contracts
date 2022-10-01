import React from 'react';

const PresaleContext = React.createContext({
    contract: null,
    whitelisted: null, // I only shared whitelisted
    pendingTokens: null,
    presaleIsLoading: null,
    loadContract: () => {},
    loadAppOwner: () => {},
    loadPendingTokens: () => {},
    checkWhitelist: () => {},
    setPresaleIsLoading: () => {},
});

export default PresaleContext;
