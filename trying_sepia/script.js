document.addEventListener("DOMContentLoaded",() =>{
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop", 
       "M0,0 C0.488,0.02 0.467,0.286 0.5,0.5 0.532,0.712 0.58,1 1,1"
    );
const slider= document.querySelector(".slider");
const sliderTitle= document.querySelector(".slider-title");
const sliderCounter=document.querySelector(
    ".slider-counter p span:first-child"
);
const sliderItems=document.querySelector(".slider-items");
const sliderPreview= document.querySelector(".slider-preview");
const totalSlides=7;
let activeSlideIndex=1;
let isAnimating=false;
const sliderContent=[
    {name:"serene space", img: "./assets/img-1.jpg"},
    {name:"gentle horizon", img: "./assets/img-2.jpg"},
    {name:"quiet flow", img:"./assets/img-3.jpg"},
    {name:"ethernal light", img:"./assets/img-1.jpg"},
    {name:"calm drift", img:"./assets/img-2.jpg"},
    {name:"subtle balance", img:"./assets/img-3.jpg"},
    {name:"soft whisper", img:"./assets/img-1.jpg"},
];
const clipPath={
    closed: "polygon( 25% 30%,75% 30%,75% 70%, 25% 70%)",
    open: "polygon(0% 0%,100% 0%, 100% 100%, 0% 100%)",
};
const slidePostions={
    prev:{left: "15%",rotation: -90},
    active:{left:"50%",rotation:0},
    next:{left:"85%",rotation:90},
};
function splitTextIntoSpans(element){
    element.innerHtMl=element.innerText
    .split("")
    .map((char)=>`<span>${char===" "? "&nbsp;&nbsp;":char}</span>`)
    .join("");
}
function createAndAnimateTitle(content,direction){
    const newTitle= document.createElement("h1");
    newTitle.innerText=content.name;
    sliderTitle.appendChild(newTitle);
    splitTextIntoSpans(newTitle);

    const yOffset =direction==="next"? 60: -60;
    gsap.set(newTitle.querySelectorAll("span"),{y: yOffset});
    gsap.to(newTitle.querySelectorAll("span"),{
        y:0,
        duration:1.25,
        stagger:0.02,
        ease:"hop",
        delay:0.25,
    });
    const currentTitle=sliderTitle.querySelector("h1:not(:last-child)");
    if (currentTitle){
        gsap.to(currentTitle.querySelectorAll("span"),{
            y: -yOffset,
            duration:1.25,
            stagger:0.02,
            ease:"hop",
            delay:0.25,
            onComplete:()=>currentTitle.remove(),
        });
    }
}
function createSlide(content, className){
    const slide=document.createElement("div");
    slide.className=`slider-container ${className}`;
    slide.innerHTML=`<div class="slide-img"><img src="${content.img}" alt="${content.name}"></div>`;
    return slide;
}
function getSlideIndex(increment){
    return ((activeSlideIndex+increment-1+totalSlides)%totalSlides)+1;

}
function updateCounterAndHighlight(index){
    sliderCounter.textContent=index;
    sliderItems.querySelectorAll("p").forEach((item, i)=> item.classList.toggle("activeItem",i === index-1)
);
}
function updatePreviewImage(content){
    const newImage =document.createElement("img");
    newImage.src=content.img;
    newImage.alt=content.name;
    sliderPreview.appendChild(newImage);

    gsap.fromTo(
        newImage,{
            opacity:0
        },{
            opacity:1,
            duration:1,
            ease:"power2.inOut",
            delay:0.5,
            onComplete:()=>sliderPreview.querySelector("img:not(:last-child)")?.remove(),
        }
    );

}

function animateSlide(slide, props){
    gsap.to(slide,{ ...props, duration:2,ease:"hop"});
    gsap.to(slide.querySelector(".slide-img"),{
        rotation: -props.rotation,
        duration:2,
        ease: "hop",
    });
}

function transitionsSlides(direction){
    if (isAnimating) return;
    isAnimating=true;

    const [outgoingPos, incomingPos]=
    direction==="next"? ["prev","next"]:["next","prev"];

    const outgoingSlide = slider.querySelector(`.${outgoingPos}`);
    const activeSlide= slider.querySelector(".active");
    const incomingSlide =slider.querySelector(`.${incomingPos}`);


    animateSlide(incomingSlide,{
        ...slidePostions.active,
        clipPath: clipPath.open,
    });
    animateSlide(activeSlide,{
        ...slidePostions[outgoingPos],
        clipPath:clipPath.closed,
    });
    gsap.to(outgoingSlide, {scale:0,opacity:0, duration:2, ease:"hop"});

    const newSlideIndex=getSlideIndex(direction==="next"? 2:-2);
    const newSlide =createSlide(sliderContent[newSlideIndex-1],incomingPos);
    slider.appendChild(newSlide);
    gsap.set(newSlide,{
        ...slidePostions[incomingPos],
        xPercent:-50,
        yPercent: -50,
        scale:0,
        opacity:0,
        clipPath:clipPath.closed,
    });
    gsap.to(newSlide,{scale:1,opacity:1,duration:2,ease:"hop"});
    const newActiveIndex =getSlideIndex(direction === "next" ? 1: -1 );
    createAndAnimateTitle(slidePostions[newActiveIndex-1], direction);
    updatePreviewImage(sliderContent[newActiveIndex-1]);
     
    setTimeout(()=> updateCounterAndHighlight(newActiveIndex),1000);

    setTimeout(()=>{
        outgoingSlide.remove();
        activeSlide.className=`slider-container ${outgoingPos}`;
        incomingSlide.className="slider-container active";
        newSlide.className=`slide-conatiner ${incomingPos}`;
        activeSlideIndex= newActiveIndex;
        isAnimating=false;
    },2000);
}
slider.addEventListener("click",(e)=>{
    const clickedSlide =e.target.closet(".slider-container");
    if (clickedSlide && !isAnimating){
        transitionsSlides(
            clickedSlide.classList.contains("next")?"next":"Prev"
        );
    }

});
Object.entries(slidePostions).forEach(([key, value])=>{
    gsap.set(`.slider-container.${key}`,{
        ...value,
        xPercent:- 50,
        yPercent: -50,
        clipPath: key ==="active" ? clipPath.open:clipPath.closed,

    });
    if (key !=="active"){
        gsap.set(`.slider-container.${key}.slide-img`,{
            rotation: -value.rotation,
        });
    }
});
 const initialTitle =sliderTitle.querySelector("h1");
 splitTextIntoSpans(initialTitle);
 gsap.fromto(
    initialTitle.querySelectorAll("span"),{
        y:60
    },{
        y: 0 ,
        duration: 1, 
        stagger:0.02,
        ease:"hop",
    }
 );
 updateCounterAndHighlight(activeSlideIndex);

sliderItems.querySelectorAll("p").forEach((item, index)=>{
    item.addEventListener("click", ()=>{
        if ( index+1 !== activeSlideIndex && !isAnimating){
            transitionsSlides(index+1 > activeSlideIndex ? "next":"prev");
        }
    });
});
});

