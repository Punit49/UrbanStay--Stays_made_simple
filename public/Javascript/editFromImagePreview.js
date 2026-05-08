const curImgInfo = document.querySelector(".curImgInfo");
const fileInput = document.querySelector("#imageInput");
const curImg = document.querySelector("#curImg");

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if(file){
        const imageUrl = URL.createObjectURL(file);
        curImg.src = imageUrl;
        curImgInfo.textContent = `New Image: ${file.name}`;
    }
});