import React, { useEffect, useState } from 'react';
import {
    Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Row,
    Col, Container, Label, Input
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import { formatDate } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import OrderDetailDishItem from '../order/orderDetailDishItem';
import OrderDetailComboItem from '../order/orderDetailComboItem';
import OrderDetailServiceItem from '../order/orderDetailServiceItem';

let restaurantId = '';

export default function MyRestaurantOrderItem(props) {
    const order = props.order;
    let orderStatus = order.order_status;
    let currentUser = localStorage.getItem('currentUser');
    let displayOrderStatus = '';

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [modal3, setModal3] = useState(false);
    const [password, setPassword] = useState('');
    const [user, setUser] = useState('');
    const [orderDetailInfo, setOrderDetailInfo] = useState('');
    const [listOrderDetails, setListOrderDetails] = useState([]);

    if (orderStatus === 'pending') {
        displayOrderStatus = <b style={{ color: 'purple' }}>Đang chờ duyệt</b>
        orderStatus = 'Đang chờ duyệt';
    } else if (orderStatus === 'preparing') {
        displayOrderStatus = <b style={{ color: 'blue' }}>Chưa diễn ra</b>
        orderStatus = 'Chưa diễn ra';
    } else if (orderStatus === 'accomplished') {
        displayOrderStatus = <b style={{ color: 'green' }}>Đã hoàn thành</b>
        orderStatus = 'Đã hoàn thành';
    } else if (orderStatus === 'cancelled') {
        displayOrderStatus = <b style={{ color: 'red' }}>Đã hủy</b>
        orderStatus = 'Đã hủy';
    }

    useEffect(() => {
        restaurantId = localStorage.getItem('resId');
    })

    const toggle = () => {
        setModal(!modal);
        if (modal === false) {
            axios.get(`/orders/orderDetail/infor?orderId=${order.order_id}&customerId=0&restaurantId=${restaurantId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    setOrderDetailInfo(res.data[0]);
                    setListOrderDetails(res.data);
                    axios.get(`/users/findByPhoneNumber/${order.customer_phone_number}`)
                        .then(res => {
                            setUser(res.data);
                        })
                })
        }
    }

    const toggle1 = () => { setModal1(!modal1) };

    const toggle2 = () => { setModal2(!modal2) };

    const toggle3 = () => { setModal3(!modal3) };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    }

    const acceptOrder = () => {
        axios.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            axios({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${order.order_id}&status=preparing`
            }).then(res => {
                axios.post(`/notifications/insertNotification`,
                    {
                        "content": `Đơn hàng ${order.order_code} đã được chấp nhận`,
                        "customer": user,
                        "provider": null,
                        "forAdmin": false,
                        "type": "order",
                        "read": false
                    }
                )
                    .then(res => {
                        window.location.reload();
                        toast.success("Nhận đơn thành công !", {
                            position: "top-left",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
            }).catch(err => {
                toast.error('Nhận đơn không thành công !', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }).catch(err => {
            toast.error('Mật khẩu không đúng !', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    const cancelOrder = () => {
        axios.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            axios({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${order.order_id}&status=cancelled`
            }).then(res => {
                axios.post(`/notifications/insertNotification`,
                    {
                        "content": `Đơn hàng ${order.order_code} đã bị hủy`,
                        "customer": user,
                        "provider": null,
                        "forAdmin": false,
                        "type": "order",
                        "read": false
                    }
                )
                    .then(res => {
                        window.location.reload();
                        toast.success("Hủy đơn thành công !", {
                            position: "top-left",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
            }).catch(err => {
                toast.error('Hủy đơn không thành công !', {
                    position: "top-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            })
        }).catch(err => {
            toast.error('Mật khẩu không đúng !', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    const completeOrder = () => {
        axios.post('/users/login', {
            phoneLogin: currentUser,
            password: password
        }).then(res => {
            axios({
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                url: `/orders/updateStatus?orderId=${order.order_id}&status=accomplished`
            }).then(res => {
                axios.post(`/notifications/insertNotification`,
                    {
                        "content": `Đơn hàng ${order.order_code} đã hoàn thành`,
                        "customer": user,
                        "provider": null,
                        "forAdmin": false,
                        "type": "order",
                        "read": false
                    }
                )
                    .then(res => {
                        window.location.reload();
                        toast.success("Xác nhận hoành thành đơn hàng thành công !", {
                            position: "top-left",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    }).catch(err => {
                        toast.error('Xác nhận hoành thành đơn hàng không thành công !', {
                            position: "top-left",
                            autoClose: 2000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                    })
            });
        }).catch(err => {
            toast.error('Mật khẩu không đúng !', {
                position: "top-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })
    }

    return (
        <tr>
            <td>{order.order_code}</td>
            <td>{formatCurrency(order.amount)}</td>
            <td>{formatDate(order.order_date)}</td>
            <td>{displayOrderStatus}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEye className="icon-see-more" />Chi tiết
                </Button>
                <Modal isOpen={modal} toggle={toggle} className={`modal-order`}>
                    <ModalHeader toggle={toggle}>Chi tiết đơn hàng</ModalHeader>
                    <ModalBody>
                        {
                            orderDetailInfo && <Container>
                                <Row>
                                    <Col lg="6" md="6" sm="12" className="info-order">
                                        <h4>Thông tin đơn hàng</h4>
                                        <hr />
                                        <div className="od-info-code"><b>Mã số đơn hàng: </b>{orderDetailInfo.order_code}</div>
                                        <div className="od-info-name"><b>Tên khách hàng: </b>{user.name}</div>
                                        <div className="od-info-phone"><b>Số điện thoại: </b>{order.customer_phone_number}</div>
                                        <div className="od-info-type"><b>Loại bàn: </b>{orderDetailInfo.table_type}</div>
                                        <div className="od-info-guest-number"><b>Số lượng khách: </b>{orderDetailInfo.number_of_guests}</div>
                                        <div className="od-info-order-date"><b>Thời gian đặt: </b>{formatDate(orderDetailInfo.order_date)}</div>
                                        <div className="od-info-organize-date">
                                            <b>Thời gian tổ chức: </b>{orderDetailInfo.time + ' ' + formatDate(orderDetailInfo.organize_date)}
                                        </div>
                                        <div className="od-info-note"><b>Ghi chú: </b>{orderDetailInfo.note}</div>
                                        <div className="od-info-status"><b>Trạng thái: </b>{displayOrderStatus}</div>
                                        <hr />
                                        <div className="info-order-amount">
                                            <h5>Tổng tiền: {formatCurrency(orderDetailInfo.total_amount)} VNĐ</h5>
                                            <h5 >Tiền đặt cọc (10%): {formatCurrency(orderDetailInfo.total_amount * 10 / 100)} VNĐ</h5>
                                            <Row className="info-order-btn">
                                                {
                                                    orderStatus === 'Đang chờ duyệt' && (
                                                        <Col lg="6" md="6" sm="6">
                                                            <Button color="success" onClick={toggle1}>
                                                                Nhận đơn
                                                            </Button>
                                                            <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                                                <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                                                                <ModalBody>
                                                                    <Label for="password"><b>Nhập mật khẩu của bạn: </b></Label>
                                                                    <Input
                                                                        type="password"
                                                                        id="password"
                                                                        placeholder="Nhập mật khẩu"
                                                                        value={password}
                                                                        onChange={onChangePassword}
                                                                    />
                                                                </ModalBody>
                                                                <ModalFooter>
                                                                    <Button color="success" onClick={() => acceptOrder()}>Xác nhận</Button>
                                                                    <Button color="secondary" onClick={toggle1}>Trở lại</Button>
                                                                </ModalFooter>
                                                            </Modal>
                                                        </Col>
                                                    )

                                                }
                                                {
                                                    (orderStatus === 'Chưa diễn ra')
                                                    && <Col lg="5" md="5" sm="5">
                                                        <Button color="success" onClick={toggle3}>Hoàn thành</Button>
                                                        <Modal isOpen={modal3} toggle={toggle3} className={``}>
                                                            <ModalHeader toggle={toggle3}>Thông báo</ModalHeader>
                                                            <ModalBody>
                                                                <Label for="password"><b>Nhập mật khẩu của bạn: </b></Label>
                                                                <Input
                                                                    type="password"
                                                                    id="password"
                                                                    placeholder="Nhập mật khẩu"
                                                                    value={password}
                                                                    onChange={onChangePassword}
                                                                />
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="success" onClick={() => completeOrder()}>Xác nhận</Button>
                                                                <Button color="secondary" onClick={toggle3}>Trở lại</Button>
                                                            </ModalFooter>
                                                        </Modal>
                                                    </Col>
                                                }
                                                {
                                                    (orderStatus === 'Đang chờ duyệt' || orderStatus === 'Chưa diễn ra')
                                                    && <Col lg="5" md="5" sm="5">
                                                        <Button color="danger" onClick={toggle2}>Hủy đơn</Button>
                                                        <Modal isOpen={modal2} toggle={toggle2} className={``}>
                                                            <ModalHeader toggle={toggle2}>Thông báo</ModalHeader>
                                                            <ModalBody>
                                                                <Label for="password"><b>Nhập mật khẩu của bạn: </b></Label>
                                                                <Input
                                                                    type="password"
                                                                    id="password"
                                                                    placeholder="Nhập mật khẩu"
                                                                    value={password}
                                                                    onChange={onChangePassword}
                                                                />
                                                            </ModalBody>
                                                            <ModalFooter>
                                                                <Button color="success" onClick={() => cancelOrder()}>Xác nhận</Button>
                                                                <Button color="secondary" onClick={toggle2}>Trở lại</Button>
                                                            </ModalFooter>
                                                        </Modal>
                                                    </Col>
                                                }

                                            </Row>
                                        </div>
                                    </Col>
                                    <Col lg="6" md="6" sm="12">
                                        <Row>
                                            <Col lg="12" md="12" sm="12"><OrderDetailDishItem listOrderDetails={listOrderDetails} /></Col>
                                            <Col lg="12" md="12" sm="12"><OrderDetailComboItem listOrderDetails={listOrderDetails} /></Col>
                                            <Col lg="12" md="12" sm="12"><OrderDetailServiceItem listOrderDetails={listOrderDetails} /></Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
            <ToastContainer />
        </tr>
    )
}
