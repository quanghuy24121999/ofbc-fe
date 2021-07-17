import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Row, Col, Table,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg, Form
} from 'reactstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ImageUploading from "react-images-uploading";
import { FaSearch, FaRegPlusSquare } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantMenuItem from '../../components/provider/myRestaurantMenuItem';
import { Notify } from '../../common/notify';
import { validateCapacity, validateDescription, validateUsername } from '../../common/validate';

let restaurantId = '';
export default class myRestaurantMenu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: [],
            categories: [],
            images: [],
            nameSearch: '',
            categorySearch: 0,

            name: '',
            category: 1,
            status: 1,
            price: '',
            description: '',
            modal: false,

            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeNameSearch = this.onChangeNameSearch.bind(this);
        this.onChangeCategorySearch = this.onChangeCategorySearch.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChange = this.onChange.bind(this);
        this.search = this.search.bind(this);
        this.addDish = this.addDish.bind(this);
        this.toggle = this.toggle.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        axios.get(`/dishes/getCategories`)
            .then(res => {
                this.setState({ categories: res.data })
            })

        this.receivedData(0, '');
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onChangeCategory(e) {
        this.setState({ category: e.target.value });
    }

    onChangeStatus(e) {
        this.setState({ status: e.target.value });
    }

    onChangePrice(e) {
        this.setState({ price: e.target.value });
    }

    onChangeDescription(e) {
        this.setState({ description: e.target.value });
    }

    onChangeNameSearch(e) {
        this.setState({ nameSearch: e.target.value });
    }

    onChangeCategorySearch(e) {
        this.setState({ categorySearch: e.target.value });
    }

    search() {
        const { nameSearch, categorySearch } = this.state;
        this.setState({
            currentPage: 0,
            offset: 0
        }, () => {
            this.receivedData(categorySearch, nameSearch);
        })
    }

    updateImage(dishId) {
        let formData = new FormData();
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        axios.post(`/images/upload?userId=0&dishId=${dishId}&serviceId=0&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
            formData, {
        }).then(res => {
            this.receivedData(0, '');
        }).catch(err => {
            document.getElementById('error-form4').style.display = "block";
        })
    }

    validate() {
        if (!validateUsername(this.state.name)) {
            Notify('Tên món ăn phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(this.state.price)) {
            Notify('Giá món ăn phải ít hơn 10 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('Mô tả món ăn phải ít hơn 2000 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addDish() {
        const { category, name, price, status, description, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let dishStatus = '';
                        let menuCategory = '';
                        let restaurant = res.data;

                        if (status === 1) {
                            dishStatus = 'active';
                        } else {
                            dishStatus = 'inactive';
                        }

                        switch (category) {
                            case 1:
                                menuCategory = 'Khai vị';
                                break;

                            case 2:
                                menuCategory = 'Món chính';
                                break;

                            case 3:
                                menuCategory = 'Tráng miệng';
                                break;

                            case 4:
                                menuCategory = 'Đồ uống';
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
                                if (count === 0) {
                                    axios.post(`/dishes/save`,
                                        {
                                            "name": name,
                                            "status": { id: status, name: dishStatus },
                                            "description": description,
                                            "price": price,
                                            "restaurant": restaurant,
                                            "menuCategory": { id: category, name: menuCategory }
                                        }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        }
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData(0, '');
                                        Notify("Thêm món ăn thành công", "success", "top-right");
                                    })
                                } else {
                                    Notify("Món ăn này đã tồn tại", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui lòng thêm ảnh của món ăn', 'warning', 'top-right');
        }
    }

    toggle() { this.setState({ modal: !this.state.modal }) };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    handlePageClick = (e) => {
        window.scrollTo(0, 0);
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData(0, '');
        });

    };

    componentWillUnmount() {
        this.setState({ dishesPaging: [] });
    }

    receivedData(categoryId, nameSearch) {
        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=${categoryId}&dishName=${nameSearch}&statusId=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const dishesPaging = slice.map((dish, index) => {
                    return <MyRestaurantMenuItem key={index} dish={dish} count={index + 1} restaurantId={restaurantId} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    dishesPaging
                })
            });
    }

    render() {
        const { categorySearch, nameSearch, categories, modal,
            images, category, name, price, status, description
        } = this.state;

        return (
            <div className="myRes-menu">
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
                    <NavItem className="active">
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
                    <NavItem >
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
                    <h3>Món ăn</h3>
                    <hr />
                    <div className="menu-search">
                        <div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nhập tên món ăn"
                                onChange={this.onChangeNameSearch}
                                value={nameSearch}
                            />
                        </div>
                        <div>
                            <Input
                                type="select"
                                name="categorySearch"
                                id="categorySearch"
                                onChange={this.onChangeCategorySearch}
                                value={categorySearch}
                            >
                                <option value={0}>Tất cả</option>
                                {categories.map((category) => {
                                    return (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>

                        <div>
                            <Button onClick={this.search} className="btn-menu-search" color="success">
                                <FaSearch className="icon-search" />
                            </Button>
                        </div>
                        <div>
                            <Button color="primary" onClick={this.toggle}>
                                <FaRegPlusSquare className="icon-add-service" />Thêm món ăn
                            </Button>
                        </div>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Thêm món ăn</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addDish();
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
                                                                <CardImg className="business-image" top src={image.data_url} />
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
                                        <Label for="name"><b>Tên món ăn <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nhập tên món ăn"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="category"><b>Loại hình <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="category"
                                            id="category"
                                            onChange={this.onChangeCategory}
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
                                            onChange={this.onChangeStatus}
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
                                            onChange={this.onChangePrice}
                                            value={price}
                                            required="required"
                                        />

                                        <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="Mô tả món ăn"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="Lưu" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addDish()}>Lưu</Button>{' '} */}
                                <Button color="secondary" onClick={this.toggle}>Trở lại</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên món ăn</th>
                                <th>Giá (VNĐ)</th>
                                <th>Loại món ăn</th>
                                <th>Trạng thái</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.dishesPaging}
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
