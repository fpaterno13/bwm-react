const Rental = require('./models/rental');
const User = require('./models/user');
const Booking = require('./models/booking');
const fakeDbData = require('./data.json');

class FakeDb {
  constructor() {
    this.rentals = fakeDbData.rentals;
    this.users = fakeDbData.users;

    
  }

  pushDataToDb() {
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);

    this.rentals.forEach((rental) => {
      const newRental = new Rental(rental);
      newRental.user = user;

      user.rentals.push(newRental);
      newRental.save();
    });

    user.save();
    user2.save();
  }

  async seedDb() {
    //primero el clean para no insertar lo mismo dos veces (borra todo) y despues el push. 
    await this.cleanDb();
    this.pushDataToDb();
  }

  //async y await: se encargan de que primero se haga el clean de la BD y despues siga la ejecucion
  async cleanDb() {
    await User.remove({});
    await Rental.remove({});
    await Booking.remove({});
  }
}

module.exports = FakeDb;
