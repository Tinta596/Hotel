import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    action: String,
    description: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    timestamp: { type: Date, default: Date.now },
    metadata: Object
});

export default mongoose.model('Log',logSchema);
