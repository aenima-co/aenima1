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
  const filtro = apenasDestaque
    ? '?filters[destaque]=true&sort=ordem&populate=*'
    : '?sort=ordem&populate=*'
  const res = await fetch(`${API_URL}/projetos${filtro}`)
  const data = await res.json()
  return data.data
}

export async function getPosts(apenasDestaque = false) {
  const filtro = apenasDestaque
    ? '?filters[destaque]=true&sort=ordem&populate=*'
    : '?sort=ordem&populate=*'
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
  const res = await fetch(
    `${API_URL}/home` +
    `?populate[0]=hero.imagem_fundo` +
    `&populate[1]=hero.imagem_fundo_mobile` +
    `&populate[2]=hero.botao_principal` +
    `&populate[3]=hero.memberCard` +
    `&populate[4]=hero.memberCard.members_image` +
    `&populate[5]=botao_projeto` +
    `&populate[6]=secao_about_preview` +
    `&populate[7]=secao_about_preview.icone`
  )
  if (!res.ok) {
    console.error('[getHome] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}

export async function getDemoReel() {
  const res = await fetch(
    `${API_URL}/demo-reel` +
    `?populate[0]=demo_titulo` +
    `&populate[1]=stickers`
  )
  if (!res.ok) {
    console.error('[getDemoReel] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}

export async function getFooter() {
  const res = await fetch(
    `${API_URL}/footer` +
    `?populate[0]=background` +
    `&populate[1]=backmobile` +
    `&populate[2]=arrow_icon` +
    `&populate[3]=logo` +
    `&populate[4]=redes_sociais` +
    `&populate[5]=memberCard` +
    `&populate[6]=memberCard.members_image`
  )
  if (!res.ok) {
    console.error('[getFooter] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}

export async function getAboutPage() {
  const res = await fetch(
    `${API_URL}/about-page` +
    `?populate[0]=about_description` +
    `&populate[1]=about_description.icon` +
    `&populate[2]=members_detail` +
    `&populate[3]=members_detail.member_pic`
  )
  if (!res.ok) {
    console.error('[getAboutPage] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}

export async function getValues() {
  const res = await fetch(`${API_URL}/values?sort=order&populate=*`)
  if (!res.ok) {
    console.error('[getValues] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}

export async function getTeamMembers() {
  const res = await fetch(`${API_URL}/team-members?sort=order&populate=*`)
  if (!res.ok) {
    console.error('[getTeamMembers] erro HTTP:', res.status)
    return null
  }
  const data = await res.json()
  return data.data
}