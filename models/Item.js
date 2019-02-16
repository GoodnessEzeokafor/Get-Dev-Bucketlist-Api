var mongoose = require('mongoose')
var Schema = mongoose.Schema


var ItemListSchema = new Schema({
    name:String,
    date_created:{
        type:Date,
        default:Date.now()
    },
    date_modified:{
        type:Date,
        default:Date.now()
    },
    done:{
        type:Boolean,
        default:false
    }
})




module.exports = mongoose.model("ItemList", ItemListSchema)
