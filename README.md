#ADHydro Channel Output Viewer
*tethysapp-adhydro_streamflow*

**This app is created to run in the Teyths programming environment.
See: https://github.com/CI-WATER/tethys and http://tethys-platform.readthedocs.org/en/1.0.0/**

*This app requires you to have a valid channelSurfacewaterDepth output ADHydro and its associated channel shapefile
For more information on ADHydro, see http://www.uwyo.edu/cchh/adhydro.html

##Prerequisites:
- Tethys Platform (CKAN, PostgresQL, GeoServer)
- netCDF4-python (Python package)

###Install netCDF4-python on Ubuntu:
```
$ apt-get install python-dev zlib1g-dev libhdf5-serial-dev libnetcdf-dev 
$ pip install numpy
$ pip install netCDF4
```
###Install netCDF4-python on Redhat:
*Note: this app was desgined and tested in Ubuntu*
```
$ yum install netcdf4-python
$ yum install hdf5-devel
$ yum install netcdf-devel
$ pip install numpy
$ pip install netCDF4
```
##Installation:
Clone the app into the directory you want:
```
$ git clone https://github.com/CI-WATER/tethysapp-adhydro_streamflow.git
$ cd tethysapp-adhydro_streamflow
$ git submodule init
$ git submodule update
```
Then install the app in Tethys Platform:
```
$ . /usr/lib/tethys/bin/activate
$ cd tethysapp-adhydro_streamflow
$ python setup.py install
$ tethys syncstores adhydro_streamflow
$ python /usr/lib/tethys/src/manage.py collectstatic

```
Restart the Apache Server:
See: http://tethys-platform.readthedocs.org/en/1.0.0/production.html#enable-site-and-restart-apache

##Quick Setup Workflow For Viewing ADHydro Results

- Generate a shapefile from the ADhydro geometry with the channel arcs. The shapefile should be reprojected into a Geoserver compatible projection i.e. WGS84 and have a attribute called 'comid' that has the right channel arc id number which is the same id for the channelSurfacewaterDepth in both the ADHydro output files display.nc and state.nc. 
- Since ADHYdro can have massive output files, the next step is to extract only the necessary variables from the display.nc or the state.nc output of ADHydro, whichever you are interested in, and the extracted netcdf file needs to have three variables: channelSurfacewaterDepth, referenceDate, currentTime. The recommended tool to do this is the NCO 4.5.0. Once installed, the terminal command to run in the same directory of a display.nc as an exampel is the following: "ncks -v referenceDate,currentTime,channelSurfacewaterDepth display.nc adhydro_viewer_app.nc"
- Use the app interface in the browser to upload your shapefile. To do this, use the Add a Watershed form.
- Add the new extracted netcdf file to the app in the adhydro_predictions directory. It is necessary to make two sub directories in the folder that correspond to what was put in the Add a Watershed form. The first directory should correspond to a lowercase version of the watershed name and the second a lowercase version of the subbasin name. An example is if the watershed is named "Green River" and the subbasin is named "Upper", there would need to be a directory ./adhydro_predictions/green_river/upper Place the extracted netcdf in the subbasin folder.
- The project should be choosesable in the Select a Watershed portion of the app in the browser. The user should just need to select the arcs on the map and a corresponding plot should appear.



##Updating the App:
Update the local repository and Tethys Platform instance.
```
$ . /usr/lib/tethys/bin/activate
$ cd tethysapp-adhydro_streamflow
$ git pull
$ git submodule update
$ tethys syncstores adhydro_streamflow
$ python /usr/lib/tethys/src/manage.py collectstatic
```
Restart the Apache Server:
See: http://tethys-platform.readthedocs.org/en/1.0.0/production.html#enable-site-and-restart-apache

#Troubleshooting
If you see this error:
ImportError: No module named packages.urllib3.poolmanager
```
$ pip install pip --upgrade
```
Restart your terminal
```
$ pip install requests --upgrade
```
