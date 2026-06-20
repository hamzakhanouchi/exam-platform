package com.exam.platform.dto.request;

import lombok.Data;

@Data
public class SecurityLogRequest {
    private String eventType;
    private String details;
    private Long sessionId; // optionnel

    // Getters et Setters
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
    public Long getSessionId() { return sessionId; }
    public void setSessionId(Long sessionId) { this.sessionId = sessionId; }
}