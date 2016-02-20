/**
 * The GraphicManager class handles all data visualisations
 */
var Manager = Class.create({

  /**
   * Class ID
   */
  id: 'Manager',

  /**
   * Variables
   */
  parent : null,
  thread : null,
  threadDelay : 0,
  running : false,
  animationFrame : false,

  /**
   * Initialize
   */
  initialize: function (threadDelay, animationFrame) {

    // initialize variables
    this.parent = this;

    // initialize the thread
    this.initializeThread(threadDelay, animationFrame);
  },

  /**
   * Initialize
   */
  initializeThread: function (threadDelay, animationFrame) {

    // set animation frame
    this.animationFrame = animationFrame;

    // set the thread delay
    this.threadDelay = threadDelay;

    // start the Thread
    this.running = true;

    // set standard interval when not running on the animation frames
    if (this.animationFrame !== true) {
      this.thread = setIntervalWithContext(this.__run, this.threadDelay, this);
    }

    // execute the first run
    this.__run();
  },

  /**
   * Thread pre-execution
   */
  __run: function () {

    // check for new animation frame
    if (this.animationFrame) {
      this.thread = requestAnimationFrame(this.__run.bind(this));
    }

    // guard: check for active
    if (!this.running) {
      return;
    }

    // execute
    this.run();
  },

  /**
   * Thread execution
   */
  run: function () {
    // implemented in sub class
  },

  /**
   * Toggle the running of the thread
   */
  toggleRunning: function () {
    this.running = !this.running;
  },

  /**
   * Set the running of the thread
   */
  setRunning: function (running) {
    this.running = running;
  },

  /**
   * Set the running of the thread
   */
  isRunning: function () {
    return this.running;
  },

  /**
   * Get the thread delay
   */
  getThreadDelay: function () {
    return this.threadDelay;
  },

  /**
   * Destruct method
   */
  destruct: function () {

    // clear the interval
    clearInterval(this.thread);
  }
});
