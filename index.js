const express = require('express');
require('./config');

const userData = require('./userDM');
const app = express();
const multer = require('multer');
app.use(express.json());


//  ==============================Create Api =============================
app.post('/create-user', async (req, res) => {
  try {
    let data = new userData(req.body);
    let result = await data.save();
    console.log(result);
    res.status(201).json({ message: 'User created successfully', user: result });
  }
  catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// ================================= Get Api==========================
app.get('/users', async (req, resp) => {
  try {
    let data = await userData.find();
    console.log(data);
    // resp.send({ message: 'Users get successfully', user: data })
    resp.status(200).json({ message: 'Users get successfully', user: data });
  }
  catch (error) {
    console.error('Error creating user:', error);
    resp.status(500).json({ message: 'Internal Server Error', user: null });
  }
})

// ==============================Delete Api=============================
app.post('/delete', async (req, resp) => {
  try {
    let data = await userData.deleteOne({ _id: req.body.id });
    resp.status(200).json({ message: 'User deleted successfulyy', user: data });
    //  resp.send(data)
    console.log(req.body);

  }
  catch (error) {
    console.error('Error deleting user:', error);
    resp.status(500).json({ message: 'Internal Server Error', user: null });
  }
})


// =============================Update Api================================
app.post('/update-user', async (req, resp) => {
  try {
    let data = await userData.updateOne(
      { _id: req.body.id }, { $set: req.body }
    )
    resp.status(200).json({ message: 'User updated successfulyy', user: data });

  } catch (error) {
    console.error('Error deleting user:', error);
    resp.status(500).json({ message: 'Internal Server Error', user: null });
  }
})



// =============================Search Api===========================================
app.get('/user-serach', async (req, resp) => {
  try {
    let data = await userData.find(

      // {
      //   "$or": [
      //     { name: {$regex : req.body.name}},
      //     { technology: {$regex : req.body.tech}}
      //   ]
      // }
      
      {
        "$and": [
          { name: {$regex : req.body.name}},
          { technology: {$regex : req.body.tech}}
        ]
      }
    );
    if (data.length > 0) {
      resp.status(200).json({ message: 'User search successfully', user: data });
    } else {
      resp.status(200).json({ message: 'User not found', user: data });
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    resp.status(500).json({ message: 'Internal Server Error', user: null });
  }
})


// ===============================Upload file/image Api===================================
const uploadFile = multer({
  storage:multer.diskStorage({
    destination: function(req, file, cb){
      cb(null, "uploads")
    },
    filename: function(req, file, cb){
      cb(null, file.fieldname + "-" + Date.now() + ".png")
    }
  })
}).single("fileUpload")

app.post('/uploadfile', uploadFile, async (req, resp) => {
     resp.status(200).json({ message: 'Uploaded successfully'});
})




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
