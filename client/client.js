
let name = '';
let timeLastOwnTyping = new Date().getTime();
// console.log('time at load', timeLastOwnTyping)

$(function () {
  const socket = io('http://socket.tylersayvetz.com')

  $('#input').submit(function (e) {
    e.preventDefault()

    // if ($('#messages > li').children().length === 0) {
    //   seedChat();
    // }

    scrollToBottom();

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
    getUserName();
  })

  socket.on('chat-message', function (data) {
    appendMessage(data, false);
  })

  socket.on('get-name', function (data) {
    // console.log('got a name prompt')
    $('#messages').append($('<li>').text(data))
    newChatter();
  })

  socket.on('server-message', function (data) {
    appendMessage(data , true);
  })

  socket.on('typing-message', function (data) {
    $('#status').text(`${data} is typing...`)
    typingTimeout();
  })

  async function typingTimeout() {
    setTimeout(() => {
      $('#status').text('') 
    }, 1000)
  }

  //handle a new person entering the room
  async function newChatter() {
    while (name === '') {
      setName();
    }
    const data = {
      name: name,
    }
    socket.emit('new-chatter', data)
  }

  function getUserName() {
    setName();
  }

  function setName() {
    name = window.prompt('What is your name?:', 'Enter Name')
    $('#message').attr('placeholder', name);
  }

  function atBottom() {
    return window.scrollY + window.innerHeight === $(document).height();
  }

  function scrollToBottom() {
    window.scroll(0, $(document).height())
  }

  function appendMessage(data, server) {
    if (atBottom()) {
      $('#messages').append(messageTemplate(data, server))

      scrollToBottom();
    } else {
      $('#messages').append(messageTemplate(data, server))
    }
  }

  $('#input').on('keydown', (e) => {
    let now = new Date().getTime();
    if (now > timeLastOwnTyping + 1000 && e.target.value !== '') {
      timeLastOwnTyping = now;
      socket.emit('typing', name)
    }

  })

})

