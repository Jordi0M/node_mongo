var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var fs = require('fs');
var url = "mongodb://localhost:27017/";
var $ = require('jquery');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


var express = require('express');
	app = express();

	app.get ('/', function(req, res){

		var busqueda = req.params;
		console.log(busqueda);
			
		//var dbo = res.db("cocina");
		//var consulta = dbo.getCollection('recetas').find({});
		MongoClient.connect(url, function(err, db) {
		  if (err) throw err;
		  var dbo = db.db("cocina");

		  dbo.collection("recetas").find({}).toArray(function(err, result) {
			  var lista = "";
			if (err) throw err;
			
				   inicio_tabla = ' \
				   <table class="table"> \
				   <thead class="thead-dark"> \
				   <th scope="col">Nombre</th> \
				   <th scope="col">Duracion</th> \
				   <th scope="col">Descripcion</th> \
				   <th scope="col">Tipo</th> \
				   <th scope="col">Opciones</th> \
				   </thead> \
  				   <tbody> \
				   ';
					
				   for (const key in result) {

						tr_th_nombre = "<tr><th>"+result[key]["nombre"]+"</th>";
						tr_th_duracion = "<th>"+result[key]["duracion"]+"</th>";
						tr_th_descripcion = "<th>"+result[key]["descripcion"]+"</th>";
						tr_th_tipo= "<th>"+result[key]["tipo"]+"</th>";

						id_asociada = result[key]["_id"];
					
						boton_editar = "<th><a class='btn btn-success btn-lg' href=/editar/"+id_asociada+">Editar</a>\t";
						boton_borrar = "<a class='btn btn-danger btn-lg' href=/borrar/"+id_asociada+">Borrar</a></th>";
						
						fin_tr = "</tr>"
						
						lista_sin_sumar = tr_th_nombre+tr_th_duracion+tr_th_descripcion+tr_th_tipo+boton_editar+boton_borrar+fin_tr;
						lista = lista + lista_sin_sumar;
				   }
				   
				   cerrar_tabla = '</tbody></table></div>'

				   var buscador_mas_boton_crear = '\
				       <br><br>\
					   <div class="container">\
					   <form action="/">\
					   <input class="search_input" type="text" name="buscar" placeholder="Search...">\
					   <input class="btn btn-dark" value="Buscar" type="submit">\
					   <a class="btn btn-primary" href=/crear>Añadir</a>\
					   </form>\
					   <br><br>';

				   lista_entera = buscador_mas_boton_crear + inicio_tabla + lista + cerrar_tabla;					   

				   fs.readFile("head.html","utf8",(err,data)=>{
					   if(err){
						   console.log(err);
						   return err;
					   }else{
						   res.send(data+lista_entera);
					   }
				   })

		    db.close();
		  });
		});	
	});
	var formulario = '<form class="form-horizontal" method="POST" action="/crear">\
						<div class="form-group">\
						<label class="control-label col-sm-2" for="nombre"><b>Nombre:</b></label>\
						<div class="col-sm-10">\
						<input class="form-control" type="text" name="nombre" id="edad">\
						</div>\
						</div>\
						<div class="form-group">\
						<label class="control-label col-sm-2" for="duracion"><b>Duracion:</b></label>\
						<div class="col-sm-10">\
						<input class="form-control" type="text" name="duracion">\
						</div>\
						</div>\
						<div class="form-group">\
						<label class="control-label col-sm-2" for="descripcion"><b>Descripcion:</b></label>\
						<div class="col-sm-10">\
						<input class="form-control" type="text" name="descripcion">\
						</div>\
						</div>\
						<div class="form-group">\
						<label class="control-label col-sm-2" for="tipo"><b>Tipo:</b></label>\
						<div class="col-sm-10">\
						<input class="form-control" type="text" name="tipo">\
						</div>\
						</div>\
						<div class="form-group">\
						<div class="col-sm-offset-2 col-sm-10">\
						<a class="btn btn-warning" href="/">Volver</a>\
						<input class="btn btn-success" type="submit" value="Añadir">\
						</div>\
						</div>\
					</form>';

	app.get ('/crear', function(req, res){

		fs.readFile("head.html","utf8",(err,data)=>{
			if(err){
				console.log(err);
				return err;
			}else{
				res.send(data+formulario);
			}
		})

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

				var formulario_editar = '<form class="form-horizontal" method="POST" action="/editar/'+[param_id]+'">\
								<div class="form-group">\
								<label class="control-label col-sm-2" for="nombre"><b>Nombre:</b></label>\
								<div class="col-sm-10">\
								<input class="form-control" type="text" name="nombre" id="edad" value="'+resultado["nombre"]+'">\
								</div>\
								</div>\
								<div class="form-group">\
								<label class="control-label col-sm-2" for="duracion"><b>Duracion:</b></label>\
								<div class="col-sm-10">\
								<input class="form-control" type="text" name="duracion" value="'+resultado["duracion"]+'">\
								</div>\
								</div>\
								<div class="form-group">\
								<label class="control-label col-sm-2" for="descripcion"><b>Descripcion:</b></label>\
								<div class="col-sm-10">\
								<input class="form-control" type="text" name="descripcion" value="'+resultado["descripcion"]+'">\
								</div>\
								</div>\
								<div class="form-group">\
								<label class="control-label col-sm-2" for="tipo"><b>Tipo:</b></label>\
								<div class="col-sm-10">\
								<input class="form-control" type="text" name="tipo" value="'+resultado["tipo"]+'">\
								</div>\
								</div>\
								<div class="form-group">\
								<div class="col-sm-offset-2 col-sm-10">\
								<a class="btn btn-warning" href="/">Volver</a>\
								<input class="btn btn-success" type="submit" value="Editar">\
								</div>\
								</div>\
							</form>';

				fs.readFile("head.html","utf8",(err,data)=>{
					if(err){
						console.log(err);
						return err;
					}else{
						res.send(data+formulario_editar);
					}
				})
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

			var myquery = {_id: new ObjectID(param_id)};
			var newvalues = { $set: { nombre: input_nombre, duracion: input_duracion, descripcion: input_descripcion, tipo: input_tipo} };
			dbo.collection('recetas').updateOne(myquery, newvalues, function(err, result){

				console.log("Dato editado");
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