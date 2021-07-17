import React from 'react';
import { CardImg } from 'reactstrap';

import { formatDate } from '../../common/formatDate';

export default function PromotionItem(props) {
    const promotion = props.promotion;

    let status = '';
    if (promotion.promotion_status === 'active') {
        status = "Đang diễn ra";
    } else if (promotion.promotion_status === 'coming') {
        status = "Sắp diễn ra";
    }

    return (
        <div className="promotion-item">
            <div className="promotion-item-info">
                <div>
                    <div className="promotion-item-header">{promotion.promotion_name}</div>
                    <div className="promotion-item-description">{promotion.description}</div>
                    <div className="promotion-item-date">
                        {"Ưu đãi từ " + formatDate(promotion.start_date) + " đến " + formatDate(promotion.end_date)}
                    </div>
                </div>
                <div className="promotion-status">{status}</div>
            </div>
            <CardImg
                className="promotion-item-img"
                top
                width="200px"
                height="300px"
                src={'/images/' + promotion.image_id} alt=""
            />
        </div>
    )
}
