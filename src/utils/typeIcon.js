import { EnsoniqFileType } from './ensoniqFileType'

export const TypeIcon = {
  Instrument: 'mdi-pulse',
  Directory: 'mdi-folder',
  OS: 'mdi-memory',
  Bank: 'mdi-collage',
  Sequence: 'mdi-music-note',
  Song: 'mdi-music',
  Macro: 'mdi-wrench',
  Parent_Directory: 'mdi-arrow-up',
  Effect: 'mdi-function-variant',

  get_icon (itemTypeId) {
    switch (itemTypeId) {
      case EnsoniqFileType.EPS_OS:
      case EnsoniqFileType.E16_OS:
      case EnsoniqFileType.ASR_OS:
        return TypeIcon.OS

      case EnsoniqFileType.EPS_Macro:
      case EnsoniqFileType.ASR_Macro:
        return TypeIcon.Macro

      case EnsoniqFileType.Directory:
        return TypeIcon.Directory

      case EnsoniqFileType.Parent_Directory:
        return TypeIcon.Parent_Directory

      case EnsoniqFileType.Instrument:
        return TypeIcon.Instrument

      case EnsoniqFileType.EPS_Bank:
      case EnsoniqFileType.E16_Bank:
      case EnsoniqFileType.ASR_Bank:
        return TypeIcon.Bank

      case EnsoniqFileType.EPS_Sequence:
      case EnsoniqFileType.E16_Sequence:
      case EnsoniqFileType.ASR_Sequence:
        return TypeIcon.Sequence

      case EnsoniqFileType.EPS_Song:
      case EnsoniqFileType.E16_Song:
      case EnsoniqFileType.ASR_Song:
        return TypeIcon.Song
      case EnsoniqFileType.E16_Effect:
      case EnsoniqFileType.ASR_Effect:
        return TypeIcon.Effect
      default:
        return ''
    }
  }
}
