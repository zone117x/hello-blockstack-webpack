import * as blockstack from 'blockstack'

window.blockstack = blockstack

const appConfig = new blockstack.AppConfig(['store_write', 'publish_data'])
const userSession = new blockstack.UserSession({ 
  appConfig: appConfig
})

document.addEventListener('DOMContentLoaded', function () {

  document.getElementById('signin-button').addEventListener('click', function (event) {
    event.preventDefault()
    userSession.redirectToSignIn()
  })

  document.getElementById('signout-button').addEventListener('click', function (event) {
    event.preventDefault()
    userSession.signUserOut(window.origin)
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

  if (userSession.isSignInPending()) {
    userSession.handlePendingSignIn().then(function () {
      window.location = window.origin
    }).catch((error) => {
      window.alert(`Unexpected error in handlePendingSignIn! ${error}`)
    })
  } else if (userSession.isUserSignedIn()) { // User is already signed in. 
    //const userData = userSession.loadUserData()
    const userData = blockstack.loadUserData();
    console.log(userData.identityAddress);
    console.log(userData)
    var profile = userData.profile
    showProfile(profile)
  }

  function showStatus() {
    userSession.getFile('status.txt').then((statusMsg) => {
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
    userSession.getFile('status.txt', options).then((msg) => {
      console.log(`Got status for ${options.username}: ${msg}`)
    })
  }

  document.getElementById('updateStatus').onclick = async () => {
    var statusMsg = document.getElementById('status').value
    var options = { encrypt: true }
    userSession.putFile('status.txt', statusMsg, options).then(() => {
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
      userSession.putFile(file.name, buffer, {
        contentType: file.type,
        encrypt: false,
      }).then((url) => {
        console.log(`Uploaded: ${url}`)
      })
    }
    reader.readAsDataURL(file)
  }

})