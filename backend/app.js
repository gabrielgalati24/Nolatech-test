import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import employeeRouter from './routes/employee.js';
import evaluationRouter from './routes/evaluation.js';
import feedbackRouter from './routes/feedback.js';
import reportRouter from './routes/report.js';
import morgan from 'morgan';
import mongoose from 'mongoose'; 
import dotenv from 'dotenv';
import YAML from 'yamljs';  
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler.js';

const swaggerDocument = YAML.load('./swagger.yaml');
dotenv.config();


const app = express();
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/employees', employeeRouter);
app.use('/api/evaluations', evaluationRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/reports', reportRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});
app.use(errorHandler);
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // respond with json
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get('env') === 'development' ? err : {}
  });
});

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/express-mongoose'; 

mongoose.connect(mongoUrl)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message);
  });


export default app; 
