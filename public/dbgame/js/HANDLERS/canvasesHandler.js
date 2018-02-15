class CanvasesHandler{
  constructor(handler){
    this.handler = handler;
  }

  setCanvases(){

    //collision canvas
    this.handler.collisionCanvas = document.getElementById("ccoll");
    if(!this.handler.collisionCanvas){

      this.handler.collisionCanvas = document.createElement("canvas");
      this.handler.collisionCanvas.setAttribute("id", "ccoll");
    }

    this.handler.collisionCtx = this.handler.collisionCanvas.getContext('2d');


    //main canvas
    this.handler.canvas = document.getElementById("cnorm");
    if(!this.handler.canvas){

      this.handler.canvas = document.createElement("canvas");
      this.handler.canvas.setAttribute("id", "cnorm");
    }

    this.handler.ctx = this.handler.canvas.getContext('2d');
    // this.handler.ctx.imageSmoothingEnabled = false;
    // this.handler.ctx.oImageSmoothingEnabled = false;
    // this.handler.ctx.webkitImageSmoothingEnabled = false;


    document.body.appendChild(this.handler.collisionCanvas);
    document.body.appendChild(this.handler.canvas);
    // document.body.appendChild(this.handler.collisionCanvas)

    this.setWidthAndHeightOfCanvases();
  }

  setWidthAndHeightOfCanvases(){
    // this.handler.canvas.setAttribute("left", String(-window.innerWidth/4));
    // this.handler.collisionCanvas.setAttribute("left", String(-window.innerWidth/4));
    // this.handler.canvas.setAttribute("top", String(-window.innerHeight/10));
    // this.handler.collisionCanvas.setAttribute("top", String(-window.innerHeight/10));


    this.handler.canvas.setAttribute("right", "25%");
    this.handler.canvas.setAttribute("top", "10%");
    this.handler.canvas.setAttribute("width", "50%");
    this.handler.collisionCanvas.setAttribute("right", "25%");
    this.handler.collisionCanvas.setAttribute("top", "10%");
    this.handler.collisionCanvas.setAttribute("width", "50%");

    this.handler.gameCanvasesWidth = window.innerWidth/2;
    this.handler.gameCanvasesHeight = window.innerHeight/10 * 8;
    this.handler.canvas.width = this.handler.gameCanvasesWidth;
    this.handler.canvas.height = this.handler.gameCanvasesHeight;
    this.handler.collisionCanvas.width = this.handler.gameCanvasesWidth;
    this.handler.collisionCanvas.height = this.handler.gameCanvasesHeight;
  }
}
