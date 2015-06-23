from tethys_apps.base import TethysAppBase, url_map_maker
from tethys_apps.base import PersistentStore

class ADHydroChannelOutputViewer(TethysAppBase):
    """
    Tethys app class for ADHydro Channel Output Viewer.
    """

    name = 'ADHydro Channel Output Viewer'
    index = 'adhydro_streamflow:home'
    icon = 'adhydro_streamflow/images/logo.png'
    package = 'adhydro_streamflow'
    root_url = 'adhydro-streamflow'
    color = '#34495e'
        
    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (UrlMap(name='home',
                           url='adhydro-streamflow',
                           controller='adhydro_streamflow.controllers.home'),
                    UrlMap(name='map',
                           url='adhydro-streamflow/map',
                           controller='adhydro_streamflow.controllers.map'),
                    UrlMap(name='get_adhydro_reach_hydrograph_ajax',
                           url='adhydro-streamflow/map/adhydro-get-hydrograph',
                           controller='adhydro_streamflow.controllers_ajax.adhydro_get_hydrograph'),
                    UrlMap(name='adhydro_get_avaialable_dates_ajax',
                           url='adhydro-streamflow/map/adhydro-get-avaialable-dates',
                           controller='adhydro_streamflow.controllers_ajax.adhydro_get_avaialable_dates'),
                    UrlMap(name='settings',
                           url='adhydro-streamflow/settings',
                           controller='adhydro_streamflow.controllers.settings'),
                    UrlMap(name='update_settings_ajax',
                           url='adhydro-streamflow/settings/update',
                           controller='adhydro_streamflow.controllers_ajax.settings_update'),
                    UrlMap(name='add-watershed',
                           url='adhydro-streamflow/add-watershed',
                           controller='adhydro_streamflow.controllers.add_watershed'),
                    UrlMap(name='add-watershed-ajax',
                           url='adhydro-streamflow/add-watershed/submit',
                           controller='adhydro_streamflow.controllers_ajax.watershed_add'),
                    UrlMap(name='add-watershed-update-ajax',
                           url='adhydro-streamflow/add-watershed/update',
                           controller='adhydro_streamflow.controllers_ajax.watershed_update'),
                    UrlMap(name='add-watershed-delete-ajax',
                           url='adhydro-streamflow/add-watershed/delete',
                           controller='adhydro_streamflow.controllers_ajax.watershed_delete'),
                    UrlMap(name='manage-watersheds',
                           url='adhydro-streamflow/manage-watersheds',
                           controller='adhydro_streamflow.controllers.manage_watersheds'),
                    UrlMap(name='manage-watersheds-table',
                           url='adhydro-streamflow/manage-watersheds/table',
                           controller='adhydro_streamflow.controllers.manage_watersheds_table'),
                    UrlMap(name='manage-watersheds-edit',
                           url='adhydro-streamflow/manage-watersheds/edit',
                           controller='adhydro_streamflow.controllers.edit_watershed'),
                    UrlMap(name='delete-watershed',
                           url='adhydro-streamflow/manage-watersheds/delete',
                           controller='adhydro_streamflow.controllers_ajax.watershed_delete'),
                    UrlMap(name='update-watershed',
                           url='adhydro-streamflow/manage-watersheds/submit',
                           controller='adhydro_streamflow.controllers_ajax.watershed_update'),
                    UrlMap(name='add-geoserver',
                           url='adhydro-streamflow/add-geoserver',
                           controller='adhydro_streamflow.controllers.add_geoserver'),
                    UrlMap(name='add-geoserver-ajax',
                           url='adhydro-streamflow/add-geoserver/submit',
                           controller='adhydro_streamflow.controllers_ajax.geoserver_add'),
                    UrlMap(name='manage-geoservers',
                           url='adhydro-streamflow/manage-geoservers',
                           controller='adhydro_streamflow.controllers.manage_geoservers'),
                    UrlMap(name='manage-geoservers-table',
                           url='adhydro-streamflow/manage-geoservers/table',
                           controller='adhydro_streamflow.controllers.manage_geoservers_table'),
                    UrlMap(name='update-geoservers-ajax',
                           url='adhydro-streamflow/manage-geoservers/submit',
                           controller='adhydro_streamflow.controllers_ajax.geoserver_update'),
                    UrlMap(name='delete-geoserver-ajax',
                           url='adhydro-streamflow/manage-geoservers/delete',
                           controller='adhydro_streamflow.controllers_ajax.geoserver_delete'),
                    UrlMap(name='add-data-store',
                           url='adhydro-streamflow/add-data-store',
                           controller='adhydro_streamflow.controllers.add_data_store'),
                    UrlMap(name='add-data-store-ajax',
                           url='adhydro-streamflow/add-data-store/submit',
                           controller='adhydro_streamflow.controllers_ajax.data_store_add'),
                    UrlMap(name='manage-data-stores',
                           url='adhydro-streamflow/manage-data-stores',
                           controller='adhydro_streamflow.controllers.manage_data_stores'),
                    UrlMap(name='manage-data-stores-table',
                           url='adhydro-streamflow/manage-data-stores/table',
                           controller='adhydro_streamflow.controllers.manage_data_stores_table'),
                    UrlMap(name='update-data-store-ajax',
                           url='adhydro-streamflow/manage-data-stores/submit',
                           controller='adhydro_streamflow.controllers_ajax.data_store_update'),
                    UrlMap(name='delete-data-store-ajax',
                           url='adhydro-streamflow/manage-data-stores/delete',
                           controller='adhydro_streamflow.controllers_ajax.data_store_delete'),
                    UrlMap(name='add-watershed-group',
                           url='adhydro-streamflow/add-watershed-group',
                           controller='adhydro_streamflow.controllers.add_watershed_group'),
                    UrlMap(name='add-watershed-group-ajax',
                           url='adhydro-streamflow/add-watershed-group/submit',
                           controller='adhydro_streamflow.controllers_ajax.watershed_group_add'),
                    UrlMap(name='manage-watershed-groups',
                           url='adhydro-streamflow/manage-watershed-groups',
                           controller='adhydro_streamflow.controllers.manage_watershed_groups'),
                    UrlMap(name='manage-watershed-groups-table',
                           url='adhydro-streamflow/manage-watershed-groups/table',
                           controller='adhydro_streamflow.controllers.manage_watershed_groups_table'),
                    UrlMap(name='update-watershed-group-ajax',
                           url='adhydro-streamflow/manage-watershed-groups/submit',
                           controller='adhydro_streamflow.controllers_ajax.watershed_group_update'),
                    UrlMap(name='delete-watershed-group-ajax',
                           url='adhydro-streamflow/manage-watershed-groups/delete',
                           controller='adhydro_streamflow.controllers_ajax.watershed_group_delete'),
        )
        return url_maps
        
    def persistent_stores(self):
        """
        Add one or more persistent stores
        """
        stores = (PersistentStore(name='main_db',
                                  initializer='init_stores:init_erfp_settings_db',
                                  spatial=False
                ),
        )

        return stores
