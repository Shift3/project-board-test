output "host_name" {
  description = "Endpoint value for the RDS instance"
  value       = aws_db_instance.rds_db.endpoint
}