

function isDetailLink(link) {
	return link.indeOf('book.douban.com/subject/') !== -1;
}


var util = {
	isDetailLink: isDetailLink
}


module.exports = util;