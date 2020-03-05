const http = require('http');
const nodemailer = require('nodemailer');
/**
 * Crea una respuesta básica a partir del texto
 * @param {*} textoEnviar 
 * @returns la cadena JSON de Respuesta
 */

function respuestaBasica(textoEnviar) {
    let respuesta = {
        "fulfillmentText": textoEnviar,
        "fulfillmentMessages": [
            {
                "platform": "ACTIONS_ON_GOOGLE",
                "simpleResponses": {
                    "simpleResponses": [
                        {
                            "textToSpeech": textoEnviar
                        }
                    ]
                }
            },
            {
                "text": {
                    "text": [
                        textoEnviar
                    ]
                }
            }
        ]
    }
    return respuesta;
}
/**
 * 
 * @param {*} res Añade a una respuesta basica la lista de sugerencias
 * @param {*} opciones Es la lista de sugerencias a añadir a res con el formato 
 *                      ["opcion1","opcion2"....,"opcionN"]
 */
function addSugerencias(res, opciones) {
    res.fulfillmentMessages.push({
        "platform": "ACTIONS_ON_GOOGLE",
        "suggestions": {
            "suggestions": listaOpcionesGoogle(opciones)
        }
    });
}

function addSugerenciasTelegram(res, opciones) {
    res.fulfillmentMessages.push({
        "platform": "TELEGRAM"},
        {
        "quickReplies": {
            "quickReplies": listaOpcionesTelegram(opciones)
        }
    });
}
/**
 * 
 * @param {*} res Añade a una respuesta basica un card
 * @param {*} titulo titulo del card
 * @param {*} texto texto principal
 * @param {*} imagen Imagen
 * @param {*} url URL a ka que se redirecciona
 */
function addCard(res, titulo, texto, imagen, url) {
    res.fulfillmentMessages.push(
        {
            "platform": "ACTIONS_ON_GOOGLE",
            "basicCard": {
                "title": titulo,
                "subtitle": titulo,
                "formattedText": texto,
                "image": {
                    "imageUri": imagen,
                    "accessibilityText": titulo
                },
                "buttons": [
                    {
                        "title": `Más informacion de ${titulo}`,
                        "openUriAction": {
                            "uri": url
                        }
                    }
                ]
            }
        }
    );
}

/**
 *  
 * @param {*} opciones Recibe la lista de opciones 
 * @returns Devuelve la lista formateada suggestions de google
 *                    [{"title":"valor"},....]
 */
function listaOpcionesGoogle(opciones) {
    let res = [];
    for (let i = 0; i < opciones.length; i++) {
        res.push({ "title": opciones[i] })
    }
    return res;
}

function listaOpcionesTelegram(opciones) {
    let res = [];
    for (let i = 0; i < opciones.length; i++) {
        res.add(opciones[i])
    }
    return res;
}
/** 
 * Recibe una lista de opiones y devuelve una lista de sugerencias de maximo 8 elementos de manera aleatoria.
 * @param {*} opciones lista deopciones con formato: ["opcion1","opcion2","opcion3","opcion4"]
 */
function reducirAOcho(opciones) {
    let res = []; // array resultado con 8 opciones de forma aleatoria
    let i = 0;//contador del bucle
    let pos; //posicion seleccionada
    while (i < 8 && opciones.length > 0) {
        pos = Math.floor(Math.random() * opciones.length);
        res.push(opciones[pos]);
        opciones.splice(pos, 1);
        i++;
    }
    return res;
}
function hola(nombre) {
    console.log("encantado de conocerte " + nombre);
}
//********************/
function leerURLpromise(reqUrl) {
    return new Promise((resolve, reject) => {
        let textoEnviar = "";
       
        http.get(reqUrl, (respuestaDeAPI) => {
            let respuestaCompleta = '';
            let respuestaJSON = '';

            respuestaDeAPI.on('data', (chunk) => {
                respuestaCompleta += chunk;
            });
            respuestaDeAPI.on('end', () => {
                try {
                    respuestaJSON = JSON.parse(respuestaCompleta);
                    resolve(respuestaJSON);
                } catch (error) {
                    // En este caso se devolverá la cadena vacía
                    console.log(("Error al cargar los datos del servidor externo" + error));
                    reject(new Error("Error al cargar datos externos"));


                }
            })
        }).on('error', (error) => {
            // Se ejecutará cuando una petición no es válida
            console.log("Error al cargar los datos del servidor externo", error);
            reject(new Error("Error al cargar datos externos"));

        })
        console.log("leerURL promise texto a Enviar" + JSON.stringify(textoEnviar));

    })

}

/****/

/**inicia EL Email */
function sendEmail() {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sahid.garcia.tecadvisors@gmail.com',
            pass: 'sancho.1'
        }
    });

    let mailOptions = {
        from: 'sahid.garcia.tecadvisors@gmail.com',
        to: 'sgarcia@tecnologyad.com,dgonzalez@tecnologyad.com',
        subject: 'Asistente Virtual',
        html: '<h1>Detalle de Facturación</h1><strong><p>Te muestro el detalle de tu facturació</p></strong><img src="https://contenedorp.s3.amazonaws.com/DetalleFactura.jpg" alt="Smiley face" width="650"><p>Atentamente: Asistente Virtual</p>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}
/**Fin del Email */

function sendMailCalentador() {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sahid.garcia.tecadvisors@gmail.com',
            pass: 'sancho.1'
        }
    });

    let mailOptions = {
        from: 'sahid.garcia.tecadvisors@gmail.com',
        to: 'sgarcia@tecnologyad.com,dgonzalez@tecnologyad.com,csanchez@appvisors.mx,pathy.marquez.72@gmail.com',
        subject: 'Asistente Virtual Rheem',
        html: '<h1>Detalle Calentador</h1><strong><p>Te muestro el detalle del calentador que se ajusta a tus necesidades</p></strong><a href="https://contenedorp.s3.amazonaws.com/File_15321516630768517.pdf">Da clic aqui para descargar el PDF</a><p>Atentamente: Asistente Virtual</p>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

function sendMailCalentadorPaty() {

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'sahid.garcia.tecadvisors@gmail.com',
            pass: 'sancho.1'
        }
    });

    let mailOptions = {
        from: 'sahid.garcia.tecadvisors@gmail.com',
        to: 'sgarcia@tecnologyad.com,dgonzalez@tecnologyad.com,csanchez@appvisors.mx,pathy.marquez.72@gmail.com,rocio.meza@rheem.com',
        subject: 'Asistente Virtual Rheem',
        html: '<h1>Detalle Calentador</h1><strong><p>Te muestro el detalle del calentador que se ajusta a tus necesidades</p></strong><a href="https://contenedorp.s3.amazonaws.com/File_15321516630768517.pdf">Da clic aqui para descargar el PDF</a><p>Atentamente: Asistente Virtual</p>'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

//para usarlo como libreria indicas que funciones seran las que exportes Nota: poner una coma despues de cada declaracion.
module.exports = {
    hola: hola,
    respuestaBasica: respuestaBasica,
    addSugerencias: addSugerencias,
    addSugerenciasTelegram: addSugerenciasTelegram,
    addCard: addCard,
    reducirAOcho: reducirAOcho,
    leerURLpromise: leerURLpromise,
    sendEmail: sendEmail,
    sendMailCalentador: sendMailCalentador,
    sendMailCalentadorPaty: sendMailCalentadorPaty
    
}