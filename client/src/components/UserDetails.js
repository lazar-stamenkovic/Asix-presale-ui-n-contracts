import React, { useEffect, useContext, useState } from 'react'
import AOS from 'aos'
import { FaBitcoin } from 'react-icons/fa'
import { useToasts } from 'react-toast-notifications'
import { toEther } from '../helpers/utils'
import UserContext from '../store/user-context'
import Web3Context from '../store/web3-context'
import TokenContext from '../store/token-context'
import InfoForm from './general/InfoForm'
import FetchingDataLoader from './general/FetchingDataLoader'

import MetaMaskLoader from './general/MetaMaskLoader'

function UserInfo() {
  const userCtx = useContext(UserContext)
  const tokenCtx = useContext(TokenContext)
  const web3Ctx = useContext(Web3Context)
  const [fullName, setFullName] = useState(null)
  const [purchasedToken, setPurchasedToken] = useState(0)
  const [pendingTokens, setPendingTokens] = useState(0)
  const [totalShare, setTotalShare] = useState(0)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const { addToast } = useToasts()

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  useEffect(() => {
    if (userCtx.userInformation) {
      setFullName(userCtx.userInformation.fullName)
    }
  }, [userCtx.userInformation])

  useEffect(() => {
    if (userCtx.userBalance) {
      setPurchasedToken(parseFloat(userCtx.userBalance))
    }
  }, [userCtx.userBalance])

  useEffect(() => {
    if (tokenCtx.totalSupply && userCtx.userBalance) {
      const totalAmounts = toEther(tokenCtx.totalSupply)
      const userTokens = toEther(userCtx.userBalance)
      setTotalShare(((userTokens / totalAmounts) * 100).toFixed(3))
    }
  }, [tokenCtx.totalSupply, userCtx.userBalance])

  useEffect(() => {
    if (tokenCtx.pendingTokens) {
      setPendingTokens(
        tokenCtx.pendingTokens
          .filter((token) => token.account === web3Ctx.account)
          .map((token) => token.amount),
      )
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenCtx.pendingTokens])

  function cancelTokenRequestHandler(address) {
    tokenCtx.contract.methods
      .disApproveToken(address)
      .send({ from: web3Ctx.account })
      .once('sending', function (payload) {
        setMetaMaskOpened(true)
      })
      .on('transactionHash', (hash) => {
        setMetaMaskOpened(false)
        addToast(`Great! you have diapproved requested token`, {
          appearance: 'success',
        })
      })
      .on('receipt', (receipt) => {
        tokenCtx.loadPendingTokens(userCtx.contract)
        tokenCtx.loadActivePeriod(tokenCtx.contract)
        tokenCtx.loadPurchasedTokens(tokenCtx.contract)
        tokenCtx.loadActivity(userCtx.contract)
        userCtx.loadUserBalance(tokenCtx.contract, web3Ctx.account)
      })
      .on('error', (e) => {
        addToast('Something went wrong when pushing to the blockchain', {
          appearance: 'error',
        })
        setMetaMaskOpened(false)
      })
  }

  if (userCtx.userIsLoading) {
    return <FetchingDataLoader />
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="row my-5 pt-4">
        <div className="col-lg-9">
          <h1 className='token-title' data-aos="fade-up">Welcome! {fullName}</h1>
          <p
            className="token-intro-text lead"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
      </div>

      <div className="row gy-5">
        <div className="col-lg-5">
          {tokenCtx.pendingTokens &&
            tokenCtx.pendingTokens.map((token, index) => {
              return (
                token.amount !== '0' &&
                token.account === web3Ctx.account && (
                  <div
                    className="card"
                    data-aos="fade-up-right"
                    data-aos-delay="300"
                    key={index}
                  >
                    <div className="card-body p-lg-5">
                      <h2 className="h4">Changed your mind?</h2>
                      <p className="text-sma text-muted mb-4">
                        Cancel your request and get back your balance
                      </p>
                      <div className="d-flex align-items-center p-3 bg-light rounded-lg">
                        <div className="me-4">
                          <span className="text-sm d-none d-sm-inline-block">
                            {' '}
                            You've Requested{' '}
                          </span>
                          <span className="fw-bold text-primary mx-1">
                            {parseFloat(token.amount) / 10 ** 18}
                          </span>
                          <span className="text-sm">Tokens</span>
                        </div>
                        <div className="ms-auto">
                          <button
                            className="btn btn-danger btn-sm m-1"
                            onClick={() =>
                              cancelTokenRequestHandler(token.account)
                            }
                          >
                            Cancel Request
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              )
            })}
          <div className="card" data-aos="fade-up" data-aos-delay="200">
            <div className="card-body p-lg-5">
              <div className="d-flex mb-4">
                <div className="stats-icon solid-turquoise">
                  <FaBitcoin size="1.4rem" />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Your purchased tokens</h6>
                  <h6 className="h4 fw-normal mb-0">
                    {purchasedToken > 0 ? purchasedToken / 10 ** 18 : 0}
                  </h6>
                </div>
              </div>
              <div className="d-flex mb-4">
                <div className="stats-icon solid-cyan">
                  <FaBitcoin size="1.4rem" />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Your pending tokens</h6>
                  <h6 className="h4 fw-normal mb-0">
                    {pendingTokens > 0 ? toEther(pendingTokens) : 0}
                  </h6>
                </div>
              </div>
              <div className="d-flex">
                <div className="stats-icon solid-orange">
                  <FaBitcoin size="1.4rem" />
                </div>
                <div className="ms-3">
                  <h6 className="text-muted mb-0">Your total share</h6>
                  <h6 className="h4 fw-normal mb-0">
                    {totalShare > 0 ? totalShare + '%' : '0%'}
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <InfoForm
            {...{
              fullName,
              setFullName,
            }}
          />
        </div>
      </div>
    </>
  )
}

export default UserInfo
