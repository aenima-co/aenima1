const API_URL = 'http://localhost:1337/api'

export async function getBannerTopo() {
  const res = await fetch(`${API_URL}/bannertopo`)
  const data = await res.json()
  return data.data
}

export async function getNavbar() {
  const res = await fetch(`${API_URL}/navebar?populate=*`)
  const data = await res.json()
  return data.data
}

export async function getMenuItens() {
  const res = await fetch(`${API_URL}/menu-items?sort=ordem`)
  const data = await res.json()
//   console.log('menu-items:', data) // para debugar
  return data.data
}

export async function getProjetos(apenasDestaque = false) {
  const filtro = apenasDestaque ? '?filters[destaque]=true&sort=ordem' : '?sort=ordem'
  const res = await fetch(`${API_URL}/projetos${filtro}`)
  const data = await res.json()
  return data.data
}

export async function getPosts(apenasDestaque = false) {
  const filtro = apenasDestaque ? '?filters[destaque]=true&sort=ordem' : '?sort=ordem'
  const res = await fetch(`${API_URL}/posts${filtro}`)
  const data = await res.json()
  return data.data
}

export async function getEspecialistas() {
  const res = await fetch(`${API_URL}/especialistas`)
  const data = await res.json()
  return data.data
}

export async function getEspecialidades() {
  const res = await fetch(`${API_URL}/especialidades?sort=ordem`)
  const data = await res.json()
  return data.data
}

export async function getHome() {
  const res = await fetch(`${API_URL}/home?populate[hero][populate]=*`)
  const data = await res.json()
  return data.data
}

export async function getFooter() {
  const res = await fetch(`${API_URL}/footer`)
  const data = await res.json()
  return data.data
}