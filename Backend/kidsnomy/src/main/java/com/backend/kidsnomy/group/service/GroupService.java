package com.backend.kidsnomy.group.service;

import com.backend.kidsnomy.group.dto.GroupListResponseDto;
import com.backend.kidsnomy.group.dto.GroupParticipationRequestDto;
import com.backend.kidsnomy.group.entity.GroupInfo;
import com.backend.kidsnomy.group.entity.GroupMembership;
import com.backend.kidsnomy.group.repository.GroupInfoRepository;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class GroupService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final GroupInfoRepository groupInfoRepository;
    private final GroupMembershipRepository groupMembershipRepository;

    public GroupService(JwtTokenProvider jwtTokenProvider,
                        UserRepository userRepository,
                        GroupInfoRepository groupInfoRepository,
                        GroupMembershipRepository groupMembershipRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.groupInfoRepository = groupInfoRepository;
        this.groupMembershipRepository = groupMembershipRepository;
    }

    // 	토큰에서 사용자 정보를 추출하여 새로운 그룹을 생성하고 본인을 자동 참여
    @Transactional
    public String createGroup(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자 정보를 찾을 수 없습니다."));

        // 부모 사용자만 그룹 생성 가능
        if (user.getIsParent() == null || !user.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모 사용자만 그룹을 생성할 수 있습니다.");
        }

        String groupCode = generateUniqueGroupCode();
        GroupInfo group = new GroupInfo(groupCode, user.getId());
        groupInfoRepository.save(group);

        // groupInfo 저장 후 id 확보됨 → groupId로 멤버십 등록
        GroupMembership membership = new GroupMembership(group.getId(), user.getId());
        groupMembershipRepository.save(membership);

        return groupCode;
    }


    // 요청 헤더에서 Bearer 토큰 추출
    public String extractTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }

    // 중복되지 않는 6자리 숫자 그룹 코드 생성
    private String generateUniqueGroupCode() {
        SecureRandom random = new SecureRandom();
        String code;
        do {
            code = String.format("%06d", random.nextInt(1000000));
        } while (groupInfoRepository.existsByGroupCode(code));
        return code;
    }
    
    // 그룹 참여
    @Transactional
    public void participateGroup(GroupParticipationRequestDto dto, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        GroupInfo group = groupInfoRepository.findByGroupCode(dto.getGroupCode());
        if (group == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 그룹이 존재하지 않습니다.");
        }

        // 중복 참여 방지 (groupId 기준)
        boolean alreadyJoined = groupMembershipRepository
                .existsByGroupIdAndUserId(group.getId(), user.getId());

        if (alreadyJoined) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 참여 중인 그룹입니다.");
        }

        GroupMembership membership = new GroupMembership(group.getId(), user.getId());
        groupMembershipRepository.save(membership);
    }
    
    // 그룹 탈퇴
    
    // 본인이 가입한 그룹 목록 조회
    @Transactional(readOnly = true)
    public List<GroupListResponseDto> getMyGroups(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        List<GroupMembership> memberships = groupMembershipRepository.findByUserId(user.getId());

        return memberships.stream()
                .map(membership -> {
                    GroupInfo groupInfo = groupInfoRepository.findById(membership.getGroupId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹 정보를 찾을 수 없습니다."));
                    User owner = userRepository.findById(groupInfo.getOwnerId())
                            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹장의 정보를 찾을 수 없습니다."));
                    return new GroupListResponseDto(groupInfo.getId(), groupInfo.getGroupCode(), owner.getName());
                })
                .collect(Collectors.toList());
    }


}
