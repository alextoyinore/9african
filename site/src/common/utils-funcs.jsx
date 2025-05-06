
/**
 * returns the average read time of a string of words
 * @param {String} text - The string of words to be read
 * @returns {Number} decimal number that can be mapped to time value
 */

const AVG_READ_WPM = 200

export const getReadTime = (text) => Math.ceil(text.split(' ').length / AVG_READ_WPM)


export const toSentenceCase = (theString) => {
	var newString = theString.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g,function(c){return c.toUpperCase()});
  return newString;
}


