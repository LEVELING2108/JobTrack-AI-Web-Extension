package com.jobtrack.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.io.File;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URI;
import java.net.URISyntaxException;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:#{null}}")
    private String defaultUrl;

    @Value("${spring.datasource.username:#{null}}")
    private String defaultUsername;

    @Value("${spring.datasource.password:#{null}}")
    private String defaultPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        String databaseUrl = System.getenv("DATABASE_URL");
        if (databaseUrl != null && !databaseUrl.isBlank()) {
            log.info("Detected DATABASE_URL environment variable, configuring Cloud DataSource");
            try {
                return createDataSourceFromUrl(databaseUrl);
            } catch (Exception e) {
                log.error("Failed to parse DATABASE_URL: {}. Falling back to standard configuration", e.getMessage());
            }
        }

        String targetUrl = defaultUrl != null ? defaultUrl : "jdbc:postgresql://localhost:5434/jobtrack_db";

        // If targetUrl points to localhost and localhost is not reachable, fall back to embedded H2 database
        if (isLocalhostUrl(targetUrl) && !isPortReachable(targetUrl)) {
            log.warn("PostgreSQL at target URL '{}' is not reachable and no remote DATABASE_URL is configured. " +
                     "Falling back to embedded H2 file database (PostgreSQL compatibility mode).", targetUrl);
            return createEmbeddedH2DataSource();
        }

        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(targetUrl);
        config.setUsername(defaultUsername != null ? defaultUsername : "postgres");
        config.setPassword(defaultPassword != null ? defaultPassword : "postgres");
        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }

    private boolean isLocalhostUrl(String url) {
        return url != null && (url.contains("localhost") || url.contains("127.0.0.1"));
    }

    private boolean isPortReachable(String url) {
        try {
            String clean = url.replace("jdbc:postgresql://", "");
            int slashIndex = clean.indexOf('/');
            if (slashIndex != -1) {
                clean = clean.substring(0, slashIndex);
            }
            String host = "127.0.0.1";
            int port = 5434;
            if (clean.contains(":")) {
                String[] parts = clean.split(":");
                host = parts[0];
                port = Integer.parseInt(parts[1]);
            }

            try (Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(host, port), 1000);
                return true;
            }
        } catch (Exception e) {
            return false;
        }
    }

    private DataSource createEmbeddedH2DataSource() {
        File dataDir = new File("./data");
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:h2:file:./data/jobtrack_db;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        return new HikariDataSource(config);
    }

    private DataSource createDataSourceFromUrl(String databaseUrl) throws URISyntaxException {
        HikariConfig config = new HikariConfig();

        if (databaseUrl.startsWith("jdbc:")) {
            config.setJdbcUrl(databaseUrl);
            if (defaultUsername != null) config.setUsername(defaultUsername);
            if (defaultPassword != null) config.setPassword(defaultPassword);
        } else {
            // Convert standard PaaS postgres://user:password@host:port/database to jdbc:postgresql://...
            URI dbUri = new URI(databaseUrl);
            String userInfo = dbUri.getUserInfo();
            if (userInfo != null) {
                String[] parts = userInfo.split(":");
                config.setUsername(parts[0]);
                if (parts.length > 1) {
                    config.setPassword(parts[1]);
                }
            }

            int port = dbUri.getPort() != -1 ? dbUri.getPort() : 5432;
            String path = dbUri.getPath();
            String host = dbUri.getHost();
            String query = dbUri.getQuery();

            StringBuilder jdbcUrl = new StringBuilder("jdbc:postgresql://")
                    .append(host).append(":").append(port).append(path);

            if (query != null && !query.isBlank()) {
                jdbcUrl.append("?").append(query);
            }

            config.setJdbcUrl(jdbcUrl.toString());
        }

        config.setDriverClassName("org.postgresql.Driver");
        return new HikariDataSource(config);
    }
}
