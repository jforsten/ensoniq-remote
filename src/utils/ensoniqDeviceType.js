export const EnsoniqDeviceType = {
  EPS: 'EPS Classic',
  EPS16: 'EPS-16 Plus',
  ASR10: 'ASR-10',

  getValue (type) {
    return Reflect.get(EnsoniqDeviceType, type)
  },

  isEPS (type) {
    console.log('isEPS:' + this.getValue(type) + ' = ' + this.EPS)
    console.log(this.getValue(type) === this.EPS)
    return this.getValue(type) === this.EPS
  },

  isEPS16 (type) {
    console.log('isEPS16:' + this.getValue(type) + ' = ' + this.EPS16)
    console.log(this.getValue(type) === this.EPS16)
    return this.getValue(type) === this.EPS16
  },

  isASR10 (type) {
    console.log('isASR10:' + this.getValue(type) + ' = ' + this.ASR10)
    console.log(this.getValue(type) === this.ASR10)
    return this.getValue(type) === this.ASR10
  }

}
