import React from 'react';

const UserContext = React.createContext({
    contract: null,
    appOwnerDetails: null,
    userInformation: null,
    usersList: null,
    userBalance: null,
    whiteList: null,
    userInformationError: false,
    usersListError: false,
    userIsLoading: true,
    getUserInformation: () => {},
    getAppOwner: () => {},
    getAppOwnerDetails: () => {},
    loadUserBalance: () => {},
    getUsersList: () => {},
    loadWhiteList: () => {},
    loadContract: () => {},
    setUserIsLoading: () => {},
});

export default UserContext;
