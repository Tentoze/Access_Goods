package accessgoods.exceptions;

import lombok.Getter;

@Getter
public class EntityNotFoundException extends AppException {

    private static final String messageTemplate = "%s entity with %s = %s was not found!";

    private final Class<?> entityClass;

    public <T extends Object> EntityNotFoundException(Class<T> entityClass, String paramName, Object paramValue) {
        super(String.format(messageTemplate, entityClass, paramName, paramValue));

        this.entityClass = entityClass;
    }


    public <T extends Object> EntityNotFoundException(Class<T> entityClass, String paramName, Object paramValue, Object paramValue2) {
        super(String.format(messageTemplate, entityClass, paramName, paramValue, paramValue2));

        this.entityClass = entityClass;
    }
}
