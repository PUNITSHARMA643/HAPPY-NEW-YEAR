
document.addEventListener("DOMContentLoaded", function() {
    const block4 = document.getElementById("block4");
    const block5 = document.getElementById("block5");

    const block4Rect = block4.getBoundingClientRect();
    const block5Rect = block5.getBoundingClientRect();

    const distance = block4Rect.left - block5Rect.left;

    block5.style.transition = "transform 2s";
    block5.style.transform = `translateX(${distance}px)`;

    block5.addEventListener("transitionend", () => {
        block4.textContent = "5";
        block5.textContent = "4";
        block5.style.transform = "translateX(0)";
    });
});
