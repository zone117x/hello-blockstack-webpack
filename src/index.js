// import blockstack from 'blockstack'

import * as blockstack from 'blockstack/dist/blockstack'

document.addEventListener("DOMContentLoaded", function (event) {
    document.getElementById('signin-button').addEventListener('click', function (event) {
      event.preventDefault()
      blockstack.redirectToSignIn(`${window.location.origin}/auth.html`, undefined, ['store_write', 'email'])
    })
    document.getElementById('signout-button').addEventListener('click', function (event) {
      event.preventDefault()
      blockstack.signUserOut(window.location.href)
    })

    function showProfile(profile) {
      var person = new blockstack.Person(profile)
      document.getElementById('heading-name').innerHTML = person.name() ? person.name() : "Nameless Person"
      if (person.avatarUrl()) {
        document.getElementById('avatar-image').setAttribute('src', person.avatarUrl())
      }
      document.getElementById('section-1').style.display = 'none'
      document.getElementById('section-2').style.display = 'block'
    }

    if (blockstack.isUserSignedIn()) {
      var profile = blockstack.loadUserData().profile
      showProfile(profile)
    } else if (blockstack.isSignInPending()) {
      blockstack.handlePendingSignIn().then(function (userData) {
        window.location = window.location.origin
      })
    }
  })