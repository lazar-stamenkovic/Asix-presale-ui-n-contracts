import React, { useState, useContext, useEffect } from 'react'
import Web3Context from '../../store/web3-context'
import UserContext from '../../store/user-context'
import TokenContext from '../../store/token-context'
import web3 from '../../connection/web3'
// import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form'
import 'react-datepicker/dist/react-datepicker.css'
import AOS from 'aos'
import MetaMaskLoader from './MetaMaskLoader'
import { useToasts } from 'react-toast-notifications'

function InfoForm({
  fullName,
  email,
  role,
  about,
  setFullName,
  setEmail,
  setRole,
  setAbout,
}) {
  const web3Ctx = useContext(Web3Context)
  const userCtx = useContext(UserContext)
  const tokenCtx = useContext(TokenContext)
  const [metaMaskOpened, setMetaMaskOpened] = useState(false)
  const { addToast } = useToasts()
  // const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  function onSubmit(data) {
    if (
      userCtx.usersList &&
      userCtx.usersList
        .filter((user) => user.account !== web3Ctx.account)
        .map((el) => el.fullName.trim())
        .includes(data.fullName.trim())
    ) {
      addToast('This name is already taken', {
        appearance: 'error',
      })
    } else {
      tokenCtx.contract.methods
        .addUser(web3Ctx.account, data.fullName)
        .send({ from: web3Ctx.account })
        .once('sending', function (payload) {
          setMetaMaskOpened(true)
        })
        .on('transactionHash', (hash) => {
          setMetaMaskOpened(false)
          addToast('Cool! your data has been updated!', {
            appearance: 'success',
          })
        })
        .on('receipt', (receipt) => {
          userCtx.getUsersList(userCtx.contract, tokenCtx.contract)
          userCtx.getUserInformation(
            userCtx.contract,
            tokenCtx.contract,
            web3Ctx.account,
          )
          web3Ctx.loadAccount(web3)
        })
        .on('error', (e) => {
          addToast('Something went wrong when pushing to the blockchain', {
            appearance: 'error',
          })
          setMetaMaskOpened(false)
        })
    }
  }

  return (
    <>
      {metaMaskOpened ? <MetaMaskLoader /> : null}
      <div className="card" data-aos="fade-up" data-aos-delay="300">
        <div className="card-body p-lg-5">
          <h4 className="text-center fw-bold text-uppercase letter-spacing-0">
            Update your Infromation
          </h4>
          <p className="text-muted mb-5 text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row gy-4">
              <div className="col-lg-6">
                <label className="form-label">Code Name</label>
                <input
                  type="text"
                  className={`${
                    errors.fullName ? 'is-invalid' : null
                  } form-control`}
                  placeholder="e.g. Jason Doe"
                  defaultValue={fullName ? fullName : ''}
                  onChange={(e) => setFullName(e.target.value)}
                  {...register('fullName', {
                    required: true,
                    minLength: 1,
                    maxLength: 20,
                  })}
                />
                {errors.fullName && (
                  <span className="invalid-feedback">
                    Please enter your full name
                  </span>
                )}
              </div>

              <div className="col-12">
                <button className="btn btn-primary w-100" type="submit">
                  Update your info
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default InfoForm
