# Database Security and Best Practices Guide

## 🔐 Security Configuration

### Database Users Created
- **`tcg_app`** - Application user with CRUD permissions
- **`tcg_readonly`** - Read-only user for reporting/analytics
- **`tcg_backup`** - Backup user with minimal required permissions

### Password Security
⚠️ **IMPORTANT**: Change default passwords in `00_security_setup.sql` before running:

```sql
-- Replace these with strong passwords
'your_secure_password'    → Strong app password (16+ chars, mixed case, numbers, symbols)
'readonly_password'       → Strong readonly password  
'backup_password'         → Strong backup password
```

### Connection Security
- Use SSL/TLS connections in production
- Limit connections by IP address
- Use connection pooling in application

## 🚀 Performance Best Practices

### Indexing Strategy
- **Composite indexes** on frequently joined columns
- **Full-text indexes** for card name/description searches
- **Covering indexes** for common query patterns

### Query Optimization
- Use `EXPLAIN` to analyze query performance
- Avoid `SELECT *` - specify needed columns
- Use `LIMIT` for large result sets
- Cache frequently accessed data

### Database Configuration
```sql
-- Recommended MySQL settings for production
innodb_buffer_pool_size = 70% of available RAM
innodb_log_file_size = 256M
max_connections = 200
query_cache_size = 64M
```

## 📊 Monitoring and Maintenance

### Automated Procedures
- **`HealthCheck()`** - System health monitoring
- **`ValidateDataIntegrity()`** - Cross-database validation
- **`UpdateMarketPrices()`** - Price update automation
- **`CleanupOldWishlistItems()`** - Data cleanup

### Backup Strategy
```bash
# Daily full backup
mysqldump -u tcg_backup -p --single-transaction --routines --triggers \
  --databases tcg_shared tcg_pokemon tcg_magic tcg_yugioh tcg_lorcana > backup.sql

# Weekly backup with compression
mysqldump -u tcg_backup -p --single-transaction --routines --triggers \
  --databases tcg_shared tcg_pokemon tcg_magic tcg_yugioh tcg_lorcana | \
  gzip > backup_$(date +%Y%m%d).sql.gz
```

### Log Monitoring
Monitor these logs for issues:
- **Error log** - Database errors and warnings
- **Slow query log** - Performance bottlenecks
- **Binary log** - Replication and point-in-time recovery

## 🛡️ Security Hardening

### Network Security
- **Firewall**: Only allow necessary ports (3306 for MySQL)
- **VPN**: Use VPN for remote database access
- **Private networks**: Keep databases on private subnets

### Authentication
- **Strong passwords**: 16+ characters with complexity
- **Certificate-based auth**: Use SSL certificates for authentication
- **Two-factor auth**: If supported by your MySQL version

### Authorization
- **Principle of least privilege**: Users get minimum required permissions
- **Role-based access**: Group permissions by role
- **Regular audits**: Review user permissions quarterly

### Data Protection
- **Encryption at rest**: Enable MySQL data-at-rest encryption
- **Encryption in transit**: Force SSL connections
- **Sensitive data**: Hash/encrypt user passwords and PII

## 📈 Scaling Considerations

### Read Replicas
```sql
-- Set up read replicas for analytics workload
-- Point reporting queries to replica servers
```

### Partitioning
```sql
-- Partition large tables by date or game
ALTER TABLE collection PARTITION BY HASH(game_id) PARTITIONS 4;
```

### Caching
- **Application cache**: Redis/Memcached for frequently accessed data
- **Query cache**: MySQL query cache for repeated queries
- **CDN**: Cache card images and static content

### Load Balancing
- **Database proxy**: Use ProxySQL or similar
- **Connection pooling**: PgBouncer or built-in pooling
- **Read/write splitting**: Route reads to replicas

## 🔍 Troubleshooting

### Common Issues
1. **Slow queries**: Check `EXPLAIN` output and add indexes
2. **Connection limits**: Increase `max_connections` or use pooling
3. **Lock timeouts**: Optimize transaction size and duration
4. **Disk space**: Monitor and clean up old logs/backups

### Performance Monitoring
```sql
-- Check slow queries
SELECT * FROM information_schema.PROCESSLIST WHERE TIME > 30;

-- Monitor table sizes
SELECT 
    table_schema,
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES 
ORDER BY (data_length + index_length) DESC;
```

## 📋 Maintenance Checklist

### Daily
- [ ] Check error logs
- [ ] Monitor disk space
- [ ] Verify backups completed

### Weekly  
- [ ] Run health check procedure
- [ ] Analyze slow query log
- [ ] Review user activity

### Monthly
- [ ] Update statistics (`ANALYZE TABLE`)
- [ ] Clean up old logs and backups
- [ ] Review and optimize indexes
- [ ] Security audit (user permissions)

### Quarterly
- [ ] Performance review and optimization
- [ ] Disaster recovery testing
- [ ] Security penetration testing
- [ ] Capacity planning review
