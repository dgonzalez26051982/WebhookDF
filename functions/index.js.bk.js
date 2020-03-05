'use strict'
//Importar librerias
const functions = require('firebase-functions');
//Guia de uso expres https://expressjs.com/es/guide/routing.html
const express = require('express');
//Guia Body parser https://www.npmjs.com/package/body-parser
const bodyParser = require('body-parser');
const path = require('path');
const SAGACHDialogLib = require("./SAGACHDialogLib"); //Manda a llamar la libreria que se encuentra en la misma carpeta ./
const MongoLib = require("./MongobdLib");
// Variables Globales
global.listaPersonajes = require("./personajes.json");
global.imagenes = "https://us-central1-curso1-mmggpd.cloudfunctions.net/curso/imagenes/"
const server = express();
//Extended true sirve para identificar si se va a permitir leer un json
server.use(bodyParser.urlencoded({
    extended: true
}));
server.use(bodyParser.json()); //que use body parser para la lectura de json
// eslint-disable-next-line no-path-concat
server.use("/imagenes", express.static(path.join(__dirname, '/imagenes'))); //Para cargar imagenes
// si alguien intenta acceder desde un navegador con un Get 
server.get('/', (req, res) => {
    return res.json("Hola, soy un bot, pero esta no es forma correcta de interactuar conmigo.")
});

// Acceso Correcto con el metodo Post
server.post("/webhookmx", (req, res) => {
   // MongoLib.insertaReq(req);
   // let d = new Date();
    let contexto = "nada";
    let opciones = SAGACHDialogLib.reducirAOcho(["Promociones", "Saldo", "Planes", "Paquetes"]);
    let respuestaDefault ="nada";
    let resultado;
    let respuestaEnviada = false;
    var regexAccount = /^[0-9]{1,8}$/;
    let account="";
    var regexPhone = /^[0-9]{1,10}$/;
    let phone="";
    var regexEmail = /^[\w]+@{1}[\w]+\.[a-z]{2,3}/;
    let email="";
    let session=req.body.session;
    let textoEnviar = req.body.queryResult.fulfillmentText;

   
    res.setHeader('Content-Type', 'application/json');
    //******** */
    let mxTime = new Date().toLocaleString("en-MX", {timeZone: "America/Mexico_City"});
        mxTime = new Date(mxTime);
    
        let FechaHora = mxTime.toLocaleString();
 
        let expresion = /(..:..)/gi;
        let expresion2=/(....-..-..)/gi;
        //let expresion2=/^[/-]\d{4}$(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])/gi;
        let fechaTime;
       // console.log("FechaHora "+FechaHora);
        let HoraMinutos = FechaHora.match(expresion);
     //   console.log("Valor expresion "+HoraMinutos);

        let fecha = FechaHora.match(expresion2);
        if(fecha===null){
           expresion2=/([0-9]{4}-[0-9]{1}-[0-9]{2})/gi;
           fecha = FechaHora.match(expresion2);
          // console.log("MES DE UN DIGITO");
           //console.log("FECHA "+fecha);
        if(fecha===null){
               expresion2=/([0-9]{4}-[0-9]{2}-[0-9]{1})/gi;
               fecha = FechaHora.match(expresion2);
              // console.log("DIA DE UN DIGITO");
               //console.log("FECHA "+fecha);
           
            if(fecha===null){
               expresion2=/([0-9]{4}-[0-9]{1}-[0-9]{1})/gi;
               fecha = FechaHora.match(expresion2);
              // console.log("DIA y MES DE UN DIGITO");
              // console.log("FECHA "+fecha);              
           }else{
               console.log("OK");  
           }
           }else{
               console.log("OK");  
           }
       }else {
           console.log("OK");
        }
        let fechaArray = fecha.toString().split("-");
        var dia;
        let auxdia=parseInt(FechaHora.substring(8,10).trim());
       
        if(auxdia<10){
           // console.log("IF"+auxdia);
            dia="0"+auxdia.toString().trim();
        }else{
           // console.log("Else"+auxdia);
            dia=auxdia; 
    }
   
    
   
    let hours= mxTime.getHours();
    console.log("hours: "+hours);
    
    if(hours<10){
       hours='0'+hours;
   } else {
   //console.log("Min OK");
  }

    let minutes= mxTime.getMinutes();
    console.log("minutes :"+minutes);
  
     if(minutes<10){
        minutes='0'+minutes;
    } else {
    console.log("Min OK");
}


let seg= mxTime.getSeconds();
console.log("seg :"+seg);
 if(seg<10){
    seg='0'+seg;
} else {
console.log("Seg OK");
}



    if(fechaArray[1].length===1 && fechaArray[2].length===1){
        fechaTime= fechaArray[0]+'-'+'0'+fechaArray[1]+'-'+'0'+fechaArray[2]+' '+hours+':'+ minutes+':'+seg;
      
       }else if(fechaArray[1].length===2 && fechaArray[2].length===1){
           fechaTime= fechaArray[0]+'-'+fechaArray[1]+'-'+'0'+fechaArray[2]+' '+hours+':'+ minutes+':'+seg;
          
        }else if(fechaArray[1].length===1 && fechaArray[2].length===2){
           fechaTime= fechaArray[0]+'-'+'0'+fechaArray[1]+'-'+fechaArray[2]+' '+hours+':'+ minutes+':'+seg;
         
        }else{
           console.log("FECHA SIN MODIFICACION");
          
       }
       console.log("FECHA PARA BD : " + fechaTime);
       
    try {
        contexto = req.body.queryResult.action; //Va por el valor de la clave action
        respuestaDefault = req.body.queryResult.fulfillmentText;
        resultado = `Recibida peticion de accion: ${contexto}`;
      

    } catch (error) {
        console.log("Error contexto bacio " + error);

    }
  
    if (req.body.queryResult.parameters) {
       // console.log("parametros: " + req.body.queryResult.parameters);
    } else {
        console.log("Sin parametros");
    }
    if (regexPhone.test(req.body.queryResult.queryText)&& req.body.queryResult.queryText.length===10) {
        phone=req.body.queryResult.queryText;
    } else{
        phone="emty";
    }
    if (regexEmail.test(req.body.queryResult.queryText)) {
        email=req.body.queryResult.queryText;
    } else{
        email="emty";
    }
    if (regexAccount.test(req.body.queryResult.queryText)&& req.body.queryResult.queryText.length===8) {
        account=req.body.queryResult.queryText;
    } else{
        account="emty";
    }
    if (contexto === "input.welcome") {
        /************** input.welcome */
        
        resultado=SAGACHDialogLib.respuestaBasica(respuestaDefault);
       
        
    }else if (contexto === "hora") {
        /************** input.welcome */
        
        textoEnviar = 'Son las '+HoraMinutos.toString().substr(0, 2) + ' horas, con '+HoraMinutos.toString().substr(3, 2)+' minutos.';
        resultado = SAGACHDialogLib.respuestaBasica(textoEnviar,req.body.responseId,contexto);
        
    }

    else if (contexto === "fecha") {
        /************** input.welcome */
       
        textoEnviar = 'Estamos en el dia ' + fechaArray[2]+ ' del mes '+fechaArray[1]+' del año ' +fechaArray[0];
        resultado = SAGACHDialogLib.respuestaBasica(textoEnviar,req.body.responseId,contexto);
       
    }

    else if (contexto === "detalleEmail") {
        SAGACHDialogLib.sendEmail();
        console.log("++++enviado");
        resultado = SAGACHDialogLib.respuestaBasica("Se ha enviado la información a su correo electronico.",req.body.responseId,contexto);
       
    }
    
    
  
    else if (contexto === "clima") {
        respuestaEnviada=true;
        /************** input.welcome */
        const reqUrl = encodeURI('http://api.weatherstack.com/current?access_key=cd2502e876a5be445c23705f8b809a4a&query=Mexico');
        SAGACHDialogLib.leerURLpromise(reqUrl).then((respuesta)=> {
            let resultado;
            textoEnviar="En la CDMX la temperatura es de: "+respuesta.current.temperature+ " grados";
            resultado = SAGACHDialogLib.respuestaBasica(textoEnviar,req.body.responseId,contexto);
            res.json(resultado);
            MongoLib.saveInteraction(req.body.responseId,
                req.body.queryResult.queryText,
                contexto,
                textoEnviar,
                req.body.queryResult.intent.name,
                req.body.queryResult.intent.displayName,
                account
                ,phone
                ,email
                ,session,fechaTime);
            return true;
        }).catch((error)=> {
            respuestaEnviada=false;
            console.log("error capturado en promise"+error);
            textoEnviar="Lo siento no puedo conectarme con el servidor externo";
            res.json(SAGACHDialogLib.respuestaBasica(textoEnviar,req.body.responseId,contexto))
          
        });
        
    } 
    else {
        //*********Se recibe un action  desonocido (/contexto) */
       
        resultado = SAGACHDialogLib.respuestaBasica(respuestaDefault,req.body.responseId,contexto)   
    }
    SAGACHDialogLib.addSugerencias(resultado, opciones)
    res.json(resultado);

    if(respuestaEnviada===false){
        // MongoLib.insertaResp(resultado);
         MongoLib.saveInteraction(req.body.responseId,
            req.body.queryResult.queryText,
            contexto,
            textoEnviar,
            req.body.queryResult.intent.name,
            req.body.queryResult.intent.displayName,
            account
            ,phone
            ,email
            ,session,fechaTime);
        res.json(resultado);
       
    }
    FechaHora=null;
  
});


// Acceso Correcto con el metodo Post
server.post("/webhookmxhotel", (req, res) => {
    // MongoLib.insertaReq(req);
     //let d = new Date();
     let contexto = "nada";
 
     let respuestaDefault ="nada";
     let resultado;
     let respuestaEnviada = false;
     var regexAccount = /^[0-9]{1,8}$/;
     let account="";
     var regexPhone = /^[0-9]{1,10}$/;
     let phone="";
     var regexEmail = /^[\w]+@{1}[\w]+\.[a-z]{2,3}/;
     let email="";
     let session=req.body.session;
     let textoEnviar = req.body.queryResult.fulfillmentText;
 
     let opciones = SAGACHDialogLib.reducirAOcho(["chiste", "consejo", "noticias", "mi equipo", "sagach"]);
     res.setHeader('Content-Type', 'application/json');
     //******** */
     let mxTime = new Date().toLocaleString("en-MX", {timeZone: "America/Mexico_City"});
         mxTime = new Date(mxTime);
     
         let FechaHora = mxTime.toLocaleString();
         
         let expresion = /(..:..)/gi;
        
         let expresion2=/([0-9]{4}-[0-9]{2}-[0-9]{2})/gi;
         //console.log("expresion2"+expresion2);
     
         let fechaTime;
       
         let HoraMinutos = FechaHora.match(expresion);
         //console.log("Valor expresion "+HoraMinutos);

         let fecha = FechaHora.match(expresion2);
         if(fecha===null){
            expresion2=/([0-9]{4}-[0-9]{1}-[0-9]{2})/gi;
            fecha = FechaHora.match(expresion2);
            //console.log("MES DE UN DIGITO");
          //  console.log("FECHA "+fecha);
         if(fecha===null){
                expresion2=/([0-9]{4}-[0-9]{2}-[0-9]{1})/gi;
                fecha = FechaHora.match(expresion2);
               // console.log("DIA DE UN DIGITO");
                //console.log("FECHA "+fecha);
            
             if(fecha===null){
                expresion2=/([0-9]{4}-[0-9]{1}-[0-9]{1})/gi;
                fecha = FechaHora.match(expresion2);
                console.log("DIA y MES DE UN DIGITO");
                console.log("FECHA "+fecha);              
            }else{
                console.log("OK");  
            }
            }else{
                console.log("OK");  
            }
        }else {
            console.log("OK");
         }
         let fechaArray = fecha.toString().split("-");
         var dia;
         let auxdia=parseInt(FechaHora.substring(8,10).trim());
        
         if(auxdia<10){
           // console.log("auxdia "+auxdia); 
             //console.log("IF"+auxdia);
             dia="0"+auxdia.toString().trim();
         }else{
            // console.log("Else"+auxdia);
             dia=auxdia; 
     }
     

     console.log("FechaHora: "+FechaHora);

     let hours= mxTime.getHours();
     console.log("hours: "+hours);
     
     if(hours<10){
        hours='0'+hours;
    } else {
    //console.log("Min OK");
   }

     let minutes= mxTime.getMinutes();
     console.log("minutes: "+minutes);
     
     if(minutes<10){
        minutes='0'+minutes;
    } else {
    //console.log("Min OK");
   }
   
   let seg= mxTime.getSeconds();

   if(seg<10){
      seg='0'+seg;
  } else {
  console.log("Seg OK");
  }

     if(fechaArray[1].length===1 && fechaArray[2].length===1){
     fechaTime= fechaArray[0]+'-'+'0'+fechaArray[1]+'-'+'0'+fechaArray[2]+' '+ hours+':'+ minutes+':'+seg;
    }else if(fechaArray[1].length===2 && fechaArray[2].length===1){
        fechaTime= fechaArray[0]+'-'+fechaArray[1]+'-'+'0'+fechaArray[2]+' '+ hours+':'+ minutes+':'+seg;
    }else if(fechaArray[1].length===1 && fechaArray[2].length===2){
        fechaTime= fechaArray[0]+'-'+'0'+fechaArray[1]+'-'+fechaArray[2]+' '+ hours+':'+ minutes+':'+seg;
    }else{
        console.log("FECHA SIN MODIFICACION");
    }
    console.log("FECHA PARA BD : " + fechaTime);
     try {
         contexto = req.body.queryResult.action; //Va por el valor de la clave action
         respuestaDefault = req.body.queryResult.fulfillmentText;
         resultado = `Recibida peticion de accion: ${contexto}`;
       
 
     } catch (error) {
         console.log("Error contexto bacio " + error);
 
     }
   
     if (req.body.queryResult.parameters) {
        // console.log("parametros: " + req.body.queryResult.parameters);
     } else {
         console.log("Sin parametros");
     }
     if (regexPhone.test(req.body.queryResult.queryText)&& req.body.queryResult.queryText.length===10) {
         phone=req.body.queryResult.queryText;
     } else{
         phone="emty";
     }
     if (regexEmail.test(req.body.queryResult.queryText)) {
         email=req.body.queryResult.queryText;
     } else{
         email="emty";
     }
     if (regexAccount.test(req.body.queryResult.queryText)&& req.body.queryResult.queryText.length===8) {
         account=req.body.queryResult.queryText;
     } else{
         account="emty";
     }  
     SAGACHDialogLib.ad

      if (contexto === "Reserva") {
        
        resultado = SAGACHDialogLib.respuestaBasica(respuestaDefault,req.body.responseId,contexto)
       
    }
    else if (contexto === "NoReserva") {
        
        resultado = SAGACHDialogLib.respuestaBasica(respuestaDefault,req.body.responseId,contexto)
       
    }

     else {
         //*********Se recibe un action  desonocido (/contexto) */
         resultado = SAGACHDialogLib.respuestaBasica(respuestaDefault,req.body.responseId,contexto)
        
        
     }
     if(respuestaEnviada===false){
         // MongoLib.insertaResp(resultado);
          MongoLib.saveInteractionhotel(req.body.responseId,
             req.body.queryResult.queryText,
             contexto,
             textoEnviar,
             req.body.queryResult.intent.name,
             req.body.queryResult.intent.displayName,
             account
             ,phone
             ,email
             ,session,fechaTime);
         res.json(resultado);
        
     }
   
 });
 
 



//***** */

const local = true//para ejecutar servidor local debe estar en true de lo contrario false
if (local) {
    server.listen((process.env.PORT || 8000), () => {
        console.log("servidor funcionando...");
    });
} else {
    //para firebase
    exports.curso = functions.https.onRequest(server);
}