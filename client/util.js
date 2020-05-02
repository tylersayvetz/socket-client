function messageTemplate(data, name, server) {
  return $('<li>').text(`${server ? '<Server Message>' : data.name}: ${data.payload}`).addClass(data.name === name ? 'ownMessage' : '')
}

function seedChat() {
  for (let i = 0 ; i < 25; i++) {
    $('#messages').append($('<li>').text(`${i}: filler message!`) )
  }
}