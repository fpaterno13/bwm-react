import React from 'react';
import { RentalList } from './RentalList';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { toUpperCase } from '../../../helpers/index'

class RentalSearchListing extends React.Component {
    constructor() {
        super();

        this.state = {
            searchedCity: ''
        }
    }

    //este metodo se llama en el search. cuando hago un search por primera vez va bien, pero cuando vuelvo a hacerlo
    //no me actualiza la info. este metodo la actualiza. 
    componentDidUpdate(prevProps) {
        const currentUrlParam = this.props.match.params.city;
        const prevUrlParam = prevProps.match.params.city;

        if (currentUrlParam !== prevUrlParam) {
            this.searchRentalsByCity();
        }
    }

    componentWillMount() {
        this.searchRentalsByCity();
    }

    searchRentalsByCity() {
        const searchedCity = this.props.match.params.city;
        this.setState({ searchedCity });

        this.props.dispatch(actions.fetchRentals(searchedCity));
    }

    renderTitle() {
        const { errors, data } = this.props.rentals;
        const { searchedCity } = this.state;
        let title = ''; 

        if (errors.length > 0) {
            title = errors[0].detail;
        }

        if (data.length > 0) {
            title = `Your home in city of ${toUpperCase(searchedCity)}`;
        }

        return <h1 className='page-title'>{title}</h1>
    }

    render() {
        return (
            <section id='rentalListing'>
                {this.renderTitle()}
                <RentalList rentals={this.props.rentals.data} />
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        rentals: state.rentals
    }
}

export default connect(mapStateToProps)(RentalSearchListing)