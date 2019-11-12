function capitaliseFirstLetter(string) {
    var str1 = string.charAt(0);
    var str2 = string.substr(1);
  
    return str1.toUpperCase() + str2.toLowerCase();
}

// module.exports = {
//     capitaliseFirstLetter
// }