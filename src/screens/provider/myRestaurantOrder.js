import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Row, Col, Table,
    Input, Button,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaSearch } from 'react-icons/fa';


import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantOrderItem from '../../components/provider/myRestaurantOrderItem';

let restaurantId = '';
export default class myRestaurantOrder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: 10,
            currentPage: 0,

            orderId: '',
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.onChangeOrderId = this.onChangeOrderId.bind(this);
        this.search = this.search.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData('');
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: 0,
            offset: offset
        }, () => {
            this.receivedData('');
        });

    };

    onChangeOrderId(e) {
        this.setState({ orderId: e.target.value });
    }

    receivedData(orderCode) {
        window.scrollTo(0, 0);
        axios.get(`/orders/restaurant?restaurantId=${restaurantId}&orderCode=${orderCode}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const ordersPaging = slice.map((order, index) => {
                    return <MyRestaurantOrderItem key={index} order={order} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    ordersPaging
                })
            });
    }

    search(e) {
        e.preventDefault();
        this.receivedData(this.state.orderId);
    }

    render() {
        const { orderId } = this.state;

        return (
            <div className="myRes-order">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem >
                        <Link to={`/users/profile/my-restaurant/detail`}>Th??ng tin</Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/image`
                            }}
                        >
                            ???nh
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/menu`,
                                state: { restaurantId: localStorage.getItem('resId') }
                            }}
                        >
                            Th???c ????n
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/combo`
                            }}
                        >
                            Combo m??n ??n
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/service`
                            }}
                        >
                            D???ch v???
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/promotion`
                            }}
                        >
                            Khuy???n m??i
                        </Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/order`
                            }}
                        >
                            ????n h??ng
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    <h3>????n h??ng</h3>
                    <hr />
                    <Row className="search-order">
                        <Col lg="4" md="4" sm="4"><div><b>M?? ????n h??ng: </b></div></Col>
                        <Col lg="6" md="6" sm="6">
                            <Input
                                type="text"
                                id="order-id"
                                value={orderId}
                                placeholder="Nh???p m?? ????n h??ng"
                                onChange={this.onChangeOrderId}
                            />
                        </Col>
                        <Col lg="2" md="2" sm="2">
                            <Button color="success" className="btn-search-order" onClick={this.search}><FaSearch className="icon-search" /></Button>
                        </Col>
                    </Row>
                    <Table className="order-table">
                        <thead>
                            <tr>
                                <th>M?? ????n</th>
                                <th>T???ng ti???n (VN??)</th>
                                <th>Ng??y ?????t</th>
                                <th>Tr???ng th??i</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.ordersPaging}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"Trang tr?????c"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </Container>
                <Footer />
            </div>
        )
    }
}
