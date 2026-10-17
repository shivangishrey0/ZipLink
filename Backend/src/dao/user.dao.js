import User from "../models/user.model.js";

export const createUser = async ({ name, email, password }) => {
    return await User.create({ name, email, password });
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const findUserByEmailWithPassword = async (email) => {
    return await User.findOne({ email }).select("+password");
};
