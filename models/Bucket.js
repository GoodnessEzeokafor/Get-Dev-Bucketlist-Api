var mongoose = require('mongoose')
var Schema = mongoose.Schema




mongoose.connect("mongodb://localhost:27017/bucket_list_app",  { useNewUrlParser: true })
var BucketListSchema = new Schema({
    name:String,
    // item:[{type:Schema.Types.ObjectId, ref:"Item"}],
    items:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ItemList"
        }   
    ],
    date_created:{
        type:Date,
        default:Date.now()
    },
    date_modified:{
        type:Date,
        default:Date.now()
    },
    created_by:{
        // id:{
        //     type:mongoose.Schema.Types.ObjectId,
        //     ref:"User"
        // },
        // username:String,
        type:String
    }

})
module.exports = mongoose.model("Bucketlist", BucketListSchema)

