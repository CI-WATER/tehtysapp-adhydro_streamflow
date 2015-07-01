# sfpt_dataset_manager
Streamflow Prediction Tool Dataset Manager (for CKAN and HydroShare)

#Installation Instructions

##Step 1: Install tethys_dataset_services
```
$ pip install requests_toolbelt
$ pip install tethys_dataset_services
```
##Step 2: Download the source code
```
$ cd /path/to/your/scripts/
$ git clone https://github.com/CI-WATER/sfpt_dataset_manager.git
```

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
