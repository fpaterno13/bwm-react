import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { RentalDetailInfo } from './RentalDetailInfo';
import  Booking  from '../../booking/Booking';

class RentalDetail extends React.Component {

    componentWillMount() {
        const rentalId = this.props.match.params.id;

        this.props.dispatch(actions.fetchRentalById(rentalId));
    }

    render() {
        const rental = this.props.rental;

        if (rental.title) {
            return (
                <section id='rentalDetails'>
                    <div className='upper-section'>
                        <div className='row'>
                            <div className='col-md-6'>
                                <img src={rental.image} alt=''></img>
                            </div>
                            <div className='col-md-6'>
                                <img src={rental.image} alt=''></img>
                            </div>
                        </div>
                    </div>
                    <div className='details-section'>
                        <div className='row'>
                            <div className='col-md-8'>
                                <RentalDetailInfo rental={rental} />
                            </div>
                            <div className='col-md-4'>
                                <Booking rental={rental}/>
                            </div>
                        </div>
                    </div>
                </section>

            )
        } else {
            return (
                < h1 >loading</h1 >
            )
        }
    }
}

function mapStateToProps(state) {
    return {
        rental: state.rental.data
    }
}

export default connect(mapStateToProps)(RentalDetail)