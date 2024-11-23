import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required!'],
        minLength: [4, 'Title should be at least 4 symbols long!']
    },
    price: {
        type: Number,
        required: [true, 'Price is required!'],
        minlength: [1, 'Price should be at least 1!']
    },
    yearOfMake: {
        type: Number,
        required: [true, 'Year of Make is required!'],
        minlength: [1, 'Year of Make should be at least 1!']
    },
    horsePower: {
        type: Number,
        required: [true, 'Engine Power is required!'],
        minlength: [1, 'Engine Power should be at least 1!']
    },
    color: {
        type: String,
        required: [true, 'Color is required!']
    },
    city: {
        type: String,
        required: [true, 'City is required!']
    },
    category: {
        type: String,
        required: [true, 'Category is required!'],
        enum: ['sedan', 'coupe', 'combi', 'suv', 'hatchback']
    },
    fuelType: {
        type: String,
        required: [true, 'Fuel Type is required!'],
        enum: ['petrol', 'diesel', 'electric', 'hybrid']
    },
    transmission: {
        type: String,
        required: [true, 'Transmission is required!'],
        enum: ['manual', 'automatic']
    },
    description: {
        type: String,
        required: [true, 'Description is required!'],
        minlength: [10, 'Description should be at least 10 symbols long!']
    },
    images: {
        type: [String],
        default: []
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Owner ID is required!']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{timestamps:true});


const Car = mongoose.model('Car', carSchema);

export default Car;