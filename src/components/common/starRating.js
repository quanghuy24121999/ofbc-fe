import React from 'react';
import StarRatings from "react-star-ratings";

export default function StarRating(props) {
    const rate = props.rate;
    const starDimension = props.starDimension;
    const starSpacing = props.starSpacing;

    return (
        <StarRatings
            rating={rate}
            starDimension={starDimension}
            starSpacing={starSpacing}
            starRatedColor="#ffe200"
            numberOfStars={5}
            className="rating-star"
        />
    )
}
