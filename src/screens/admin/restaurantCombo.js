import React, { useEffect, useState } from 'react';
import SlideBar from '../../components/admin/SlideBar';
import { FaBars } from 'react-icons/fa';
import {
    NavItem, Nav, Container, Table
} from 'reactstrap';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import RestaurantComboItem from '../../components/admin/RestaurantComboItem';
import Notification from '../../components/admin/Notification';

export default function RestaurantCombo(props) {
    const { restaurantId } = props.location.state;
    const [toggled, setToggled] = useState(false);
    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const [combos, setCombos] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [offset, setOffset] = useState(0);
    const [perPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        window.scrollTo(0, 0);
        receivedData();
    }, [currentPage, combos]);

    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;

        setCurrentPage(selectedPage);
        setOffset(offset);
        // receivedData(0, '');
    };

    const receivedData = () => {
        axios.get(`/combos/getCombosByRestaurantId?restaurantId=${restaurantId}&isActive=0`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(offset, offset + perPage)
                const combosPaging = slice.map((combo, index) => {
                    return <RestaurantComboItem key={index} combo={combo} count={index + 1} restaurantId={restaurantId} />
                })

                setCombos(combosPaging);
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
                        <Link className="btn btn-primary" to='/login' onClick={Logout}>????ng xu???t</Link>
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
                            Th??ng tin
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link to={{
                            pathname: `/admin/restaurant/image`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >???nh
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link to={{
                            pathname: `/admin/restaurant/menu`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            Th???c ????n
                        </Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={{
                            pathname: `/admin/restaurant/combo`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            Combo m??n ??n
                        </Link>
                    </NavItem>
                    <NavItem >
                        <Link to={{
                            pathname: `/admin/restaurant/service`,
                            state: {
                                restaurantId: restaurantId
                            }
                        }}
                        >
                            D???ch v???
                        </Link>
                    </NavItem>
                </Nav>
                <Container>
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
                            {combos.length > 0 && combos}
                        </tbody>
                    </Table>
                    <ReactPaginate
                        previousLabel={"Trang tr?????c"}
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
