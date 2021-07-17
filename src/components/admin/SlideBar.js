import React from 'react';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';
import {
    FaTachometerAlt, FaStore, FaShoppingBasket,
    FaFlag
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const SlideBar = ({ toggled, handleToggleSidebar, inComponent }) => {
    return (
        <ProSidebar
            toggled={toggled}
            breakPoint="md"
            onToggle={handleToggleSidebar}
        >
            <SidebarHeader>
                <div
                    style={{
                        padding: '24px',
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        fontSize: 14,
                        letterSpacing: '1px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    Feast Booking System
                </div>
            </SidebarHeader>

            <SidebarContent>
                <Menu iconShape="circle">
                    <MenuItem
                        icon={<FaTachometerAlt />}
                        active={inComponent === 'admin' && true}
                    >
                        Trang chủ
                        <Link to="/admin" />
                    </MenuItem>
                    <MenuItem
                        icon={<FaShoppingBasket />}
                        active={inComponent === 'order' && true}

                    >
                        Đơn hàng
                        <Link to="/admin/order" />
                    </MenuItem>
                    <MenuItem
                        icon={<FaStore />}
                        active={inComponent === 'restaurant' && true}

                    >
                        Nhà hàng
                        <Link to="/admin/restaurant" />
                    </MenuItem>
                    <MenuItem
                        icon={<FaFlag />}
                        active={inComponent === 'report' && true}
                    >
                        Báo cáo
                        <Link to="/admin/report" />
                    </MenuItem>
                </Menu>
            </SidebarContent>

            <SidebarFooter style={{ textAlign: 'center' }}>
                <div
                    className="sidebar-btn-wrapper"
                    style={{
                        padding: '20px 24px',
                    }}
                >
                    © 2021 Feast Booking. All rights reserved.
                </div>
            </SidebarFooter>
        </ProSidebar>
    );
};

export default SlideBar;
