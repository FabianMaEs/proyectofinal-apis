const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const QRCode = require("qrcode");
const nodemailer = require("nodemailer");

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
      oferta: "Descuento del 20% en tu primer cita con el optometrista",
    },
    {
      codigo: "123ABCXYZ456",
      oferta: "Consulta gratuita con el dentista para niños menores de 6 años",
    },
    {
      codigo: "456DEFXYZ789",
      oferta: "Descuento del 15% en tu cita con el optometrista",
    },
    {
      codigo: "789XYZABC123",
      oferta: "Primer consulta gratuita con el veterinario",
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
      oferta: "Descuento del 20% en tu primer cita con el optometrista",
    },
    {
      codigo: "123ABCXYZ456",
      oferta: "Consulta gratuita con el dentista para niños menores de 6 años",
    },
    {
      codigo: "456DEFXYZ789",
      oferta: "Descuento del 15% en tu cita con el optometrista",
    },
    {
      codigo: "789XYZABC123",
      oferta: "Primer consulta gratuita con el veterinario",
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
app.post("/contacto", (req, res) => {
  // Obtener los datos
  const { name, apellido, email, message } = req.body;

  console.log("Datos del formulario de contacto:");
  console.log("Nombre: ", name);
  console.log("Apellido", apellido);
  console.log("Correo:", email);
  console.log("Mensaje:", message);

  // Configurar el transporter de Nodemailer
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "miniproyectouno@gmail.com",
      pass: "skbhhywjlspgpxkz",
    },
  });

  // Configurar el mensaje de correo
  const mailOptions = {
    from: "miniproyectouno@gmail.com",
    to: email,
    subject: "¡Gracias por tu comentario, " + name + "!",
    text: "Recibimos tu comentario y lo atenderemos lo antes posible.",
  };

  // Enviar correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });


  // Configurar el mensaje de correo
  const mailOptions2 = {
    from: "miniproyectouno@gmail.com",
    to: "miniproyectouno@gmail.com",
    subject: "¡Nuevo comentario!",
    text: `Recibimos un comentario de ${name}:
    ${message}
    
    Responder a ${email}`
  };

  // Enviar correo
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });

  res.json({ message: "Formulario de contacto enviado" });
});

app.post("/agendar", (req, res) => {
  // Obtener los datos
  const { formularioContacto, horario, medico } = req.body;

  console.log("Datos del formulario de contacto:");
  console.log("Nombre:", formularioContacto.nombre);
  console.log("Apellido:", formularioContacto.apellido);
  console.log("Correo:", formularioContacto.mail);
  console.log("Tiempo:", formularioContacto.tiempo);
  console.log("Horario:", horario);
  console.log("Médico:", medico);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "miniproyectouno@gmail.com",
      pass: "skbhhywjlspgpxkz",
    },
  });

  const mailOptions = {
    from: "miniproyectouno@gmail.com",
    to: formularioContacto.mail,
    subject: "Confirmación de cita médica",
    text: `Hola ${formularioContacto.nombre} ${formularioContacto.apellido},
    
  Gracias por agendar una cita médica. Estos son los detalles de tu cita:
  
  Fecha y hora: ${horario} ${formularioContacto.tiempo}
  Médico: ${medico}
  
  Si tienes alguna pregunta o necesitas realizar cambios en tu cita, no dudes en contactarnos.
  
  Saludos,
  Equipo de Farmacias Parecidas, ¡parecido pero de un precio inferior!`,
  };

  // Enviar correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });

  // Configurar el mensaje de correo
  const mailOptions2 = {
    from: "miniproyectouno@gmail.com",
    to: "miniproyectouno@gmail.com",
    subject: "¡Nuevo cita!",
    text:  `Nueva cita agendada por ${formularioContacto.nombre} ${formularioContacto.apellido}. Estos son los detalles de la cita:
    Fecha y hora: ${horario} ${formularioContacto.tiempo}
    Médico: ${medico}`
  };

  // Enviar correo
  transporter.sendMail(mailOptions2, (error, info) => {
    if (error) {
      console.log("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });

  res.json({ message: "Registro de cita enviado" });
});

// Inicia el servidor
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor en el puerto ${port}`);
});
