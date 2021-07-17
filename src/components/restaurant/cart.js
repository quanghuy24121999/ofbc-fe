import React, { useState } from 'react';
import { useCart } from 'react-use-cart';
import {
    Button, Modal, Badge, Input, Form,
    ModalHeader, ModalBody, ModalFooter,
    Label
} from 'reactstrap';
import { FaShoppingCart } from 'react-icons/fa'
import axios from 'axios';

import CartDishItem from './cartDishItem';
import CartComboItem from './cartComboItem';
import CartServiceItem from './cartServiceItem';
import { formatDateForInput } from '../../common/formatDate';
import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';
import { validateCapacity, validateItemCart } from '../../common/validate';

export default function Cart(props) {
    const [modal, setModal] = useState(false);
    const [modalConfirm, setModalComfirm] = useState(false);
    const [typeTable, setTypeTable] = useState(6);
    const [customerQuantity, setCustomerQuantity] = useState(1);
    const [period, setPeriod] = useState('Trưa');
    const [time, setTime] = useState('');
    const [note, setNote] = useState('');
    const toggle = () => setModal(!modal);
    const toggleConfirm = () => setModalComfirm(!modalConfirm);
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    const {
        isEmpty,
        items,
        totalUniqueItems,
        cartTotal,
        updateCartMetadata,
        metadata,
        updateItemQuantity,
        removeItem,
        emptyCart
    } = useCart();

    const onchangeTypeTable = (e) => {
        e.preventDefault();
        setTypeTable(e.target.value);
        updateCartMetadata({
            type: parseInt(e.target.value)
        })
    }

    const onChangeCustomerQuantity = (e) => {
        e.preventDefault();
        setCustomerQuantity(e.target.value);
        updateCartMetadata({
            customerQuantity: parseInt(e.target.value)
        })
    }

    const onchangePeriod = (e) => {
        e.preventDefault();
        setPeriod(e.target.value);
        updateCartMetadata({
            period: e.target.value
        })
    }

    const onChangeTime = (e) => {
        e.preventDefault();
        setTime(e.target.value);
        updateCartMetadata({
            time: e.target.value
        })
    }

    const onChangeNote = (e) => {
        e.preventDefault();
        setNote(e.target.value);
        updateCartMetadata({
            note: e.target.value
        })
    }

    const validateCart = () => {
        let count = 0;

        items.forEach(item => {
            if (!validateItemCart(item.quantity)) {
                count = count + 1;
            }
        })

        if (!validateCapacity(customerQuantity)) {
            Notify('Số lượng khách quá lớn', 'error', 'top-right');
            return false;
        } else if (count > 0) {
            Notify('Số lượng quá lớn', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const onSubmitCart = () => {
        let customerId;
        const restaurantId = props.restaurantId;

        let arr = [];

        let object = {
            "quantity": 0,
            "dishId": 0,
            "comboId": 0,
            "serviceId": 0,
            "customerId": 0,
            "restaurantId": 0
        }

        axios.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                customerId = res.data.id
                axios.post(`/orders/insertOrder`, {
                    "time": period,
                    "organizeDate": time,
                    "customerId": parseInt(customerId),
                    "restaurantId": parseInt(restaurantId),
                    "tableType": parseInt(typeTable),
                    "numberOfGuests": customerQuantity,
                    "note": note
                }, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                }).then(res => {
                    items.forEach(item => {
                        if (item.dish_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = item.id;
                            object.comboId = 0;
                            object.serviceId = 0;
                            object.customerId = parseInt(customerId);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }

                        else if (item.combo_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = 0;
                            object.comboId = item.id;
                            object.serviceId = 0;
                            object.customerId = parseInt(customerId);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }

                        else if (item.service_name) {
                            object = {};
                            object.quantity = item.quantity;
                            object.dishId = 0;
                            object.comboId = 0;
                            object.serviceId = item.id;
                            object.customerId = parseInt(customerId);
                            object.restaurantId = parseInt(restaurantId);

                            arr.push(object);
                        }
                    })

                    let json = JSON.stringify(arr);
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }

                    axios.post(`/orders/insertOrderDetail`, json, config)
                        .then(res => {
                            axios({
                                method: 'PATCH',
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                },
                                url: `/orders/setStatus?customerId=${customerId}&restaurantId=${restaurantId}`
                            }).then(res => {
                                updateCartMetadata({
                                    customerQuantity: 1,
                                    period: "",
                                    time: "",
                                    type: 0
                                })


                                axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                                    .then(res => {
                                        const restaurant = res.data;
                                        axios.post(`/notifications/insertNotification`,
                                            {
                                                "content": `Có đơn hàng mới của ${restaurant.restaurantName}`,
                                                "customer": null,
                                                "provider": restaurant.provider,
                                                "forAdmin": false,
                                                "type": "order",
                                                "read": false
                                            }
                                        ).then(res => {
                                            emptyCart();
                                            setModalComfirm(!modalConfirm);
                                            toggle();
                                            Notify('Đặt hàng thành công', 'success', 'top-right');
                                        })
                                    })
                            })
                        })
                })
            })
    }


    if (isEmpty) {
        return (
            <div>
                <Button onClick={toggle} className="cart-display" color="primary" outline>
                    <FaShoppingCart />
                    <Badge className="cart-total-item">
                        {totalUniqueItems}
                    </Badge>
                </Button>

                <Modal isOpen={modal} toggle={toggle} className="cart-modal">
                    <ModalHeader toggle={toggle}>Giỏ hàng</ModalHeader>
                    <ModalBody>
                        <h3>Giỏ hàng trống !</h3>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }


    return (
        <div>
            <Button onClick={toggle} className="cart-display" color="primary" outline>
                <FaShoppingCart />
                <Badge className="cart-total-item">
                    {totalUniqueItems}
                </Badge>
            </Button>

            <div>
                <Modal isOpen={modal} toggle={toggle} className="cart-modal">
                    <ModalHeader toggle={toggle}>Giỏ hàng</ModalHeader>
                    <ModalBody>
                        <Form
                            onSubmit={(event) => {
                                event.preventDefault();
                                if (validateCart()) {
                                    onSubmitCart();
                                }
                            }}
                        >
                            <div className="cart-option">
                                <h4>Tùy chọn</h4>
                                <div className="cart-other-option">
                                    <div>
                                        <Label for="type"><b>Loại bàn <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="type"
                                            id="type"
                                            onChange={onchangeTypeTable}
                                            value={metadata.type}
                                            required="required"
                                        >
                                            <option value={6}>Bàn 6</option>
                                            <option value={8}>Bàn 8</option>
                                        </Input>
                                    </div>

                                    <div>
                                        <Label for="period"><b>Buổi <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="period"
                                            id="period"
                                            onChange={onchangePeriod}
                                            value={metadata.period}
                                            required="required"
                                        >
                                            <option value={'Trưa'}>Trưa</option>
                                            <option value={'Tối'}>Tối</option>
                                        </Input>
                                    </div>
                                </div>

                                <div className="cart-other-option">
                                    <div>
                                        <Label for="customer-quantity"><b>Số lượng khách <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="customer-quantity"
                                            id="customer-quantity"
                                            min={1}
                                            onChange={onChangeCustomerQuantity}
                                            value={metadata.customerQuantity}
                                            required="required"
                                        />
                                    </div>

                                    <div>
                                        <Label for="choose-date"><b>Chọn ngày <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="date"
                                            name="choose-date"
                                            id="choose-date"
                                            min={formatDateForInput(new Date())}
                                            max={formatDateForInput(maxDate)}
                                            onChange={onChangeTime}
                                            value={metadata.time}
                                            required="required"
                                        />
                                    </div>
                                </div>

                                <Label for="note"><b>Ghi chú </b></Label>
                                <Input
                                    type="textarea"
                                    name="note"
                                    id="note"
                                    placeholder="Yêu cầu cụ thể (nếu có)"
                                    onChange={onChangeNote}
                                    value={metadata.note}
                                />
                            </div>
                            <hr></hr>
                            <h4>Món ăn</h4>
                            {
                                items.map((item, index) => {
                                    return <CartDishItem key={index} dish={item} />
                                })
                            }
                            <hr></hr>
                            <h4>Combo món ăn</h4>
                            {items.map((item, index) => {
                                return <CartComboItem key={index} combo={item} />
                            })}
                            <hr></hr>
                            <h4>Dịch vụ</h4>
                            {items.map((item, index) => {
                                return <CartServiceItem key={index} service={item} />
                            })}
                            <hr></hr>
                            <div className="cart-total-price">Tổng tiền: {formatCurrency(cartTotal) + "  VNĐ"}</div>
                            <Input type="submit" value="Đặt hàng" className="btn btn-success btn-save" />

                        </Form>
                    </ModalBody>
                    <ModalFooter className="cart-footer">
                        {/* <Modal isOpen={modalConfirm} toggle={toggleConfirm} className="cart-modal">
                            <ModalHeader toggle={toggleConfirm}>Thông báo</ModalHeader>
                            <ModalBody>
                                Bạn có muốn lưu thay đổi ?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={(e) => {
                                    e.preventDefault();
                                    console.log(document.getElementById("cart-form"))
                                    document.getElementById("cart-form").onSubmit();
                                }}>Lưu</Button>
                                <Button color="secondary" onClick={toggleConfirm}>Trở lại</Button>
                            </ModalFooter>
                        </Modal> */}
                        <div>
                            {/* <Button onClick={toggleConfirm} color="success">Thanh toán</Button>{' '} */}
                            <Button color="secondary" onClick={toggle}>Trở lại</Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        </div>
    )
}
