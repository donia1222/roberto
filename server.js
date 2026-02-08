require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: 'Mensajes inválidos.' });
        }

        const isValid = messages.every(
            (msg) =>
                (msg.role === 'system' || msg.role === 'user' || msg.role === 'assistant') &&
                typeof msg.content === 'string'
        );

        if (!isValid) {
            return res.status(400).json({ error: 'Formato de mensajes inválido.' });
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages,
        });

        const botResponse = completion.choices[0]?.message?.content;
        if (!botResponse) {
            throw new Error('No se recibió respuesta del modelo.');
        }

        res.json({ response: botResponse });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al obtener la respuesta del chatbot.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});
