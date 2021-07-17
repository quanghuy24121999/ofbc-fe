import { Component } from "react";
import firebase from "../config/firebase";
import {
    Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import axios from "axios";

import TopMenu from '../components/common/topMenu';
import { Notify } from '../common/notify';
import { validatePassword, validatePhoneNumber, validateUsername } from "../common/validate";

let recap = null;
let event = '';
let phoneCapcha = '';
class register extends Component {
    constructor() {
        super();

        this.state = {
            name: "",
            phoneNumber: "",
            password: "",
            rePassword: "",
            code: "",
        }

        this.onchangeName = this.onchangeName.bind(this);
        this.onchangePhoneNumber = this.onchangePhoneNumber.bind(this);
        this.onchangePassword = this.onchangePassword.bind(this);
        this.onchangeRePassword = this.onchangeRePassword.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onchangeCode = this.onchangeCode.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
    }

    onchangeName(e) {
        this.setState({
            name: e.target.value
        })
    }

    onchangePhoneNumber(e) {
        this.setState({
            phoneNumber: e.target.value
        });
    }

    onchangePassword(e) {
        this.setState({
            password: e.target.value
        });
    }

    onchangeRePassword(e) {
        this.setState({
            rePassword: e.target.value
        });
    }

    onchangeCode(e) {
        this.setState({
            code: e.target.value
        });
    }

    validateConfirmPassword() {
        const { password, rePassword } = this.state;

        if (validatePassword(password)) {
            if (password !== rePassword) {
                Notify("Mật khẩu không khớp !", "error", "top-right");
                return false;
            } else {
                return true;
            }
        } else {
            Notify('Mật khẩu phải ít nhất 3 kí tự và không bao gồm khoảng trắng', 'error', 'top-right')
        }
    }

    handleClick(e) {
        e.preventDefault();

        if (validateUsername(this.state.name)) {
            if (validatePhoneNumber(this.state.phoneNumber)) {
                const phone = '+84' + this.state.phoneNumber.substring(1, this.state.phoneNumber.length);
                axios.get('/users/findByPhoneNumber/' + phone)
                    .then(res => {
                        if (res.data === null || res.data === '') {
                            if (this.validateConfirmPassword() === true) {
                                let recapcha = new firebase.auth.RecaptchaVerifier("recaptcha");
                                firebase.auth().signInWithPhoneNumber(phone, recapcha)
                                    .then(function (e) {
                                        recap = recapcha;
                                        event = e;
                                        phoneCapcha = phone;

                                        document.getElementById('verify-code').style.display = "flex";
                                        document.getElementById('recaptcha').style.display = "none";
                                        document.getElementById('btn-forget-password').style.display = "none";
                                    }).catch((error) => {
                                        recapcha.clear();
                                        console.log(error);
                                        Notify("Lỗi hệ thống !", "error", "top-right");
                                    });
                            }
                        } else {
                            Notify("Số điện thoại đã tồn tại !", "error", "top-right");
                        }
                    });
            } else {
                Notify('Số điện thoại của bạn không đúng định dạng', 'error', 'top-right');
            }
        } else {
            Notify('Tên của bạn quá dài', 'error', 'top-right');
        }
    }

    verifyCode(phoneCapcha, recapcha, e) {
        if (this.state.code !== '') {
            let code = this.state.code;
            let password = this.state.password;
            let name = this.state.name;
            if (code === null || code === '') return;

            e.confirm(code)
                .then(function (result) {
                    axios.post('/users/register', {
                        name: name.trim(),
                        phoneLogin: phoneCapcha,
                        password: password,
                        phoneNumber: phoneCapcha
                    })
                    Notify("Đăng ký thành công !", "success", "top-right");
                    recapcha.clear();
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                    Notify("Đăng ký thất bại !", "error", "top-right");
                    recapcha.clear();
                    window.location.reload();
                });
        } else {
            Notify("Vui lòng nhập mã OTP !", "error", "top-right");
        }
    }

    render() {
        let { name, phoneNumber, password, rePassword } = this.state;

        return (
            <div className="container">
                <TopMenu />
                <Form className="form-register" inline
                    onSubmit={this.handleClick}
                >
                    <div className="title-register">Đăng ký</div>
                    <FormGroup>
                        <Label for="name">
                            <b>Họ và tên <span className="require-icon">*</span></b>
                        </Label>
                        <Input
                            type="text"
                            name="Name"
                            id="name"
                            placeholder="Họ và tên "
                            value={name}
                            onChange={this.onchangeName}
                            required="required"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="phone-number" hidden>
                            <b>Số điện thoại <span className="require-icon">*</span></b>
                        </Label>
                        <div className="phone-number-input">
                            {/* <span className="prefix-phone-input">(+84)</span> */}
                            <Input
                                className="input-phone-number"
                                type="tel"
                                name="phoneNumber"
                                id="phone-number"
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={this.onchangePhoneNumber}
                                required="required"
                            />
                        </div>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">
                            <b>Mật khẩu <span className="require-icon">*</span></b>
                        </Label>
                        <Input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={this.onchangePassword}
                            required="required"
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="re-password">
                            <b>Nhập lại mật khẩu <span className="require-icon">*</span></b>
                        </Label>
                        <Input
                            type="password"
                            name="rePassword"
                            id="re-password"
                            placeholder="Nhập lại mật khẩu"
                            value={rePassword}
                            onChange={this.onchangeRePassword}
                            required="required"
                        // onBlur={this.onBlurRePassword(password, rePassword)}
                        />
                    </FormGroup>
                    <div id="recaptcha"></div>
                    <Form id="verify-code">
                        <b><span className="require-icon">*</span></b>
                        <Input
                            type="text"
                            id="code"
                            onChange={this.onchangeCode}
                            value={this.state.code}
                            required="required"
                            placeholder="Nhập mã OTP"
                        />
                        <Button
                            id="btn-code"
                            color="primary"
                            onClick={() => this.verifyCode(phoneCapcha, recap, event)}
                        >
                            Xác nhận
                        </Button>
                    </Form>
                    <Input
                        type="submit"
                        value="Đăng ký"
                        className="btn-register btn btn-success btn-forget-password"
                        id="btn-forget-password"
                    />
                </Form>
            </div>
        );
    }
}

export default register;
