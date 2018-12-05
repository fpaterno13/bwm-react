const express = require('express');
const router = express.Router();
const Rental = require('../models/rental');
const User = require('../models/user');
const UserCrtl = require('../controllers/user');
const MongooseHelpers = require("../helpers/mongoose");

//UserCrtl.authMiddleware se encarga de hacer la validacion del token, se llama en el 2do parametro. si esta ok sigue con la callback function, sino devuelve error
router.get('/secret', UserCrtl.authMiddleware, function (err, res) { //solo se usa para testing, no se llama nunca 
  res.json({ "secret": true });
});

router.get('/manage', UserCrtl.authMiddleware, function (req, res) {
  const user = res.locals.user;

  Rental.where({ user }).populate('bookings').exec(function (err, foundRentals) {
    if (err) {
      return res.status(422).send({ errors: MongooseHelpers.normalizeErrors(err.errors) });
    }

    return res.json(foundRentals);
  });
});

router.get('/:Id', function (req, res) {
  const rentalId = req.params.Id;

  Rental.findById(rentalId).populate('user', 'username -_id').populate('bookings', 'startAt endAt -_id').exec(function (err, foundRental) { //dentro del populate especifico que propiedades quiero, asi no traigo todo
    if (err) {
      return res.status(422).send({ errors: [{ title: 'Rental Error!', detail: "Could not find rental" }] });
    }
    return res.json(foundRental);
  });
});

router.get('', function (req, res) {
  const city = req.query.city; //Se fija si hay alguna ciudad como query parameter
  const query = city ? { city: city.toLowerCase() } : {}; //Se utiliza en los .find de abajo. si hay city, filtra los rentals por ciudad, sino trae todos. 

  Rental.find(query).select('-bookings').exec(function (err, foundRentals) {
    if (err) {
      return res.status(422).send({ errors: MongooseHelpers.normalizeErrors(err.errors) });
    }

    if (city && foundRentals.length === 0) {
      return res.status(422).send({ errors: [{ title: 'No Rentals found', detail: 'There are no rentals for city ' + city }] });
    }

    return res.json(foundRentals);
  }); //traigo todos los rentals para listar, pero al agregarle el select, le digo que no me traiga los bookigs, por un tema de performance
});

router.post('', UserCrtl.authMiddleware, function (req, res) {
  const { title, city, street, category, image, shared, bedrooms, description, dailyRate } = req.body;
  const user = res.locals.user;
  const rental = new Rental({ title, city, street, category, image, shared, bedrooms, description, dailyRate });
  rental.user = user;

  Rental.create(rental, function (err, newRental) {
    if (err) {
      return res.status(422).send({ errors: MongooseHelpers.normalizeErrors(err.errors) });
    }
    User.update({ _id: user.id }, { $push: { rentals: newRental } }, function () { });
    return res.json(newRental);
  });
});

router.delete('/:id', UserCrtl.authMiddleware, function (req, res) {
  const user = res.locals.user; //sesion

  //trae los rentals que pertenecen a mi ID, y que tengan bookings posterior a la fecha de hoy. tiene active bookings.
  Rental.findById(req.params.id).populate('user', '_id').populate({ path: 'bookings', select: 'startAt', match: { startAt: { $gt: new Date() } } }).exec(function (err, foundRental) {
    if (err) {
      return res.status(422).send({ errors: MongooseHelpers.normalizeErrors(err.errors) });
    }

    if (user.id !== foundRental.user.id) {
      return res.status(422).send({ errors: [{ title: 'Invalid user!', detail: 'Your are not rental owner!' }] });
    }

    if (foundRental.bookings.length > 0) {
      return res.status(422).send({ errors: [{ title: 'Active bookings!', detail: 'Cannot delete rental with active bookings!' }] });
    }

    foundRental.remove(function (err) {
      if (err) {
        return res.status(422).send({ errors: MongooseHelpers.normalizeErrors(err.errors) });
      }
      return res.json({ 'status': 'deleted' });
    });
  });
});



module.exports = router;
