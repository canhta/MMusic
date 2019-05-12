import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TextAuth from '../../hoc/TextAuth';
import { loginUser } from '../../../actions/auth.action';
class Register extends Component {
  static propTypes = {
    prop: PropTypes
  };
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errors: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }
  componentWillReceiveProps(nextPops) {
    if (nextPops.auth.isAuthenticated) {
      this.props.history.push('/');
    }
    if (nextPops.errors) {
      this.setState({ errors: nextPops.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      username: this.state.username,
      password: this.state.password
    };
    this.props.loginUser(userData);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { errors, username, password } = this.state;
    return (
      <div id="login-box">
        <div className="left">
          <h1>Sign in</h1>
          <form noValidate onSubmit={this.onSubmit}>
            <TextAuth
              type="text"
              onChange={this.onChange}
              name="username"
              value={username}
              placeholder="Username"
            />

            <TextAuth
              type="password"
              onChange={this.onChange}
              name="password"
              value={password}
              placeholder="Password"
            />

            {errors.login && (
              <div className="invalid-feedback" style={{ display: 'block' }}>
                {errors.login}
              </div>
            )}
            <input type="submit" name="signup_submit" value="Login now" />
          </form>
        </div>

        <div className="right">
          <Link to="/register">
            <button className="social-signin twitter">
              Create new account
            </button>
          </Link>
          <button className="social-signin facebook">
            Log in with facebook
          </button>
          <button className="social-signin google">Log in with Google+</button>
        </div>
        <div className="or">OR</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

const mapDispatchToProps = { loginUser };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register);
