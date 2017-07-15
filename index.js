var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./util');
// var mysql  = require('mysql');
// var config = require('./config');

// var dbconfig = config.dbconfig;
// var tagconfig = config.tag;

// var connection = mysql.createConnection(dbconfig);

// var model = require('./model');




let app = express();

let hrefs = {}

// app.get('/',  (req, res) => {
// 	model.subTags.select(connection, (modelErr, rows, fields)=>{
// 		rows.splice(1,142);
// 		let tasks = rows.map(ele=>{
// 			// console.log(ele.sub_tag_name)
// 			let options = {
// 				proxy: config.proxy,
// 				url: `https://book.douban.com/tag/${encodeURI(ele.sub_tag_name)}?start=0&type=S`
// 			}
// 			return new Promise((resolve, reject)=>{
// 				request(options, (err, response, body)=>{
// 					if (!err && response.statusCode === 200) {
// 						console.log('succeeded in getting '+ ele.sub_tag_name)
						// $ = cheerio.load(body);
						// let result = $('.subject-item');
						// let books = [];
						// let titleAndHref = $('.subject-item .info h2 a');
						// let imgSrc = $('.subject-item img');
						// let pubs = $('.subject-item .pub');
						// let ratings = $('.subject-item .rating_nums');
						// let pl = $('.subject-item .pl');
						// let des = $('.subject-item .clearfix+p');
						// for (ele in imgSrc) {
						// 	let book = {};
						// 	if (ele === ele.toUpperCase()) {
						// 		book.pub = util.escapeSpace(pubs[ele].children[0].data);
						// 		book.pic_url = imgSrc[ele].attribs.src;
						// 		book.name = titleAndHref[ele].attribs.title;
						// 		book.detail_url = titleAndHref[ele].attribs.href;
						// 		book.rating = ratings[ele].children[0].data+util.escapeSpace(pl[ele].children[0].data);
						// 		book.des = des[ele].children[0].data;
						// 		books.push(book);
						// 	}

						// }
// 						resolve(books);
// 					} else {
// 						console.log('err....'+err);
// 						reject(err)
// 					}
// 				})
// 			})
// 		})
// 		Promise.all(tasks).then(allResult=>{
// 			res.send(allResult.toString());
// 		}).catch(allErr=>{
// 			res.send(allErr)
// 		})

// 	});

// })


app.get('/',  (req, res) => {

	let options = {
		headers: {
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
			// 'Cookie': '_s_tentry=fashion.ifeng.com; login_sid_t=bcaa92fd1e3c34c948539c5640dccea7; Apache=6609498855881.253.1499009553423; SINAGLOBAL=6609498855881.253.1499009553423; ULV=1499009553427:1:1:1:6609498855881.253.1499009553423:; UOR=fashion.ifeng.com,widget.weibo.com,www.jb51.net; appkey=; SCF=AkD34ooQ95Ujyqn8wxfwGpHMsrDt32BtP5LShvIksQfwyFzPKv4l4yyWdhRIQipALtgdrxK5UVaUYHsRybYWAEw.; SUB=_2A250bmCBDeRhGeNJ71QY8i3MzDWIHXVXGtVJrDV8PUNbmtANLRnAkW-EsCmxGqR53vf_3So9I27HE5e6XA..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5K2TmvF81d8cOrrb8joIPV5JpX5K2hUgL.Fo-NShq4eoe7S0.2dJLoI0qLxK-LB--L1h.LxK-L1K5L1h.LxKnL12-L1h.LxK-LBKnL1-eLxKnLBoMLB-qLxK-LB.-L1hBt; SUHB=0A0Jt6wdIjmrmU; ALF=1500728321; SSOLoginState=1500123345; un=18819253786',
			// 'Host': 'weibo.com',
			// 'Referer': 'http://weibo.com/p/1005055746923079/home?from=page_100505&mod=TAB&is_all=1',
		    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
		  },	
		// proxy: 'http://dev-proxy.oa.com:8080',
		url: 'https://book.douban.com/tag/%E5%B0%8F%E8%AF%B4?start=20&type=T'
	}
	request(options).pipe(fs.createWriteStream('douban.html'))
	request(options, (err, response, body)=>{
		if (!err && response.statusCode === 200) {
			$ = cheerio.load(body);
			let result = $('.subject-item');
			let books = [];
			let titleAndHref = $('.subject-item .info h2 a');
			let imgSrc = $('.subject-item img');
			let pubs = $('.subject-item .pub');
			let ratings = $('.subject-item .rating_nums');
			let pl = $('.subject-item .pl');
			let des = $('.subject-item .clearfix+p');
			for (ele in imgSrc) {
				let book = {};
				if (ele === ele.toUpperCase()) {
					book.pub = util.escapeSpace(pubs[ele].children[0].data);
					book.pic_url = imgSrc[ele].attribs.src;
					book.name = titleAndHref[ele].attribs.title;
					book.detail_url = titleAndHref[ele].attribs.href;
					book.rating = ratings[ele].children[0].data+util.escapeSpace(pl[ele].children[0].data);
					book.des = des[ele].children[0].data;
					books.push(book);
				}

			}

			console.log(books);
			res.send(books);

		} else {
			console.log('err....'+err);

		}
	})




})



let server = app.listen(3000, ()=>{
	console.log('listening at 3000')
})

