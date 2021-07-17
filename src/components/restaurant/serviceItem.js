import React, { useState } from 'react'
import {
    Button, Card, CardImg, CardBody,
    CardTitle, CardText, Modal, ModalHeader,
    ModalBody, ModalFooter
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import { formatCurrency } from '../../common/formatCurrency';

export default function ServiceItem(props) {
    const { addItem, items } = useCart();

    const service = props.service;
    const index = props.index;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const checkAddItem = (service) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === service.restaurant_id) {
            addItem(service);
        } else {
            toggle();
        }

    }

    return (
        <div>
            <Card key={index} className="item">
                <CardImg className="service-img" top width="150px" height="200px" src={`/images/${service.image_service_id}`} alt="Dịch vụ" />
                <CardBody className="service-content">
                    <CardTitle tag="h5">{service.service_name}</CardTitle>
                    <CardText className="service-price">{formatCurrency(service.price) + ' VNĐ'}</CardText>
                    <Button color="success" onClick={() => checkAddItem(service)}>
                        Thêm vào giỏ
                    </Button>
                </CardBody>
            </Card>
            <Modal isOpen={modal} toggle={toggle} className={``}>
                <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
                <ModalBody>
                    Bạn phải hoàn tất thanh toán của nhà hàng khác trước khi thêm vào giỏ hàng !
                </ModalBody>
                <ModalFooter>
                    <Button color="success" onClick={toggle}>Ok</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
