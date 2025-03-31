package com.backend.kidsnomy.common.service;

import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserKeyService {

    private final UserRepository userRepository;

    /**
     * 사용자 이메일로 userKey를 조회합니다.
     * @param email 사용자 이메일
     * @return SSAFY API에서 사용할 userKey
     * @throws AuthenticationException 사용자를 찾을 수 없거나 userKey가 없는 경우
     */
    public String getUserKeyByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("사용자를 찾을 수 없습니다."));

        String userKey = user.getUserKey();
        if (userKey == null || userKey.isEmpty()) {
            throw new AuthenticationException("유효한 userKey가 없습니다. 관리자에게 문의하세요.");
        }

        return userKey;
    }
}
