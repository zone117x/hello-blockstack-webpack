//import { isUserSignedIn, isSignInPending, handlePendingSignIn } from 'blockstack/lib/auth/authApp'
import { isUserSignedIn, isSignInPending, handlePendingSignIn } from 'blockstack'

if (isUserSignedIn()) {
  window.location = window.location.origin
} else if (isSignInPending()) {
  handlePendingSignIn().then(function() {
    window.location = window.location.origin
  })
} else {
  window.location = window.location.origin
}
