package com.jobtrack.controller;

import com.jobtrack.dto.request.CreateReminderRequest;
import com.jobtrack.dto.response.ApiResponse;
import com.jobtrack.dto.response.ReminderResponse;
import com.jobtrack.security.CurrentUser;
import com.jobtrack.security.UserPrincipal;
import com.jobtrack.service.ReminderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reminders")
@RequiredArgsConstructor
@Tag(name = "Reminders", description = "Manage follow-up reminders and deadlines")
public class ReminderController {

    private final ReminderService reminderService;

    @PostMapping
    @Operation(summary = "Create a reminder")
    public ResponseEntity<ApiResponse<ReminderResponse>> createReminder(
            @CurrentUser UserPrincipal principal,
            @Valid @RequestBody CreateReminderRequest request) {
        ReminderResponse response = reminderService.createReminder(principal.getUser(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Reminder created successfully", response));
    }

    @GetMapping
    @Operation(summary = "List active / uncompleted reminders for current user")
    public ResponseEntity<ApiResponse<List<ReminderResponse>>> getActiveReminders(
            @CurrentUser UserPrincipal principal) {
        List<ReminderResponse> reminders = reminderService.getActiveReminders(principal.getUser());
        return ResponseEntity.ok(ApiResponse.ok(reminders));
    }

    @PatchMapping("/{id}/toggle")
    @Operation(summary = "Toggle reminder completed status")
    public ResponseEntity<ApiResponse<ReminderResponse>> toggleComplete(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id) {
        ReminderResponse response = reminderService.toggleComplete(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.ok("Reminder status updated", response));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete reminder")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @CurrentUser UserPrincipal principal,
            @PathVariable Long id) {
        reminderService.deleteReminder(principal.getUser(), id);
        return ResponseEntity.ok(ApiResponse.ok("Reminder deleted successfully", null));
    }
}
