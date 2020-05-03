function messageTemplate(data, name, server) {
  return $('<li>').html(buildMessage(data, server)).addClass(data.name === name ? 'ownMessage' : '')
}

function buildMessage(data, serverMessage) {
  let URLTest = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/;

  const newMessage = data.payload.replace(URLTest, (url) => {
    return `<a href="${url}">${url}</a>`
  })

  return name === data.name ? newMessage : `${data.name}: ${newMessage}`
}

function seedChat() {
  for (let i = 0 ; i < 25; i++) {
    $('#messages').append($('<li>').text(`${i}: filler message!`) )
  }
}