import mongoose from 'mongoose';

const taxSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    count: { type: Number, required: true },
    description: { type: String }
});

const Taxs = mongoose.model('Taxes', taxSchema);
export default Taxs;
