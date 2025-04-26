import app from './app.js';
import connectDB from './config/db.js'; 
import dotenv from 'dotenv';
dotenv.config();

connectDB();

app.listen(8080, () => {
  console.log('Servidor corriendo en el puerto 8080');
});



