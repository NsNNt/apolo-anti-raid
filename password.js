/**
 * @param {Number} Length 
 * @returns {String}
 */
 module.exports = (Cantidad) => {


    if (!Cantidad) throw new TypeError("La cantidad no esta definida")
    var length = Cantidad,
        token = '123456789abcdefghijklmnñopqrstuvwxyzABCDFGHIJKLMNÑOPQRSTUVXYZ',
            value = "";
    for (var i = 0, n = token.length; i < length; ++i) {
        value += token.charAt(Math.floor(Math.random() * n));
    }
    return value;
}