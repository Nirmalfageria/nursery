import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
      image: String,
      plantId: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'UPI'],
    default: 'COD',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid'],
    default: 'Pending',
  },
  status: {
    type: String,
    default: 'Pending',
  },
  address: {
    street: { type: String, required: true },
    city:{type:String,required:true},
    state:{type:String,required:true},
    pincode: { type: String, required: true },
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Order || mongoose.model('Order', orderSchema);
