package com.backend.kidsnomy.work.service;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import com.backend.kidsnomy.work.dto.WorkCreateRequestDto;
import com.backend.kidsnomy.work.entity.Work;
import com.backend.kidsnomy.work.repository.WorkRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WorkService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final WorkRepository workRepository;

    public WorkService(JwtTokenProvider jwtTokenProvider,
                       UserRepository userRepository,
                       WorkRepository workRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.workRepository = workRepository;
    }

    // 일자리 생성
    @Transactional
    public void createWork(WorkCreateRequestDto dto, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (parent.getIsParent() == null || !parent.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모 사용자만 일자리를 생성할 수 있습니다.");
        }

        Work work = new Work();
        work.setGroupId(dto.getGroupId());
        work.setEmployerId(parent.getId());
        work.setTitle(dto.getTitle());
        work.setContent(dto.getContent());
        work.setSalary(dto.getSalary());
        work.setRewardText(dto.getRewardText());
        work.setIsPermanent(dto.getIsPermanent());
        work.setStartAt(dto.getStartAt());
        work.setEndAt(dto.getEndAt().atTime(23, 59, 59));
        work.setStatus(1); // 1: 계약 전 상태

        workRepository.save(work);
    }

    // 일자리 삭제
    @Transactional
    public void deleteWork(Long jobId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (parent.getIsParent() == null || !parent.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모만 일자리를 삭제할 수 있습니다.");
        }

        Work work = workRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "해당 일자리가 존재하지 않습니다."));

        if (!work.getEmployerId().equals(parent.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 생성한 일자리만 삭제할 수 있습니다.");
        }

        // 🔒 자녀가 계약 중이거나 이후 단계인 경우 삭제 불가
        if (work.getStatus() != null && work.getStatus() >= 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 계약된 일자리는 삭제할 수 없습니다.");
        }

        workRepository.delete(work);
    }

    // 토큰 검증
    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (bearer != null && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
