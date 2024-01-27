package accessgoods.repository;

import accessgoods.model.Category;
import accessgoods.model.chat.ChatMessage;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long>{
    @Query("select c from ChatMessage c where c.chatRoom.id = ?1")
    List<ChatMessage> findByChatRoom_Id(Long id);
}
