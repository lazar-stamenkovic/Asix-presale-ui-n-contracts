import React, { useEffect, useContext, useState } from 'react'
import web3 from './connection/web3'
import Web3Context from './store/web3-context'
import TokenContext from './store/token-context'
import UserContext from './store/user-context'
import CryptoToken from './contracts/AsixTokenV3.json'
import UserInfo from './contracts/AsixV3Presale.json'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './scss/app.scss'
import 'aos/dist/aos.css'
import 'react-popper-tooltip/dist/styles.css'
import Header from './components/general/Header'
import Home from './components/Home'
import Presale from './components/presale'
import MintPeriod from './components/MintPeriod'
import Activity from './components/Activity'
import Admin from './components/Admin'
import Users from './components/Users'
import UserSingle from './components/UserSingle'
import UserDetails from './components/UserDetails'
import NotFound from './components/NotFound'
import Footer from './components/general/Footer'
import NetworkAlert from './components/general/NetworkAlert'

import * as bootstrap from 'bootstrap'
import CheckWhitelist from './components/general/checkWhitelist'
import FetchingDataLoader from './components/general/FetchingDataLoader'
window.bootstrap = bootstrap

function App() {
  const web3Ctx = useContext(Web3Context)
  const tokenCtx = useContext(TokenContext)
  const userCtx = useContext(UserContext)
  const [networkError, setNetworkError] = useState(false)

  useEffect(() => {
    if (!web3) {
      return
    }
    const loadBlockChainData = async () => {
      // Request accounts acccess if needed
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' })
      } catch (error) {
        console.error(error)
      }

      // Load account
      const account = await web3Ctx.loadAccount(web3)

      // Load Network ID
      const networkId = await web3Ctx.loadNetworkId(web3)

      // Load Contracts
      const tokenDeployedNetwork = CryptoToken.networks[networkId]
      const userDeployedNetwork = UserInfo.networks[networkId]
      const tokenContract = tokenCtx.loadContract(
        web3,
        CryptoToken,
        tokenDeployedNetwork,
      )
      const userContract = userCtx.loadContract(
        web3,
        UserInfo,
        userDeployedNetwork,
      )
      // If Token contract Loaded
      if (tokenContract) {
        tokenCtx.loadTotalSupply(tokenContract)
        tokenCtx.loadActivePeriod(tokenContract)
        tokenCtx.loadPeriods(tokenContract)
        userCtx.getAppOwner(tokenContract)
        tokenCtx.loadTokenPrice(tokenContract)
        // tokenCtx.loadMinimumTokens(tokenContract);
        account && tokenCtx.loadPurchasedTokens(tokenContract, account)
        account && userCtx.loadUserBalance(tokenContract, account)
        if (tokenCtx.activePeriod && tokenCtx.activePeriod.status) {
          tokenCtx.loadMinimumTokens(tokenContract)
        }

        tokenContract.events
          .Transfer()
          .on('data', (event) => {
            tokenCtx.setTokenIsLoading(false)
          })
          .on('error', (error) => {
            console.log(error)
          })
      } else {
        setNetworkError(true)
      }

      // If User contract Loaded
      if (userContract) {
        userCtx.setUserIsLoading(false)
        tokenCtx.loadActivity(userContract)
        account &&
          userCtx.getUserInformation(userContract, tokenContract, account)
        userCtx.getUsersList(userContract, tokenContract)
        userCtx.loadWhiteList(userContract)
        tokenCtx.loadPendingTokens(userContract)
      } else {
        userCtx.setUserIsLoading(true)
      }

      tokenCtx.setTokenIsLoading(false)
      userCtx.setUserIsLoading(false)

      // Metamask Event Subscription - Network changed
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload()
      })

      // Metamask Event Subscription - Account changed
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload()
      })
    }

    loadBlockChainData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (networkError) {
    return <NetworkAlert />
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <div id="main" className="layout-horizontal z-index-20">
          <div className="content-wrapper container">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/presale" exact element={<Presale />} />
              <Route
                path="/mint"
                element={
                  Boolean(userCtx.appOwner !== web3Ctx.account) ? (
                    <MintPeriod />
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route path="/my-info" element={<UserDetails />} />
              <Route path="/activity" element={<Activity />} />
              <Route
                path="/admin"
                element={
                  Boolean(userCtx.appOwner === web3Ctx.account) ? (
                    <Admin />
                  ) : (
                    <NotFound />
                  )
                }
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:address" element={<UserSingle />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/nowhitelist" element={<CheckWhitelist />} />
              <Route path="/networkerror" element={<NetworkAlert />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
