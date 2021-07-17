import React from 'react';
import { Table } from 'reactstrap';
import { formatCurrency } from '../../common/formatCurrency';

export default function OrderDetailDishItem(props) {
    const listOrderDetails = props.listOrderDetails;
    let total = 0;
    let count = 1;

    return (
        <div className="order-detail-dish">
            <h4>Món ăn</h4>
            <Table className="order-detail-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tên món ăn</th>
                        <th>Giá (VNĐ)</th>
                        <th>Số lượng</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listOrderDetails.map((item, index) => {
                            if (item.dish_id) {
                                total += item.price * item.quantity;
                                return (<tr key={index} className="od-dish-item">
                                    <th>{count++}</th>
                                    <td>{item.dish_name}</td>
                                    <td>{formatCurrency(item.price)}</td>
                                    <td>{item.quantity}</td>
                                </tr>
                                )
                            } else {
                                return <tr key={index}></tr>
                            }
                        })
                    }
                </tbody>
            </Table>
            <div className="od-dish-item-total">Tổng tiền món ăn: {formatCurrency(total)} VNĐ</div>
        </div>
    )
}
