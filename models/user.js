const mongoose = require('mongoose');
const Product = require('../models/product');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        quantity: { type: Number, required: true }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  Product.findById(product._id).exec().then((p)=>{
    p.stock -= 1;
    p.save();
  });

  return this.save();
};

userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  
  const item = this.cart.items.filter(item => {
    return item.productId.toString() == productId.toString();
  });
  Product.findById(productId).exec().then((p)=>{
    p.stock += item[0].quantity;
    p.save();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};
userSchema.methods.updateCart = function (product, q) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product.toString();
    });
    const updatedCartItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
        if((this.cart.items[cartProductIndex].quantity + q)>0){
          newQuantity = this.cart.items[cartProductIndex].quantity + q;
        }else{
          newQuantity = this.cart.items[cartProductIndex].quantity
        }
        
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    }
    const updatedCart = {
        items: updatedCartItems
    };
    this.cart = updatedCart;
    return this.save();
  };
userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
