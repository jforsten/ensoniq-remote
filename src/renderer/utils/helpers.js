export const Helpers = {

  capital_letter (str) {
    str = str.trim().toLowerCase()
    str = str.split(' ')
    for (var i = 0, x = str.length; i < x; i++) {
      if (str[i].length > 1) { str[i] = str[i][0].toUpperCase() + str[i].substr(1) }
    }
    return str.join(' ')
  }

}
