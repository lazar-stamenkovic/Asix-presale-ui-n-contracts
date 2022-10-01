import React, { useEffect, useContext, useState } from 'react'
import { formatDate, toEther } from '../../helpers/utils.js'
import { BsFillCalendar2DateFill } from 'react-icons/bs'
import TokenContext from '../../store/token-context'
import DataTable from 'react-data-table-component'
import AOS from 'aos'

const columns = [
  {
    name: 'Start Time',
    selector: (row) => row.startTime,
    cell: (row) => (
      <div row={row}>
        <p className="mb-0">{formatDate(parseInt(row.startTime))}</p>
      </div>
    ),
  },
  {
    name: 'End Time',
    selector: (row) => row.endTime,
    cell: (row) => (
      <div row={row}>
        <p className="mb-0">{formatDate(parseInt(row.endTime))}</p>
      </div>
    ),
  },
  {
    name: 'Tokens Minted',
    selector: (row) => row.tokenAmount,
    cell: (row) => (
      <div row={row}>
        <p className="mb-0">{row.tokenAmount / 10 ** 18}</p>
      </div>
    ),
  },
  {
    name: 'Status',
    selector: (row) => row.status,
    cell: (row) =>
      row.status === true ? (
        <div row={row}>
          <span className="badge bg-info">Active</span>
        </div>
      ) : row.status === false ? (
        <div row={row}>
          <span className="badge bg-danger">Ended</span>
        </div>
      ) : (
        '-'
      ),
  },
  {
    name: 'Tokens Bought',
    selector: (row) => row.remainingTokens,
    cell: (row) => (
      <div row={row}>
        <p className="mb-0">
          {row.tokenAmount / 10 ** 18 - row.remainingTokens / 10 ** 18}
        </p>
      </div>
    ),
  },
  {
    name: 'Token Price',
    selector: (row) => row.tokenPrice,
    cell: (row) => (
      <div row={row}>
        {row.tokenPrice > 0 ? (
          <p className="mb-0">{toEther(parseFloat(row.tokenPrice))} Ether</p>
        ) : (
          <p className="mb-0">-</p>
        )}
      </div>
    ),
  },
]

function PeriodsTable() {
  const tokenCtx = useContext(TokenContext)
  const [periods, setPeriods] = useState([])

  useEffect(() => {
    AOS.init({ duration: 700, disable: 'mobile' })
    AOS.refresh()
  }, [])

  useEffect(() => {
    if (tokenCtx.periods) {
      setPeriods(tokenCtx.periods)
    }
  }, [tokenCtx.periods])

  return (
    <div className="card shadow-lg" data-aos="fade-up" data-aos-delay="200">
      <div className="card-body p-lg-5">
        <div className="d-flex a;ign-items-center mb-5">
          <div className="stats-icon solid-orange">
            <BsFillCalendar2DateFill size="1.4rem" />
          </div>
          <div className="ms-3">
            <h2 className="mb-0 h4">Periods</h2>
            <p className="text-muted fw-normal mb-0">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={periods}
          pagination={periods.length >= 1 && true}
          responsive
          theme="solarized"
        />
      </div>
    </div>
  )
}

export default PeriodsTable
