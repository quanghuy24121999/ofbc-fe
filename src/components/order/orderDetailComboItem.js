import React from 'react';
import { Table } from 'reactstrap';
import { formatCurrency } from '../../common/formatCurrency';

export default function OrderDetailComboItem(props) {
    const listOrderDetails = props.listOrderDetails;
    let total = 0;
    let count = 1;

    return (
        <div>
            <div className="order-detail-combo">
                <h4>Combo món ăn</h4>
                <Table className="order-detail-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên Combo</th>
                            <th>Giá (VNĐ)</th>
                            <th>Số lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            listOrderDetails.map((item, index) => {
                                if (item.combo_id) {
                                    total += item.price * item.quantity;
                                    return (<tr key={index} className="od-combo-item">
                                        <th>{count++}</th>
                                        <td>{item.combo_name}</td>
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
                <div className="od-combo-item-total">Tổng tiền combo món ăn: {formatCurrency(total)} VNĐ</div>
            </div>
        </div>
    )
}
