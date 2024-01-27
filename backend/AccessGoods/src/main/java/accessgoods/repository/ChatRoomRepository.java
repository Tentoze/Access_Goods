package accessgoods.repository;

import accessgoods.model.Category;
import accessgoods.model.chat.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    List<ChatRoom> findBySenderAccount_IdOrItemOwnerAccount_Id(Long id, Long id1);
    Optional<ChatRoom> findByItem_IdAndItemOwnerAccount_IdAndSenderAccount_Id(Long id, Long id1, Long id2);

    @Override
    Optional<ChatRoom> findById(Long aLong);
}