import blockstack from 'blockstack'

import { redirectToSignIn } from 'blockstack/lib/auth/authApp'

window.blockstack = blockstack

document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('signin-button').addEventListener('click', function (event) {
    event.preventDefault()
    blockstack.redirectToSignIn(
      window.origin,
      window.origin + '/manifest.json',
      ['store_write', 'publish_data']
    )
  })

  document.getElementById('signout-button').addEventListener('click', function (event) {
    event.preventDefault()
    blockstack.signUserOut(window.origin)
  })

  function showProfile(profile) {
    var person = new blockstack.Person(profile)
    document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
    if (person.avatarUrl()) {
      document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
    }
    document.getElementById('section-1').style.display = 'none'
    document.getElementById('section-2').style.display = 'block'
    showStatus()
  }

  if (blockstack.isSignInPending()) {
    blockstack.handlePendingSignIn().then(function () {
      window.location = window.origin
    }).catch((error) => {
      window.alert(`Unexpected error in handlePendingSignIn! ${error}`)
    })
  } else if (blockstack.isUserSignedIn()) { // User is already signed in. 
    var profile = blockstack.loadUserData().profile
    showProfile(profile)
  }

  function showStatus() {
    blockstack.getFile('status.txt').then((statusMsg) => {
      if (statusMsg) {
        console.log('Got status message: ' + statusMsg)
      } else {
        console.log('Status file does not exist!')
      }
      document.getElementById('currentStatus').innerText = statusMsg
    }).catch((error) => {
      console.log('Error reading file: ' + error)
      document.getElementById('currentStatus').innerText = 'Error reading status ' + error
    })
  }

  function getStatusForUser(username) {
    var options = {
      username: username,
      decrypt: false
    }
    blockstack.getFile('status.txt', options).then((msg) => {
      console.log(`Got status for ${options.username}: ${msg}`)
    })
  }

  document.getElementById('updateStatus').onclick = () => {
    var statusMsg = document.getElementById('status').value
    var options = { encrypt: false }
    blockstack.putFile('status.txt', statusMsg, options).then(() => {
      console.log('uploaded publicly accessible file!')
      showStatus()
    })
  }

  document.getElementById('photoUpload').onchange = (event) => {
    if (!event.target.files) return
    const file = event.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const buffer = new Uint8Array(reader.result)
      blockstack.putFile(file.name, buffer, {
        contentType: file.type,
        encrypt: false,
      }).then((url) => {
        console.log(`Uploaded: ${url}`)
      })
    }
    reader.readAsDataURL(file)
  }


  // testHmac('the shared secret key here', 'the message to hash here')
  async function testHmac(key, message) {

    const getUtf8Bytes = str =>
      new Uint8Array(
        [...unescape(encodeURIComponent(str))].map(c => c.charCodeAt())
      );

    const keyBytes = getUtf8Bytes(key);
    const cryptoKey = await crypto.subtle.importKey(
      'raw', keyBytes, { name: 'HMAC', hash: 'SHA-256' },
      true, ['sign']
    );

    const messageBytes = getUtf8Bytes(message);
    const sig = await crypto.subtle.sign('HMAC', cryptoKey, messageBytes);

    // to lowercase hexits
    const hex = [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(`HEX: ${hex}`)

    // to base64
    const b64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
    console.log(`B64: ${b64}`)
    return b64;
  }


})