const awesomeLists = [
  {
    title: "Awesome Canada Travel",
    description:
      "A curated list of resources, apps, communities, guides, and tools for traveling in Canada.",
    link: "https://github.com/brandontravel/awesome-canada-travel",
    category: "Countries"
  },
  {
    title: "Awesome Digital Nomads",
    description:
      "A curated list of awesome resources, tools, communities, and tips for digital nomads who want to embrace a location-independent lifestyle.",
    link: "https://github.com/brandontravel/awesome-digital-nomads",
    category: "Meta"
  },
  {
    title: "Awesome Travel Hacking",
    description:
      "A curated list of awesome resources, tools, and strategies for travel hacking, designed to help you save money, earn points and miles, and travel the world for less.",
    link: "https://github.com/brandontravel/awesome-travel-hacking",
    category: "Meta"
  },
  {
    title: "Awesome Solo Traveler",
    description:
      "A curated list of awesome resources, tools, blogs, communities, and platforms for solo travelers.",
    link: "https://github.com/brandontravel/awesome-solo-traveler",
    category: "Meta"
  }
];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentPage = 1;
const itemsPerPage = 12;
let currentView = "all";

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

function toggleFavorite(title) {
  if (favorites.includes(title)) {
    favorites = favorites.filter((fav) => fav !== title);
  } else {
    favorites.push(title);
  }
  saveFavorites();
  displayLists();
}

function shareList(title, link) {
  if (navigator.share) {
    navigator
      .share({
        title: `Check out ${title}`,
        text: `I found this awesome list: ${title}`,
        url: link
      })
      .catch(console.error);
  } else {
    alert("Sharing not supported on this browser.");
  }
}

function displayLists() {
  const grid = document.getElementById("awesomeGrid");
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const categoryValue = document.getElementById("categoryFilter").value;
  const sortOption = document.getElementById("sortOptions").value;

  let dataSource = awesomeLists.filter((list) => {
    const matchesSearch =
      list.title.toLowerCase().includes(searchValue) ||
      list.description.toLowerCase().includes(searchValue);
    const matchesCategory = !categoryValue || list.category === categoryValue;
    return (
      matchesSearch &&
      matchesCategory &&
      (currentView !== "favorites" || favorites.includes(list.title))
    );
  });

  if (sortOption === "title") {
    dataSource.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "newest") {
    dataSource.sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleLists = dataSource.slice(startIndex, endIndex);

  grid.innerHTML = "";

  if (visibleLists.length === 0) {
    grid.innerHTML = `<p class="text-center text-gray-500">No lists to display.</p>`;
    return;
  }

  visibleLists.forEach((list) => {
    const isFavorited = favorites.includes(list.title);
    const listItem = document.createElement("div");
    listItem.className =
      "p-6 bg-white rounded-lg shadow-md border border-gray-200";
    listItem.innerHTML = `
                    <div class="flex flex-col h-full">
                        <h2 class="text-xl font-semibold mb-2">${
                          list.title
                        }</h2>
                        <p class="mb-2 text-sm text-blue-600">Category: ${
                          list.category
                        }</p>
                        <p class="mb-4 text-gray-700">${list.description}</p>
                        <div class="mt-auto flex justify-between items-center gap-2">
                            <button onclick="toggleFavorite('${
                              list.title
                            }')" class="text-red-600 flex items-center gap-1">
                                <i data-lucide="heart"></i> ${
                                  isFavorited ? "Unfavorite" : "Favorite"
                                }
                            </button>
                            <button onclick="shareList('${list.title}', '${
      list.link
    }')" class="text-green-600 flex items-center gap-1">
                                <i data-lucide="share-2"></i> Share
                            </button>
                            <a href="${
                              list.link
                            }" target="_blank" class="text-blue-600 hover:underline flex items-center gap-1">
                                <i data-lucide="external-link"></i> View
                            </a>
                        </div>
                    </div>
                `;
    grid.appendChild(listItem);
  });

  displayPagination(dataSource);
  lucide.createIcons();
}

function displayPagination(dataSource) {
  const controls = document.getElementById("paginationControls");
  const totalPages = Math.ceil(dataSource.length / itemsPerPage);
  controls.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.className = `px-3 py-1 border rounded ${
      i === currentPage ? "bg-blue-500 text-white" : ""
    }`;
    button.onclick = () => {
      currentPage = i;
      displayLists();
    };
    controls.appendChild(button);
  }
}

function showLists(view) {
  currentView = view;
  document
    .getElementById("allTab")
    .classList.toggle("bg-blue-500", view === "all");
  document
    .getElementById("favoritesTab")
    .classList.toggle("bg-blue-500", view === "favorites");
  displayLists();
}

function toggleDarkMode() {
  const html = document.documentElement;
  if (html.classList.contains("light")) {
    html.classList.replace("light", "dark");
    document.body.classList.replace("bg-gray-100", "bg-gray-900");
  } else {
    html.classList.replace("dark", "light");
    document.body.classList.replace("bg-gray-900", "bg-gray-100");
  }
}

function sortLists() {
  currentPage = 1;
  displayLists();
}

function filterLists() {
  currentPage = 1;
  displayLists();
}

document
  .getElementById("toggleDarkMode")
  .addEventListener("click", toggleDarkMode);
document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  displayLists();
});
