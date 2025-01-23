import feedbackModel from "../models/feedbackModel.js";
import orderModel from "../models/OrdersModel.js";




  
  export const getOrders=async(req,res)=>
  {
    const userId = req.user;
        console.log("user",userId)
        const orders = await orderModel.find( {userId}); // Use findOne() for a single order
        console.log(orders)
        return res.json({ success: true, orders});
       
  }
  export const getAllOrders=async(req,res)=>
    {
    
          const orders= await orderModel.find({})
          return res.json({success:true,orders})
    }

export const updateOrder = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    console.log(req.body);  // For debugging

    // Ensure that `orderId` is passed as part of the request body
    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "orderId and status are required" });
    }

    // Update the order by orderId (assuming `orderId` is a string and not the default _id)
    const updatedOrder = await orderModel.findOneAndUpdate(
      { orderId },  // Use the `orderId` field for query
      { status },    // Update the `status` field
      { new: true }  // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Status Updated", updatedOrder });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const feedback = async (req, res) => {
  try {
    const { stars, message } = req.body;
    console.log(req.body)
    console.log(req.body)
    const feedback = new feedbackModel({ stars, message });
    await feedback.save();
    res.status(200).send({ message: 'Feedback saved successfully!' });
  } catch (error) {
    res.status(500).send({ message: 'Error saving feedback', error });
  }
}

//remove cart
// Assuming you are using Express.js

// Backend: Order Cancel API (Express.js)

export const orderCancel = (req, res) => {
  const { orderId } = req.body;

  // Ensure orderId is a valid string
  if (typeof orderId !== 'string' || orderId.trim() === '') {
    return res.status(400).json({ success: false, message: 'Invalid Order ID' });
  }

  // Query the database using the custom orderId (not MongoDB _id)
  orderModel.findOneAndDelete({ orderId: orderId })
    .then((deletedOrder) => {
      if (!deletedOrder) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      res.status(200).json({ success: true, message: 'Order deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: error.message });
    });
};
