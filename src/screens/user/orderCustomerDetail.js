import React, { Component } from 'react';
import {
    Container, Nav, NavItem, CardImg, Row, Col,
    Button, Modal, ModalHeader, Label, Input,
    ModalBody, ModalFooter,
} from 'reactstrap';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import OrderDetailDishItem from '../../components/order/orderDetailDishItem';
import OrderDetailComboItem from '../../components/order/orderDetailComboItem';
import OrderDetailServiceItem from '../../components/order/orderDetailServiceItem';
import { formatDate } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';

let currentUser = localStorage.getItem('currentUser');
export default class orderCustomerDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            restaurantInfo: '',
            orderDetailInfo: '',
            listOrderDetails: [],
            dishes: [],
            combos: [],
            services: [],
            password: '',
            modal: false
        }

        this.cancelOrder = this.cancelOrder.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const orderId = this.props.match.params.orderId;
        const customerId = localStorage.getItem('userId');
        axios.get(`/orders/orderDetail/infor?orderId=${orderId}&customerId=${customerId}&restaurantId=0`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                if (res.data.length === 0) {
                    <Redirect to={
                        {
                            pathname: "/users/profile/order"
                        }
                    } />
                } else {
                    this.setState({
                        restaurantInfo: res.data[0],
                        orderDetailInfo: res.data[0],
                        listOrderDetails: res.data
                    });
                }
            })
    }

    toggle() {
        this.setState({ modal: !this.state.modal });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }

    cancelOrder() {
        const { orderDetailInfo, password, restaurantInfo } = this.state;
        axios.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            axios({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${orderDetailInfo.order_id}&status=cancelled`
            }).then(res => {
                axios.get(`/restaurants/getProviderPhoneLogin?restaurantId=${restaurantInfo.restaurant_id}`)
                    .then(res => {
                        axios.get(`/users/findByPhoneNumber/${res.data}`)
                            .then(res => {
                                axios.post(`/notifications/insertNotification`,
                                    {
                                        "content": `????n h??ng ${orderDetailInfo.order_code} c???a ${restaurantInfo.restaurant_name} ???? b??? h???y`,
                                        "customer": null,
                                        "provider": res.data,
                                        "forAdmin": false,
                                        "type": "order",
                                        "read": false
                                    }
                                ).then(res => {
                                    window.location.reload();
                                    Notify('H???y ????n th??nh c??ng', 'success', 'top-right');
                                })
                            })
                    })
            }).catch(err => {
                Notify('H???y ????n kh??ng th??nh c??ng', 'error', 'top-right');
            })
        }).catch(err => {
            Notify('M???t kh???u kh??ng ????ng', 'error', 'top-right');
        })
    }

    render() {
        const { listOrderDetails, restaurantInfo, orderDetailInfo } = this.state;
        let orderStatus = '';

        if (orderDetailInfo.order_status === 'pending') {
            orderStatus = 'Ch??? duy???t';
        }
        if (orderDetailInfo.order_status === 'preparing') {
            orderStatus = 'Ch??a di???n ra';
        }
        if (orderDetailInfo.order_status === 'accomplished') {
            orderStatus = '???? di???n ra';
        }
        if (orderDetailInfo.order_status === 'cancelled') {
            orderStatus = '???? h???y';
        }

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/users/profile`}>H??? s??</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/users/profile/order`}>????n c???a t??i</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/users/profile/my-restaurant`}>Nh?? h??ng c???a t??i</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={``}>V?? FBS</Link>
                    </NavItem>
                </Nav>

                <Container className="order-detail-content">
                    <Row className="od-content-header">
                        <Col lg="6" sm="12" className="order-detail-restaurant">
                            <CardImg
                                className="od-restaurant-img"
                                src={`/images/${restaurantInfo.image_restaurant_id}`}
                                alt="Nh?? h??ng"
                                width="100px"
                                height="200px"
                            />
                        </Col>

                        <Col lg="6" sm="12" className="od-info">
                            <div className="od-restaurant-content">
                                <div className="od-restaurant-name"><b>T??n nh?? h??ng: </b>{restaurantInfo.restaurant_name}</div>
                                <div className="od-restaurant-address"><b>?????a ch???: </b>{restaurantInfo.province}</div>
                                <div className="od-restaurant-type"><b>Lo???i h??nh: </b>{restaurantInfo.restaurant_type}</div>
                                <Link to={`/restaurant-detail/${restaurantInfo.restaurant_id}`}>??i ?????n nh?? h??ng</Link>
                            </div>
                            <hr />
                            <div className="od-info-code"><b>M?? s??? ????n h??ng: </b>{orderDetailInfo.order_code}</div>
                            <div className="od-info-type"><b>Lo???i b??n: </b>{orderDetailInfo.table_type}</div>
                            <div className="od-info-guest-number"><b>S??? l?????ng kh??ch: </b>{orderDetailInfo.number_of_guests}</div>
                            <div className="od-info-order-date"><b>Th???i gian ?????t: </b>{formatDate(orderDetailInfo.order_date)}</div>
                            <div className="od-info-organize-date">
                                <b>Th???i gian t??? ch???c: </b>{orderDetailInfo.time + ' ' + formatDate(orderDetailInfo.organize_date)}
                            </div>
                            <div className="od-info-note"><b>Ghi ch??: </b>{orderDetailInfo.note}</div>
                            <div className="od-info-status"><b>Tr???ng th??i: </b>{orderStatus}</div>
                        </Col>
                    </Row>

                    <hr></hr>

                    <Row className="od-content-detail">
                        <Col><OrderDetailDishItem listOrderDetails={listOrderDetails} /></Col>
                        <Row>
                            <Col><OrderDetailComboItem listOrderDetails={listOrderDetails} /></Col>
                            <Col><OrderDetailServiceItem listOrderDetails={listOrderDetails} /></Col>
                        </Row>
                    </Row>
                    <div className="order-detail-footer">
                        <div className="order-detail-amount">
                            <h5>T???ng ti???n: {formatCurrency(orderDetailInfo.total_amount)} VN??</h5>
                            <h5 >Ti???n ?????t c???c (10%): {formatCurrency(orderDetailInfo.total_amount * 10 / 100)} VN??</h5>
                        </div>
                        {
                            orderDetailInfo.order_status !== "cancelled" &&
                            orderDetailInfo.order_status !== "accomplished" &&
                            <Button color="danger" onClick={this.toggle}>H???y ?????t</Button>
                        }
                        <Modal isOpen={this.state.modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??ng b??o</ModalHeader>
                            <ModalBody>
                                <Label for="password"><b>Nh???p m???t kh???u c???a b???n: </b></Label>
                                <Input
                                    type="password"
                                    id="password"
                                    placeholder="Nh???p m???t kh???u"
                                    value={this.state.password}
                                    onChange={this.onChangePassword}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={() => this.cancelOrder()}>X??c nh???n</Button>
                                <Button color="secondary" onClick={this.toggle}>Tr??? l???i</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                </Container>

                <Footer />
            </div>
        )
    }
}
