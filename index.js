const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const QRCode = require('qrcode');
const nodemailer = require('nodemailer');

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hola");
});

app.get("/datos", (req, res) => {
  const datos = [
    {
      codigo: "ABC123XYZ789",
      oferta: "Descuento del 20% en tu cita con el veterinario",
    },
    {
      codigo: "XYZ789DEF456",
      oferta: "Descuento del 30% en tu primer cita con el optometrista",
    },
  ];
  res.json({ datos });
});

app.get("/codigoqr", (req, res) => {
  const datos = [
    {
      codigo: "ABC123XYZ789",
      oferta: "Descuento del 20% en tu cita con el veterinario",
    },
    {
      codigo: "XYZ789DEF456",
      oferta: "Descuento del 30% en tu primer cita con el optometrista",
    },
  ];

  dato = datos[Math.floor(Math.random() * datos.length)];

  // Genera el código QR
  QRCode.toDataURL(dato.codigo + "/" + dato.oferta, (err, url) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error al generar el código QR" });
    }

    // Devuelve el código QR
    res.json({ imagenCodigoUrl: url });
  });
});

// Ruta para el formulario de contacto
app.post('/contacto', (req, res) => {
  // Obtener los datos
  const { name, apellido, email, message } = req.body;

  console.log('Datos del formulario de contacto:');
  console.log('Nombre: ', name);
  console.log('Apellido', apellido);
  console.log('Correo:', email);
  console.log('Mensaje:', message);

  // Configurar el transporter de Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'miniproyectouno@gmail.com',
      pass: 'skbhhywjlspgpxkz'
    }
  });
  
  // Configurar el mensaje de correo
  const mailOptions = {
    from: 'miniproyectouno@gmail.com',
    to: email,
    subject: '¡Gracias por tu comentario, ' + name + '!',
    text: 'Recibimos tu comentario y lo atenderemos lo antes posible.'
  };  

  // Enviar correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });

  const mailOptions = {
    from: 'miniproyectouno@gmail.com',
    to: 'fabmac865@gmail.com',
    subject: 'Comentario recibido de ' + name + ' ' + apellido,
    text: 'Mensaje: ' + message
  };  

  // Enviar correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error al enviar el correo:', error);
    } else {
      console.log('Correo enviado:', info.response);
    }
  });

  res.json({ message: 'Formulario de contacto enviado' });
});

// Inicia el servidor
const port = 3000; // El puerto en el que deseas ejecutar tu servidor
app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
