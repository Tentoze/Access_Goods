package accessgoods.exceptions;

import lombok.Getter;

@Getter
public class AppException extends RuntimeException {

    private final String message;
    private final Throwable cause;

    public AppException(String message) {
        this(message, null);
    }

    public AppException(String message, Throwable cause) {
        super(message, cause);

        this.message = message;
        this.cause = cause;
    }
}
