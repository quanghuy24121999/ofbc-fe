import axios from 'axios';
import React, { Component } from 'react'
import {
    Container, Row, Form, FormGroup,
    Input, Label, Col
} from 'reactstrap';
import subVn from "sub-vn";
import ReactPaginate from 'react-paginate';

import TopMenu from '../components/common/topMenu';
import Footer from '../components/common/footer';
import RestaurantItem from '../components/restaurant/restaurantItem';
import Spinner from '../components/common/spinner';

export default class searchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: [],
            restaurantSearch: [],
            restaurantName: '',
            provinceName: '',
            districtName: '',
            type: 0,
            searchObject: {
                restaurantName: '',
                province: '',
                district: '',
                type: 0
            },
            isSubmit: false,
            offset: 0,
            perPage: 12,
            currentPage: 0,
            loading: true
        }

        this.handlePageClick = this.handlePageClick.bind(this);
        this.onProvinceClick = this.onProvinceClick.bind(this);
        this.onChangeRestaurantName = this.onChangeRestaurantName.bind(this);
        this.onDistrictClick = this.onDistrictClick.bind(this);
        this.onChangeCheckboxTypeOne = this.onChangeCheckboxTypeOne.bind(this);
        this.onChangeCheckboxTypeTwo = this.onChangeCheckboxTypeTwo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeRestaurantName(event) {
        event.preventDefault();
        localStorage.setItem("restaurantText", event.target.value);
        this.setState({ restaurantName: event.target.value })
    }

    onProvinceClick(event) {
        event.preventDefault();
        let provinceCode = event.target.value;
        this.setState({
            districts: subVn.getDistrictsByProvinceCode(provinceCode)
        });

        let index = event.nativeEvent.target.selectedIndex;
        let provinceName = event.nativeEvent.target[index].text;
        localStorage.setItem("provinceCode", provinceCode);
        localStorage.setItem("provinceName", provinceName);
        this.setState({ provinceName: event.target.value })
    }

    onDistrictClick(event) {
        event.preventDefault();
        let index = event.nativeEvent.target.selectedIndex;
        let districtName = event.nativeEvent.target[index].text;
        localStorage.setItem("districtName", districtName);
        this.setState(this.setState({ districtName: event.target.value }));
    }

    onChangeCheckboxTypeOne(event) {
        let check = event.target.checked;
        let cbTypeTwo = document.getElementById('cbTypeTwo');

        if (check) {
            localStorage.setItem("type", 1);
            this.setState({ type: 1 })
        } if ((check && cbTypeTwo.checked) || (!check && !cbTypeTwo.checked)) {
            localStorage.setItem("type", 0);
            this.setState({ type: 0 })
        }

        if (!check && cbTypeTwo.checked) {
            localStorage.setItem("type", 2);
            this.setState({ type: 2 })
        }
    }

    onChangeCheckboxTypeTwo(event) {
        let check = event.target.checked;
        let cbTypeOne = document.getElementById('cbTypeOne');

        if (check) {
            localStorage.setItem("type", 2);
            this.setState({ type: 2 })
        }
        if ((check && cbTypeOne.checked) || (!check && !cbTypeOne.checked)) {
            localStorage.setItem("type", 0);
            this.setState({ type: 0 })
        }

        if (!check && cbTypeOne.checked) {
            localStorage.setItem("type", 1);
            this.setState({ type: 1 })
        }
    }

    onSubmit(e) {
        e.preventDefault();
        console.log(localStorage.getItem('restaurantText'))
        this.setState({
            currentPage: 0,
            offset: 0
        }, () => {
            this.receivedData();
        })
    }

    handlePageClick = (e) => {
        window.scrollTo(0, 0);
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
        let restaurantText = '';
        restaurantText = localStorage.getItem("restaurantText");
        if (restaurantText === null || restaurantText === undefined) {
            restaurantText = '';
        }

        let type = 0;
        type = localStorage.getItem("type");
        if (type === null || type === undefined) {
            type = 0;
        }

        let provinceName = '';
        provinceName = localStorage.getItem("provinceName");
        if (provinceName === null || provinceName === undefined
            || provinceName === "Tỉnh/ Thành phố") {
            provinceName = '';
        }

        let districtName = '';
        districtName = localStorage.getItem("districtName");
        if (districtName === null || districtName === undefined
            || districtName === "Quận/ Huyện") {
            districtName = '';
        }

        axios.get(`/restaurants?type=${type}&province=${provinceName}&district=${districtName}&restaurantName=${restaurantText.trim()}`)
            .then(res => {
                this.setState({ loading: false });
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                const restaurants = slice.map((restaurant) => {
                    return <Col key={restaurant.restaurant_id} className="search-item" lg="3" md="6" sm="12">
                        <RestaurantItem restaurant={restaurant} />
                    </Col>
                })

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    restaurants,
                })
            });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.receivedData();
    }

    render() {
        let { provinces, districts, loading } = this.state;

        return (
            <div>
                <TopMenu />
                <div className="result-search">
                    <Form className="result-search-form">
                        <FormGroup className="result-search-text">
                            <Input
                                type="text"
                                name="text"
                                id="text-search"
                                placeholder="Tìm kiếm"
                                value={localStorage.getItem("restaurantText")}
                                onChange={this.onChangeRestaurantName}
                            />
                        </FormGroup>
                        <div className="result-search-location">
                            <FormGroup className="result-search-citySelect">
                                <Label for="citySelect"><b>Chọn tỉnh/ thành phố </b></Label>
                                <Input
                                    type="select"
                                    name="citySelect"
                                    id="citySelect"
                                    onChange={this.onProvinceClick}
                                    value={localStorage.getItem("provinceCode")}
                                >
                                    <option>Tỉnh/ Thành phố</option>
                                    {provinces.map((province) => {
                                        return (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                            <FormGroup className="result-search-districtSelect">
                                <Label for="districtSelect"><b>Chọn quận/ huyện </b></Label>
                                <Input type="select" name="districtSelect" id="districtSelect" onChange={this.onDistrictClick}>
                                    <option>Quận/ Huyện</option>
                                    {districts.map((district) => {
                                        return (
                                            <option key={district.code} value={district.code}>
                                                {district.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                        </div>
                        <div className="result-search-other">
                            <FormGroup className="result-search-other-cb1" check>
                                <Label check>
                                    <Input id="cbTypeOne" type="checkbox" onChange={this.onChangeCheckboxTypeOne} /><b>Tiệc lưu động</b>
                                </Label>
                            </FormGroup>
                            <FormGroup className="result-search-other-cb2" check>
                                <Label check>
                                    <Input id="cbTypeTwo" type="checkbox" onChange={this.onChangeCheckboxTypeTwo} /><b> Tiệc tại trung tâm</b>
                                </Label>
                            </FormGroup>
                        </div>
                        <Input onClick={this.onSubmit} type="submit" className="btn btn-success btn-result-search" value="Tìm kiếm" />
                    </Form>
                </div>
                {
                    loading ? (
                        <Container className="search-content">
                            <Spinner />
                        </Container>
                    ) : (
                        <Container className="search-content">
                            <Row className="result-search-row">
                                {this.state.restaurants}
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
                        </Container>
                    )
                }
                <Footer />
            </div>
        )
    }
}
