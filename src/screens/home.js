import { Component } from 'react';
import {
    CardImg, Row, Form, FormGroup,
    Input, Label, Container
} from 'reactstrap';
import { Redirect } from 'react-router';
import axios from 'axios';
import subVn from "sub-vn";
import Carousel from 'react-multi-carousel';

import TopMenu from '../components/common/topMenu';
import Footer from '../components/common/footer';
import wallpaper from '../images/wallpaper.png';
import RestaurantItem from '../components/restaurant/restaurantItem';
import Spinner from '../components/common/spinner';

const responsive = {
    desktop: {
        breakpoint: {
            max: 3000,
            min: 1200
        },
        items: 4,
        partialVisibilityGutter: 40
    },
    mobile: {
        breakpoint: {
            max: 767.98,
            min: 0
        },
        items: 1,
        partialVisibilityGutter: 30
    },
    tablet: {
        breakpoint: {
            max: 1199.98,
            min: 768
        },
        items: 2,
        partialVisibilityGutter: 30
    }
}
export default class home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: [],
            restaurantsType1: [],
            restaurantsType2: [],
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
            restaurantId: '',
            loading: true
        };
        this.onProvinceClick = this.onProvinceClick.bind(this);
        this.onChangeRestaurantName = this.onChangeRestaurantName.bind(this);
        this.onDistrictClick = this.onDistrictClick.bind(this);
        this.onChangeCheckboxTypeOne = this.onChangeCheckboxTypeOne.bind(this);
        this.onChangeCheckboxTypeTwo = this.onChangeCheckboxTypeTwo.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChangeRestaurantName(event) {
        event.preventDefault();
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
        this.setState({ isSubmit: true })
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        axios.get('/restaurants/1')
            .then(res => {
                this.setState({
                    restaurantsType1: res.data,
                    loading: false
                });
            })
        axios.get('/restaurants/2')
            .then(res => {
                this.setState({
                    restaurantsType2: res.data,
                    loading: false
                })
            })
    }

    render() {
        let { provinces, districts, restaurantsType1,
            restaurantsType2, isSubmit, loading
        } = this.state;

        return (
            <div className="home-container">
                <TopMenu />
                <div className="wallpaper">
                    <CardImg className="image" src={wallpaper} alt="Wallpaper" />
                    <div className="home-title">Feast Booking</div>
                </div>
                <div className="home-search">
                    <Form className="search-form">
                        <FormGroup>
                            <Input
                                type="text"
                                name="text"
                                id="text-search"
                                placeholder="Tìm kiếm"
                                value={localStorage.getItem("restaurantText")}
                                onChange={this.onChangeRestaurantName}
                            />
                        </FormGroup>
                        <div className="search-location">
                            <FormGroup className="citySelect">
                                <Label for="citySelect"><b>Chọn tỉnh/ thành phố</b></Label>
                                <Input
                                    type="select"
                                    name="citySelect"
                                    id="citySelect"
                                    value={localStorage.getItem("provinceCode") || ''}
                                    onChange={this.onProvinceClick}
                                >
                                    <option value={''}>Tỉnh/ Thành phố</option>
                                    {provinces.map((province) => {
                                        return (
                                            <option key={province.code} value={province.code}>
                                                {province.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </FormGroup>
                            <FormGroup className="districtSelect">
                                <Label for="districtSelect"><b>Chọn quận/ huyện </b></Label>
                                <Input
                                    type="select"
                                    name="districtSelect"
                                    id="districtSelect"
                                    // value={localStorage.getItem("districtIndex")}
                                    onChange={this.onDistrictClick}
                                >
                                    <option value={''}>Quận/ Huyện</option>
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
                        <div className="search-other">
                            <FormGroup className="search-other-cb1" check>
                                <Label check>
                                    <Input
                                        id="cbTypeOne"
                                        type="checkbox"
                                        onChange={this.onChangeCheckboxTypeOne}
                                    /> Tiệc lưu động
                                </Label>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                    <Input
                                        id="cbTypeTwo"
                                        type="checkbox"
                                        onChange={this.onChangeCheckboxTypeTwo}
                                    /> Tiệc tại trung tâm
                                </Label>
                            </FormGroup>
                        </div>
                        <Input onClick={() => {
                            this.onSubmit();
                        }} type="submit" className="btn btn-success btn-search" value="Tìm kiếm" />
                    </Form>

                </div>
                {
                    loading ? (
                        <div className="home-content">
                            <Spinner />
                        </div>
                    ) : (<div className="home-content">
                        <div className="content-title">Trung tâm tổ chức sự kiện nổi bật</div>
                        <div className="content-restaurant">
                            <div className="section-1">
                                <div className="content-restaurant-heading">
                                    <div className="heading-title">Tiệc lưu động</div>
                                </div>
                                <Container className="content-restaurant-list">
                                    <Row className="content-restaurant-row">
                                        <Carousel
                                            responsive={responsive}
                                            additionalTransfrom={0}
                                            autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                            autoPlaySpeed={3000}
                                            centerMode={true}
                                            focusOnSelect={false}
                                            infinite={true}
                                            slidesToSlide={1}
                                            containerClass="container-with-dots"
                                        >
                                            {restaurantsType1.map((restaurant, index) => {
                                                return <div key={index}>
                                                    <RestaurantItem restaurant={restaurant} />
                                                </div>
                                            })}
                                        </Carousel>
                                    </Row>
                                </Container>
                            </div>
                            <div className="section-2">
                                <div className="content-restaurant-heading">
                                    <div className="heading-title">Tiệc tại trung tâm</div>
                                </div>
                                <Container className="content-restaurant-list">
                                    <Row className="content-restaurant-row">
                                        <Carousel
                                            responsive={responsive}
                                            additionalTransfrom={0}
                                            autoPlay={this.props.deviceType !== "desktop" ? true : false}
                                            autoPlaySpeed={3000}
                                            centerMode={true}
                                            focusOnSelect={false}
                                            infinite={true}
                                            slidesToSlide={1}
                                            containerClass="container-with-dots"
                                        >
                                            {restaurantsType2.map((restaurant, index) => {
                                                return <div key={index}>
                                                    <RestaurantItem restaurant={restaurant} />
                                                </div>
                                            })}
                                        </Carousel>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </div>
                    )
                }
                <Footer />
                {
                    isSubmit &&
                    <Redirect to={{
                        pathname: '/search-result'
                    }} />
                }
                <div className="p-3 bg-danger my-2 rounded" id="toast-message-error">
                </div>
            </div>
        );
    }
}