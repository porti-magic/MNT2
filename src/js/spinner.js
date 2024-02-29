const spinnerHTML =
`<div class="position-absolute top-50 start-50 translate-middle" id="spinnerID">
  <div class="spinner-border" role = "status">
    <span class="visually-hidden">Loading...</span>
   </div >
</div > `

export function addSpinner (element, id = 'spinnerID') {
  element.innerHTML += (spinnerHTML.replace('spinnerID', id))
  return id
}

export function deleteSpinner (id) {
  document.getElementById(id).remove()
}
