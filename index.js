const STEP_N = 6;
const STEP = Math.pow(10, STEP_N);

function addToDigits(digits, offset, num) {
  while (num) {
    num += digits[offset] || 0;
    digits[offset] = num % STEP;
    num = ~~ (num / STEP);
    offset ++;
  }
}

class BigNumber {
  constructor(num) {
    if (num instanceof BigNumber) {
      this.digits = num.digits.slice();
      this.zeros = num.zeros;
    } else if (typeof num === 'object') {
      this.digits = num.digits || [];
      this.zeros = num.zeros || 0;
    } else if (!isNaN(num)) {
      this.digits = [];
      this.zeros = 0;
      while (num) {
        this.digits.push(num % STEP);
        num = ~~ (num / STEP);
      }
    } else {
      throw new Error(`Invalid number: ${num}`);
    }
    this.popZeros();
  }

  popZeros() {
    const {digits} = this;
    while (digits.length && !digits[0]) {
      digits.shift();
      this.zeros ++;
    }
    if (!digits.length) this.zeros = 0;
  }

  equalTo(other) {
    if (!(other instanceof BigNumber)) other = new BigNumber(other);
    return this.zeros === other.zeros
    && this.digits.length === other.digits.length
    && this.digits.every((item, i) => item === other.digits[i]);
  }

  add(other) {
    return other instanceof BigNumber ? this.addObject(other) : this.addSimple(other);
  }

  addSimple(other) {
    const digits = this.digits.slice();
    addToDigits(digits, 0, other);
    return new BigNumber({digits, zeros: this.zeros});
  }

  addObject(other) {
    const digits = [];
    const length = Math.max(this.digits.length, other.digits.length);
    for (let i = 0; i < length; i ++) {
      addToDigits(digits, i, (this.digits[i] || 0) + (other.digits[i] || 0));
    }
    return new BigNumber({digits, zeros: this.zeros});
  }

  multiply(other) {
    return other instanceof BigNumber ? this.multiplyObject(other) : this.multiplySimple(other);
  }

  multiplySimple(other) {
    const digits = [];
    const length = this.digits.length;
    for (let i = 0; i < length; i ++) {
      addToDigits(digits, i, this.digits[i] * other);
    }
    return new BigNumber({digits, zeros: this.zeros});
  }

  multiplyObject(other) {
    const digits = [];
    const selfLength = this.digits.length;
    const otherLength = other.digits.length;
    const totalLength = selfLength + otherLength - 1;
    for (let i = 0; i < totalLength; i ++) {
      for (let j = Math.max(0, i - otherLength + 1); j < selfLength && j <= i; j ++) {
        addToDigits(digits, i, this.digits[j] * other.digits[i - j]);
      }
    }
    return new BigNumber({digits, zeros: this.zeros + other.zeros});
  }

  pow(n) {
    const midValues = {1: new BigNumber(this)};
    const keys = [1];
    for (let i = 2; i <= n; i *= 2) {
      keys.push(i);
      const midValue = new BigNumber(midValues[i >> 1]);
      midValues[i] = midValue.multiply(midValue);
    }
    let res = new BigNumber(1);
    while (n) {
      const key = +keys.pop();
      if (key <= n) {
        n -= key;
        res = res.multiply(midValues[key]);
      }
    }
    return res;
  }

  leftpad(s, n, c='0') {
    s = s.toString();
    return s.length < n ? c.repeat(n - s.length) + s : s;
  }

  toString() {
    const res = [];
    const length = this.digits.length;
    if (length) {
      res.push(this.digits[length - 1]);
      for (let i = length - 1; i --; ) {
        res.push(this.leftpad(this.digits[i], STEP_N));
      }
      res.push('0'.repeat(this.zeros * STEP_N));
    } else {
      res.push(0);
    }
    return res.join('');
  }
}

module.exports = BigNumber;
