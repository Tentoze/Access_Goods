package accessgoods.service;

import accessgoods.model.Opinion;
import accessgoods.repository.OpinionRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class OpinionService extends CrudService<Long, Opinion>{
    private final OpinionRepository opinionRepository;

    public OpinionService(OpinionRepository opinionRepository) {
        super(opinionRepository, Opinion.class);
        this.opinionRepository = opinionRepository;
    }
}
