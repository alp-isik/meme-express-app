function openMemeDetails(memeId) {
  fetch("/meme", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: memeId }),
  })
    .then((res) => {
      if (res.redirected) {
        window.location.href = res.url;
      }
    })
    .catch((err) => console.error(err));
}
