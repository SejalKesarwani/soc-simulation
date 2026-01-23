/**
 * Attack pattern configurations
 * Each pattern defines the attack rate (attacks per minute)
 */
const PATTERNS = {
  'normal': {
    name: 'Normal',
    description: 'Steady attack rate',
    minAttacksPerMin: 2,
    maxAttacksPerMin: 5,
  },
  'wave': {
    name: 'Wave',
    description: 'Alternating high and low intensity',
    lowAttacksPerMin: 1,
    highAttacksPerMin: 10,
    cycleSeconds: 30,
  },
  'sustained': {
    name: 'Sustained',
    description: 'Continuous high-intensity attacks',
    minAttacksPerMin: 8,
    maxAttacksPerMin: 12,
  },
  'calm': {
    name: 'Calm',
    description: 'Minimal activity with random gaps',
    minAttacksPerMin: 0,
    maxAttacksPerMin: 1,
  },
};

/**
 * AttackPatternController - Manages different attack simulation patterns
 */
class AttackPatternController {
  constructor() {
    this.currentPattern = 'normal';
    this.attacksPerMinute = 3;
    this.waveStartTime = Date.now();
    this.waveState = 'low'; // For wave pattern: 'low' or 'high'
  }

  /**
   * Sets the current attack pattern
   * @param {string} pattern - Pattern name (normal, wave, sustained, calm)
   */
  setPattern(pattern) {
    if (!PATTERNS[pattern]) {
      console.warn(`Unknown pattern: ${pattern}. Available patterns: ${Object.keys(PATTERNS).join(', ')}`);
      return false;
    }

    this.currentPattern = pattern;
    this.waveStartTime = Date.now(); // Reset wave cycle
    this.waveState = 'low';

    console.log(`Pattern changed to: ${pattern}`);
    return true;
  }

  /**
   * Gets the current pattern configuration
   * @returns {Object} Pattern configuration object
   */
  getCurrentPattern() {
    return {
      pattern: this.currentPattern,
      ...PATTERNS[this.currentPattern],
    };
  }

  /**
   * Calculates attack interval in milliseconds based on current pattern
   * @returns {number} Interval in milliseconds
   */
  getAttackInterval() {
    const pattern = this.currentPattern;
    const patternConfig = PATTERNS[pattern];

    let attacksPerMin;

    switch (pattern) {
      case 'normal': {
        // Random between min and max
        const min = patternConfig.minAttacksPerMin;
        const max = patternConfig.maxAttacksPerMin;
        attacksPerMin = Math.floor(Math.random() * (max - min + 1)) + min;
        break;
      }

      case 'wave': {
        // Alternate between low and high every 30 seconds
        const elapsed = (Date.now() - this.waveStartTime) / 1000;
        const cyclePosition = elapsed % (patternConfig.cycleSeconds * 2);

        if (cyclePosition < patternConfig.cycleSeconds) {
          this.waveState = 'low';
          attacksPerMin = patternConfig.lowAttacksPerMin;
        } else {
          this.waveState = 'high';
          attacksPerMin = patternConfig.highAttacksPerMin;
        }
        break;
      }

      case 'sustained': {
        // Random between min and max (consistently high)
        const min = patternConfig.minAttacksPerMin;
        const max = patternConfig.maxAttacksPerMin;
        attacksPerMin = Math.floor(Math.random() * (max - min + 1)) + min;
        break;
      }

      case 'calm': {
        // Very low with random gaps (mostly 0)
        const random = Math.random();
        if (random < 0.85) {
          // 85% chance of no attack
          attacksPerMin = 0;
        } else {
          // 15% chance of 1 attack
          attacksPerMin = 1;
        }
        break;
      }

      default:
        attacksPerMin = 3; // Default fallback
    }

    // Ensure at least 1 attack per minute to avoid infinite intervals
    if (attacksPerMin < 1) {
      attacksPerMin = 1;
    }

    // Convert attacks per minute to milliseconds
    // Formula: interval (ms) = 60,000 ms/min / attacks_per_min
    const intervalMs = (60000 / attacksPerMin);

    return intervalMs;
  }

  /**
   * Gets attack rate description for current pattern
   * @returns {string} Human-readable attack rate
   */
  getAttackRateDescription() {
    const pattern = this.currentPattern;
    const patternConfig = PATTERNS[pattern];

    if (pattern === 'wave') {
      return `Wave (low: ${patternConfig.lowAttacksPerMin}/min, high: ${patternConfig.highAttacksPerMin}/min, cycle: ${patternConfig.cycleSeconds}s)`;
    } else if (pattern === 'calm') {
      return `Calm (${patternConfig.minAttacksPerMin}-${patternConfig.maxAttacksPerMin}/min with gaps)`;
    } else {
      return `${patternConfig.name} (${patternConfig.minAttacksPerMin}-${patternConfig.maxAttacksPerMin}/min)`;
    }
  }
}

// Export singleton instance
module.exports = new AttackPatternController();
