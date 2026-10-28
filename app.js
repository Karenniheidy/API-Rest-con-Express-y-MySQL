let express = require('express');
let cors = require('cors');
let mysql = require('mysql2');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let conectar = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'Karen0420',
    database: 'db_inventario',
    port: '3306'
});

conectar.connect((error) => {
    if (error) {
        console.error('Error al conectar con la base de datos MySQL:', error);
    } else {
        console.log('Conexión exitosa a la base de datos MySQL.');
    }
});

app.get('/prueba', (req, res) => {
    res.status(200).json({ mensaje: 'El servidor está funcionando correctamente.' });
});

app.post('/productos', (req, res) => {
    const { nombre, categoria, precio, cantidad_disponible } = req.body;
    
    if (!nombre || !categoria || precio === undefined || cantidad_disponible === undefined) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    const query = 'INSERT INTO productos (nombre, categoria, precio, cantidad_disponible) VALUES (?, ?, ?, ?)';
    conectar.query(query, [nombre, categoria, precio, cantidad_disponible], (error, resultado) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al registrar el producto en la base de datos.', error: error.message });
        }
        return res.status(201).json({ mensaje: 'Producto registrado correctamente.', idProducto: resultado.insertId });
    });
});

app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    conectar.query(query, (error, resultados) => {
        if (error) {
            return res.status(500).json({ mensaje: 'Error al consultar los productos.', error: error.message });
        }
        return res.status(200).json(resultados);
    });
});

app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto ${PORT}`);
});