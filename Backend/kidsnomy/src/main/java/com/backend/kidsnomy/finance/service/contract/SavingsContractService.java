package com.backend.kidsnomy.finance.service.contract;

import com.backend.kidsnomy.finance.entity.Savings;
import com.backend.kidsnomy.finance.exception.NoBasicAccountException;
import com.backend.kidsnomy.finance.repository.SavingsRepository;
import com.backend.kidsnomy.basic.exception.AccountCreationException;
import com.backend.kidsnomy.basic.repository.BasicProductRepository;
import com.backend.kidsnomy.basic.repository.BasicAccountRepository;
import com.backend.kidsnomy.common.exception.AuthenticationException;
import com.backend.kidsnomy.common.service.UserKeyService;
import com.backend.kidsnomy.common.util.ApiUtils;
import com.backend.kidsnomy.finance.dto.SavingsContractRequestDto;
import com.backend.kidsnomy.finance.entity.SavingsContract;
import com.backend.kidsnomy.finance.repository.SavingsContractRepository;
import com.backend.kidsnomy.group.entity.GroupMembership;
import com.backend.kidsnomy.group.repository.GroupMembershipRepository;
import com.backend.kidsnomy.jwt.JwtTokenProvider;
import com.backend.kidsnomy.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class SavingsContractService {

    private final BasicProductRepository basicProductRepository;
    private final BasicAccountRepository basicAccountRepository;
    private final SavingsRepository savingsRepository;
    private final SavingsContractRepository savingsContractRepository;
    private final GroupMembershipRepository groupMembershipRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserKeyService userKeyService;

    private final String apiKey;
    private final String baseUrl;

    public SavingsContractService(BasicProductRepository basicProductRepository,
                                  BasicAccountRepository basicAccountRepository,
                                  SavingsRepository savingsRepository,
                                  SavingsContractRepository savingsContractRepository,
                                  GroupMembershipRepository groupMembershipRepository,
                                  UserRepository userRepository,
                                  RestTemplate restTemplate,
                                  JwtTokenProvider jwtTokenProvider,
                                  UserKeyService userKeyService,
                                  @Value("${ssafy.api.apiKey}") String apiKey,
                                  @Value("${ssafy.api.base-url}") String baseUrl) {
        this.basicProductRepository = basicProductRepository;
        this.basicAccountRepository = basicAccountRepository;
        this.savingsRepository = savingsRepository;
        this.savingsContractRepository = savingsContractRepository;
        this.groupMembershipRepository = groupMembershipRepository;
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userKeyService = userKeyService;
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    // 적금 계좌 생성
    @Transactional
    public void createSavingsContract(Long productId,
                                      SavingsContractRequestDto requestDto,
                                      HttpServletRequest request) {

        // JWT 인증 처리
        String token = jwtTokenProvider.resolveAccessToken(request);
        if (token == null || !jwtTokenProvider.validateToken(token)) {
            throw new IllegalArgumentException("유효하지 않은 토큰입니다.");
        }

        // 이메일 → userId 추출
        String email = jwtTokenProvider.getEmailFromToken(token);
        Long userId = userRepository.findByEmail(email)
                .orElseThrow(() -> new AuthenticationException("해당 이메일을 가진 사용자를 찾을 수 없습니다."))
                .getId();

        // 기본 상품(accountTypeUniqueNo) 조회
        String accountTypeUniqueNo = basicProductRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccountCreationException("기본 수시입출금 상품이 존재하지 않습니다."))
                .getAccountTypeUniqueNo();

        // 수시입출금 계좌 조회 → 기본 계좌가 존재해야 상품 만기 시 자동 이체 가능
        if (!basicAccountRepository.existsByUserId(userId)) {
            throw new NoBasicAccountException("수시입출금 계좌가 필요합니다. 먼저 기본 계좌를 생성해주세요.");
        }

        // 사용자의 groupId 조회
        GroupMembership groupMembership = groupMembershipRepository.findByUserId(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("사용자의 그룹 정보를 찾을 수 없습니다."));
        Long groupId = groupMembership.getGroupId();

        // 적금 상품 productId 조회
        Savings savings = savingsRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("적금 상품을 찾을 수 없습니다."));

        // 적금 상품 중복 계약 확인
        if (savingsContractRepository.existsBySavingsIdAndUserId(productId, userId)) {
            throw new IllegalArgumentException("이미 해당 상품에 가입하셨습니다.");
        }

        // 적금 만기일 계산 (주 단위)
        LocalDateTime startDay = LocalDateTime.now();
        LocalDateTime endDay = startDay.plusWeeks(savings.getDueDate());

        // 5. 외부 API 요청 데이터 구성
        String userKey = userKeyService.getUserKeyByEmail(email);
        String apiUrl = baseUrl + "/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";

        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> header = ApiUtils.createApiRequestHeader("createDemandDepositAccount", apiKey, userKey);

        requestBody.put("Header", header);
        requestBody.put("accountTypeUniqueNo", accountTypeUniqueNo);

        try {
            // 6. 외부 API 호출
            HttpEntity<Map<String, Object>> httpEntity = ApiUtils.createHttpEntity(requestBody, userKey);
            Map<String, Object> response = restTemplate.postForObject(apiUrl, httpEntity, Map.class);

            // 7. 응답 처리
            if (response == null || !response.containsKey("REC")) {
                throw new IllegalStateException("계좌 생성 응답에 필요한 정보가 없습니다.");
            }

            Map<String, Object> rec = (Map<String, Object>) response.get("REC");
            String accountNo = Optional.ofNullable((String) rec.get("accountNo"))
                    .orElseThrow(() -> new IllegalStateException("계좌번호 정보가 없습니다."));

            // 8. 계약 정보 저장 (BasicProduct 연결)
            SavingsContract contract = new SavingsContract();
            contract.setGroupId(groupId);
            contract.setUserId(userId);
//            contract.setProductId(savings.getId());
            contract.setStartDay(LocalDateTime.now());
            contract.setEndDay(endDay);
            contract.setAccountNo(accountNo);
            contract.setBalance(BigDecimal.ZERO);
            contract.setOneTimeVolume(requestDto.getOneTimeVolume());
            contract.setRateVolume(BigDecimal.ZERO); // 초기 이자율 0으로 설정
            contract.setStatus(0); // 기본값: 활성 상태
            contract.setSavings(savings);
            contract.setUserId(userId);
            savingsContractRepository.save(contract);

        } catch (HttpClientErrorException e) {
            throw new IllegalStateException("SSAFY API 호출 실패: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            throw new IllegalStateException("계좌 생성 중 오류 발생: " + e.getMessage());
        }
    }
}
