function messageTemplate(data, server) {
  return $('<li>').html(buildMessage(data, server)).addClass(ownMessage(data.name) ? 'ownMessage' : '')
}

function buildMessage(data, serverMessage) {
  let URLTest = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/\/=]*)/g;

  //replace the url text with a link and store link data
  const links = []
  let newMessage = data.payload.replace(URLTest, (url) => {
    const favicon = getFaviconUrl(url);
    const short = shortUrl(url)
    links.push({url, favicon, short })
    return `<a href=${url}>${short}</a>`
  })
   if (links.length) {
      newMessage = `${newMessage} 
      ${links.map(link => {
        return (
          `<div class="link-preview">
            <img src="${link.favicon}" class="favicon"/>
            <a href="${link.url}">${link.short}</a>
          </div>`
        )
      }).join('')} `
   }
  return ownMessage(data.name) ? newMessage : `${data.name}: ${newMessage}`
}
 
function getFaviconUrl(url) {
  //https://www.google.com/s2/favicons?domain=stackoverflow.com
  const baseUrl = shortUrl(url)
  return 'https://www.google.com/s2/favicons?domain=' + baseUrl
}

function shortUrl(url) {
  return url.split('/').slice(2,3).join('/')
}

function ownMessage(str) {
  return str === name
}

function seedChat() {
  for (let i = 0 ; i < 25; i++) {
    $('#messages').append($('<li>').text(`${i}: filler message!`) )
  }
}