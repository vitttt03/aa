const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const createError = require('http-errors');

// Import các route
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api');

const app = express();

// Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Sử dụng các router
app.use('/', indexRouter); // Route gốc
app.use('/users', usersRouter); // Route cho users
app.use('/api', apiRouter); // Route cho API

// Xử lý lỗi 404
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Đưa thông báo lỗi vào biến cục bộ, chỉ hiển thị lỗi chi tiết trong môi trường "development"
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render trang lỗi
  res.status(err.status || 500);
  res.render('error');
});

// Khởi động server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
