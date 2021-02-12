import mongoose from 'mongoose';

const connDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
        console.log(`mongoDB connected on  ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
}

export default connDB;