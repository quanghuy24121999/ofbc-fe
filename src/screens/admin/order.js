import React, { useEffect, useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars, FaSearch } from 'react-icons/fa';
import {
    Container, Input,
    Button, Table
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';

import Notification from '../../components/admin/Notification';
import OrderItem from '../../components/admin/OrderItem';

function Order() {
    const [toggled, setToggled] = useState(false);
    const [orderCode, setOrderCode] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [status, setStatus] = useState('');
    const [offset, setOffset] = useState(0);
    const [perPage, setPerpage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [orders, setOrders] = useState([]);
    const [pageCount, setPageCount] = useState(0);

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const onChangeOrderCode = (e) => {
        setOrderCode(e.target.value)
    };

    const onChangeFrom = (e) => {        
        setFrom(e.target.value);
    };

    const onChangeTo = (e) => {        
        setTo(e.target.value);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData('', '', '', '');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        // receivedData(0, '');
    };

    const receivedData = (orderCode, from, to, status) => {
        window.scrollTo(0, 0);
        axios.get(`/orders/getOrders?orderCode=${orderCode}&fromDate=${from}&toDate=${to}&status=${status}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                const data = res.data;
                const slice = data.slice(offset, offset + perPage)
                const ordersPaging = slice.map((order, index) => {
                    return <OrderItem key={index} order={order} />
                })

                setOrders(ordersPaging);
                setPageCount(Math.ceil(data.length / perPage));
            })
    }

    const search = () => {
        receivedData(orderCode, from, to, status);
    }

    const Logout = () => {
        localStorage.clear();
    }

    return (
        <div className={`admin ${toggled ? 'toggled' : ''}`}>
            <SlideBar
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                inComponent="order"
            />

            <div className="main">
                <div className="navbar-top">
                    <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                        <FaBars />
                    </div>
                    <div className="admin-nav-number-user"></div>
                    <div className="admin-nav-infor">
                        <Notification />
                        <Link className="btn btn-primary" to='/login' onClick={Logout}>Đăng xuất</Link>
                    </div>
                </div>
                <Container>
                    <div className="search-order-admin">
                        <div>
                            <Input
                                type="text"
                                id="order-id"
                                value={orderCode}
                                placeholder="Nhập mã đơn hàng"
                                onChange={onChangeOrderCode}
                            />
                        </div>
                        <div className="order-from">
                            <div><b>Từ </b></div>
                            <Input
                                type="date"
                                value={from}
                                max={to}
                                onChange={onChangeFrom}
                            />
                        </div>
                        <div className="order-to">
                            <div><b>Đến </b></div>
                            <Input
                                type="date"
                                value={to}
                                min={from}
                                onChange={onChangeTo}
                            />
                        </div>
                        <div>
                            <Button color="success" className="btn-search-order" onClick={search}><FaSearch className="icon-search" /></Button>
                        </div>
                    </div>
                    <Table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã đơn</th>
                                <th>Tổng tiền (VNĐ)</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 && orders}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Container>
            </div>

        </div>
    );
}

export default Order;
