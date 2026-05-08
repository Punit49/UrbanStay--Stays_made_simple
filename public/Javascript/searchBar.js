const countryTemplate = document.querySelector("[data-countrySearch]");
const searchBarContainer = document.querySelector(".searchBarContainer");
const searchBarInput = document.querySelector("#searchBarInput");
let cities = [];

searchBarInput.addEventListener("focus", () => {
    searchBarContainer.classList.remove("hide");
});

searchBarInput.addEventListener("blur", () => {
    setTimeout(() => {
        searchBarContainer.classList.add("hide");
    }, 150);
});

searchBarInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();

    setTimeout(() => {
        cities.forEach(city => {
            const isMatch = !value || city.cityName.includes(value) || city.countryName.includes(value);
            city.element.classList.toggle("hide", !isMatch);
        }); 
    }, 300);   
});

async function searchListingByCity(){
    const res = await fetch("/api/listings");
    const data = await res.json();
    
    const listings = [...new Map(data.map(item => [
            `${item.location}, ${item.country}`, item
        ])).values()
    ];

    cities = listings.map(listing => {
        const listingItem = countryTemplate.content.firstElementChild.cloneNode(true);
        const cityName = listingItem.querySelector(".citySearchBody");
        const countryName = listingItem.querySelector(".countrySearchBody");
        cityName.textContent = `${listing.location}, `;  
        countryName.textContent = listing.country;  
        searchBarContainer.append(listingItem);

        listingItem.addEventListener("click", () => {
            searchBarInput.value = `${listing.location}, ${listing.country}`;
        });

        return {
            element: listingItem, 
            cityName: cityName.textContent.toLowerCase(),
            countryName: countryName.textContent.toLowerCase()
        };
    });
}

searchListingByCity();

// Search Listings
const searchBtn = document.querySelector(".searchBtn");
import listingCardTemplate from "./listingCard.js";

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const value = searchBarInput.value.trim();
    const res = await fetch(`/api/search?q=${value}`);
    const data = await res.json();
    document.querySelector("#categoryLabel").textContent = value;
    listingCardTemplate(value, data);
});

