import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import { session } from './middleware/session.js';
import quoteRouter from './routes/quote.router.js';
import userRouter from './routes/user.router.js';
import passport from './strategies/user.strategy.js';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(logger('dev'));

// Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('build'));

// Passport Session Configuration
app.use(session);

// Start Passport Sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/user', userRouter);
app.use('/api/quote', quoteRouter);

// Listen Server & Port
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
