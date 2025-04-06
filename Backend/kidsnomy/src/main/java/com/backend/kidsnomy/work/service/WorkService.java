package com.backend.kidsnomy.work.service;

import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.entity.User;
import com.backend.kidsnomy.user.repository.UserRepository;
import com.backend.kidsnomy.work.dto.ChildContractedWorkResponseDto;
import com.backend.kidsnomy.work.dto.ChildWorkListResponseDto;
import com.backend.kidsnomy.work.dto.ParentWorkListResponseDto;
import com.backend.kidsnomy.work.dto.WorkCreateRequestDto;
import com.backend.kidsnomy.work.dto.WorkDetailResponseDto;
import com.backend.kidsnomy.work.entity.Work;
import com.backend.kidsnomy.work.repository.WorkRepository;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.basic.entity.BasicAccount;
import com.backend.kidsnomy.basic.repository.AccountRepository;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.group.repository.GroupInfoRepository;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

@Service
public class WorkService {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final WorkRepository workRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final GroupInfoRepository groupInfoRepository;
    
    @Value("${ssafy.api.apiKey}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final AccountRepository accountRepository;
    private final UserKeyService userKeyService;

    public WorkService(JwtTokenProvider jwtTokenProvider,
                       UserRepository userRepository,
                       WorkRepository workRepository,
                       GroupMembershipRepository groupMembershipRepository,
                       GroupInfoRepository groupInfoRepository,
                       RestTemplate restTemplate,
                       AccountRepository accountRepository,
                       UserKeyService userKeyService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.workRepository = workRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.groupInfoRepository = groupInfoRepository;
        this.restTemplate = restTemplate;
        this.accountRepository = accountRepository;
        this.userKeyService = userKeyService;
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
        
        // 그룹 소속 검증
        if (!groupMembershipRepository.existsByUserIdAndGroupId(parent.getId(), dto.getGroupId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
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

 // (부모) 본인이 그룹 내에서 생성한 일자리 조회
    @Transactional(readOnly = true)
    public List<ParentWorkListResponseDto> getParentWorkList(Long groupId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (parent.getIsParent() == null || !parent.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "부모만 조회할 수 있습니다.");
        }

        if (!groupMembershipRepository.existsByUserIdAndGroupId(parent.getId(), groupId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }

        String groupCode = groupInfoRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹이 존재하지 않습니다."))
                .getGroupCode();

        List<Work> works = workRepository.findAllByGroupIdAndEmployerId(groupId, parent.getId());
        return works.stream()
                .map(work -> {
                    User employer = userRepository.findById(work.getEmployerId()).orElse(null);
                    User employee = work.getEmployeeId() != null ? userRepository.findById(work.getEmployeeId()).orElse(null) : null;
                    return ParentWorkListResponseDto.fromEntity(work, groupCode, employer, employee);
                })
                .toList();
    }

    
 // (자녀) 계약 안 된 일자리 전체 조회
    @Transactional(readOnly = true)
    public List<ChildWorkListResponseDto> getUncontractedWorks(Long groupId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User child = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (child.getIsParent() != null && child.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자녀만 이용할 수 있는 기능입니다.");
        }

        if (!groupMembershipRepository.existsByUserIdAndGroupId(child.getId(), groupId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }

        List<Work> works = workRepository.findAllByGroupIdAndEmployeeIdIsNull(groupId);
        return works.stream()
                .map(work -> {
                    User employer = userRepository.findById(work.getEmployerId()).orElse(null);
                    User employee = work.getEmployeeId() != null ? userRepository.findById(work.getEmployeeId()).orElse(null) : null;
                    return ChildWorkListResponseDto.fromEntity(work, employer, employee);
                })
                .toList();
    }

    
    // (자녀) 일자리 계약
    @Transactional
    public void contractWork(Long jobId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User child = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (child.getIsParent() != null && child.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자녀만 일자리를 계약할 수 있습니다.");
        }

        Work work = workRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일자리가 존재하지 않습니다."));

        // 그룹 소속 검증
        if (!groupMembershipRepository.existsByUserIdAndGroupId(child.getId(), work.getGroupId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹의 일자리가 아닙니다.");
        }

        // 이미 계약된 일자리인지 확인
        if (work.getEmployeeId() != null || (work.getStatus() != null && work.getStatus() != 1)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "이미 계약된 일자리입니다.");
        }

        // 계약 처리
        work.setEmployeeId(child.getId());
        work.setStatus(2); // 자녀가 계약한 상태
        workRepository.save(work);
    }
    
 // (자녀) 본인이 계약한 일자리 조회
    @Transactional(readOnly = true)
    public List<ChildContractedWorkResponseDto> getContractedWorkList(Long groupId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User child = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (child.getIsParent() != null && child.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자녀만 조회할 수 있습니다.");
        }

        if (!groupMembershipRepository.existsByUserIdAndGroupId(child.getId(), groupId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 속한 그룹이 아닙니다.");
        }

        String groupCode = groupInfoRepository.findById(groupId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹 정보를 찾을 수 없습니다."))
                .getGroupCode();

        List<Work> works = workRepository.findAllByGroupIdAndEmployeeId(groupId, child.getId());
        return works.stream()
                .map(work -> {
                    User employer = userRepository.findById(work.getEmployerId()).orElse(null);
                    User employee = work.getEmployeeId() != null ? userRepository.findById(work.getEmployeeId()).orElse(null) : null;
                    return ChildContractedWorkResponseDto.fromEntity(work, groupCode, employer, employee);
                })
                .toList();
    }
    
    // 일자리 상세 조회
    @Transactional(readOnly = true)
    public WorkDetailResponseDto getWorkDetail(Long jobId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        // 로그인 사용자만 접근 허용 (자녀든 부모든)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        Work work = workRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일자리를 찾을 수 없습니다."));

        // 고용주도 아니고 고용인도 아니라면 접근 금지
        boolean isEmployer = user.getId().equals(work.getEmployerId());
        boolean isEmployee = work.getEmployeeId() != null && user.getId().equals(work.getEmployeeId());
        boolean isUncontracted = work.getEmployeeId() == null;

        if (!isEmployer && !isEmployee && !isUncontracted) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 일자리에 접근할 권한이 없습니다.");
        }
        
        String groupCode = groupInfoRepository.findById(work.getGroupId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "그룹 정보를 찾을 수 없습니다."))
                .getGroupCode();

        User employer = userRepository.findById(work.getEmployerId()).orElse(null);
        User employee = work.getEmployeeId() != null ? userRepository.findById(work.getEmployeeId()).orElse(null) : null;

        return WorkDetailResponseDto.fromEntity(work, groupCode, employer, employee);
    }
    
    // (자녀) 업무 수행 완료 요청
    @Transactional
    public void requestJobCompletion(Long jobId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User child = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        if (child.getIsParent() != null && child.getIsParent()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "자녀만 완료 요청을 할 수 있습니다.");
        }

        Work work = workRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일자리를 찾을 수 없습니다."));

        if (!child.getId().equals(work.getEmployeeId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "본인이 계약한 일자리가 아닙니다.");
        }

        if (work.getStatus() == null || work.getStatus() != 2) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "진행 중인 일자리만 완료 요청이 가능합니다.");
        }

        work.setStatus(3); // 자녀가 완료 요청
        workRepository.save(work);
    }
    
    // (부모) 업무 완료 승인
 // (부모) 업무 완료 승인
    @Transactional
    public void completeJobByParent(Long jobId, HttpServletRequest request) {
        String token = extractTokenFromRequest(request);
        String email = jwtTokenProvider.getEmailFromToken(token);

        User parent = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."));

        Work work = workRepository.findById(jobId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "일자리를 찾을 수 없습니다."));

        if (!work.getEmployerId().equals(parent.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "해당 일자리를 승인할 권한이 없습니다.");
        }

        if (work.getStatus() == null || work.getStatus() != 3) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "아직 자녀가 완료 요청하지 않았습니다.");
        }

        // 고용주 계좌 조회
        BasicAccount employerAccount = accountRepository.findByUserId(work.getEmployerId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "고용주 계좌가 존재하지 않습니다."));

        // 고용인 계좌 조회
        BasicAccount employeeAccount = accountRepository.findByUserId(work.getEmployeeId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "고용인 계좌가 존재하지 않습니다."));

        // 💰 고용주 잔액이 충분한지 확인
        if (employerAccount.getBalance().compareTo(work.getSalary()) < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "고용주 계좌에 잔액이 부족합니다.");
        }

        // 고용주 userKey
        String employerEmail = parent.getEmail();
        String userKey = userKeyService.getUserKeyByEmail(employerEmail);

        // 외부 API 호출
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer";

        Map<String, Object> header = ApiUtils.createApiRequestHeader("updateDemandDepositAccountTransfer", apiKey, userKey);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("Header", header);
        requestBody.put("depositAccountNo", employeeAccount.getAccountNo());
        requestBody.put("depositTransactionSummary", work.getTitle() + " 업무 완료 : 입금(이체)");
        requestBody.put("transactionBalance", work.getSalary().toPlainString());
        requestBody.put("withdrawalAccountNo", employerAccount.getAccountNo());
        requestBody.put("withdrawalTransactionSummary", work.getTitle() + " 업무 완료 : 출금(이체)");

        HttpEntity<Map<String, Object>> entity = ApiUtils.createHttpEntity(requestBody, userKey);
        restTemplate.postForEntity(apiUrl, entity, String.class);

        // 상태 변경
        work.setStatus(4); // 최종 완료
        workRepository.save(work);
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
