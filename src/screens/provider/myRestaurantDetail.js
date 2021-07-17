import React, { Component } from 'react';
import {
    Row, Col, NavItem, Nav, Container,
    Input, Label, Button, Modal, ModalHeader, ModalBody,
    ModalFooter, CardImg, Alert
} from 'reactstrap';
import subVn from "sub-vn";
import { Link } from 'react-router-dom';
import ImageUploading from "react-images-uploading";
import axios from 'axios';

import TopMenu from '../../components/common/topMenu';
import Footer from '../../components/common/footer';
import RestaurantAvater from '../../images/default-restaurant.png';
import { validateCapacity, validateEmpty, validatePhoneNumber, validateUsername } from '../../common/validate';
import { Notify } from '../../common/notify';

let restaurantId = '';
export default class myRestaurantDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            provinces: subVn.getProvinces(),
            districts: [],
            types: [],
            status: [],
            images: [],
            user: {},
            modal: false,
            modal1: false,

            restaurantName: '',
            restaurantAvatar: '',
            restaurantCertificate: '',
            restaurantType: {
                id: '',
                name: ''
            },
            restaurantStatus: {
                id: '',
                name: ''
            },
            provinceName: '',
            provinceCode: '',
            districtName: '',
            districtCode: '',
            restaurantAddress: '',
            restaurantPhone: '',
            restaurantSize: '',
            restaurantDescription: '',
            restaurantBusinessCode: '',
        }

        this.onProvinceClick = this.onProvinceClick.bind(this);
        this.onDistrictClick = this.onDistrictClick.bind(this);
        this.onChangeRestaurantName = this.onChangeRestaurantName.bind(this);
        this.onChangeRestaurantType = this.onChangeRestaurantType.bind(this);
        this.onChangeRestaurantStatus = this.onChangeRestaurantStatus.bind(this);
        this.onChangeRestaurantAddress = this.onChangeRestaurantAddress.bind(this);
        this.onChangeRestaurantPhone = this.onChangeRestaurantPhone.bind(this);
        this.onChangeRestaurantSize = this.onChangeRestaurantSize.bind(this);
        this.onChangeRestaurantDescription = this.onChangeRestaurantDescription.bind(this);
        this.onSubmitUpdate = this.onSubmitUpdate.bind(this);
        this.toggle = this.toggle.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    findProvinceAndDistrictCode(provinceName, districtName) {
        let districts = [];
        this.state.provinces.forEach(province => {
            if (provinceName === province.name) {
                this.setState({ provinceCode: province.code })
                districts = subVn.getDistrictsByProvinceCode(province.code);
                districts.forEach(district => {
                    if (districtName === district.name) {
                        this.setState({
                            districts: districts,
                            districtCode: district.code,
                            districtName: district.name
                        })
                    }
                })
            }
        });
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        restaurantId = localStorage.getItem('resId');

        axios.get(`/restaurants/providerTypes`)
            .then(res => {
                this.setState({ types: res.data })
            })

        axios.get(`/users/findByPhoneNumber/${localStorage.getItem("currentUser")}`)
            .then(res => {
                this.setState({ user: res.data })
            })

        axios.get(`/images/getImagesRestaurant?restaurantId=${restaurantId}`)
            .then(res => {
                let tempArr = res.data;
                tempArr.forEach(item => {
                    if (item.image_type === 'Avatar') {
                        this.setState({ restaurantAvatar: item.image_id });
                    } else if (item.image_type === 'Certificate') {
                        this.setState({ restaurantCertificate: item.image_id });
                    }
                })

            })

        axios.get(`/restaurants/getRestaurantById?restaurantId=${restaurantId}`)
            .then(res => {
                let restaurant = res.data;
                this.findProvinceAndDistrictCode(restaurant.province, restaurant.district);

                this.setState({
                    restaurantName: restaurant.restaurantName,
                    restaurantType: {
                        id: restaurant.providerType.id,
                        name: restaurant.providerType.name
                    },
                    restaurantStatus: {
                        id: restaurant.status.id,
                        name: restaurant.status.name
                    },
                    provinceName: restaurant.province,
                    districtName: restaurant.district,
                    restaurantAddress: restaurant.address,
                    restaurantPhone: restaurant.phoneNumber,
                    restaurantSize: restaurant.size,
                    restaurantDescription: restaurant.description,
                    restaurantBusinessCode: restaurant.bussinessLicenseId
                }, () => {
                    let statusName = this.state.restaurantStatus.name;
                    let tempObj = { id: '', name: '' }
                    let tempArr = [];
                    let count = 0;

                    if (statusName === 'pending') {
                        tempObj.id = 3;
                        tempObj.name = 'Chờ duyệt';
                        this.setState({
                            restaurantStatus: tempObj,
                            status: tempArr
                        })
                        tempArr.push(tempObj);
                        count = count + 1;
                    }

                    if (count === 0) {
                        let tempObj1 = { id: 1, name: 'Đang hoạt động' };
                        let tempObj2 = { id: 2, name: 'Ngừng hoạt động' };
                        tempArr.push(tempObj1);
                        tempArr.push(tempObj2);

                        if (statusName === 'active') {
                            this.setState({ restaurantStatus: tempObj1 });
                        }
                        if (statusName === 'inactive') {
                            this.setState({ restaurantStatus: tempObj2 });
                        }

                        this.setState({ status: tempArr });
                    }
                })
            })
    }

    onChangeRestaurantName(e) {
        this.setState({ restaurantName: e.target.value });
    }

    onChangeRestaurantType(e) {
        let index = e.nativeEvent.target.selectedIndex;
        let name = e.nativeEvent.target[index].text;
        this.setState({
            restaurantType: {
                id: e.target.value,
                name: name
            }
        });
    }

    onChangeRestaurantStatus(e) {
        let index = e.nativeEvent.target.selectedIndex;
        let id = e.target.value;
        let name = e.nativeEvent.target[index].text;
        let nameStatus = '';

        if (name === 'Đang hoạt động') {
            nameStatus = 'active';
        } else if (name === 'Ngừng hoạt động') {
            nameStatus = 'inactive';
        } else if (name === 'Chờ duyệt') {
            nameStatus = 'pending';
        }

        this.setState({
            restaurantStatus: {
                id: id,
                name: nameStatus
            }
        });
    }

    onProvinceClick(event) {
        event.preventDefault();
        let provinceCode = event.target.value;
        this.setState({
            districts: subVn.getDistrictsByProvinceCode(provinceCode)
        });
        let index = event.nativeEvent.target.selectedIndex;
        let provinceName = event.nativeEvent.target[index].text;
        this.setState({
            provinceCode: provinceCode,
            provinceName: provinceName
        });
    }

    onDistrictClick(event) {
        event.preventDefault();
        let index = event.nativeEvent.target.selectedIndex;
        let districtName = event.nativeEvent.target[index].text;
        this.setState({
            districtName: districtName,
            districtCode: event.target.value
        });
    }

    onChangeRestaurantAddress(e) {
        this.setState({ restaurantAddress: e.target.value });
    }


    onChangeRestaurantPhone(e) {
        this.setState({ restaurantPhone: e.target.value });
    }

    onChangeRestaurantSize(e) {
        this.setState({ restaurantSize: e.target.value });
    }

    onChangeRestaurantDescription(e) {
        this.setState({ restaurantDescription: e.target.value });
    }

    checkRequire() {
        const { restaurantAddress, restaurantBusinessCode,
            restaurantDescription, restaurantName, restaurantPhone, restaurantSize,
        } = this.state;
        let checkbox = '';
        checkbox = document.getElementById('cb-accept');
        if (checkbox !== '' && checkbox !== undefined) {
            if (!validateEmpty(restaurantName)) {
                Notify('Tên nhà hàng không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantAddress)) {
                Notify('Địa chỉ không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantPhone)) {
                Notify('Số điện thoại không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantSize)) {
                Notify('Sức chứa không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantBusinessCode)) {
                Notify('Mã giấy phép kinh doanh không được để trống', 'error', 'top-right');
                return false;
            } else if (!validateEmpty(restaurantDescription)) {
                Notify('Mô tả không được để trống', 'error', 'top-right');
                return false;
            } else {
                return true;
            }
        }
    }

    validate() {
        const { restaurantAddress, restaurantName,
            restaurantPhone, restaurantSize
        } = this.state;

        if (this.checkRequire()) {
            if (!validateUsername(restaurantName)) {
                Notify('Tên nhà hàng quá dài (nhỏ hơn 100 ký tự)', 'error', 'top-right');
                return false;
            } else if (!validateUsername(restaurantAddress)) {
                Notify('Tên địa chỉ quá dài (nhỏ hơn 100 ký tự)', 'error', 'top-right');
                return false;
            } else if (!validatePhoneNumber(restaurantPhone)) {
                Notify('Số điện thoại sai định dạng', 'error', 'top-right');
                return false;
            } else if (!validateCapacity(restaurantSize)) {
                Notify('Sức chứa quá lớn', 'error', 'top-right');
                return false;
            } else {
                return true;
            }
        }
    }

    onSubmitUpdate() {
        const {
            districtName, provinceName, restaurantAddress, restaurantDescription, user,
            restaurantName, restaurantPhone, restaurantSize, restaurantStatus, restaurantType,
        } = this.state;
        axios.post(`/restaurants/updateInforRestaurant`,
            {
                "id": restaurantId,
                "provider": user,
                "province": provinceName,
                "district": districtName,
                "address": restaurantAddress,
                "phoneNumber": restaurantPhone,
                "bussinessLicenseId": null,
                "restaurantName": restaurantName,
                "status": restaurantStatus,
                "description": restaurantDescription,
                "size": restaurantSize,
                "providerType": restaurantType
            }, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
        )
            .then(res => {
                this.toggle();
                Notify('Cập nhật thành công', 'success', 'top-right');
            })
    }

    toggle() {
        this.setState({ modal: !this.state.modal })
    }

    onChange = (imageList, addUpdateIndex) => {
        this.setState({ images: imageList });
    };

    updateImage() {
        let formData = new FormData();
        let imageId = this.state.restaurantAvatar;
        formData.append('file', this.state.images[0].file);
        document.getElementById('error-form4').style.display = "none";

        if (imageId === null || imageId === '') {
            axios.post(`/images/upload?userId=0&dishId=0&serviceId=0&comboId=0&restaurantId=${restaurantId}&promotionId=0&typeId=1`,
                formData, {
            }).then(res => {
                window.location.reload();
            }).catch(err => {
                document.getElementById('error-form4').style.display = "block";
            })
        } else {
            axios.post(`/images/update?imageId=${imageId}`,
                formData, {
            }).then(res => {
                window.location.reload();
            }).catch(err => {
                document.getElementById('error-form4').style.display = "block";
            })
        }
    }

    displayImage() {
        document.getElementById("user-image").style.display = "block";
    }

    render() {
        const { provinces, districts, types, status, provinceCode, districtCode,
            restaurantAddress, restaurantBusinessCode, restaurantDescription,
            restaurantName, restaurantPhone, restaurantSize, restaurantType, modal,
            modal1, restaurantStatus, restaurantAvatar, restaurantCertificate, images
        } = this.state;

        let image;
        if (restaurantAvatar === '') {
            image = <CardImg id="user-image" className="restaurant-profile-image" top src={RestaurantAvater} />
        } else {
            image = <CardImg id="user-image" className="restaurant-profile-image" top src={'/images/' + restaurantAvatar} />
        }

        return (
            <div className="myRes-detail">
                <TopMenu />
                <Nav pills className="restaurant-detail-nav container">
                    <NavItem className="active">
                        <Link to={`/users/profile/my-restaurant/detail`}>Thông tin</Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/image`
                            }}
                        >
                            Ảnh
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/menu`,
                                state: { restaurantId: localStorage.getItem('resId') }
                            }}
                        >
                            Thực đơn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/combo`
                            }}
                        >
                            Combo món ăn
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/service`
                            }}
                        >
                            Dịch vụ
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/promotion`
                            }}
                        >
                            Khuyến mãi
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link
                            onClick={() => {
                                localStorage.setItem('resId', '');
                                localStorage.setItem('resId', restaurantId)
                            }}
                            to={{
                                pathname: `/users/profile/my-restaurant/order`
                            }}
                        >
                            Đơn hàng
                        </Link>
                    </NavItem>
                </Nav>
                <Container className="myRes-detail-content">
                    <Row className="myRes-detail-content-row">
                        <Col lg="6" md="12" sm="12" className="myRes-detail-content-img">
                            <Row>
                                <Col lg="12" md="12" sm="12">
                                    <ImageUploading
                                        value={images}
                                        onChange={this.onChange}
                                        dataURLKey="data_url"
                                    >
                                        {({
                                            imageList,
                                            onImageUpdate,
                                            onImageRemove,
                                        }) => (
                                            <div className="upload__image-wrapper">
                                                {image}
                                                {imageList.map((image, index) => (
                                                    (document.getElementById("user-image").style.display = "none"),
                                                    (
                                                        <div key={index} className="image-item">
                                                            <CardImg className="restaurant-profile-image" top src={image.data_url} />
                                                            <Alert color="danger" id="error-form4" className="error-form">
                                                                Không thể tải ảnh lên, vui lòng chọn một ảnh khác !
                                                            </Alert>
                                                            <div className="image-item__btn-wrapper">
                                                                <Button color="success" onClick={() => this.updateImage()}>Lưu</Button>
                                                                <Button onClick={() => {
                                                                    onImageRemove(index); this.displayImage();
                                                                }}
                                                                >
                                                                    Hủy
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    )
                                                )
                                                )}

                                                <div className="btn-change-image" onClick={onImageUpdate}>Thay đổi ảnh</div>
                                            </div>
                                        )}
                                    </ImageUploading>
                                </Col>
                                <Col lg="12" md="12" sm="12">
                                    <CardImg id="user-image" className="restaurant-profile-image" top src={'/images/' + restaurantCertificate} />
                                    <h5 className="img-title">Giấy chứng nhận vệ sinh an toàn thực phẩm</h5>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg="6" md="12" sm="12" className="myRes-detail-content-info">
                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-name"><b>Tên nhà hàng <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="text"
                                        name="restaurant-name"
                                        id="restaurant-name"
                                        placeholder="Nhập tên nhà hàng"
                                        onChange={this.onChangeRestaurantName}
                                        value={restaurantName}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-name"><b>Loại hình <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="select"
                                        name="type"
                                        id="type"
                                        onChange={this.onChangeRestaurantType}
                                        value={restaurantType.id}
                                    >
                                        {types.map((type) => {
                                            return (
                                                <option key={type.id} value={type.id}>
                                                    {type.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-name"><b>Trạng thái <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="select"
                                        name="status"
                                        id="status"
                                        onChange={this.onChangeRestaurantStatus}
                                        value={restaurantStatus.id}
                                    >
                                        {status.map((status) => {
                                            return (
                                                <option key={status.id} value={status.id}>
                                                    {status.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="4">
                                    <Label for="citySelect"><b>Chọn tỉnh/ thành phố <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="8">
                                    <Input
                                        type="select"
                                        name="citySelect"
                                        id="citySelect"
                                        value={provinceCode}
                                        onChange={this.onProvinceClick}
                                    >
                                        {provinces.map((province) => {
                                            return (
                                                <option key={province.code} value={province.code}>
                                                    {province.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="4">
                                    <Label for="districtSelect"><b>Chọn quận/ huyện <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="8">
                                    <Input
                                        type="select"
                                        name="districtSelect"
                                        id="districtSelect"
                                        value={districtCode}
                                        onChange={this.onDistrictClick}
                                    >
                                        {districts.map((district) => {
                                            return (
                                                <option key={district.code} value={district.code}>
                                                    {district.name}
                                                </option>
                                            );
                                        })}
                                    </Input>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-address"><b>Địa chỉ <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="text"
                                        name="restaurant-address"
                                        id="restaurant-address"
                                        placeholder="Nhập địa chỉ của nhà hàng"
                                        onChange={this.onChangeRestaurantAddress}
                                        value={restaurantAddress}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-phoneNumber"><b>Số điện thoại <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="tel"
                                        name="restaurant-phoneNumber"
                                        id="restaurant-phoneNumber"
                                        placeholder="Nhập số điện thoại của nhà hàng"
                                        onChange={this.onChangeRestaurantPhone}
                                        value={restaurantPhone}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="3">
                                    <Label for="restaurant-size"><b>Sức chứa (Khách) <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="9">
                                    <Input
                                        type="number"
                                        name="restaurant-size"
                                        id="restaurant-size"
                                        min={1}
                                        placeholder="Nhập sức chứa của nhà hàng"
                                        onChange={this.onChangeRestaurantSize}
                                        value={restaurantSize}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="5">
                                    <Label for="restaurant-code-legal"><b>Mã giấy phép kinh doanh <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="7">
                                    <Input
                                        type="text"
                                        name="restaurant-code-legal"
                                        id="restaurant-code-legal"
                                        placeholder=""
                                        value={restaurantBusinessCode}
                                        readOnly={true}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col lg="2">
                                    <Label for="restaurant-description"><b>Mô tả <span className="require-icon">*</span></b></Label>
                                </Col>
                                <Col lg="10">
                                    <Input
                                        type="textarea"
                                        name="restaurant-description"
                                        id="restaurant-description"
                                        placeholder="Mô tả về nhà hàng"
                                        onChange={this.onChangeRestaurantDescription}
                                        value={restaurantDescription}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col className="update-restaurant">
                                    <Button className="btn-update-restaurant" onClick={() => {
                                        if (this.validate()) {
                                            this.toggle();
                                        }
                                    }} color="success">Cập nhật</Button>
                                </Col>
                            </Row>

                            <Modal isOpen={modal} toggle={this.toggle} className={``}>
                                <ModalHeader toggle={this.toggle}>Thông báo</ModalHeader>
                                <ModalBody>
                                    Bạn có chắc chắn cập nhật thông tin ?
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="success" onClick={this.onSubmitUpdate}>Có</Button>{' '}
                                    <Button color="secondary" onClick={this.toggle}>Trở lại</Button>
                                </ModalFooter>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
                <Footer />
            </div>
        )
    }
}
