import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Table, Form,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageUploading from "react-images-uploading";
import { FaRegPlusSquare } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantPromotionItem from '../../components/provider/myRestaurantPromotionItem';
import { formatDateForInput } from '../../common/formatDate';
import { Notify } from '../../common/notify';
import { validateDescription, validatePromotionPercentage, validateUsername } from '../../common/validate';

let restaurantId = '';
export default class myRestaurantPromotion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],

            name: '',
            discount: 0,
            status: 1,
            start: '',
            end: '',
            description: '',
            modal: false,

            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeDiscount = this.onChangeDiscount.bind(this);
        this.onChangeStart = this.onChangeStart.bind(this);
        this.onChangeEnd = this.onChangeEnd.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);

        this.onChange = this.onChange.bind(this);
        this.addPromotion = this.addPromotion.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData();
    }

    onChangeName(e) {
        e.preventDefault();
        this.setState({ name: e.target.value });
    }

    onChangeDiscount(e) {
        e.preventDefault();
        this.setState({ discount: e.target.value });
    }

    onChangeStatus(e) {
        e.preventDefault();
        this.setState({ status: e.target.value });
    }

    onChangeStart(e) {
        e.preventDefault();
        this.setState({ start: e.target.value });
    }

    onChangeEnd(e) {
        e.preventDefault();
        this.setState({ end: e.target.value });
    }

    onChangeDescription(e) {
        e.preventDefault();
        this.setState({ description: e.target.value });
    }

    toggle() { this.setState({ modal: !this.state.modal }) };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: 0,
            offset: offset
        }, () => {
            this.receivedData();
        });

    };

    receivedData() {
        axios.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const promotionsPaging = slice.map((promotion, index) => {
                    return <MyRestaurantPromotionItem key={index} promotion={promotion} count={index + 1} restaurantId={restaurantId} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    promotionsPaging
                })
            });
    }

    validate() {
        if (!validateUsername(this.state.name)) {
            Notify('Tên khuyến mãui phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validatePromotionPercentage(this.state.discount)) {
            Notify('Phần trăm khuyến mãi phải ít hơn 3 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('Mô tả khuyến mãi phải ít hơn 2000 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addPromotion() {
        const { discount, name, description, start, end, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let restaurant = res.data;
                        axios.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
                            .then(res => {
                                let count = 0;
                                res.data.forEach(promotion => {
                                    if (name === promotion.promotion_name) {
                                        count = count + 1;
                                    }
                                });

                                if (count === 0) {
                                    axios.post(`/promotions/save`,
                                        {
                                            "name": name,
                                            "restaurant": restaurant,
                                            "description": description,
                                            "discountPercentage": discount,
                                            "startDate": start,
                                            "endDate": end,
                                            "status": { id: 1, name: 'active' }
                                        }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        }
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData();
                                        Notify('Thêm khuyến mãi thành công', 'success', 'top-right');
                                    })
                                } else {
                                    Notify("Khuyến mãi này đã tồn tại", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui lòng thêm ảnh của khuyến mãi', 'warning', 'top-right');
        }
    }

    updateImage(promotionId) {
        let formData = new FormData();
        if (this.state.images.length > 0) {
            formData.append('file', this.state.images[0].file);
            document.getElementById('error-form4').style.display = "none";

            axios.post(`/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=0&promotionId=${promotionId}&typeId=1`,
                formData, {
            }).then(res => {
                this.receivedData(0, '');
            }).catch(err => {
                document.getElementById('error-form4').style.display = "block";
            })
        }
    }

    render() {
        const { discount, modal, start, end,
            images, name, description
        } = this.state;

        return (
            <div className="myRes-promotion">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem >
                        <Link to={`/users/profile/my-restaurant/detail`}>Thông tin</Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/image`
                            }}
                        >
                            Ảnh
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/menu`,
                                state: { restaurantId: localStorage.getItem('resId') }
                            }}
                        >
                            Thực đơn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/combo`
                            }}
                        >
                            Combo món ăn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/service`
                            }}
                        >
                            Dịch vụ
                        </Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/promotion`
                            }}
                        >
                            Khuyến mãi
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/order`
                            }}
                        >
                            Đơn hàng
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    <h3>Khuyến mãi</h3>
                    <hr />
                    <div className="add-promotion">
                        <Button color="primary" onClick={this.toggle}>
                            <FaRegPlusSquare className="btn-add-promotion" />Thêm khuyến mãi
                        </Button>

                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Thêm khuyến mãi</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addPromotion();
                                }}>
                                    <div>
                                        <ImageUploading
                                            value={images}
                                            onChange={this.onChange}
                                            dataURLKey="data_url"

                                        >
                                            {({
                                                imageList,
                                                onImageUpdate,
                                                onImageRemove,
                                            }) => (
                                                <div className="upload__image-wrapper">
                                                    {imageList.map((image, index) => (
                                                        (
                                                            <div key={index} className="image-item">
                                                                <CardImg className="promotion-image" top src={image.data_url} />
                                                                <Alert color="danger" id="error-form4" className="error-form">
                                                                    Không thể tải ảnh lên, vui lòng chọn một ảnh khác !
                                                                </Alert>
                                                            </div>
                                                        )
                                                    )
                                                    )}

                                                    <div className="btn-change-image" onClick={onImageUpdate}>Chọn hoặc đổi ảnh</div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                    <div>
                                        <Label for="name"><b>Tên khuyến mãi <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nhập tên khuyến mãi"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="discount"><b>Phần trăm khuyến mãi <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="discount"
                                            id="discount"
                                            min={0}
                                            max={100}
                                            placeholder="Nhập phần trăm khuyến mãi"
                                            onChange={this.onChangeDiscount}
                                            value={discount}
                                            required="required"
                                        />

                                        <Label for="start"><b>Ngày bắt đầu <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="date"
                                            name="start"
                                            id="start"
                                            min={formatDateForInput(new Date())}
                                            placeholder="Nhập ngày bắt đầu"
                                            onChange={this.onChangeStart}
                                            value={start}
                                            required="required"
                                        />

                                        <Label for="end"><b>Ngày kết thúc <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="date"
                                            name="end"
                                            id="end"
                                            min={start}
                                            placeholder="Nhập ngày kết thúc"
                                            onChange={this.onChangeEnd}
                                            value={end}
                                            required="required"
                                        />

                                        <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="Mô tả khuyến mãi"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="Lưu" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addPromotion()}>Lưu</Button>{' '} */}

                                <Button color="secondary" onClick={this.toggle}>Trở lại</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <Table className="promotion-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên khuyến mãi</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.promotionsPaging}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.pageCount}
                        marginPagesDisplayed={5}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </Container>
                <Footer />
            </div>
        )
    }
}
