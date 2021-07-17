import React from 'react';
import { CardImg, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

import { formatDate } from '../../common/formatDate';

export default function OrderItem(props) {
    const order = props.order;

    return (
        <Col className="order-col" lg="6" md="12" sm="12">
            <div className="order-item item">
                <CardImg className="order-img" src={`/images/${order.image_restaurant_id}`} width="200px" height="300px" alt="order" />
                <div className="order-content">
                    <div className="order-code">Mã số đơn hàng: {order.order_code} </div>
                    <div className="order-restaurant-name">Tên nhà hàng: {order.restaurant_name}</div>
                    <div className="order-type">{order.restaurant_type}</div>
                    <div className="order-date">Thời gian diễn ra: {order.time}</div>
                    <div className="order-order-date">Ngày đặt: {formatDate(order.order_date)}</div>
                    <Link to={`/users/profile/orderDetail/${order.order_id}`}>Xem chi tiết</Link>
                </div>
            </div>
        </Col>
    )
}
