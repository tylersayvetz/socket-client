let name = '';
let timeLastOwnTyping = new Date().getTime();
console.log('time at load', timeLastOwnTyping)

$(function () {
  const socket = io('http://socket.tylersayvetz.com')

  $('#input').submit(function (e) {
    e.preventDefault()
    if ($('#message').val() !== '') {
      const data = {
        name: name,
        payload: $('#message').val()
      }
      socket.emit('chat-message', data)
      $('#message').val('')
      return
    }
  })

  socket.on('chat-message', function (data) {
    let time = new Date().toLocaleTimeString()
    console.log('received chat message:', data)
    $('#messages').append($('<li>').text(`${data.name} (${time}) ${data.payload}`))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  })

  socket.on('get-name', function (data) {
    console.log('got a name prompt')
    $('#messages').append($('<li>').text(data))
    getName();
  })

  socket.on('server-message', function (data) {
    $('#messages').append($('<li>').text(`<Server Message> . ${data.payload}`))
  })

  socket.on('typing-message', function (data) {
    console.log(data, ' is typing..')
    $('#status').text(`${data} is typing...`)
    typingTimeout();
  })

  async function typingTimeout() {
    setTimeout(() => {
      $('#status').text('') 
    }, 1000)
  }

  async function getName() {
    while (name === '') {
      name = window.prompt('What is your name?:', 'Enter Name')
    }
    const data = {
      name: name,
    }
    socket.emit('new-chatter', data)
  }

  $('#input').on('keydown', (e) => {
    let now = new Date().getTime();
    if (now > timeLastOwnTyping + 1000 && e.target.value !== '') {
      timeLastOwnTyping = now;
      socket.emit('typing', name)
    }

  })

})

