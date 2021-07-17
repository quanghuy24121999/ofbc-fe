import React, { Component } from 'react'

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import {
    Nav, NavItem, Input, Label,
    Button, Container, Row, Col
} from 'reactstrap';
import Carousel from 'react-multi-carousel';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';

import DishItem from '../../components/restaurant/dishItem';
import Cart from '../../components/restaurant/cart';

const responsive = {
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1024
        },
        items: 4,
        partialVisibilityGutter: 40
    },
    mobile: {
        breakpoint: {
            max: 464,
            min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
    },
    tablet: {
        breakpoint: {
            max: 1024,
            min: 464
        },
        items: 2,
        partialVisibilityGutter: 30
    }
}

export default class menu extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputDishName: '',
            dishType1: [],
            dishType2: [],
            dishType3: [],
            dishType4: [],
            // dishSearch: '',
            //paging
            offset: 0,
            perPage: 12,
            currentPage: 0
        }

        this.onChangeInputDishName = this.onChangeInputDishName.bind(this);
        this.searchDishByName = this.searchDishByName.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const restaurantId = this.props.match.params.restaurantId;
        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=1&dishName=&statusId=1`)
            .then(res => {
                this.setState({ dishType1: res.data })
            })

        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=2&dishName=&statusId=1`)
            .then(res => {
                this.setState({ dishType2: res.data })
            })

        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=3&dishName=&statusId=1`)
            .then(res => {
                this.setState({ dishType3: res.data })
            })

        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=4&dishName=&statusId=1`)
            .then(res => {
                this.setState({ dishType4: res.data })
            })
    }

    onChangeInputDishName(e) {
        e.preventDefault();
        this.setState({
            inputDishName: e.target.value
        })
        localStorage.setItem("inputDishName", e.target.value);
    }

    searchDishByName() {
        window.scrollTo(0, 0);
        const restaurantId = this.props.match.params.restaurantId;
        let inputDishName = '';
        inputDishName = localStorage.getItem("inputDishName");
        if (inputDishName === null || inputDishName === undefined) {
            inputDishName = '';
        }
        axios.get(`/dishes/getDishesByRestaurantId?restaurantId=${restaurantId}&categoryId=0&dishName=${inputDishName}&statusId=1`)
            .then(res => {
                const data = res.data;
                const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
                const dishSearch = slice.map((dish, index) => {
                    return <Col key={index} className="search-item" lg="3" md="6" sm="12">
                        <DishItem dish={dish} />
                    </Col>
                })
                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    dishSearch
                })
            });
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.searchDishByName();
        });

    };

    render() {
        let { inputDishName, dishType1, dishType2, dishType3, dishType4 } = this.state;
        const restaurantId = this.props.match.params.restaurantId;

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}`}  >Nhà hàng</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/restaurant-detail/${restaurantId}/menu`} >Thực đơn</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/combo`}  >Combo</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/service`}>Dịch vụ</Link>
                    </NavItem>
                </Nav>

                <Cart restaurantId={this.props.match.params.restaurantId} />
                <Container className="menu-search-dish">
                    <Input
                        type="text"
                        id="dishName"
                        className="input-dish-name"
                        placeholder="Nhập tên món ăn"
                        onChange={this.onChangeInputDishName}
                        value={inputDishName}
                    />
                    <Button onClick={this.searchDishByName} color="success" className="btn-search-dish">Tìm</Button>
                </Container>

                {this.state.dishSearch ? (
                    <Container>
                        <Row className="dish-search-row">
                            {this.state.dishSearch}
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
                ) : (
                    <div className="list">
                        <div className="list-dishes">
                            <Container className="list-dishes-title">Món khai vị </Container>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        // containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {dishType1.map((dish, index) => {
                                            return <div key={index}>
                                                <DishItem dish={dish} />
                                            </div>
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div >

                        <div className="list-dishes">
                            <Container className="list-dishes-title">Món chính </Container>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        // containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {dishType2.map((dish, index) => {
                                            return <div key={index}>
                                                <DishItem dish={dish} />
                                            </div>
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div>

                        <div className="list-dishes">
                            <Container className="list-dishes-title">Món tráng miệng </Container>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        // containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {dishType3.map((dish, index) => {
                                            return <div key={index}>
                                                <DishItem dish={dish} />
                                            </div>
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div>

                        <div className="list-dishes">
                            <Container className="list-dishes-title">Đồ uống </Container>
                            <Container className="content-restaurant-list">
                                <Row className="content-restaurant-row">
                                    <Carousel
                                        responsive={responsive}
                                        additionalTransfrom={0}
                                        autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                        autoPlaySpeed={3000}
                                        centerMode={true}
                                        // containerClass="container"
                                        focusOnSelect={false}
                                        infinite={true}
                                        slidesToSlide={1}
                                        containerClass="container-with-dots"
                                    >
                                        {dishType4.map((dish, index) => {
                                            return <div key={index}>
                                                <DishItem dish={dish} />
                                            </div>
                                        })}
                                    </Carousel>
                                </Row>
                            </Container>
                        </div>
                    </div>
                )
                }
                <Footer />
            </div >
        )
    }
}
