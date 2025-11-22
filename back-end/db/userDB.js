import User from "../schemas/User.js";

export const creatUser = async (data) => {
    return await User.create(data);
};

export const getAllUsers = async () => {
    return await User.find();
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const updateUserById = async (id, data) => {
    return await User.findByIdAndUpdate(id, data, {new: True});
};

export const DeleteById = async (id) => {
    return await User.findByIdAndDelete(id);
};