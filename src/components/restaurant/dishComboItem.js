import React from 'react';
import { Button } from 'reactstrap';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';

export default function DishComboItem(props) {
    const dish = props.dish;
    const combo = props.combo;
    let count = props.count;

    const deleteDish = () => {
        axios.delete(`/dishes/removeDishFromCombo?comboId=${combo.combo_id}&dishId=${dish.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
            })
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{dish.category_name}</td>
            <td>
                <Button color="danger" onClick={deleteDish}><FaTrashAlt className="icon-delete" />Xóa</Button>
            </td>
        </tr>
    )
}
