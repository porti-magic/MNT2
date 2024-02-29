// import * as bootstrap from '../../node_modules/bootstrap/dist/js/bootstrap.min.js'
/* global bootstrap */
export function createToast ({ id, header, time, body }) {
  const finalID = id.toString() === '' ? 'liveToast' : id
  const toastHTML =
    `<div class="position-fixed top-0 end-0 p-3" >
  <div id="${finalID}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="toast-header">
      
      <strong class="me-auto">${header.toString()}</strong>
      <small>${time.toString()}</small>
      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
    <div class="toast-body">
      ${body}
    </div>
  </div>
</div>`
  document.body.innerHTML += toastHTML
  // .insertAdjacentElement('beforeend', toastHTML)
  return finalID
}

export function showToast (id) {
  //const toast = document.getElementById(id)
  //boostrap.Toast.getOrCreateInstance(toast).Show()
  const toastElement = document.getElementById(id)// Replace 'id' with your actual element ID
  const toastInstance = new bootstrap.Toast(toastElement)
  toastInstance.show()
}

export function hideToast (id) {
  const toast = document.getElementById(id)
  bootstrap.Toast.getOrCreateInstance(toast).dispose()
}
