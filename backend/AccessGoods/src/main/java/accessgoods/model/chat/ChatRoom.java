package accessgoods.model.chat;

import accessgoods.model.Account;
import accessgoods.model.Item;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "chat_room")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "room_id", nullable = false)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "item_id")
    private Item item;
    @ManyToOne
    @JoinColumn(name = "item_owner_account_id")
    private Account itemOwnerAccount;
    @ManyToOne
    @JoinColumn(name = "sender_account_id")
    private Account senderAccount;
    @Column
    private LocalDateTime messageTimestamp;
    @Column
    private String lastMessage;
}
