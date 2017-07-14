var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var mysql  = require('mysql');
var config = require('./config');

var dbconfig = config.dbconfig;
var tagconfig = config.tag;

var connection = mysql.createConnection(dbconfig);

var model = require('./model');




let app = express();

let hrefs = {}

app.get('/',  (req, res) => {
	model.subTags.select(connection, (modelErr, rows, fields)=>{
		rows.splice(1,100);
		let tasks = rows.map(ele=>{
			console.log(ele.sub_tag_name)
			let options = {
				proxy: config.proxy,
				url: 'https://book.douban.com/tag/'+encodeURI(ele.sub_tag_name)
			}
			return new Promise((resolve, reject)=>{
				request(options, (err, response, body)=>{
					if (!err && response.statusCode === 200) {
						console.log('succeeded in getting '+ ele.sub_tag_name)
						$ = cheerio.load(body);
						let result = $('.subject-item');
						resolve(result);
					} else {
						console.log('err....'+err);
						reject(err)
					}
				})
			})
		})
		Promise.all(tasks).then(allResult=>{
			res.send(allResult.toString());
		}).catch(allErr=>{
			res.send(allErr)
		})

	});

})


/*app.get('/',  (req, res) => {

	let options = {
		proxy: 'http://dev-proxy.oa.com:8080',
		url: 'https://book.douban.com/tag/'+encodeURI('小说')
	}

	request(options, (err, response, body)=>{
		if (!err && response.statusCode === 200) {
			$ = cheerio.load(body);
			let result = $('.subject-item');
			res.send(result.toString());

		} else {
			console.log('err....'+err);

		}
	})




})
*/


let server = app.listen(3000, ()=>{
	console.log('listening at 3000')
})
