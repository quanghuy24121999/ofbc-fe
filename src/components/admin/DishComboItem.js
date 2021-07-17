import React from 'react';

export default function DishComboItem(props) {
    const dish = props.dish;
    let count = props.count;

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{dish.category_name}</td>
        </tr>
    )
}
