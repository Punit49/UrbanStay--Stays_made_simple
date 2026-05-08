const categoryLabels = document.querySelectorAll(".category");
import listingCardTemplate from "./listingCard.js";

categoryLabels.forEach(category => {
    category.addEventListener("click", (e) => {
        e.preventDefault(); //why
        const preCategory = document.querySelector(".active");
        if(preCategory){
            preCategory.classList.remove("active");
        }
        category.classList.add("active");
        const categoryName = category.querySelector(".categoryLabel").textContent.trim();
        history.pushState({}, "", `/api/listing?category=${categoryName}`);
        getFIlteredData(categoryName);
    });
});

async function getFIlteredData(category){
    const res = await fetch(`/api/listings?category=${category}`);
    const filteredListings = await res.json();
    listingCardTemplate(category, filteredListings);
}