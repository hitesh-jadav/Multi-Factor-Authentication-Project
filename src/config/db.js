import {connect} from "mongoose";
const dbConnect = async()=>{
    try{

        const mongoDbconnection = await connect(process.env.DB_Connection);
        console.log(`Database Connected : ${mongoDbconnection.connection.host}`);
        
    }catch(error){
      console.log(`Database connection failed ${error}`);
      process.exit(1);
    }
};

export default dbConnect;