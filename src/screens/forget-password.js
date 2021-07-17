import axios from 'axios';
import React, { Component } from 'react'
import {
    Form, FormGroup, Label, Input, Button
} from 'reactstrap';
import { ToastContainer } from 'react-toastify';

import firebase from "../config/firebase";
import TopMenu from '../components/common/topMenu';
import { Notify } from '../common/notify';
import { validatePassword } from '../common/validate';

let userId = '';
let recap = null;
let event = '';
export default class forgetPassword extends Component {
    constructor() {
        super();

        this.state = {
            phoneNumber: "",
            password: "",
            rePassword: "",
            code: "",
        }

        this.onchangePhoneNumber = this.onchangePhoneNumber.bind(this);
        this.onchangePassword = this.onchangePassword.bind(this);
        this.onchangeRePassword = this.onchangeRePassword.bind(this);
        this.onchangeCode = this.onchangeCode.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.validateConfirmPassword = this.validateConfirmPassword.bind(this);
        this.verifyCode = this.verifyCode.bind(this);
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

    updatePassword() {
        axios.patch('/update/' + this.state.userId, {
            "password": this.state.password
        })
    }

    handleClick(e) {
        e.preventDefault();

        let phoneNumber = this.state.phoneNumber;
        phoneNumber = '+84' + phoneNumber.substring(1, phoneNumber.length);
        axios.get('/users/findByPhoneNumber/' + phoneNumber)
            .then(res => {
                if (res.data !== null && res.data !== '') {
                    if (this.validateConfirmPassword() === true) {
                        let recapcha = new firebase.auth.RecaptchaVerifier("recaptcha");
                        firebase.auth().signInWithPhoneNumber(phoneNumber, recapcha)
                            .then(function (e) {
                                userId = res.data.id;
                                recap = recapcha;
                                event = e;

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
                    Notify("Số điện thoại không đúng !", "error", "top-right");
                }
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

    verifyCode(userId, recapcha, e) {
        if (this.state.code !== '') {
            let code = this.state.code;
            let password = this.state.password;
            if (code === null || code === '') return;

            e.confirm(code)
                .then(function (result) {
                    axios.patch('/users/update/' + userId, {
                        "password": password
                    }).then(res => {
                        Notify("Đổi mật khẩu thành công !", "success", "top-right");
                        recapcha.clear();
                        window.location.reload();
                    })
                })
                .catch((error) => {
                    console.log(error);
                    Notify("Mã OTP không chính xác !", "error", "top-right");
                    recapcha.clear();
                    window.location.reload();
                });
        } else {
            Notify("Vui lòng nhập mã OTP !", "error", "top-right");
        }
    }

    render() {
        let { phoneNumber, password, rePassword } = this.state;

        return (
            <div className="container">
                <TopMenu />
                <Form inline className="form-forget-password" onSubmit={this.handleClick}>
                    <div className="title-foget-password">Quên mật khẩu</div>
                    <FormGroup>
                        <Label for="phone-number">
                            <b>Số điện thoại <span className="require-icon">*</span></b>
                        </Label>
                        <div className="phone-number-input">
                            {/* <span className="prefix-phone-input">(+84)</span> */}
                            <Input
                                className="input-phone-number"
                                type="text"
                                name="phoneNumber"
                                id="phone-number"
                                placeholder="Số điện thoại"
                                value={phoneNumber}
                                onChange={this.onchangePhoneNumber}
                                required="required"
                            />
                        </div>
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="new-password">
                            <b>Mật khẩu mới <span className="require-icon">*</span></b>
                        </Label>
                        <Input
                            type="password"
                            name="newPassword"
                            id="new-password"
                            placeholder="Mật khẩu mới"
                            value={password}
                            onChange={this.onchangePassword}
                            required="required"
                        />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                        <Label for="re-new-password">
                            <b>Nhập lại mật khẩu mới <span className="require-icon">*</span></b>
                        </Label>
                        <Input
                            type="password"
                            name="reNewPassword"
                            id="re-new-password"
                            placeholder="Nhập lại mật khẩu mới"
                            value={rePassword}
                            onChange={this.onchangeRePassword}
                            required="required"
                        />
                    </FormGroup>
                    {' '}
                    <div id="recaptcha"></div>

                    <Input
                        type="submit"
                        value="Gửi mã OTP"
                        className="btn-register btn btn-success btn-forget-password"
                        id="btn-forget-password"
                    />
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
                            onClick={() => this.verifyCode(userId, recap, event)}
                        >
                            Xác nhận
                        </Button>
                    </Form>
                </Form>

                <ToastContainer />
            </div>
        )
    }
}
