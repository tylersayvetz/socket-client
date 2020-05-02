console.log(window.innerWidth)

window.addEventListener('resize', () => {
  console.log('window width', window.innerWidth)
})
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

  $('#changeName').on('click', () => {
    console.log("got here")
    getUserName();
  })

  socket.on('chat-message', function (data) {
    // console.log('received chat message:', data)
    $('#messages').append(messageTemplate(data, name))
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  })

  socket.on('get-name', function (data) {
    console.log('got a name prompt')
    $('#messages').append($('<li>').text(data))
    newChatter();
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

  async function newChatter() {
    while (name === '') {
      setName();
    }
    const data = {
      name: name,
    }
    socket.emit('new-chatter', data)
  }

  async function getUserName() {
    setName();
  }

  function setName() {
    name = window.prompt('What is your name?:', 'Enter Name')
    $('#message').attr('placeholder', name);
  }

  $('#input').on('keydown', (e) => {
    let now = new Date().getTime();
    if (now > timeLastOwnTyping + 1000 && e.target.value !== '') {
      timeLastOwnTyping = now;
      socket.emit('typing', name)
    }

  })

})

