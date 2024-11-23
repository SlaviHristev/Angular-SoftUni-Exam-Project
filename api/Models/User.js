import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "This username is already in use!"],
        required: [true, 'Username is required!'],
        minLength: [2, 'Username should be at least 2 symbols long!'],
        maxLength: [20, 'Username should have a maximum of 20 symbols!']
    },
    email: {
        type: String,
        unique: [true, "This email is already in use!"],
        required: [true, 'Email is required!'],
        minLength: [10, 'Email should be at least 10 symbols long!'],
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        validate: {
            validator: function (value) {
                return value.length === 60 || /^[A-Za-z0-9]+$/.test(value);
            },
            message: 'Invalid Password'
        },
        minLength: [4, 'Password is too short!']
    },
    avatar: {
        type: String,
        default: null
    },
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;