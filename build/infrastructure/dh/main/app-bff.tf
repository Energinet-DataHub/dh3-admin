# Copyright 2020 Energinet DataHub A/S
#
# Licensed under the Apache License, Version 2.0 (the "License2");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

module "bff" {
  source                                        = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/app-service?ref=5.8.0"

  name                                          = "bff"
  project_name                                  = var.domain_name_short
  environment_short                             = var.environment_short
  environment_instance                          = var.environment_instance
  resource_group_name                           = azurerm_resource_group.this.name
  location                                      = azurerm_resource_group.this.location
  app_service_plan_id                           = module.plan_bff.id
  application_insights_instrumentation_key      = data.azurerm_key_vault_secret.appi_shared_instrumentation_key.value
  dotnet_framework_version                      = "v6.0"

  app_settings = {
    ApiClientSettings__MessageArchiveBaseUrl    = data.azurerm_key_vault_secret.app_message_archive_api_base_url.value
    ApiClientSettings__MeteringPointBaseUrl     = data.azurerm_key_vault_secret.app_metering_point_webapi_base_url.value
    ApiClientSettings__ChargesBaseUrl           = data.azurerm_key_vault_secret.app_charges_webapi_base_url.value
    ApiClientSettings__MarketParticipantBaseUrl = data.azurerm_key_vault_secret.app_markpart_webapi_base_url.value
    APPINSIGHTS_INSTRUMENTATIONKEY              = data.azurerm_key_vault_secret.appi_shared_instrumentation_key.value
    FRONTEND_OPEN_ID_URL                        = data.azurerm_key_vault_secret.frontend_open_id_url.value
    FRONTEND_SERVICE_APP_ID                     = data.azurerm_key_vault_secret.frontend_service_app_id.value
  }

  tags               = azurerm_resource_group.this.tags
}

module "plan_bff" {
  source                         = "git::https://github.com/Energinet-DataHub/geh-terraform-modules.git//azure/app-service-plan?ref=5.11.0"

  name                           = "bff"
  project_name                   = var.domain_name_short
  environment_short              = var.environment_short
  environment_instance           = var.environment_instance
  resource_group_name            = azurerm_resource_group.this.name
  location                       = azurerm_resource_group.this.location
  kind                           = "Windows"
  monitor_alerts_action_group_id = data.azurerm_key_vault_secret.primary_action_group_id.value

  sku                            = {
    tier  = "PremiumV2"
    size  = "P1v2"
  }

  tags                           = azurerm_resource_group.this.tags
}
