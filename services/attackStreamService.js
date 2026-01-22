const EventEmitter = require('events');
const { generateRandomAttack } = require('../simulators/attackGenerator');
const attackPatternController = require('../utils/attackPatterns');

/**
 * AttackStreamService - Manages continuous stream of simulated security attacks
 * Emits 'newAttack' events at intervals controlled by AttackPatternController
 */
class AttackStreamService extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
    this.isRunning = false;
    
    // Statistics tracking
    this.totalAttacksGenerated = 0;
    this.startTime = null;
  }

  /**
   * Starts generating random attacks at intervals controlled by AttackPatternController
   */
  start() {
    if (this.isRunning) {
      console.warn('AttackStreamService is already running');
      return;
    }

    this.isRunning = true;
    this.startTime = Date.now();
    this.totalAttacksGenerated = 0;
    console.log('AttackStreamService started with pattern:', attackPatternController.currentPattern);

    const generateAttackWithInterval = () => {
      // Get interval from attack pattern controller
      const attackInterval = attackPatternController.getAttackInterval();

      this.interval = setTimeout(() => {
        if (this.isRunning) {
          // Generate attack and emit event
          const attack = generateRandomAttack();
          this.totalAttacksGenerated++;
          this.emit('newAttack', attack);

          // Schedule next attack
          generateAttackWithInterval();
        }
      }, attackInterval);
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

  /**
   * Sets the attack pattern for the stream
   * @param {string} pattern - Pattern name (normal, wave, sustained, calm)
   * @returns {boolean} Whether pattern was successfully set
   */
  setAttackPattern(pattern) {
    const success = attackPatternController.setPattern(pattern);
    if (success && this.isRunning) {
      console.log(`Attack pattern changed to: ${pattern}`);
    }
    return success;
  }

  /**
   * Gets comprehensive statistics about the attack stream
   * @returns {Object} Statistics object with attacks count, pattern, rate, uptime
   */
  getAttackStats() {
    const uptimeSeconds = this.isRunning && this.startTime 
      ? Math.floor((Date.now() - this.startTime) / 1000)
      : 0;

    const attacksPerMinute = uptimeSeconds > 0
      ? Math.round((this.totalAttacksGenerated / uptimeSeconds) * 60)
      : 0;

    return {
      totalAttacksGenerated: this.totalAttacksGenerated,
      currentPattern: attackPatternController.currentPattern,
      currentPatternDescription: attackPatternController.getAttackRateDescription(),
      averageAttacksPerMinute: attacksPerMinute,
      uptimeSeconds: uptimeSeconds,
      isRunning: this.isRunning,
    };
  }
}

// Export singleton instance
module.exports = new AttackStreamService();
