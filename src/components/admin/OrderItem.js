import React, { useState } from 'react';
import {
    Row, Col, ModalFooter,
    Button, CardImg, Modal, ModalBody, ModalHeader
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';

import { formatDate } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import OrderDetailDishItem from '../order/orderDetailDishItem';
import OrderDetailComboItem from '../order/orderDetailComboItem';
import OrderDetailServiceItem from '../order/orderDetailServiceItem';

export default function OrderItem(props) {
    const order = props.order;

    let orderStatus = order.order_status;
    let displayOrderStatus = '';

    const [modal, setModal] = useState(false);
    const [restaurantInfo, setRestaurantInfo] = useState('');
    const [customerName, setCustomerName] = useState('');
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

    const toggle = () => {
        setModal(!modal);
        if (modal === false) {
            axios.get(`/orders/searchOrder?orderCode=${order.order_code}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
                .then(res => {
                    setRestaurantInfo(res.data[0]);
                    setOrderDetailInfo(res.data[0]);
                    setListOrderDetails(res.data);
                    axios.get(`/users/findByPhoneNumber/${res.data[0].phone_number}`)
                        .then(res => {
                            setCustomerName(res.data.name);
                        })
                })
        }
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
                            listOrderDetails.length > 0 ? (<div>
                                <Row className="od-content-header">
                                    <Col lg="6" sm="12" className="order-detail-restaurant">
                                        <CardImg
                                            className="od-restaurant-img"
                                            src={`/images/${restaurantInfo.image_restaurant_id}`}
                                            alt="Nhà hàng"
                                            width="100px"
                                            height="200px"
                                        />
                                    </Col>

                                    <Col lg="6" sm="12" className="od-info">
                                        <div className="od-restaurant-content">
                                            <div className="od-restaurant-name"><b>Tên nhà hàng: </b>{restaurantInfo.restaurant_name}</div>
                                            <div className="od-restaurant-address"><b>Địa chỉ: </b>{restaurantInfo.province}</div>
                                            <div className="od-restaurant-type"><b>Loại hình: </b>{restaurantInfo.restaurant_type}</div>
                                        </div>
                                        <hr />
                                        <div className="od-info-code"><b>Mã số đơn hàng: </b>{orderDetailInfo.order_code}</div>
                                        <div className="od-info-name"><b>Tên khách hàng: </b>{customerName}</div>
                                        <div className="od-info-phone"><b>Số điện thoại: </b>{orderDetailInfo.phone_number}</div>
                                        <div className="od-info-type"><b>Loại bàn: </b>{orderDetailInfo.table_type}</div>
                                        <div className="od-info-guest-number"><b>Số lượng khách: </b>{orderDetailInfo.number_of_guests}</div>
                                        <div className="od-info-order-date"><b>Thời gian đặt: </b>{formatDate(orderDetailInfo.order_date)}</div>
                                        <div className="od-info-organize-date">
                                            <b>Thời gian tổ chức: </b>{orderDetailInfo.time + ' ' + formatDate(orderDetailInfo.organize_date)}
                                        </div>
                                        <div className="od-info-note"><b>Ghi chú: </b>{orderDetailInfo.note}</div>
                                        <div className="od-info-status"><b>Trạng thái: </b>{orderStatus}</div>
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
                                        <h5>Tổng tiền: {formatCurrency(orderDetailInfo.total_amount)} VNĐ</h5>
                                        <h5 >Tiền đặt cọc (10%): {formatCurrency(orderDetailInfo.total_amount * 10 / 100)} VNĐ</h5>
                                    </div>
                                </div>
                            </div>) : (
                                <h4>Không có thông tin</h4>
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
