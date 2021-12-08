
class Carousel {
  constructor(time) {
    this.container = document.getElementsByClassName('carousel_item');
    this.leftb = document.getElementById('carousel_button--prev');
    this.rightb = document.getElementById('carousel_button--next');

    this.pauseb = document.getElementById('carousel_button--pause');

    this.playing = true;

    this.time = time;
    this.slidePosition = 0;
    this.totalSlides = this.container.length;
    this.updateSlidePosition();
    this.nextEvent();
    this.prevEvent();
    this.nextEventBoard();
    this.prevEventBoard();
    this.moveToNextSlide();
    this.moveToPrevSlide();
  this.timerCarousel();
  this.interval = setInterval( () =>{
      console.log('horloge');
      this.moveToNextSlide();
    }, this.time);
    this.timerStop();
 
  }

  nextEvent() {
  this.rightb.addEventListener("click", () => {
    console.log('b_droit OK!');
    this.moveToNextSlide();
  })
  };

  nextEventBoard() {
    addEventListener("keydown", (e) => {
      let kBoard = e.key;
      if ( kBoard === "ArrowRight") {
        this.moveToNextSlide();
      }
    })
  };

  prevEventBoard() {
    addEventListener("keydown", (e) => {
      let kBoard = e.key;
      if ( kBoard === "ArrowLeft") {
        this.moveToPrevSlide();
      }
    })
  };


  prevEvent() {
    this.leftb.addEventListener("click", () => {
      console.log('b_gauche OK !');
      this.moveToPrevSlide();

    })
  };


  updateSlidePosition() {
    for ( let slide of this.container) {
      slide.classList.remove('carousel_item--visible');
      slide.classList.add('carousel_item--hidden');
    }
    this.container[this.slidePosition].classList.add('carousel_item--visible');
  };

  moveToNextSlide() {

    if (this.slidePosition === this.totalSlides - 1) {
      this.slidePosition = 0;
    } else {
      this.slidePosition++;
    }
    this.updateSlidePosition();
  };

  moveToPrevSlide() {
    if (this.slidePosition === 0) {
      this.slidePosition = this.totalSlides - 1;
    } else {
      this.slidePosition--;
    }   
    this.updateSlidePosition();

   };


  timerCarousel() {
      this.interval;

  };

  timerStop() {
    this.pauseb.addEventListener("click", () => {
      if (this.playing === true ) {
        this.pauseb.innerHTML = '<i class="far fa-play-circle"></i>';
        clearInterval(this.interval);
        this.playing = false;
        console.log("vrai!")

      } else {
        setInterval( () =>{
        this.pauseb.innerHTML = '<i class="far fa-pause-circle"></i>';
        this.moveToNextSlide(); }, this.time);
        this.playing = true;
        console.log("faux!")
      }

    });
  }

};





const carouselVelo = new Carousel(5000);


