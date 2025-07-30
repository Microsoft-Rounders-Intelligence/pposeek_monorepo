package com.rounders.pposeek.common.model.dto.kafka;
import lombok.Data;

@Data
public class Notification {
    private String userId;
    private String message;
}
