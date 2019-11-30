import mongoose from 'mongoose';
import models from './../models/index';
const devDBURL = 'mongodb://doaa:graphql-with-appolo-1@ds115762.mlab.com:15762/graphql-with-appolo';
const testingDBURL = 'mongodb://doaa:password1@ds227185.mlab.com:27185/graphql-with-appolo-testing';

export default () => {
    mongoose.set('debug', true);
    return mongoose.connect(process.env.DB || devDBURL, {useNewUrlParser: true});
}

export const populate = async () => {
    const user1 = await models.User.create({
        _id: mongoose.Types.ObjectId("56cb91bdc3464f14678934ca"),
        username: 'Doaa Ismael  ',
        email: 'dd@dd.dds',
        password: 'password123',
        role: 'ADMIN'
    });
    const message =  await models.Message.create({text: 'Message from air', userId: user1._id});
    user1.messages = [message._id];
    await user1.save();
};
