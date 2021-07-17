import { Component } from 'react';
import {
  Form, FormGroup, Label, Input
} from 'reactstrap';
import { Link, Redirect } from "react-router-dom";
import axios from 'axios';

import TopMenu from '../components/common/topMenu';
import { Notify } from '../common/notify';
import { validatePhoneNumber } from '../common/validate';

class login extends Component {
  constructor(props) {
    super();
    this.state = {
      phoneLogin: "",
      password: "",
      redirect: false,
      redirectAdmin: false
    }

    this.onchangePhoneLogin = this.onchangePhoneLogin.bind(this);
    this.onchangePassword = this.onchangePassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onchangePhoneLogin(e) {
    this.setState({
      phoneLogin: e.target.value
    });
  }

  onchangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onSubmit(e) {
    e.preventDefault();
    if (validatePhoneNumber(this.state.phoneLogin.trim())) {
      const phone = '+84' + this.state.phoneLogin.substring(1, this.state.phoneLogin.length);
      axios.post('/users/login', {
        phoneLogin: phone,
        password: this.state.password
      })
        .then(res => {
          if (res.data.user.role.id === 1) {
            Notify("Đăng nhập thành công !", "success", "top-right");
            localStorage.setItem('currentAdmin', phone);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('setTime', new Date().getTime());
            this.setState({
              redirectAdmin: true
            });
          } else {            
            localStorage.setItem('currentUser', phone);
            localStorage.setItem('userId', '');
            localStorage.setItem('resId', '');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('setTime', new Date().getTime());
            this.setState({
              redirect: true
            });
          }
        }).catch((error) => {
          console.log(error)
          Notify("Tài khoản hoặc mật khẩu không chính xác !", "error", "top-right");
        });
    } else {
      Notify('Số điện thoại của bạn không đúng định dạng', 'error', 'top-right');
    }
  }

  render() {
    let { phoneLogin, password, redirect, redirectAdmin } = this.state;
    if (redirect === true) {
      return <Redirect to="/" />;
    } else if (redirectAdmin === true) {
      return <Redirect to="/admin" />;
    } else
      return <div className="container">
        <TopMenu />
        <Form className="form-login" inline
          onSubmit={this.onSubmit}
        >
          <div className="login-heading mb-4">Đăng nhập</div>
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0 form-group">
            <Label for="phone-number" hidden>
              <b>
                Số điện thoại <span className="require-icon">*</span>
              </b></Label>
            <div className="phone-number-input">
              {/* <span className="prefix-phone-input">(+84)</span> */}
              <Input
                className="input-phone-number"
                type="text"
                name="phoneLogin"
                id="phone-number"
                placeholder="Số điện thoại"
                value={phoneLogin}
                onChange={this.onchangePhoneLogin}
                required="required"
              />
            </div>
          </FormGroup>
          {' '}
          <FormGroup className="mb-2 mr-sm-2 mb-sm-0 form-group">
            <Label for="examplePassword" className="mr-sm-2 ">
              <b>Mật khẩu <span className="require-icon">*</span></b>
            </Label>
            <Input
              type="password"
              name="password"
              id="examplePassword"
              placeholder="Mật khẩu"
              value={password}
              onChange={this.onchangePassword}
              required="required"
            />
          </FormGroup>
          <Input type="submit" value="Đăng nhập" className="btn-login btn btn-success" />

          <div className="link-form">
            <Link to="/forget-password" className="link-forget-password">Quên mật khẩu ?</Link>
            <Link to="/register" className="link-register">Đăng kí tài khoản mới</Link>
          </div>
        </Form>
      </div>
  }
}

export default login;
