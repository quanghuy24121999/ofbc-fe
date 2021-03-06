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
            Notify('T??n d???ch v??? ph???i ??t h??n 100 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(this.state.price)) {
            Notify('Gi?? d???ch v??? ph???i ??t h??n 10 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('M?? t??? d???ch v??? ph???i ??t h??n 2000 k?? t???', 'error', 'top-right');
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
                                serviceCategory = 'Trang tr??';
                                break;

                            case 2:
                                serviceCategory = 'Ban nh???c';
                                break;

                            case 3:
                                serviceCategory = 'V?? ??o??n';
                                break;

                            case 4:
                                serviceCategory = 'Ca s??';
                                break;

                            case 5:
                                serviceCategory = 'MC';
                                break;

                            case 6:
                                serviceCategory = 'Quay phim - ch???p ???nh';
                                break;

                            case 7:
                                serviceCategory = 'Xe c?????i';
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
                                        Notify("Th??m d???ch v??? th??nh c??ng", "success", "top-right");
                                    })
                                } else {
                                    Notify("D???ch v??? n??y ???? t???n t???i", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui l??ng th??m ???nh c???a d???ch v???', 'warning', 'top-right');
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
                        <Link to={`/users/profile/my-restaurant/detail`}>Th??ng tin</Link>
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
                            ???nh
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
                            Th???c ????n
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
                            Combo m??n ??n
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
                            D???ch v???
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
                            Khuy???n m??i
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
                            ????n h??ng
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    <h3>D???ch v???</h3>
                    <hr />
                    <div className="service-search">
                        <div>
                            <Input
                                type="text"
                                name="name"
                                id="name"
                                placeholder="Nh???p t??n d???ch v???"
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
                                <option value=''>T???t c???</option>
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
                                <FaRegPlusSquare className="icon-add-service" />Th??m d???ch v???
                            </Button>
                        </div>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??m d???ch v???</ModalHeader>
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
                                                                    Kh??ng th??? t???i ???nh l??n, vui l??ng ch???n m???t ???nh kh??c !
                                                                </Alert>
                                                            </div>
                                                        )
                                                    )
                                                    )}

                                                    <div className="btn-change-image" onClick={onImageUpdate}>Ch???n ho???c ?????i ???nh</div>
                                                </div>
                                            )}
                                        </ImageUploading>
                                    </div>
                                    <div>
                                        <Label for="name"><b>T??n d???ch v??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nh???p t??n d???ch v???"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="category"><b>Lo???i h??nh <span className="require-icon">*</span></b></Label>
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

                                        <Label for="status"><b>Tr???ng th??i <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="select"
                                            name="status"
                                            id="status"
                                            onChange={this.onChangeStatus}
                                            value={status}
                                        >
                                            <option value="1">??ang kinh doanh</option>
                                            <option value="2">Ng???ng kinh doanh</option>
                                        </Input>

                                        <Label for="price"><b>Gi?? d???ch v??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="price"
                                            id="price"
                                            placeholder="Nh???p gi?? d???ch v???"
                                            onChange={this.onChangePrice}
                                            value={price}
                                            required="required"
                                        />

                                        <Label for="description"><b>M?? t??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="M?? t??? d???ch v???"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="L??u" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addService()}>L??u</Button>{' '} */}
                                <Button color="secondary" onClick={this.toggle}>Tr??? l???i</Button>
                            </ModalFooter>
                        </Modal>

                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>T??n d???ch v???</th>
                                <th>Gi?? (VN??)</th>
                                <th>Lo???i d???ch v???</th>
                                <th>Tr???ng th??i</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.servicesPaging}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"Trang tr?????c"}
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
