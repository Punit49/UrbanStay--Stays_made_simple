const locationIcon = document.getElementById("locationSVG");
const compassIcon = document.getElementById("compassSVG");
const GST = 1.18;

window.addEventListener("load", () => {
    locationIcon.classList.add("animateLocationIcon");
    compassIcon.classList.add("animateCompass");
    
    locationIcon.addEventListener("animationend", () => {
        locationIcon.classList.remove("animateLocationIcon");
    });
    
    compassIcon.addEventListener("animationend", () => {
        compassIcon.classList.remove("animateCompass");
    });
});

// Tax Toogle Logic
let cards;
document.addEventListener("DOMContentLoaded", grabListingData);

function grabListingData(){
    cards = [...document.querySelectorAll(".listingCard")].map(card => {
        const priceEl = card.querySelector(".listingPrice");
        return {
            price: priceEl,
            gst: card.querySelector(".priceWithGst"),
            info: card.querySelector(".taxInfo"),
            value: Number(priceEl.textContent.replace(/[₹,]/g, ""))
        }
    });
}

function handleGSTToggle(){
    cards.forEach(card => {
        const price = card.value * GST;
        card.gst.textContent = price.toLocaleString( "en-IN", { 
                style: "currency", 
                currency: "INR", 
                maximumFractionDigits: 0
            });
        card.gst.classList.toggle("hide");
        card.info.classList.toggle("hide");
        card.price.classList.toggle("hide");
    });
}

const taxToggle = document.querySelector(".form-check-input");
if(taxToggle){
    taxToggle.addEventListener("input", handleGSTToggle);
}
