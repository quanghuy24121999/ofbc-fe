import React, { Component } from 'react';
import {
    Container, Row, Col, CardImg, Nav, NavItem,
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Alert
} from 'reactstrap';
import { Link } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { FaTrashAlt, FaRegPlusSquare } from 'react-icons/fa';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';

let restaurantId = '';
export default class myRestaurantImage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            imageUploads: [],
            modal: false,
            modal1: false,
            modal2: false,
            offset: 0,
            perPage: 12,
            currentPage: 0,
            imgDeleteId: ''
        }

        this.onChange = this.onChange.bind(this);
        this.addImage = this.addImage.bind(this);
        this.toggle = this.toggle.bind(this);
        this.toggle1 = this.toggle1.bind(this);
        this.toggle2 = this.toggle2.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');
        this.receivedData();
    }

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ imageUploads: imageList });
    };

    deleteImage(imageId) {
        axios.delete(`/images/deleteImageById?imageId=${imageId}`)
            .then(res => {
                this.toggle2(imageId);
                this.receivedData();
            })
    }

    addImage() {
        this.toggle();
        document.getElementById('error-form4').style.display = "none";
        let formData = new FormData();
        formData.append('file', this.state.imageUploads[0].file);
        axios.post(`/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=${restaurantId}&promotionId=0&typeId=2`,
            formData, {
        }).then(res => {
            this.receivedData();
            this.toggle1();
            this.setState({ imageUploads: [] })
        }).catch(err => {
            document.getElementById('error-form4').style.display = "block";
        })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    toggle1() {
        this.setState({ modal1: !this.state.modal1 })
    }

    toggle2(imageId) {
        this.setState({ modal2: !this.state.modal2, imgDeleteId: imageId })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.receivedData();
        });

    };

    receivedData() {
        axios.get(`/images/getRestaurantImages?restaurantId=${restaurantId}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const imageList = slice.map((image, index) => {
                    return <Col className="myRes-detail-img-item" key={index} lg="3" md="4" sm="12">
                        <CardImg className="image-description" src={`/images/${image.image_id}`} />
                        <div className="icon-del"
                            onClick={(event) => {
                                event.preventDefault();
                                this.toggle2(image.image_id)
                            }}>
                            <FaTrashAlt />
                        </div>
                    </Col>
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    imageList
                })
            });
    }

    render() {
        const { imageUploads, modal, modal1, modal2, imgDeleteId } = this.state;

        return (
            <div className="myRes-image">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem >
                        <Link to={`/users/profile/my-restaurant/detail`}>Th??ng tin</Link>
                    </NavItem>
                    <NavItem className="active">
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
                    <div>
                        <h3>???nh c???a nh?? h??ng</h3>
                        <hr />
                    </div>
                    <div className="myRes-image-add">
                        <Button color="primary" onClick={this.toggle1}><FaRegPlusSquare className="btn-add-image" />Th??m ???nh</Button>
                        <Modal isOpen={modal1} toggle={this.toggle1} className={``}>
                            <ModalHeader toggle={this.toggle1}>Th??m ???nh</ModalHeader>
                            <ModalBody>
                                <ImageUploading
                                    value={imageUploads}
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
                            </ModalBody>
                            <ModalFooter>
                                {imageUploads.length > 0 &&
                                    <Button color="success" onClick={this.toggle}>
                                        Ok
                                    </Button>}
                                <Button color="secondary" onClick={this.toggle1}>H???y</Button>{' '}
                            </ModalFooter>
                        </Modal>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Th??ng b??o</ModalHeader>
                            <ModalBody>
                                B???n c?? ch???c ch???n th??m ???nh n??y ?
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={this.addImage}>C??</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Tr??? l???i</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <Row className="myRes-detail-list-img">
                        {this.state.imageList}
                    </Row>
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
                <Modal isOpen={modal2} toggle={this.toggle2} className={``}>
                    <ModalHeader toggle={this.toggle2}>Th??ng b??o</ModalHeader>
                    <ModalBody>
                        B???n c?? ch???c ch???n x??a ???nh n??y ?
                    </ModalBody>
                    <ModalFooter>
                        <div className="btn btn-success" onClick={() => this.deleteImage(imgDeleteId)}>C??</div>{' '}
                        <Button color="secondary" onClick={this.toggle2}>Tr??? l???i</Button>
                    </ModalFooter>
                </Modal>
            </div >
        )
    }
}
