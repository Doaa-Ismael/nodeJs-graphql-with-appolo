import DataLoader from "dataloader";

const batchUsers = async (keys, models) => {
    const users = await models.User.find({
        _id: { $in: keys }
    });
    return keys.map(key => users.find( user =>  (user._id).toString() === key.toString()));
};

const userLoader = (models) => new DataLoader(keys => batchUsers(keys, models));

export default userLoader;
