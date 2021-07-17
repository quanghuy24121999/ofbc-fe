import React, { useState } from 'react'
import {
    Button, Card, CardImg, CardBody,
    CardTitle, CardText, Modal, ModalHeader,
    ModalBody, ModalFooter
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import { formatCurrency } from '../../common/formatCurrency';

export default function Dish(props) {
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const { addItem, items } = useCart();
    const dish = props.dish;

    const checkAddItem = (dish) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === dish.restaurant_id) {
            addItem(dish);
        } else {
            toggle();
        }
    }

    return (
        <div>
            <Card key={dish.id} className="item">
                <CardImg className="dish-img" top width="150px" height="200px" src={'/images/' + dish.image_dish_id} alt="Nhà hàng" />
                <CardBody className="dish-content">
                    <CardTitle tag="h5">{dish.dish_name}</CardTitle>
                    <CardText className="dish-price">{formatCurrency(dish.price) + ' VNĐ'}</CardText>
                    <Button color="success" onClick={() => checkAddItem(dish)}>
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
