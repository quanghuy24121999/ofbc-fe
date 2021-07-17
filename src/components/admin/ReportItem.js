import axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

import { formatDateForNotify } from '../../common/formatDate';
import { Notify } from '../../common/notify';

export default function ReportItem(props) {
    const count = props.count;
    const report = props.report;

    const complete = () => {
        axios.post(`/notifications/insertNotification`,
            {
                "content": `Chúng tôi đã xử lý báo cáo của bạn về nhà hàng ${report.restaurant.restaurantName}`,
                "customer": report.user,
                "provider": null,
                "forAdmin": false,
                "type": "report",
                "read": false
            }
        )
            .then(res => {
                axios({
                    method: 'PATCH',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    url: `/feedbacks/updateStatusFeedback?feedbackId=${report.id}`
                }).then(res => {
                    Notify('Xử lý báo cáo thành công', 'success', 'top-left');
                })
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{report.feedbackContent}</td>
            <td>{formatDateForNotify(report.feedback_date)}</td>
            <td>
                <Link to={{
                    pathname: `/admin/restaurant/detail`,
                    state: {
                        restaurantId: report.restaurant.id
                    }
                }}
                    className="btn btn-primary"
                >
                    Đi đến nhà hàng
                </Link>
            </td>
            <td>
                <Button color="success" onClick={() => complete()}>Đã xử lý</Button>
            </td>
        </tr>
    )
}
