document.addEventListener("DOMContentLoaded",()=>{
    gsap.registerPlugin(CustomEase);
    CustomEase.create(
        "hop",
        "M0,0 C0.071,0.505 0.192,0.726 0.318,0.852 0.45,0.984 0.504,1 1,1"
    );

    const sliderImages=document.querySelector(".slider-images");
    const counter=document.querySelector(".counter");
    const titles=document.querySelector(".slider-tilte-wrapper");
    const indicators=document.querySelector(".slider-indicators p");
    const prevSlides=document.querySelector(".slider-preview .preview");
    const sliderPreview=document.querySelector(".slider-preview");

    let currentImg=1;
    let totalSlides=5;
    let indicatorRotation=0;

    const updateCounterAndTitlePosition=()=>{
        const counterY= -20*(currentImg-1);
        const titleY=-60*(currentImg-1);

        gsap.to(counter,{
            y:counterY,
            duration:1,
            ease:"hop",

        });
        gsap.to(titles,{
            y:titleY,
            duration:1,
            ease:"hop",
        });
    
    };
    const updateActiveSlidePreview=()=>{
        prevSlides.forEach((prev) => prev.classList.remove("active"));
        prevSlides[currentImg-1].classList.add("active");
        
    };

    const animateSlide=(direction)=>{
        const curentSlide=
        document.querySelectorAll("img")[
            document.querySelectorAll(".img").length-1
        ];

        const slideImg = document.createElement("div");
        slideImg.classList.add("img");

        const slideImgElem = document.createElement("img");
        slideImgElem.src=`./images/img${currentImg}.jpg`;
        gsap.set(slideImgElem,{x:direction ==="left"? -300:300});


        slideImg.appendChild(slideImgElem);
        sliderImages.appendChild(slideImg);

        gsap.to(curentSlide.querySelector("img"),{
          x: direction==="left"?300: -300,
          duration:1.5,
          ease:"power4.out",  
        });

        gsap.fromto(slideImg,{
           clipPath: direction ==="left" 
           ? "polygon(0% 0%,0% 0%,0% 100%,0% 100%)" 
           :"polygon(100% 0%,100% 0%,100% 100%,100% 100%)",
        },
        {
            clipPath: "polygon(0% 0%,100% 0%,100% 100%,0% 100%)",
            duration:1.5,
            ease:"power4.out",

        }
    );

    gsap.to(slideImgElem,{
        x:0,
        duration:1.5,
        ease:"power4.out",
    });

    cleanupSlides();

    indicatorRotation+=direction==="left" ? -90:90;
    gsap.to(indicators,{
        rotate: indicatorRotation,
        duration:1,
        ease: "hop",
    });
    };



    document.addEventListener("click",(event)=>{
        const sliderWidth=document.querySelector(".slider").clientWidth;
        const clickPosition= event.clientX;

        if(sliderPreview.contains(event.target)){
            const clickedPrev=event.target.closet(".preview");

            if (clickedPrev){
                const clickedIndex=Array.from(prevSlides).indexOf(clickedPrev)+1;

                if (clickedIndex !==currentImg){
                    if(clickedIndex<currentImg){
                      currentImg=  clickedIndex;
                      animateSlide("left");
                    }else{
                        currentImg= clickedIndex;
                        animateSlide("right");
                    }
                    updateActiveSlidePreview();
                    updateCounterAndTitlePosition();
                }


        }  
        return;  
        }
        if (clickPosition < sliderWidth/2 && currentImg!==1){
            currentImg--;
            animateSlide("left");
        }else if( clickPosition >sliderWidth/2 && currentImg!==totalSlides){
            currentImg++;
            animateSlide("right");
        }

        updateActiveSlidePreview();
        updateCounterAndTitlePosition();
    });

    const cleanupSlides=()=>{
        const imgElements=document.querySelectorAll(".slider-images .img");
        if(imgElements.length> totalSlides){
            imgElements[0].remove();
        }
    }

});

