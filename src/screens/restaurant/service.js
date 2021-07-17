import React, { Component } from 'react';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import axios from 'axios'; import {
    Nav, NavItem, Container, Row
} from 'reactstrap';
import Carousel from 'react-multi-carousel';
import { Link } from 'react-router-dom';
import ServiceItem from '../../components/restaurant/serviceItem';

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

export default class service extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serviceType1: [],
            serviceType2: [],
            serviceType3: [],
            serviceType4: [],
            serviceType5: [],
            serviceType6: [],
            serviceType7: []
        }
    }

    modifiedService(services) {
        for (let i = 0; i < services.length; i++) {
            services[i].dish_name = services[i]['service_name'];
            delete services[i].service_name;

            services[i].image_dish_id = services[i]['image_service_id'];
            delete services[i].image_service_id;
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const restaurantId = this.props.match.params.restaurantId;
        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=1`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType1: services })
            })

        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=2`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType2: services })
            })

        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=3`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType3: services })
            })

        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=4`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType4: services })
            })
        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=5`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType5: services })
            })

        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=6`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType6: services })
            })

        axios.get(`/services/getServiceByRestaurantId?restaurantId=${restaurantId}&categoryId=7`)
            .then(res => {
                let services = res.data;
                // this.modifiedService(services);
                this.setState({ serviceType7: services })
            })
    }

    render() {
        const { serviceType1, serviceType2, serviceType3, serviceType4,
            serviceType5, serviceType6, serviceType7
        } = this.state;
        const restaurantId = this.props.match.params.restaurantId;

        return (
            <div>
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}`}  >Nhà hàng</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/menu`}  >Thực đơn</Link>
                    </NavItem>
                    <NavItem>
                        <Link to={`/restaurant-detail/${restaurantId}/combo`}  >Combo</Link>
                    </NavItem>
                    <NavItem className="active">
                        <Link to={`/restaurant-detail/${restaurantId}/service`}>Dịch vụ</Link>
                    </NavItem>
                </Nav>
                <Cart restaurantId={this.props.match.params.restaurantId}/>
                <div className="services">
                    <div className="list-services">
                        <Container className="list-dishes-title">Trang trí </Container>
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
                                    {serviceType1.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">Ban nhạc </Container>
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
                                    {serviceType2.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">Vũ đoàn </Container>
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
                                    {serviceType3.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">Ca sĩ </Container>
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
                                    {serviceType4.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">MC (Dẫn chương trình) </Container>
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
                                    {serviceType5.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">Quay phim - chụp ảnh </Container>
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
                                    {serviceType6.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >

                    <div className="list-services">
                        <Container className="list-dishes-title">Xe cưới </Container>
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
                                    {serviceType7.map((service, index) => {
                                        return <div key={index}>
                                            <ServiceItem service={service} index={index} />
                                        </div>
                                    })}
                                </Carousel>
                            </Row>
                        </Container>
                    </div >
                </div>

                <Footer />
            </div>
        )
    }
}
