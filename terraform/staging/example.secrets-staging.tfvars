# Environment variables needed for Elastic Beanstalk
eb_env_variables = {
  APPLICATION_NAME = ""
  AWS_REGION       = "us-west-2"
  CLIENT_URL       = ""
  DB_HOST          = ""
  DB_NAME          = ""
  DB_PASSWORD      = ""
  DB_USER          = ""
  EMAIL_DOMAIN     = ""
  ERROR_LOGS       = "/opt/node/app/server-logs"
  JWT_SECRET       = ""
  NODE_ENV         = "production"
  SENTRY_DSN       = ""
  SERVER_PORT      = "3000"
  USER_SEED_EMAIL  = ""
}

# Domain name for the server
api_domain_name = ""

# Elastic Beanstalk application name
application_name = ""

# AssumeRole ARN to allow for creation/deletion of resources
aws_assume_role_arn = "arn:aws:iam::008036621198:role/SuperDevAssumeRole"

# Hosted zone (defaulted to shift3sandbox.com.) but can be changed if needed
aws_route53_hosted_zone = "shift3sandbox.com."

# Database name
database_name = ""

# Database password
database_password = ""

# Database username
database_username = ""

# Default project tags
default_tags = {
  "ClientName"      = ""
  "Compliance"      = ""
  "Developer"       = ""
  "Environment"     = ""
  "Organization"    = "Shift3"
  "ProjectManager"  = ""
  "ProjectName"     = ""
  "Purpose"         = "Web Server"
}

eb_iam_profile = "aws-elasticbeanstalk-ec2-role"

eb_service_role = "arn:aws:iam::008036621198:role/aws-elasticbeanstalk-service-role"

rds_name = ""