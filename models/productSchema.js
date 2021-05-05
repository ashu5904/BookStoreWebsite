const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: 'String'
    },
    des:{
        type: 'String'
    },
    image: {
        type: 'String'
    }
})

const Product = mongoose.model('Product', productSchema);
module.exports = Product;