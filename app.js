import express from 'express';
import cors from 'cors';

import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import permissionRouter from './routes/permissionRoute.js';
import roleRouter from './routes/roleRoutes.js';
import categoryRouter from './routes/categoryRoute.js';
import orderRouter from './routes/orderRoute.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/catalog/product', express.static('public/catalog/product'));

app.use('/api/permission', permissionRouter);
app.use('/api/role', roleRouter);
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/category', categoryRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
    res.send('E-Commerce API is running!');
});

export default app;