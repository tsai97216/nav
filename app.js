const navMenu = document.getElementById("js-nav-menu");
const mainContent = document.getElementById("js-main-content");


// =====================
// Fallback Logo 顏色
// =====================

const fallbackColors = [
  "linear-gradient(135deg,#3b82f6,#1d4ed8)",
  "linear-gradient(135deg,#10b981,#047857)",
  "linear-gradient(135deg,#8b5cf6,#6d28d9)",
  "linear-gradient(135deg,#f59e0b,#b45309)",
  "linear-gradient(135deg,#ec4899,#be185d)",
  "linear-gradient(135deg,#14b8a6,#0f766e)",
  "linear-gradient(135deg,#ef4444,#b91c1c)"
];


function stringToColorIndex(str){

    let hash = 0;

    for(let i=0;i<str.length;i++){

        hash =
        str.charCodeAt(i)
        +
        ((hash<<5)-hash);

    }

    return Math.abs(hash)%fallbackColors.length;

}



// =====================
// 建立卡片
// =====================


function createCard(link){


    let domain="";


    try{

        if(link.url.startsWith("http")){

            domain =
            new URL(link.url).hostname;

        }

    }catch(e){}



    const color =
    fallbackColors[
        stringToColorIndex(link.title)
    ];


    const letter =
    link.title.charAt(0);



    const copyBadge =
    link.is_copy
    ?
    `<span class="copy-badge">
    <i class="fa-regular fa-copy"></i> 腳本
    </span>`
    :
    "";



    const copyData =
    link.is_copy
    ?
    `data-copy="${encodeURIComponent(link.copy_content)}"`
    :
    "";



    const favicon =
    domain
    ?
    `
    <img
    class="card-logo"
    src="https://www.google.com/s2/favicons?sz=128&domain=${domain}"
    onerror="
    this.onerror=null;
    this.src='https://icon.horse/icon/${domain}'
    "
    >
    `
    :
    "";



    return `

    <div class="card"
    data-url="${link.url}"
    data-copy-enabled="${link.is_copy||false}"
    ${copyData}
    >


        ${copyBadge}


        <div class="card-top">


            <div class="card-logo-container"
            style="background:${color}">

                ${favicon}


                <div class="avatar-fallback"
                style="${domain?'display:none':''}">
                    ${letter}
                </div>

            </div>



            <div class="card-title">
                ${link.title}
            </div>


        </div>


        <div class="card-desc">
            ${link.description}
        </div>


    </div>

    `;

}



// =====================
// 載入資料
// =====================


fetch("data.json")

.then(res=>res.json())

.then(data=>{


data.forEach((section,index)=>{


    const id =
    `section-${index}`;



    // Sidebar

    const nav =
    document.createElement("a");


    nav.className =
    "nav-item"
    +
    (index===0?" active":"");


    nav.href="#"+id;


    nav.innerHTML =
    `
    <i class="${section.icon}"></i>
    <span>${section.taxonomy}</span>
    `;


    navMenu.appendChild(nav);





    // Section


    const sectionDom =
    document.createElement("section");


    sectionDom.className="section";

    sectionDom.id=id;



    let html=
    `

    <div class="section-header">

    <i class="${section.icon}"></i>

    <span>
    ${section.taxonomy}
    </span>

    </div>

    `;





    // 有子分類

    if(section.list){


        section.list.forEach(group=>{


            html+=`

            <div class="term-container">

            <div class="term-title">
            ${group.term}
            </div>


            <div class="grid">

            `;


            group.links.forEach(link=>{

                html+=createCard(link);

            });



            html+=`

            </div>
            </div>

            `;


        });



    }



    // 無子分類

    else if(section.links){


        html+=`

        <div class="grid">

        `;


        section.links.forEach(link=>{

            html+=createCard(link);

        });


        html+=`

        </div>

        `;


    }



    sectionDom.innerHTML=html;


    mainContent.appendChild(sectionDom);



});



// =====================
// 搜尋
// =====================


const search =
document.getElementById("search-input");


search.addEventListener("input",()=>{


    const keyword =
    search.value
    .toLowerCase();



    document
    .querySelectorAll(".card")
    .forEach(card=>{


        const text =
        card.innerText
        .toLowerCase();



        card.style.display =
        text.includes(keyword)
        ?
        "flex"
        :
        "none";


    });


});




// =====================
// 點擊事件
// =====================


mainContent.addEventListener("click",e=>{


const card =
e.target.closest(".card");


if(!card)
return;



const copy =
card.dataset.copyEnabled==="true";



if(copy){


    const text =
    decodeURIComponent(
        card.dataset.copy
    );


    navigator.clipboard
    .writeText(text)
    .then(()=>{


        const toast =
        document.getElementById("js-toast");


        toast.classList.add("show");


        setTimeout(()=>{

            toast.classList.remove("show");

        },5000);


    });



}


else{


    const url =
    card.dataset.url;


    if(url && url!=="javascript:void(0);"){

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

    }


}



});





// =====================
// Scroll 導覽
// =====================


window.addEventListener("scroll",()=>{


let current="";


document
.querySelectorAll(".section")
.forEach(section=>{


    if(
    pageYOffset >= section.offsetTop-60
    ){

        current =
        section.id;

    }


});



document
.querySelectorAll(".nav-item")
.forEach(item=>{


    item.classList.remove("active");


    if(
    item.href.endsWith("#"+current)
    ){

        item.classList.add("active");

    }


});


});



})

.catch(err=>{

console.error(
"data.json 載入失敗:",
err
);

});
