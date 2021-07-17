import axios from 'axios';
import React, { useState } from 'react';
import {
    Button, Modal, ModalHeader, Form,
    ModalBody, ModalFooter, Label, Input,
    CardImg, Alert
} from 'reactstrap';
import ImageUploading from "react-images-uploading";
import { FaEdit } from 'react-icons/fa';

import { formatCurrency } from '../../common/formatCurrency';
import { Notify } from '../../common/notify';
import { validateCapacity, validateUsername } from '../../common/validate';

export default function MyRestaurantServiceItem(props) {
    const service = props.service;
    const restaurantId = props.restaurantId;
    let count = 1;
    let serviceStatus = service.status_name;
    if (serviceStatus === "active") {
        serviceStatus = 'Đang kinh doanh';
    } else if (serviceStatus === 'inactive') {
        serviceStatus = 'Ngừng kinh doanh';
    } else {
        serviceStatus = 'Đã bị gỡ';
    }
    const serviceName = service.service_name;

    const [modal, setModal] = useState(false);
    const [serviceModal, setServiceModal] = useState();
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [status, setStatus] = useState('');
    const [imageId, setImageId] = useState('');
    const [images, setImages] = useState([]);

    axios.get(`/services/getServiceCategories`)
        .then(res => {
            setCategories(res.data);
        })

    const toggle = () => {
        setImageId(service.image_service_id);
        setModal(!modal);

        if (modal === false) {
            axios.get(`/services/getServiceById?serviceId=${service.id}`)
                .then(res => {
                    let service = res.data;

                    setServiceModal(res.data);
                    setName(service.name);
                    setPrice(service.price);
                    setDescription(service.description);
                    setCategory(service.serviceCategory.id);
                    setStatus(service.status.id);
                })
        }
    }

    const onChangeName = (e) => { setName(e.target.value) };
    const onChangePrice = (e) => { setPrice(e.target.value) };
    const onChangeDescription = (e) => { setDescription(e.target.value) };
    const onChangeCategory = (e) => { setCategory(e.target.value); };
    const onChangeStatus = (e) => { setStatus(e.target.value); };
    const onChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };

    const updateImage = () => {
        let formData = new FormData();
        if (images.length > 0) {
            formData.append('file', images[0].file);
            document.getElementById('error-form4').style.display = "none";

            if (imageId === null || imageId === '') {
                axios.post(`/images/upload?userId=0&dishId=0&serviceId=${service.id}&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
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
            Notify('Tên dịch vụ phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(price)) {
            Notify('Giá dịch vụ phải ít hơn 10 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    const updateService = () => {
        if (validate()) {
            axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                .then(res => {
                    let serviceStatus = '';
                    let serviceCategory = '';
                    let restaurant = res.data;
                    updateImage();

                    if (status === 1) {
                        serviceStatus = 'active';
                    } else {
                        serviceStatus = 'inactive';
                    }

                    switch (category) {
                        case 1:
                            serviceCategory = 'Trang trí';
                            break;

                        case 2:
                            serviceCategory = 'Ban nhạc';
                            break;

                        case 3:
                            serviceCategory = 'Vũ đoàn';
                            break;

                        case 4:
                            serviceCategory = 'Ca sĩ';
                            break;

                        case 5:
                            serviceCategory = 'MC';
                            break;

                        case 6:
                            serviceCategory = 'Quay phim - chụp ảnh';
                            break;

                        case 7:
                            serviceCategory = 'Xe cưới';
                            break;

                        default:
                            break;
                    }
                    axios.get(`/services/search?restaurantId=${restaurantId}&serviceName=&category=`)
                        .then(res => {
                            let count = 0;
                            res.data.forEach(service => {
                                if (name === service.service_name) {
                                    count = count + 1;
                                }
                            });
                            if (serviceName === name) {
                                count = 0;
                            }
                            if (count === 0) {
                                axios.post(`/services/update`,
                                    {
                                        "id": service.id,
                                        "name": name,
                                        "description": description,
                                        "status": { id: status, name: serviceStatus },
                                        "price": price,
                                        "restaurant": restaurant,
                                        "serviceCategory": { id: category, name: serviceCategory }
                                    }, {
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                                    }
                                }
                                )
                                    .then(res => {
                                        toggle();
                                        window.location.reload();
                                        Notify("Cập nhật dịch vụ thành công", "success", "top-right");
                                    })
                            } else {
                                Notify("Dịch vụ này đã tồn tại", "error", "top-right");
                            }
                        })
                })
        }
    }

    return (
        <tr className="service-content">
            <td>{count}</td>
            <td>{service.service_name}</td>
            <td>{formatCurrency(service.price)}</td>
            <td>{service.service_category_name}</td>
            <td>{serviceStatus}</td>
            <td>
                <Button onClick={toggle} color="primary">
                    <FaEdit className="icon-edit" />Sửa
                </Button>
                <Modal isOpen={modal} toggle={toggle} className={``}>
                    <ModalHeader toggle={toggle}>Cập nhật dịch vụ</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={(event) => {
                            event.preventDefault();
                            updateService();
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
                                                    <CardImg id="user-image" className="service-image" top src={`/images/${imageId}`} alt="Dịch vụ" />
                                                    {imageList.map((image, index) => (
                                                        // eslint-disable-next-line no-sequences
                                                        (document.getElementById("user-image").style.display = "none"),
                                                        (
                                                            <div key={index} className="image-item">
                                                                <CardImg className="service-image" top src={image.data_url} />
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
                                serviceModal && <div>
                                    <Label for="name"><b>Tên dịch vụ <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Nhập tên dịch vụ"
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

                                    <Label for="price"><b>Giá dịch vụ <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="number"
                                        name="price"
                                        id="price"
                                        placeholder="Nhập giá dịch vụ"
                                        onChange={onChangePrice}
                                        value={price}
                                        required="required"
                                    />

                                    <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                    <Input
                                        type="textarea"
                                        name="description"
                                        id="description"
                                        placeholder="Mô tả dịch vụ"
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
                        {/* <Button color="success" onClick={() => updateService(service.id)}>Lưu</Button>{' '} */}
                        <Button color="secondary" onClick={toggle}>Trở lại</Button>
                    </ModalFooter>
                </Modal>
            </td>
        </tr>
    )
}
