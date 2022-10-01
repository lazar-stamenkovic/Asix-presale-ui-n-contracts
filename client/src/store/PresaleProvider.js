import React, { useReducer } from 'react';

import PresaleContext from './presale-context';

const defaultPresaleState = {
    contract: null,
    whitelisted: null,
    pendingTokens: null,
    presaleIsLoading: true,
};

const PresaleReducer = (state, action) => {
    if (action.type === 'PRESALE_CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }

    if (action.type === 'CHECK_WHITELIST') {
        return {
            ...state,
            whitelisted: action.whitelisted,
        };
    }

    if (action.type === 'GET_PENDING_TOKENS') {
        return {
            ...state,
            pendingTokens: action.pendingTokens.map((token) => {
                return {
                    account: token[0],
                    amount: token[1],
                };
            }),
        };
    }

    if (action.type === 'LOADING') {
        return {
            ...state,
            presaleIsLoading: action.loading,
        };
    }

    return defaultPresaleState;
};

const TokenProvider = (props) => {
    const [PresaleState, dispatchPresaleAction] = useReducer(PresaleReducer, defaultPresaleState);

    const loadContractHandler = (web3, PresaleJson, deployedNetwork) => {
        const contract = deployedNetwork ? new web3.eth.Contract(PresaleJson.abi, deployedNetwork.address) : '';
        dispatchPresaleAction({ type: 'PRESALE_CONTRACT', contract: contract });
        return contract;
    };

    const loadPendingTokensHandler = async (contract) => {
        try {
            const pendingTokens = await contract.methods.getPendingTokens().call();
            dispatchPresaleAction({ type: 'GET_PENDING_TOKENS', pendingTokens: pendingTokens });
            return pendingTokens;
        } catch (error) {
            // return;
            console.log('loadPendingTokensHandler');
        }
    };

    const checkWhitelist = async (contract, account) => {
        try {
            const whitelisted = await contract.methods.checkWhitelist(account).call();
            console.log(whitelisted, "whitelist check in reducer");
            dispatchPresaleAction({ type: 'CHECK_WHITELIST', whitelisted: whitelisted });
            return whitelisted;
        } catch (error) {
            // return;
            console.log('checkwhitelist');
        }
    };

    const setPresaleIsLoading = (loading) => {
        dispatchPresaleAction({ type: 'LOADING', presaleIsLoading: loading });
    };

    const presaleContext = {
        contract: PresaleState.contract,
        whitelisted: PresaleState.whitelisted,
        pendingTokens: PresaleState.pendingTokens,
        presaleIsLoading: PresaleState.presaleIsLoading,
        loadContract: loadContractHandler,
        loadPendingTokens: loadPendingTokensHandler,
        checkWhitelist: checkWhitelist,
        setPresaleIsLoading: setPresaleIsLoading,
    };

    return <PresaleContext.Provider value={presaleContext}>{props.children}</PresaleContext.Provider>;
};

export default TokenProvider;
