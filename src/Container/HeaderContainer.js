import React from "react";
import { connect } from "react-redux";
import * as axios from "axios";

import { setAuthUserData } from "../redux/auth-reducer";
import { Header } from "../components/Header/Header";

class HeaderContainer extends React.Component {
  componentDidMount() {
    axios
      .get(`https://social-network.samuraijs.com/api/1.0/auth/me`, {
        withCredentials: true,
      })
      //  .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        if (response.data.resultCode === 0) {
          let { id, email, login } = response.data.data;
          this.props.setAuthUserData(id, email, login);
        }
      });
  }

  render() {
    return <Header {...this.props} />;
  }
}
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  login: state.auth.login,
});
const mapDispatchToProps = {
  setAuthUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);
