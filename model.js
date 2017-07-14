var mysql  = require('mysql');
var dbconfig = require('./config')

var connection = mysql.createConnection(dbconfig);


var model = {
	tags: {

	},
	subTags: {

	},
	books: {

	}
}

model.tags.insert = (connection, tagName)=>{
	connection.query('INSERT INTO tags (tag_name) VALUES ("'+tagName+'")', (err, rows, fields)=>{
		if (err) throw err;

	})
}


model.tags.select = (connection)=>{
	connection.query('SELECT * FROM tags', (err, rows, fields)=>{
		if (err) throw err;
		console.log(rows)
	})
}


model.subTags.insert = (connection, subTagName, belongsTo, bookNumber)=>{
	connection.query(`INSERT INTO sub_tags (sub_tag_name, belongs_to, book_number) VALUES ("${subTagName}","${belongsTo}", "${bookNumber}")`, (err)=>{
		if (err) throw err;

	})
}

model.subTags.select = (connection, cb)=>{
	connection.query('SELECT * FROM sub_tags',cb);
}

module.exports = model;