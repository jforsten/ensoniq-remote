export const TypeIcons = {
  INSTRUMENT: 'music_note',
  DIR: 'folder',
  OS: 'memory',
  BANK: 'dashboard',
  SEQ: 'queue_music',
  SONG: 'library_music',
  MACRO: 'build',
  ROOT: 'arrow_upward',

  get_icon (itemTypeId) {
    switch (itemTypeId) {
      case '1':
      case '27':
      case '32':
        return TypeIcons.OS // OS
      case '9':
      case '34':
        return TypeIcons.MACRO // Macro
      case '2':
        return TypeIcons.DIR // Dir
      case '8':
        return TypeIcons.ROOT // ..
      case '3':
        return TypeIcons.INSTRUMENT // Inst
      case '4':
      case '23':
      case '30':
        return TypeIcons.BANK // Bank
      case '5':
      case '25':
      case '28':
        return TypeIcons.SEQ
      case '6':
      case '26':
      case '29':
        return TypeIcons.SONG
      default:
        return ''
    }
  }
}
