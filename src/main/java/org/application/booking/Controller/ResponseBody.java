package org.application.booking.Controller;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Setter;

@Setter
@Builder
@AllArgsConstructor
public class ResponseBody<T> {
    private boolean success;
    private int statusCode;
    private String message;
    private T content;
    private String error;
}