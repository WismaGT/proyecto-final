// backend/models/Order.js

import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    size: { type: String },
});

const OrderSchema = new mongoose.Schema({
    // MongoDB genera automáticamente el _id (ObjectId)
    id: { type: Number, required: true }, // Mantenemos tu ID numérico original
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerAddress: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
        default: 'pendiente'
    },
    total: { type: Number, required: true, min: 0 },
    trackingNumber: { type: String, default: '' },
    items: [OrderItemSchema], // Array de sub-documentos (artículos)
    createdAt: { type: Date, default: Date.now },
});

// Índice para asegurar la unicidad del ID manual
OrderSchema.index({ id: 1 }, { unique: true });

const Order = mongoose.model('Order', OrderSchema);

export default Order;