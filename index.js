// Physics parameters
//concrete-Rubber coefficient, static=1.0, kinetic = 0.85
var weightBoxKg = 1.0;
var g = 9.8;
var staticFrictionCoeff = 1.0;
var kineticFrictionCoeff = 0.85; 

// assume the box is 1m x 1m, and the screen is then ~7m
// 100% of vw --> 7m
// 0.1% = .007m = 0.7cm
// at 100 percent slider speed, it covers 7m in 8 sec
// 100% slider speed = 0.87 m/s

var snd = new Audio("./Sound Effect/friction.wav"); // buffers automatically when created
snd.volume=1;
var maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
console.log(maxStaticFric);
// say at max slider(100%), force is 20N

//slider
var slider = document.getElementById("myRange");
var output1 = document.getElementById("sliderVal");
var output2 = document.getElementById("staticFric");
var output3 = document.getElementById("kineticFric");
// output1.innerHTML = "Speed = "+(0.87*0.01*slider.value).toFixed(1)+"m/s"; // Display the default slider value


var scaleRedArrow=0;
var scaleGreenArrow=0;

//intial showing of zero force, when slider is not yet touched
output1.innerHTML = "Force = 0.00 Kg m/sec<sup>2</sup>";



// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
//   output1.innerHTML = "Speed = "+(0.87*0.01*this.value).toFixed(1)+"m/s";
    if (this.value*20*0.01>maxStaticFric){
        output1.innerHTML = "Force = "+ (20.0*0.01*this.value).toFixed(2) +" Kg m/sec<sup>2</sup>";
        scaleRedArrow = 0.3+0.8*maxStaticFric/20.0;

    }
    else{
        output1.innerHTML = "Force = "+ (20.0*0.01*this.value).toFixed(2) +" Kg m/sec<sup>2</sup>";
        scaleRedArrow = 0.3+0.8*0.01*this.value ;

    }
    // output2.innerHTML = "Static Friction = 0 m/sec<sup>2</sup>";
    // output3.innerHTML = "Kinetic Friction = 0 m/sec<sup>2</sup>";
    scaleGreenArrow = 0.3+0.8*0.01*this.value;
    document.getElementById("svgredarrow").style.transform=" scaleX("+scaleRedArrow.toString()+')';   
    document.getElementById("svggreenarrow").style.transform="scaleX("+scaleGreenArrow.toString()+')';   

}

//------------sigmoid--replace x----------------------
    // 30.0/(1.0+Math.Pow(Math.E,-(x)+4.5));


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var backgroundImg = document.getElementById('backgroundImage');
var backgroundImgFlip = document.getElementById('backgroundImageFlip');
var distance = 0;
var distance1 = -100;
var leftIncrement=0.0;             //speed
var leftIncrementIncrement=0.0001;   //acceleration
var gapFrames=0;
var skipFrameCounter=0;
var sleepVar=1;
var k=0;

/*  ------------------- Velocity cap System-----------------------
Variables:
float velocityCapper --- range of value from 0% to 100%
Description; The total max velocity of game is capped at 4( in increment units)
based on the weight and friction combined we will multiply down this cap. 

For small values such as low weight and low friction the cap is 4 units
For high values such as high weight and high friction the cap is 1 units

Each weight has a cap rate 100%, 75%, 40%
Each friction has  rate 100%, 75%, 40%

Total cap = 4 * cap_weight * cap friction

eg Total cap =  4* 100% *50% = 4 x 1.0 x 0.5 = 2   //the max velocity is 2 units

*/ 
capWeight = 1.0;  //100%
capFriction = 1.0; //100%
totalCap = capWeight*capWeight;  


async function updateArrows(){
    if (slider.value*20*0.01>maxStaticFric){
        scaleRedArrow = 0.3+0.8*maxStaticFric/20.0;
    }
    else{
        scaleRedArrow = 0.3+0.8*0.01*slider.value ;
    }
    scaleGreenArrow = 0.3+0.8*0.01*slider.value;
    document.getElementById("svgredarrow").style.transform=" scaleX("+scaleRedArrow.toString()+')';   
    document.getElementById("svggreenarrow").style.transform="scaleX("+scaleGreenArrow.toString()+')';   
}

var playpause=1; //when pauseplay =1 the the animation plays, when its -1 it stops
async function backgroundMove(){
    // while(true){
    while(playpause==1){  //this isnt working for some reason. why is that?

        if(maxStaticFric>=20*0.01*slider.value && leftIncrement<=0.0002){
            //if speed is zero(tiny speed) then static friction applies here.

            // leftIncrementIncrement=0.001*(20*0.01*slider.value-maxStaticFric);
            //speed reduction -as leftIncrementIncrement is negative
            // leftIncrement=leftIncrement+leftIncrementIncrement;
            leftIncrement=0.00;
            output2.innerHTML = "Static Friction = "+(20*0.01*slider.value).toFixed(2)+" Kg m/sec<sup>2</sup>";
            output2.style.color = '#ffffff';

            output3.innerHTML = "Kinetic Friction = 0.00 Kg m/sec<sup>2</sup>";
            output3.style.color = '#a1a1a1';
            output3.style.opacity = "0.8";
            snd.pause()
            if (kg4==1){ //heavy weight selected
                document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1heavy.png";
            }
            else if(kg5==1){ //Medium Weight selected
                document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1medium.png";
            }
            else if(kg6==1){//Medium Weight selected
                document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1light.png";
            }

        }
        else if(maxStaticFric>=20*0.01*slider.value && leftIncrement>0.0002){
            //Deceleration here, kinetic friction applies
            leftIncrementIncrement=0.001*(20*0.01*slider.value-maxStaticFric);
            // leftIncrementIncrement=0.001*30.0/(1.0+Math.Pow(Math.E,-((20*0.01*slider.value-maxStaticFric))+4.5));
            // speed reduction -as leftIncrementIncrement is negative            
                        
            if (leftIncrement>3){
                leftIncrement=leftIncrement+5*leftIncrementIncrement;

            }
            else if(leftIncrement>2){
                leftIncrement=leftIncrement+3*leftIncrementIncrement;

            }
            else
                leftIncrement=leftIncrement+2*leftIncrementIncrement;

            //Movement happens here
            // leftIncrement=0.1*slider.value/100;
            output2.style.color = '#a1a1a1';
            output2.innerHTML = "Static Friction = 0.00 Kg m/sec<sup>2</sup>";
            output2.style.opacity = "0.8";

            output3.style.color = '#ffffff';
            output3.innerHTML = "Kinetic Friction = "+(maxStaticFric).toFixed(2)+" Kg m/sec<sup>2</sup>";

            snd.play();
    //------------Replace the box with a step animation frame----------
            gapFrames = 1.1/leftIncrement;
            if (skipFrameCounter>=gapFrames){
                k++;
                skipFrameCounter=0;
                if (kg4==1){ //heavy weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"heavy.png";
                }
                else if(kg5==1){ //Medium Weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"medium.png";
                }
                else if(kg6==1){//Medium Weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"light.png";
                }

            }
            else
                skipFrameCounter++;
            
        }
        else if(maxStaticFric<20*0.01*slider.value){
            //Acceleration here, kinetic friction applies
            // speed reduction here as leftIncrementIncrement is negative
            leftIncrementIncrement=0.001*(20*0.01*slider.value-maxStaticFric);
            // leftIncrementIncrement=0.001*10.0/(1.0+Math.Pow(Math.E,-((20*0.01*slider.value-maxStaticFric))+4.5));
            
            if (leftIncrement>totalCap){
                leftIncrement=leftIncrement+0.0; //no increment, velocity capped
            }

            else if(leftIncrement>0.75*totalCap){
                leftIncrement=leftIncrement+(1.2/totalCap)*leftIncrementIncrement;
            }
            else
                leftIncrement=leftIncrement+(0.4/totalCap)*leftIncrementIncrement;

            //Movement happens here
            // leftIncrement=0.1*slider.value/100;
            output2.style.color = '#a1a1a1';
            output2.innerHTML = "Static Friction = 0.00 Kg m/sec<sup>2</sup>";

            output3.style.color = '#ffffff';
            output3.innerHTML = "Kinetic Friction = "+(maxStaticFric).toFixed(2)+" Kg m/sec<sup>2</sup>";
            output3.style.opacity = "0.8";

            snd.play();
    //------------Replace the box with a step animation frame----------
            gapFrames = 1.1/leftIncrement;
            if (skipFrameCounter>=gapFrames){
                k++;
                skipFrameCounter=0;
                if (kg4==1){ //heavy weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"heavy.png";
                }
                else if(kg5==1){ //Medium Weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"medium.png";
                }
                else if(kg6==1){//light Weight selected
                    document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step"+((k%4)+1).toString()+"light.png";
                }
            }
            else
                skipFrameCounter++;
            
        }
        else
            console.log("Extra case detected");
        
        // console.log("Net Force"+(20*0.01*slider.value-maxStaticFric));

        backgroundImg.style.left = (50+distance).toString()+'%';
        backgroundImgFlip.style.left =(50+distance1).toString()+'%';
        distance+=leftIncrement;
        distance1+=leftIncrement;
        
        await sleep(16);
        if(distance>=100){
            distance=distance-200.0;
        }
        if(distance1>=100){
            distance1=distance1-200.0;
        }
        // if(distance>=100 && playpause==1){
        //     distance=distance-200.0;
        // }
        // if(distance1>=100 && playpause==1){
        //     distance1=distance1-200.0;
        // }
    }  
}

// Variables to store the state of the buttons
// -1 means inactive/clicked clicked
// +1 means clicked/active state

var fr1 = 1;
var fr2 = -1;
var fr3 = -1;
var kg4 = -1;
var kg5 = -1;
var kg6 = 1;
// initial state





// BUTTON HEAVY WEIGHT
document.getElementById("kgButton4").onclick = function(){
    if (kg4==-1){
        kg4=1;
        kg5=-1;
        kg6=-1;
        document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1heavy.png";
    }
    capWeight = 0.4;  //40%
    totalCap = capWeight*capWeight;            
    leftIncrement=0.0000;
    updateArrows();

    weightBoxKg=1.0;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=1;
    this.classList.add("buttonSelected");
    document.getElementById("kgButton5").classList.remove("buttonSelected");
    document.getElementById("kgButton6").classList.remove("buttonSelected");
    
    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";

}


// BUTTON MEDIUM WEIGHT
document.getElementById("kgButton5").onclick = function(){
    if (kg5==-1){
        kg4=-1;
        kg5=1;
        kg6=-1;
        document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1medium.png";

    }
    capWeight = 0.75;  //75%
    totalCap = capWeight*capWeight;            
    leftIncrement=0.0000;
    updateArrows();

    weightBoxKg=0.7;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=1;
    this.classList.add("buttonSelected");
    document.getElementById("kgButton4").classList.remove("buttonSelected");
    document.getElementById("kgButton6").classList.remove("buttonSelected");
    
    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";

}

// BUTTON LOW WEIGHT
document.getElementById("kgButton6").onclick = function(){
    if (kg6==-1){
        kg4=-1;
        kg5=-1;
        kg6=1;
        document.getElementById('box').src="./FIGMA ASSETS/Box with character moving/static part-box and character--step1light.png";

    }
    capWeight = 1.0;  //100%
    totalCap = capWeight*capWeight;            
    leftIncrement=0.0000;
    updateArrows();

    weightBoxKg=0.4;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=1;
    this.classList.add("buttonSelected");
    document.getElementById("kgButton4").classList.remove("buttonSelected");
    document.getElementById("kgButton5").classList.remove("buttonSelected");

    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";

}



// BUTTON LOW FRICTION
document.getElementById("FricButton1").onclick = function(){
    capFriction = 1.0; //100%
    totalCap = capWeight*capWeight;
    leftIncrement=0.0000;
    updateArrows();

    staticFrictionCoeff=0.6;
    fr1*=-1;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=0.2;
    this.classList.add("buttonSelected");
    document.getElementById("FricButton2").classList.remove("buttonSelected");
    document.getElementById("FricButton3").classList.remove("buttonSelected");
    
    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    document.getElementById('backgroundImage').src="./Image/low friction road.png";
    document.getElementById('backgroundImageFlip').src="./Image/low friction road flipped.png";

}


// BUTTON MEDIUM FRICTION
document.getElementById("FricButton2").onclick = function(){
    capFriction = 0.75; //75%
    totalCap = capWeight*capWeight;
    leftIncrement=0.0000;
    updateArrows();
    staticFrictionCoeff=1.2;
    fr2*=-1;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=0.5;
    this.classList.add("buttonSelected");
    document.getElementById("FricButton1").classList.remove("buttonSelected");
    document.getElementById("FricButton3").classList.remove("buttonSelected");
    
    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    document.getElementById('backgroundImage').src="./Image/Medium friction road.png";
    document.getElementById('backgroundImageFlip').src="./Image/Medium friction road flipped.png";
}

// BUTTON HIGH FRICTION
document.getElementById("FricButton3").onclick = function(){
    capFriction = 0.4; //40%
    totalCap = capWeight*capWeight;
    leftIncrement=0.0000;
    staticFrictionCoeff=1.8;
    updateArrows();
    fr3*=-1;
    maxStaticFric = weightBoxKg*staticFrictionCoeff*g;
    snd.volume=1;
    this.classList.add("buttonSelected");
    document.getElementById("FricButton1").classList.remove("buttonSelected");
    document.getElementById("FricButton2").classList.remove("buttonSelected");
    
    // this.style.filter="drop-shadow(0px 0px 20px rgb(0, 39, 211))";
    // document.getElementById("kgButton4").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";
    // document.getElementById("kgButton6").style.filter="drop-shadow(0px 0px 0px rgb(0, 0, 0))";

    document.getElementById('backgroundImage').src="./Image/High friction road.png";
    document.getElementById('backgroundImageFlip').src="./Image/High friction road flipped.png";

}
// PLAY PAUSE BUTTON
document.getElementById("play").onclick = function(){
    if (playpause==1){
        // document.getElementById("play").innerHTML = "play";
        document.getElementById('play').src="./FIGMA ASSETS/playbutton.png";
        document.getElementById('play').style.scale="0.8";

        // <img id="play_button" src="./FIGMA ASSETS/PauseButton.png" style= "transform: scale(0.3)">

        playpause=-1;
        snd.pause();
        document.getElementById("controlPanel").classList.add("inactive");
    }
    else{
        // document.getElementById("play").innerHTML = "pause";
        document.getElementById('play').src="./FIGMA ASSETS/PauseButton.png";
        // document.getElementById('play').style.scale="0.9";
        playpause=1;
        snd.play();
        document.getElementById("controlPanel").classList.remove("inactive");
    }
    backgroundMove();
}

document.getElementById("startButton").onclick = function(){
    document.getElementById("screenCovered").style.display = "none";
    document.getElementById("startButton").style.display = "none";
    popupTextAnimation();
}
document.getElementById("c1").onclick = function(){
    document.getElementById("sliderTutorial").style.display = "none";
    document.getElementById("t1").style.display = "none";

}
document.getElementById("c2").onclick = function(){
    document.getElementById("frictionTutorial").style.display = "none";
    document.getElementById("t2").style.display = "none";

}
document.getElementById("c3").onclick = function(){
    document.getElementById("weightTutorial").style.display = "none";
    document.getElementById("t3").style.display = "none";


    // *******TEST CODE BELOW DELETE IT*****
    // document.getElementById("masterDiv").style.opacity="0.5";
    // document.getElementById("slidecontainer").style.opacity="1";
    //*************************************
}

window.onload=function(){
    document.getElementById("kgButton6").classList.add("buttonSelected");
    document.getElementById("FricButton1").classList.add("buttonSelected");
    backgroundMove();
}

document.getElementById('finish').onclick=function(){
    console.log('finish');
    dsBridge.call("byjus.sendExploreUIEvent", {

        tag: "finish",

        data: ""

    });
}
document.getElementById('quitGame').onclick=function(){
    console.log('close');
    dsBridge.call("byjus.sendExploreUIEvent", {

        tag: "close",

        data: ""

    });
}

async function popupTextAnimation(){
    document.getElementById("sliderTutorial").style.display = "block";
    document.getElementById("frictionTutorial").style.display = "block";
    document.getElementById("weightTutorial").style.display = "block";
    await sleep(500);
    document.getElementById("frictionTutorial").style.opacity = "1";
    document.getElementById("t2").style.opacity = "1";
    await sleep(2500);
    document.getElementById("weightTutorial").style.opacity = "1";
    document.getElementById("t3").style.opacity = "1";
    await sleep(2500);
    document.getElementById("sliderTutorial").style.opacity = '1';
    document.getElementById("t1").style.opacity = "1";
    await sleep(5000);
    document.getElementById("sliderTutorial").style.opacity = '0';
    document.getElementById("frictionTutorial").style.opacity = "0";
    document.getElementById("weightTutorial").style.opacity = "0";
    document.getElementById("t1").style.opacity = "0";
    document.getElementById("t2").style.opacity = "0";
    document.getElementById("t3").style.opacity = "0";
    await sleep(2000);
    document.getElementById("sliderTutorial").style.display = "none";
    document.getElementById("frictionTutorial").style.display = "none";
    document.getElementById("weightTutorial").style.display = "none";
    
    document.getElementById("t1").style.display = "none";
    document.getElementById("t2").style.display = "none";
    document.getElementById("t3").style.display = "none";
}