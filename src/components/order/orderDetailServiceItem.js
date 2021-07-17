import React from 'react';
import { Table } from 'reactstrap';
import { formatCurrency } from '../../common/formatCurrency';

export default function OrderDetailServiceItem(props) {
    const listOrderDetails = props.listOrderDetails;
    let total = 0;
    let count = 1;

    return (<div className="order-detail-service">
        <h4>Dịch vụ</h4>
        <Table className="order-detail-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên dịch vụ</th>
                    <th>Giá (VNĐ)</th>
                    <th>Số lượng</th>
                </tr>
            </thead>
            <tbody>
                {
                    listOrderDetails.map((item, index) => {
                        if (item.service_id) {
                            total += item.price * item.quantity;
                            return (<tr key={index} className="od-service-item">
                                <th>{count++}</th>
                                <td>{item.service_name}</td>
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
        <div className="od-service-item-total">Tổng tiền dịch vụ: {formatCurrency(total)} VNĐ</div>
    </div>
    )
}
