import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Table, Form,
    Label, Input, Button, Modal, ModalHeader,
    ModalBody, ModalFooter, Alert, CardImg
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { FaRegPlusSquare } from 'react-icons/fa';
import ImageUploading from "react-images-uploading";

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import MyRestaurantMenuItem from '../../components/provider/myRestaurantComboItem';
import { Notify } from '../../common/notify';
import { validateCapacity, validateDescription, validateUsername } from '../../common/validate';

let restaurantId = ''
export default class myRestaurantCombo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dishes: [],
            categories: [],
            images: [],

            name: '',
            category: 1,
            price: '',
            description: '',
            modal: false,

            offset: 0,
            perPage: 10,
            currentPage: 0
        }

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangePrice = this.onChangePrice.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);

    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData();
    }

    onChangeName(e) {
        this.setState({ name: e.target.value });
    }

    onChangePrice(e) {
        this.setState({ price: e.target.value });
    }

    onChangeDescription(e) {
        this.setState({ description: e.target.value });
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
        axios.get(`/combos/getCombosByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const combosPaging = slice.map((combo, index) => {
                    return <MyRestaurantMenuItem key={index} combo={combo} count={index + 1} restaurantId={restaurantId} />
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    combosPaging
                })
            });
    }

    toggle() { this.setState({ modal: !this.state.modal }) };

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    }

    updateImage(comboId) {
        let formData = new FormData();
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        axios.post(`/images/upload?userId=0&dishId=0&serviceId=0&comboId=${comboId}&restaurantId=0&promotionId=0&typeId=1`,
            formData, {
        }).then(res => {
            this.receivedData();
        }).catch(err => {
            document.getElementById('error-form4').style.display = "block";
        })
    }

    validate() {
        if (!validateUsername(this.state.name)) {
            Notify('T??n combo ph???i ??t h??n 100 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validateCapacity(this.state.price)) {
            Notify('Gi?? combo ph???i ??t h??n 10 k?? t???', 'error', 'top-right');
            return false;
        } else if (!validateDescription(this.state.description)) {
            Notify('M?? t??? combo ph???i ??t h??n 2000 k?? t???', 'error', 'top-right');
            return false;
        } else {
            return true;
        }
    }

    addCombo() {
        const { name, price, description, images } = this.state;
        if (images.length > 0) {
            if (this.validate()) {
                axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
                    .then(res => {
                        let restaurant = res.data;
                        axios.get(`/combos/getCombosByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
                            .then(res => {
                                let count = 0
                                res.data.forEach(combo => {
                                    if (name === combo.combo_name) {
                                        count = count + 1;
                                    }
                                });
                                if (count === 0) {
                                    axios.post(`/combos/save`,
                                        {
                                            "name": name,
                                            "status": { id: 2, name: 'inactive' },
                                            "description": description,
                                            "price": price,
                                            "restaurant": restaurant
                                        }, {
                                        headers: {
                                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                                        }
                                    }).then(res => {
                                        this.toggle();
                                        this.updateImage(res.data.id);
                                        this.receivedData();
                                        Notify("Th??m combo th??nh c??ng", "success", "top-right");
                                    })
                                } else {
                                    Notify("Combo m??n ??n n??y ???? t???n t???i", "error", "top-right");
                                }
                            })
                    })
            }
        } else {
            Notify('Vui l??ng th??m ???nh c???a combo', 'warning', 'top-right');
        }
    }

    render() {
        const { modal, images, name, price, description
        } = this.state;

        return (
            <div className="myRes-combo">
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
                    <NavItem className="active">
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
                    <NavItem >
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
                    <h3>Combo</h3>
                    <hr />
                    <div className="btn-add-combo">
                        <Button color="primary" onClick={this.toggle}>
                            <FaRegPlusSquare className="icon-add-service" />Th??m combo
                        </Button>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??m combo</ModalHeader>
                            <ModalBody>
                                <Form onSubmit={(event) => {
                                    event.preventDefault();
                                    this.addCombo();
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
                                        <Label for="name"><b>T??n combo <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            id="name"
                                            placeholder="Nh???p t??n combo"
                                            onChange={this.onChangeName}
                                            value={name}
                                            required="required"
                                        />

                                        <Label for="price"><b>Gi?? combo <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="number"
                                            name="price"
                                            id="price"
                                            placeholder="Nh???p gi?? combo"
                                            onChange={this.onChangePrice}
                                            value={price}
                                            required="required"
                                        />

                                        <Label for="description"><b>M?? t??? <span className="require-icon">*</span></b></Label>
                                        <Input
                                            type="textarea"
                                            name="description"
                                            id="description"
                                            placeholder="M?? t??? combo"
                                            onChange={this.onChangeDescription}
                                            value={description}
                                            required="required"
                                        />
                                    </div>
                                    <Input type="submit" value="L??u" className="btn btn-success btn-save" />
                                </Form>
                            </ModalBody>
                            <ModalFooter>
                                {/* <Button color="success" onClick={() => this.addCombo()}>L??u</Button>{' '} */}
                                <Button color="secondary" onClick={this.toggle}>Tr??? l???i</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>T??n combo</th>
                                <th>Gi?? (VN??)</th>
                                <th>Tr???ng th??i</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.combosPaging}
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
                        activeClassName={"active"} />
                </Container>
                <Footer />
            </div>
        )
    }
}
