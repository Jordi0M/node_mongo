var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var url = "mongodb://localhost:27017/";
var $ = require('jquery');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var express = require('express');
	app = express();

	app.get ('/', function(req, res){
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

		  dbo.collection("recetas").find({}).toArray(function(err, result) {
			  var lista = "";
		    if (err) throw err;
				   boton_crear = "<a href=/crear>Añadir</a><br><br>";

				   for (const key in result) {

						li_nombre = "<li>"+result[key]["nombre"]+"</li>";

						id_asociada = result[key]["_id"];
						boton_editar = "<a href=/editar/"+id_asociada+">Editar</a>\t";
						boton_borrar = "<a href=/borrar/"+id_asociada+">Borrar</a><br>";
						lista_sin_sumar = li_nombre+boton_editar+boton_borrar;
						lista = lista + lista_sin_sumar;
				   }
				   res.send(boton_crear+lista);
					
		    	/*
		    result.forEach(function(receta){
		    });
		    */
		    db.close();
		  });
		});	
	});
	var formulario = '<form method="POST" action="/crear">\
						<label for="nombre">Nombre</label>\
						<input type="text" name="nombre" id="edad">\
						<br>\
						<label for="duracion">Duracion</label>\
						<input type="text" name="duracion">\
						<br>\
						<label for="descripcion">Descripcion</label>\
						<input type="text" name="descripcion">\
						<br>\
						<label for="tipo">Tipo</label>\
						<input type="text" name="tipo">\
						<br>\
						<input type="submit">\
					</form>';

	app.get ('/crear', function(req, res){

	  res.send('<html><body>'
		  +formulario
		  + '</body></html>');
	});

	app.post ('/crear',urlencodedParser, function(req, res){

		var input_nombre = req.body.nombre;
		var input_duracion = req.body.duracion;
		var input_descripcion = req.body.descripcion;
		var input_tipo = req.body.tipo;
		
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("cocina");
  
			var myobj = { nombre: input_nombre, duracion: input_duracion, descripcion: input_descripcion, tipo: input_tipo};
			dbo.collection("recetas").insertOne(myobj, function(err, res) {
				if (err) throw err;
				console.log("Nuevo dato insertado");
				db.close();
			});		  
  
			res.redirect("/");
  
		  });			
		
	});

	app.get ('/borrar/:id', function(req, res){

		var param_id = req.params.id;
		
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("cocina");

			var myquery = { _id: param_id };
			dbo.collection("recetas").deleteOne({_id: new ObjectID(param_id)});
			console.log("Nuevo dato insertado");
			res.redirect("/");
  
		  });	
		
	});


	app.get ('/editar/:id', function(req, res){

		var param_id = req.params.id;
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("cocina");
			dbo.collection("recetas").findOne({_id: new ObjectID(param_id)}, function(err, resultado) {			

				var formulario_editar = '<form method="POST" action="/editar/'+["_id"]+'">\
								<label for="nombre">Nombre</label>\
								<input type="text" name="nombre" id="edad" value="'+resultado["nombre"]+'">\
								<br>\
								<label for="duracion">Duracion</label>\
								<input type="text" name="duracion" value="'+resultado["duracion"]+'">\
								<br>\
								<label for="descripcion">Descripcion</label>\
								<input type="text" name="descripcion" value="'+resultado["descripcion"]+'">\
								<br>\
								<label for="tipo">Tipo</label>\
								<input type="text" name="tipo" value="'+resultado["tipo"]+'">\
								<br>\
								<input type="submit">\
							</form>';

				res.send(formulario_editar);
			});
		});
	});

	app.post ('/editar/:id',urlencodedParser, function(req, res){

		var param_id = req.params.id;

		var input_nombre = req.body.nombre;
		var input_duracion = req.body.duracion;
		var input_descripcion = req.body.descripcion;
		var input_tipo = req.body.tipo;
		
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var dbo = db.db("cocina");

			var myobj = { nombre: input_nombre, duracion: input_duracion, descripcion: input_descripcion, tipo: input_tipo};

			dbo.collection('recetas').update({_id: new ObjectID(param_id)}, {$set: myobj}, function(err, result){

			/*
			var myquery = { address: "Valley 345" };
			var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
			dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
				if (err) throw err;
				console.log("1 document updated");
				db.close();
			});
			*/

			console.log("Nuevo dato editado");
			res.redirect("/");
  
		  });	
		
		});
	});

	app.use(function(req, res){

		res.sendStatus(404);
	});

	var server = app.listen(3000, function(){
		var port = server.address().port;
		console.log('Express server listening on port %s', port);
	});

function generarDatos(){
$("body").append("p");
}