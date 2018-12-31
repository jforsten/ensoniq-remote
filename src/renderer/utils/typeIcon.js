import { EnsoniqType } from './ensoniqType'

export const TypeIcon = {
  Instrument: 'music_note',
  Directory: 'folder',
  OS: 'memory',
  Bank: 'dashboard',
  Sequence: 'queue_music',
  Song: 'library_music',
  Macro: 'build',
  Parent_Directory: 'arrow_upward',

  get_icon (itemTypeId) {
    switch (itemTypeId) {
      case EnsoniqType.EPS_OS:
      case EnsoniqType.E16_OS:
      case EnsoniqType.ASR_OS:
        return TypeIcon.OS

      case EnsoniqType.EPS_Macro:
      case EnsoniqType.ASR_Macro:
        return TypeIcon.Macro

      case EnsoniqType.Directory:
        return TypeIcon.Directory

      case EnsoniqType.Parent_Directory:
        return TypeIcon.Parent_Directory

      case EnsoniqType.Instrument:
        return TypeIcon.Instrument

      case EnsoniqType.EPS_Bank:
      case EnsoniqType.E16_Bank:
      case EnsoniqType.ASR_Bank:
        return TypeIcon.Bank

      case EnsoniqType.EPS_Sequence:
      case EnsoniqType.E16_Sequence:
      case EnsoniqType.ASR_Sequence:
        return TypeIcon.Sequence

      case EnsoniqType.EPS_Song:
      case EnsoniqType.E16_Song:
      case EnsoniqType.ASR_Song:
        return TypeIcon.Song

      default:
        return ''
    }
  }
}
