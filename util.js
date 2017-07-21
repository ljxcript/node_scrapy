

function isDetailLink(link) {
	return link.indeOf('book.douban.com/subject/') !== -1;
}

function escapeSpace(s) {
	return escapeQuote(s.split(/\s+/).join(''));
}

function escapeQuote(s){
	return s.replace('"', ' ').replace("'", ' ');
}

var util = {
	isDetailLink: isDetailLink,
	escapeSpace: escapeSpace,
}


module.exports = util;
