variable "gcp_project_id" {}
variable "backend_ap_name" {}
variable "frontend_app_name" {}

variable "artifact_registry_location" {
  type        = string
  description = "Artifact Registry のロケーション"
}

resource "google_artifact_registry_repository" "blog-backend-trainig-app" {
  provider = google-beta

  project       = var.gcp_project_id
  location      = var.artifact_registry_location
  repository_id = var.backend_ap_name
  description   = "バックエンドアプリケーション"
  format        = "DOCKER"
}

resource "google_artifact_registry_repository" "blog-frontend-traning-app" {
  provider = google-beta

  project       = var.gcp_project_id
  location      = var.artifact_registry_location
  repository_id = var.frontend_app_name
  description   = "フロントエンドアプリケーション"
  format        = "DOCKER"
}
