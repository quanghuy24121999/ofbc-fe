import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader,
    ModalBody, ModalFooter,
    CardImg, Row, Col
} from 'reactstrap';
import { FaEye } from 'react-icons/fa';
import axios from 'axios';
import { Notify } from '../../common/notify';

export default function RestaurantServiceItem(props) {
    const service = props.service;
    let serviceDish = service.status_name;
    let count = props.count;

    if (serviceDish === 'active') {
        serviceDish = 'Đang kinh doanh';
    } else if (serviceDish === 'inactive') {
        serviceDish = 'Ngừng kinh doanh';
    } else {
        serviceDish = 'Đã bị gỡ';
    }

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [serviceModal, setServiceModal] = useState();
    const [imageId, setImageId] = useState('');

    const toggle = () => {
        setImageId(service.image_service_id);
        setModal(!modal);

        if (modal === false) {
            axios.get(`/services/getServiceById?serviceId=${service.id}`)
                .then(res => {
                    setServiceModal(res.data);
                })
        }
    }

    const toggle1 = () => {
        setModal1(!modal1);
    }

    const ban = () => {
        axios.get(`/restaurants/getRestaurantById?restaurantId=${service.restaurant_id}`)
            .then(res => {
                const restaurant = res.data;
                axios({
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/services/updateStatus?serviceId=${service.id}`
                });
                axios.post(`/notifications/insertNotification`,
                    {
                        "content": `Dịch vụ ${service.service_name} của nhà hàng ${restaurant.restaurantName} đã bị gỡ do vi phạm chính sách của FBS`,
                        "customer": null,
                        "provider": restaurant.provider,
                        "forAdmin": false,
                        "type": "report",
                        "read": false
                    }
                ).then(res => {
                    toggle();
                    toggle1();
                    Notify('Gỡ dịch vụ thành công', 'success', 'top-left');
                }).catch(res => {
                    Notify('Gỡ dịch vụ không thành công', 'error', 'top-left');
                })
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{service.service_name}</td>
            <td>{service.price}</td>
            <td>{service.service_category_name}</td>
            <td>{serviceDish}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEye className="icon-see-more" />Xem thêm
                </Button>
            </td>
            <Modal isOpen={modal} toggle={toggle} className={`modal-service-detail`}>
                <ModalHeader toggle={toggle}>Chi tiết dịch vụ</ModalHeader>
                <ModalBody>
                    <Row>
                        {
                            imageId && (<Col>
                                <CardImg id="user-image" className="service-image" top src={`/images/${imageId}`} alt="dịch vụ" />
                            </Col>
                            )
                        }
                        {
                            serviceModal && <Col className="info">
                                <div>
                                    <b>Tên dịch vụ:</b>{' ' + serviceModal.name}
                                </div>

                                <div>
                                    <b>Loại hình:</b>{' ' + serviceModal.serviceCategory.name}
                                </div>

                                <div>
                                    <b>Trạng thái:</b>{' ' + serviceDish}
                                </div>

                                <div>
                                    <b>Giá dịch vụ:</b>{' ' + serviceModal.price}
                                </div>

                                <div>
                                    <b>Mô tả:</b>{' ' + serviceModal.description}
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
                            Bạn có chắc chắn muốn gỡ dịch vụ này ?
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
