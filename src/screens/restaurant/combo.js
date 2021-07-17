import React, { Component } from 'react';
import {
    Nav, NavItem, Container, Row, Col
} from 'reactstrap';
import { Link } from "react-router-dom";
import axios from 'axios';
import ReactPaginate from 'react-paginate';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import Cart from '../../components/restaurant/cart';
import ComboItem from '../../components/restaurant/comboItem';

export default class combo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            offset: 0,
            perPage: 8,
            currentPage: 0
        }

        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.receivedData();
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
        const restaurantId = this.props.match.params.restaurantId;
        axios.get(`/combos/getCombosByRestaurantId?restaurantId=${restaurantId}&isActive=1`)
            .then(res => {
                let combosTemp = [];
                combosTemp = res.data;
                this.modifiedCombo(combosTemp);
                const slice = combosTemp.slice(this.state.offset, this.state.offset + this.state.perPage);
                const combos = slice.map((combo, index) => {
                    return <Col key={index} className="combo-item" lg="3" md="6" sm="12">
                        <ComboItem combo={combo} comboId={combo.id} />
                    </Col>
                })
                this.setState({
                    pageCount: Math.ceil(combosTemp.length / this.state.perPage),
                    combos
                })
            })
    }

    modifiedCombo(combos) {
        for (let i = 0; i < combos.length; i++) {
            combos[i].id = combos[i]['combo_id'];
            delete combos[i].combo_id;

            // combos[i].dish_name = combos[i]['combo_name'];
            // delete combos[i].combo_name;

            combos[i].price = combos[i]['combo_price'];
            delete combos[i].combo_price;

            combos[i].image_dish_id = combos[i]['image_combo_id'];
            delete combos[i].image_combo_id;
        }
    }

    render() {
        const restaurantId = this.props.match.params.restaurantId;

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}`}>Nhà hàng</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/menu`}  >Thực đơn</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/restaurant-detail/${restaurantId}/combo`}>Combo</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/service`}>Dịch vụ</Link>
                    </NavItem>
                </Nav>
                <Cart restaurantId={this.props.match.params.restaurantId} />
                <Container className="restaurant-detail-combo">
                    <div className="combo-header">
                        <div className="combo-header-text">Chọn combo để được giá tốt hơn</div>
                        <div className="combo-header-menu">
                            <Link to={`/restaurant-detail/${restaurantId}/menu`}>
                                Tự chọn Menu
                            </Link>
                        </div>
                    </div>
                    <div className="combo-content">
                        <Row>
                            {this.state.combos}
                        </Row>
                    </div>
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
                        activeClassName={"active"}
                    />
                </Container>
                <Footer />
            </div>
        )
    }
}
