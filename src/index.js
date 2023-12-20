// server.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors()); // Usa cors middleware
app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON

/** Configuración de Base de datos */
mongoose.connect('mongodb+srv://jcarlosj:xK2I7TrNCotw6Kpy@cluster0.lapkq.mongodb.net/db-articles' );

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error de conexión a la base de datos:', error);
});

db.once('open', () => {
  console.log('Conexión exitosa a la base de datos');
});


/** Modelo: Schema usando Mongoose */
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
  // Otros campos de tu modelo
});

const Article = mongoose.model('Article', articleSchema);

/** Route & Controller: Registrar Articulo */
app.post('/api/articles', async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Se requieren título y contenido para el artículo.' });
    }

    const newArticle = new Article({ title, content });

    await newArticle.save();

    res.status(201).json(newArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** Route & Controller: Obtener Articulo */
app.get('/api/articles/:page', async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const pageSize = 2; // Número de artículos por página

    /** Service  */
    const articles = await Article.find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .sort({ createdAt: -1 }); // Ordena por fecha de creación descendente

    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** Route & Controller: Obtener Articulo por ID */
app.get('/api/article/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({ error: 'Artículo no encontrado' });
    }

    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/** Lanza Servidor Web */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
