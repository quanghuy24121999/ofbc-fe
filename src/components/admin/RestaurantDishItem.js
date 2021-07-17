import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, Col,
    ModalBody, ModalFooter, CardImg,
    Row
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import { Notify } from '../../common/notify';

export default function RestaurantDishItem(props) {
    const dish = props.dish;
    let statusDish = dish.status_name;
    let count = props.count;

    if (statusDish === 'active') {
        statusDish = 'Đang kinh doanh';
    } else if (statusDish === 'inactive') {
        statusDish = 'Ngừng kinh doanh';
    } else {
        statusDish = 'Đã bị gỡ';
    }

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [dishModal, setDishModal] = useState();
    const [imageId, setImageId] = useState('');

    const toggle = () => {
        setImageId(dish.image_dish_id);
        setModal(!modal);

        if (modal === false) {
            axios.get(`/dishes/getDishesById?dishId=${dish.id}`)
                .then(res => {
                    setDishModal(res.data);
                })
        }
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const ban = () => {
        axios.get(`/restaurants/getRestaurantById?restaurantId=${dish.restaurant_id}`)
            .then(res => {
                const restaurant = res.data;
                axios({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/dishes/updateStatus?dishId=${dish.id}`
                });
                axios.post(`/notifications/insertNotification`,
                    {
                        "content": `Món ăn ${dish.dish_name} của nhà hàng ${restaurant.restaurantName} đã bị gỡ do vi phạm chính sách của FBS`,
                        "customer": null,
                        "provider": restaurant.provider,
                        "forAdmin": false,
                        "type": "report",
                        "read": false
                    }
                ).then(res => {
                    toggle();
                    toggle1();
                    Notify('Gỡ món ăn thành công', 'success', 'top-left');
                }).catch(res => {
                    Notify('Gỡ món ăn không thành công', 'error', 'top-left');
                })
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{dish.price}</td>
            <td>{dish.category_name}</td>
            <td>{statusDish}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEye className="icon-see-more" />Xem thêm
                </Button>
            </td>
            <Modal isOpen={modal} toggle={toggle} className={`modal-dish-detail`}>
                <ModalHeader toggle={toggle}>Chi tiết món ăn</ModalHeader>
                <ModalBody>
                    <Row>
                        {
                            imageId && (
                                <Col>
                                    <CardImg id="user-image" className="dish-image" top src={`/images/${imageId}`} alt="món ăn" />
                                </Col>
                            )
                        }
                        {
                            dishModal && <Col className="info">
                                <div>
                                    <b>Tên món ăn:</b>{' ' + dishModal.name}
                                </div>

                                <div>
                                    <b>Loại hình:</b>{' ' + dishModal.menuCategory.name}
                                </div>

                                <div>
                                    <b>Trạng thái:</b>{' ' + statusDish}
                                </div>

                                <div>
                                    <b>Giá món ăn:</b>{' ' + dishModal.price}
                                </div>

                                <div>
                                    <b>Mô tả:</b>{' ' + dishModal.description}
                                </div>
                            </Col>
                        }
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={toggle1}>Gỡ</Button>
                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                        <ModalBody>
                            Bạn có chắc chắn muốn gỡ món ăn này ?
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" onClick={ban}>Gỡ</Button>
                            <Button color="secondary" onClick={toggle1}>Trở lại</Button>
                        </ModalFooter>
                    </Modal>
                    <Button color="secondary" onClick={toggle}>Trở lại</Button>
                </ModalFooter>
            </Modal>
        </tr>
    )
}
