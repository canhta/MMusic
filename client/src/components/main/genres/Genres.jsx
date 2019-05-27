import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListGenres from './ListGenres';
import { getGenres } from '../../../actions/genre.action';
import { Link } from 'react-router-dom';
import Circular from '../../common/Progress/Circular';
class Genres extends Component {
  componentDidMount() {
    this.props.getGenres(); // cập nhật lúc đầu
  }

  render() {
    const { genres, loading } = this.props.genre;
    let GenresContent;
    if (genres === null || loading) {
      GenresContent = <Circular />;
    } else {
      GenresContent = <ListGenres genres={genres} />;
    }
    return (
      <div className="container">
        <h1 className="text-center title">
          Genres <Link to="/create-genre"> New</Link>
        </h1>
        <div className="row">{GenresContent}</div>
      </div>
    );
  }
}

Genres.propTypes = {
  getGenres: PropTypes.func.isRequired,
  genre: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  genre: state.genre
});

const mapDispatchToProps = {
  getGenres
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Genres);
