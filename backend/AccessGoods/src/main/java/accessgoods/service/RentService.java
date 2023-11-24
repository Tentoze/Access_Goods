package accessgoods.service;

import accessgoods.model.Rent;
import accessgoods.repository.RentRepository;
import org.springframework.stereotype.Service;

@Service
public class RentService extends CrudService<Long, Rent> {
    private final RentRepository rentRepository;

    public RentService(RentRepository rentRepository) {
        super(rentRepository, Rent.class);
        this.rentRepository = rentRepository;
    }
}
