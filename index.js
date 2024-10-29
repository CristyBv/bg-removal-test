import express from 'express';
import multer from 'multer';
import  { Response, Blob } from "node-fetch";
import { removeBackground }from '@imgly/background-removal-node'; // Import the background removal function
 
globalThis.Response = Response;
globalThis.Blob = Blob;
const app = express();

const upload = multer({ dest: 'uploads/' }); // Multer for temporarily saving files
import fs from 'fs';

app.post('/remove-background',  upload.single('image'), async (req, res) => {
    try {
        const inputFilePath = req.file.path;
        const result = await removeBackground(inputFilePath,{output:{quality: 1,type: 'background'}});

        const buffer = Buffer.from( await result.arrayBuffer() );
        const base64Image = buffer.toString('base64');

        // Return the base64 image
        res.json({ image: base64Image });

        fs.unlinkSync(inputFilePath); // Deletes temporary file
    } catch (error) {
        console.error('Error removing background:', error); // Display error in console
        res.status(500).send('Error processing image.');
    }
});

// Start the server on the port provided by the environment or default to 3000
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
