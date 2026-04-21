const categoryLabels = document.querySelectorAll(".category");

categoryLabels.forEach(category => {
    category.addEventListener("click", (e) => {
        e.preventDefault(); //why
        const preCategory = document.querySelector(".active");
        if(preCategory){
            preCategory.classList.remove("active");
        }
        category.classList.add("active");
        const categoryName = category.querySelector(".categoryLabel").textContent.trim();
        history.pushState({}, "", `/api/listings?category=${categoryName}`);
        getFIlteredData(categoryName);
    });
});

async function getFIlteredData(category){
    const res = await fetch(`/api/listings?category=${category}`);
    const filteredListings = await res.json();
    const preListings = document.querySelector(".cardBox");
    const categoryLabel = document.querySelector("#categoryLabel");

    preListings.innerHTML = "";
    categoryLabel.textContent = category;

    filteredListings.forEach(listing => {
        preListings.innerHTML += `
            <a href="/listings/${listing._id}">
                <div class="col listingCard">
                    <div class="card">
                        <img src=${listing.image.url} class="card-img-top listingImage" alt="listingImage">
                        <div class="card-img-overlay">
                            ${listing.description}
                        </div>
                        <div class="listingCardBody">
                            <h5 class="card-title"> ${listing.title} </h5>
                            <div class="priceDetails">
                                <span class="priceWithGst cardDetails invisible">2000</span>
                                <span class="listingPrice cardDetails"> ${listing.price.toLocaleString("en-IN", {style: "currency", currency: "INR", maximumFractionDigits: 0})}> </span>
                                <span class="cardDetails">/ night</span>
                                <span class="cardDetails taxInfo invisible"> &nbsp; <b>+18% GST</b> </span>
                            </div>
                            <span class="listingLocation cardDetails"> ${listing.location}, </span>
                            <span class="listingCountry cardDetails"> ${listing.country}</span>
                        </div>
                    </div> 
                </div>
            </a>
        `
    });
}