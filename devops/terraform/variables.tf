variable "domain_name" {
  description = "Canonical (apex) domain of the site. www.<domain_name> is served as well."
  type        = string
  default     = "aviveditorial.com.br"
}

variable "bucket_name" {
  description = "Name of the private S3 bucket holding the static export. Must be globally unique."
  type        = string
  default     = "aviveditorial-com-br-site"
}
