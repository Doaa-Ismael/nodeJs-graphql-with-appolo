import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Message from './message';

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true,
        minlength: [3, 'Too Short User Name']
    },
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    email: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    password: {
        type: Schema.Types.String,
        required: true,
        minlength: 6
    },
    role: {
        type: Schema.Types.String,
        enum: ['ADMIN']
    }
}, {
    timestamps: true
});

schema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

schema.pre('remove', function (next) {
    Message.find({userId: this._id}).remove();
    next();
});

schema.methods.comparePasswords = function (password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
};

export default mongoose.model('User', schema);
