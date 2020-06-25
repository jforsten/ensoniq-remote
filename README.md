# ensoniq-remote

> An electron-vue project for remote sample upload to Ensoniq samplers

**<span style="color:red">Project is Work-in-progress state! Main features are still missing. Stay tuned for first release!</span>**

![alt text](documentation/browser_view.JPG)

Things to configue in setup view:
- **Ensoniq media directory:** dir location for ensoniq images (*iso, *.img)
- **Working directory:** temporary dir where EpsLin will extract EFEs
- **Ensoniq Storage Device:** Shared storate between Ensoniq and PC (like SCSI2SD v6 drive)
- **Path to EpsLin executable:** Runnable EpsLin location

### Example:
![alt text](documentation/settings_view.JPG)


**Note 1: EpsLin used should be the latest one (i.e. which has support for JSON output). See** https://gitlab.com/jforsten/EpsLin
**Note 2: To access raw devices (like SCSI2SD as USB drive) in development, you need to run the Cmd shell as Admin (i.e. where you use the 'npm run dev')**

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build


# lint all JS/Vue component files in `src/`
npm run lint

```

---

* TODO & improvement ideas: *
 - More customization (like what idx to use for tranfer etc to be more flexible of the usage of shared media)
 - Add support for Bank load - i.e. patch load all instruments and songs found in bank
 - Extend the functionality to EpsLin GUI i.e. add support for Efe transfer, MKdir, format etc.
 - Add feature to prepare transfer media - Format, put OS etc.
 - ...


