const canvas = document.querySelector("canvas"),
toolBtns = document.querySelectorAll(".tool"),
fillColor = document.querySelector("#fill-color"),
sizeSlider = document.querySelector("#size-slider"),
colorBtns = document.querySelectorAll(".colors .option"),
colorpicker = document.querySelector("#color-picker"),
clearCanvas = document.querySelector(".clear-canvas"),
saveImg = document.querySelector(".save-image"),
ctx = canvas.getContext("2d");

let prevMouseX, prevMouseY,snapshot,
isDrawing = false,
selectedTool = "brush",
brushWidth = 5,
selectedColor = "#000";

const setCanvasbackground = ()=>{
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = selectedColor; // setting fillstyle back to the selected color , it will be the brush color
}

window.addEventListener("load",()=>{
    // setting canvas width/height == offsetwidth/height return viewable width/height of an element
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    setCanvasbackground();
})
const drawRect = (e)=>{
    // if fillColor is not checked then draw a rect with border else draw rect with background
    if(!fillColor.checked){        
        return ctx.strokeRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX,prevMouseY - e.offsetY);    // strokeRect takes (x-coordinate,y-coordinate,width,height);
    }
    ctx.fillRect(e.offsetX,e.offsetY,prevMouseX - e.offsetX,prevMouseY - e.offsetY);    // strokeRect takes (x-coordinate,y-coordinate,width,height);
}
const drawCircle = (e)=>{
    ctx.beginPath();    // creating new path to draw circle
    let radius = Math.sqrt(Math.pow((prevMouseX - e.offsetX), 2) + Math.pow((prevMouseY - e.offsetY), 2))   // pow return x to the power of y;
    ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI)  // arc is use to create circle .. ctx.arc takes (x-coordinate,y-coordinate, radius,start-angle,end-angle);
    fillColor.checked ? ctx.fill() : ctx.stroke();  // if fill color is checked then draw circle with color else draw with border
}
const drawLine = (e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);    // moveTo method moves the path to the specified point; 
    ctx.lineTo(e.offsetX, e.offsetY);   // creating first line according to the mouse pointer
    ctx.stroke();
}
const drawTriangle = (e)=>{
    ctx.beginPath();
    ctx.moveTo(prevMouseX, prevMouseY);    //  moving triangle to the mouse pointer
    ctx.lineTo(e.offsetX, e.offsetY);   // creating first line according to the mouse pointer
    ctx.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);  // creating bottom line of the triangle
    ctx.closePath();    // closing path of the triangle so that the third line gets draw automatically
    ctx.stroke();
    fillColor.checked ? ctx.fill() : ctx.stroke();  // if fill color is checked then draw circle with background else draw with border
}
const drawing = (e) =>{
    if(!isDrawing) return;    // if not drawing return from here
    ctx.putImageData(snapshot, 0, 0);   //passing copied canvas data on to this canvas
    if(selectedTool === "brush" || selectedTool === "eraser"){
        // if selected tool is eraser then se stroke style to white #fff;
        // else paint the selected color on the canvas
        ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
        ctx.lineTo(e.offsetX, e.offsetY);    // creating line according to the mouse pointer
        ctx.stroke();   // drawing/filling line with color
    }else if(selectedTool === "rectangle"){
        drawRect(e);
    }else if(selectedTool === "circle"){
        drawCircle(e);
    }else if(selectedTool === "line"){
        drawLine(e);
    }else{
        drawTriangle(e);
    }
}
const startDrawing = (e)=>{
    isDrawing = true;
    prevMouseX = e.offsetX; // passing current mouseX position as prevMouseX value
    prevMouseY = e.offsetY; // passing current mouseY position as prevMouseY value
    ctx.beginPath();    // creating new path to draw
    ctx.lineWidth = brushWidth; // passing brush size as line width
    ctx.strokeStyle = selectedColor;    // passing selected color as stroke color
    ctx.fillStyle = selectedColor;    // passing selected color as filling color
    snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);    // copying canas data and passing as snapshot value.. this avoid dragging the image
}

toolBtns.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".options .active").classList.remove("active");
        btn.classList.add("active");
        selectedTool = btn.id;
    })
})

sizeSlider.addEventListener("change",()=> brushWidth = sizeSlider.value);

colorBtns.forEach(cBtn =>{
    cBtn.addEventListener("click",()=>{
        document.querySelector(".options .selected").classList.remove("selected");
        cBtn.classList.add("selected");
        selectedColor =  window.getComputedStyle(cBtn).getPropertyValue("background-color");
        
    })
})
colorpicker.addEventListener("change",()=>{
    colorpicker.parentElement.style.background = colorpicker.value;
    colorpicker.parentElement.click();
})

clearCanvas.addEventListener("click",()=>{
    ctx.clearRect(0, 0, canvas.width, canvas.height) // clearRect() method clear the specified pixels within the given rectangle
    setCanvasbackground();
})
saveImg.addEventListener("click",()=>{
    const link = document.createElement("a");   // creating <a> element
    link.download = `${Date.now()}.jpg`;    // passing current date as download value
    link.href = canvas.toDataURL(); // passing canvas data as link href value
    link.click();   // clicking link to download the image;

})
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mouseup", ()=>{isDrawing = false});
canvas.addEventListener("mousemove", drawing);