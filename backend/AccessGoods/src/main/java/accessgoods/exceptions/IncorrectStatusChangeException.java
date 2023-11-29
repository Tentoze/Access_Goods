package accessgoods.exceptions;

import accessgoods.model.RentStatus;
import lombok.Getter;

@Getter
public class IncorrectStatusChangeException extends AppException {
    private static final String messageTemplate = "Status change from status %s to status %s is incorrect!";

    public <T extends Object> IncorrectStatusChangeException(RentStatus fromRentStatus, RentStatus toRentStatus) {
        super(String.format(messageTemplate, fromRentStatus.toString(), toRentStatus.toString()));
    }
}
