const express = require("express");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy; //adds username + password login support
// Strategy is the class that defines how the login should work..
const session = require("express-session");
const passport = require("passport"); //passport is used to handle user authentication in Express apps.
const flash = require("connect-flash"); // For storing temporary data like errors and successMessage

const App = express();
App.use(bodyParser.json());
App.use(express.urlencoded({extended: true}));
App.use(session({
    secret: 'factorise',
    resave: false,
    saveUninitialized: true
}));
App.use(passport.initialize()); // Initialize Our Pasport 
App.use(passport.session()); //Passport manage user sessions.
App.use(flash()); // allow to store temporary messages

// Define simple user object for demo purposes

const users = [{ id: 1, name: "test", password: "123344"}];
passport.use(new LocalStrategy( // checking credential form the user
    {usernameField: 'name'}, // change name to the default username
    (name, password, done) => { // done() callback you use to say if login passed or failed
        const user = users.find(u => u.name === name); // Checking if user name exist
        if(!user) return done(null, false, {message: "Incorect username"}); // if not retur nthis message
        //done(error, user, info) null means :no internal error 
        //user: If login fails, it's false.
        //Info(): optional message
        if(user.password !== password) return done(null, false, { message: 'Incorect password'});
        return done(null, user);

    }
));

passport.serializeUser((user, done) => {
    done(null, user.id); // save user Id in the session after user logged in
});
passport.deserializeUser((id, done) => {
    const user = users.find(u => u.id === id);
    done(null, user);
}); //fetch full user from stored ID

//Home page of our App
App.get('/', (req, res) => {
    res.send(
        '<h1>Welcome</h1><a href="/login">Login</a>'
    );
})
App.get('/login', (req, res) => {
    const error = req.flash("Error");
    res.send(
         `${error.length ? `<p style="color: red">${error}</p>`: ''}
           <form action="/login" method="post">
              <label>Username</label>
              <input type="text" name="name" required/>
              <label>Password</label>
              <input type="password" name="password" required/>
              <button type="submit">Login</button>
           </form>
          `);
});
App.post('/login', passport.authenticate('local',{ // checks if email and password is valid
    successRedirect: '/dashboard', //If the login is successful, the user will be redirected to /dashboard.
    failureRedirect: '/login',//If the login fails, the user will be redirected back to the login page (/login).
    failureFlash: true //This tells Passport to use flash messages for failure.
}));
// Dashboard Route
App.get('/dashboard' , (req, res)  => {
    if(!req.isAuthenticated()){
        return res.redirect('/login');
    }
    res.send(`<h1>Welcome to our dashboard, ${req.user.name}</h1>`);
});
App.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/')
    })
})
App.listen(3000, () => console.log('http://localhost:3000'));