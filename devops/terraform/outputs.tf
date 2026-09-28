output "acm_validation_records" {
  description = "CNAME records to add at Hostinger so ACM can issue the certificate."
  value = [
    for o in aws_acm_certificate.site.domain_validation_options : {
      name  = o.resource_record_name
      type  = o.resource_record_type
      value = o.resource_record_value
    }
  ]
}

output "bucket_name" {
  description = "S3 bucket the deploy script uploads to."
  value       = aws_s3_bucket.site.id
}

output "distribution_id" {
  description = "CloudFront distribution the deploy script invalidates."
  value       = aws_cloudfront_distribution.site.id
}

output "cloudfront_domain" {
  description = "Target for the @ (ALIAS) and www (CNAME) records at Hostinger."
  value       = aws_cloudfront_distribution.site.domain_name
}
