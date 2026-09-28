terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }

  # State is kept locally (terraform.tfstate, gitignored). It is the only record of these
  # resources, so back it up — see "Production deploy (AWS)" in CLAUDE.md.
}

# Everything lives in us-east-1: CloudFront only accepts ACM certificates from this region, and
# keeping the bucket here too avoids a second provider. Credentials come from the default AWS
# credential chain (default CLI profile or AWS_* environment variables).
provider "aws" {
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "aviv-landing-page"
      ManagedBy = "terraform"
    }
  }
}
