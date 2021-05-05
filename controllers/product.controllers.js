const Product = require('../models/productSchema.js');
const User = require('../models/userSchema');

exports.productFetchController = (req, res) => {
    Product.find({})
    .exec((err, result) => {
        if(err || !result){
            return res.status(400).json({
                message: "Error in fetching"
            })
        }

        return res.status(200).json({
            products: result
        })
    })
}

exports.addCartController = (req, res) => {
    const { userId, product } = req.body;

    User.findByIdAndUpdate({_id: userId}, {$push: {"cart": product}}, {new: true})
    .exec((err, result) => {
        if(err) {
            return res.status(400).json({
                message: "Error in updating the document"
            })
        }

        return res.status(200).json({
            result: result
        })
    })
}