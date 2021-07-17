import React, { useEffect, useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars } from 'react-icons/fa';
import {
    NavItem, Nav, Container, Table
} from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import RestaurantDishItem from '../../components/admin/RestaurantDishItem';
import Notification from '../../components/admin/Notification';

export default function RestaurantDish(props) {
    const { restaurantId } = props.location.state;
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const [dishes, setDishes] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData(0, '');
    }, [currentPage, dishes]);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        // receivedData(0, '');
    };

    const receivedData = (categoryId, nameSearch) => {
        window.scrollTo(0, 0);
        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=${categoryId}&dishName=${nameSearch}&statusId=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(offset, offset + perPage)
                const dishesPaging = slice.map((dish, index) => {
                    return <RestaurantDishItem key={index} dish={dish} count={index + 1} restaurantId={restaurantId} />
                })

                setDishes(dishesPaging);
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
                    <NavItem >
                        <Link to={{
                            pathname: `/admin/restaurant/image`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >Ảnh
                        </Link>
                    </NavItem>
                    <NavItem className="active">
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
                            {dishes.length > 0 && dishes}
                        </tbody>
                    </Table>
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
