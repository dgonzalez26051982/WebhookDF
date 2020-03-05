'use strict'
const SAGACHDialogLib = require("./SAGACHDialogLib");
const http=require('http');
const reqUrl = encodeURI('http://api.weatherstack.com/current?access_key=cd2502e876a5be445c23705f8b809a4a&query=Mexico');
function accionPromise(respuesta) {
    let textoEnviar;
    //console.log("respuesta recibida:"+JSON.stringify(respuesta));
    if (respuesta) {
        textoEnviar=respuesta.current.temperature + " grados ";
        console.log("La temperatura es de "+ textoEnviar);
        
    }
    
}
/**
 * Esta función recibe una dirección y crea una promesa que si es correcta devuelve 
 * la respuesta como parámetro y si no lo es genera un Error
 * 
 * @param {*} reqUrl url de la que se va a leer la información
 */
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
        console.log("leerURL promise texto a Enviar " + JSON.stringify(textoEnviar));

    })

}

SAGACHDialogLib.leerURLpromise(reqUrl).then(accionPromise).catch((error)=>{
    console.log("error capturado en promise"+error);
})

