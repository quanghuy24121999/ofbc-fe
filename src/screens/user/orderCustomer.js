import React, { Component } from 'react';
import {
    Container, Row, NavLink, Nav, NavItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import OrderItem from '../../components/order/orderItem';
import { onChangeLinkStatus } from '../../common/changeLink';


let userId = '';
export default class orderCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: 4,
            currentPage: 0,
            status: 1
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        userId = localStorage.getItem('userId');
        this.receivedData();
    }

    receivedData() {
        axios.get(`/orders/customer?customerId=${userId}&statusId=${this.state.status}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const orderPaging = slice.map((order, index) => {
                    return <OrderItem key={index} order={order} />
                })
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    orderPaging
                })
            })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData();
        });

    };

    onChangeStatus(status) {
        onChangeLinkStatus(status);
        this.setState({
            offset: 0,
            status: status
        }, () => {
            axios.get(`/orders/customer?customerId=${userId}&statusId=${this.state.status}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    const data = res.data;
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    const orderPaging = slice.map((order, index) => {
                        return <OrderItem key={index} order={order} />
                    })
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orderPaging
                    })
                })
        });
    }

    render() {
        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/users/profile`}>Hồ sơ</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/users/profile/order`}>Đơn của tôi</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/my-restaurant`}>Nhà hàng của tôi</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={``}>Ví FBS</Link>
                    </NavItem>
                </Nav>
                <Container className="order">
                    <Nav pills className="order-nav-status">
                        <NavItem onClick={() => this.onChangeStatus(1)}>
                            <NavLink active id="1">Chờ duyệt</NavLink>
                        </NavItem>
                        <NavItem onClick={() => this.onChangeStatus(2)}>
                            <NavLink id="2">Chưa diễn ra</NavLink>
                        </NavItem>
                        <NavItem onClick={() => this.onChangeStatus(3)}>
                            <NavLink id="3">Đã diễn ra</NavLink>
                        </NavItem>
                        <NavItem onClick={() => this.onChangeStatus(4)}>
                            <NavLink id="4">Đã hủy</NavLink>
                        </NavItem>
                    </Nav>
                    <Row className="order-row">
                        {this.state.orderPaging}
                    </Row>
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Container>
                <Footer />
            </div>
        )
    }
}
