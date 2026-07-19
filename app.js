const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", function(){

  const keyword = this.value.toLowerCase();

  document.querySelectorAll(".card").forEach(card=>{

    const text = card.innerText.toLowerCase();

    if(text.includes(keyword)){
      card.style.display="flex";
    }else{
      card.style.display="none";
    }

  });

});
