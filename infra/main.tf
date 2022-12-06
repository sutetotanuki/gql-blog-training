terraform {
  required_version = "~> 1.3.0"
  backend "gcs" {
    prefix = "tfstate/v1"
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.primary_region
}

locals {
  backend_app_name  = "blog-training-backend-app"
  frontend_app_name = "blog-training-frontend-app"
}

module "artifact-registry" {
  source                     = "./modules/artifact-registry"
  gcp_project_id             = var.gcp_project_id
  artifact_registry_location = var.primary_region
  backend_ap_name            = local.backend_app_name
  frontend_app_name          = local.frontend_app_name
}

module "cloud-sql" {
  source        = "./modules/cloud-sql"
  target_region = var.primary_region
}

module "cloud-build" {
  source                     = "./modules/cloud-build"
  gcp_project_id             = var.gcp_project_id
  region                     = var.primary_region
  cloudsql_instance_fullname = module.cloud-sql.blog_training_db_connection_name
  backend_app_name           = local.backend_app_name
  github_owner               = "sutetotanuki"
  github_app_repo_name       = "gql-blog-training"
}
