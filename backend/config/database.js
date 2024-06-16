const mongoose = require('mongoose');


const connectDatabase = ()=> { 
    
    mongoose.connect(process.env.DB_URI).then((data)=> {
        console.log(`Mongodb connected with server ${data.connection.host}`)
    })
    // .catch((e)=> {
    //     console.log(e);
    // })

}

module.exports = connectDatabase

