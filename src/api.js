export async function getWorkPage() {
  const res = await fetch(`${API_URL}/work-page`);

  if (!res.ok) {
    console.error("[getWorkPage] erro HTTP:", res.status);
    return null;
  }

  const data = await res.json();
  return data.data;
}

export async function getWorks() {
  const res = await fetch(
    `${API_URL}/works?populate=cover&sort=createdAt:desc`,
  );

  if (!res.ok) {
    console.error("[getWorks] erro HTTP:", res.status);
    return [];
  }

  const data = await res.json();
  return data.data;
}

export async function getWorkBySlug(slugOrId) {
  const bySlug = await fetch(
    `${API_URL}/works?filters[slug][$eq]=${encodeURIComponent(
      slugOrId,
    )}&populate=*`,
  );

  if (bySlug.ok) {
    const data = await bySlug.json();

    if (data.data?.length) {
      return data.data[0];
    }
  }

  if (!isNaN(slugOrId)) {
    const byId = await fetch(
      `${API_URL}/works?filters[id][$eq]=${encodeURIComponent(
        slugOrId,
      )}&populate=*`,
    );

    if (byId.ok) {
      const data = await byId.json();

      if (data.data?.length) {
        return data.data[0];
      }
    }
  }

  return null;
}

export async function getAboutPage() {
  const res = await fetch(
    `${API_URL}/about-page` +
      `?populate[0]=about_description` +
      `&populate[1]=about_description.icon` +
      `&populate[2]=members_detail` +
      `&populate[3]=members_detail.member_pic`,
  );

  if (!res.ok) {
    console.error("[getAboutPage] erro HTTP:", res.status);
    return null;
  }

  const data = await res.json();
  return data.data;
}
