import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, Form,
    ModalBody, ModalFooter, Label, Input,
    CardImg, Alert
} from 'reactstrap';
import { FaEdit } from 'react-icons/fa';
import axios from 'axios';
import ImageUploading from "react-images-uploading";

import { Notify } from '../../common/notify';
import { formatCurrency } from '../../common/formatCurrency';
import { validateCapacity, validateUsername } from '../../common/validate';

export default function MyRestaurantMenuItem(props) {
    const dish = props.dish;
    const restaurantId = props.restaurantId;
    let statusDish = dish.status_name;
    let count = props.count;
    const dishName = dish.dish_name;

    const [modal, setModal] = useState(false);
    const [dishModal, setDishModal] = useState();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [imageId, setImageId] = useState('');
    const [images, setImages] = useState([]);

    if (statusDish === 'active') {
        statusDish = 'Đang kinh doanh';
    } else {
        statusDish = 'Ngừng kinh doanh';
    }

    const onChangeName = (e) => { setName(e.target.value) };
    const onChangePrice = (e) => { setPrice(e.target.value) };
    const onChangeDescription = (e) => { setDescription(e.target.value) };
    const onChangeCategory = (e) => { setCategory(e.target.value); };
    const onChangeStatus = (e) => { setStatus(e.target.value); };
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    axios.get(`/dishes/getCategories`)
        .then(res => {
            setCategories(res.data)
        })

    const toggle = () => {
        setImageId(dish.image_dish_id);
        setModal(!modal);

        if (modal === false) {
            axios.get(`/dishes/getDishesById?dishId=${dish.id}`)
                .then(res => {
                    let dish = res.data;

                    setDishModal(res.data);
                    setName(dish.name);
                    setPrice(dish.price);
                    setDescription(dish.description);
                    setCategory(dish.menuCategory.id);
                    setStatus(dish.status.id);
                })
        }
    }

    const updateImage = () => {
        let formData = new FormData();
        if (images.length > 0) {
            formData.append('file', images[0].file);
            document.getElementById('error-form4').style.display = "none";

            if (imageId === null || imageId === '') {
                axios.post(`/images/upload?userId=0&dishId=${dish.id}&serviceId=0&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
                    formData, {
                }).then(res => {
                    // window.location.reload();
                }).catch(err => {
                    document.getElementById('error-form4').style.display = "block";
                })
            } else {
                axios.post(`/images/update?imageId=${imageId}`,
                    formData, {
                }).then(res => {
                    // window.location.reload();
                }).catch(err => {
                    document.getElementById('error-form4').style.display = "block";
                })
            }
        }
    }

    const validate = () => {
        if (!validateUsername(name)) {
            Notify('Tên món ăn phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(price)) {
            Notify('Giá món ăn phải ít hơn 10 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const updateDish = () => {
        if (validate()) {
            axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                .then(res => {
                    let dishStatus = '';
                    let dishCategory = '';
                    let restaurant = res.data;
                    updateImage();

                    if (status === 1) {
                        dishStatus = 'active';
                    } else {
                        dishStatus = 'inactive';
                    }

                    switch (category) {
                        case 1:
                            dishCategory = 'Khai vị';
                            break;

                        case 2:
                            dishCategory = 'Món chính';
                            break;

                        case 3:
                            dishCategory = 'Tráng miệng';
                            break;

                        case 4:
                            dishCategory = 'Đồ uống';
                            break;

                        default:
                            break;
                    }
                    axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=0&dishName=&statusId=0`)
                        .then(res => {
                            let count = 0
                            res.data.forEach(dish => {
                                if (name === dish.dish_name) {
                                    count = count + 1;
                                }
                            });
                            if (dishName === name) {
                                count = 0;
                            }
                            if (count === 0) {
                                axios.post(`/dishes/save`,
                                    {
                                        "id": dish.id,
                                        "name": name,
                                        "description": description,
                                        "status": { id: status, name: dishStatus },
                                        "price": price,
                                        "restaurant": restaurant,
                                        "menuCategory": { id: category, name: dishCategory }
                                    }, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                }).then(res => {
                                    toggle();
                                    window.location.reload();
                                    Notify("Cập nhật món ăn thành công", "success", "top-right");
                                })
                            } else {
                                Notify("Món ăn này đã tồn tại", "error", "top-right");
                            }
                        })
                })
        }
    }

    return (
        <tr>
            <td>{count}</td>
            <td>{dish.dish_name}</td>
            <td>{formatCurrency(dish.price)}</td>
            <td>{dish.category_name}</td>
            <td>{statusDish}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEdit className="icon-edit" />Sửa
                </Button>
                <Modal isOpen={modal} toggle={toggle} className={``}>
                    <ModalHeader toggle={toggle}>Cập nhật món ăn</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={(event) => {
                            event.preventDefault();
                            updateDish();
                        }}>
                            {
                                imageId && (
                                    <div>
                                        <ImageUploading
                                            value={images}
                                            onChange={onChange}
                                            dataURLKey="data_url"
                                        >
                                            {({
                                                imageList,
                                                onImageUpdate,
                                                onImageRemove,
                                            }) => (
                                                <div className="upload__image-wrapper">
                                                    <CardImg id="user-image" className="dish-profile-image" top src={`/images/${imageId}`} alt="món ăn" />
                                                    {imageList.map((image, index) => (
                                                        // eslint-disable-next-line no-sequences
                                                        (document.getElementById("user-image").style.display = "none"),
                                                        (
                                                            <div key={index} className="image-item">
                                                                <CardImg className="dish-profile-image" top src={image.data_url} />
                                                                <Alert color="danger" id="error-form4" className="error-form">
                                                                    Không thể tải ảnh lên, vui lòng chọn một ảnh khác !
                                                                </Alert>
                                                            </div>
                                                        )
                                                    )
                                                    )}

                                                    <div className="btn-change-image" onClick={onImageUpdate}>Thay đổi ảnh</div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                )

                            }
                            {
                                dishModal && <div>
                                    <Label for="name"><b>Tên món ăn <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Nhập tên món ăn"
                                        onChange={onChangeName}
                                        value={name}
                                        required="required"
                                    />

                                    <Label for="category"><b>Loại hình <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="select"
                                        name="category"
                                        id="category"
                                        onChange={onChangeCategory}
                                        value={category}
                                    >
                                        {categories.map((category) => {
                                            return (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            );
                                        })}
                                    </Input>

                                    <Label for="status"><b>Trạng thái <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="select"
                                        name="status"
                                        id="status"
                                        onChange={onChangeStatus}
                                        value={status}
                                    >
                                        <option value="1">Đang kinh doanh</option>
                                        <option value="2">Ngừng kinh doanh</option>
                                    </Input>

                                    <Label for="price"><b>Giá món ăn <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        placeholder="Nhập giá món ăn"
                                        onChange={onChangePrice}
                                        value={price}
                                        required="required"
                                    />

                                    <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        placeholder="Mô tả món ăn"
                                        onChange={onChangeDescription}
                                        value={description}
                                        required="required"
                                    />
                                </div>
                            }
                            <Input type="submit" value="Lưu" className="btn btn-success btn-save" />
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        {/* <Button color="success" onClick={() => updateDish()}>Lưu</Button>{' '} */}
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
