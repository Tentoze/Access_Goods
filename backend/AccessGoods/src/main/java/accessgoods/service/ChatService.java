package accessgoods.service;

import accessgoods.model.Account;
import accessgoods.model.Image;
import accessgoods.model.Item;
import accessgoods.model.chat.ChatMessage;
import accessgoods.model.chat.ChatRoom;
import accessgoods.model.chat.dto.ChatMessageDto;
import accessgoods.model.chat.dto.ChatRoomDto;
import accessgoods.repository.ChatMessageRepository;
import accessgoods.repository.ChatRoomRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final AccountDetailsService accountDetailsService;
    private final ItemService itemService;

    public ChatService(ChatMessageRepository chatMessageRepository, AccountDetailsService accountDetailsService, ChatRoomRepository chatRoomRepository, ItemService itemService) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.accountDetailsService = accountDetailsService;
        this.itemService = itemService;
    }

    public ChatRoom createOrGetChatRoom(Long itemId) throws AccessDeniedException {
        Item item = itemService.getById(itemId);
        Account account = accountDetailsService.getCurrentUser();
        if (account == null) {
            throw new AccessDeniedException("You have to be login in");
        }
        Optional<ChatRoom> chatRoom = chatRoomRepository.findByItem_IdAndItemOwnerAccount_IdAndSenderAccount_Id(itemId, item.getAccount().getId(), account.getId());
        return chatRoom.orElseGet(() -> chatRoomRepository.save(ChatRoom.builder().item(item)
                .itemOwnerAccount(item.getAccount())
                .senderAccount(account)
                .messageTimestamp(LocalDateTime.now()).build()));
    }

    public ChatMessage sendMessage(Long chatRoomId, Long userReceiverId, String content) throws AccessDeniedException {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow(() -> new EntityNotFoundException("Chat room with that id doesn't exist"));
        if (chatRoom.getSenderAccount().getId().equals(userReceiverId) || chatRoom.getItemOwnerAccount().getId().equals(userReceiverId)) {
            Account account = accountDetailsService.getCurrentUser();
            if (account == null) {
                throw new AccessDeniedException("You have to be login in");
            }
            chatRoom.setMessageTimestamp(LocalDateTime.now());
            chatRoom.setLastMessage(content);
            chatRoomRepository.save(chatRoom);
            return chatMessageRepository.save(ChatMessage.builder()
                    .content(content)
                    .receiverAccount(Account.builder().id(userReceiverId).build())
                    .senderAccount(account)
                    .messageTimestamp(LocalDateTime.now())
                    .chatRoom(chatRoom)
                    .build());
        } else {
            throw new IllegalStateException("You cannot send message to user who is not in this chat room");
        }
    }

    public List<ChatMessageDto> getChatHistory(Long chatRoomId) throws AccessDeniedException {
        ChatRoom chatRoom = chatRoomRepository.findById(chatRoomId).orElseThrow(() -> new EntityNotFoundException("Chat room with that id doesn't exist"));

        Account account = accountDetailsService.getCurrentUser();
        if (account == null) {
            throw new AccessDeniedException("You have to be login in");
        }
        List<ChatMessage> chatMessageList = chatMessageRepository.findByChatRoom_Id(chatRoomId);
        chatMessageList.sort(Comparator.comparing(ChatMessage::getMessageTimestamp));
        return chatMessageList.stream().map(chatMessage -> ChatMessageDto.builder().id(chatMessage.getId())
                .senderAccountId(chatMessage.getSenderAccount().getId())
                .receiverAccountId(chatMessage.getReceiverAccount().getId())
                .content(chatMessage.getContent())
                .chatRoomId(chatMessage.getChatRoom().getId())
                .messageTimestamp(chatMessage.getMessageTimestamp().format(DateTimeFormatter.ofPattern("MM/dd/yyyy 'at' hh:mm")))
                .build()).collect(Collectors.toList());
    }

    public List<ChatRoomDto> getChatRooms() throws AccessDeniedException {
        Account account = accountDetailsService.getCurrentUser();
        if (account == null) {
            throw new AccessDeniedException("You have to be login in");
        }
        List<ChatRoom> chatRooms = chatRoomRepository.findBySenderAccount_IdOrItemOwnerAccount_Id(account.getId(), account.getId());
        return chatRooms.stream().map(chatRoom -> ChatRoomDto.builder().id(chatRoom.getId())
                .itemId(chatRoom.getItem().getId())
                .itemOwnerAccountId(chatRoom.getItemOwnerAccount().getId())
                .itemOwnerAccountPhoto(chatRoom.getItemOwnerAccount().getPhoto())
                .itemOwnerAccountName(chatRoom.getItemOwnerAccount().getFirstName() + " " + chatRoom.getItemOwnerAccount().getLastName())
                .senderAccountPhoto(chatRoom.getSenderAccount().getPhoto())
                .senderAccountName(chatRoom.getSenderAccount().getFirstName() + " " + chatRoom.getSenderAccount().getLastName())
                .senderAccountId(chatRoom.getSenderAccount().getId())
                .messageTimestamp(chatRoom.getMessageTimestamp().format(DateTimeFormatter.ofPattern("MM/dd/yyyy 'at' hh:mm")))
                .itemPhoto(chatRoom.getItem().getImages().stream().findFirst().map(Image::getImage).orElseGet(() -> {return "";}))
                .itemName(chatRoom.getItem().getName())
                .lastMessage(chatRoom.getLastMessage())
                .build()).collect(Collectors.toList());
    }
}
