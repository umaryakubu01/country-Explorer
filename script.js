const API_URL = "https://api.restcountries.com/countries/v5?limit=100";

const API_KEY = "rc_live_b509b39c31ab4d33ad1c45b0608cc612";

const countriesContainer = document.getElementById("countries-container");

const loading = document.getElementById("loading");

const error = document.getElementById("error");

const searchInput = document.getElementById("search-input");

let countries = [];

// fetch
async function fetchCountries() {
  loading.classList.remove("hidden");
  error.classList.add("hidden");

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();

    countries = result.data.objects;

    displayCountries(countries);
  } catch (err) {
    console.error(err);
    error.classList.remove("hidden");
  } finally {
    loading.classList.add("hidden");
  }
}

// display countries
function displayCountries(list) {
  countriesContainer.innerHTML = "";

  list.forEach((country) => {
    const card = document.createElement("div");

    card.className = "country-card";

    card.innerHTML = `
      <img
        src="${country.flag.url_svg}"
        alt="${country.flag.description || country.names.common}"
      >

      <h2>${country.names.common}</h2>

      <p>
        Capital:
        ${country.capitals?.[0]?.name || "N/A"}
      </p>

      <p>
        Population:
        ${country.population?.toLocaleString() || "N/A"}
      </p>

      <p>
        Region:
        ${country.region || "N/A"}
      </p>
    `;

    // flag fallback
    const flag = card.querySelector("img");

    flag.addEventListener("error", () => {
      if (country.flag.url_png) {
        flag.src = country.flag.url_png;
      }
    });

    // click card
    card.addEventListener("click", () => {
      showCountryDetails(country);
    });

    countriesContainer.appendChild(card);
  });
}

// show additional information
function showCountryDetails(country) {
  const modal = document.createElement("div");

  modal.className = "country-modal";

  modal.innerHTML = `
    <div class="country-modal-content">

      <button class="close-modal">&times;</button>

      <img
        class="modal-flag"
        src="${country.flag.url_png}"
        alt="${country.names.common} flag"
      >

      <h2>${country.names.common}</h2>

      <p>
        <strong>Official Name:</strong>
        ${country.names.official || "N/A"}
      </p>

      <p>
        <strong>Capital:</strong>
        ${country.capitals?.[0]?.name || "N/A"}
      </p>

      <p>
        <strong>Population:</strong>
        ${country.population?.toLocaleString() || "N/A"}
      </p>

      <p>
        <strong>Region:</strong>
        ${country.region || "N/A"}
      </p>

      <p>
        <strong>Subregion:</strong>
        ${country.subregion || "N/A"}
      </p>

      <p>
        <strong>Country Code:</strong>
        ${country.codes?.alpha_2 || "N/A"}
      </p>

    </div>
  `;

  document.body.appendChild(modal);

  // close button
  const closeButton = modal.querySelector(".close-modal");

  closeButton.addEventListener("click", () => {
    modal.remove();
  });

  // close by clicking outside the modal
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

// search
searchInput.addEventListener("input", () => {
  const search = searchInput.value.toLowerCase().trim();

  const filtered = countries.filter((country) =>
    country.names.common.toLowerCase().includes(search),
  );

  displayCountries(filtered);
});

// start
fetchCountries();
