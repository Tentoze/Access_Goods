package accessgoods.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

import static jakarta.persistence.CascadeType.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "account_gen")
    @SequenceGenerator(name = "account_gen", sequenceName = "account_seq", allocationSize = 1)
    @Column(name = "account_id", nullable = false)
    private Long id;

    @Column
    private String email;

    @Column
    private String firstName;

    @Column
    private String lastName;

    @Column
    private String phoneNumber;
    @Column(columnDefinition = "text")
    private String photo;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime modifiedAt;

    @Column
    private boolean isEnabled = true;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Role role = Role.CLIENT;

    @Column
    private String password;

    @Embedded
    private Localization localization;
    @OneToMany(mappedBy = "account", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Item> item;
    @OneToMany(mappedBy = "lendingAccount")
    private List<Rent> lentItems;

    @OneToMany(mappedBy = "borrowingAccount")
    private List<Rent> borrowedItems;
    @OneToMany(mappedBy = "opinionGiverAccount")
    private List<Opinion> listOfGivenOpinions;
    @OneToMany(mappedBy = "opinionReceiverAccount")
    private List<Opinion> listOfTakenOpinions;
    @Column
    private Float averageRating;

    public Account(String firstName, String lastName, String email, String phoneNumber, String password) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.password = password;
    }
}