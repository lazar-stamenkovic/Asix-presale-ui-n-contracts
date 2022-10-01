import React, { useReducer } from 'react'

import UserContext from './user-context'

const defaultUserState = {
  contract: null,
  appOwner: null,
  userInformation: null,
  appOwnerDetails: null,
  userInformationError: false,
  usersList: null,
  whiteList: null,
  userBalance: null,
  usersListError: false,
  userIsLoading: true,
}

const UserReducer = (state, action) => {
  if (action.type === 'USERCONTRACT') {
    return {
      ...state,
      contract: action.contract,
    }
  }

  if (action.type === 'GETUSERINFO') {
    return {
      ...state,
      userInformation: {
        ...state.userInformation,
        fullName: action.payload.userInformation[1],
        balance: action.payload.userBalance,
      },
    }
  }

  if (action.type === 'GETUSERINFOERROR') {
    return {
      ...state,
      userInformationError: true,
    }
  }

  if (action.type === 'GETUSERSLIST') {
    const appUsersList = action.payload.usersList.map((item, index) => {
      return {
        account: item[0],
        fullName: item[1],
        balance:
          parseFloat(action.payload.userBalance.map((user) => user)[index]) /
          10 ** 18,
      }
    })
    const uniqueUsersList = [
      ...new Map(appUsersList.map((item) => [item['account'], item])).values(),
    ]
    return {
      ...state,
      usersList: uniqueUsersList,
    }
  }

  if (action.type === 'GETUSERSLISTERROR') {
    return {
      ...state,
      usersListError: true,
    }
  }

  if (action.type === 'GETOWNER') {
    return {
      ...state,
      appOwner: action.appOwner,
    }
  }

  if (action.type === 'GETUSERBALANCE') {
    return {
      ...state,
      userBalance: action.userBalance,
    }
  }

  if (action.type === 'GETWHITELIST') {
    return {
      ...state,
      whiteList: action.whiteList.map((user) => {
        return {
          address: user,
        }
      }),
    }
  }

  if (action.type === 'GETOWNERDETAILS') {
    return {
      ...state,
      appOwnerDetails: {
        ...state.appOwnerDetails,
        fullName: action.appOwnerDetails[1],
      },
    }
  }

  if (action.type === 'LOADING') {
    return {
      ...state,
      userIsLoading: action.loading,
    }
  }

  return defaultUserState
}

const UserProvider = (props) => {
  const [UserState, dispatchUserAction] = useReducer(
    UserReducer,
    defaultUserState,
  )

  const loadContractHandler = (web3, UserInfo, deployedNetwork) => {
    const contract = deployedNetwork
      ? new web3.eth.Contract(UserInfo.abi, deployedNetwork.address)
      : ''
    dispatchUserAction({ type: 'USERCONTRACT', contract: contract })
    return contract
  }

  const setUserIsLoadingHandler = (loading) => {
    dispatchUserAction({ type: 'LOADING', loading: loading })
  }

  const getUserInformationHandler = async (
    userContract,
    tokenContract,
    account,
  ) => {
    try {
      const userInformation = await userContract.methods.getUser(account).call()
      const userBalance = await tokenContract.methods.balanceOf(account).call()
      dispatchUserAction({
        type: 'GETUSERINFO',
        payload: { userInformation, userBalance },
      })
      return { userInformation, userBalance }
    } catch (error) {
      // return;
      console.log('getUserInformationHandler', error)
    }
  }

  const getUsersListHandler = async (userContract, tokenContract) => {
    try {
      const usersList = await userContract.methods.getUsersList().call()
      const userBalance = await Promise.all(
        usersList.map(
          async (el) => await tokenContract.methods.balanceOf(el[0]).call(),
        ),
      )
      dispatchUserAction({
        type: 'GETUSERSLIST',
        payload: { usersList, userBalance },
      })
      return { usersList, userBalance }
    } catch (err) {
      // return;
      console.log('getUsersListHandler', err)
    }
  }

  const loadAppOwnerHandler = async (contract) => {
    try {
      const appOwner = await contract.methods.owner().call()
      dispatchUserAction({ type: 'GETOWNER', appOwner: appOwner })
      return appOwner
    } catch (error) {
      //  return;
      console.log('loadAppOwnerHandler')
    }
  }

  const loadUserBalanceHandler = async (contract, account) => {
    try {
      const userBalance = await contract.methods.balanceOf(account).call()
      dispatchUserAction({ type: 'GETUSERBALANCE', userBalance: userBalance })
      return userBalance
    } catch (error) {
      // return;
      console.log('loadUserBalanceHandler')
    }
  }

  const loadWhiteListHandler = async (contract) => {
    try {
      const whiteList = await contract.methods.getWhitelisted().call()
      dispatchUserAction({ type: 'GETWHITELIST', whiteList: whiteList })
      return whiteList
    } catch (error) {
      // return;
      console.log('loadWhiteListHandler')
    }
  }

  const loadAppOwnerDetailsHandler = async (contract, account) => {
    const appOwnerDetails = await contract.methods.getUser(account).call()
    dispatchUserAction({
      type: 'GETOWNERDETAILS',
      appOwnerDetails: appOwnerDetails,
    })
    return appOwnerDetails
  }

  const userContext = {
    contract: UserState.contract,
    appOwner: UserState.appOwner,
    appOwnerDetails: UserState.appOwnerDetails,
    userIsLoading: UserState.userIsLoading,
    userInformation: UserState.userInformation,
    userInformationError: UserState.userInformationError,
    usersList: UserState.usersList,
    usersListInformation: UserState.usersListInformation,
    userBalance: UserState.userBalance,
    whiteList: UserState.whiteList,
    getUsersList: getUsersListHandler,
    getUserInformation: getUserInformationHandler,
    getAppOwner: loadAppOwnerHandler,
    getAppOwnerDetails: loadAppOwnerDetailsHandler,
    loadUserBalance: loadUserBalanceHandler,
    loadWhiteList: loadWhiteListHandler,
    loadContract: loadContractHandler,
    setUserIsLoading: setUserIsLoadingHandler,
  }

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserProvider
