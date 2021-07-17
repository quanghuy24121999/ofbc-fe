import React, { useEffect, useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars } from 'react-icons/fa';
import {
    Row, Col, NavItem, Nav, Container,
    Label,CardImg
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

import RestaurantAvatar from '../../images/default-restaurant.png';
import Notification from '../../components/admin/Notification';

export default function RestaurantDetail(props) {
    const { restaurantId } = props.location.state;
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const [restaurant, setRestaurant] = useState('');
    const [status, setStatus] = useState('');
    const [restaurantAvatar, setRestaurantAvatar] = useState('');
    const [restaurantCertificate, setRestaurantCertificate] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`/images/getImagesRestaurant?restaurantId=${restaurantId}`)
            .then(res => {
                let tempArr = res.data;
                tempArr.forEach(item => {
                    if (item.image_type === 'Avatar') {
                        setRestaurantAvatar(item.image_id);
                    } else if (item.image_type === 'Certificate') {
                        setRestaurantCertificate(item.image_id);
                    }
                })

            })

        axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
            .then(res => {
                setRestaurant(res.data);
                if (res.data.status.name === 'pending') {
                    setStatus('Đang chờ duyệt');
                }
            })
    })

    let image;
    if (restaurantAvatar === '') {
        image = <CardImg id="user-image" className="restaurant-profile-image" top src={RestaurantAvatar} />
    } else {
        image = <CardImg id="user-image" className="restaurant-profile-image" top src={'/images/' + restaurantAvatar} />
    }

    const Logout = () => {
        localStorage.clear();
    }

    return (
        <div className={`admin ${toggled ? 'toggled' : ''}`}>
            <SlideBar
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                inComponent="restaurant"
            />

            <div className="main">
                <div className="navbar-top">
                    <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
                        <FaBars />
                    </div>
                    <div className="admin-nav-number-user"></div>
                    <div className="admin-nav-infor">
                        <Notification />
                        <Link className="btn btn-primary" to='/login' onClick={Logout}>Đăng xuất</Link>
                    </div>
                </div>
                <Nav pills className="restaurant-detail-nav admin-res-nav container">
                    <NavItem className="active">
                        <Link to={{
                            pathname: `/admin/restaurant/detail`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}>
                            Thông tin
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to={{
                            pathname: `/admin/restaurant/image`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >Ảnh
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to={{
                            pathname: `/admin/restaurant/menu`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            Thực đơn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to={{
                            pathname: `/admin/restaurant/combo`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            Combo món ăn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to={{
                            pathname: `/admin/restaurant/service`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            Dịch vụ
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
                    {
                        restaurant && (
                            <Row className="myRes-detail-content-row">
                                <Col lg="6" md="12" sm="12" className="myRes-detail-content-img">
                                    <Row>
                                        <Col lg="12" md="12" sm="12" className="admin-res-avatar">
                                            {image}
                                        </Col>
                                        <Col lg="12" md="12" sm="12">
                                            <CardImg id="user-image" className="restaurant-profile-image" top src={'/images/' + restaurantCertificate} />
                                            <h5 className="img-title">Giấy chứng nhận vệ sinh an toàn thực phẩm</h5>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col lg="6" md="12" sm="12" className="myRes-detail-content-info">
                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-name"><b>Tên nhà hàng:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.restaurantName}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-name"><b>Loại hình:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.providerType.name}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-name"><b>Trạng thái:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{status}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="citySelect"><b>Tỉnh/ thành phố:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.province}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="districtSelect"><b>Quận/ huyện: </b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.district}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-address"><b>Địa chỉ:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.address}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-phoneNumber"><b>Số điện thoại:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.phoneNumber}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-size"><b>Sức chứa (Khách):</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.size}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="5">
                                            <Label for="restaurant-code-legal"><b>Mã giấy phép kinh doanh:</b></Label>
                                        </Col>
                                        <Col lg="7">
                                            <div>{restaurant.bussinessLicenseId}</div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col lg="2">
                                            <Label for="restaurant-description"><b>Mô tả:</b></Label>
                                        </Col>
                                        <Col lg="10">
                                            <div>{restaurant.description}</div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        )
                    }
                </Container>
            </div>
        </div >
    )
}

