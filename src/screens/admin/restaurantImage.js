import React, { useEffect, useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars } from 'react-icons/fa';
import {
    Row, Col, NavItem, Nav, Container, CardImg
} from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import Notification from '../../components/admin/Notification';

export default function RestaurantImage(props) {
    const { restaurantId } = props.location.state;
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const [imageList, setImageList] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData();
    }, currentPage);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        receivedData();
    };

    const receivedData = () => {
        axios.get(`/images/getRestaurantImages?restaurantId=${restaurantId}`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(offset, offset + perPage)
                const imageList = slice.map((image, index) => {
                    return <Col className="myRes-detail-img-item" key={index} lg="3" md="4" sm="12">
                        <CardImg className="image-description" src={`/images/${image.image_id}`} />
                    </Col>
                })

                setImageList(imageList);
                setPageCount(Math.ceil(data.length / perPage));
            })
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
                    <NavItem >
                        <Link to={{
                            pathname: `/admin/restaurant/detail`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}>
                            Thông tin
                        </Link>
                    </NavItem>
                    <NavItem className="active">
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
                    <Row className="myRes-detail-list-img">
                        {imageList.length > 0 && imageList}
                    </Row>
                    <ReactPaginate
                        previousLabel={"Trang trước"}
                        nextLabel={"Trang sau"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Container>
            </div>
        </div>
    )
}
