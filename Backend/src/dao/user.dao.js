import User from "../models/user.model.js";

export const createUser = async ({ name, email, password, googleId }) => {
    return await User.create({ name, email, password, googleId });
};

export const findUserById = async (id) => {
    return await User.findById(id);
};

export const findUserByEmailWithPassword = async (email) => {
    return await User.findOne({ email }).select("+password");
};

export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const findUserByGoogleId = async (googleId) => {
    return await User.findOne({ googleId });
};
