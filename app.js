require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRouter = require('./routes/authRoute');
const userRouter = require('./routes/userRoute');
const serviceRouter = require('./routes/serviceRoute');
const authenticate = require('./middlewares/authenticate');
const notFoundMiddleware = require('./middlewares/notFound');
const errorMiddleware = require('./middlewares/error');

const { sequelize } = require('./models');
// sequelize.sync({ force: true });

const app = express();
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRouter);
app.use('/users', authenticate, userRouter);
app.use('/services', serviceRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('server is running on port ' + port));
