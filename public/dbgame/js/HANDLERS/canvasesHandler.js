 class CanvasesHandler{
  constructor(handler){
    this.handler = handler;
  }

  setCanvases(){

    //parent div
    this.handler.parentDiv = document.getElementById("pDiv");
    if(!this.handler.parentDiv){

      this.handler.parentDiv = document.createElement("div");
      this.handler.parentDiv.setAttribute("id", "pDiv");
    }
    document.body.appendChild(this.handler.parentDiv);

    //main canvas
    this.handler.canvas = document.getElementById("cnorm");
    if(!this.handler.canvas){

      this.handler.canvas = document.createElement("canvas");
      this.handler.canvas.setAttribute("id", "cnorm");
    }

    this.handler.ctx = this.handler.canvas.getContext('2d');
    this.handler.ctx.imageSmoothingEnabled = true;
    this.handler.ctx.oImageSmoothingEnabled = true;
    this.handler.ctx.webkitImageSmoothingEnabled = true;

    // //collision canvas
    // this.handler.collisionCanvas = document.getElementById("ccoll");
    // if(!this.handler.collisionCanvas){
    //
    //   this.handler.collisionCanvas = document.createElement("canvas");
    //   this.handler.collisionCanvas.setAttribute("id", "ccoll");
    // }
    //
    // this.handler.collisionCtx = this.handler.collisionCanvas.getContext('2d');
    //
    // this.handler.collisionCanvas.width = window.innerWidth;
    // this.handler.collisionCanvas.height = window.innerHeight;



    this.handler.parentDiv.appendChild(this.handler.canvas);
    // this.handler.parentDiv.appendChild(this.handler.collisionCanvas);



    this.setWidthAndHeightOfCanvases();

  }

  setWidthAndHeightOfCanvases(){




    if(window.innerWidth < 400){
      this.handler.parentDiv.width  = window.innerWidth;
      this.handler.parentDiv.height  = window.innerHeight;
      this.handler.parentDiv.style.top = "0";
      this.handler.parentDiv.style.left = "0";
    }else{
      this.handler.parentDiv.width  = window.innerWidth/2;
      this.handler.parentDiv.height  = window.innerHeight/10 * 8;
      this.handler.parentDiv.style.top = "10%";
      this.handler.parentDiv.style.left = "25%";
    }
    this.handler.gameCanvasesWidth = this.handler.parentDiv.width;
    this.handler.gameCanvasesHeight = this.handler.parentDiv.height;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
    // this.handler.collisionCanvas.width = this.handler.gameCanvasesWidth;
    // this.handler.collisionCanvas.height = this.handler.gameCanvasesHeight;
  }
}
