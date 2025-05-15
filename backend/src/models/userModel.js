import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        default: null
    },
    recoveryToken: {
        type: String,
        default: null
    },
    recoveryExpires: {
        type: String,
        default: null
    }
})

userModel.methods.toJSON = function () {
    const object = this.toObject()
    delete object.password
    delete object.refreshToken
    delete object.recoveryToken
    delete object.recoveryExpires
    return object
}

export default mongoose.model('Users', userModel)