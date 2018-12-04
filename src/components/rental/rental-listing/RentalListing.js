import React from 'react';
import { RentalList } from './RentalList';
import { connect } from 'react-redux';
import * as actions from '../../../actions';

class RentalListing extends React.Component {

    //setea el action
    componentWillMount() {
        this.props.dispatch(actions.fetchRentals());
    }

    render() {
        return (
            <section id='rentalListing'>
                <h1 className='page-title'>Your Home All Around the World</h1>
                <RentalList rentals={this.props.rentals} />
            </section>
        )
    }
}

//2. se llama a esta funcion en donde pasa lo que tenes en State a Props para poder acceder arriba. 
function mapStateToProps(state) {
    return {
        rentals: state.rentals.data
    }
}

//1. entras por default aca. en State tenes todos los rentals que cargaste en App.js. el (RentalList) del final hace
//que esta clase pueda acceder al Store
export default connect(mapStateToProps)(RentalListing)