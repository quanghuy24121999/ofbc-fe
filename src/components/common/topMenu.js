import React, { useEffect, useState } from "react";
import {
    Collapse, Modal, ModalHeader, ModalBody, ModalFooter,
    Navbar, NavbarToggler, NavbarBrand, Nav, NavItem,
    CardImg, Button
} from "reactstrap";

import { Link, Redirect } from "react-router-dom";
import image from '../../images/logo_header-removebg-preview.png';
import axios from "axios";
import { FaBell } from "react-icons/fa";

import NotificationItem from "./notificationItem";

const TopMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDisplay, setIsDisplay] = useState(false);
    const [currentUser, setCurrentUser] = useState();
    const [notifications, setNotifications] = useState([]);
    const [isLogout, setIsLogout] = useState(false);
    const [modal1, setModal1] = useState(false);

    const toggle1 = () => setModal1(!modal1);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        axios.get(`/users/findByPhoneNumber/${localStorage.getItem('currentUser')}`)
            .then(res => {
                let user = res.data;
                setCurrentUser(user);
                if (user !== null && user !== undefined && user !== '') {
                    localStorage.setItem('userId', user.id);
                    if (user.role.name === 'ROLE_PROVIDER') {
                        axios.get(`/notifications/getNotifications?customerId=${user.id}&providerId=${user.id}&isAdmin=0`)
                            .then(res => {
                                setNotifications(res.data);
                            })
                    }
                }
            });
    }

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userId');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('resId');
        localStorage.clear();
        setIsLogout(true);
    }

    const displayNotify = () => {
        setIsDisplay(!isDisplay);
        if (!isDisplay) {
            loadData();
            document.getElementById('notification').style.display = "flex";
        } else {
            document.getElementById('notification').style.display = "none";
        }
    }

    return (
        <div>
            <Navbar dark className="top-menu" expand="md">
                <NavbarBrand className="logo" href="/">
                    <CardImg src={image} alt="Logo" />
                </NavbarBrand>
                <NavbarToggler onClick={toggle} color="success" />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto nav" navbar>
                        <div className="nav-section">
                            <NavItem>
                                <Link className="link" to="/">Trang chủ</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="link" to="/promotion">Ưu đãi hôm nay</Link>
                            </NavItem>
                            <NavItem>
                                <Link className="link" to="/provider-register">Đăng ký nhà hàng</Link>
                            </NavItem>
                        </div>
                        {currentUser ? (
                            <div className="authen">
                                <NavItem className="icon-bell">
                                    <FaBell onClick={displayNotify} />
                                    {
                                        notifications.length > 0 &&
                                        <span className="icon-bell-dot"></span>
                                    }
                                    <div className="notification" id="notification">
                                        <h5 className="notification-title">Thông báo</h5>
                                        <hr />
                                        <div className="notification-list">
                                            {
                                                notifications.length > 0 ? (notifications.map((notification, index) => {
                                                    return <NotificationItem key={index} notification={notification} />
                                                })) : (
                                                    <h5>Không có thông báo nào </h5>
                                                )
                                            }
                                        </div>
                                    </div>
                                </NavItem>
                                <NavItem>
                                    <Link
                                        className="link"
                                        onClick={() => {
                                            localStorage.setItem('userId', '');
                                            localStorage.setItem('userId', currentUser.id);
                                        }}
                                        to={{
                                            pathname: `/users/profile`,
                                            state: { userId: localStorage.getItem('userId') }
                                        }}
                                    >
                                        {currentUser.name}
                                    </Link>
                                </NavItem>
                                <NavItem>
                                    <Link className="link" onClick={toggle1}>Đăng xuất</Link>
                                    <Modal isOpen={modal1} toggle={toggle1} className={``}>
                                        <ModalHeader toggle={toggle1}>Thông báo</ModalHeader>
                                        <ModalBody>
                                            Bạn có chắc chắn muốn đăng xuất ?
                                        </ModalBody>
                                        <ModalFooter>
                                            <Link className="btn btn-success" onClick={logout} to="/">Đồng ý</Link>
                                            <Button color="secondary" onClick={toggle1}>Quay lại</Button>
                                        </ModalFooter>
                                    </Modal>
                                </NavItem>
                            </div>
                        ) : (
                            <div className="authen">
                                <NavItem>
                                    <Link className="link" to="/login">Đăng nhập</Link>
                                </NavItem>
                                <NavItem>
                                    <Link className="link" to="/register">Đăng ký</Link>
                                </NavItem>
                            </div>)}
                    </Nav>
                </Collapse>
            </Navbar>
            {
                isLogout && <Redirect to={{
                    pathname: "/login"
                }} />
            }
        </div>
    );
};

export default TopMenu;
