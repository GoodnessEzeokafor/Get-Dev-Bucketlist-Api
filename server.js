var express = require('express')
var mongoose = require("mongoose")
var bodyParser = require('body-parser')
var methodOverride = require('method-override')
var flash = require('connect-flash');



// Models
var UserList = require("./models/User")
var BucketList = require("./models/Bucket")
var ItemList = require("./models/Item")
var User = require("./models/User")




// Authentication
var passport = require('passport')
const LocalStrategy = require("passport-local")
mongoose.Promise = global.Promise


var port = process.env.PORT || 3000
var app = express()

mongoose.connect("mongodb://localhost:27017/bucket_list_app",  { useNewUrlParser: true })
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(methodOverride());
app.set("view engine", 'ejs')


//Passport Configurations
app.use(require("express-session")({
    secret:"jsdkjnvofimvmzkdmlzkdm",
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(flash());

// Get BucketList
app.get("/bucketlists",isLoggedIn,(req, res)=> {  
    // res.json(buckets)
    BucketList.find({}, (err, bucketlist)=> {
        if(err){
            console.log(err)
        } else {
            // res.render(bucketlist, {bucketlist})
            // res.send("Hello!!")
            if(bucketlist.length === 0){
                res.send({bucketlist,message:"No Bucket created"})
            }
            res.send(bucketlist)
        }
    })
    // res.render('bucketlist')
})

// Create BucketList
app.post("/bucketlists",isLoggedIn ,(req, res) =>{
    // res.send("List Item!!")
    // console.log(BucketList)
    const bucket = new BucketList({
        name:req.body.name,
        created_by:req.body.created_by,
    })
    bucket.save()
          .then((data) => {
              console.log(data)
              res.send({data, message:"Bucket created successfully"})
          }).catch((err) => {
              console.log(e)
              res.status(500).send({
                  message:err.message
              })
          })
})


// Get a Bucket!!
app.get("/bucketlists/:id",isLoggedIn ,(req, res) => {
    BucketList.findById({_id:req.params.id})
              .then((bucket) => {
                  if(!bucket) {
                      res.status(404).send({
                          message:"Bucket could not be found!! " + req.params.id
                      })
                  }
                  res.send(bucket)
              }).catch((err) => {
                  if(err.kind == "ObjectId"){
                      return res.status(404).send({
                          message:`Bucket not found with id ${req.params.id}`
                      })
                  }
                  return res.status(500).send({
                    message:`Error retrieving with bucket id ${req.params.id}`
                  })
                //   console.log(err.message)
              })
    // res.send("Get A Single bucket list")
})
// Update a bucket 
app.put("/bucketlists/:id",isLoggedIn ,(req, res) =>{
    BucketList.findByIdAndUpdate({_id:req.params.id},{
        name:req.body.name,
        created_by:req.body.created_by
    }, {new:true})
            .then((bucket) => {
                if(!bucket){
                    return res.status(404).send({
                        message:`Bucket with id ${req.paras.id} not found`
                    })
                }
                res.send({bucket, message:'Bucket updated successfully!!'})
            }).catch((err) => {
                if(err.kind == 'ObjectId'){
                    return res.status(404).send({
                        message:`Bucket with id ${req.params.id} not found!!`
                    })
                }
                return res.status(500).send({
                    message:`Error updating bucket with id ${req.params.id}`
                })
            })
})
// delete a post 
app.delete("/bucketlists/:id",isLoggedIn ,(req, res) => {
    BucketList.findByIdAndRemove({_id:req.params.id})
              .then((bucket) => {
                  if(!bucket){
                      return res.status(404).send({
                          message:`Bucket with id ${req.params.id} not found`
                      })
                  }
                  res.send({bucket, message:"Bucket deleted successfully!!"})
              }).catch((e) => {
                  if(e.kind === 'ObjectId' || e.name === 'NotFound'){
                      return res.status(404).send({
                          message:`Bucket not found with id ${req.params.id}`
                      })
                  }
                  return res.status(500).send({
                      message:`Could not delete bucket with id ${req.params.id}`
                  })
              })
})

//Get items in a bucket
app.get("/bucketlists/:id/items",isLoggedIn ,(req, res) => {
    BucketList.find()
        .then((data) => {
            let new_data = data.map(data_item => data_item.items)
            res.send(new_data)
        })
        .catch((err) => {
            res.status(500).send({
                message:err.message
            })
        })
})


// create an item in a bucket
app.post("/bucketlists/:id/items",isLoggedIn ,(req, res) => {
    BucketList.findById({_id:req.params.id})
              .then((data) => {
                    // create a new item
                    ItemList.create({
                        name:req.body.name
                    }, (err, item) => {
                        if(err){
                            res.send({message:`Couldn't create items`})
                        }
                        item.save()
                        data.items.push(item)  // adds the item to the bucketlist
                        data.save() // saves the bucketlist
                        // console.log(comment)

                        res.redirect(`/bucketlists/${data._id}`)
                    })
              }).catch((err) => {
                  if(err.kind === 'ObjectId'){
                      return res.status(404).send({
                          message:`Bucket not found with id ${req.params.id}`
                      })
                  }
                  return res.status(500).send({
                      message:"Could not add item"
                  })
              })
    // res.send("Read all the items in a bucket list")
})

//read a single item
app.get("/bucketlists/:id/items/:item_id",isLoggedIn ,(req, res) => {
    ItemList.find({_id:req.params.item_id})
              .then((data) => {
                  res.send(data)
              })
              .catch((err) => {
                if(err.kind === 'ObjectId'){
                    return res.status(404).send({
                        message:`Item not found with id ${req.params.id}`
                    })
                }
                return res.status(500).send({
                    message:"Could not get item"
                })
            })
        })
//update a single item
app.put("/bucketlists/:id/items/:item_id",isLoggedIn ,(req, res) => {
    ItemList.findByIdAndUpdate({_id:req.params.item_id},{
        name:req.body.name,
    }, {new:true})
            .then((item) => {
                if(!item){
                    return res.status(404).send({
                        message:`Item with id ${req.paras.item_id} not found`
                    })
                }
                res.send({item, message:'Item updated successfully!!'})
            }).catch((err) => {
                if(err.kind == 'ObjectId'){
                    return res.status(404).send({
                        message:`Item with id ${req.params.item_id} not found!!`
                    })
                }
                return res.status(500).send({
                    message:`Error updating bucket with id ${req.params.item_id}`
                })
            })
})

// delete a single item
app.delete("/bucketlists/:id/items/:item_id",isLoggedIn ,(req, res) => {
    ItemList.findByIdAndRemove({_id:req.params.item_id})
              .then((item) => {
                  if(!item){
                      return res.status(404).send({
                          message:`Item with id ${req.params.item_id} not found`
                      })
                  }
                  res.send({item, message:"Item deleted successfully!!"})
              }).catch((e) => {
                  if(e.kind === 'ObjectId' || e.name === 'NotFound'){
                      return res.status(404).send({
                          message:`Item not found with id ${req.params.item_id}`
                      })
                  }
                  return res.status(500).send({
                      message:`Could not delete item with id ${req.params.item_id}`
                  })
              })
})



// Authentication



// register user
// app.get("/register", (req, res) => {
//     User.create()
    
// })
// create an register user

app.post("/auth/register", (req, res) => {
    // handle signup logic
    var newUser = new User({username:req.body.username})
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            res.send({
                name:`${err.name}`,
                message:`${err.message}`
            })
            // return res.render("auth/register")
        } 
        passport.authenticate("local")(req, res, ()=>{
            res.send({message:`User ${newUser.username} Created Successfully!!`})
        })
    })
        
})

app.post("/auth/login",passport.authenticate("local", {
    successRedirect:"/bucketlists",
    failureFlash: 'Invalid username or password.'

}), (req, res) => {
    res.send({
        message:"User successfully logged in"
    })
})

app.get("/auth/logout", (req, res) => {
    req.logout()
    res.send({
        message:"User successfully logged out!"
    })

    // res.redirect("/campgrounds")
})



// middleware function 
function isLoggedIn(req ,res, next){
    if(req.isAuthenticated()){
        return next()
    } 
    res.send({
        message:"Please First Log In, use the url '/auth/login'"
    })
}


app.listen(port, () => {
    console.log(`App running on port ${port}`)
})


