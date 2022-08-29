class Song {
  static instance = null;
  static create() {
    if (!Song.instance) {
      Song.instance = new Song();
    }
    return Song.instance;
  }

  get isPlaying() {
    return !this._audio.paused;
  }

  constructor() {
    this._audio = document.createElement("audio");
    this._audio.src = "./bg.mp3";
  }

  play() {
    this._audio.play();
  }

  _fadeOut = () => {
    return new Promise((resolve) => {
      const doFadeOut = () => {
        console.log(this._audio.volume);
        this._audio.volume = Math.max(this._audio.volume - (1 / 300), 0);
        if (this._audio.volume > 0) {
          requestAnimationFrame(doFadeOut);
        } else {
          resolve();
        }
      };
      doFadeOut();
    });
  };

  stop() {
    this._fadeOut().then(() => {
      this._audio.pause();
      this._audio.currentTime = 0;
      this._audio.volume = 1
    });
  }
}

class Slider {
  get index() {
    return parseInt(
      getComputedStyle(this.root).getPropertyValue("--selected-slide")
    );
  }

  constructor() {
    this.root = document.querySelector(":root");
    this.slides = document.querySelectorAll(".slide");
    this.slidesLenght = this.slides.length;
    document.addEventListener("click", this._changeSlide);
    this.onChange = this._handleSong;
  }

  _handleSong = (index) => {
    const song = Song.create();
    const selectedSlide = this.slides.item(index);
    const action = {
      start: () => {
        if (!song.isPlaying) {
          song.play();
        }
      },
      stop: () => {
        song.stop();
      },
    }[selectedSlide.getAttribute("data-song-state")];

    action?.();
  };

  _changeSlide = (ev) => {
    const clickRange = (ev.clientX / window.innerWidth) * 2 - 1 + 0.2;
    if (clickRange > 0) {
      this.next();
    } else {
      this.prev();
    }
  };

  next() {
    if (this.index < this.slidesLenght - 1) {
      this.root.style.setProperty("--selected-slide", this.index + 1);
      this.onChange(this.index);
    }
  }

  prev() {
    if (this.index > 0) {
      this.root.style.setProperty("--selected-slide", this.index - 1);
      this.onChange(this.index);
    }
  }
}

const slider = new Slider();
