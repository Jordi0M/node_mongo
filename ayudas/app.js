// Recorda a tenir ben restaurat la bbdd de video
//   mongorestore -d db_video "./dump/video"


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("db_video");

  // Per no mostrar totes les pelis, restringim ...
  dbo.collection("movies").find({year:1991, title:/^T/}).toArray(function(err, result) {

    // Si existeix un error, es llença una "exception" 
    if (err) throw err;

    // A la variable "result" es guarda l'array d'items que hem obtingut. Podem iterar-les fent un bucle ("loop").
    result.forEach(function(peli) {
            console.log(peli.title);
    });

    // Tenquem la base de dades! (important!)
    db.close();
  });

});
