function messageTemplate(data, name) {
  return $('<li>').text(`${data.name}: ${data.payload}`).addClass(data.name === name ? 'ownMessage' : '')
}