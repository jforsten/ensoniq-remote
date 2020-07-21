# ensoniq-remote

> Remote sample upload tool for Ensoniq samplers. Written useing Electron/Vue/Vuetify. Low-level Ensoniq media access uses command line tool EpsLin (https://gitlab.com/jforsten/EpsLin).

**Project is Work-in-progress state! Working state is not stabile. Stay tuned for first release!**

![alt text](documentation/browser_view.JPG)

Things to configue in setup view:

- **Ensoniq media directory:** dir location for ensoniq images (.iso,.img)
- **Linked Ensoniq Storage Device:** Shared storate between Ensoniq and PC (like SCSI2SD v6 drive)
- **Other Ensoniq Storage devices:** Any other Ensoniq devices connected to computer that will be shown as a part of media list

## Example

![alt text](documentation/settings_view.JPG)

**Note 1: EpsLin used should be the latest one (i.e. which has support for JSON output). See** <https://gitlab.com/jforsten/EpsLin>
**Note 2: To access raw devices (like SCSI2SD as USB drive) in development, you need to run the Cmd shell as Admin (i.e. where you use the 'npm run electron:serve')**

### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload
npm run electron:serve

# build electron application for production
npm run electron:build

```

---

## TODO & improvement ideas

- More customization (like what idx to use for tranfer etc to be more flexible of the usage of shared media)
- Add support for Bank load - i.e. patch load all instruments and songs found in bank
- Extend the functionality to EpsLin GUI i.e. add support for Efe transfer, MKdir, format etc.
- Add feature to prepare transfer media - Format, put OS etc.
- ...

## Troubleshooting 

- Developing: When using "npm run electron:serve" nothing shows up:
    * Make sure you have up-to-date Vue CLI installed (https://cli.vuejs.org/guide/installation.html)
    