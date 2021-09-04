const clientId = "d4a860eeaa0e46358dd0a6335f66246b";
const clientSecret = "1a80b69d9cd0414fa15e61d2a6bb1280";

async function getToken() {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  return data.access_token;
}

async function getReleases(token) {
  const limit = 20;

  const result = await fetch(
    `https://api.spotify.com/v1/browse/new-releases?country=GB&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    }
  );

  const data = await result.json();
  return data.albums;
}

function createColumn(album, artist, img, url) {
  const nodeTitle = document.createTextNode(album);
  const nodeArtist = document.createTextNode(artist);

  const cardTitle = document.createElement("h5");
  cardTitle.appendChild(nodeTitle);
  cardTitle.classList.add("card-title");

  const cardArtist = document.createElement("h6");
  cardArtist.classList.add("card-text");
  cardArtist.appendChild(nodeArtist);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardArtist);

  const cardImage = document.createElement("img");
  cardImage.classList.add("card-img-top");
  cardImage.src = img;

  const card = document.createElement("div");
  card.classList.add("card");
  card.appendChild(cardImage);
  card.appendChild(cardBody);

  const column = document.createElement("div");
  column.classList.add("col-md-3");
  column.appendChild(card);
  column.addEventListener("click", function () {
    window.open(url, "_blank");
  });

  return column;
}

(async () => {
  const token = await getToken();
  const releases = await getReleases(token);

  releases.items
    .map((item) =>
      createColumn(
        item.name,
        item.artists[0].name,
        item.images[1].url,
        item.external_urls.spotify
      )
    )
    .forEach((column) => {
      document.getElementById("render").appendChild(column);
    });
})();
