/* eslint-disable no-catch-shadow */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable promise/always-return */


var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://35.184.47.79:27017";





//******************START MX WEBHOOK******************* */

function saveInteraction(responseId,queryText,action,fulfillmentText,name,displayName,account,phone,email,session,date,source) {
	let objsource = JSON.stringify(source);
	//let objsource = source;
	let respuesta = {
		"responseId": responseId,
		"queryResult": {
			"queryText": queryText,
			"action": action,
			"fulfillmentText": fulfillmentText,
			"intent": {
				"name": name,
				"displayName": displayName
			}
		},
		"customerData": {
			"account": account,
			"phone": phone,
			"email": email
		},
		"session" : session,
		"creation_date":date,   
		"originalDetectIntentRequest":{
			source
		}
	}

	insertaResp(respuesta);
    return respuesta;
}

function insertaResp(req){
	//console.log("START INSERT RESPONSE");
	MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
		try{
			delete req.body._id; // for safety reasons
		  } catch(err){
		   // console.log("No elimina: body._id");
		  }
		
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("calls").insertOne(req, function(err, res) {
		  if (err) throw err;
		  console.log("1 INSERT INTERACTION DOCUMENT");
		  //db.close();
		});
	  });
}

//******************END MX WEBHOOK******************* */




//******************START MX WEBHOOK HOTEL******************* */

function saveInteractionhotel(responseId,queryText,action,fulfillmentText,name,displayName,account,phone,email,session,date,source) {
    let respuesta = {
		"responseId": responseId,
		"queryResult": {
			"queryText": queryText,
			"action": action,
			"fulfillmentText": fulfillmentText,
			"intent": {
				"name": name,
				"displayName": displayName
			}
		},
		"customerData": {
			"account": account,
			"phone": phone,
			"email": email
		},
		"session" : session,
		"creation_date":date
		,   
		"originalDetectIntentRequest":{
			source
		}
	}
	insertaRespHotel(respuesta)
    return respuesta;
}

function insertaRespHotel(req){
	//console.log("START INSERT RESPONSE");
	MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
		try{
			delete req.body._id; // for safety reasons
		  } catch(err){
		   // console.log("No elimina: body._id");
		  }
		
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("callshotel").insertOne(req, function(err, res) {
		  if (err) throw err;
		  console.log("1 INSERT INTERACTION DOCUMENT");
		  //db.close();
		});
	  });
}

//******************END MX WEBHOOK HOTEL******************* */



//******************START MX WEBHOOK HOTEL******************* */

function saveInteractionBR(responseId,queryText,action,fulfillmentText,name,displayName,account,phone,email,session,date,source) {
    let respuesta = {
		"responseId": responseId,
		"queryResult": {
			"queryText": queryText,
			"action": action,
			"fulfillmentText": fulfillmentText,
			"intent": {
				"name": name,
				"displayName": displayName
			}
		},
		"customerData": {
			"account": account,
			"phone": phone,
			"email": email
		},
		"session" : session,
		"creation_date":date,   
		"originalDetectIntentRequest":{
			source
		}
	}
	insertaRespBR(respuesta)
    return respuesta;
}

function insertaRespBR(req){
	//console.log("START INSERT RESPONSE");
	MongoClient.connect(url, { useUnifiedTopology: true },function(err, db) {
		try{
			delete req.body._id; // for safety reasons
		  } catch(err){
		   // console.log("No elimina: body._id");
		  }
		
		if (err) throw err;
		var dbo = db.db("test");
		dbo.collection("callsAlgar").insertOne(req, function(err, res) {
		  if (err) throw err;
		  console.log("1 INSERT INTERACTION DOCUMENT");
		  //db.close();
		});
	  });
}

//******************END MX WEBHOOK HOTEL******************* */



module.exports = {
	insertaResp: insertaResp,
	insertaRespHotel: insertaRespHotel,
	saveInteraction: saveInteraction,
	saveInteractionhotel: saveInteractionhotel,
	saveInteractionBR:saveInteractionBR
		
}
