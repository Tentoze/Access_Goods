package accessgoods.service;

import accessgoods.exceptions.EntityNotFoundException;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;

public abstract class CrudService<ID, TEntity> {


    private final JpaRepository<TEntity, ID> baseRepository;
    private final Class<TEntity> type;

    protected CrudService(JpaRepository<TEntity, ID> baseRepository, Class<TEntity> type) {
        this.baseRepository = baseRepository;
        this.type = type;
    }

    public List<TEntity> getAll() {
        return baseRepository
                .findAll();
    }

    public TEntity getById(ID id) {
        return baseRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException(type, "id", id));
    }

    public List<TEntity> getByIds(Collection<ID> ids) {
        return baseRepository
                .findAllById(ids);
    }

    public TEntity create(TEntity entity) {
        return baseRepository
                .save(entity);
    }

    public TEntity update(ID id, TEntity entity) {
        return baseRepository
                .save(entity);
    }

    public TEntity update(ID id, Consumer<TEntity> modExpr) {
        TEntity entity = getById(id);
        modExpr.accept(entity);

        return baseRepository
                .save(entity);
    }

    public TEntity delete(ID id) {
        TEntity entity = getById(id);
        baseRepository.delete(entity);

        return entity;
    }
}
