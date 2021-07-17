import React from 'react';
import { CardImg } from 'reactstrap';

import StarRating from './starRating';
import imageUser from '../../images/default-avatar-user.png';
import { formatDate } from '../../common/formatDate';

export default function FeedbackItem(props) {
    const feedback = props.feedback;
    return (
        <div className="feedback-item" key={feedback.feedback_date}>
            <div className="feedback-user">
                {feedback.image_user_id ? (
                    <CardImg className="user-image" top width="100%" src={'/images/' + feedback.image_user_id} />
                ) : (
                    <CardImg className="user-image" top width="100%" src={imageUser} />
                )}
                <div className="username">{feedback.user_name}</div>
            </div>
            <div className="user-rating">
                <StarRating rate={feedback.rate} starDimension="20" starSpacing="4" />
            </div>
            <div className="user-content">
                <div className="user-comment"><i>"{feedback.feedback_content}"</i></div>
                <div className="feedback-date">{formatDate(feedback.feedback_date)}</div>
            </div>
        </div>
    )
}
