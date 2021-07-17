import React, { Component } from 'react'

import {
    Container, Input, Label,
    Nav, NavItem, NavLink, Button,
    Modal, ModalHeader, ModalBody,
    ModalFooter, Row, Col
} from 'reactstrap';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import StarRatings from "react-star-ratings";
import { FaFlag, FaMapMarkerAlt } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import { Redirect, Link } from "react-router-dom";

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import axios from 'axios';

import Cart from '../../components/restaurant/cart';
import StarRating from '../../components/common/starRating';
import FeedbackItem from '../../components/common/feedbackItem';
import PromotionItemRes from '../../components/restaurant/promotionItemRes';
import { onChangeRate } from '../../common/changeLink';
import { Notify } from '../../common/notify';
import { validateFeedback } from '../../common/validate';

export default class restaurantDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            restaurant: {},
            feedbacks: [],
            promotions: [],
            numberRates: 0,
            rating: 1,
            offset: 0,
            perPage: 4,
            currentPage: 0,
            rate: 0,
            textFeedback: '',
            displayModal: false,
            moveToLogin: false,
            modal: false,
            report: ''
        }

        this.changeRating = this.changeRating.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.onChangeRate = this.onChangeRate.bind(this);
        this.onChangeTextFeedback = this.onChangeTextFeedback.bind(this);
        this.onSubmitFeedback = this.onSubmitFeedback.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onChangeReport = this.onChangeReport.bind(this);
        this.sendReport = this.sendReport.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let imageArr = [];
        const restaurantId = this.props.match.params.restaurantId;

        axios.get(`/images/getRestaurantImages?restaurantId=${restaurantId}`)
            .then(res => {
                const images = res.data;
                images.map(image => {
                    let imageObject = {
                        original: '/images/' + image.image_id,
                        thumbnail: '/images/' + image.image_id
                    }
                    return imageArr.push(imageObject);
                })
                this.setState({
                    images: imageArr
                })
            })

        axios.get(`/restaurants/detail?restaurantId=${restaurantId}`)
            .then(res => {
                this.setState({ restaurant: res.data })
            })

        axios.get(`/promotions/getPromotionsByRestaurantId?restaurantId=${restaurantId}&isActive=1`)
            .then(res => {
                this.setState({ promotions: res.data })
            })

        axios.get(`/feedbacks/getFeedbacksByRestaurantId?restaurantId=${restaurantId}&rate=0`)
            .then(res => {
                this.setState({ numberRates: res.data.length });
            })

        this.receivedData();
    }

    changeRating(newRating) {
        this.setState({
            rating: newRating
        });
    }

    receivedData() {
        const restaurantId = this.props.match.params.restaurantId;
        axios.get(`/feedbacks/getFeedbacksByRestaurantId?restaurantId=${restaurantId}&rate=${this.state.rate}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const feedbackPaging = slice.map((feedback, index) => {
                    return <Col key={index} lg="6" md="12" sm="12">
                        <FeedbackItem feedback={feedback} />
                    </Col>
                })
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    feedbacks: data,
                    feedbackPaging
                })
            })
    }

    toggleModal() {
        this.setState({
            displayModal: !this.state.displayModal
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    onChangeTextFeedback(e) {
        this.setState({
            textFeedback: e.target.value
        });
    }

    onSubmitFeedback(e) {
        e.preventDefault();
        let isAuthen = this.isAuthentication();
        let feedbackContent = this.state.textFeedback.trim();
        feedbackContent = feedbackContent.replace(/\s\s+/g, ' ');

        if (!isAuthen) {
            this.toggleModal();
        } else
            if (feedbackContent !== '') {
                if (validateFeedback(feedbackContent)) {
                    axios.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
                        .then(res => {
                            const currentUser = res.data;
                            const { textFeedback, rating } = this.state;
                            axios({
                                method: 'post',
                                url: `/feedbacks/insertFeedback`,
                                headers: {
                                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                                }
                                ,
                                data: {
                                    "feedback_content": textFeedback,
                                    "user_id": currentUser.id,
                                    "rate": rating,
                                    "restaurant_id": this.props.match.params.restaurantId
                                }
                            }).then(res => {
                                const restaurantId = this.props.match.params.restaurantId;
                                this.receivedData();
                                axios.get(`/feedbacks/getFeedbacksByRestaurantId?restaurantId=${restaurantId}&rate=0`)
                                    .then(res => {
                                        this.setState({ numberRates: res.data.length });
                                    })
                                Notify('Viết đánh giá thành công', 'success', 'top-right');
                            }
                            );
                        })
                } else {
                    Notify('Nội dung đánh giá phải ít hơn 250 ký tự', 'error', 'top-right');
                }
            } else {
                Notify('Vui lòng nhập nội dung đánh giá', 'error', 'top-right');
            }
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

    onChangeRate(rate) {
        onChangeRate(rate);
        this.setState({
            offset: 0,
            rate: rate
        }, () => {
            const restaurantId = this.props.match.params.restaurantId;
            axios.get(`/feedbacks/getFeedbacksByRestaurantId?restaurantId=${restaurantId}&rate=${rate}`)
                .then(res => {
                    const data = res.data;
                    const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
                    const feedbackPaging = slice.map((feedback, index) => {
                        return <Col key={index} lg="6" md="12" sm="12">
                            <FeedbackItem feedback={feedback} />
                        </Col>
                    })
                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        feedbacks: data,
                        feedbackPaging
                    })
                })
        });
    }

    onChangeReport(e) {
        this.setState({ report: e.target.value });
    }

    sendReport(e) {
        e.preventDefault();
        let isAuthen = this.isAuthentication();
        let reportContent = this.state.report.trim();
        reportContent = reportContent.replace(/\s\s+/g, ' ');

        if (!isAuthen) {
            this.toggleModal();

        } else {
            if (reportContent !== "") {
                axios.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
                    .then(res => {
                        const currentUser = res.data;
                        const { report } = this.state;
                        axios({
                            method: 'post',
                            url: `/feedbacks/insertFeedback`,
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('token')
                            }
                            ,
                            data: {
                                "feedback_content": report,
                                "user_id": currentUser.id,
                                "rate": 0,
                                "restaurant_id": this.props.match.params.restaurantId
                            }
                        }).then(res => {
                            axios.post(`/notifications/insertNotification`,
                                {
                                    "content": report,
                                    "customer": null,
                                    "provider": null,
                                    "forAdmin": true,
                                    "type": "report",
                                    "read": false
                                }
                            )
                                .then(res => {
                                    this.toggle();
                                    Notify("Gửi báo cáo thành công", "success", "top-right");
                                })
                        }).catch(err => {
                            Notify("Gửi báo cáo không thành công", "error", "top-right");
                        });
                    })
            } else {
                Notify("Vui lòng nhập nội dung báo cáo", "error", "top-right");
            }
        }
    }

    isAuthentication() {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser !== null && currentUser !== undefined) {
            return true
        } else {
            return false;
        }
    }

    moveToLogin = (e) => {
        e.preventDefault();
        this.setState({
            moveToLogin: true
        });
    }

    render() {
        const { images, restaurant, textFeedback, modal, report,
            rating, displayModal, moveToLogin, promotions, numberRates
        } = this.state;
        const restaurantId = this.props.match.params.restaurantId;

        return (
            <div>
                <Modal isOpen={displayModal} toggle={this.toggleModal} className="">
                    <ModalHeader toggle={this.toggleModal}>Thông báo</ModalHeader>
                    <ModalBody>
                        Bạn phải đăng nhập để thực hiện chức năng này
                    </ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={this.moveToLogin}>Đăng nhập</Button>{' '}
                        <Button color="secondary" onClick={this.toggleModal}>Quay lại</Button>
                    </ModalFooter>
                </Modal>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem className="active">
                        <Link to={`/restaurant-detail/${restaurantId}`}>Nhà hàng</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/menu`}  >Thực đơn</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/combo`}  >Combo</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/service`}>Dịch vụ</Link>
                    </NavItem>
                </Nav>
                <Cart restaurantId={this.props.match.params.restaurantId} />
                <Container className="image-slide">
                    <ImageGallery items={images} />
                </Container>
                <Container className="restaurant-detail-content">
                    <div className="restauran-detail-header">
                        <div className="restauran-detail-sub-header">
                            <div className="restauran-detail-name">{restaurant.restaurant_name}</div>
                            <div className="restauran-detail-rate">
                                <StarRating rate={restaurant.rate} starDimension="30" starSpacing="4" />
                            </div>
                        </div>
                        <div className="icon-flag" onClick={this.toggle}><FaFlag /> Báo cáo</div>
                        <Modal isOpen={modal} toggle={this.toggle} className={``}>
                            <ModalHeader toggle={this.toggle}>Báo cáo</ModalHeader>
                            <ModalBody>
                                <Label for="report"><b>Nội dung báo cáo: </b></Label>
                                <Input
                                    id="report"
                                    type="textarea"
                                    placeholder="Viết nội dung báo cáo (yêu cầu điền cụ thể tên món ăn, combo hoặc dịch vụ) "
                                    value={report}
                                    onChange={this.onChangeReport}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="success" onClick={this.sendReport}>Gửi</Button>{' '}
                                <Button color="secondary" onClick={this.toggle}>Trở lại</Button>
                            </ModalFooter>
                        </Modal>
                    </div>
                    <div className="restauran-detail-location">
                        <FaMapMarkerAlt className="i-location" /> {restaurant.province}
                    </div>
                    <div className="restauran-detail-description">{restaurant.description}</div>
                    <Row className="restaurant-detail-promotion">
                        {promotions.map((promotion, index) => {
                            return <Col key={index} lg="6">
                                <PromotionItemRes promotion={promotion} />
                            </Col>
                        })}
                    </Row>
                </Container>

                <Container className="feedback">
                    <Row>
                        <Col lg="4" md="6" sm="12">
                            <div className="feedback-title">Bài đánh giá {restaurant.restaurant_name} từ khách hàng</div>
                            <div className="feedback-sub-title">
                                <StarRating rate={restaurant.rate} starDimension="30" starSpacing="4" />
                                <div className="feedback-description"><b>{Math.round(restaurant.rate * 100) / 100}/5</b> dựa trên {numberRates} đánh giá</div>
                            </div>
                            <hr />
                            <div className="send-feedback">
                                <Label
                                    className="send-feedback-title"
                                    for="feedback"
                                    onChange={this.onChangeTextFeedback}
                                >
                                    <b>Đánh giá: </b>
                                </Label>
                                <Input
                                    type="textarea"
                                    id="feedback"
                                    placeholder="Nhập đánh giá của bạn"
                                    name="feedback"
                                    className="feedback-comment"
                                    onChange={this.onChangeTextFeedback}
                                    value={textFeedback}
                                />
                                <div className="feedback-star">
                                    <StarRatings
                                        rating={rating}
                                        starDimension="30px"
                                        starSpacing="4px"
                                        starRatedColor="#ffe200"
                                        changeRating={this.changeRating}
                                        numberOfStars={5}
                                        name="rating"
                                        starHoverColor="#ffe200"
                                    />
                                </div>
                                <Button className="btn-feedback" onClick={this.onSubmitFeedback} color="success">Đánh giá</Button>
                            </div>
                        </Col>
                        <Col lg="8" md="6" sm="12">
                            <div className="feedback-title">Các bài đánh giá của khách hàng</div>
                            <hr />
                            <div className="feedback-content">
                                <Nav pills className="star-rating-nav">
                                    <NavItem onClick={() => this.onChangeRate(0)}>
                                        <NavLink active id="all" >Tất cả</NavLink>
                                    </NavItem>
                                    <NavItem onClick={() => this.onChangeRate(5)}>
                                        <NavLink id="5" >5 sao</NavLink>
                                    </NavItem>
                                    <NavItem onClick={() => this.onChangeRate(4)}>
                                        <NavLink id="4" >4 sao</NavLink>
                                    </NavItem>
                                    <NavItem onClick={() => this.onChangeRate(3)}>
                                        <NavLink id="3" >3 sao</NavLink>
                                    </NavItem>
                                    <NavItem onClick={() => this.onChangeRate(2)}>
                                        <NavLink id="2" >2 sao</NavLink>
                                    </NavItem>
                                    <NavItem onClick={() => this.onChangeRate(1)}>
                                        <NavLink id="1" >1 sao</NavLink>
                                    </NavItem>
                                </Nav>
                                <Row className="feedback-list">
                                    {this.state.feedbackPaging}
                                </Row>
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
                            </div>
                        </Col>
                    </Row>
                </Container>
                <Footer />
                {
                    moveToLogin && <Redirect to={{
                        pathname: "/login"
                    }} />
                }
            </div>
        )
    }
}
