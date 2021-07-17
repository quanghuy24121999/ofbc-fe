import React, { Component } from 'react';

import { FaFacebook, FaYoutube, FaTwitter } from 'react-icons/fa';

export default class footer extends Component {
    render() {
        return (
            <footer className="bg-dark text-center text-white">
                <section className="footer-content">
                    <div className="row d-flex justify-content-center">
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase title-link">Theo dõi chúng tôi trên</h5>

                            <ul className="list-unstyled mb-0 list-link">
                                <li>
                                    <a href="#!" className="i-facebook"><FaFacebook /></a>
                                </li>
                                <li>
                                    <a href="#!" className="i-youtube"><FaYoutube /></a>
                                </li>
                                <li>
                                    <a href="#!" className="i-twitter"><FaTwitter /></a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase title-link">Về Feast Booking</h5>

                            <ul className="list-unstyled mb-0 list-link-1">
                                <li>
                                    <a href="#!" className="text-white">Cách đặt tiệc</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Liên hệ với chúng tôi</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Tuyển dụng</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Về chúng tôi</a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-3 col-md-6 mb-4 mb-md-0">
                            <h5 className="text-uppercase title-link">Trợ giúp</h5>

                            <ul className="list-unstyled mb-0 list-link-2">
                                <li>
                                    <a href="#!" className="text-white">Trung tâm trợ giúp</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Câu hỏi thường gặp</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Chính sách bảo mật</a>
                                </li>
                                <li>
                                    <a href="#!" className="text-white">Điều khoản sử dụng</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>
                <div className="text-center p-3 all-rights">
                    © 2021 Feast Booking. All rights reserved.
                </div>
            </footer>
        )
    }
}
