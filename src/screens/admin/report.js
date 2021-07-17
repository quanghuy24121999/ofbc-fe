import React, { useEffect, useState } from 'react';
import {
    Container, Table
} from 'reactstrap';
import { FaBars } from 'react-icons/fa';
import SlideBar from '../../components/admin/SlideBar';
import axios from 'axios';
import { Link } from 'react-router-dom';

import Notification from '../../components/admin/Notification';
import ReportItem from '../../components/admin/ReportItem';

export default function Report() {
    const [toggled, setToggled] = useState(false);
    const [reports, setReport] = useState([]);

    const handleToggleSidebar = (value) => {
        setToggled(value);
    };

    const Logout = () => {
        localStorage.clear();
    }

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`/feedbacks/getReport`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                setReport(res.data);
            })
    }, [reports]);

    return (
        <div className={`admin ${toggled ? 'toggled' : ''}`}>
            <SlideBar
                toggled={toggled}
                handleToggleSidebar={handleToggleSidebar}
                inComponent="report"
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
                <Container>
                    <h3>Các nhà hàng đang chờ duyệt</h3>
                    <hr />
                    <Table className="report-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nội dung</th>
                                <th>Thời gian</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                reports.length > 0 && (
                                    reports.map((report, index) => {
                                        return <ReportItem key={index} report={report} count={index + 1} />
                                    })
                                )
                            }
                        </tbody>
                    </Table>
                </Container>
            </div>
        </div>
    )
}
