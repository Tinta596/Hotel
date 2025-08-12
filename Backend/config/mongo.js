import mongoose from 'mongoose';

export async function connectMongo() {
    const uri = process.env.BD_CONNECT;
    if(!uri){
        throw new Error('Falta la variable de entorno MONGO_URI');
    }
    return mongoose.connect(uri);
}