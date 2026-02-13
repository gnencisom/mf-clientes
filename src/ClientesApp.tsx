import React from 'react';
import './ClientesApp.css';

interface Cliente {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
}

const ClientesApp: React.FC = () => {
    const [clientes] = React.useState<Cliente[]>([
        { id: 1, nombre: 'Juan Pérez', email: 'juan@example.com', telefono: '555-0101' },
        { id: 2, nombre: 'María García', email: 'maria@example.com', telefono: '555-0102' },
        { id: 3, nombre: 'Carlos López', email: 'carlos@example.com', telefono: '555-0103' },
        { id: 4, nombre: 'Ana Martínez', email: 'ana@example.com', telefono: '555-0104' },
    ]);

    return (
        <div className="clientes-container">
            <div className="clientes-header">
                <h1>📋 Gestión de Clientes</h1>
                <p>Microfrontend independiente de clientes</p>
            </div>

            <div className="clientes-grid">
                {clientes.map((cliente) => (
                    <div key={cliente.id} className="cliente-card">
                        <div className="cliente-avatar">
                            {cliente.nombre.charAt(0)}
                        </div>
                        <div className="cliente-info">
                            <h3>{cliente.nombre}</h3>
                            <p className="cliente-email">✉️ {cliente.email}</p>
                            <p className="cliente-telefono">📞 {cliente.telefono}</p>
                        </div>
                        <div className="cliente-actions">
                            <button className="btn-edit">Editar</button>
                            <button className="btn-delete">Eliminar</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="btn-add-cliente">
                ➕ Agregar Cliente
            </button>
        </div>
    );
};

export default ClientesApp;
