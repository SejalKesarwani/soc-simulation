const EventEmitter = require('events');
const { generateRandomAttack } = require('../simulators/attackGenerator');

/**
 * AttackStreamService - Manages continuous stream of simulated security attacks
 * Emits 'newAttack' events at random intervals
 */
class AttackStreamService extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
    this.isRunning = false;
  }

  /**
   * Starts generating random attacks at intervals between 2-5 seconds
   */
  start() {
    if (this.isRunning) {
      console.warn('AttackStreamService is already running');
      return;
    }

    this.isRunning = true;
    console.log('AttackStreamService started');

    const generateAttackWithInterval = () => {
      // Generate random interval between 2000-5000 ms
      const randomInterval = Math.floor(Math.random() * 3000) + 2000;

      this.interval = setTimeout(() => {
        if (this.isRunning) {
          // Generate attack and emit event
          const attack = generateRandomAttack();
          this.emit('newAttack', attack);

          // Schedule next attack
          generateAttackWithInterval();
        }
      }, randomInterval);
    };

    // Generate first attack
    generateAttackWithInterval();
  }

  /**
   * Stops the attack stream generation
   */
  stop() {
    if (this.interval) {
      clearTimeout(this.interval);
      this.interval = null;
    }
    this.isRunning = false;
    console.log('AttackStreamService stopped');
  }

  /**
   * Returns the current running status
   * @returns {boolean} Whether the service is running
   */
  getStatus() {
    return this.isRunning;
  }
}

// Export singleton instance
module.exports = new AttackStreamService();
