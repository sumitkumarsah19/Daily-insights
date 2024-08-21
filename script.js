const API_KEY = "65335d8efaa9135e6dcaac43f95173bc";
const url = "https://gnews.io/api/v4/search?q=";

window.addEventListener("load", () => fetchNews("india"));

function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  const loadingSpinner = document.getElementById("loading-spinner");
  loadingSpinner.style.display = "block"; // Show spinner
  try {
    const response = await fetch(`${url}${query}&apikey=${API_KEY}`);
    const data = await response.json();
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  } finally {
    loadingSpinner.style.display = "none"; // Hide spinner
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";
  articles.forEach((article) => {
    if (!article.image) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.image;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name}  ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.source.url, "_blank");
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navitem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navitem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});