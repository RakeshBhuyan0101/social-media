import mongoose from "mongoose";

const converseationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
}],
messages: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
}]
});

export const Conversation = mongoose.Schema( "Converseation",converseationSchema );
