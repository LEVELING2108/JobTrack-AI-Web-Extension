package com.jobtrack;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the JobTrack REST API backend application.
 */
@SpringBootApplication
public class JobTrackApplication {

    public static void main(String[] args) {
        SpringApplication.run(JobTrackApplication.class, args);
    }
}
