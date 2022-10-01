import React, { useEffect, useContext, useState } from 'react';
import { FaChartArea } from 'react-icons/fa';
import { Jazzicon } from '@ukstv/jazzicon-react';
import { Link } from 'react-router-dom';
import { formatDate, toEther } from '../../helpers/utils.js';
import TokenContext from '../../store/token-context';
import UserContext from '../../store/user-context';
import DataTable from 'react-data-table-component';
import AOS from 'aos';

const columns = [
    {
        name: 'User',
        selector: (row) => row.account,
        cell: (row) => (
            <div row={row}>
                <Link to={`/users/${row.account}`} className='text-reset'>
                    <div className='d-flex align-items-center'>
                        <div style={{ width: '35px', height: '35px' }}>
                            <Jazzicon address={row.account} />
                        </div>
                        <p className='ms-2 mb-0 fw-bold'>{row.name}</p>
                    </div>
                </Link>
            </div>
        ),
    },
    {
        name: 'Time',
        selector: (row) => row.time,
        cell: (row) => (
            <div row={row}>
                <p className='mb-0'>{formatDate(parseInt(row.time) * 1000)}</p>
            </div>
        ),
    },
    {
        name: 'Action',
        selector: (row) => row.action,
        cell: (row) =>
            row.action === 'Mint' ? (
                <div row={row}>
                    <span className='badge bg-primary'>Mint Token</span>
                </div>
            ) : row.action === 'Request tokens' ? (
                <div row={row}>
                    <span className='badge bg-success'>Tokens Requested</span>
                </div>
            ) : row.action === 'Dis approved!' ? (
                <div row={row}>
                    <span className='badge bg-danger'>Tokens Disapproved</span>
                </div>
            ) : row.action === 'Approved' ? (
                <div row={row}>
                    <span className='badge bg-info'>Token Approved</span>
                </div>
            ) : row.action === 'Added to whitelist' ? (
                <div row={row}>
                    <span className='badge bg-teal'>Added to whitelist</span>
                </div>
            ) : row.action === 'Removed from whitelist' ? (
                <div row={row}>
                    <span className='badge bg-danger'>Removed from whitelist</span>
                </div>
            ) : (
                '-'
            ),
    },
    {
        name: 'Tokens Amount',
        selector: (row) => row.amount,
        cell: (row) => (
            <div row={row}>
                {row.amount > 0 ? <p className='mb-0'>{row.amount / 10 ** 18}</p> : <p className='mb-0'>-</p>}
            </div>
        ),
    },
    {
        name: 'Token Price',
        selector: (row) => row.tokenPrice,
        cell: (row) => (
            <div row={row}>
                {row.tokenPrice > 0 ? (
                    <p className='mb-0'>{toEther(parseFloat(row.tokenPrice))} Ether</p>
                ) : (
                    <p className='mb-0'>-</p>
                )}
            </div>
        ),
    },
    {
        name: 'Total Price',
        selector: (row) => row.tokenPrice,
        cell: (row) => (
            <div row={row}>
                {row.tokenPrice > 0 ? (
                    <p className='mb-0'>{(toEther(parseFloat(row.tokenPrice)) * row.amount) / 10 ** 18} Ether</p>
                ) : (
                    <p className='mb-0'>-</p>
                )}
            </div>
        ),
    },
];

function ActivityTable() {
    const tokenCtx = useContext(TokenContext);
    const userCtx = useContext(UserContext);
    const [activity, setActivity] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 700, disable: 'mobile' });
        AOS.refresh();
    }, []);

    useEffect(() => {
        if (tokenCtx.activity && userCtx.usersList) {
            const activities = tokenCtx.activity.map((item) => {
                return {
                    account: item[0],
                    name: userCtx.usersList.filter((user) => user.account === item[0])[0].fullName,
                    amount: item[1],
                    tokenPrice: item[2],
                    time: item[3],
                    periodIndex: item[4],
                    action: item[5],
                };
            });

            setActivity(activities);
        }
    }, [tokenCtx.activity, userCtx.usersList]);
    return (
        <div className='card shadow-lg' data-aos='fade-up' data-aos-delay='200'>
            <div className='card-body p-lg-5'>
                <div className='d-flex a;ign-items-center mb-5'>
                    <div className='stats-icon solid-cyan'>
                        <FaChartArea size='1.4rem' />
                    </div>
                    <div className='ms-3'>
                        <h2 className='mb-0 h4'>Recent Activities</h2>
                        <p className='text-muted fw-normal mb-0'>
                            Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </div>
                </div>

                <DataTable
                    columns={columns}
                    data={activity}
                    pagination={activity.length >= 1 && true}
                    responsive
                    theme='solarized'
                />
            </div>
        </div>
    );
}

export default ActivityTable;
