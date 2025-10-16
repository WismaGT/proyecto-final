// backend/server.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
// 1. Importar el conector de MongoDB (se llama una vez)
import connectDB from './config/db.js'; 
// 2. Importar la nueva lógica CRUD ASÍNCRONA
import { 
    getProducts, saveProduct, deleteProduct, 
    getOrders, saveOrder, deleteOrder 
} from './api/crud.js'; 
import dotenv from 'dotenv';


// --- Conexión a la Base de Datos ---
connectDB(); // Llama a la función para conectar a MongoDB

// Configuración de __dirname para módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Usar el puerto de las variables de entorno o 3000 por defecto
dotenv.config();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); 

// Servir archivos estáticos
const frontendPath = path.join(__dirname, '../frontend');
const rootPath = path.join(__dirname, '..'); 

app.use(express.static(frontendPath));
app.use(express.static(rootPath));

// -------------------------------------------------------------------
// RUTAS DE LA API (Ahora son ASÍNCRONAS)
// -------------------------------------------------------------------

// PRODUCTOS
app.get('/api/products', async (req, res) => {
    try {
        const products = await getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const product = await saveProduct(req.body);
        res.status(201).json(product); // 201 Created o OK si es edición
    } catch (error) {
        res.status(400).json({ message: 'Error al guardar producto', error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = parseInt(req.params.id, 10);
        const success = await deleteProduct(productId);
        if (success) {
            res.status(200).json({ message: `Producto ID ${productId} eliminado.` });
        } else {
            res.status(404).json({ message: `Producto ID ${productId} no encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
});


// PEDIDOS
app.get('/api/orders', async (req, res) => {
    try {
        const orders = await getOrders();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    try {
        const order = await saveOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: 'Error al guardar pedido', error: error.message });
    }
});

app.delete('/api/orders/:id', async (req, res) => {
    try {
        const orderId = parseInt(req.params.id, 10);
        const success = await deleteOrder(orderId);
        if (success) {
            res.status(200).json({ message: `Pedido ID ${orderId} eliminado.` });
        } else {
            res.status(404).json({ message: `Pedido ID ${orderId} no encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar pedido', error: error.message });
    }
});


// -------------------------------------------------------------------
// RUTAS DE VISTA (Front-end serving) - Sin cambios
// -------------------------------------------------------------------

// Ruta principal: sirve el index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// Ruta para el panel de administración
app.get('/admin', (req, res) => {
    res.sendFile(path.join(frontendPath, 'admin.html'));
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor en funcionamiento en http://localhost:${PORT}`);
    console.log(`Panel de Administración: http://localhost:${PORT}/admin`);
});