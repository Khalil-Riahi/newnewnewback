
// const express = require('express');
// const User=require('./Models/User')
// const cors = require('cors');
// const cookieParser = require('cookie-parser');
// const app = express();
// const session = require('express-session')
// app.use(cookieParser());
// const passport = require('passport')
// app.use(passport.initialize())
// const {setupPassport} = require('./Controllers/googleController')
// const multer=require('multer')
// const path=require('path')
// app.use(express.static('public'))
// // app.use(cors(
// //   {
// //     origin: ['http://localhost:3000','http://localhost:3001'],
// //     credentials: true,
// //     methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
// //       allowedHeaders: ['Content-Type', 'Authorization']
// //   }
// // ));
// app.use(
//   session({
//       secret: "secret",
//       resave: false,
//       saveUninitialized: false,
    
//   })
// )

// app.use(cors(
//   {
//     origin: ['http://localhost:3000' , 'http://localhost:3002' , 'http://localhost:3011' , 'http://localhost:3010' , 'http://localhost:3012' , 'http://localhost:3001'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE' , 'PATCH'],
//       allowedHeaders: ['Content-Type', 'Authorization']

    
//   }
// ));



// const storage = multer.diskStorage({
//   destination: (req , file , cb) => {
//     cb(null , 'public/images')
//   },
//   filename: (req , file , cb) => {
//     cb(null , file.fieldname + "_" + Date.now() + path.extname(file.originalname))
//   }
  
// })

// const upload = multer({
//   storage: storage
// })

// app.patch('/uplaod/:id', upload.single('file') , async (req , res) =>{
//   console.log(req.file)
//   try{
//     const user = await User.findByIdAndUpdate(req.params.id , {photo: req.file.filename} , {
//       new: true,
//       runValidators: true
//     })
//     // User
//     res.json({
//       status: "success",
//       userImage : user.photo
//     })

//   }catch(err){
//     res.status(450).json({
//       status: "fail",
//       message: err
//     })
//   }
// })

// app.use(express.json())
// setupPassport(passport)
// const subscriptionRouter = require('./Routes/subscriptionRoute');
// const userRouter = require('./Routes/userRoute');
// const userSubscription = require('./Routes/userSubscriptionRoute');
// const bookingRouter = require('./Routes/tablePaymentRouter');
// const tableRouter = require('./Routes/tableRoute');
// const googleRouter =require("./Routes/googleRoute")
// app.use('/' , googleRouter)

// app.use('/ELACO/subcription', subscriptionRouter);
// app.use('/ELACO', userRouter);
// app.use('/ELACO/userSubscription', userSubscription);
// app.use('/ELACO/booking', bookingRouter);
// app.use('/ELACO/table', tableRouter);
// module.exports = app;

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const User = require('./Models/User');
const { setupPassport } = require('./Controllers/googleController');

const app = express();

// ✅ Move CORS to the top
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3010',
    'http://localhost:3011',
    'http://localhost:3012'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Additional preflight support
app.options('*', cors());

app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
setupPassport(passport);

// Static files
app.use(express.static('public'));

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

app.patch('/uplaod/:id', upload.single('file'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { photo: req.file.filename }, {
      new: true,
      runValidators: true
    });
    res.json({
      status: "success",
      userImage: user.photo
    });
  } catch (err) {
    res.status(450).json({
      status: "fail",
      message: err
    });
  }
});

// Routers
const subscriptionRouter = require('./Routes/subscriptionRoute');
const userRouter = require('./Routes/userRoute');
const userSubscription = require('./Routes/userSubscriptionRoute');
const bookingRouter = require('./Routes/tablePaymentRouter');
const tableRouter = require('./Routes/tableRoute');
const googleRouter = require('./Routes/googleRoute');

app.use('/', googleRouter);
app.use('/ELACO/subcription', subscriptionRouter);
app.use('/ELACO', userRouter);
app.use('/ELACO/userSubscription', userSubscription);
app.use('/ELACO/booking', bookingRouter);
app.use('/ELACO/table', tableRouter);

module.exports = app;
