import React, { Component } from 'react';
import axios from 'axios';
import {
    Nav, NavItem, Container, Row, Col, Form,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg,
    Table
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ImageUploading from "react-images-uploading";
import { FaSearch, FaRegPlusSquare } from 'react-icons/fa';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantServiceItem from '../../components/provider/myRestaurantServiceItem';
import { Notify } from '../../common/notify';
import { validateCapacity, validateDescription, validateUsername } from '../../common/validate';

let restaurantId = '';

export default class myRestaurantService extends Component {
    constructor(props) {
        super(props);

        this.state = {
            services: [],
            categories: [],
            images: [],
            nameSearch: '',
            name: '',
            category: 1,
            description: '',
            status: 1,
            price: '',
            categorySearch: '',
            modal: false,
            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeNameSearch = this.onChangeNameSearch.bind(this);
        this.onChangeCategorySearch = this.onChangeCategorySearch.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeCategory = this.onChangeCategory.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);
        this.search = this.search.bind(this);
        this.toggle = this.toggle.bind(this);
        this.updateImage = this.updateImage.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        axios.get(`/services/getServiceCategories`)
            .then(res => {
                this.setState({ categories: res.data });
            });
        this.receivedData('', '');
    }

    componentWillUnmount() {
        this.setState({ servicesPaging: [] });
    }

    handlePageClick = (e) => {
        window.scrollTo(0, 0);
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData('', '');
        });

    };

    receivedData(serviceName, serviceCategory) {
        axios.get(`/services/search?restaurantId=${restaurantId}&serviceName=${serviceName}&category=${serviceCategory}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const servicesPaging = slice.map((service, index) => {
                    return <MyRestaurantServiceItem key={index} service={service} count={index + 1} restaurantId={restaurantId} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    servicesPaging
                })
            });
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

    onChangeDescription(e) {
        this.setState({ description: e.target.value });
    }

    onChangePrice(e) {
        this.setState({ price: e.target.value });
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
            this.receivedData(nameSearch, categorySearch);
        })
    }

    validate() {
        if (!validateUsername(this.state.name)) {
            Notify('Tên dịch vụ phải ít hơn 100 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(this.state.price)) {
            Notify('Giá dịch vụ phải ít hơn 10 ký tự', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('Mô tả dịch vụ phải ít hơn 2000 ký tự', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addService() {
        const { category, description, name, price, status, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let serviceStatus = '';
                        let serviceCategory = '';
                        let restaurant = res.data;

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
                        axios.get(`/services/search?restaurantId=${restaurantId}`)
                            .then(res => {
                                let count = 0
                                res.data.forEach(service => {
                                    if (name === service.service_name) {
                                        count = count + 1;
                                    }
                                });
                                if (count === 0) {
                                    axios.post(`/services/update`,
                                        {
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
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData('', '');
                                        Notify("Thêm dịch vụ thành công", "success", "top-right");
                                    })
                                } else {
                                    Notify("Dịch vụ này đã tồn tại", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui lòng thêm ảnh của dịch vụ', 'warning', 'top-right');
        }
    }

    toggle() { this.setState({ modal: !this.state.modal }) };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    updateImage(serviceId) {
        let formData = new FormData();
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        axios.post(`/images/upload?userId=0&dishId=0&serviceId=${serviceId}&comboId=0&restaurantId=0&promotionId=0&typeId=1`,
            formData, {
        }).then(res => {
            this.receivedData('', '');
        }).catch(err => {
            document.getElementById('error-form4').style.display = "block";
        })
    }

    render() {
        const { categorySearch, nameSearch, categories, modal,
            images, category, description, name, price, status
        } = this.state;

        return (
            <div className="myRes-service">
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
                    <NavItem className="active">
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
                    <h3>Dịch vụ</h3>
                    <hr />
                    <div className="service-search">
                        <div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nhập tên dịch vụ"
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
                                <option value=''>Tất cả</option>
                                {categories.map((category) => {
                                    return (
                                        <option key={category.id} value={category.name}>
                                            {category.name}
                                        </option>
                                    );
                                })}
                            </Input>
                        </div>
                        <div>
                            <Button onClick={this.search} className="btn-service-search" color="success">
                                <FaSearch className="icon-search" />
                            </Button>
                        </div>
                        <div>
                            <Button color="primary" onClick={this.toggle}>
                                <FaRegPlusSquare className="icon-add-service" />Thêm dịch vụ
                            </Button>
                        </div>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Thêm dịch vụ</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addService();
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
                                        <Label for="name"><b>Tên dịch vụ <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nhập tên dịch vụ"
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

                                        <Label for="price"><b>Giá dịch vụ <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="price"
                                            id="price"
                                            placeholder="Nhập giá dịch vụ"
                                            onChange={this.onChangePrice}
                                            value={price}
                                            required="required"
                                        />

                                        <Label for="description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="Mô tả dịch vụ"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="Lưu" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addService()}>Lưu</Button>{' '} */}
                                <Button color="secondary" onClick={this.toggle}>Trở lại</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên dịch vụ</th>
                                <th>Giá (VNĐ)</th>
                                <th>Loại dịch vụ</th>
                                <th>Trạng thái</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servicesPaging}
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
                        activeClassName={"active"}
                    />
                </Container>
                <Footer />
            </div>
        )
    }
}
