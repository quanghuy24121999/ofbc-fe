import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, ModalBody,
    ModalFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';

export default function RestaurantPendingItem(props) {
    const restaurant = props.restaurant;
    const count = props.count;

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);

    const toggle = () => {
        setModal(!modal);
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const acceptRestaurant = () => {
        axios({
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            url: `/restaurants/updateStatus?restaurantId=${restaurant.restaurant_id}&status=${restaurant.restaurant_status}&statusUpdate=active`
        }).then(res => {
            axios.get(`/restaurants/getProviderPhoneLogin?restaurantId=${restaurant.restaurant_id}`)
                .then(res => {
                    axios.get(`/users/findByPhoneNumber/${res.data}`)
                        .then(res => {
                            axios.post(`/notifications/insertNotification`,
                                {
                                    "content": `Nhà hàng ${restaurant.restaurant_name} của bạn đã được duyệt`,
                                    "customer": null,
                                    "provider": res.data,
                                    "forAdmin": false,
                                    "type": "restaurant",
                                    "read": false
                                }
                            )
                                .then(res => {
                                    toggle();
                                })
                        })
                })
        })
    }

    const denyRestaurant = () => {
        axios({
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            url: `/restaurants/updateStatus?restaurantId=${restaurant.restaurant_id}&status=${restaurant.restaurant_status}&statusUpdate=cancelled`
        }).then(res => {
            axios.get(`/restaurants/getProviderPhoneLogin?restaurantId=${restaurant.restaurant_id}`)
                .then(res => {
                    axios.get(`/users/findByPhoneNumber/${res.data}`)
                        .then(res => {
                            axios.post(`/notifications/insertNotification`,
                                {
                                    "content": `Nhà hàng ${restaurant.restaurant_name} của bạn không được duyệt`,
                                    "customer": null,
                                    "provider": res.data,
                                    "forAdmin": false,
                                    "type": "restaurant",
                                    "read": false
                                }
                            )
                                .then(res => {
                                    toggle1();
                                })
                        })
                })
        })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{restaurant.restaurant_name}</td>
            <td>{restaurant.restaurant_type}</td>
            <td>{restaurant.province}</td>
            <td>{'Khoảng: ' + restaurant.size + ' người'}</td>
            <td>
                <Link to={{
                    pathname: `/admin/restaurant/detail`,
                    state: {
                        restaurantId: restaurant.restaurant_id
                    }
                }}
                    className="btn btn-primary"
                >
                    <FaEye className="icon-see-more" />Chi tiết
                </Link>
            </td>
            <td>
                <Button color="success" onClick={toggle}>
                    Duyệt
                </Button>
                <Modal isOpen={modal} toggle={toggle} className={``}>
                    <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
                    <ModalBody>
                        Lưu thay đổi ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => acceptRestaurant()}>
                            Có
                        </Button>
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
            <td>
                <Button color="danger" onClick={toggle1}>
                    Hủy
                </Button>
                <Modal isOpen={modal1} toggle={toggle1} className={``}>
                    <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                    <ModalBody>
                        Lưu thay đổi ?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => denyRestaurant()}>
                            Có
                        </Button>
                        <Button color="secondary" onClick={toggle1}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
