import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
    text: {
        type: Schema.Types.String,
        required: true,
        minlength: [4, 'Message is too short']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true
});

export default mongoose.model('Message', schema);
