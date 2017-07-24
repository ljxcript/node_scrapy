var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var util = require('./util');
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
		rows.splice(1,142);
		let tasks = rows.map((ele, index)=>{
			// console.log(ele.sub_tag_name)
			let options = {
				proxy: config.proxy,
				// url: `http://localhost:3001/${encodeURI(ele.sub_tag_name)}`
				url: `https://book.douban.com/tag/${encodeURI(ele.sub_tag_name)}?start=0&type=S`
			}
			return new Promise((resolve, reject)=>{
				setTimeout(function() {

					request(options, (err, response, body)=>{
						if (!err && response.statusCode === 200) {
							console.log('succeeded in getting '+ ele.sub_tag_name)
							$ = cheerio.load(body);
							let result = $('.subject-item');
							let books = [];
							let titleAndHref = $('.subject-item .info h2 a');
							let imgSrc = $('.subject-item img');
							let pubs = $('.subject-item .pub');
							let ratings = $('.subject-item .rating_nums');
							let pl = $('.subject-item .pl');
							let des = $('.subject-item .clearfix+p');
							//事实上这是不准确的。。。。
							for (e in imgSrc) {
								let book = {};
								if (e === e.toUpperCase()) {
									book.pub = (pubs[e]&& pubs[e].children && pubs[e].children.length && util.escapeSpace(pubs[e].children[0].data))||'';
									book.pic_url = (imgSrc[e] && imgSrc[e].attribs && imgSrc[e].attribs.src) || '';
									book.name = (titleAndHref[e] && titleAndHref[e].attribs && titleAndHref[e].attribs.title) || '';
									book.detail_url = (titleAndHref[e] && titleAndHref[e].attribs && titleAndHref[e].attribs.href) || '';
									book.rating = (ratings[e] && ratings[e].children && pl[e].children && ratings[e].children[0].data+util.escapeSpace(pl[e].children[0].data)) || '';
									book.des = (des[e] && des[e].children && des[e].children[0].data) || '';
									book.sub_tag = ele.id;
									books.push(book);
									model.books.insert(connection, book);
								}

							}
							resolve(books);
						} else {
							console.log('err....'+err);
							reject(err)
						}
					})

				}, index*3000);
			})
		})
		Promise.all(tasks).then(allResult=>{	
			console.log('Promises are resolved!!!!!!!!!!!!!!!!!!!')
			res.send(JSON.stringify(allResult));
		}).catch(allErr=>{
			res.send(allErr)
		})

	});

})


// app.get('/',  (req, res) => {

// 	let options = {
// 		headers: {
// 			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
// 			'Cookie': 'SINAGLOBAL=7932359340038.928.1496725570608; UM_distinctid=15cfdda118951f-0fc766595ac123-474f0820-1fa400-15cfdda118a889; UOR=www.liaoxuefeng.com,widget.weibo.com,database.51cto.com; YF-Ugrow-G0=1eba44dbebf62c27ae66e16d40e02964; login_sid_t=237e8d4a27e645bf3aaf21c628093e57; YF-V5-G0=16139189c1dbd74e7d073bc6ebfa4935; WBStorage=cd7f674a73035f73|undefined; _s_tentry=-; Apache=6004631393749.218.1500270815365; ULV=1500270815369:6:4:1:6004631393749.218.1500270815365:1500030888017; SSOLoginState=1500270849; SCF=Au4vhguB1C1l0ALbX4mMenAwRMJEMGNURw02acAGTk-myM_VwjYol4aEeIUUfInVU7zYlKLoSB2BgibUoEm_wVc.; SUB=_2A250aCFSDeRhGeNJ71QY8i3MzDWIHXVXHBWarDV8PUNbmtBeLRnSkW-G2smKBI33f3lo4dJAj-hfx0GEkg..; SUBP=0033WrSXqPxfM725Ws9jqgMF55529P9D9W5K2TmvF81d8cOrrb8joIPV5JpX5K2hUgL.Fo-NShq4eoe7S0.2dJLoI0qLxK-LB--L1h.LxK-L1K5L1h.LxKnL12-L1h.LxK-LBKnL1-eLxKnLBoMLB-qLxK-LB.-L1hBt; SUHB=0vJIEFTliWEkoX; ALF=1531806849; un=18819253786; wvr=6; YF-Page-G0=140ad66ad7317901fc818d7fd7743564',
// 			'Host': 'weibo.com',
// 			'Referer': 'http://weibo.com/p/1005055746923079/home?from=page_100505&mod=TAB&is_all=1',
// 		    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'
// 		  },	
// 		proxy: 'http://dev-proxy.oa.com:8080',
// 		url: 'http://weibo.com/u/2442163043?profile_ftype=1&is_all=1#_0'
// 	}
// 	request(options).pipe(fs.createWriteStream('weibo.html'))
// 	// request(options, (err, response, body)=>{
// 	// 	if (!err && response.statusCode === 200) {
// 	// 		$ = cheerio.load(body);
// 	// 		let result = $('.subject-item');
// 	// 		let books = [];
// 	// 		let titleAndHref = $('.subject-item .info h2 a');
// 	// 		let imgSrc = $('.subject-item img');
// 	// 		let pubs = $('.subject-item .pub');
// 	// 		let ratings = $('.subject-item .rating_nums');
// 	// 		let pl = $('.subject-item .pl');
// 	// 		let des = $('.subject-item .clearfix+p');
// 	// 		for (ele in imgSrc) {
// 	// 			let book = {};
// 	// 			if (ele === ele.toUpperCase()) {
// 	// 				book.pub = util.escapeSpace(pubs[ele].children[0].data);
// 	// 				book.pic_url = imgSrc[ele].attribs.src;
// 	// 				book.name = titleAndHref[ele].attribs.title;
// 	// 				book.detail_url = titleAndHref[ele].attribs.href;
// 	// 				book.rating = ratings[ele].children[0].data+util.escapeSpace(pl[ele].children[0].data);
// 	// 				book.des = des[ele].children[0].data;
// 	// 				books.push(book);
// 	// 			}

// 	// 		}

// 	// 		console.log(books);
// 	// 		res.send(books);

// 	// 	} else {
// 	// 		console.log('err....'+err);

// 	// 	}
// 	// })




// })



let server = app.listen(3000, ()=>{
	console.log('listening at 3000')
})
