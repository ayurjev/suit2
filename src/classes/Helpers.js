/**
 * replaceAll for strings
 */
String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
};

/**
 * trimAll for strings
 */
String.prototype.trimAll = function(mask) {
    var s = this;
    while (~mask.indexOf(s[0])) { s = s.slice(1); }
    while (~mask.indexOf(s[s.length - 1])) { s = s.slice(0, -1); }
    return s;
};
