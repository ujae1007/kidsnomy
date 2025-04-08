package com.backend.kidsnomy.user.repository;

import com.backend.kidsnomy.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    List<User> findAllByAgeAndGenderAndIsParent(int age, String gender, boolean isParent);
}