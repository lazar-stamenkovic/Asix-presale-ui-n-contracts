import React, { useState, useContext, useEffect } from 'react'
import Web3Context from '../../store/web3-context'
import TokenContext from '../../store/token-context'
import UserContext from '../../store/user-context'
import web3 from '../../connection/web3'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useToasts } from 'react-toast-notifications'
import { AiFillInfoCircle } from 'react-icons/ai'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import AOS from 'aos'

import MetaMaskLoader from './MetaMaskLoader'

function MintForm() {
  const web3Ctx = useContext(Web3Context)
  const tokenCtx = useContext(TokenContext)
  const userCtx = useContext(UserContext)
  const [MetaMaskOpened, setMetaMaskOpened] = useState(false)
  const [totalAvailable, setTotalAvailable] = useState(0)
  const { addToast } = useToasts()
  const navigate = useNavigate()

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [tokenAmount, setTokenAmount] = useState()
  const [tokenPrice, setTokenPrice] = useState()
  const [tokenHardcap, setTokenHardcap] = useState()

  useEffect(() => {
    if (userCtx.usersList && tokenCtx.totalSupply) {
      const totalSold = userCtx.usersList
        .map((period) => period.balance)
        .reduce((a, b) => a + b, 0)
      const totalSupply = parseFloat(tokenCtx.totalSupply) / 10 ** 18
      setTotalAvailable(totalSupply - totalSold)
    }
  }, [userCtx.usersList, tokenCtx.totalSupply])

  function onSubmit(data) {
    if (endDate.getTime() <= Date.now()) {
      addToast(`End date cannot be in the past`, {
        appearance: 'error',
      })
    } else if (startDate.getTime() >= endDate.getTime()) {
      addToast(`Start date cannot be equal or larger than End date`, {
        appearance: 'error',
      })
    } else {
      const sentAmount = parseFloat(data.tokenPrice) * 10 ** 18
      const cap = parseFloat(data.tokenHardcap) * 10 ** 18
      tokenCtx.contract.methods
        .mintTokens(
          startDate.getTime(),
          endDate.getTime(),
          parseInt(data.tokenAmount),
          new web3.utils.BN(sentAmount.toString()),
          new web3.utils.BN(cap.toString()),
        )
        .send({ from: web3Ctx.account })
        .once('sending', () => {
          setMetaMaskOpened(true)
        })
        .on('transactionHash', (hash) => {
          setMetaMaskOpened(false)
          addToast(`Great! you have successfully minted your tokens`, {
            appearance: 'success',
          })
        })
        .on('receipt', (receipt) => {
          tokenCtx.loadTotalSupply(tokenCtx.contract)
          tokenCtx.loadActivePeriod(tokenCtx.contract)
          tokenCtx.loadPeriods(tokenCtx.contract)
          tokenCtx.loadActivity(userCtx.contract)
          tokenCtx.loadMinimumTokens(tokenCtx.contract)
          tokenCtx.loadTokenPrice(tokenCtx.contract)
          tokenCtx.loadTokenHardcap(tokenCtx.contract)
          setTimeout(() => navigate('/'), 1000)
        })
        .on('error', (e) => {
          addToast(`Something went wrong while minting tokens`, {
            appearance: 'error',
          })
          setMetaMaskOpened(false)
        })
    }
  }

  return (
    <>
      {MetaMaskOpened ? <MetaMaskLoader /> : null}
      <div
        className="card shadow-lg z-index-100"
        data-aos="fade-up"
        data-aos-delay="500"
      >
        <div className="card-body p-lg-5 position-reltaive">
          <h4 className="text-center fw-bold text-uppercase letter-spacing-0">
            Create a Sale Period
          </h4>
          <p className="text-muted mb-5 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row gy-4">
                  <div className="col-lg-6">
                    <label className="form-label">Start Date</label>
                    <DatePicker
                      className="form-control"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      // showTimeSelect
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">End Date</label>
                    <DatePicker
                      className="form-control"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      // showTimeSelect
                    />
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Token Amount</label>
                    <input
                      type="number"
                      className={`${
                        errors.tokenAmount ? 'is-invalid' : null
                      } form-control`}
                      step="any"
                      placeholder="e.g. 1000"
                      defaultValue={tokenAmount}
                      onChange={(e) => {
                        setTokenAmount(e.target.value)
                      }}
                      {...register('tokenAmount', {
                        required: true,
                        min: 10,
                        max: totalAvailable,
                      })}
                    />
                    {errors.tokenAmount && (
                      <span className="invalid-feedback">
                        Minimum token must be between 10 and {totalAvailable}
                      </span>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Token Price</label>
                    <input
                      type="number"
                      className={`${
                        errors.tokenPrice ? 'is-invalid' : null
                      } form-control`}
                      placeholder="Enter price with Ethers"
                      min="0.000000000001"
                      max="20"
                      step="0.000000000001"
                      defaultValue={tokenPrice}
                      onChange={(e) => {
                        setTokenPrice(e.target.value)
                      }}
                      {...register('tokenPrice', {
                        required: true,
                        min: 0.000000000001,
                        max: 20,
                      })}
                    />
                    {errors.tokenPrice && (
                      <span className="invalid-feedback">
                        Token price must be between 0.0001 and 20 Ethers
                      </span>
                    )}
                  </div>
                  <div className="col-lg-6">
                    <label className="form-label">Hardcap</label>
                    <input
                      type="number"
                      className={`${
                        errors.tokenPrice ? 'is-invalid' : null
                      } form-control`}
                      placeholder="Enter price with Ethers"
                      min="0.1"
                      max="20"
                      step="0.1"
                      defaultValue={tokenHardcap}
                      onChange={(e) => {
                        setTokenHardcap(e.target.value)
                      }}
                      {...register('tokenHardcap', {
                        required: true,
                        min: 0.1,
                        max: 20,
                      })}
                    />
                    {errors.tokenPrice && (
                      <span className="invalid-feedback">
                        Token hardcap must be between 0.1 and 20 Ethers
                      </span>
                    )}
                  </div>
                  <div className="col-12">
                    {userCtx.usersList &&
                    userCtx.usersList.some(
                      (user) => user.account === web3Ctx.account,
                    ) ? (
                      <button
                        className="btn btn-primary w-100"
                        type="submit"
                        disabled={Boolean(userCtx.appOwner !== web3Ctx.account)}
                      >
                        Create Sale Period
                      </button>
                    ) : (
                      <Link to="/my-info" className="btn btn-primary w-100">
                        Register first to create
                      </Link>
                    )}

                    {/* DEMO ============================ */}
                    {Boolean(userCtx.appOwner !== web3Ctx.account) && (
                      <p className="text-muted text-sm mb-0 mt-2 d-flex align-items-center justify-content-center">
                        <AiFillInfoCircle className="me-1" /> only owner can
                        create period
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MintForm
