import React, { useEffect, useState } from 'react'
import {
    Button, Card, CardImg, Modal, ModalHeader,
    ModalBody, ModalFooter
} from 'reactstrap';
import { useCart } from 'react-use-cart';
import axios from 'axios';
import { formatCurrency } from '../../common/formatCurrency';

export default function ComboItem(props) {
    const { addItem, items } = useCart();

    const combo = props.combo;
    const comboId = props.comboId;

    const [dishes, setDishes] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);

    const checkAddItem = (combo) => {
        if (items === undefined || items === null || items.length === 0
            || items[0].restaurant_id === combo.restaurant_id) {
            addItem(combo);
        } else {
            toggle();
        }
    }

    useEffect(() => {
        axios.get(`/dishes/getDishesByComboId?comboId=${comboId}`)
            .then(res => {
                setDishes(res.data);
            })
    }, [comboId])

    return <Card className="combo-card">
        <div className="combo-name">{combo.combo_name}</div>
        <CardImg className="combo-image" top width="100%" src={'/images/' + combo.image_dish_id} />
        <hr />
        <div className="dish-lists">
            {
                dishes.map((dish, index) => {
                    return <div key={index} className="dish-item">
                        {dish.dish_name}
                    </div>
                })
            }
        </div>
        <hr />
        <div className="combo-price">{"Giá combo:  " + formatCurrency(combo.price) + ' VNĐ'}</div>
        <Button
            className="btn-order"
            color="success"
            onClick={() => checkAddItem(combo)}
        >
            Đặt ngay
        </Button>
        <Modal isOpen={modal} toggle={toggle} className={``}>
            <ModalHeader toggle={toggle}>Thông báo</ModalHeader>
            <ModalBody>
                Bạn phải hoàn tất thanh toán của nhà hàng khác trước khi thêm vào giỏ hàng !
            </ModalBody>
            <ModalFooter>
                <Button color="success" onClick={toggle}>Ok</Button>
            </ModalFooter>
        </Modal>
    </Card>
}
